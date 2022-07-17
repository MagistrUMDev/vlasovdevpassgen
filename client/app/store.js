import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice'
import passwordsReducer from '../features/passwords/passwordSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    passwords: passwordsReducer 
  },
});
