import { movieService } from '@/services/api';
import MovieCard from '@/components/MovieCard';
import TopRankMovieCard from '@/components/TopRankMovieCard';
import DraggableScrollRow from '@/components/DraggableScrollRow';
import HeroCarousel from '@/components/HeroCarousel';
import {
  Play,
  TrendingUp,
  Film as FilmIcon,
  Clock,
  Globe2,
  Sparkles,
  ChevronRight,
  Zap,
  Crown,
  Tv,
  Clapperboard,
  Flame,
} from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

export const revalidate = 300;

/* ────────────────────────────────────────────────────────────
   Helper functions (unchanged)
   ──────────────────────────────────────────────────────────── */

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
    const parsed = parseInt(normalized, 10);
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
    const parsed = parseInt(normalized, 10);
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
  const year = typeof yearValue === 'number' ? yearValue : parseInt(String(yearValue), 10);
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

/* ────────────────────────────────────────────────────────────
   UI helpers
   ──────────────────────────────────────────────────────────── */

const ACCENT = {
  red: 'from-red-500 to-rose-600',
  blue: 'from-blue-500 to-indigo-600',
  green: 'from-emerald-500 to-teal-600',
  purple: 'from-violet-500 to-fuchsia-600',
  orange: 'from-orange-500 to-amber-600',
  pink: 'from-pink-500 to-rose-600',
  yellow: 'from-yellow-400 to-orange-500',
  cyan: 'from-cyan-400 to-blue-500',
} as const;

type AccentKey = keyof typeof ACCENT;

