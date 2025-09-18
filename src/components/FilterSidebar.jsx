import React, { useState } from "react";

const FilterSidebar = ({ onApplyFilters, genresList, closeSidebar }) => {
  const [localFilters, setLocalFilters] = useState({
    sortBy: "popularity.desc",
    genre: "",
    releaseYear: "",
    voteAverageGte: 7,
    runtimeGte: 0,
    runtimeLte: 150,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onApplyFilters(localFilters);
    closeSidebar();
  };

  const years = Array.from(
    { length: new Date().getFullYear() - 1949 },
    (_, i) => new Date().getFullYear() - i
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Filtros</h2>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-6 text-sm">
        <div className="space-y-2">
          <label htmlFor="sortBy" className="font-medium text-slate-400">
            Ordenar Por
          </label>
          <select
            name="sortBy"
            id="sortBy"
            value={localFilters.sortBy}
            onChange={handleChange}
            className="w-full p-2.5 bg-slate-800 rounded-md border border-slate-700 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
          >
            <option value="popularity.desc">Popularidade</option>
            <option value="vote_average.desc">Melhores Notas</option>
            <option value="release_date.desc">Lançamentos Recentes</option>
            <option value="revenue.desc">Maior Bilheteria</option>
          </select>
        </div>
        <div className="space-y-2">
          <label htmlFor="genre" className="font-medium text-slate-400">
            Gênero
          </label>
          <select
            name="genre"
            id="genre"
            value={localFilters.genre}
            onChange={handleChange}
            className="w-full p-2.5 bg-slate-800 rounded-md border border-slate-700 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
          >
            <option value="">Qualquer Gênero</option>
            {genresList.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label htmlFor="releaseYear" className="font-medium text-slate-400">
            Ano de Lançamento
          </label>
          <select
            name="releaseYear"
            id="releaseYear"
            value={localFilters.releaseYear}
            onChange={handleChange}
            className="w-full p-2.5 bg-slate-800 rounded-md border border-slate-700 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
          >
            <option value="">Qualquer Ano</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label
            htmlFor="voteAverageGte"
            className="font-medium text-slate-400 flex justify-between"
          >
            <span>Nota Mínima</span>
            <span className="font-bold text-cyan-400">
              {localFilters.voteAverageGte}
            </span>
          </label>
          <input
            type="range"
            name="voteAverageGte"
            id="voteAverageGte"
            min="0"
            max="10"
            step="0.5"
            value={localFilters.voteAverageGte}
            onChange={handleChange}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer range-thumb"
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="runtimeLte"
            className="font-medium text-slate-400 flex justify-between"
          >
            <span>Duração Máxima</span>
            <span className="font-bold text-cyan-400">
              {localFilters.runtimeLte} min
            </span>
          </label>
          <input
            type="range"
            name="runtimeLte"
            id="runtimeLte"
            min="30"
            max="300"
            step="15"
            value={localFilters.runtimeLte}
            onChange={handleChange}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-4 rounded-md transition-colors duration-300"
        >
          Buscar Filmes
        </button>
      </form>
    </div>
  );
};

export default FilterSidebar;
