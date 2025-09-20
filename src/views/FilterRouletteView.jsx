import React, { useState } from 'react';
import MovieCard from '../components/MovieCard';
import RouletteSpinner from '../components/RouletterSpinner';
import { discoverMedia, getProviders } from '../services/api';

const FilterRouletteView = ({ genres, onShowDetails, mediaType, filters }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [watchProviders, setWatchProviders] = useState(null);
  const [recentlySpun, setRecentlySpun] = useState([]);
  
  const handleSpinRoulette = async () => {
    setIsLoading(true);
    setError('');
    setSelectedItem(null);

    try {
      const results = await discoverMedia(mediaType, filters);
      
      if (results.length === 0) {
        setError('Nenhum resultado encontrado. Atualize a pagina e tente filtros mais abertos.');
        setIsLoading(false);
        return;
      }
      
      let availableResults = results.filter(item => !recentlySpun.includes(item.id));
      if (availableResults.length === 0) {
        setRecentlySpun([]);
        availableResults = results;
      }

      setIsLoading(false);
      setIsSpinning(true);

      setTimeout(async () => {
        const randomIndex = Math.floor(Math.random() * availableResults.length);
        const chosenItem = availableResults[randomIndex];
        
        const providers = await getProviders(mediaType, chosenItem.id);
        setWatchProviders(providers);
        
        setSelectedItem(chosenItem);
        setRecentlySpun(prev => [chosenItem.id, ...prev].slice(0, 10));
        setIsSpinning(false);
      }, 3000);
      
    } catch (err) {
      setError('Falha ao buscar. Atualize a pagina e tente novamente.');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      {isLoading && (<div className="flex flex-col items-center text-center"><div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div><p className="mt-4 text-lg tracking-wider">Buscando na cinemateca...</p></div>)}
      {error && !isLoading && <p className="text-xl text-amber-500 bg-amber-950/50 px-6 py-3 rounded-lg">{error}</p>}
      {isSpinning && <RouletteSpinner movies={[]} />} 
      
      {!isLoading && !error && !isSpinning && !selectedItem && (
        <div className="text-center">
          <p className="text-slate-400 mb-4">Ajuste os filtros na barra lateral e gire a roleta!</p>
          <button onClick={handleSpinRoulette} className="bg-cyan-500 text-slate-900 font-bold text-xl md:text-2xl py-3 px-8 md:py-4 md:px-10 rounded-full transition-all duration-300 ease-in-out hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/30 transform hover:scale-105">
            Girar o Cinesorte
          </button>
        </div>
      )}
      
      {selectedItem && (
        <div className="flex flex-col items-center gap-6 w-full">
          <MovieCard item={selectedItem} allGenres={genres} onShowDetails={onShowDetails} watchProviders={watchProviders} />
           <button onClick={handleSpinRoulette} className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-full transition-colors duration-300">
              Girar o Cinesorte
            </button>
        </div>
      )}
    </div>
  );
};

export default FilterRouletteView;