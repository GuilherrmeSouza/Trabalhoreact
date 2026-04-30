import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './components/Header/Header';
import Home from './pages/Home/Home';
import Catalog from './pages/Catalog/Catalog';
import MediaDetail from './pages/MediaDetail/MediaDetail';
import Search from './pages/Search/Search';
import NotFound from './pages/NotFound/NotFound';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main className="appMain">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/filmes" element={<Catalog type="movie" />} />
          <Route path="/series" element={<Catalog type="tv" />} />
          <Route path="/filme/:id" element={<MediaDetail type="movie" />} />
          <Route path="/serie/:id" element={<MediaDetail type="tv" />} />
          <Route path="/buscar" element={<Search />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
