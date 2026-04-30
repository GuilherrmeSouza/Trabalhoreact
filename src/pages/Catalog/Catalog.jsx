import { useEffect, useMemo, useState } from 'react';
import MediaCard from '../../components/MediaCard/MediaCard';
import Skeleton from '../../components/Skeleton/Skeleton';
import {
  getMovieGenres,
  getPopularMovies,
  getPopularSeries,
  getTopRatedMovies,
  getTopRatedSeries,
  getTvGenres,
} from '../../services/api';
import { getYear } from '../../utils/format';
import styles from './Catalog.module.css';

function Catalog({ type }) {
  const [mode, setMode] = useState('popular');
  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = type === 'movie' ? await getMovieGenres() : await getTvGenres();
        setGenres(data.genres || []);
      } catch (err) {
        setGenres([]);
      }
    };

    fetchGenres();
  }, [type]);

  useEffect(() => {
    setMode('popular');
    setPage(1);
    setSelectedGenre('');
  }, [type]);

  useEffect(() => {
    const fetchCatalog = async () => {
      setLoading(true);
      setError(false);
      try {
        const data = await (type === 'movie'
          ? mode === 'popular'
            ? getPopularMovies(page)
            : getTopRatedMovies(page)
          : mode === 'popular'
            ? getPopularSeries(page)
            : getTopRatedSeries(page));

        setItems(data.results || []);
        setTotalPages(Math.min(data.total_pages || 1, 500));
        setTotalResults(data.total_results || 0);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
  }, [type, mode, page]);

  const filteredItems = useMemo(() => {
    if (!selectedGenre) return items;
    const id = Number(selectedGenre);
    return items.filter((item) => item.genre_ids?.includes(id));
  }, [items, selectedGenre]);

  const handlePageChange = (nextPage) => {
    if (nextPage < 1 || nextPage > totalPages) return;
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const pageTitle = type === 'movie' ? 'Filmes' : 'Series';

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div>
          <p className={styles.kicker}>Catalogo</p>
          <h1>{pageTitle}</h1>
          <p className={styles.subtitle}>Descubra titulos populares e bem avaliados.</p>
        </div>
        <button
          type="button"
          className={styles.filterToggle}
          onClick={() => setFiltersOpen((prev) => !prev)}
        >
          Filtros
        </button>
      </header>

      <div className={styles.layout}>
        <aside className={`${styles.filters} ${filtersOpen ? styles.open : ''}`}>
          <div className={styles.filterGroup}>
            <h3>Ordenar</h3>
            <button
              type="button"
              className={mode === 'popular' ? styles.active : ''}
              onClick={() => {
                setMode('popular');
                setPage(1);
              }}
            >
              Populares
            </button>
            <button
              type="button"
              className={mode === 'top_rated' ? styles.active : ''}
              onClick={() => {
                setMode('top_rated');
                setPage(1);
              }}
            >
              Mais bem avaliados
            </button>
          </div>

          <div className={styles.filterGroup}>
            <h3>Genero</h3>
            <select
              value={selectedGenre}
              onChange={(event) => {
                setSelectedGenre(event.target.value);
                setPage(1);
              }}
            >
              <option value="">Todos</option>
              {genres.map((genre) => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>
          </div>

          <p className={styles.count}>{totalResults} titulos encontrados</p>
        </aside>

        <section className={styles.results}>
          {error && <p className={styles.error}>Erro ao carregar catalogo.</p>}
          <div className={styles.grid}>
            {loading
              ? Array.from({ length: 12 }).map((_, index) => (
                  <div className={styles.cardSlot} key={`skeleton-${index}`}>
                    <Skeleton className={styles.skeletonCard} />
                    <Skeleton className={styles.skeletonText} />
                  </div>
                ))
              : filteredItems.map((item) => (
                  <MediaCard
                    key={item.id}
                    id={item.id}
                    title={item.title || item.name}
                    posterPath={item.poster_path}
                    rating={item.vote_average}
                    year={getYear(item.release_date || item.first_air_date)}
                    type={type}
                    genreIds={item.genre_ids}
                    allGenres={genres}
                  />
                ))}
          </div>

          <div className={styles.pagination}>
            <button type="button" onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
              Anterior
            </button>
            <span>
              Pagina {page} de {totalPages}
            </span>
            <button
              type="button"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
            >
              Proxima
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Catalog;
