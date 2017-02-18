import React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import Article from 'Article';
import BasicPage from 'BasicPage';
import NotFound from 'NotFound';

const Router = ({
  object,
  loading,
}) => {
  if (loading) {
    return null;
  }

  switch (object && object.__typename) { // eslint-disable-line no-underscore-dangle
    case 'Article':
      return <Article {...object} />;

    case 'BasicPage':
      return <BasicPage {...object} />;

    default:
      return <NotFound />;
  }
};

const query = gql`
  query routeQuery($path: String!) {
    routeByPath(path: $path) {
      object {
        ...ArticleFragment
        ...BasicPageFragment
      }
    }
  }

  ${Article.fragments.article}
  ${BasicPage.fragments.basicPage}
`;

const withQuery = graphql(query, {
  options: (props) => ({
    variables: {
      // Default to '' when no path suffix was given.
      path: props.params.splat || '',
    },
  }),
  props: ({
    data: {
      routeByPath,
      loading,
    },
  }) => ({
    object: routeByPath && routeByPath.object,
    loading,
  }),
});

export default withQuery(Router);
