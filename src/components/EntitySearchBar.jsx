import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { XCircleIcon } from '@heroicons/react/24/solid';

const EntitySearchBar = ({ searchType, selectedItems, onAddItem, onRemoveItem, placeholder }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (query.length < 3) {
      setResults([]);
      return;
    }
    const debounceTimer = setTimeout(() => {
      const apiKey = import.meta.env.VITE_TMDB_API_KEY;
      axios.get(`https://api.themoviedb.org/3/search/${searchType}`, {
        params: { api_key: apiKey, language: 'pt-BR', query: query, page: 1 }
      }).then(response => {
        setResults(response.data.results);
      });
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [query, searchType]);

  const handleSelect = (item) => {
    onAddItem(item);
    setQuery('');
    setResults([]);
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full p-2.5 bg-slate-800 rounded-md border border-slate-700 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
        />
        {results.length > 0 && (
          <ul className="absolute z-20 w-full mt-1 bg-slate-800 border border-slate-700 rounded-md max-h-60 overflow-y-auto shadow-lg">
            {results.slice(0, 7).map(item => (
              <li key={item.id} onClick={() => handleSelect(item)} className="p-2 hover:bg-slate-700 cursor-pointer text-sm">
                {item.name}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex flex-wrap gap-2 min-h-[24px]">
        {selectedItems.map(item => (
          <div key={item.id} className="flex items-center gap-1 bg-cyan-800/50 text-cyan-200 text-xs px-2 py-1 rounded-full">
            <span>{item.name}</span>
            <button onClick={() => onRemoveItem(item.id)}><XCircleIcon className="w-4 h-4 hover:text-white" /></button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EntitySearchBar;