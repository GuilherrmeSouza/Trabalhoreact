import styles from './GenreBadge.module.css';

function GenreBadge({ label }) {
  return <span className={styles.badge}>{label}</span>;
}

export default GenreBadge;
