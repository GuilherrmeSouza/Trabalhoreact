import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styles from './Header.module.css';

function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    setSearchOpen(false);
  }, [location.pathname]);

  const handleSearch = (event) => {
    event.preventDefault();
    if (!query.trim()) return;
    navigate(`/buscar?q=${encodeURIComponent(query.trim())}`);
    setQuery('');
    setSearchOpen(false);
  };

  return (
    <header className={`${styles.header} ${isHome ? styles.transparent : styles.solid}`}>
      <Link to="/" className={styles.logo}>
        CINETRACK
      </Link>
      <nav className={styles.nav}>
        <Link
          to="/filmes"
          className={location.pathname === '/filmes' ? styles.active : ''}
        >
          Filmes
        </Link>
        <Link
          to="/series"
          className={location.pathname === '/series' ? styles.active : ''}
        >
          Series
        </Link>
      </nav>
      <div className={styles.actions}>
        {searchOpen ? (
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar filmes e series..."
              className={styles.searchInput}
              aria-label="Buscar filmes e series"
            />
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className={styles.iconBtn}
            aria-label="Abrir busca"
          >
            Buscar
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
