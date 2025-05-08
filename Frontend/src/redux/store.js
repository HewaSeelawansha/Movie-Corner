import { configureStore } from '@reduxjs/toolkit';
import authSlice from './features/auth/authSlice'; 
import usersApi from './features/users/usersApi';
import moviesApi from './features/movies/moviesApi';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    [moviesApi.reducerPath]: moviesApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(
        moviesApi.middleware, 
        usersApi.middleware,
      ),
});

export default store;
