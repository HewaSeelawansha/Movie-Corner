import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MovieCard from '../../src/components/MovieCard';
import { FaFilter, FaSearch, FaTimes, FaChevronDown, FaChevronUp, FaMoon, FaSun } from 'react-icons/fa';
import { HiOutlineUser } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';
import { logout } from "../redux/features/auth/authSlice";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutUserMutation } from "../redux/features/users/usersApi";
import {
  useLazyGetTrendingMoviesQuery,
  useLazySearchMoviesQuery,
  useLazyGetMovieDetailsQuery,
  useGetGenresQuery,
} from '../redux/features/movies/moviesApi';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const BrowseMovies = () => {
  const { user } = useSelector((state) => state.auth);
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [sortOptions, setSortOptions] = useState('popularity.desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [fetchMovieDetails, { data: movieDetails }] = useLazyGetMovieDetailsQuery();
  
  const { data: genres = [] } = useGetGenresQuery();
  const [fetchTrendingMovies, { isLoading: isTrendingLoading, error: trendingError, data: trendingData }] = 
    useLazyGetTrendingMoviesQuery();
  const [searchMovies, { isLoading: isSearchLoading, error: searchError, data: searchData }] = 
    useLazySearchMoviesQuery();
  const [logoutUser] = useLogoutUserMutation();
  const dispatch = useDispatch();

  const isLoading = isTrendingLoading || isSearchLoading;
  const error = trendingError?.message || searchError?.message;

  useEffect(() => {
    if (movieDetails) {
      setSelectedMovie(movieDetails);
    }
  }, [movieDetails]);

  // Toggle dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Set movies when data changes
  useEffect(() => {
    if (trendingData) {
      setMovies(trendingData);
      setFilteredMovies(trendingData);
    }
  }, [trendingData]);

  useEffect(() => {
    if (searchData) {
      setMovies(searchData);
      setFilteredMovies(searchData);
      setCurrentPage(1);
    }
  }, [searchData]);

  // Initial load
  useEffect(() => {
    fetchTrendingMovies();
  }, [fetchTrendingMovies]);

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    if (query.length > 2) {
      searchMovies(query);
    } else if (query.length === 0) {
      fetchTrendingMovies();
    }
  };

  const filterMovies = (genreId) => {
    if (genreId === "all") {
      setFilteredMovies(movies);
    } else {
      const filtered = movies.filter(movie => 
        movie.genre_ids.includes(Number(genreId))
      );
      setFilteredMovies(filtered);
    }
    setSelectedGenre(genreId);
    setCurrentPage(1);
  };

  const showAll = () => {
    fetchTrendingMovies();
    setSelectedGenre("all");
    setCurrentPage(1);
    setSearchQuery('');
  };

  const handleSortChange = (option) => {
    setSortOptions(option);
    let sortedMovies = [...filteredMovies];
    
    switch(option) {
      case "popularity.desc":
        sortedMovies.sort((a, b) => b.popularity - a.popularity);
        break;
      case "popularity.asc":
        sortedMovies.sort((a, b) => a.popularity - b.popularity);
        break;
      case "vote_average.desc":
        sortedMovies.sort((a, b) => b.vote_average - a.vote_average);
        break;
      case "vote_average.asc":
        sortedMovies.sort((a, b) => a.vote_average - b.vote_average);
        break;
      case "release_date.desc":
        sortedMovies.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
        break;
      case "release_date.asc":
        sortedMovies.sort((a, b) => new Date(a.release_date) - new Date(b.release_date));
        break;
      case "title.asc":
        sortedMovies.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "title.desc":
        sortedMovies.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        break;
    }
    
    setFilteredMovies(sortedMovies);
    setCurrentPage(1);
  };

  const handleLogOut = async () => {
    try {
      await logoutUser().unwrap();
      dispatch(logout());
      localStorage.removeItem("token");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredMovies.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleMovieClick = (movieId) => {
    fetchMovieDetails(movieId);
  };

  return (
    <div className={`min-h-screen pb-4 ${isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header with Login and Dark Mode Toggle */}
      <header className={`sticky top-0 z-50 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-green-600">Movie Corner</h1>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-700'}`}
            >
              {isDarkMode ? <FaSun /> : <FaMoon />}
            </button>
            
            <div className="relative flex items-center md:space-x-3 space-x-2">
              <div>
                {user ? (
                  <label
                    className={`${isDarkMode ? 'text-white' : 'text-gray-800'} text-sm font-semibold sm:ml-1 p-1 sm:px-6 px-2 flex items-center rounded-md`}
                  >
                    Hello! {user.name}
                  </label>
                ) : (
                  <Link to="/login" className="bg-white gap-1 text-sm font-semibold sm:ml-1 p-1 sm:px-6 px-2 flex items-center rounded-md">
                    <HiOutlineUser/> 
                    Login
                  </Link>
                )}
              </div>
              {user && (
                <button
                  onClick={handleLogOut}
                  className={`${isDarkMode ? 'bg-gray-700 text-rose-400' : 'bg-gray-200 text-rose-600'} gap-1 text-sm font-semibold sm:ml-1 p-1 sm:px-6 px-2 flex items-center rounded-md hover:bg-gray-100`}
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className={`relative bg-gradient-to-r ${isDarkMode ? 'from-gray-800 to-gray-900' : 'from-green-50 to-gray-50'} pb-24 pt-16`}>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              Discover <span className="text-green-600">Amazing</span> Movies
            </motion.h1>
            <p className="text-lg md:text-xl mb-8">
              Explore trending movies, search your favorites, and find your next watch
            </p>
            
            {/* Search Bar */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative max-w-2xl mx-auto"
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for movies..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className={`w-full px-6 py-4 pr-12 rounded-full border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'} focus:border-green-400 focus:ring-2 focus:ring-green-100 shadow-sm transition-all duration-300`}
                />
                <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-600 transition-colors">
                  <FaSearch className="text-xl" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 -mt-16 relative z-20">
        {/* Filters & Sorting */}
        <div className={`rounded-xl shadow-lg p-6 mb-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Mobile Filters Toggle */}
            <button 
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className={`md:hidden flex items-center justify-between w-full px-4 py-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
            >
              <span className="font-medium">Filters</span>
              {isFiltersOpen ? <FaChevronUp /> : <FaChevronDown />}
            </button>

            {/* Genre Filters - Desktop */}
            <div className="hidden md:flex items-center flex-wrap gap-2">
              <button
                onClick={() => filterMovies("all")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedGenre === "all"
                    ? 'bg-green-600 text-white'
                    : isDarkMode 
                      ? 'bg-gray-700 text-white hover:bg-gray-600' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Genres
              </button>
              {genres.map((genre) => (
                <button
                  key={genre.id}
                  onClick={() => filterMovies(genre.id.toString())}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedGenre === genre.id.toString()
                      ? 'bg-green-600 text-white'
                      : isDarkMode 
                        ? 'bg-gray-700 text-white hover:bg-gray-600' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {genre.name}
                </button>
              ))}
            </div>

            {/* Sorting */}
            <div className="flex items-center gap-3">
              <div className={`flex border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} items-center rounded-lg overflow-hidden ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <div className={`px-3 py-3 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                  <FaFilter className={isDarkMode ? 'text-gray-300' : 'text-gray-700'} />
                </div>
                <select
                  name="sort"
                  id="sort"
                  onChange={(e) => handleSortChange(e.target.value)}
                  value={sortOptions}
                  className={`px-3 py-2 text-sm font-medium focus:outline-none ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white'}`}
                >
                  <option value="popularity.desc">Popularity (High to Low)</option>
                  <option value="popularity.asc">Popularity (Low to High)</option>
                  <option value="vote_average.desc">Rating (High to Low)</option>
                  <option value="vote_average.asc">Rating (Low to High)</option>
                  <option value="release_date.desc">Release Date (Newest)</option>
                  <option value="release_date.asc">Release Date (Oldest)</option>
                  <option value="title.asc">Title (A-Z)</option>
                  <option value="title.desc">Title (Z-A)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Mobile Filters Dropdown */}
          <AnimatePresence>
            {isFiltersOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="md:hidden overflow-hidden"
              >
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <button
                    onClick={() => {
                      filterMovies("all");
                      setIsFiltersOpen(false);
                    }}
                    className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedGenre === "all"
                        ? 'bg-green-600 text-white'
                        : isDarkMode 
                          ? 'bg-gray-700 text-white hover:bg-gray-600' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All Genres
                  </button>
                  {genres.map((genre) => (
                    <button
                      key={genre.id}
                      onClick={() => {
                        filterMovies(genre.id.toString());
                        setIsFiltersOpen(false);
                      }}
                      className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                        selectedGenre === genre.id.toString()
                          ? 'bg-green-600 text-white'
                          : isDarkMode 
                            ? 'bg-gray-700 text-white hover:bg-gray-600' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {genre.name}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Loading and Error States */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
          </div>
        )}

        {error && (
          <div className={`rounded-xl p-6 mb-8 text-center ${isDarkMode ? 'bg-red-900 text-red-100' : 'bg-red-100 text-red-800'}`}>
            <p>{error}</p>
            <button 
              onClick={fetchTrendingMovies}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Results Count */}
        {!isLoading && !error && (
          <div className="mb-6 flex justify-between items-center">
            <p>
              Showing <span className="font-semibold">{currentItems.length}</span> of{' '}
              <span className="font-semibold">{filteredMovies.length}</span> movies
            </p>
            {(searchQuery || selectedGenre !== "all") && (
              <button
                onClick={showAll}
                className="flex items-center text-sm hover:text-green-600 transition-colors"
              >
                Clear all filters
                <FaTimes className="ml-1" />
              </button>
            )}
          </div>
        )}

        {/* Movie Grid */}
        {!isLoading && !error && currentItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {currentItems.map((movie) => (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.03 }}
                onClick={() => fetchMovieDetails(movie.id)}
                className="cursor-pointer"
              >
                <MovieCard 
                    movie={movie} 
                    darkMode={isDarkMode}
                    imageBaseUrl={IMAGE_BASE_URL}
                    onClick={() => handleMovieClick(movie.id)}
                />
              </motion.div>
            ))}
          </div>
        ) : null}

        {!isLoading && !error && filteredMovies.length === 0 && (
          <div className={`rounded-xl shadow-sm p-12 text-center ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className="text-xl font-medium mb-2">No movies found</h3>
            <p className="mb-4">
              Try adjusting your search or filters to find what you're looking for
            </p>
            <button
              onClick={showAll}
              className="px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
            >
              Reset all filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && !error && filteredMovies.length > itemsPerPage && (
          <div className="flex justify-center my-12">
            <nav className="flex items-center gap-1">
              {Array.from({ length: Math.ceil(filteredMovies.length / itemsPerPage) }).map(
                (_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => paginate(index + 1)}
                    className={`w-10 h-10 flex items-center justify-center rounded-full font-medium transition-colors ${
                      currentPage === index + 1
                        ? 'bg-green-600 text-white'
                        : isDarkMode 
                          ? 'bg-gray-700 text-white hover:bg-gray-600' 
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {index + 1}
                  </button>
                )
              )}
            </nav>
          </div>
        )}

        {/* Movie Detail Modal */}
        <AnimatePresence>
          {selectedMovie && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedMovie(null)}
            >
              <motion.div 
                initial={{ scale: 0.9, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 50 }}
                className={`relative max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6`}
                onClick={(e) => e.stopPropagation()}
              >
                <button 
                    onClick={() => setSelectedMovie(null)}
                    className="absolute top-4 right-4 text-2xl hover:text-green-600"
                >
                    &times;
                </button>
                
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-1/3">
                    <img 
                      src={selectedMovie.poster_path ? `${IMAGE_BASE_URL}${selectedMovie.poster_path}` : '/placeholder-movie.png'} 
                      alt={selectedMovie.title}
                      className="w-full rounded-lg shadow-lg"
                    />
                  </div>
                  
                  <div className="w-full md:w-2/3">
                    <h2 className="text-2xl font-bold mb-2">{selectedMovie.title}</h2>
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <span className={`px-2 py-1 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                        {new Date(selectedMovie.release_date).getFullYear()}
                      </span>
                      {selectedMovie.genres?.map(genre => (
                        <span 
                          key={genre.id}
                          className={`px-2 py-1 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
                        >
                          {genre.name}
                        </span>
                      ))}
                      <span className={`px-2 py-1 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                        ⭐ {selectedMovie.vote_average.toFixed(1)}/10
                      </span>
                      <span className={`px-2 py-1 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                        {Math.floor(selectedMovie.runtime / 60)}h {selectedMovie.runtime % 60}m
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-2">Overview</h3>
                    <p className="mb-6">{selectedMovie.overview || 'No overview available.'}</p>
                    
                    {selectedMovie.credits?.cast?.length > 0 && (
                      <>
                        <h3 className="text-lg font-semibold mb-2">Cast</h3>
                        <div className="flex overflow-x-auto gap-3 pb-2 mb-6">
                          {selectedMovie.credits.cast.slice(0, 10).map(person => (
                            <div key={person.id} className="flex-shrink-0 text-center">
                              <img 
                                src={person.profile_path ? `${IMAGE_BASE_URL}${person.profile_path}` : '/placeholder-person.png'} 
                                alt={person.name}
                                className="w-16 h-16 rounded-full object-cover mx-auto mb-1"
                              />
                              <p className="text-sm font-medium">{person.name}</p>
                              <p className="text-xs text-gray-500">{person.character}</p>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                    
                    {selectedMovie.videos?.results?.find(v => v.site === 'YouTube' && v.type === 'Trailer') && (
                      <div className="mt-4">
                        <h3 className="text-lg font-semibold mb-2">Trailer</h3>
                        <div className="aspect-w-16 aspect-h-9">
                          <iframe 
                            src={`https://www.youtube.com/embed/${selectedMovie.videos.results.find(v => v.type === 'Trailer').key}`}
                            title="Movie Trailer"
                            allowFullScreen
                            className="w-full h-64 rounded-lg"
                          ></iframe>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BrowseMovies;