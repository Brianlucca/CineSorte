import { useState, useEffect } from "react";
import { getUserLists, saveUserList, deleteUserList, removeMovieFromList, getProviders } from "../../services/api";

export const useMyList = () => {
  const [lists, setLists] = useState([]);
  const [activeListId, setActiveListId] = useState(null);
  const [newListName, setNewListName] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [watchProviders, setWatchProviders] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [recentlySpun, setRecentlySpun] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [listToDelete, setListToDelete] = useState(null);

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
      setError("Falha ao carregar as suas listas.");
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
      const newList = await saveUserList(newListName.trim(), []);
      setNewListName("");
      await fetchLists();
      setActiveListId(newList.id);
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
  
  const openDeleteModal = (list) => {
    setListToDelete(list);
    setShowDeleteModal(true);
  };
  
  const confirmDeleteList = async () => {
    if (!listToDelete) return;
    setError("");
    try {
      await deleteUserList(listToDelete.id);
      setActiveListId(null);
      await fetchLists();
    } catch (err) {
      setError("Falha ao apagar a lista.");
    } finally {
      setShowDeleteModal(false);
      setListToDelete(null);
    }
  };

  const handleSpinCustomList = () => {
    setError("");
    if (!activeList || activeList.movies.length < 2) {
      setError("A sua lista ativa precisa de pelo menos 2 itens para sortear.");
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
      const mediaType = chosenMovie.media_type || (chosenMovie.title ? "movie" : "tv");

      const providers = await getProviders(mediaType, chosenMovie.id);
      setWatchProviders(providers);

      setSelectedItem(chosenMovie);
      setRecentlySpun((prev) => [...prev, chosenMovie.id].slice(0, 10));
      setIsSpinning(false);
    }, 3000);
  };

  return {
    lists, activeListId, setActiveListId, newListName, setNewListName,
    selectedItem, isSpinning, watchProviders, error, loading,
    showDeleteModal, setShowDeleteModal, listToDelete,
    fetchLists, handleCreateList, activeList, handleAddMovie,
    handleRemoveMovie, openDeleteModal, confirmDeleteList, handleSpinCustomList,
  };
};
