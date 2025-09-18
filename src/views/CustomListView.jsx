import React, { useState } from "react";
import axios from "axios";
import MovieSearchBar from "../components/MovieSearchBar";
import MovieCard from "../components/MovieCard";
import RouletteSpinner from "../components/RouletterSpinner";
import { XCircleIcon, FilmIcon } from "@heroicons/react/24/solid";

const CustomListView = ({
  onShowDetails,
  customList,
  onAddMovie,
  onRemoveMovie,
  error,
  setError,
}) => {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [watchProviders, setWatchProviders] = useState(null);

  const fetchWatchProviders = async (movieId) => {
    try {
      const apiKey = import.meta.env.VITE_TMDB_API_KEY;
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

  const handleSpinCustomList = () => {
    setError("");
    if (customList.length < 2) {
      setError("Adicione pelo menos 2 filmes para sortear.");
      return;
    }
    setIsSpinning(true);
    setSelectedMovie(null);
    setWatchProviders(null);

    setTimeout(async () => {
      const randomIndex = Math.floor(Math.random() * customList.length);
      const chosenMovie = customList[randomIndex];

      await fetchWatchProviders(chosenMovie.id);

      setSelectedMovie(chosenMovie);
      setIsSpinning(false);
    }, 3000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 lg:gap-12">
      <div className="lg:w-2/5 lg:max-w-md flex-shrink-0 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Monte sua Lista (até 10 filmes)
          </h2>
          <MovieSearchBar onAddMovie={onAddMovie} customList={customList} />
          {error && <p className="text-amber-500 text-sm mt-2">{error}</p>}
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50 flex flex-col">
          <h3 className="font-bold mb-3 text-slate-300 flex-shrink-0">
            Filmes na Lista: {customList.length}/10
          </h3>
          {customList.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center text-slate-500 h-full py-10 flex-grow">
              <FilmIcon className="w-16 h-16 mb-4" />
              <p>
                Sua lista está vazia. Use a busca acima para adicionar filmes.
              </p>
            </div>
          ) : (
            <ul className="space-y-2 max-h-96 overflow-y-auto pr-2">
              {customList.map((movie, index) => (
                <li
                  key={movie.id}
                  className="flex items-center justify-between p-2 bg-slate-700/50 rounded-md animate-fade-in"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-bold text-cyan-400 w-6 text-center flex-shrink-0">
                      {index + 1}.
                    </span>
                    <img
                      src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                      alt={movie.title}
                      className="w-10 h-14 rounded-sm object-cover flex-shrink-0"
                    />
                    <p className="text-sm truncate flex-grow min-w-0">
                      {movie.title}
                    </p>
                  </div>
                  <button
                    onClick={() => onRemoveMovie(movie.id)}
                    className="text-slate-500 hover:text-red-500 ml-2 flex-shrink-0"
                  >
                    <XCircleIcon className="w-6 h-6" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="flex-grow flex items-center justify-center min-h-[50vh] lg:min-h-0">
        {isSpinning && <RouletteSpinner movies={customList} />}

        {!isSpinning && !selectedMovie && (
          <div className="text-center">
            <button
              onClick={handleSpinCustomList}
              disabled={customList.length < 2}
              className="bg-cyan-500 text-slate-900 font-bold text-2xl py-4 px-10 rounded-full transition-all duration-300 ease-in-out hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/30 transform hover:scale-105 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            >
              Sortear da Minha Lista
            </button>
            {customList.length > 0 && customList.length < 2 && (
              <p className="mt-4 text-amber-400">
                Adicione mais filmes para poder sortear!
              </p>
            )}
          </div>
        )}

        {selectedMovie && (
          <div className="flex flex-col items-center gap-6 w-full">
            <MovieCard
              movie={selectedMovie}
              allGenres={[]}
              watchProviders={watchProviders}
              onShowDetails={onShowDetails}
            />
            <button
              onClick={handleSpinCustomList}
              className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-full transition-colors duration-300"
            >
              Sortear Novamente
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomListView;
