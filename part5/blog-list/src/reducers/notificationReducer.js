import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notification',
  initialState: { message: null, status: '' },
  reducers: {
    setMessage: (state, action) => {
      state.message = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    reset: (state) => {
      state.message = null;
      state.status = '';
    },
  },
});

export const { setMessage, setStatus, reset } = notificationSlice.actions;

let timeoutId;

export const showNotification = (message, status, timeInSeconds) => {
  return (dispatch) => {
    clearTimeout(timeoutId);

    dispatch(setMessage(message));
    dispatch(setStatus(status));

    timeoutId = setTimeout(() => {
      dispatch(reset());
    }, timeInSeconds * 1000);
  };
};

export default notificationSlice.reducer;
