import React from 'react';
import MovieCard from '../movie/MovieCard';
import RouletteSpinner from '../rouletter/RouletterSpinner';
import { useFilterRoulette } from '../../hooks/filterRoulette/useFilterRoulette';

const FilterRoulette = ({ genres, onShowDetails, mediaType, filters }) => {
  const {
    isLoading,
    error,
    selectedItem,
    isSpinning,
    watchProviders,
    handleSpinRoulette,
  } = useFilterRoulette(mediaType, filters);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      {isLoading && (
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg tracking-wider">A buscar na cinemateca...</p>
        </div>
      )}
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
            Girar Novamente
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterRoulette;
