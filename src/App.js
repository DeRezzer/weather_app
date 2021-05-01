/** @jsxImportSource @emotion/react */
import React from 'react';
import {useLocation} from 'react-router-dom';
import queryString from 'query-string';
import { css } from '@emotion/react';
import FetchForcast from './weather';

const styles = css `
    background-color: lightblue;
`;

function useQueryString() {
  return queryString.parse(useLocation().search);
}

function App() {
  return (
    <div css={styles}>
      <FetchForcast query={useQueryString().q}/>
    </div>
  );
}

export default App;
