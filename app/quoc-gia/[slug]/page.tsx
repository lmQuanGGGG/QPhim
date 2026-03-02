import { movieService } from '@/services/api';
import MovieCard from '@/components/MovieCard';
import type { Movie } from '@/types/movie';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Globe } from 'lucide-react';

const countryNames: { [key: string]: string } = {
  'han-quoc': 'Hàn Quốc 🇰🇷',
  'trung-quoc': 'Trung Quốc 🇨🇳',
  'nhat-ban': 'Nhật Bản 🇯🇵',
  'thai-lan': 'Thái Lan 🇹🇭',
  'au-my': 'Âu Mỹ 🇺🇸',
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const countryName = countryNames[resolvedParams.slug] || resolvedParams.slug;
  return {
    title: `Phim ${countryName} mới nhất | QMovie`,
    description: `Xem phim ${countryName} hay nhất, mới nhất, chất lượng HD`,
  };
}

export default async function CountryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams.page || '1');
  
  const countryName = countryNames[resolvedParams.slug] || resolvedParams.slug;

  const data = await movieService.getMoviesByCountry(resolvedParams.slug, page);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black pt-28 pb-20">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-24">
        {/* Header */}
        <div className="flex items-center gap-4 mb-14">
          <div className="bg-gradient-to-br from-red-500 to-pink-600 p-3.5 rounded-2xl shadow-lg">
            <Globe className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">Phim {countryName}</h1>
            <p className="text-zinc-400 text-base mt-1">Mới nhất • Chất lượng cao</p>
          </div>
        </div>

        {/* Movies Grid */}
        {data.items && data.items.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-5 md:gap-6 mb-16">
              {data.items.map((movie: Movie, index: number) => (
                <MovieCard key={movie._id} movie={movie} index={index} />
              ))}
            </div>

            {/* Pagination */}
            {data.pagination && (
              <div className="flex items-center justify-center gap-5">
                <Link
                  href={`/quoc-gia/${resolvedParams.slug}?page=${page - 1}`}
                  className={`flex items-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-base transition-all ${
                    page === 1
                      ? 'bg-zinc-900 text-zinc-600 cursor-not-allowed'
                      : 'bg-zinc-800 hover:bg-zinc-700 text-white hover:scale-105 shadow-lg'
                  }`}
                  aria-disabled={page === 1}
                >
                  <ChevronLeft className="w-5 h-5" />
                  Trang trước
                </Link>
                
                <div className="bg-zinc-900 border border-zinc-700 rounded-2xl px-8 py-4 text-center">
                  <span className="text-zinc-400 text-sm block">Trang</span>
                  <span className="text-white font-black text-xl">{page} <span className="text-zinc-500 font-normal text-base">/ {data.pagination.totalPages}</span></span>
                </div>

                <Link
                  href={`/quoc-gia/${resolvedParams.slug}?page=${page + 1}`}
                  className={`flex items-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-base transition-all ${
                    page >= data.pagination.totalPages
                      ? 'bg-zinc-900 text-zinc-600 cursor-not-allowed'
                      : 'bg-red-600 hover:bg-red-700 text-white hover:scale-105 shadow-lg shadow-red-600/30'
                  }`}
                  aria-disabled={page >= data.pagination.totalPages}
                >
                  Trang sau
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-32">
            <Globe className="w-20 h-20 text-zinc-800 mx-auto mb-6" />
            <p className="text-zinc-400 text-xl font-semibold">Không tìm thấy phim nào</p>
          </div>
        )}
      </div>
    </div>
  );
}
