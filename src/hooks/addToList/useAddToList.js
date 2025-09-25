import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getUserLists, saveUserList } from '../../services/api';

export const useAddToList = () => {
  const { currentUser } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userLists, setUserLists] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [movieToAdd, setMovieToAdd] = useState(null);

  const openModal = async (movie) => {
    if (!currentUser || !movie) return;
    
    setMovieToAdd(movie);
    setIsModalOpen(true);
    setIsLoading(true);
    try {
      const lists = await getUserLists();
      setUserLists(lists);
    } catch (error) {
      console.error("Falha ao buscar as listas para o modal", error);
      setUserLists([]);
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setMovieToAdd(null);
  };

  const addMovieToSelectedList = async (listId) => {
    if (!movieToAdd) {
      console.error("Nenhum filme selecionado para adicionar à lista.");
      return;
    }

    const list = userLists.find(l => l.id === listId);
    if (!list || list.movies.some(m => m.id === movieToAdd.id)) {
      return;
    }

    const updatedMovies = [...list.movies, movieToAdd];
    await saveUserList(listId, updatedMovies);
    
    const updatedLists = await getUserLists();
    setUserLists(updatedLists);
  };

  return {
    isModalOpen,
    openModal,
    closeModal,
    userLists,
    isLoading,
    addMovieToSelectedList,
    movieToAdd,
  };
};
