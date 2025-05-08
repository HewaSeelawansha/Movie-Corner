import React from 'react';
import { FaStar } from 'react-icons/fa';

const MovieCard = ({ movie, darkMode, imageBaseUrl, onClick }) => {
  return (
    <div 
      className={`h-full rounded-xl overflow-hidden shadow-lg transition-all duration-300 ${darkMode ? 'bg-gray-700' : 'bg-white'} cursor-pointer`}
      onClick={onClick}
    >
      <div className="relative pb-[150%]">
        <img 
          src={movie.poster_path ? `${imageBaseUrl}${movie.poster_path}` : '/placeholder-movie.png'}
          alt={movie.title}
          className="absolute h-full w-full object-cover"
        />
      </div>
      <div className={`p-4 ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
        <h3 className="font-bold text-lg mb-1 truncate">{movie.title}</h3>
        <div className="flex justify-between items-center">
          <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {new Date(movie.release_date).getFullYear()}
          </span>
          <div className="flex items-center">
            <FaStar className="text-yellow-400 mr-1" />
            <span>{movie.vote_average.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;