import React from 'react';
import gql from 'graphql-tag';

/* eslint-disable react/no-danger */

const BasicPage = ({
  title,
  body = '',
}) => (
  <div>
    <h1>{title}</h1>
    <div dangerouslySetInnerHTML={{ __html: body }} />
  </div>
);

BasicPage.fragments = {
  basicPage: gql`
    fragment BasicPageFragment on BasicPage {
      title:entityLabel
      body
    }
  `,
};

export default BasicPage;
