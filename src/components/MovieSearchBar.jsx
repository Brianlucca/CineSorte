import React, { useState, useEffect } from 'react';
import { searchMulti } from '../services/api';
import { MagnifyingGlassIcon, XMarkIcon, PlusIcon, CheckIcon } from '@heroicons/react/24/solid';

const MovieSearchBar = ({ onAddMovie, customList }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (query.length < 3) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setShowResults(true);
    const debounceTimer = setTimeout(() => {
      setIsLoading(true);
      searchMulti(query)
        .then(data => setResults(data))
        .catch(err => console.error("Erro na busca:", err))
        .finally(() => setIsLoading(false));
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleAddClick = (item) => {
    onAddMovie(item);
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
  }

  return (
    <div className="relative w-full">
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 3 && setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
          placeholder="Adicionar filme ou série..."
          className="w-full p-3 pl-10 pr-10 bg-slate-900/70 rounded-md border border-slate-700 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
        />
        {query && (
          <button onClick={clearSearch} className="absolute inset-y-0 right-0 flex items-center pr-3">
            <XMarkIcon className="h-5 w-5 text-slate-400 hover:text-white" />
          </button>
        )}
      </div>

      {showResults && (
        <div className="absolute z-10 w-full mt-2 bg-slate-800 border border-slate-700 rounded-md max-h-80 overflow-y-auto shadow-lg animate-fade-in-fast">
          {isLoading ? (
            <div className="flex justify-center items-center p-4">
              <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : results.length > 0 ? (
            <ul>
              {results.map(item => {
                const isAdded = customList.some(listItem => listItem.id === item.id);
                const title = item.title || item.name;
                const releaseDate = item.release_date || item.first_air_date;
                const year = releaseDate ? new Date(releaseDate).getFullYear() : 'N/A';
                const posterUrl = item.poster_path ? `https://image.tmdb.org/t/p/w92${item.poster_path}` : 'https://placehold.co/92x138/0f172a/94a3b8?text=?';

                return (
                  <li key={item.id} className="flex items-center p-3 border-b border-slate-700/50 last:border-b-0 hover:bg-slate-700/50 transition-colors">
                    <img src={posterUrl} alt={title} className="w-10 h-14 object-cover rounded-sm flex-shrink-0 bg-slate-900" />
                    <div className="flex-grow ml-3 text-sm min-w-0">
                      <p className="truncate font-semibold text-white">{title}</p>
                      <p className="text-slate-400">{year}</p>
                    </div>
                    <button
                      onClick={() => handleAddClick(item)}
                      disabled={isAdded}
                      className="ml-3 p-2 text-xs font-bold rounded-md flex-shrink-0 transition-colors
                        disabled:bg-green-500/20 disabled:text-green-300 disabled:cursor-not-allowed
                        bg-cyan-600 hover:bg-cyan-500 text-white"
                    >
                      {isAdded ? <CheckIcon className="w-5 h-5" /> : <PlusIcon className="w-5 h-5" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="p-4 text-center text-sm text-slate-500">Nenhum resultado encontrado.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default MovieSearchBar;
