import React, { useState, useEffect } from "react";
import MovieSearchBar from "../components/MovieSearchBar";
import MovieCard from "../components/MovieCard";
import RouletteSpinner from "../components/RouletterSpinner";
import {
  XCircleIcon,
  FilmIcon,
  TrashIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/solid";
import {
  getUserLists,
  saveUserList,
  deleteUserList,
  removeMovieFromList,
  getProviders,
} from "../services/api";
import { Tooltip } from "react-tooltip";

const CustomListView = ({ onShowDetails }) => {
  const [lists, setLists] = useState([]);
  const [activeListId, setActiveListId] = useState(null);
  const [newListName, setNewListName] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [watchProviders, setWatchProviders] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [recentlySpun, setRecentlySpun] = useState([]);

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      setLoading(true);
      const userLists = await getUserLists();
      setLists(userLists);
      if (userLists.length > 0 && !activeListId) {
        setActiveListId(userLists[0].id);
      }
    } catch (err) {
      setError("Falha ao carregar suas listas.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateList = async (e) => {
    e.preventDefault();
    if (!newListName.trim()) {
      setError("O nome da lista não pode ser vazio.");
      return;
    }
    setError("");
    try {
      await saveUserList(newListName.trim(), []);
      setNewListName("");
      await fetchLists();
      setActiveListId(newListName.trim());
    } catch (err) {
      setError("Falha ao criar a lista.");
    }
  };

  const activeList = lists.find((list) => list.id === activeListId);

  const handleAddMovie = async (movie) => {
    if (!activeList) {
      setError("Crie ou selecione uma lista primeiro.");
      return;
    }
    setError("");
    const updatedMovies = [...activeList.movies, movie];
    try {
      await saveUserList(activeList.id, updatedMovies);
      fetchLists();
    } catch (err) {
      setError("Falha ao adicionar o item.");
    }
  };

  const handleRemoveMovie = async (movieId) => {
    setError("");
    try {
      await removeMovieFromList(activeList.id, movieId);
      fetchLists();
    } catch (err) {
      setError("Falha ao remover o item.");
    }
  };

  const handleDeleteList = async (listId) => {
    if (
      window.confirm(
        `Tem certeza que quer deletar a lista "${listId}"? Esta ação não pode ser desfeita.`
      )
    ) {
      setError("");
      try {
        await deleteUserList(listId);
        setActiveListId(null);
        await fetchLists();
      } catch (err) {
        setError("Falha ao deletar a lista.");
      }
    }
  };

  const handleSpinCustomList = () => {
    setError("");
    if (!activeList || activeList.movies.length < 2) {
      setError("Sua lista ativa precisa de pelo menos 2 itens para sortear.");
      return;
    }

    let availableMovies = activeList.movies.filter(
      (movie) => !recentlySpun.includes(movie.id)
    );

    if (availableMovies.length === 0) {
      setRecentlySpun([]);
      availableMovies = activeList.movies;
    }

    setIsSpinning(true);
    setSelectedItem(null);
    setWatchProviders(null);

    setTimeout(async () => {
      const randomIndex = Math.floor(Math.random() * availableMovies.length);
      const chosenMovie = availableMovies[randomIndex];
      const mediaType =
        chosenMovie.media_type || (chosenMovie.title ? "movie" : "tv");

      const providers = await getProviders(mediaType, chosenMovie.id);
      setWatchProviders(providers);

      setSelectedItem(chosenMovie);
      setRecentlySpun((prev) => [...prev, chosenMovie.id]);
      setIsSpinning(false);
    }, 3000);
  };

  const renderTooltipContent = (movie) => {
    const posterUrl = movie.poster_path
      ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
      : "";
    const overview = movie.overview
      ? movie.overview.substring(0, 120) + "..."
      : "Sinopse não disponível.";
    const vote = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";

    return `
      <div style="display: flex; gap: 12px; max-width: 320px; align-items: flex-start; text-align: left;">
        ${
          posterUrl
            ? `<img src="${posterUrl}" style="width: 80px; border-radius: 6px; flex-shrink: 0;" />`
            : ""
        }
        <div style="display: flex; flex-direction: column;">
          <h4 style="font-weight: bold; font-size: 14px; margin: 0 0 8px 0;">
            Nota: <span style="color: #facc15;">★</span> ${vote}
          </h4>
          <p style="font-size: 12px; color: #cbd5e1; margin: 0; line-height: 1.5;">
            ${overview}
          </p>
        </div>
      </div>
    `;
  };

  if (loading) {
    return (
      <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 lg:gap-12 animate-fade-in">
      <div className="lg:w-2/5 lg:max-w-md flex-shrink-0 space-y-6">
        <section className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50">
          <h2 className="text-xl font-bold text-white mb-4">
            Gerencie Suas Listas
          </h2>
          <form onSubmit={handleCreateList} className="flex gap-2">
            <input
              type="text"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              placeholder="Nome da nova lista..."
              className="flex-grow p-3 bg-slate-800 rounded-md border border-slate-700 focus:ring-2 focus:ring-cyan-500 outline-none"
            />
            <button
              type="submit"
              className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold p-3 rounded-md transition-colors"
            >
              <PlusCircleIcon className="w-6 h-6" />
            </button>
          </form>
          {lists.length > 0 && (
            <div className="mt-4">
              <label
                htmlFor="active-list-select"
                className="text-sm font-medium text-slate-400 mb-2 block"
              >
                Selecione uma lista para sortear:
              </label>
              <select
                id="active-list-select"
                value={activeListId || ""}
                onChange={(e) => setActiveListId(e.target.value)}
                className="w-full p-3 bg-slate-800 rounded-md border border-slate-700 focus:ring-2 focus:ring-cyan-500 outline-none"
              >
                <option value="" disabled>
                  Escolha uma lista
                </option>
                {lists.map((list) => (
                  <option key={list.id} value={list.id}>
                    {list.id}
                  </option>
                ))}
              </select>
            </div>
          )}
        </section>

        <section
          className={`bg-slate-800/50 p-6 rounded-xl border border-slate-700/50 transition-opacity ${
            !activeList ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white truncate pr-2">
              Lista atual:{" "}
              <span className="text-cyan-400">
                {activeList ? activeList.id : "..."}
              </span>
            </h2>
            {activeList && (
              <button
                onClick={() => handleDeleteList(activeList.id)}
                className="text-slate-500 hover:text-red-500 flex items-center gap-1 text-xs flex-shrink-0"
              >
                <TrashIcon className="w-4 h-4" /> Deletar
              </button>
            )}
          </div>
          <MovieSearchBar
            onAddMovie={handleAddMovie}
            customList={activeList?.movies || []}
          />
          <div className="mt-4 space-y-2 max-h-80 overflow-y-auto pr-2">
            {!activeList ? (
              <div className="flex flex-col items-center justify-center text-center text-slate-500 h-full py-10">
                <p>Selecione uma lista acima para começar.</p>
              </div>
            ) : activeList.movies.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center text-slate-500 h-full py-10">
                <FilmIcon className="w-16 h-16 mb-4" />
                <p>
                  A lista "{activeList.id}" está vazia. Use a busca para
                  adicionar itens.
                </p>
              </div>
            ) : (
              activeList.movies.map((movie) => (
                <li
                  key={movie.id}
                  data-tooltip-id="movie-tooltip"
                  data-tooltip-html={renderTooltipContent(movie)}
                  className="flex items-center justify-between p-2 list-none bg-slate-700/50 rounded-md animate-fade-in"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-14 bg-slate-900 rounded-sm flex-shrink-0 flex items-center justify-center">
                      <img
                        src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                        alt={movie.title || movie.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <p className="text-sm truncate flex-grow min-w-0">
                      {movie.title || movie.name}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveMovie(movie.id)}
                    className="text-slate-500 hover:text-red-500 ml-2 flex-shrink-0"
                  >
                    <XCircleIcon className="w-6 h-6" />
                  </button>
                </li>
              ))
            )}
          </div>
        </section>
      </div>

      <section className="flex-grow flex items-center justify-center rounded-xl min-h-[60vh] lg:min-h-0 bg-slate-800/20 border border-dashed border-slate-700 p-8">
        {isSpinning && <RouletteSpinner movies={activeList?.movies || []} />}
        {!isSpinning && !selectedItem && (
          <div className="text-center">
            <button
              onClick={handleSpinCustomList}
              disabled={!activeList || activeList.movies.length < 2}
              className="bg-cyan-500 text-slate-900 font-bold text-2xl py-4 px-10 rounded-full transition-all duration-300 ease-in-out hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/30 transform hover:scale-105 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            >
              Girar o Cinesorte
            </button>
            {error && <p className="mt-4 text-amber-400">{error}</p>}
            {activeList && activeList.movies.length < 2 && (
              <p className="mt-4 text-slate-400">
                Adicione pelo menos mais {2 - activeList.movies.length} item
                para poder sortear!
              </p>
            )}
          </div>
        )}
        {selectedItem && (
          <div className="flex flex-col items-center gap-6 w-full">
            <MovieCard
              item={selectedItem}
              allGenres={[]}
              watchProviders={watchProviders}
              onShowDetails={onShowDetails}
            />
            <button
              onClick={handleSpinCustomList}
              className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-full transition-colors duration-300"
            >
              Girar o Cinesorte
            </button>
          </div>
        )}
      </section>
      <Tooltip
        id="movie-tooltip"
        style={{
          backgroundColor: "#1e293b",
          color: "#e2e8f0",
          borderRadius: "8px",
        }}
        border="1px solid #334155"
      />
    </div>
  );
};

export default CustomListView;
