import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
export const IMG_BASE = 'https://image.tmdb.org/t/p/w500';
export const IMG_ORIGINAL = 'https://image.tmdb.org/t/p/original';

const isJwt = API_KEY?.split('.').length === 3;

const api = axios.create({
  baseURL: BASE_URL,
  params: isJwt ? { language: 'pt-BR' } : { api_key: API_KEY, language: 'pt-BR' },
  headers: isJwt ? { Authorization: `Bearer ${API_KEY}` } : {},
});

export const getTrending = () => api.get('/trending/all/week').then((r) => r.data);

export const getPopularMovies = (page = 1) =>
  api.get('/movie/popular', { params: { page } }).then((r) => r.data);

export const getTopRatedMovies = (page = 1) =>
  api.get('/movie/top_rated', { params: { page } }).then((r) => r.data);

export const getMovieById = (id) => api.get(`/movie/${id}`).then((r) => r.data);

export const getMovieCredits = (id) =>
  api.get(`/movie/${id}/credits`).then((r) => r.data);

export const getPopularSeries = (page = 1) =>
  api.get('/tv/popular', { params: { page } }).then((r) => r.data);

export const getTopRatedSeries = (page = 1) =>
  api.get('/tv/top_rated', { params: { page } }).then((r) => r.data);

export const getSeriesById = (id) => api.get(`/tv/${id}`).then((r) => r.data);

export const getSeriesCredits = (id) =>
  api.get(`/tv/${id}/credits`).then((r) => r.data);

export const searchMulti = (query, page = 1) =>
  api.get('/search/multi', { params: { query, page } }).then((r) => r.data);

export const getMovieGenres = () =>
  api.get('/genre/movie/list').then((r) => r.data);

export const getTvGenres = () => api.get('/genre/tv/list').then((r) => r.data);
