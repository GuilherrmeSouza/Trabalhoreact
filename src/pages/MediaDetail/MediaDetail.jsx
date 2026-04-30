import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import GenreBadge from '../../components/GenreBadge/GenreBadge';
import RatingCircle from '../../components/RatingCircle/RatingCircle';
import Skeleton from '../../components/Skeleton/Skeleton';
import {
  getMovieById,
  getMovieCredits,
  getSeriesById,
  getSeriesCredits,
  IMG_BASE,
  IMG_ORIGINAL,
} from '../../services/api';
import { formatRuntime, getInitials, getYear } from '../../utils/format';
import styles from './MediaDetail.module.css';

function MediaDetail({ type }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [media, setMedia] = useState(null);
  const [cast, setCast] = useState([]);
  const [crew, setCrew] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError(false);
      try {
        const [detail, credits] = await Promise.all([
          type === 'movie' ? getMovieById(id) : getSeriesById(id),
          type === 'movie' ? getMovieCredits(id) : getSeriesCredits(id),
        ]);
        setMedia(detail);
        setCast(credits.cast?.slice(0, 10) || []);
        setCrew(credits.crew || []);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [id, type]);

  const director = useMemo(() => {
    if (type === 'tv') return media?.created_by?.[0]?.name || 'N/A';
    return crew.find((person) => person.job === 'Director')?.name || 'N/A';
  }, [crew, media, type]);

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>
          <Skeleton className={styles.skeletonBackdrop} />
          <div className={styles.skeletonContent}>
            <Skeleton className={styles.skeletonPoster} />
            <div>
              <Skeleton className={styles.skeletonTitle} />
              <Skeleton className={styles.skeletonText} />
              <Skeleton className={styles.skeletonText} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !media) {
    return (
      <div className={styles.page}>
        <p className={styles.error}>Nao foi possivel carregar os detalhes.</p>
      </div>
    );
  }

  const backdropUrl = media.backdrop_path
    ? `${IMG_ORIGINAL}${media.backdrop_path}`
    : '/placeholder.jpg';
  const posterUrl = media.poster_path ? `${IMG_BASE}${media.poster_path}` : '/placeholder-poster.jpg';
  const year = getYear(media.release_date || media.first_air_date);
  const runtime = type === 'movie'
    ? formatRuntime(media.runtime)
    : `${media.number_of_seasons || 0} temporadas`;
  const tmdbPath = type === 'movie' ? 'movie' : 'tv';

  return (
    <div className={styles.page}>
      <section className={styles.backdrop} style={{ backgroundImage: `url(${backdropUrl})` }}>
        <div className={styles.backdropOverlay} />
        <div className={styles.detailContent}>
          <img src={posterUrl} alt={media.title || media.name} className={styles.poster} />
          <div className={styles.meta}>
            <h1>{media.title || media.name}</h1>
            <div className={styles.subline}>
              <span>{director}</span>
              <span>|</span>
              <span>{runtime}</span>
              <span>|</span>
              <span>{year}</span>
            </div>
            <div className={styles.genreRow}>
              {media.genres?.map((genre) => (
                <GenreBadge key={genre.id} label={genre.name} />
              ))}
            </div>
            <p className={styles.overview}>{media.overview}</p>
            <div className={styles.actions}>
              <a
                className={styles.tmdb}
                href={`https://www.themoviedb.org/${tmdbPath}/${media.id}`}
                target="_blank"
                rel="noreferrer"
              >
                Ver no TMDB
              </a>
              <button type="button" className={styles.backBtn} onClick={() => navigate(-1)}>
                Voltar
              </button>
            </div>
          </div>
          <div className={styles.ratingWrap}>
            <RatingCircle rating={media.vote_average} />
          </div>
        </div>
      </section>

      <section className={styles.infoSection}>
        <div className={styles.infoGrid}>
          <div>
            <span className={styles.label}>Titulo original</span>
            <p>{media.original_title || media.original_name || 'N/A'}</p>
          </div>
          <div>
            <span className={styles.label}>Status</span>
            <p>{media.status || 'N/A'}</p>
          </div>
          <div>
            <span className={styles.label}>Idioma</span>
            <p>{media.original_language?.toUpperCase() || 'N/A'}</p>
          </div>
          <div>
            <span className={styles.label}>Votos</span>
            <p>{media.vote_count?.toLocaleString('pt-BR') || 'N/A'}</p>
          </div>
        </div>

        <div className={styles.castSection}>
          <h2>Elenco principal</h2>
          <div className={styles.castGrid}>
            {cast.map((actor) => (
              <div key={actor.id} className={styles.castCard}>
                {actor.profile_path ? (
                  <img
                    src={`${IMG_BASE}${actor.profile_path}`}
                    alt={actor.name}
                    loading="lazy"
                  />
                ) : (
                  <div className={styles.castFallback}>{getInitials(actor.name)}</div>
                )}
                <div>
                  <p className={styles.castName}>{actor.name}</p>
                  <p className={styles.castRole}>{actor.character}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default MediaDetail;
