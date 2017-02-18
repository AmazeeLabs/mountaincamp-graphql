// @flow

import React from 'react';
import { match, createMemoryHistory, RouterContext } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { rewind as helmetRewind } from 'react-helmet';
import { ApolloProvider, renderToStringWithData } from 'react-apollo/lib';
import configureApolloClient from 'state/configureApolloClient';
import selectLocationState from 'state/selectors/locationState';
import configureServerStore from 'state/configureServerStore';
import createRoutes from 'routing/createRoutes';

/**
 * Export render function to be used in server/config/routes.js
 * We grab the state passed in from the server and the req object from Express/Koa
 * and pass it into the Router.run function.
 */
export default (
  req: Object,
  res: Object,
  next: Function,
): void => {
  // Configure the apollo client with persisted queries.
  const apolloClient: any = configureApolloClient();

  // Set the current path (req.path) as initial history entry due to this bug:
  // https://github.com/reactjs/react-router-redux/issues/284#issuecomment-184979791
  const memoryHistory: any = createMemoryHistory(req.path);
  const store: AmazeeStore<any, any> = configureServerStore(apolloClient, memoryHistory, req);
  const routes: any = createRoutes(store);

  // Sync history and store, as the react-router-redux reducer is under the
  // non-default key ("routing"), selectLocationState must be provided for
  // resolving how to retrieve the "route" in the state
  syncHistoryWithStore(memoryHistory, store, { selectLocationState });

  /*
   * From the react-router docs:
   *
   * This function is to be used for server-side rendering. It matches a set of routes to
   * a location, without rendering, and calls a callback(error, redirectLocation, renderProps)
   * when it's done.
   *
   * The function will create a `history` for you, passing additional `options` to create it.
   * These options can include `basename` to control the base name for URLs, as well as the pair
   * of `parseQueryString` and `stringifyQuery` to control query string parsing and serializing.
   * You can also pass in an already instantiated `history` object, which can be constructured
   * however you like.
   *
   * The three arguments to the callback function you pass to `match` are:
   * - error: A javascript Error object if an error occured, `undefined`
   *   otherwise.
   * - redirectLocation: A `Location` object if the route is a redirect,
   *  `undefined` otherwise
   * - renderProps: The props you should pass to the routing context if the
   *   route matched, `undefined` otherwise.
   *
   * If all three parameters are `undefined`, this means that there was no route
   * found matching the given location.
   */
  match({
    routes,
    location: req.originalUrl,
  }, (error: any, redirectLocation: Object, renderProps: Object): void => {
    if (error) {
      next(error);
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    } else if (renderProps) {
      const Root: React.Element<any> = (
        <ApolloProvider store={store} client={apolloClient}>
          <RouterContext {...renderProps} />
        </ApolloProvider>
      );

      renderToStringWithData(Root).then((content) => {
        // The order in which the html head elements should be rendered.
        const headOrder: Array<string> = ['title', 'base', 'meta', 'link', 'script', 'style'];

        // Render the html as a string and collect side-effects afterwards.
        const helmetOutput: Object = helmetRewind();
        const initialState: string = JSON.stringify(store.getState());
        const htmlAttributes: string = helmetOutput.htmlAttributes.toString();
        const htmlHead: string = headOrder
          .map((key: string): string => helmetOutput[key].toString().trim())
          .join('');

        res.render('template', {
          initialState,
          renderedContent: content,
          htmlHead,
          htmlAttributes,
        });

        res.end();
      });
    } else {
      res.status(404).send('Page not found');
    }
  });
};
