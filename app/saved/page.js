import Catalog from '../../components/Catalog';
import { movies, toCard } from '../../lib/movies';

export const metadata = { title: 'Сохранённые' };

export default function SavedPage() {
  return <Catalog movies={movies.map(toCard)} mode="saved" />;
}
