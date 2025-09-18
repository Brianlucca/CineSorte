import React, { useState, useEffect } from 'react';
import EntitySearchBar from './EntitySearchBar';

const FilterSidebar = ({ onApplyFilters, genresList, closeSidebar, onMediaTypeChange, mediaType }) => {
  const [localFilters, setLocalFilters] = useState({
    sortBy: 'popularity.desc',
    genre: '',
    releaseYear: '',
    voteAverageGte: 7,
    runtimeLte: 180,
    excludeAnimation: true,
    keywords: [],
  });

  useEffect(() => {
    setLocalFilters(prev => ({ ...prev, genre: '' }));
  }, [mediaType]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLocalFilters(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleAddItem = (type, item) => {
    if (localFilters[type].length >= 3) return;
    setLocalFilters(prev => ({ ...prev, [type]: [...prev[type], item] }));
  };
  
  const handleRemoveItem = (type, itemId) => {
    setLocalFilters(prev => ({ ...prev, [type]: prev[type].filter(i => i.id !== itemId) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onApplyFilters(localFilters);
    closeSidebar();
  };

  const years = Array.from({ length: new Date().getFullYear() - 1949 }, (_, i) => new Date().getFullYear() - i);

  return (
    <div className="space-y-8 text-sm">
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Filtros</h2>
        <label className="font-medium text-slate-400">Quero Sortear</label>
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-800 rounded-md mt-2">
          <button type="button" onClick={() => onMediaTypeChange('movie')} className={`px-4 py-2 font-bold rounded ${mediaType === 'movie' ? 'bg-cyan-500 text-slate-900' : 'bg-transparent text-slate-300'}`}>Filmes</button>
          <button type="button" onClick={() => onMediaTypeChange('tv')} className={`px-4 py-2 font-bold rounded ${mediaType === 'tv' ? 'bg-cyan-500 text-slate-900' : 'bg-transparent text-slate-300'}`}>Séries</button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
        <div className="space-y-2">
          <label htmlFor="sortBy" className="font-medium text-slate-400">Ordenar por</label>
          <select name="sortBy" id="sortBy" value={localFilters.sortBy} onChange={handleChange} className="w-full p-2.5 bg-slate-800 rounded-md border border-slate-700 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none">
            <option value="popularity.desc">Mais Populares</option>
            <option value="vote_average.desc">Melhores Notas</option>
            {mediaType === 'movie' ? <option value="primary_release_date.desc">Lançamentos Recentes</option> : <option value="first_air_date.desc">Lançamentos Recentes</option>}
            {mediaType === 'movie' && <option value="revenue.desc">Maior Bilheteria</option>}
            <option value="vote_count.desc">Mais Votados</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="genre" className="font-medium text-slate-400">Gênero</label>
          <select name="genre" id="genre" value={localFilters.genre} onChange={handleChange} className="w-full p-2.5 bg-slate-800 rounded-md border border-slate-700 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none">
            <option value="">Todos os Gêneros</option>
            {genresList.map(genre => <option key={genre.id} value={genre.id}>{genre.name}</option>)}
          </select>
        </div>

        <div className="flex items-center pt-2">
          <input type="checkbox" id="excludeAnimation" name="excludeAnimation" checked={localFilters.excludeAnimation} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500" />
          <label htmlFor="excludeAnimation" className="ml-3 block text-sm font-medium text-slate-300">Excluir Animações</label>
        </div>
        
        <div className="space-y-2">
          <label className="font-medium text-slate-400">Filtrar por Palavras-Chave (até 3)</label>
          <EntitySearchBar searchType="keyword" selectedItems={localFilters.keywords} onAddItem={(item) => handleAddItem('keywords', item)} onRemoveItem={(id) => handleRemoveItem('keywords', id)} placeholder="Ex: viagem no tempo, alien..." />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="releaseYear" className="font-medium text-slate-400">Ano de Lançamento</label>
          <select name="releaseYear" id="releaseYear" value={localFilters.releaseYear} onChange={handleChange} className="w-full p-2.5 bg-slate-800 rounded-md border border-slate-700 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none">
            <option value="">Qualquer Ano</option>
            {years.map(year => <option key={year} value={year}>{year}</option>)}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="voteAverageGte" className="font-medium text-slate-400 flex justify-between">
            <span>Nota Mínima</span>
            <span className="font-bold text-cyan-400">{localFilters.voteAverageGte}</span>
          </label>
          <input type="range" name="voteAverageGte" id="voteAverageGte" min="0" max="10" step="0.5" value={localFilters.voteAverageGte} onChange={handleChange} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer range-thumb" />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="runtimeLte" className="font-medium text-slate-400 flex justify-between">
            <span>Duração Máxima (minutos)</span>
            <span className="font-bold text-cyan-400">{localFilters.runtimeLte}</span>
          </label>
          <input type="range" name="runtimeLte" id="runtimeLte" min="30" max="240" step="15" value={localFilters.runtimeLte} onChange={handleChange} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer range-thumb" />
        </div>
        
        <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-4 rounded-md transition-colors duration-300 mt-4">
          BUSCAR
        </button>
      </form>
    </div>
  );
};

export default FilterSidebar;