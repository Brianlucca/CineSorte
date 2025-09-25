import React, { useState } from 'react';
import { BookmarkIcon, XMarkIcon, CheckCircleIcon } from '@heroicons/react/24/solid';

export const AddToListModal = ({ isOpen, onClose, movieToAdd, userLists, onAddToList, isLoading }) => {
  const [addedFeedback, setAddedFeedback] = useState(null);

  if (!isOpen || !movieToAdd) return null;

  const handleAdd = async (list) => {
    await onAddToList(list.id);
    setAddedFeedback(list.id);
    setTimeout(() => {
      setAddedFeedback(null);
      onClose();
    }, 1500);
  };

  const isMovieInList = (list) => {
    return list.movies && list.movies.some(m => m && m.id === movieToAdd.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in-fast" onClick={onClose}>
      <div className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700 w-full max-w-sm m-4" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-slate-700">
          <h3 className="text-lg font-semibold text-white">Adicionar à Lista</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="p-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-24">
              <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : userLists.length > 0 ? (
            <ul className="space-y-2 max-h-64 overflow-y-auto">
              {userLists.map((list) => (
                <li key={list.id}>
                  <button
                    onClick={() => handleAdd(list)}
                    disabled={isMovieInList(list) || addedFeedback === list.id}
                    className="w-full flex justify-between items-center text-left p-3 rounded-lg transition-colors text-slate-300 hover:bg-slate-700/50 disabled:bg-slate-700/50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center gap-3">
                      <BookmarkIcon className="w-5 h-5 text-slate-500" />
                      <span className="font-semibold">{list.id}</span>
                    </div>
                    {addedFeedback === list.id ? (
                      <CheckCircleIcon className="w-6 h-6 text-green-500 animate-fade-in" />
                    ) : isMovieInList(list) && (
                      <span className="text-xs text-slate-400">Já adicionado</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center p-4">
              <p className="text-slate-400">Nenhuma lista encontrada.</p>
              <p className="text-sm text-slate-500 mt-2">Vá para a secção "Minha Lista" para criar uma.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};