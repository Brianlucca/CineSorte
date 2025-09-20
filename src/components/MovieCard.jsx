import React from 'react';

const MovieCard = ({ item, allGenres, onShowDetails, watchProviders }) => {
  const posterUrl = item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'https://via.placeholder.com/500x750.png?text=Sem+Imagem';
  const backdropUrl = item.backdrop_path ? `https://image.tmdb.org/t/p/w1280${item.backdrop_path}` : '';
  
  const title = item.title || item.name;
  const releaseDate = item.release_date || item.first_air_date;
  const releaseYear = releaseDate ? releaseDate.substring(0, 4) : 'N/A';
  const mediaType = item.media_type || (item.title ? 'movie' : 'tv');

  const getGenreNames = (genreIds) => {
    if (!genreIds || !allGenres || allGenres.length === 0) return [];
    return genreIds.map(id => allGenres.find(g => g.id === id)?.name).filter(Boolean);
  };
  
  const itemGenres = getGenreNames(item.genre_ids);

  return (
    <div className="relative w-full max-w-4xl rounded-xl overflow-hidden shadow-2xl shadow-black/50 border border-slate-700/50 animate-fade-in">
      <div className="absolute inset-0 w-full h-full">
        {backdropUrl && (
          <img src={backdropUrl} alt="" className="w-full h-full object-cover blur-sm scale-110 opacity-30" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-slate-900/50"></div>
      </div>

      <div className="relative p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8">
        <div className="mx-auto md:mx-0 w-48 md:w-64 flex-shrink-0">
          <img src={posterUrl} alt={`Pôster de ${title}`} className="w-full rounded-lg shadow-2xl shadow-black/50" />
        </div>
        
        <div className="flex flex-col text-center md:text-left min-h-[400px]">
          <div className="flex flex-col">
            <span className="text-lg text-slate-400 text-shadow">{releaseYear}</span>
            <h2 className="text-3xl md:text-5xl font-bold text-white text-shadow">{title}</h2>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4 mt-4 mb-4 text-shadow">
            <div className="flex items-center gap-1.5 text-lg">
              <span className="text-yellow-400">★</span>
              <span className="text-white font-bold">{item.vote_average?.toFixed(1)}</span>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {itemGenres.slice(0, 2).map(genre => (
                <span key={genre} className="bg-slate-700/50 text-slate-300 text-xs font-semibold px-2.5 py-1 rounded-full">{genre}</span>
              ))}
            </div>
          </div>
          
          <p className="text-slate-300 leading-relaxed max-h-36 overflow-y-auto flex-grow pr-2 text-sm md:text-base text-shadow text-left">
            {item.overview || "Sinopse não disponível."}
          </p>
          
          {watchProviders && (
            <div className="mt-4">
              <h3 className="font-bold text-slate-400 mb-2 text-sm">Disponível em:</h3>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                {watchProviders.length > 0 ? (
                  watchProviders.map(provider => (
                    <img key={provider.provider_id} src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`} alt={provider.provider_name} className="w-10 h-10 rounded-md" title={provider.provider_name} />
                  ))
                ) : (
                  <p className="text-sm text-slate-500">Nenhum serviço de streaming (assinatura) encontrado.</p>
                )}
              </div>
            </div>
          )}
          
          <div className="mt-auto pt-4">
             <button onClick={() => onShowDetails(item.id, mediaType)} className="inline-block bg-cyan-600 hover:bg-cyan-500 transition-colors text-white font-bold py-2 px-4 rounded-md">
              Ver Mais Detalhes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;