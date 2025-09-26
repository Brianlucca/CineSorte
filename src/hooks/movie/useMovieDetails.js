import { useState, useEffect } from 'react';
import { getDetails } from '../../services/api';

export const useMovieDetails = (id, type) => {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id || !type) {
      setLoading(false);
      return;
    }

    const fetchDetails = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getDetails(type, id);
        setItem(data);
        if (data.backdrop_path) {
          const img = new Image();
          img.src = `https://image.tmdb.org/t/p/w1280${data.backdrop_path}`;
        }
      } catch (err) {
        setError('Não foi possível carregar os detalhes.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, type]);

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

  const details = item ? {
    posterUrl: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'https://placehold.co/500x750/0f172a/94a3b8?text=Cinesorte',
    backdropUrl: item.backdrop_path ? `https://image.tmdb.org/t/p/w1280${item.backdrop_path}` : '',
    title: item.title || item.name,
    tagline: item.tagline,
    overview: item.overview,
    genres: item.genres || [],
    releaseDate: item.release_date || item.first_air_date,
    releaseYear: item.release_date || item.first_air_date ? new Date(item.release_date || item.first_air_date).getFullYear() : 'N/A',
    director: item.credits?.crew.find(person => person.job === 'Director'),
    creators: item.created_by?.map(creator => creator.name).join(', '),
    mainCast: item.credits?.cast.slice(0, 8),
    runtimeText: (() => {
      const runtime = item.runtime || (item.episode_run_time ? item.episode_run_time[0] : null);
      return runtime ? `${Math.floor(runtime / 60)}h ${runtime % 60}m` : 'N/A';
    })(),
    voteAverage: item.vote_average?.toFixed(1) || 'N/A',
    numberOfSeasons: item.number_of_seasons || 'N/A',
    status: translateStatus(item.status),
    budget: formatCurrency(item.budget),
    revenue: formatCurrency(item.revenue),
    providers: item['watch/providers']?.results?.BR?.flatrate || [],
    productionCompanies: item.production_companies,
    trailer: item.trailer,
  } : null;

  return { loading, error, details, rawItem: item };
};

