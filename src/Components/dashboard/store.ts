import { configureStore } from '@reduxjs/toolkit';
import enrollmentsReducer from './enrollmentsSlice';

export const store = configureStore({
  reducer: {
    enrollments: enrollmentsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;