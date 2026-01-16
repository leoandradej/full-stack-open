import { createSlice } from '@reduxjs/toolkit';
import blogService from '../services/blogs';
import loginService from '../services/login';

const loggedUserJSON = window.localStorage.getItem('loggedBlogUser');

const userSlice = createSlice({
  name: 'user',
  initialState: loggedUserJSON ? JSON.parse(loggedUserJSON) : null,
  reducers: {
    setUser: (state, action) => action.payload,
  },
});

export const { setUser } = userSlice.actions;

export const appendUser = (credentials) => {
  return async (dispatch) => {
    const newUser = await loginService.login(credentials);
    window.localStorage.setItem('loggedBlogUser', JSON.stringify(newUser));
    blogService.setToken(newUser.token);
    dispatch(setUser(newUser));
    return newUser;
  };
};

export const deleteUser = () => {
  return async (dispatch) => {
    window.localStorage.removeItem('loggedBlogUser');
    dispatch(setUser(null));
  };
};

export default userSlice.reducer;
