Movie Corner - Full Stack Movie Application

Developer Note :- In the development setup, make sure to uncomment the protected routes wrapped around <App />. These were temporarily unwrapped due to deployment issues with the backend server hosted on Vercel. The issue still occurs occasionally, although the backend sometimes works as expected.



Overview

Movie Corner is a full-stack web application that allows users to browse, search, and discover movies. The application features:

Frontend: React with Vite, Redux for state management, and Tailwind CSS for styling
Backend: Node.js/Express with MongoDB for user authentication
Movie Data: Integration with The Movie Database (TMDB) API

Key Features

Movie Browsing:
View trending movies
Search movies by title
Filter movies by genre
Sort movies by popularity, rating, release date, etc.

Movie Details:

Comprehensive movie information
Cast details
Embedded trailers
Ratings and runtime

User Authentication:

User registration and login
Protected routes
JWT-based authentication

UI/UX:

Dark/light mode toggle
Responsive design
Animated transitions
Pagination for movie listings
Modal for detailed movie views

Project Setup

Backend Setup

Create a .env file in the backend root with the following variables:

.env
PORT='5000'
MONGO_URI='your_mongodb_connection_string'
JWT_SECRET='your_jwt_secret_key'

Install dependencies:

cd backend
npm install

Start the backend server:

npm start

Frontend Setup

Create a .env file in the backend root with the following variables:

.env
VITE_TMDB_API_KEY = TMDB API Key

Install dependencies:

cd frontend
npm install

Start the development server:

npm run dev

API Usage

The application uses two main APIs:

TMDB API (for movie data):
All movie data comes from The Movie Database API
API key is already configured in the moviesApi slice

Custom Backend API (for user authentication):

Handles user registration, login, and logout
Uses JWT for authentication

Endpoints:

POST /auth/register - User registration
POST /auth/login - User login
POST /auth/logout - User logout

Technical Implementation Details

Frontend Architecture

State Management:

Redux Toolkit for global state
RTK Query for API data fetching and caching
Separate slices for authentication and movie data

Routing:

React Router for navigation
Private routes for protected content
Public routes for login/registration

UI Components:

Reusable MovieCard component
Responsive layout with Tailwind CSS
Framer Motion for animations

Backend Architecture

Authentication:

JWT-based authentication
Protected routes with middleware
Password hashing with bcrypt

Database:

MongoDB for user data storage
Mongoose for schema definition and validation
