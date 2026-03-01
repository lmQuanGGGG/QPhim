import { movieService } from '@/services/api';
import MovieCard from '@/components/MovieCard';
import type { Movie } from '@/types/movie';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Film as FilmIcon } from 'lucide-react';

export const metadata = {
  title: 'Hoạt hình | QMovie',
  description: 'Xem phim hoạt hình, anime mới nhất',
};

export default async function HoatHinhPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const currentPage = Number(resolvedSearchParams.page) || 1;
  const data = await movieService.getCartoonMovies(currentPage);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-14">
          <div className="bg-gradient-to-br from-orange-500 to-yellow-500 p-3.5 rounded-2xl shadow-lg">
            <FilmIcon className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">Hoạt Hình</h1>
            <p className="text-zinc-400 text-base mt-1">Anime • Mới nhất</p>
          </div>
        </div>

        {/* Movies Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-5 md:gap-6 mb-16">
          {data.items.map((movie: Movie, index: number) => (
            <MovieCard key={`${movie._id}-${index}`} movie={movie} index={index} />
          ))}
        </div>

        {/* Pagination */}
        {data.pagination && (
          <div className="flex items-center justify-center gap-5">
            <Link
              href={`/hoat-hinh?page=${currentPage - 1}`}
              className={`flex items-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-base transition-all ${
                currentPage === 1
                  ? 'bg-zinc-900 text-zinc-600 cursor-not-allowed'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-white hover:scale-105 shadow-lg'
              }`}
              aria-disabled={currentPage === 1}
            >
              <ChevronLeft className="w-5 h-5" />
              Trang trước
            </Link>
            
            <div className="bg-zinc-900 border border-zinc-700 rounded-2xl px-8 py-4 text-center">
              <span className="text-zinc-400 text-sm block">Trang</span>
              <span className="text-white font-black text-xl">{currentPage} <span className="text-zinc-500 font-normal text-base">/ {data.pagination.totalPages}</span></span>
            </div>

            <Link
              href={`/hoat-hinh?page=${currentPage + 1}`}
              className={`flex items-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-base transition-all ${
                currentPage >= data.pagination.totalPages
                  ? 'bg-zinc-900 text-zinc-600 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700 text-white hover:scale-105 shadow-lg shadow-red-600/30'
              }`}
              aria-disabled={currentPage >= data.pagination.totalPages}
            >
              Trang sau
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
