import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { useSignupUserMutation } from '../redux/features/users/usersApi'; // Import the mutation
import { handleError, handleSuccess } from '../utils/authSwal'; // Import the success and error handlers

const Signup = () => {
  const navigate = useNavigate();
  const [signupUser] = useSignupUserMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
        const userData = { 
            name: data.name, 
            email: data.email, 
            password: data.password, 
        };

        const signupResponse = await signupUser(userData).unwrap();
        if (signupResponse.success) {
            handleSuccess('Registration successful! Redirecting...');
            setTimeout(() => navigate('/login'), 1000);
        } else {
            handleError(signupResponse.message || 'Signup failed.');
        }
    } catch (error) {
        console.error('Error during signup:', error);
        const errorDetails = error?.data?.errors || [{ message: error.data?.message || 'Signup failed!' }];
        errorDetails.forEach((err) => handleError(err.message));
    }
};
  return (
    <div className='h-[calc(100vh-120px)] flex items-center justify-center'>
      <div className="w-full max-w-sm mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className='text-xl font-semibold mb-4'>Please Register</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Name
            </label>
            <input
              {...register("name", { required: true })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              placeholder="Enter Name"
            />
            {errors.name && <p className="text-red-500 text-xs italic">Name is required.</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              {...register("email", { required: true })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="Email Address"
            />
            {errors.email && <p className="text-red-500 text-xs italic">Email is required.</p>}
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              {...register("password", { required: true })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="Password"
            />
            {errors.password && <p className="text-red-500 text-xs italic">Password is required.</p>}
          </div>
          <div className="mb-4">
            {errors.bio && <p className="text-red-500 text-xs italic">Email is required.</p>}
          </div>
          <div className="flex flex-wrap space-y-2.5 items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Signup
            </button>
          </div>
        </form>
        <p className="inline-block align-baseline font-medium mt-4 text-sm">
          Have an account? Please
          <Link to="/login" className='text-blue-500 hover:text-blue-800'> Login</Link>
        </p>
        <p className="mt-5 text-center text-gray-500 text-xs">
          &copy;2025 Book Store. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Signup;
