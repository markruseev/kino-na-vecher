import Catalog from '../components/Catalog';
import { movies, toCard } from '../lib/movies';

export default function HomePage() {
  return <Catalog movies={movies.map(toCard)} />;
}
