import { createSlice } from '@reduxjs/toolkit';
import usersService from '../services/users';

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setUsers: (state, action) => {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { setLoading, setError, setUsers } = usersSlice.actions;

export const fetchUsers = () => {
  return async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const users = await usersService.getAll();
      dispatch(setUsers(users));
    } catch (error) {
      dispatch(
        setError(error.response?.data?.error || 'Failed to fetch users')
      );
      console.error('Failed fetching users', error);
    }
  };
};

export default usersSlice.reducer;
