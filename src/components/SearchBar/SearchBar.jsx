import styles from './SearchBar.module.css';

function SearchBar({ value, onChange, onSubmit, placeholder, autoFocus = false }) {
  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={styles.input}
        autoFocus={autoFocus}
        aria-label={placeholder}
      />
      <button type="submit" className={styles.button}>
        Buscar
      </button>
    </form>
  );
}

export default SearchBar;
