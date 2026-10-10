import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import Catalog from '../components/Catalog';
import MovieDetail from '../components/MovieDetail';
import { movies, toCard, getMovie, getSimilar } from '../lib/movies';

const cards = movies.map(toCard);

function readRoute() {
  const h = window.location.hash || '';
  if (h === '#saved') return 'saved';
  const m = /^#film-(\d+)$/.exec(h);
  return m && getMovie(m[1]) ? m[1] : null;
}

function App() {
  const [id, setId] = useState(readRoute);
  useEffect(() => {
    const on = () => { setId(readRoute()); window.scrollTo(0, 0); };
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  useEffect(() => {
    const m = id && id !== 'saved' && getMovie(id);
    document.title = m ? `${m.identification.title_ru} · Кино на вечер` : 'Кино на вечер';
  }, [id]);
  const movie = id && id !== 'saved' ? getMovie(id) : null;
  return (
    <main>
      {movie
        ? <MovieDetail key={id} movie={movie} similar={getSimilar(id)} />
        : <Catalog key={id || 'all'} movies={cards} mode={id === 'saved' ? 'saved' : 'all'} />}
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
