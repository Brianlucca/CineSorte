import React, { useState } from "react";
import axios from "axios";
import MovieCard from "../components/MovieCard";
import RouletteSpinner from "../components/RouletterSpinner";

const FilterRouletteView = ({
  genres,
  movies,
  isLoading,
  error,
  setError,
  selectedMovie,
  setSelectedMovie,
  onShowDetails,
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [watchProviders, setWatchProviders] = useState(null);
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;

  const fetchWatchProviders = async (movieId) => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${movieId}/watch/providers?api_key=${apiKey}`
      );
      const providers = response.data.results.BR?.flatrate || [];
      setWatchProviders(providers);
    } catch (error) {
      console.error("Erro ao buscar provedores:", error);
      setWatchProviders([]);
    }
  };

  const handleSpinRoulette = () => {
    if (movies.length === 0) {
      setError("Busque por filmes antes de girar a roleta!");
      return;
    }
    setIsSpinning(true);
    setSelectedMovie(null);
    setWatchProviders(null);

    setTimeout(async () => {
      const randomIndex = Math.floor(Math.random() * movies.length);
      const chosenMovie = movies[randomIndex];

      await fetchWatchProviders(chosenMovie.id);

      setSelectedMovie(chosenMovie);
      setIsSpinning(false);
    }, 3000);
  };

  return (
    <>
      {isLoading && (
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg tracking-wider">
            Buscando na cinemateca...
          </p>
        </div>
      )}
      {error && !isLoading && (
        <p className="text-xl text-amber-500 bg-amber-950/50 px-6 py-3 rounded-lg">
          {error}
        </p>
      )}
      {isSpinning && <RouletteSpinner movies={movies} />}
      {!isLoading && !error && !isSpinning && !selectedMovie && (
        <div className="text-center">
          <button
            onClick={handleSpinRoulette}
            disabled={movies.length === 0}
            className="bg-cyan-500 text-slate-900 font-bold text-2xl py-4 px-10 rounded-full transition-all duration-300 ease-in-out hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/30 transform hover:scale-105 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
          >
            Girar o Cinesorte
          </button>
          {movies.length > 0 && (
            <p className="mt-4 text-slate-400">
              {movies.length} filmes na mira. Boa sorte!
            </p>
          )}
        </div>
      )}
      {selectedMovie && (
        <MovieCard
          movie={selectedMovie}
          allGenres={genres}
          onShowDetails={onShowDetails}
          watchProviders={watchProviders}
        />
      )}
    </>
  );
};

export default FilterRouletteView;
