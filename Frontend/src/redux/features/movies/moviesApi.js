import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_KEY = '160c0680490fb8b7e24c608a5a40fc38';
const BASE_URL = 'https://api.themoviedb.org/3';

export const moviesApi = createApi({
  reducerPath: 'moviesApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (builder) => ({
    getTrendingMovies: builder.query({
      query: () => `/trending/movie/week?api_key=${API_KEY}`,
      transformResponse: (response) => response.results,
    }),
    searchMovies: builder.query({
      query: (query) => `/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`,
      transformResponse: (response) => response.results,
    }),
    getMovieDetails: builder.query({
      query: (movieId) => `/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits,videos`,
    }),
    getGenres: builder.query({
      query: () => `/genre/movie/list?api_key=${API_KEY}`,
      transformResponse: (response) => response.genres,
    }),
  }),
});

export const {
  useGetTrendingMoviesQuery,
  useLazyGetTrendingMoviesQuery,
  useSearchMoviesQuery,
  useLazySearchMoviesQuery,
  useGetMovieDetailsQuery,
  useLazyGetMovieDetailsQuery,
  useGetGenresQuery,
} = moviesApi;

export default moviesApi;