import React, { useState, useEffect } from "react";

const RouletteSpinner = ({ movies }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (movies.length === 0) return;

    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
    }, 100);

    return () => clearInterval(intervalId);
  }, [movies]);

  const currentMovie = movies[currentIndex];
  if (!currentMovie) return null;

  const posterUrl = `https://image.tmdb.org/t/p/w500${currentMovie.poster_path}`;

  return (
    <div className="flex flex-col items-center justify-center text-center gap-6">
      <div className="relative w-48 h-72 rounded-lg overflow-hidden shadow-2xl shadow-black/50 bg-slate-800">
        <img
          key={currentMovie.id}
          src={posterUrl}
          alt="Pôster girando"
          className="w-full h-full object-cover animate-image-spin"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
      </div>
      <p className="text-2xl font-bold text-white tracking-widest animate-pulse">
        Sorteando...
      </p>
    </div>
  );
};

export default RouletteSpinner;
