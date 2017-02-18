// @flow

import React from 'react';
import Helmet from 'react-helmet';

type AppProps = {
  children: React.Element<any>,
};

const App = ({
  children,
}: AppProps): React.Element<any> => (
  <div>
    <Helmet
      titleTemplate="Drupal Mountain Camp - %s"
      defaultTitle="Drupal Mountain Camp"
    />
    {children}
  </div>
);

export default App;
