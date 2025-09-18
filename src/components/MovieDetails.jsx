import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

const MovieDetails = ({ movieDetails, onBack }) => {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id, type } = movieDetails;

  const apiKey = import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    if (!id || !type) return;
    const fetchDetails = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get(`https://api.themoviedb.org/3/${type}/${id}`, {
          params: {
            api_key: apiKey,
            language: 'pt-BR',
            append_to_response: 'credits,watch/providers',
          }
        });
        setItem(response.data);
      } catch (err) {
        setError('Não foi possível carregar os detalhes.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id, type, apiKey]);

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

  const posterUrl = `https://image.tmdb.org/t/p/w500${item.poster_path}`;
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
    <div className="w-full max-w-5xl animate-fade-in">
      <button onClick={onBack} className="flex items-center gap-2 mb-6 text-cyan-400 hover:text-cyan-300 transition-colors">
        <ArrowLeftIcon className="h-5 w-5" />
        Voltar
      </button>

      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl shadow-lg shadow-black/30 flex flex-col md:flex-row overflow-hidden">
        <img src={posterUrl} alt={`Pôster de ${title}`} className="w-full md:w-1/3 object-cover" />
        <div className="p-4 md:p-8 flex flex-col gap-4">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">{title}</h2>
          {item.tagline && <p className="text-slate-400 italic text-lg -mt-2">"{item.tagline}"</p>}
          
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-slate-300">
            <span>{releaseYear}</span>
            {runtime && <span>•</span>}
            {runtime && <span>{`${runtimeHours}h ${runtimeMinutes}m`}</span>}
            <span>•</span>
            <span className="flex items-center gap-1.5">★ {item.vote_average.toFixed(1)}</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {item.genres.map(genre => (
              <span key={genre.id} className="bg-slate-700 text-slate-300 text-xs font-semibold px-2.5 py-1 rounded-full">{genre.name}</span>
            ))}
          </div>
          
          <p className="text-slate-300 leading-relaxed text-sm md:text-base">{item.overview}</p>

          {director && <p className="text-sm md:text-base text-slate-300"><strong className="text-slate-400">Direção:</strong> {director.name}</p>}
          {creators && <p className="text-sm md:text-base"><strong className="text-slate-400">Criação:</strong> {creators}</p>}
          
          {providers.length > 0 && (
            <div>
              <strong className="text-slate-400">Disponível em:</strong>
              <div className="flex flex-wrap gap-3 mt-2">
                {providers.map(provider => (
                    <img key={provider.provider_id} src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`} alt={provider.provider_name} className="w-10 h-10 rounded-md" title={provider.provider_name} />
                ))}
              </div>
            </div>
          )}

          {mainCast && mainCast.length > 0 && (
            <div>
              <strong className="text-slate-400">Elenco Principal:</strong>
              <div className="flex flex-wrap gap-4 mt-2">
                {mainCast.map(actor => (
                  <div key={actor.cast_id} className="text-center w-20">
                    {actor.profile_path ? (
                      <img src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`} alt={actor.name} className="rounded-full w-16 h-16 object-cover mx-auto mb-1 border-2 border-slate-600" />
                    ) : (
                      <div className="rounded-full w-16 h-16 bg-slate-700 mx-auto mb-1 border-2 border-slate-600 flex items-center justify-center"><span className="text-3xl text-slate-500">?</span></div>
                    )}
                    <p className="text-xs text-slate-300 leading-tight">{actor.name}</p>
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