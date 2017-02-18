// @flow

import configureStore from 'state/configureStore';

export default (
  apolloClient: any,
  history: Object = {},
  // req: Object = {},
): AmazeeStore<any, any> => {
  const initialState: Object = {};

  return configureStore(
    apolloClient,
    history,
    initialState,
  );
};
