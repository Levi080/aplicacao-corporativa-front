import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/slice/authSlice';
import peopleReducer from '../features/rh/slice/peopleSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer, 
    people: peopleReducer,
  },
});

// Tipos necessários para o TypeScript não reclamar nas telas
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;