import { movieService } from '@/services/api';
import MovieCard from '@/components/MovieCard';
import type { Movie } from '@/types/movie';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';

export const metadata = {
  title: 'Phim mới cập nhật | QMovie',
  description: 'Xem phim mới cập nhật hôm nay, phim hot mới nhất',
};

export default async function PhimMoiPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const currentPage = Number(resolvedSearchParams.page) || 1;
  const data = await movieService.getNewMovies(currentPage);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black pt-24 pb-16">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-24">
        {/* Header */}
        <div className="flex items-center gap-4 mb-12">
          <div className="bg-gradient-to-br from-yellow-400 to-orange-600 p-3 rounded-2xl">
            <Clock className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Phim mới cập nhật
          </h1>
        </div>

        {/* Movies Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-5 md:gap-6 mb-12">
          {data.items.map((movie: Movie, index: number) => (
            <MovieCard key={movie._id} movie={movie} index={index} />
          ))}
        </div>

        {/* Pagination */}
        {data.pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-4">
            <Link
              href={currentPage > 1 ? `?page=${currentPage - 1}` : '#'}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                currentPage > 1
                  ? 'bg-zinc-800 hover:bg-zinc-700 text-white hover:scale-105 shadow-lg'
                  : 'bg-zinc-900 text-zinc-600 cursor-not-allowed'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
              Trang trước
            </Link>

            <span className="text-white font-bold text-lg">
              Trang {currentPage} / {data.pagination.totalPages}
            </span>

            <Link
              href={currentPage < data.pagination.totalPages ? `?page=${currentPage + 1}` : '#'}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                currentPage < data.pagination.totalPages
                  ? 'bg-red-600 hover:bg-red-700 text-white hover:scale-105 shadow-lg shadow-red-600/30'
                  : 'bg-zinc-900 text-zinc-600 cursor-not-allowed'
              }`}
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
