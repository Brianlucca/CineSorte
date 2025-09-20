import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

export const loginUser = async (email, password) => {
  const { data } = await apiClient.post('/users/login', { email, password });
  return data;
};

export const registerUser = async (name, email, password) => {
  const { data } = await apiClient.post('/users/register', { name, email, password });
  return data;
};

export const logoutUser = async () => {
  const { data } = await apiClient.post('/users/logout');
  return data;
};

export const getMe = async () => {
  const { data } = await apiClient.get('/users/me');
  return data;
};

export const discoverMedia = async (mediaType, filters) => {
  const { data } = await apiClient.post('/tmdb/discover', { mediaType, filters });
  return data;
};

export const searchMulti = async (query) => {
  const { data } = await apiClient.get('/tmdb/search', { params: { query } });
  return data;
};
 
export const getDetails = async (mediaType, id) => {
  const { data } = await apiClient.get(`/tmdb/details/${mediaType}/${id}`);
  return data;
};

export const getProviders = async (mediaType, id) => {
  const { data } = await apiClient.get(`/tmdb/providers/${mediaType}/${id}`);
  return data;
};
 
export const getGenres = async (mediaType) => {
  const { data } = await apiClient.get(`/tmdb/genres/${mediaType}`);
  return data;
};
 
export const saveUserList = async (listName, movies) => {
  const { data } = await apiClient.post('/users/lists', { listName, movies });
  return data;
};
 
export const getUserLists = async () => {
  const { data } = await apiClient.get('/users/lists');
  return data;
};

export const deleteUserList = async (listId) => {
  const { data } = await apiClient.delete(`/users/lists/${listId}`);
  return data;
};

export const removeMovieFromList = async (listId, movieId) => {
  const { data } = await apiClient.delete(`/users/lists/${listId}/movies/${movieId}`);
  return data;
};