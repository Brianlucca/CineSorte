import React, { useState, useEffect } from 'react';
import Home from "./views/Home";
import LoadingScreen from './components/layouts/LoadingScreen';
import { getGenres } from './services/api';

function App() {
  const [genres, setGenres] = useState({ movie: [], tv: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const maxRetries = 5;
    let attempt = 1;

    const fetchInitialData = async () => {
      try {
        const movieGenres = await getGenres('movie');
        const tvGenres = await getGenres('tv');
        setGenres({ movie: movieGenres, tv: tvGenres });
        setIsLoading(false);
        setError(null);
      } catch (error) {
        if (attempt < maxRetries) {
          attempt++;
          setTimeout(fetchInitialData, 3000);
        } else {
          setError("Não foi possível ligar ao servidor. Tente atualizar a página dentro de momentos.");
          setIsLoading(false);
        }
      }
    };

    fetchInitialData();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="bg-slate-900 min-h-screen flex items-center justify-center text-center text-amber-500 p-4">
        <div className="bg-amber-950/50 px-8 py-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-2">Ups! Algo correu mal.</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 min-h-screen text-slate-300 font-sans">
      <Home genres={genres} />
    </div>
  );
}

export default App;

