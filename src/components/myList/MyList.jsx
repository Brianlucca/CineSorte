import React from "react";
import MovieCard from "../movie/MovieCard";
import RouletteSpinner from "../rouletter/RouletterSpinner";
import MovieSearchBar from "../movie/MovieSearchBar";
import {
  XCircleIcon,
  FilmIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  BookmarkIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/solid";
import { useMyList } from "../../hooks/myList/useMyList";

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in-fast">
      <div className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700 w-full max-w-md m-4">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-900/50 sm:mx-0">
              <ExclamationTriangleIcon
                className="h-6 w-6 text-red-400"
                aria-hidden="true"
              />
            </div>
            <div className="mt-0 text-left">
              <h3 className="text-base font-semibold leading-6 text-white">
                {title}
              </h3>
              <div className="mt-2">
                <p className="text-sm text-slate-400">{message}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row-reverse gap-3 bg-slate-800/50 px-6 py-4 rounded-b-xl">
          <button
            type="button"
            className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
            onClick={onConfirm}
          >
            Apagar
          </button>
          <button
            type="button"
            className="inline-flex w-full justify-center rounded-md bg-slate-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-600 sm:w-auto"
            onClick={onClose}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

const MyList = ({ onShowDetails }) => {
  const {
    lists,
    activeListId,
    setActiveListId,
    newListName,
    setNewListName,
    selectedItem,
    isSpinning,
    watchProviders,
    error,
    loading,
    showDeleteModal,
    setShowDeleteModal,
    listToDelete,
    handleCreateList,
    activeList,
    handleAddMovie,
    handleRemoveMovie,
    openDeleteModal,
    confirmDeleteList,
    handleSpinCustomList,
  } = useMyList();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 animate-fade-in">
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDeleteList}
        title="Apagar Lista"
        message={`Tem a certeza de que quer apagar a lista "${listToDelete?.id}"? Esta ação não pode ser desfeita.`}
      />

      <aside className="lg:w-1/3 lg:max-w-sm flex-shrink-0 space-y-6">
        <div className="bg-slate-800/50 p-4 sm:p-5 rounded-xl border border-slate-700/50">
          <h2 className="text-xl font-bold text-white mb-4">Gerir Listas</h2>
          <form onSubmit={handleCreateList} className="flex gap-2">
            <input
              type="text"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              placeholder="Nome da nova lista..."
              maxLength="50"
              className="flex-grow p-3 bg-slate-800 rounded-md border border-slate-700 focus:ring-2 focus:ring-cyan-500 outline-none"
            />
            <button
              type="submit"
              className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold p-3 rounded-md transition-colors flex-shrink-0"
            >
              <PlusCircleIcon className="w-6 h-6" />
            </button>
          </form>
        </div>

        <nav className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
          <ul className="space-y-1">
            {lists.map((list) => (
              <li key={list.id}>
                <button
                  onClick={() => setActiveListId(list.id)}
                  className={`w-full flex justify-between items-center text-left p-3 rounded-lg transition-colors ${
                    activeListId === list.id
                      ? "bg-cyan-500/10 text-cyan-300"
                      : "text-slate-300 hover:bg-slate-700/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <BookmarkIcon
                      className={`w-5 h-5 ${
                        activeListId === list.id
                          ? "text-cyan-400"
                          : "text-slate-500"
                      }`}
                    />
                    <span className="font-semibold">{list.id}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-mono bg-slate-700/80 text-slate-400 rounded-full px-2 py-0.5">
                      {list.movies.length}
                    </span>
                    <TrashIcon
                      onClick={(e) => {
                        e.stopPropagation();
                        openDeleteModal(list);
                      }}
                      className="w-5 h-5 text-slate-500 hover:text-red-500 transition-colors"
                    />
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <main className="flex-grow min-w-0">
        <section className="bg-slate-800/50 p-4 sm:p-6 rounded-xl border border-slate-700/50">
          {!activeList ? (
            <div className="flex flex-col items-center justify-center text-center text-slate-500 h-full py-10 min-h-[50vh]">
              <p>Crie ou selecione uma lista para começar.</p>
            </div>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
                <h2 className="text-xl font-bold text-white truncate pr-2">
                  Conteúdo da Lista:{" "}
                  <span className="text-cyan-400">{activeList.id}</span>
                </h2>
                <div className="w-full sm:w-auto sm:max-w-xs">
                  <MovieSearchBar
                    onAddMovie={handleAddMovie}
                    customList={activeList.movies}
                  />
                </div>
              </div>

              <div className="mt-4 space-y-2 max-h-80 overflow-y-auto pr-2 rounded-lg bg-slate-900/40 p-2 border border-slate-700/50">
                {activeList.movies.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center text-slate-500 h-full py-10">
                    <FilmIcon className="w-16 h-16 mb-4" />
                    <p>A lista está vazia. Use a busca para adicionar itens.</p>
                  </div>
                ) : (
                  activeList.movies.map((movie) => (
                    <div
                      key={movie.id}
                      className="flex items-center justify-between p-2 list-none bg-slate-700/50 rounded-md animate-fade-in-fast"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={
                            movie.poster_path
                              ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                              : "https://placehold.co/92x138/0f172a/94a3b8?text=S/P"
                          }
                          alt={movie.title || movie.name}
                          className="w-10 h-14 object-cover rounded-sm flex-shrink-0 bg-slate-900"
                        />
                        <p className="text-sm font-semibold truncate flex-wrap min-w-0">
                          {movie.title || movie.name}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveMovie(movie.id)}
                        className="text-slate-500 hover:text-red-500 ml-2 flex-shrink-0"
                      >
                        <XCircleIcon className="w-6 h-6" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </section>

        <section className="flex-grow flex items-center justify-center rounded-xl min-h-[40vh] mt-8 bg-slate-800/20 border border-dashed border-slate-700 p-8">
          {isSpinning ? (
            <RouletteSpinner movies={activeList?.movies || []} />
          ) : !selectedItem ? (
            <div className="text-center">
              <button
                onClick={handleSpinCustomList}
                disabled={!activeList || activeList.movies.length < 2}
                className="bg-cyan-500 text-slate-900 font-bold text-xl py-4 px-10 rounded-full transition-all duration-300 ease-in-out hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/30 transform hover:scale-105 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
              >
                Girar o Cinesorte
              </button>
              {error && <p className="mt-4 text-amber-400">{error}</p>}
              {activeList && activeList.movies.length < 2 && (
                <p className="mt-4 text-slate-400">
                  Adicione pelo menos {2 - activeList.movies.length} item para
                  sortear!
                </p>
              )}
            </div>
          ) : (
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
                Girar Novamente
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default MyList;
