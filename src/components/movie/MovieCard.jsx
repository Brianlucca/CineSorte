import React from "react";
import {
  InformationCircleIcon,
  StarIcon,
  BookmarkIcon,
} from "@heroicons/react/24/solid";
import { useAuth } from "../../context/AuthContext";
import { AddToListModal } from "./AddToListModal";
import { useAddToList } from "../../hooks/addToList/useAddToList";

const InfoBadge = ({ icon, text }) => (
  <div className="flex items-center gap-1.5 bg-slate-800/60 text-slate-300 px-3 py-1.5 rounded-full text-sm">
    {icon}
    <span className="font-semibold">{text}</span>
  </div>
);

const MovieCard = ({ item, allGenres, onShowDetails, watchProviders }) => {
  const { currentUser } = useAuth();
  const {
    isModalOpen,
    openModal,
    closeModal,
    userLists,
    isLoading,
    addMovieToSelectedList,
    movieToAdd,
  } = useAddToList();

  const posterUrl = item.poster_path
    ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
    : "https://placehold.co/500x750/0f172a/94a3b8?text=Cinesorte";
  const backdropUrl = item.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${item.backdrop_path}`
    : "";

  const title = item.title || item.name;
  const releaseDate = item.release_date || item.first_air_date;
  const releaseYear = releaseDate ? new Date(releaseDate).getFullYear() : "N/A";
  const mediaType = item.media_type || (item.title ? "movie" : "tv");

  const getGenreNames = (genreIds) => {
    if (!genreIds || !Array.isArray(allGenres) || allGenres.length === 0)
      return [];
    return genreIds
      .map((id) => allGenres.find((g) => g.id === id)?.name)
      .filter(Boolean);
  };

  const itemGenres = getGenreNames(item.genre_ids);

  return (
    <>
      <AddToListModal
        isOpen={isModalOpen}
        onClose={closeModal}
        movieToAdd={movieToAdd}
        userLists={userLists}
        isLoading={isLoading}
        onAddToList={addMovieToSelectedList}
      />
      <div className="group relative w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl shadow-black/60 border border-slate-800 bg-slate-900/70 backdrop-blur-sm animate-fade-in transition-all duration-300 hover:border-cyan-500/50">
        <div className="absolute inset-0 z-0">
          {backdropUrl && (
            <img
              src={backdropUrl}
              alt=""
              className="w-full h-full object-cover blur-xl scale-125 opacity-20 transition-opacity duration-300"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent"></div>
          <div
            className="absolute top-0 right-0 bottom-0 left-1/2 bg-gradient-to-b from-cyan-500/20 to-transparent rounded-full opacity-0 group-hover:opacity-50 transition-opacity duration-500 blur-3xl -translate-y-1/2 translate-x-1/4"
            aria-hidden="true"
          ></div>
        </div>

        <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8">
          <div className="mx-auto md:mx-0 w-48 md:w-56 lg:w-64 flex-shrink-0 transform-gpu transition-transform duration-500 group-hover:scale-105">
            <img
              src={posterUrl}
              alt={`Pôster de ${title}`}
              className="w-full rounded-lg shadow-2xl shadow-black/70"
            />
            {currentUser && (
              <button
                onClick={() => openModal(item)}
                className="absolute top-3 right-3 p-2 rounded-full bg-slate-800/80 text-slate-300 hover:text-cyan-400 hover:bg-slate-700 transition-colors flex-shrink-0 backdrop-blur-sm"
              >
                <BookmarkIcon className="w-6 h-6" />
              </button>
            )}
          </div>

          <div className="flex flex-col text-center md:text-left flex-grow">
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-lg font-semibold text-cyan-400">
                    {releaseYear}
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold text-white text-shadow-lg mt-1">
                    {title}
                  </h2>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4 mb-4">
                <InfoBadge
                  icon={<StarIcon className="w-5 h-5 text-yellow-400" />}
                  text={item.vote_average?.toFixed(1) || "N/A"}
                />
                {itemGenres.slice(0, 2).map((genre) => (
                  <span
                    key={genre}
                    className="bg-slate-700/50 text-slate-300 text-xs font-semibold px-2.5 py-1 rounded-full hidden sm:inline-block"
                  >
                    {genre}
                  </span>
                ))}
              </div>

              <p className="text-slate-300 leading-relaxed text-sm md:text-base text-shadow text-left hyphens-auto line-clamp-3 md:line-clamp-4">
                {item.overview || "Sinopse não disponível."}
              </p>
            </div>

            <div className="mt-auto flex flex-col gap-6 pt-6">
              {watchProviders && (
                <div>
                  <h3 className="font-bold text-slate-400 mb-2 text-sm text-left">
                    Disponível em:
                  </h3>
                  <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                    {watchProviders.length > 0 ? (
                      watchProviders
                        .slice(0, 5)
                        .map((provider) => (
                          <img
                            key={provider.provider_id}
                            src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`}
                            alt={provider.provider_name}
                            className="w-10 h-10 rounded-lg"
                            title={provider.provider_name}
                          />
                        ))
                    ) : (
                      <p className="text-xs text-slate-500 text-left">
                        Nenhum serviço de streaming (assinatura) encontrado.
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="border-t border-slate-700/50 pt-6 flex justify-center md:justify-start">
                <button
                  onClick={() => onShowDetails(item.id, mediaType)}
                  className="inline-flex items-center gap-2 bg-slate-800 hover:bg-cyan-500 border border-slate-700 hover:border-cyan-500 transition-all duration-300 text-white font-bold py-2 px-5 rounded-lg shadow-lg shadow-black/50"
                >
                  <InformationCircleIcon className="w-5 h-5" />
                  <span>Ver Mais Detalhes</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MovieCard;
