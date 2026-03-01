import { movieService } from '@/services/api';
import MovieCard from '@/components/MovieCard';
import TopRankMovieCard from '@/components/TopRankMovieCard';
import DraggableScrollRow from '@/components/DraggableScrollRow';
import { Sparkles, TrendingUp, Film as FilmIcon, Clock, Globe2 } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

export const revalidate = 300; // Revalidate mỗi 5 phút

function getMovieRating(movie: any): number {
  const candidates = [
    movie?.tmdb?.vote_average,
    movie?.imdb?.vote_average,
    movie?.imdb?.rating,
    movie?.rating,
    movie?.rate,
    movie?.vote_average,
  ];

  for (const value of candidates) {
    const num = typeof value === 'number' ? value : parseFloat(String(value));
    if (Number.isFinite(num)) return num;
  }

  return 0;
}

function getImdbRating(movie: any): number {
  const value = movie?.imdb?.rating ?? movie?.imdb?.vote_average;
  const num = typeof value === 'number' ? value : parseFloat(String(value));
  return Number.isFinite(num) ? num : 0;
}

function getImdbVoteCount(movie: any): number {
  const value =
    movie?.imdb?.vote_count ??
    movie?.imdb?.votes ??
    movie?.imdb?.voteCount ??
    movie?.imdb?.count;

  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  if (typeof value === 'string') {
    const normalized = value.replace(/,/g, '').trim();
    const parsed = parseInt(normalized, 20);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
}

function getTmdbRating(movie: any): number {
  const value = movie?.tmdb?.vote_average;
  const num = typeof value === 'number' ? value : parseFloat(String(value));
  return Number.isFinite(num) ? num : 0;
}

function getTmdbVoteCount(movie: any): number {
  const value = movie?.tmdb?.vote_count;

  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  if (typeof value === 'string') {
    const normalized = value.replace(/,/g, '').trim();
    const parsed = parseInt(normalized, 20);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
}

function getMovieModifiedDate(movie: any): Date | null {
  const rawTime = movie?.modified?.time;
  if (!rawTime) return null;

  if (typeof rawTime === 'number') {
    const timestamp = rawTime > 1_000_000_000_000 ? rawTime : rawTime * 1000;
    const date = new Date(timestamp);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const parsed = new Date(String(rawTime));
  if (!Number.isNaN(parsed.getTime())) return parsed;

  const asNumber = Number(rawTime);
  if (Number.isFinite(asNumber)) {
    const timestamp = asNumber > 1_000_000_000_000 ? asNumber : asNumber * 1000;
    const date = new Date(timestamp);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  return null;
}

function isMovieWithinLastTwoMonths(movie: any): boolean {
  const modifiedDate = getMovieModifiedDate(movie);
  if (!modifiedDate) return false;

  const now = new Date();
  const twoMonthsAgo = new Date(now);
  twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

  return modifiedDate >= twoMonthsAgo && modifiedDate <= now;
}

function isMovieFrom2015Onwards(movie: any): boolean {
  const yearValue = movie?.year;
  const year = typeof yearValue === 'number' ? yearValue : parseInt(String(yearValue), 20);
  return Number.isFinite(year) && year >= 2015;
}

async function getTopImdbMoviesByPages(
  fetchPage: (page: number) => Promise<{ items: any[] }>,
  limit: number = 20
): Promise<any[]> {
  const MAX_PAGES_TO_SCAN = 20;
  const pageNumbers = Array.from({ length: MAX_PAGES_TO_SCAN }, (_, i) => i + 1);
  const pageResults = await Promise.all(pageNumbers.map((page) => fetchPage(page)));

  const uniqueMovies = new Map<string, any>();

  for (const pageResult of pageResults) {
    for (const movie of pageResult.items || []) {
      if (!movie?._id || uniqueMovies.has(movie._id)) continue;
      if (!isMovieWithinLastTwoMonths(movie)) continue;
      if (!isMovieFrom2015Onwards(movie)) continue;
      uniqueMovies.set(movie._id, movie);
    }
  }

  const recentMovies = [...uniqueMovies.values()];

  const imdbMovies = recentMovies
    .filter((movie: any) => getImdbVoteCount(movie) >= 5000 && getImdbRating(movie) > 0)
    .sort((a: any, b: any) => getImdbRating(b) - getImdbRating(a))
    .slice(0, limit);

  if (imdbMovies.length >= limit) return imdbMovies;

  const selectedIds = new Set(imdbMovies.map((movie: any) => movie._id));
  const tmdbFillMovies = recentMovies
    .filter(
      (movie: any) =>
        !selectedIds.has(movie._id) &&
        getTmdbVoteCount(movie) >= 20 &&
        getTmdbRating(movie) > 0
    )
    .sort((a: any, b: any) => getTmdbRating(b) - getTmdbRating(a))
    .slice(0, limit - imdbMovies.length);

  return [...imdbMovies, ...tmdbFillMovies];
}

// Component con để lazy load
async function SeriesSection() {
  const seriesMovies = await getTopImdbMoviesByPages((page) => movieService.getSeriesMovies(page), 20);
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between items-start sm:text-left gap-4 mb-12">
        <h2 className="text-3xl md:text-4xl font-black text-white flex items-center gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-2xl">
            <FilmIcon className="w-8 h-8 text-white" />
          </div>
          Phim Bộ Hot
        </h2>
        <Link href="/phim-bo" className="text-red-500 hover:text-red-400 font-bold text-lg flex items-center gap-2 group">
          Xem tất cả
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>
      <DraggableScrollRow className="overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
        <div className="flex gap-5 md:gap-6 min-w-max snap-x snap-mandatory">
          {seriesMovies.map((movie: any, index: number) => (
            <div key={`${movie._id}-${index}`} className="w-[230px] md:w-[250px] lg:w-[280px] shrink-0 snap-start">
              <MovieCard movie={movie} index={index} />
            </div>
          ))}
        </div>
      </DraggableScrollRow>
    </section>
  );
}

async function SingleMoviesSection() {
  const singleMovies = await getTopImdbMoviesByPages((page) => movieService.getSingleMovies(page), 20);
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between items-start sm:text-left gap-4 mb-12">
        <h2 className="text-3xl md:text-4xl font-black text-white flex items-center gap-4">
          <div className="bg-gradient-to-br from-green-500 to-teal-600 p-3 rounded-2xl">
            <FilmIcon className="w-8 h-8 text-white" />
          </div>
          Phim Lẻ Hay
        </h2>
        <Link href="/phim-le" className="text-red-500 hover:text-red-400 font-bold text-lg flex items-center gap-2 group">
          Xem tất cả
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>
      <DraggableScrollRow className="overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
        <div className="flex gap-5 md:gap-6 min-w-max snap-x snap-mandatory">
          {singleMovies.map((movie: any, index: number) => (
            <div key={`${movie._id}-${index}`} className="w-[230px] md:w-[250px] lg:w-[280px] shrink-0 snap-start">
              <MovieCard movie={movie} index={index} />
            </div>
          ))}
        </div>
      </DraggableScrollRow>
    </section>
  );
}

async function KoreanSection() {
  const koreanMovies = await getTopImdbMoviesByPages(
    (page) => movieService.getMoviesByCountry('han-quoc', page),
    20
  );
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between items-start sm:text-left gap-4 mb-12">
        <h2 className="text-3xl md:text-4xl font-black text-white flex items-center gap-4">
          <div className="bg-gradient-to-br from-red-500 to-pink-600 p-3 rounded-2xl animate-pulse">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          Phim Hàn Quốc HOT 🇰🇷
        </h2>
        <Link href="/quoc-gia/han-quoc" className="text-red-500 hover:text-red-400 font-bold text-lg flex items-center gap-2 group">
          Xem tất cả
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>
      <DraggableScrollRow className="overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
        <div className="flex gap-5 md:gap-6 min-w-max snap-x snap-mandatory">
          {koreanMovies.map((movie: any, index: number) => (
            <div key={`${movie._id}-${index}`} className="w-[230px] md:w-[250px] lg:w-[280px] shrink-0 snap-start">
              <MovieCard movie={movie} index={index} />
            </div>
          ))}
        </div>
      </DraggableScrollRow>
    </section>
  );
}

async function ChineseSection() {
  const chineseMovies = await getTopImdbMoviesByPages(
    (page) => movieService.getMoviesByCountry('trung-quoc', page),
    10
  );

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between items-start sm:text-left gap-4 mb-12">
        <h2 className="text-3xl md:text-4xl font-black text-white flex items-center gap-4">
          <div className="bg-gradient-to-br from-rose-500 to-red-700 p-3 rounded-2xl">
            <Globe2 className="w-8 h-8 text-white" />
          </div>
          Phim Trung Quốc Hot 🇨🇳
        </h2>
        <Link href="/quoc-gia/trung-quoc" className="text-red-500 hover:text-red-400 font-bold text-lg flex items-center gap-2 group">
          Xem tất cả
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>

      <DraggableScrollRow className="overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
        <div className="flex gap-5 md:gap-6 min-w-max snap-x snap-mandatory">
          {chineseMovies.map((movie: any, index: number) => (
            <div key={`${movie._id}-${index}`} className="w-[230px] md:w-[250px] lg:w-[280px] shrink-0 snap-start">
              <MovieCard movie={movie} index={index} />
            </div>
          ))}
        </div>
      </DraggableScrollRow>
    </section>
  );
}

