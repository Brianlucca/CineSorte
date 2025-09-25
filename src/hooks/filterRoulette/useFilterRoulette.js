import { useState } from 'react';
import { discoverMedia, getProviders } from '../../services/api';

export const useFilterRoulette = (mediaType, filters) => {
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
        setError('Nenhum resultado encontrado. Tente filtros mais abertos.');
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
      setError('Falha ao buscar. Tente novamente.');
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    selectedItem,
    isSpinning,
    watchProviders,
    handleSpinRoulette,
  };
};
