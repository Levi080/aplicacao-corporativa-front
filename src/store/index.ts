import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/slice/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer, // Conectando o reducer de login
  },
});

// Tipos necessários para o TypeScript não reclamar nas telas
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;