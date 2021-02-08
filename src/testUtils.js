import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { render as renderTL } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import { rootReducer } from './store/index';

const history = createBrowserHistory();

export function render(component, initialState) {
  const store = createStore(rootReducer, initialState, applyMiddleware(thunk));

  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <Router history={history}>{children}</Router>
      </Provider>
    );
  }

  return renderTL(component, { wrapper: Wrapper });
}
