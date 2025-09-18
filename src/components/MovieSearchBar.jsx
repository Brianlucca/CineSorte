import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MovieSearchBar = ({ onAddMovie, customList }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchType, setSearchType] = useState('movie');

  useEffect(() => {
    if (query.length < 3) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    const debounceTimer = setTimeout(() => {
      const apiKey = import.meta.env.VITE_TMDB_API_KEY;
      axios.get(`https://api.themoviedb.org/3/search/multi`, {
        params: {
          api_key: apiKey,
          language: 'pt-BR',
          query: query,
          page: 1,
          include_adult: false,
        }
      }).then(response => {
        const filteredResults = response.data.results.filter(
          item => (item.media_type === 'movie' || item.media_type === 'tv') && item.poster_path
        );
        setResults(filteredResults);
      }).catch(err => {
        console.error("Erro na busca:", err);
      }).finally(() => {
        setIsLoading(false);
      });
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleAddClick = (item) => {
    const mediaType = item.title ? 'movie' : 'tv';
    onAddMovie({ ...item, media_type: mediaType });
    setQuery('');
    setResults([]);
  };

  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar filme ou série..."
        className="w-full p-3 bg-slate-800 rounded-md border border-slate-700 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
      />
      {results.length > 0 && (
        <ul className="absolute z-10 w-full mt-2 bg-slate-800 border border-slate-700 rounded-md max-h-80 overflow-y-auto shadow-lg">
          {results.map(item => {
            const isAdded = customList.some(listItem => listItem.id === item.id);
            const title = item.title || item.name;
            const releaseDate = item.release_date || item.first_air_date;
            const year = releaseDate ? releaseDate.substring(0, 4) : 'N/A';
            const typeLabel = item.media_type === 'movie' ? 'Filme' : 'Série';

            return (
              <li key={item.id} className="flex items-center p-2 border-b border-slate-700/50 last:border-b-0">
                <img src={`https://image.tmdb.org/t/p/w92${item.poster_path}`} alt={title} className="w-10 h-15 rounded-sm flex-shrink-0" />
                <div className="flex-grow ml-3 text-sm min-w-0">
                  <p className="truncate font-semibold">{title}</p>
                  <p className="text-slate-400">{year} <span className="text-cyan-400 text-xs">({typeLabel})</span></p>
                </div>
                <button
                  onClick={() => handleAddClick(item)}
                  disabled={isAdded}
                  className="ml-3 px-3 py-1 text-xs font-bold text-slate-900 bg-cyan-400 rounded-md hover:bg-cyan-300 disabled:bg-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed flex-shrink-0"
                >
                  {isAdded ? 'Adicionado' : 'Adicionar'}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default MovieSearchBar;