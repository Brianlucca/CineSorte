import React from "react";

const MovieCard = ({ movie, allGenres, onShowDetails, watchProviders }) => {
  const posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  const releaseYear = movie.release_date
    ? movie.release_date.substring(0, 4)
    : "N/A";

  const getGenreNames = (genreIds) => {
    if (!genreIds || !allGenres) return [];
    return genreIds
      .map((id) => allGenres.find((g) => g.id === id)?.name)
      .filter(Boolean);
  };

  const movieGenres = getGenreNames(movie.genre_ids);

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl shadow-lg shadow-black/30 w-full max-w-4xl flex flex-col md:flex-row overflow-hidden animate-fade-in">
      <div className="md:w-1/3">
        <img
          src={posterUrl}
          alt={`Pôster de ${movie.title}`}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="md:w-2/3 p-6 md:p-8 flex flex-col">
        <div>
          <div className="flex flex-wrap items-baseline gap-2">
            <h2 className="text-3xl lg:text-4xl font-bold text-white">
              {movie.title}
            </h2>
            <span className="text-2xl text-slate-400">({releaseYear})</span>
          </div>

          <div className="flex items-center gap-4 mt-2 mb-4">
            <div className="flex items-center gap-1.5 text-lg">
              <span className="text-yellow-400">★</span>
              <span className="text-white font-bold">
                {movie.vote_average.toFixed(1)}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {movieGenres.slice(0, 3).map((genre) => (
                <span
                  key={genre}
                  className="bg-slate-700 text-slate-300 text-xs font-semibold px-2.5 py-1 rounded-full"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>
        </div>

        <p className="text-slate-300 leading-relaxed overflow-y-auto max-h-48 flex-grow pr-2">
          {movie.overview || "Sinopse não disponível."}
        </p>

        {watchProviders && (
          <div className="mt-4">
            <h3 className="font-bold text-slate-400 mb-2">Disponível em:</h3>
            <div className="flex flex-wrap gap-3">
              {watchProviders.length > 0 ? (
                watchProviders.map((provider) => (
                  <img
                    key={provider.provider_id}
                    src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`}
                    alt={provider.provider_name}
                    className="w-10 h-10 rounded-md"
                    title={provider.provider_name}
                  />
                ))
              ) : (
                <p className="text-sm text-slate-500">
                  Nenhum serviço de streaming encontrado no Brasil.
                </p>
              )}
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-slate-700">
          <button
            onClick={() => onShowDetails(movie.id)}
            className="inline-block bg-slate-700 hover:bg-slate-600 transition-colors text-white font-bold py-2 px-4 rounded-md"
          >
            Ver mais detalhes
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
