import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '../../app/store';
import axios from 'axios';

interface Track {
  trackId: number;
  kind: string;
  artistName: string;
  trackName: string; 
}

interface SearchSlice {
  searchResults?: Track[];
}

const initialState: SearchSlice = { };

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
     successFetchTracks: (state, action: PayloadAction<any[]>) => {
      state.searchResults = action.payload;
    },
    errorFetchTracks: (state, action: PayloadAction<number>) => {
       console.log('error');
    },

  },
});

export const { successFetchTracks, errorFetchTracks} = searchSlice.actions;

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
export const fetchTracks = (searchValue: string): AppThunk => dispatch => {
  axios.get(`http://itunes.apple.com/search?term=${searchValue}`)
    .then((response) => {
      dispatch(successFetchTracks(response.data.results));
    })
    .catch(() => dispatch(errorFetchTracks))
};


// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectResults = (state: RootState) => state.search.searchResults;

export default searchSlice.reducer;
