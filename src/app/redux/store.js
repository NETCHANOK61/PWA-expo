// redux/store.js
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';

const initialState = {
  count: 0,
};

const counterReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + 1 };
    case 'decrement':
      return { ...state, count: state.count - 1 };
    default:
      return state;
  }
};

const isDev = process.env.NODE_ENV === 'development';

const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
  middleware: getDefaultMiddleware({
    immutableCheck: false,     // ปิดทั้งสองตัวนี้
    serializableCheck: false,
  }),
});

export default store;
