import React, { useState, useEffect, useMemo } from 'react';
import { useMovieDetails } from '../../hooks/movie/useMovieDetails';
import { ArrowLeftIcon, BookmarkIcon, PlayCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../../context/AuthContext';
import { AddToListModal } from './AddToListModal';
import { useAddToList } from '../../hooks/addToList/useAddToList';

const SectionHeader = ({ title }) => (
  <h3 className="text-2xl font-bold text-white mb-4 border-l-4 border-cyan-500 pl-3">{title}</h3>
);

const InfoPill = ({ label, value }) => (
  <div className="flex justify-between items-baseline text-sm">
    <span className="font-semibold text-slate-400">{label}</span>
    <span className="font-bold text-white text-right">{value}</span>
  </div>
);

const ActorCard = ({ actor }) => (
  <div className="text-center group">
    <div className="relative aspect-[2/3] w-full rounded-lg overflow-hidden border-2 border-slate-800 group-hover:border-cyan-500 transition-colors duration-300">
      {actor.profile_path ? (
        <img src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`} alt={actor.name} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-slate-800 flex items-center justify-center">
          <span className="text-3xl text-slate-600">?</span>
        </div>
      )}
    </div>
    <p className="font-bold text-white leading-tight mt-2 text-sm">{actor.name}</p>
    <p className="text-xs text-slate-400 leading-tight">{actor.character}</p>
  </div>
);

const MovieDetails = ({ movieDetails, onBack }) => {
  const { id, type } = movieDetails;
  const { loading, error, details, rawItem } = useMovieDetails(id, type);
  const { currentUser } = useAuth();
  const { isModalOpen, openModal, closeModal, userLists, isLoading: isLoadingLists, addMovieToSelectedList, movieToAdd } = useAddToList();
  const [backdropLoaded, setBackdropLoaded] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    if (details?.backdropUrl) {
      const img = new Image();
      img.src = details.backdropUrl;
      img.onload = () => {
        setTimeout(() => setBackdropLoaded(true), 100);
      };
    }
  }, [details?.backdropUrl]);

  const summaryItem = rawItem ? {
    adult: rawItem.adult,
    backdrop_path: rawItem.backdrop_path,
    genre_ids: rawItem.genres?.map(g => g.id),
    id: rawItem.id,
    media_type: type,
    original_language: rawItem.original_language,
    original_title: rawItem.original_title,
    overview: rawItem.overview,
    popularity: rawItem.popularity,
    poster_path: rawItem.poster_path,
    release_date: rawItem.release_date || rawItem.first_air_date,
    title: rawItem.title || rawItem.name,
    video: rawItem.video,
    vote_average: rawItem.vote_average,
    vote_count: rawItem.vote_count,
  } : null;

  const trailerSection = useMemo(() => {
    if (!showTrailer || !details?.trailer?.key) {
      return null;
    }
    const trailerSrc = `https://www.youtube.com/embed/${details.trailer.key}?autoplay=1&rel=0&modestbranding=1`;

    return (
      <div className="animate-fade-in">
        <section>
          <div className="flex justify-between items-center mb-4">
            <SectionHeader title="Trailer" />
            <button onClick={() => setShowTrailer(false)} className="text-slate-400 hover:text-white">
              <XCircleIcon className="w-8 h-8"/>
            </button>
          </div>
          <div className="aspect-video">
            <iframe
              key={details.trailer.key}
              className="w-full h-full rounded-lg shadow-2xl border border-slate-700 bg-black"
              src={trailerSrc}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </section>
      </div>
    );
  }, [showTrailer, details?.trailer]);

  if (loading) {
    return (
      <div className="w-full max-w-7xl bg-slate-900 rounded-2xl shadow-2xl shadow-black/60 border border-slate-800 p-8 flex items-center justify-center min-h-[80vh]">
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg tracking-wider text-slate-300">A carregar detalhes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-7xl bg-slate-900 rounded-2xl shadow-2xl shadow-black/60 border border-slate-800 p-8 flex items-center justify-center min-h-[80vh]">
        <p className="text-xl text-amber-500 bg-amber-950/50 px-6 py-3 rounded-lg">{error}</p>
      </div>
    );
  }

  if (!details) return null;

  return (
    <>
      <AddToListModal
        isOpen={isModalOpen}
        onClose={closeModal}
        movieToAdd={movieToAdd}
        userLists={userLists}
        isLoading={isLoadingLists}
        onAddToList={addMovieToSelectedList}
      />
      <div className="w-full max-w-7xl bg-slate-900 rounded-2xl shadow-2xl shadow-black/60 border border-slate-800 animate-fade-in overflow-hidden">
        <div className="relative">
          <div className="absolute inset-0 z-0">
            {details.backdropUrl && (
              <img
                src={details.backdropUrl}
                alt=""
                className={`w-full h-full object-cover object-center transition-all duration-1000 ${backdropLoaded ? 'scale-110 opacity-30' : 'scale-100 opacity-0'}`}
              />
            )}
          </div>
          <div className="relative z-10 p-6 sm:p-8">
            <button onClick={onBack} className="absolute top-4 left-4 z-20 flex items-center gap-2 text-white bg-black/30 hover:bg-black/50 transition-colors px-3 py-1.5 rounded-full text-sm font-semibold">
              <ArrowLeftIcon className="h-5 w-5" />
              <span>Voltar</span>
            </button>
            <div className="flex items-center justify-center text-center pt-16">
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center gap-4 text-slate-300">
                  <span>{details.releaseYear}</span>
                  <span className="w-1.5 h-1.5 bg-slate-500 rounded-full"></span>
                  <span>{type === 'tv' ? 'Série' : 'Filme'}</span>
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white text-shadow-lg mt-2">{details.title}</h2>
                {details.tagline && <p className="text-slate-400 italic text-lg mt-2 text-shadow max-w-2xl">"{details.tagline}"</p>}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 p-6 sm:p-8">
          <aside className="lg:col-span-4 xl:col-span-3 space-y-8">
            <div className="relative">
              <img src={details.posterUrl} alt={`Pôster de ${details.title}`} className="w-full rounded-lg shadow-2xl shadow-black/70" />
              
              {details.trailer && (
                <button
                  onClick={() => setShowTrailer(true)}
                  className="absolute top-3 left-3 flex items-center gap-2 text-white bg-black/50 hover:bg-cyan-500 transition-colors px-3 py-1.5 rounded-full text-sm font-semibold backdrop-blur-sm"
                  aria-label="Ver Trailer"
                >
                  <PlayCircleIcon className="w-5 h-5" />
                  <span>Ver Trailer</span>
                </button>
              )}

              {currentUser && summaryItem && (
                  <button onClick={() => openModal(summaryItem)} className="absolute top-3 right-3 p-2 rounded-full bg-slate-800/80 text-slate-300 hover:text-cyan-400 hover:bg-slate-700 transition-colors flex-shrink-0 backdrop-blur-sm">
                      <BookmarkIcon className="w-6 h-6" />
                  </button>
              )}
            </div>
            
            {details.providers.length > 0 && (
              <section>
                <SectionHeader title="Disponível em" />
                <div className="flex flex-wrap gap-4">
                  {details.providers.map(provider => (
                    <img key={provider.provider_id} src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`} alt={provider.provider_name} className="w-12 h-12 rounded-lg transition-transform hover:scale-110" title={provider.provider_name} />
                  ))}
                </div>
              </section>
            )}

            <section>
              <SectionHeader title="Detalhes" />
              <div className="space-y-3 bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
                <InfoPill label="Nota" value={details.voteAverage} />
                <InfoPill label={type === 'tv' ? 'Duração (Ep.)' : 'Duração'} value={details.runtimeText} />
                {type === 'movie' && <InfoPill label="Lançamento" value={details.releaseDate ? new Date(details.releaseDate).toLocaleDateString('pt-BR') : 'N/A'} />}
                {type === 'tv' && <InfoPill label="Temporadas" value={details.numberOfSeasons} />}
                <InfoPill label="Status" value={details.status} />
              </div>
            </section>

            {type === 'movie' && (details.budget !== 'Não divulgado' || details.revenue !== 'Não divulgado') && (
              <section>
                <SectionHeader title="Financeiro" />
                <div className="space-y-3 bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
                  <InfoPill label="Orçamento" value={details.budget} />
                  <InfoPill label="Receita" value={details.revenue} />
                </div>
              </section>
            )}
          </aside>

          <main className="lg:col-span-8 xl:col-span-9 space-y-12">
            {trailerSection}
            <section>
              <SectionHeader title="Sinopse" />
              <p className="text-slate-300 leading-relaxed text-base prose prose-invert max-w-none">
                {details.overview || "Sinopse não disponível."}
              </p>
              <div className="flex flex-wrap gap-2 justify-start mt-4">
                {details.genres.map(genre => (
                  <span key={genre.id} className="bg-slate-800 text-slate-300 text-xs font-semibold px-2.5 py-1 rounded-full">{genre.name}</span>
                ))}
              </div>
            </section>

            {(details.director || details.creators) && (
              <p className="text-base text-slate-300 -mt-6">
                <strong className="text-slate-400">{details.director ? "Direção: " : "Criação: "}</strong>
                {details.director?.name || details.creators}
              </p>
            )}

            {details.mainCast && details.mainCast.length > 0 && (
              <section>
                <SectionHeader title="Elenco Principal" />
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-6">
                  {details.mainCast.map(actor => <ActorCard key={actor.cast_id} actor={actor} />)}
                </div>
              </section>
            )}
            
            {details.productionCompanies && details.productionCompanies.length > 0 && (
              <section>
                <SectionHeader title="Produção" />
                <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                  {details.productionCompanies.map(company => company.logo_path && (
                    <div key={company.id} className="h-10 flex items-center" title={company.name}>
                      <img src={`https://image.tmdb.org/t/p/w200${company.logo_path}`} alt={company.name} className="max-h-full max-w-full h-auto w-auto opacity-70" />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </main>
        </div>
      </div>
    </>
  );
};

export default MovieDetails;