async function CartoonSection() {
  const cartoonMovies = await getTopImdbMoviesByPages((page) => movieService.getCartoonMovies(page), 10);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between items-start sm:text-left gap-4 mb-12">
        <h2 className="text-3xl md:text-4xl font-black text-white flex items-center gap-4">
          <div className="bg-gradient-to-br from-purple-500 to-fuchsia-600 p-3 rounded-2xl">
            <FilmIcon className="w-8 h-8 text-white" />
          </div>
          Phim Hoạt Hình Nổi Bật 🎬
        </h2>
        <Link href="/hoat-hinh" className="text-red-500 hover:text-red-400 font-bold text-lg flex items-center gap-2 group">
          Xem tất cả
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>

      <DraggableScrollRow className="overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
        <div className="flex gap-5 md:gap-6 min-w-max snap-x snap-mandatory">
          {cartoonMovies.map((movie: any, index: number) => (
            <div key={`${movie._id}-${index}`} className="w-[230px] md:w-[250px] lg:w-[280px] shrink-0 snap-start">
              <MovieCard movie={movie} index={index} />
            </div>
          ))}
        </div>
      </DraggableScrollRow>
    </section>
  );
}

// Loading skeleton component
function LoadingSection({ title }: { title: string }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
      <div className="flex items-center justify-between mb-12">
        <h2 className="text-3xl md:text-4xl font-black text-white">{title}</h2>
      </div>
      <DraggableScrollRow className="overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
        <div className="flex gap-5 md:gap-6 min-w-max">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="animate-pulse w-[230px] md:w-[250px] lg:w-[280px] shrink-0">
              <div className="aspect-[2/3] bg-zinc-800 rounded-xl mb-3"></div>
              <div className="h-4 bg-zinc-800 rounded mb-2"></div>
              <div className="h-3 bg-zinc-800 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </DraggableScrollRow>
    </section>
  );
}

