import { Link } from 'react-router-dom';
import MediaCard from '../MediaCard/MediaCard';
import Skeleton from '../Skeleton/Skeleton';
import { getYear } from '../../utils/format';
import styles from './MediaRow.module.css';

function MediaRow({ title, items = [], viewAllPath, allGenres = [], type, loading }) {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2>{title}</h2>
        {viewAllPath ? (
          <Link to={viewAllPath} className={styles.viewAll}>
            Ver todos
          </Link>
        ) : null}
      </div>
      <div className={styles.row}>
        {loading
          ? Array.from({ length: 10 }).map((_, index) => (
              <div className={styles.cardSlot} key={`skeleton-${index}`}>
                <Skeleton className={styles.skeletonCard} />
                <Skeleton className={styles.skeletonText} />
              </div>
            ))
          : items.map((item) => {
              const itemType = type || item.media_type;
              const itemTitle = item.title || item.name;
              const itemYear = getYear(item.release_date || item.first_air_date);

              return (
                <MediaCard
                  key={`${itemType}-${item.id}`}
                  id={item.id}
                  title={itemTitle}
                  posterPath={item.poster_path}
                  rating={item.vote_average}
                  year={itemYear}
                  type={itemType}
                  genreIds={item.genre_ids}
                  allGenres={allGenres}
                />
              );
            })}
      </div>
    </section>
  );
}

export default MediaRow;
