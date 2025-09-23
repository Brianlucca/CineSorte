import React, { useState, useEffect } from "react";
import {
  ListBulletIcon,
  AdjustmentsHorizontalIcon,
  FilmIcon,
  TvIcon,
  FunnelIcon,
} from "@heroicons/react/24/solid";

const CustomSelect = ({ label, name, value, onChange, children }) => (
  <div className="relative">
    <label
      htmlFor={name}
      className="block text-sm font-medium text-slate-400 mb-2"
    >
      {label}
    </label>
    <select
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      className="w-full appearance-none p-3 bg-slate-800 rounded-md border border-slate-700 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
    >
      {children}
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-0 top-7 flex items-center px-2 text-slate-400">
      <svg
        className="h-5 w-5"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  </div>
);

const RangeSlider = ({
  label,
  name,
  value,
  min,
  max,
  step,
  onChange,
  unit = "",
}) => {
  const percentage = ((value - min) / (max - min)) * 100;

  const progressStyle = {
    background: `linear-gradient(to right, #06b6d4 ${percentage}%, #334155 ${percentage}%)`,
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label htmlFor={name} className="font-medium text-slate-400 text-sm">
          {label}
        </label>
        <span className="font-mono font-bold text-cyan-400 bg-slate-900/70 px-2 py-1 rounded-md text-xs border border-slate-700">
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        name={name}
        id={name}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        style={progressStyle}
        className="w-full h-2 rounded-lg appearance-none cursor-pointer
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:-mt-1
          [&::-webkit-slider-thumb]:h-4
          [&::-webkit-slider-thumb]:w-4
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-slate-200
          [&::-webkit-slider-thumb]:border-4
          [&::-webkit-slider-thumb]:border-cyan-500
          [&::-webkit-slider-thumb]:shadow-lg
          [&::-webkit-slider-thumb]:transition-transform
          [&::-webkit-slider-thumb]:active:scale-125

          [&::-moz-range-thumb]:appearance-none
          [&::-moz-range-thumb]:h-4
          [&::-moz-range-thumb]:w-4
          [&::-moz-range-thumb]:rounded-full
          [&::-moz-range-thumb]:bg-slate-200
          [&::-moz-range-thumb]:border-4
          [&::-moz-range-thumb]:border-cyan-500
          [&::-moz-range-thumb]:shadow-lg
          [&::-moz-range-thumb]:transition-transform
          [&::-moz-range-thumb]:active:scale-125
        "
      />
    </div>
  );
};

const ToggleSwitch = ({ label, name, checked, onChange }) => (
  <label
    htmlFor={name}
    className="flex items-center justify-between cursor-pointer"
  >
    <span className="font-medium text-slate-400 text-sm">{label}</span>
    <div className="relative inline-flex items-center">
      <input
        type="checkbox"
        id={name}
        name={name}
        checked={checked}
        onChange={onChange}
        className="sr-only peer"
      />
      <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-focus:ring-2 peer-focus:ring-cyan-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
    </div>
  </label>
);

const FilterSidebar = ({
  onFilterChange,
  initialFilters,
  genres,
  onMediaTypeChange,
  mediaType,
}) => {
  const [localFilters, setLocalFilters] = useState(initialFilters);

  useEffect(() => {
    onFilterChange(localFilters);
  }, [localFilters, onFilterChange]);

  useEffect(() => {
    setLocalFilters((prev) => ({
      ...initialFilters,
      genre: "",
      keywords: [],
    }));
  }, [mediaType]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLocalFilters((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const years = Array.from(
    { length: new Date().getFullYear() - 1949 },
    (_, i) => new Date().getFullYear() - i
  );

  return (
    <div className="w-full max-w-lg mx-auto text-sm">
      <div className="flex items-center gap-3 mb-6">
        <FunnelIcon className="w-7 h-7 sm:w-8 sm:h-8 text-cyan-400" />
        <h2 className="text-2xl sm:text-3xl font-bold text-white">
          Filtros e Opções
        </h2>
      </div>

      <div className="bg-slate-800/50 rounded-xl border border-slate-700/50">
        <div className="p-1.5 m-2 sm:m-3 bg-slate-900/70 rounded-xl border border-slate-700/50">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onMediaTypeChange("movie")}
              className={`flex items-center justify-center gap-2 px-4 py-2 font-bold rounded-lg transition-colors text-xs sm:text-base ${
                mediaType === "movie"
                  ? "bg-cyan-500 text-slate-900 shadow-lg shadow-cyan-500/20"
                  : "bg-transparent text-slate-300 hover:bg-slate-700"
              }`}
            >
              <FilmIcon className="w-5 h-5" /> Filmes
            </button>
            <button
              type="button"
              onClick={() => onMediaTypeChange("tv")}
              className={`flex items-center justify-center gap-2 px-4 py-2 font-bold rounded-lg transition-colors text-xs sm:text-base ${
                mediaType === "tv"
                  ? "bg-cyan-500 text-slate-900 shadow-lg shadow-cyan-500/20"
                  : "bg-transparent text-slate-300 hover:bg-slate-700"
              }`}
            >
              <TvIcon className="w-5 h-5" /> Séries
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-5 space-y-8">
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-cyan-400">
              <ListBulletIcon className="w-6 h-6" />
              <h3 className="text-base sm:text-lg font-bold text-white">
                Detalhes
              </h3>
            </div>
            <CustomSelect
              label="Ordenar por"
              name="sortBy"
              value={localFilters.sortBy}
              onChange={handleChange}
            >
              <option value="popularity.desc">Mais Populares</option>
              <option value="vote_average.desc">Melhores Notas</option>
              {mediaType === "movie" ? (
                <option value="primary_release_date.desc">
                  Lançamentos Recentes
                </option>
              ) : (
                <option value="first_air_date.desc">
                  Lançamentos Recentes
                </option>
              )}
              {mediaType === "movie" && (
                <option value="revenue.desc">Maior Bilheteria</option>
              )}
              <option value="vote_count.desc">Mais Votados</option>
            </CustomSelect>
            <CustomSelect
              label="Gênero"
              name="genre"
              value={localFilters.genre}
              onChange={handleChange}
            >
              <option value="">Todos os Gêneros</option>
              {Array.isArray(genres) &&
                genres.map((genre) => (
                  <option key={genre.id} value={genre.id}>
                    {genre.name}
                  </option>
                ))}
            </CustomSelect>
            <CustomSelect
              label="Ano de Lançamento"
              name="releaseYear"
              value={localFilters.releaseYear}
              onChange={handleChange}
            >
              <option value="">Qualquer Ano</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </CustomSelect>
          </div>

          <hr className="border-slate-700/50" />

          <div className="space-y-6">
            <div className="flex items-center gap-3 text-cyan-400">
              <AdjustmentsHorizontalIcon className="w-6 h-6" />
              <h3 className="text-base sm:text-lg font-bold text-white">
                Preferências
              </h3>
            </div>
            <RangeSlider
              label="Nota Mínima"
              name="voteAverageGte"
              min="0"
              max="10"
              step="0.5"
              value={localFilters.voteAverageGte}
              onChange={handleChange}
            />
            <RangeSlider
              label="Duração Máxima"
              name="runtimeLte"
              min="30"
              max="240"
              step="15"
              value={localFilters.runtimeLte}
              onChange={handleChange}
              unit=" min"
            />
            <ToggleSwitch
              label="Excluir Animações"
              name="excludeAnimation"
              checked={localFilters.excludeAnimation}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
