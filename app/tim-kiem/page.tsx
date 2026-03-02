import { movieService } from '@/services/api';
import MovieCard from '@/components/MovieCard';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  return {
    title: resolvedSearchParams.q 
      ? `Kết quả tìm kiếm: ${resolvedSearchParams.q} | QMovie`
      : 'Tìm kiếm phim | QMovie',
  };
}

export default async function TimKiemPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const keyword = resolvedSearchParams.q || '';
  const page = parseInt(resolvedSearchParams.page || '1');
  let data = null;
  let error = false;

  if (keyword && keyword.length >= 2) {
    try {
      data = await movieService.searchMovies(keyword, page);
    } catch (err) {
      error = true;
    }
  }

  return (
    <div className="min-h-screen bg-black pt-20 pb-10">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-24">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Search className="w-8 h-8 text-red-600" />
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            {keyword ? `Kết quả tìm kiếm: "${keyword}"` : 'Tìm kiếm phim'}
          </h1>
        </div>

        {/* Results */}
        {!keyword && (
          <div className="text-center py-20">
            <Search className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-400 text-lg">
              Nhập từ khóa vào ô tìm kiếm để tìm phim
            </p>
          </div>
        )}

        {keyword && error && (
          <div className="text-center py-20">
            <p className="text-zinc-400 text-lg">
              Đã xảy ra lỗi khi tìm kiếm. Vui lòng thử lại.
            </p>
          </div>
        )}

        {keyword && !error && data && data.items.length === 0 && (
          <div className="text-center py-20">
            <Search className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-400 text-lg">
              Không tìm thấy phim nào với từ khóa "{keyword}"
            </p>
          </div>
        )}

        {keyword && !error && data && data.items.length > 0 && (
          <>
            <p className="text-zinc-400 mb-6">
              Tìm thấy {data.pagination?.totalItems || data.items.length} kết quả
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 mb-8">
              {data.items.map((movie: any, index: any) => (
                <MovieCard key={movie._id} movie={movie} index={index} />
              ))}
            </div>

            {/* Pagination */}
            {data.pagination && data.pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-4">
                <Link
                  href={`/tim-kiem?q=${encodeURIComponent(keyword)}&page=${page - 1}`}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    page === 1
                      ? 'bg-zinc-900 text-zinc-600 cursor-not-allowed'
                      : 'bg-zinc-800 hover:bg-zinc-700 text-white'
                  }`}
                  aria-disabled={page === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Trang trước
                </Link>
                
                <span className="text-white">
                  Trang {page} / {data.pagination.totalPages}
                </span>

                <Link
                  href={`/tim-kiem?q=${encodeURIComponent(keyword)}&page=${page + 1}`}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    page >= data.pagination.totalPages
                      ? 'bg-zinc-900 text-zinc-600 cursor-not-allowed'
                      : 'bg-zinc-800 hover:bg-zinc-700 text-white'
                  }`}
                  aria-disabled={page >= data.pagination.totalPages}
                >
                  Trang sau
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
