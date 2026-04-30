import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import MediaCard from '../../components/MediaCard/MediaCard';
import SearchBar from '../../components/SearchBar/SearchBar';
import Skeleton from '../../components/Skeleton/Skeleton';
import { getMovieGenres, getTvGenres, searchMulti } from '../../services/api';
import { useDebounce } from '../../hooks/useDebounce';
import { getYear } from '../../utils/format';
import styles from './Search.module.css';

function Search() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const query = params.get('q') || '';
  const [input, setInput] = useState(query);
  const debouncedQuery = useDebounce(query, 400);
  const [results, setResults] = useState([]);
  const [movieGenres, setMovieGenres] = useState([]);
  const [tvGenres, setTvGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setInput(query);
  }, [query]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const [movieData, tvData] = await Promise.all([getMovieGenres(), getTvGenres()]);
        setMovieGenres(movieData.genres || []);
        setTvGenres(tvData.genres || []);
      } catch (err) {
        setMovieGenres([]);
        setTvGenres([]);
      }
    };

    fetchGenres();
  }, []);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(false);
    searchMulti(debouncedQuery)
      .then((data) => {
        const filtered = data.results.filter(
          (item) => item.media_type === 'movie' || item.media_type === 'tv'
        );
        setResults(filtered);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [debouncedQuery]);

  const allGenres = useMemo(() => {
    const map = new Map();
    movieGenres.forEach((genre) => map.set(genre.id, genre));
    tvGenres.forEach((genre) => map.set(genre.id, genre));
    return Array.from(map.values());
  }, [movieGenres, tvGenres]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!input.trim()) return;
    navigate(`/buscar?q=${encodeURIComponent(input.trim())}`);
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Buscar</h1>
        <SearchBar
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onSubmit={handleSubmit}
          placeholder="Buscar filmes e series..."
          autoFocus
        />
      </header>

      {error && <p className={styles.error}>Erro ao carregar resultados.</p>}

      <section className={styles.results}>
        {loading
          ? Array.from({ length: 10 }).map((_, index) => (
              <div className={styles.cardSlot} key={`skeleton-${index}`}>
                <Skeleton className={styles.skeletonCard} />
                <Skeleton className={styles.skeletonText} />
              </div>
            ))
          : results.map((item) => (
              <MediaCard
                key={`${item.media_type}-${item.id}`}
                id={item.id}
                title={item.title || item.name}
                posterPath={item.poster_path}
                rating={item.vote_average}
                year={getYear(item.release_date || item.first_air_date)}
                type={item.media_type}
                genreIds={item.genre_ids}
                allGenres={allGenres}
              />
            ))}
      </section>

      {!loading && !results.length && query && (
        <p className={styles.empty}>Nenhum resultado para "{query}"</p>
      )}
    </div>
  );
}

export default Search;