function SectionHeader({
  title,
  href,
  accent = 'red',
  icon: Icon,
}: {
  title: string;
  href: string;
  accent?: AccentKey;
  icon: React.ComponentType<any>;
}) {
  const gradient = ACCENT[accent];
  return (
    <div className="flex items-center gap-3 sm:gap-4 mb-7 sm:mb-9">
      <div
        className={`flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}
      >
        <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
      </div>
      <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
        {title}
      </h2>
      <div
        className={`hidden sm:block flex-1 h-px bg-gradient-to-r ${gradient} opacity-15`}
      />
      <Link
        href={href}
        className="ml-auto flex items-center gap-1 text-sm font-semibold text-zinc-500 hover:text-white transition-colors group"
      >
        Xem tất cả
        <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
      </Link>
    </div>
  );
}

function MovieScrollRow({
  movies,
  keyPrefix = '',
}: {
  movies: any[];
  keyPrefix?: string;
}) {
  return (
    <DraggableScrollRow className="overflow-x-auto pb-4 scrollbar-hide -mx-2 px-2">
      <div className="flex gap-4 sm:gap-5 lg:gap-6 min-w-max">
        {movies.map((movie: any, index: number) => (
          <div
            key={`${keyPrefix}${movie._id}-${index}`}
            className="w-[180px] sm:w-[210px] md:w-[240px] lg:w-[280px] xl:w-[310px] 2xl:w-[350px] shrink-0"
          >
            <MovieCard movie={movie} index={index} />
          </div>
        ))}
      </div>
    </DraggableScrollRow>
  );
}

/* ────────────────────────────────────────────────────────────
   Lazy-loaded category sections
   ──────────────────────────────────────────────────────────── */

async function SeriesSection() {
  const movies = await getTopImdbMoviesByPages(
    (page) => movieService.getSeriesMovies(page),
    20
  );
  return (
    <section className="relative">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-14 xl:px-20">
        <SectionHeader title="Phim Bộ Hot" href="/phim-bo" accent="blue" icon={Tv} />
        <MovieScrollRow movies={movies} keyPrefix="series-" />
      </div>
    </section>
  );
}

async function SingleMoviesSection() {
  const movies = await getTopImdbMoviesByPages(
    (page) => movieService.getSingleMovies(page),
    20
  );
  return (
    <section className="relative">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-14 xl:px-20">
        <SectionHeader title="Phim Lẻ Hay" href="/phim-le" accent="green" icon={Clapperboard} />
        <MovieScrollRow movies={movies} keyPrefix="single-" />
      </div>
    </section>
  );
}

async function KoreanSection() {
  const movies = await getTopImdbMoviesByPages(
    (page) => movieService.getMoviesByCountry('han-quoc', page),
    20
  );
  return (
    <section className="relative">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-14 xl:px-20">
        <SectionHeader title="Phim Hàn Quốc" href="/quoc-gia/han-quoc" accent="pink" icon={Flame} />
        <MovieScrollRow movies={movies} keyPrefix="korean-" />
      </div>
    </section>
  );
}

async function ChineseSection() {
  const movies = await getTopImdbMoviesByPages(
    (page) => movieService.getMoviesByCountry('trung-quoc', page),
    10
  );
  return (
    <section className="relative">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-14 xl:px-20">
        <SectionHeader title="Phim Trung Quốc" href="/quoc-gia/trung-quoc" accent="orange" icon={Globe2} />
        <MovieScrollRow movies={movies} keyPrefix="chinese-" />
      </div>
    </section>
  );
}

async function CartoonSection() {
  const movies = await getTopImdbMoviesByPages(
    (page) => movieService.getCartoonMovies(page),
    10
  );
  return (
    <section className="relative">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-14 xl:px-20">
        <SectionHeader title="Hoạt Hình Nổi Bật" href="/hoat-hinh" accent="purple" icon={Sparkles} />
        <MovieScrollRow movies={movies} keyPrefix="cartoon-" />
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────
   Loading skeleton
   ──────────────────────────────────────────────────────────── */

function LoadingSection({ title }: { title: string }) {
  return (
    <section className="relative">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-14 xl:px-20">
        <div className="flex items-center gap-3 sm:gap-4 mb-7 sm:mb-9">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-zinc-800 animate-pulse" />
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-extrabold text-white">
            {title}
          </h2>
          <div className="hidden sm:block flex-1 h-px bg-zinc-800/50" />
        </div>
        <div className="overflow-hidden">
          <div className="flex gap-3 sm:gap-4 lg:gap-5">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="w-[155px] sm:w-[175px] md:w-[195px] lg:w-[215px] xl:w-[235px] 2xl:w-[255px] shrink-0"
              >
                <div className="aspect-[2/3] bg-zinc-800/50 rounded-2xl shimmer" />
                <div className="mt-3 space-y-2">
                  <div className="h-4 bg-zinc-800/50 rounded-lg w-3/4" />
                  <div className="h-3 bg-zinc-800/50 rounded-lg w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────
   Home page
   ──────────────────────────────────────────────────────────── */

export default async function Home() {
  const newMoviesData = await movieService.getNewMovies(1);
  const recentMovies = newMoviesData.items.filter(
    (movie: any) =>
      isMovieWithinLastTwoMonths(movie) && isMovieFrom2015Onwards(movie)
  );
  const topRatedMovies = await getTopImdbMoviesByPages(
    (page) => movieService.getNewMovies(page),
    10
  );

  return (
    <div className="min-h-screen bg-[#07070d] relative">
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-0">
        <div className="absolute -top-40 left-[20%] w-[700px] h-[700px] bg-red-600/[0.025] rounded-full blur-[180px]" />
        <div className="absolute top-[40%] -right-32 w-[550px] h-[550px] bg-blue-600/[0.025] rounded-full blur-[160px]" />
        <div className="absolute bottom-[20%] left-[10%] w-[450px] h-[450px] bg-purple-600/[0.02] rounded-full blur-[150px]" />
      </div>

      {/* Grain texture */}
      <div className="grain" />

      {/* HERO CAROUSEL */}
      <HeroCarousel movies={topRatedMovies} />

      {/* ═══════════════════════════════════════
          CONTENT SECTIONS
          ═══════════════════════════════════════ */}
      <div className="relative z-10 space-y-14 sm:space-y-20 lg:space-y-24 pb-20 sm:pb-28">
        {/* Top 10 Ranking */}
        <section>
          <div className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-14 xl:px-20">
            <div className="flex items-center gap-3 sm:gap-4 mb-7 sm:mb-9">
              
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
                Top 10 Rating Cao Nhất
              </h2>
              <div className="hidden sm:block flex-1 h-px bg-gradient-to-r from-yellow-500/20 to-transparent" />
            </div>

            <DraggableScrollRow className="overflow-x-auto pb-4 scrollbar-hide -mx-2 px-2">
              <div className="flex gap-4 sm:gap-5 lg:gap-6 min-w-max">
                {topRatedMovies.map((movie: any, index: number) => (
                  <div
                    key={`top-${movie._id}-${index}`}
                    className="w-[220px] sm:w-[240px] md:w-[260px] lg:w-[300px] xl:w-[320px] 2xl:w-[340px] shrink-0"
                  >
                    <TopRankMovieCard movie={movie} rank={index + 1} />
                  </div>
                ))}
              </div>
            </DraggableScrollRow>
          </div>
        </section>

        {/* New Movies - Grid Layout */}
        <section>
          <div className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-14 xl:px-20">
            <SectionHeader title="Mới Cập Nhật" href="/phim-moi" accent="yellow" icon={Zap} />

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
              {newMoviesData.items.slice(0, 18).map((movie: any, index: number) => (
                <div key={`new-${movie._id}-${index}`}>
                  <MovieCard movie={movie} index={index} />
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-center">
              <Link
                href="/phim-moi"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-sm font-semibold text-white/80 bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.1] hover:border-white/[0.15] transition-all"
              >
                Xem thêm phim mới
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Lazy category sections */}
        <Suspense fallback={<LoadingSection title="Phim Bộ Hot" />}>
          <SeriesSection />
        </Suspense>

        <Suspense fallback={<LoadingSection title="Phim Lẻ Hay" />}>
          <SingleMoviesSection />
        </Suspense>

        <Suspense fallback={<LoadingSection title="Phim Hàn Quốc" />}>
          <KoreanSection />
        </Suspense>

        <Suspense fallback={<LoadingSection title="Phim Trung Quốc" />}>
          <ChineseSection />
        </Suspense>

        <Suspense fallback={<LoadingSection title="Hoạt Hình Nổi Bật" />}>
          <CartoonSection />
        </Suspense>
      </div>
    </div>
  );
}