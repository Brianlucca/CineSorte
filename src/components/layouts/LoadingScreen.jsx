import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="bg-slate-900 min-h-screen flex flex-col items-center justify-center text-center text-slate-300 font-sans">
      <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tighter">
        Cine<span className="text-cyan-400">sorte</span>
      </h1>
      <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin my-8"></div>
      <p className="text-lg tracking-wider text-slate-400">
        Acordando os servidores... Isso pode levar um instante.
      </p>
    </div>
  );
};

export default LoadingScreen;