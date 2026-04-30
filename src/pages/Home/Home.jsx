import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MediaRow from '../../components/MediaRow/MediaRow';
import RatingCircle from '../../components/RatingCircle/RatingCircle';
import GenreBadge from '../../components/GenreBadge/GenreBadge';
import {
  getMovieGenres,
  getPopularMovies,
  getPopularSeries,
  getTopRatedMovies,
  getTrending,
  getTvGenres,
  IMG_ORIGINAL,
} from '../../services/api';
import { getYear } from '../../utils/format';
import styles from './Home.module.css';

function Home() {
  const navigate = useNavigate();
  const [heroItems, setHeroItems] = useState([]);
  const [heroIndex, setHeroIndex] = useState(0);
  const [sections, setSections] = useState({
    trending: [],
    popularMovies: [],
    popularSeries: [],
    topRatedMovies: [],
  });
  const [movieGenres, setMovieGenres] = useState([]);
  const [tvGenres, setTvGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchHome = async () => {
      setLoading(true);
      setError(false);
      try {
        const [
          trendingData,
          popularMoviesData,
          popularSeriesData,
          topRatedMoviesData,
          movieGenresData,
          tvGenresData,
        ] = await Promise.all([
          getTrending(),
          getPopularMovies(),
          getPopularSeries(),
          getTopRatedMovies(),
          getMovieGenres(),
          getTvGenres(),
        ]);

        const trendingFiltered = trendingData.results.filter(
          (item) => item.media_type === 'movie' || item.media_type === 'tv'
        );
        const heroSlice = trendingFiltered.slice(0, 5);
        setHeroItems(heroSlice);
        setSections({
          trending: trendingFiltered,
          popularMovies: popularMoviesData.results,
          popularSeries: popularSeriesData.results,
          topRatedMovies: topRatedMoviesData.results,
        });
        setMovieGenres(movieGenresData.genres || []);
        setTvGenres(tvGenresData.genres || []);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchHome();
  }, []);

  useEffect(() => {
    if (heroItems.length) {
      setHeroIndex(Math.floor(Math.random() * heroItems.length));
    }
  }, [heroItems]);

  const allGenres = useMemo(() => {
    const map = new Map();
    movieGenres.forEach((genre) => map.set(genre.id, genre));
    tvGenres.forEach((genre) => map.set(genre.id, genre));
    return Array.from(map.values());
  }, [movieGenres, tvGenres]);

  const hero = heroItems[heroIndex];
  const heroType = hero?.media_type;
  const heroTitle = hero?.title || hero?.name || '';
  const heroYear = getYear(hero?.release_date || hero?.first_air_date);
  const heroRating = hero?.vote_average || 0;
  const heroBackdrop = hero?.backdrop_path
    ? `${IMG_ORIGINAL}${hero.backdrop_path}`
    : '/placeholder.jpg';
  const heroGenres = hero?.genre_ids
    ?.slice(0, 3)
    .map((gid) => allGenres.find((genre) => genre.id === gid)?.name)
    .filter(Boolean);

  const handleHeroDetails = () => {
    if (!hero) return;
    const path = heroType === 'movie' ? `/filme/${hero.id}` : `/serie/${hero.id}`;
    navigate(path);
  };

  return (
    <div className={styles.home}>
      <section className={styles.banner} style={{ backgroundImage: `url(${heroBackdrop})` }}>
        <div className={styles.bannerOverlay} />
        <div className={styles.bannerContent}>
          {loading ? (
            <p className={styles.error}>Carregando destaques...</p>
          ) : error ? (
            <p className={styles.error}>Nao foi possivel carregar a Home.</p>
          ) : (
            <>
              <p className={styles.kicker}>Em alta na semana</p>
              <h1 className={styles.bannerTitle}>{heroTitle || 'CineTrack'}</h1>
              <p className={styles.overview}>{hero?.overview || 'Descubra filmes e series em alta.'}</p>
              <div className={styles.heroMeta}>
                <RatingCircle rating={heroRating} />
                <div className={styles.heroBadges}>
                  <span className={styles.heroYear}>{heroYear}</span>
                  {heroGenres?.map((genre) => (
                    <GenreBadge key={genre} label={genre} />
                  ))}
                </div>
              </div>
              <div className={styles.heroActions}>
                <button type="button" className={styles.primaryBtn} onClick={handleHeroDetails}>
                  VER DETALHES
                </button>
                <button type="button" className={styles.secondaryBtn}>
                  + WATCHLIST
                </button>
              </div>
            </>
          )}
        </div>
        <div className={styles.dots}>
          {heroItems.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className={`${styles.dot} ${index === heroIndex ? styles.dotActive : ''}`}
              onClick={() => setHeroIndex(index)}
              aria-label={`Banner ${index + 1}`}
            />
          ))}
        </div>
      </section>

      <MediaRow
        title="Em Alta Esta Semana"
        items={sections.trending}
        viewAllPath="/filmes"
        allGenres={allGenres}
        loading={loading}
      />
      <MediaRow
        title="Filmes Populares"
        items={sections.popularMovies}
        viewAllPath="/filmes"
        allGenres={movieGenres}
        type="movie"
        loading={loading}
      />
      <MediaRow
        title="Series Populares"
        items={sections.popularSeries}
        viewAllPath="/series"
        allGenres={tvGenres}
        type="tv"
        loading={loading}
      />
      <MediaRow
        title="Filmes Mais Bem Avaliados"
        items={sections.topRatedMovies}
        viewAllPath="/filmes"
        allGenres={movieGenres}
        type="movie"
        loading={loading}
      />
    </div>
  );
}

export default Home;
