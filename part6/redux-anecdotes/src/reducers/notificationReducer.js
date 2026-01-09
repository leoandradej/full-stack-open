import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    setNotification(state, action) {
      return action.payload;
    },
    clearNotification(state, action) {
      return null;
    },
  },
});

const { setNotification, clearNotification } = notificationSlice.actions;

let timeoutId;

export const showNotification = (message, timeInSeconds) => {
  return (dispatch) => {
    clearTimeout(timeoutId);

    dispatch(setNotification(message));

    timeoutId = setTimeout(() => {
      dispatch(clearNotification());
    }, timeInSeconds * 1000);
  };
};

export default notificationSlice.reducer;
