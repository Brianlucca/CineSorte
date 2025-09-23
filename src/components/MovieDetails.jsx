import { useEffect, useState } from 'react';
import { getDetails } from '../services/api';
import { ArrowLeftIcon, ClockIcon, CalendarDaysIcon, StarIcon, BanknotesIcon, ArrowTrendingUpIcon, TvIcon, FilmIcon } from '@heroicons/react/24/solid';

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
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id, type } = movieDetails;

  useEffect(() => {
    if (!id || !type) return;
    setLoading(true);
    setError('');
    getDetails(type, id)
      .then(data => {
        setItem(data);
        if (data.backdrop_path) {
          const img = new Image();
          img.src = `https://image.tmdb.org/t/p/w1280${data.backdrop_path}`;
        }
      })
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

  if (error) { return <p className="text-xl text-amber-500 bg-amber-950/50 px-6 py-3 rounded-lg">{error}</p>; }
  if (!item) return null;

  const posterUrl = item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'https://placehold.co/500x750/0f172a/94a3b8?text=Cinesorte';
  const backdropUrl = item.backdrop_path ? `https://image.tmdb.org/t/p/w1280${item.backdrop_path}` : '';
  
  const title = item.title || item.name;
  const releaseDate = item.release_date || item.first_air_date;
  const releaseYear = releaseDate ? new Date(releaseDate).getFullYear() : 'N/A';
  
  const director = item.credits?.crew.find(person => person.job === 'Director');
  const creators = item.created_by?.map(creator => creator.name).join(', ');
  const mainCast = item.credits?.cast.slice(0, 8);
  
  const runtime = item.runtime || (item.episode_run_time ? item.episode_run_time[0] : null);
  const runtimeText = runtime ? `${Math.floor(runtime / 60)}h ${runtime % 60}m` : 'N/A';

  const formatCurrency = (amount) => {
    if (!amount) return 'Não divulgado';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);
  };
  
  const translateStatus = (status) => {
    if (!status) return 'N/A';
    const statusMap = {
      'Rumored': 'Rumor', 'Planned': 'Planejado', 'In Production': 'Em Produção', 'Post Production': 'Pós-Produção', 'Released': 'Lançado', 'Canceled': 'Cancelado', 'Returning Series': 'Em Exibição', 'Ended': 'Finalizada'
    };
    return statusMap[status] || status;
  };

  const providers = item['watch/providers']?.results?.BR?.flatrate || [];
  const productionCompanies = item.production_companies;

  return (
    <div className="w-full max-w-7xl bg-slate-900 rounded-2xl shadow-2xl shadow-black/60 border border-slate-800 animate-fade-in overflow-hidden">
      <div className="relative">
        <div className="absolute inset-0 z-0">
          {backdropUrl && (
            <img src={backdropUrl} alt="" className="w-full h-full object-cover object-center blur-md scale-110 opacity-30" />
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
                <span>{releaseYear}</span>
                <span className="w-1.5 h-1.5 bg-slate-500 rounded-full"></span>
                <span>{type === 'tv' ? 'Série' : 'Filme'}</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white text-shadow-lg mt-2">{title}</h2>
              {item.tagline && <p className="text-slate-400 italic text-lg mt-2 text-shadow max-w-2xl">"{item.tagline}"</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 p-6 sm:p-8">
        <aside className="lg:col-span-4 xl:col-span-3 space-y-8">
          <img src={posterUrl} alt={`Pôster de ${title}`} className="w-full rounded-lg shadow-2xl shadow-black/70" />
          
          {providers.length > 0 && (
            <section>
              <SectionHeader title="Disponível em" />
              <div className="flex flex-wrap gap-4">
                {providers.map(provider => (
                  <img key={provider.provider_id} src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`} alt={provider.provider_name} className="w-12 h-12 rounded-lg transition-transform hover:scale-110" title={provider.provider_name} />
                ))}
              </div>
            </section>
          )}

          <section>
            <SectionHeader title="Detalhes" />
            <div className="space-y-3 bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
              <InfoPill label="Nota" value={item.vote_average?.toFixed(1) || 'N/A'} />
              <InfoPill label={type === 'tv' ? 'Duração (Ep.)' : 'Duração'} value={runtimeText} />
              {type === 'movie' && <InfoPill label="Lançamento" value={releaseDate ? new Date(releaseDate).toLocaleDateString('pt-BR') : 'N/A'} />}
              {type === 'tv' && <InfoPill label="Temporadas" value={item.number_of_seasons || 'N/A'} />}
              <InfoPill label="Status" value={translateStatus(item.status)} />
            </div>
          </section>

          {type === 'movie' && (item.budget > 0 || item.revenue > 0) && (
            <section>
              <SectionHeader title="Financeiro" />
              <div className="space-y-3 bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
                <InfoPill label="Orçamento" value={formatCurrency(item.budget)} />
                <InfoPill label="Receita" value={formatCurrency(item.revenue)} />
              </div>
            </section>
          )}
        </aside>

        <main className="lg:col-span-8 xl:col-span-9 space-y-12">
          <section>
            <SectionHeader title="Sinopse" />
            <p className="text-slate-300 leading-relaxed text-base prose prose-invert max-w-none">
              {item.overview || "Sinopse não disponível."}
            </p>
            <div className="flex flex-wrap gap-2 justify-start mt-4">
              {item.genres.map(genre => (
                <span key={genre.id} className="bg-slate-800 text-slate-300 text-xs font-semibold px-2.5 py-1 rounded-full">{genre.name}</span>
              ))}
            </div>
          </section>

          {(director || creators) && (
            <p className="text-base text-slate-300 -mt-6">
              <strong className="text-slate-400">{director ? "Direção: " : "Criação: "}</strong>
              {director?.name || creators}
            </p>
          )}

          {mainCast && mainCast.length > 0 && (
            <section>
              <SectionHeader title="Elenco Principal" />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-6">
                {mainCast.map(actor => <ActorCard key={actor.cast_id} actor={actor} />)}
              </div>
            </section>
          )}
          
          {productionCompanies && productionCompanies.length > 0 && (
            <section>
              <SectionHeader title="Produção" />
              <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                {productionCompanies.map(company => company.logo_path && (
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
  );
};

export default MovieDetails;

