import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import getBaseUrl from '../../../utils/baseURL';

const baseQuery = fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/auth`,
    credentials: 'include',
    prepareHeaders: (headers) => {
        const token = localStorage.getItem('token'); // Get token from localStorage
        if (token) {
            headers.set('Authorization', `Bearer ${token}`); // Add Bearer token to headers
        }
        return headers;
    },
});

const usersApi = createApi({
    reducerPath: 'userApi',
    baseQuery,
    tagTypes: ['Users'],
    endpoints: (builder) => ({
        signupUser: builder.mutation({
            query: (newUser) => ({
                url: '/register',
                method: 'POST',
                body: newUser,
            }),
        }),
        loginUser: builder.mutation({
            query: (credentials) => ({
                url: '/login',
                method: 'POST',
                body: credentials,
            }),
        }),
        logoutUser: builder.mutation({
            query: () => ({
                url: '/logout',
                method: 'POST',
            }),
        })
    }),
});

export const {
    useSignupUserMutation,
    useLoginUserMutation,
    useLogoutUserMutation,
    useFetchUserByIdQuery
} = usersApi;

export default usersApi;
