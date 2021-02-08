import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from 'react-redux';
import axios from 'axios';

import {store} from '../../app/store';
import { Search } from "./Search";

jest.mock('axios');

global.IntersectionObserver = class IntersectionObserver {

  constructor(private func, private options) {}

  observe(element: HTMLElement) {
    this.func([{isIntersecting: true, target: element}]);
  }

  disconnect() {
    return null;
  };

  unobserve() {
    return null;
  }
};

it("renders initla search form", () => {
  const { getByText, getByPlaceholderText, queryByText } = render(
    <Provider store={store}>
      <Search />
    </Provider>
  );
  expect(getByPlaceholderText(/search for an artist, album or song/i)).toBeInTheDocument();
  expect(getByText(/search/i)).toBeInTheDocument();
  expect(queryByText(/kind/i)).toBeNull();
  expect(queryByText(/no results/i)).toBeNull();
});

it("button is enabled when typing text", () => {
  const { getByText, getByPlaceholderText } = render(
    <Provider store={store}>
      <Search />
    </Provider>
  );
  expect(getByText(/search/i).closest('button')).toBeDisabled();
  const input = getByPlaceholderText(/search for an artist, album or song/i);
    fireEvent.change(input, { target: { value: 'michael jackson' } });
  expect(getByText(/search/i).closest('button')).not.toBeDisabled();

});

it('display results table', async () => {
    axios.get.mockImplementation(() =>
      Promise.resolve({
        data: {
           "resultCount":50,
           "results": [
              {
                trackId:1440912105, 
                kind:"song", 
                artistName:"Jackson 5", 
                trackName:"I Want You Back", 
              }
           ]
        }
      })
    );
    const { debug, queryByText, getByText, getByPlaceholderText } = render(
      <Provider store={store}>
        <Search />
      </Provider>
    );

    expect(queryByText(/kind/i)).toBeNull();
    const input = getByPlaceholderText(/search for an artist, album or song/i);
    fireEvent.change(input, { target: { value: 'michael jackson' } });

    const searchButton = getByText(/search/i).closest('button');
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(getByText(/kind/i)).toBeInTheDocument();
    })

  });

 it('display no results message', async () => {
    axios.get.mockImplementation(() =>
      Promise.resolve({
        data: {
           "resultCount":50,
           "results": [ ]
        }
      })
    );
    const { debug, queryByText, getByText, getByPlaceholderText } = render(
      <Provider store={store}>
        <Search />
      </Provider>
    );

    const input = getByPlaceholderText(/search for an artist, album or song/i);
    fireEvent.change(input, { target: { value: 'michael jackson' } });

    const searchButton = getByText(/search/i).closest('button');
    fireEvent.click(searchButton);

    debug()

    await waitFor(() => {
      expect(getByText(/no results/i)).toBeInTheDocument();
    })

  });