export default async function Home() {
  // Fetch chỉ phim mới cập nhật để load nhanh, các section khác load sau
  const newMoviesData = await movieService.getNewMovies(1);
  const recentMovies = newMoviesData.items.filter(
    (movie: any) => isMovieWithinLastTwoMonths(movie) && isMovieFrom2015Onwards(movie)
  );
  const topRatedMovies = await getTopImdbMoviesByPages((page) => movieService.getNewMovies(page), 10);
  const heroMovie = topRatedMovies[0] || recentMovies[0] || newMoviesData.items[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black">
      {/* Hero Section - Tối ưu hơn */}
      <section className="relative h-[75vh] mb-12">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://img.ophim.live/uploads/movies/${heroMovie?.thumb_url}')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />
          <div className="absolute inset-0 backdrop-blur-[2px]" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-end pb-20">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 bg-red-600/90 backdrop-blur-sm px-4 py-2 rounded-full">
              <Sparkles className="w-4 h-4 text-white animate-pulse" />
              <span className="text-white font-semibold text-sm uppercase tracking-wider">
                Top rating hôm nay
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-white drop-shadow-2xl leading-tight">
              {heroMovie?.name}
            </h1>
            
            <p className="text-zinc-200 text-lg md:text-xl font-medium drop-shadow-lg">
              {heroMovie?.origin_name}
            </p>
            
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={`/phim/${heroMovie?.slug}`}
                className="group bg-red-600 hover:bg-red-700 text-white px-10 py-4 rounded-full font-bold text-lg flex items-center gap-3 transition-all hover:scale-105 shadow-2xl shadow-red-600/50"
              >
                <FilmIcon className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                Xem ngay
              </Link>
              
              <div className="flex items-center gap-2 text-sm">
                <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-full font-semibold">
                  {heroMovie?.quality}
                </span>
                <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-full font-semibold">
                  {heroMovie?.year}
                </span>
                <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-full font-semibold">
                  {heroMovie?.lang}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top 10 phim rating cao nhất */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="mb-12">
          
        </div>

        <DraggableScrollRow className="overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
          <div className="flex gap-6 min-w-max snap-x snap-mandatory">
            {topRatedMovies.map((movie: any, index: number) => (
              <div key={`top-${movie._id}-${index}`} className="w-[300px] lg:w-[360px] shrink-0 snap-start">
                <TopRankMovieCard movie={movie} rank={index + 1} />
              </div>
            ))}
          </div>
        </DraggableScrollRow>
      </section>

      {/* Phim Mới Cập Nhật */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between items-start sm:text-left gap-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-white flex items-center gap-4">
            <div className="bg-gradient-to-br from-yellow-400 to-orange-600 p-3 rounded-2xl">
              <Clock className="w-8 h-8 text-white" />
            </div>
            Mới cập nhật hôm nay
          </h2>
          <Link href="/phim-moi" className="text-red-500 hover:text-red-400 font-bold text-lg flex items-center gap-2 group">
            Xem tất cả
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
        <DraggableScrollRow className="overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
          <div className="flex gap-5 md:gap-6 min-w-max snap-x snap-mandatory">
            {newMoviesData.items.slice(0, 10).map((movie: any, index: number) => (
              <div key={`${movie._id}-${index}`} className="w-[230px] md:w-[250px] lg:w-[280px] shrink-0 snap-start">
                <MovieCard movie={movie} index={index} />
              </div>
            ))}
          </div>
        </DraggableScrollRow>
      </section>

      {/* Lazy load các section khác */}
      <Suspense fallback={<LoadingSection title="Phim Bộ Hot" />}>
        <SeriesSection />
      </Suspense>

      <Suspense fallback={<LoadingSection title="Phim Lẻ Hay" />}>
        <SingleMoviesSection />
      </Suspense>

      <Suspense fallback={<LoadingSection title="Phim Trung Quốc Hot 🇨🇳" />}>
        <ChineseSection />
      </Suspense>

      <Suspense fallback={<LoadingSection title="Phim Hoạt Hình Nổi Bật 🎬" />}>
        <CartoonSection />
      </Suspense>

      <Suspense fallback={<LoadingSection title="Phim Hàn Quốc HOT 🇰🇷" />}>
        <KoreanSection />
      </Suspense>
    </div>
  );
}

