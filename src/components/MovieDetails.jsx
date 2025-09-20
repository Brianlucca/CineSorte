import React, { useState, useEffect } from 'react';
import { getDetails } from '../services/api';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

const MovieDetails = ({ movieDetails, onBack }) => {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id, type } = movieDetails;

  useEffect(() => {
    if (!id || !type) return;
    setLoading(true);
    setError('');
    getDetails(type, id)
      .then(data => setItem(data))
      .catch(() => setError('Não foi possível carregar os detalhes.'))
      .finally(() => setLoading(false));
  }, [id, type]);

  if (loading) {
    return (
      <div className="flex flex-col items-center text-center">
        <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg tracking-wider text-slate-300">Carregando detalhes...</p>
      </div>
    );
  }

  if (error) { return <p className="text-xl text-amber-500">{error}</p>; }
  if (!item) return null;

  const posterUrl = item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'https://via.placeholder.com/500x750.png?text=Sem+Imagem';
  const backdropUrl = item.backdrop_path ? `https://image.tmdb.org/t/p/w1280${item.backdrop_path}` : '';
  
  const title = item.title || item.name;
  const releaseDate = item.release_date || item.first_air_date;
  const releaseYear = releaseDate ? releaseDate.substring(0, 4) : 'N/A';
  
  const director = item.credits?.crew.find(person => person.job === 'Director');
  const creators = item.created_by?.map(creator => creator.name).join(', ');
  const mainCast = item.credits?.cast.slice(0, 5);
  
  const runtime = item.runtime || (item.episode_run_time ? item.episode_run_time[0] : null);
  const runtimeHours = runtime ? Math.floor(runtime / 60) : null;
  const runtimeMinutes = runtime ? runtime % 60 : null;

  const providers = item['watch/providers']?.results?.BR?.flatrate || [];

  return (
    <div className="relative w-full max-w-5xl rounded-xl overflow-hidden shadow-2xl shadow-black/50 border border-slate-700/50 animate-fade-in">
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
        
        <div className="flex flex-col text-center md:text-left">
          <button onClick={onBack} className="flex items-center gap-2 mb-4 text-cyan-400 hover:text-cyan-300 transition-colors mx-auto md:mx-0 text-shadow">
            <ArrowLeftIcon className="h-5 w-5" />
            Voltar
          </button>
          
          <div className="flex flex-col">
            <span className="text-lg text-slate-400 text-shadow">{releaseYear}</span>
            <h2 className="text-3xl md:text-5xl font-bold text-white text-shadow">{title}</h2>
          </div>
          {item.tagline && <p className="text-slate-400 italic text-lg mt-2 text-shadow">"{item.tagline}"</p>}

          <div className="flex items-center justify-center md:justify-start gap-4 mt-4 mb-4 text-shadow">
            <div className="flex items-center gap-1.5 text-lg">
              <span className="text-yellow-400">★</span>
              <span className="text-white font-bold">{item.vote_average?.toFixed(1)}</span>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {item.genres.slice(0, 3).map(genre => (
                <span key={genre.id} className="bg-slate-700/50 text-slate-300 text-xs font-semibold px-2.5 py-1 rounded-full">{genre.name}</span>
              ))}
            </div>
          </div>
          
          <p className="text-slate-300 leading-relaxed max-h-36 overflow-y-auto flex-grow pr-2 text-sm md:text-base text-shadow">
            {item.overview || "Sinopse não disponível."}
          </p>

          {director && <p className="text-sm md:text-base text-slate-300 text-shadow"><strong className="text-slate-400">Direção:</strong> {director.name}</p>}
          {creators && <p className="text-sm md:text-base text-slate-300 text-shadow"><strong className="text-slate-400">Criação:</strong> {creators}</p>}
          
          {providers.length > 0 && (
            <div className="mt-4">
              <strong className="text-slate-400 text-shadow">Disponível em:</strong>
              <div className="flex flex-wrap gap-3 mt-2 justify-center md:justify-start">
                {providers.map(provider => (
                    <img key={provider.provider_id} src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`} alt={provider.provider_name} className="w-10 h-10 rounded-md" title={provider.provider_name} />
                ))}
              </div>
            </div>
          )}

          {mainCast && mainCast.length > 0 && (
            <div className="mt-4">
              <strong className="text-slate-400 text-shadow">Elenco Principal:</strong>
              <div className="flex flex-wrap gap-4 mt-2 justify-center md:justify-start">
                {mainCast.map(actor => (
                  <div key={actor.cast_id} className="text-center w-20">
                    {actor.profile_path ? (
                      <img src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`} alt={actor.name} className="rounded-full w-16 h-16 object-cover mx-auto mb-1 border-2 border-slate-600" />
                    ) : (
                      <div className="rounded-full w-16 h-16 bg-slate-700 mx-auto mb-1 border-2 border-slate-600 flex items-center justify-center"><span className="text-3xl text-slate-500">?</span></div>
                    )}
                    <p className="text-xs text-slate-300 leading-tight text-shadow">{actor.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;