import { useNavigate } from 'react-router-dom';
import { IMG_BASE } from '../../services/api';
import { getRatingColor } from '../../utils/ratings';
import GenreBadge from '../GenreBadge/GenreBadge';
import styles from './MediaCard.module.css';

function MediaCard({
  id,
  title,
  posterPath,
  rating,
  year,
  type,
  genreIds = [],
  allGenres = [],
}) {
  const navigate = useNavigate();
  const path = type === 'movie' ? `/filme/${id}` : `/serie/${id}`;
  const posterUrl = posterPath ? `${IMG_BASE}${posterPath}` : '/placeholder-poster.jpg';

  const genres = genreIds
    .slice(0, 2)
    .map((gid) => allGenres.find((genre) => genre.id === gid)?.name)
    .filter(Boolean);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      navigate(path);
    }
  };

  return (
    <div
      className={styles.card}
      onClick={() => navigate(path)}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      <div className={styles.posterWrap}>
        <img src={posterUrl} alt={title} className={styles.poster} loading="lazy" />
        <div className={styles.overlay}>
          <span className={styles.rating} style={{ color: getRatingColor(rating) }}>
            * {rating?.toFixed(1) ?? 'N/A'}
          </span>
          <p className={styles.meta}>
            {type === 'movie' ? 'Filme' : 'Serie'} | {year}
          </p>
          <div className={styles.genres}>
            {genres.map((genre) => (
              <GenreBadge key={genre} label={genre} />
            ))}
          </div>
        </div>
      </div>
      <p className={styles.title}>{title}</p>
    </div>
  );
}

export default MediaCard;
