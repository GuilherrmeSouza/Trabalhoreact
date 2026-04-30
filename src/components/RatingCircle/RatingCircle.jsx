import { getRatingColor } from '../../utils/ratings';
import styles from './RatingCircle.module.css';

function RatingCircle({ rating }) {
  const safeRating = Number.isFinite(rating) ? rating : 0;
  const pct = (safeRating / 10) * 100;
  const color = getRatingColor(safeRating);
  const r = 18;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;

  return (
    <div className={styles.wrap}>
      <svg width="48" height="48" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r={r} fill="none" stroke="var(--border)" strokeWidth="3" />
        <circle
          cx="24"
          cy="24"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 24 24)"
          style={{ transition: 'stroke-dashoffset 1s var(--ease)' }}
        />
      </svg>
      <span className={styles.value} style={{ color }}>
        {safeRating ? safeRating.toFixed(1) : 'N/A'}
      </span>
    </div>
  );
}

export default RatingCircle;
