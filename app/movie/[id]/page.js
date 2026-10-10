import { notFound } from 'next/navigation';
import MovieDetail from '../../../components/MovieDetail';
import { movies, getMovie, getSimilar } from '../../../lib/movies';
import { withPhotos } from '../../../lib/photos';

export const dynamicParams = false;

export function generateStaticParams() {
  return movies.map((m) => ({ id: m.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const m = getMovie(id);
  if (!m) return {};
  return {
    title: `${m.identification.title_ru} (${m.identification.year})`,
    description: m.content.logline,
  };
}

export default async function MoviePage({ params }) {
  const { id } = await params;
  const movie = getMovie(id);
  if (!movie) notFound();
  const cast = await withPhotos(movie.cast);
  return <MovieDetail movie={{ ...movie, cast }} similar={getSimilar(id)} />;
}
