import { createSlice } from '@reduxjs/toolkit';
import Swal from 'sweetalert2';

const initialState = {
    user: (() => {
        try {
            const user = localStorage.getItem('user');
            return user && user !== "undefined" ? JSON.parse(user) : null;
        } catch (error) {
            console.error("Error parsing user data from localStorage:", error);
            return null;
        }
    })(),
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false,
    error: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Action to start loading during async login/logout
        setLoading: (state) => {
            state.loading = true;
        },

        // Action to set user and token after successful login
        setUser: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            state.loading = false;
            localStorage.setItem('user', JSON.stringify(action.payload.user));
            localStorage.setItem('token', action.payload.token);
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Login successful!",
                showConfirmButton: false,
                timer: 1500,
            });
        },

        // Action to remove user and token after logout
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.loading = false;
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Logout successful!",
                showConfirmButton: false,
                timer: 1500,
            });
        },

        // Action to handle authentication errors
        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: state.error || "Something went wrong. Please try again.",
                showConfirmButton: false,
                timer: 1500,
            });
        },

        // Action to clear the authentication error
        clearError: (state) => {
            state.error = null;
        },

        // Action to reset authentication state (optional)
        resetAuthState: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;
        },
    },
});

export const { setUser, logout, setLoading, setError, clearError, resetAuthState } = authSlice.actions;
export default authSlice.reducer;
