import { createSlice } from '@reduxjs/toolkit';
import anecdoteService from '../services/anecdotes';

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    createAnecdote(state, action) {
      state.push(action.payload);
    },
    incrementVotes(state, action) {
      const id = action.payload.id;
      return state.map((anecdote) =>
        anecdote.id !== id ? anecdote : action.payload
      );
    },
    setAnecdotes(state, action) {
      return action.payload;
    },
  },
});

const { setAnecdotes, createAnecdote, incrementVotes } = anecdoteSlice.actions;

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll();
    dispatch(setAnecdotes(anecdotes));
  };
};

export const appendAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.createAnecdote(content);
    dispatch(createAnecdote(newAnecdote));
  };
};

export const incrementVote = (id) => {
  return async (dispatch) => {
    const changedAnecdote = await anecdoteService.incrementVote(id);
    dispatch(incrementVotes(changedAnecdote));
  };
};

export default anecdoteSlice.reducer;
