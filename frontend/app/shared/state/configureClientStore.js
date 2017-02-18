// @flow

import configureStore from 'state/configureStore';

export default (
  apolloClient: any,
  history: Object = {},
): AmazeeStore<any, any> => {
  const initialState: Object = global.__INITIAL_STATE__; // eslint-disable-line no-underscore-dangle

  return configureStore(
    apolloClient,
    history,
    initialState,
  );
};
