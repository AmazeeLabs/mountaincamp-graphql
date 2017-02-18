import React from 'react';
import gql from 'graphql-tag';

/* eslint-disable react/no-danger */

const Article = ({
  title,
  body = '',
}) => (
  <div>
    <h1>{title}</h1>
    <div dangerouslySetInnerHTML={{ __html: body }} />
  </div>
);

Article.fragments = {
  article: gql`
    fragment ArticleFragment on Article {
      title:entityLabel
    }
  `,
};

export default Article;
