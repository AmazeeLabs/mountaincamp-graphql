// @flow

import { ApolloClient, createNetworkInterface, createBatchingNetworkInterface } from 'apollo-client';
import { printRequest as doPrintRequest } from 'apollo-client/transport/networkInterface';
import { QueryBatcher } from 'apollo-client/transport/batching';
import { getQueryDocumentKey } from 'persistgraphql/lib/src/common';
import queryMap from 'queries.json';

// @TODO Remove this again.
//
// We need to override the consumeQueue method on the QueryBatcher
// prototype until https://github.com/apollographql/apollo-client/pull/1302
// is merged.
QueryBatcher.prototype.consumeQueue = function consumeQueueOverride() {
  if (this.queuedRequests.length < 1) {
    return undefined;
  }

  const requests = this.queuedRequests.map(
    (queuedRequest) => queuedRequest.request,
  );

  const promises = [];
  const resolvers = [];
  const rejecters = [];
  this.queuedRequests.forEach((fetchRequest) => {
    promises.push(fetchRequest.promise);
    resolvers.push(fetchRequest.resolve);
    rejecters.push(fetchRequest.reject);
  });

  this.queuedRequests = [];
  const batchedPromise = this.batchFetchFunction(requests);

  batchedPromise.then((results) => {
    results.forEach((result, index) => {
      resolvers[index](result);
    });
  }).catch((error) => {
    rejecters.forEach((rejecter, index) => {
      rejecters[index](error);
    });
  });

  return promises;
};

const printRequest = (request) => {
  if (!Object.hasOwnProperty.call(request, 'query')) {
    return request;
  }

  const printedRequest = doPrintRequest(request);
  return {
    ...printedRequest,
    query: printedRequest.query.replace(/\s{2,}/g, ' '),
  };
};

const addGetRequests = (networkInterface) => {
  function fetchOverride({
    request,
    options,
  }) {
    const uri = this._uri; // eslint-disable-line no-underscore-dangle
    const ownOptions = this._opts; // eslint-disable-line no-underscore-dangle

    // Combine all requests into an array and turn them into a GET query.
    const delimiter = uri.indexOf('?') === -1 ? '?' : '&';
    const printedRequest = printRequest(request);
    const query = Object
      .keys(printedRequest)
      .reduce((carry, current) => ([
        ...carry,
        [`${current}=${JSON.stringify(printedRequest[current])}`],
      ]), []).join('&');

    return global.fetch(`${uri}${delimiter}${query}`, {
      ...ownOptions,
      ...options,
      headers: {
        Accept: '*/*',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
  }

  function batchedFetchOverride(requestsAndOptions) {
    const uri = this._uri; // eslint-disable-line no-underscore-dangle
    const ownOptions = this._opts; // eslint-disable-line no-underscore-dangle

    // Combine all of the requests options into a single object.
    const options = requestsAndOptions.reduce((carry, current) => ({
      ...carry,
      ...current.options,
    }), {});

    // Combine all requests into an array and turn them into a GET query.
    const delimiter = uri.indexOf('?') === -1 ? '?' : '&';
    const requests = requestsAndOptions.map(({ request }) => request);
    const query = requests
      .map(printRequest)
      .reduce((carry, current, index) => ([
        ...carry,
        [`${index}=${JSON.stringify(current)}`],
      ]), []).join('&');

    return global.fetch(`${uri}${delimiter}${query}`, {
      ...ownOptions,
      ...options,
      headers: {
        Accept: '*/*',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
  }

  return Object.assign(networkInterface, {
    fetchFromRemoteEndpoint: fetchOverride.bind(networkInterface),
    batchedFetchFromRemoteEndpoint: batchedFetchOverride.bind(networkInterface),
  });
};

const addPersistedQueries = (networkInterface) => {
  const doQuery = networkInterface.query.bind(networkInterface);

  function queryOverride(request) {
    const queryDocument = request.query;
    const queryKey = getQueryDocumentKey(queryDocument);

    if (!queryMap[queryKey]) {
      // @TODO There is currently an error in the way that fragments are sorted.
      // We need to remove this again once https://github.com/apollographql/persistgraphql/issues/13
      // is resolved.
      //
      // return Promise.reject(new Error('Could not find query inside query map.'));

      return doQuery(request);
    }

    const serverRequest = {
      id: queryMap[queryKey],
      variables: request.variables,
      operationName: request.operationName,
    };

    return doQuery(serverRequest);
  }

  return Object.assign(networkInterface, {
    query: queryOverride.bind(networkInterface),
  });
};

const configureApolloClient = () => {
  const isProduction = process.env.NODE_ENV === 'production';

  // Use xdebug in development.
  const requestUri = isProduction ?
    process.env.API :
    `${process.env.API}?XDEBUG_SESSION_START=PHPSTORM`;

  // Use batched queries in production.
  const networkInterface = isProduction ?
    createBatchingNetworkInterface({
      uri: requestUri,
      batchInterval: 10,
    }) :
    createNetworkInterface({
      uri: requestUri,
    });

  // Use persisted queries and GET requests in production.
  const finalNetworkInterface = isProduction ?
    addGetRequests(addPersistedQueries(networkInterface)) :
    networkInterface;

  const apolloClient = new ApolloClient({
    networkInterface: finalNetworkInterface,
    reduxRootSelector: (state) => state.apollo,
    initialState: global.__INITIAL_STATE__, // eslint-disable-line no-underscore-dangle
    ssrMode: isProduction && !process.env.SSR_DISABLED,
  });

  return apolloClient;
};

export default configureApolloClient;
