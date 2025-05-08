import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useLoginUserMutation } from '../redux/features/users/usersApi';
import { useDispatch } from 'react-redux';
import { setUser, setLoading } from '../redux/features/auth/authSlice'; // Including setError and clearError
import { handleError, handleSuccess } from '../utils/authSwal';

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loginUser] = useLoginUserMutation();

    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        try {
            
            dispatch(setLoading());
            const response = await loginUser(data).unwrap(); 
            if (response.token) {
                localStorage.setItem('token', response.token); 
                dispatch(setUser({ user: response.user, token: response.token, email: response.email })); 
                handleSuccess('Login successful!');
                setTimeout(() => navigate('/'), 500);
            } else {
                const fullErrorMessage = response.message || JSON.stringify(response, null, 2);
                handleError(fullErrorMessage);
            }
        } catch (error) {
            const errorDetails = error?.data?.errors || [{ message: error.data?.message || "Signup failed!" }];
            errorDetails.forEach((err) => handleError(err.message));
        } 
    };

    return (
        <div className='h-[calc(100vh-120px)] flex items-center justify-center'>
            <div className="w-full max-w-sm mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h2 className='text-xl font-semibold mb-4'>Please Login</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                        <input
                            {...register('email', { required: 'Email is required' })}
                            className="shadow appearance-none border rounded w-full py-2 px-3"
                            type="email"
                            placeholder="Email Address"
                        />
                        {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                        <input
                            {...register('password', { required: 'Password is required' })}
                            className="shadow appearance-none border rounded w-full py-2 px-3"
                            type="password"
                            placeholder="Password"
                        />
                        {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
                    </div>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        type="submit"
                    >
                        Login
                    </button>
                </form>
                <p className="inline-block align-baseline mt-4 text-sm">
                    Don't have an account?{' '}
                    <Link to="/signup" className='text-blue-500'>Register</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
