import { Link } from 'react-router-dom';
import styles from './NotFound.module.css';

function NotFound() {
  return (
    <div className={styles.page}>
      <h1 className={styles.code}>404</h1>
      <p className={styles.text}>Parece que esse titulo saiu de cartaz.</p>
      <p className={styles.subtext}>Talvez ele esteja em outra plataforma.</p>
      <Link to="/" className={styles.button}>
        Ir para o inicio
      </Link>
    </div>
  );
}

export default NotFound;
