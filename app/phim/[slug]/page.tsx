import { movieService } from '@/services/api';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import MovieCard from '@/components/MovieCard';
import MovieDetailTabs from '@/components/MovieDetailTabs';
import { Suspense } from 'react';
import {
  Calendar,
  Clock,
  Globe,
  TrendingUp,
  Star,
  Play,
  Heart,
  Share2,
  Hash,
  Info,
  Layers,
  Monitor,
  Languages,
  Users,
} from 'lucide-react';
import { stripHtmlTags } from '@/lib/utils';
import { Metadata } from 'next';

export const revalidate = 3600;

function getImdbRating(movie: any): number | null {
  const raw = movie?.imdb?.rating ?? movie?.imdb?.vote_average;
  const value = typeof raw === 'number' ? raw : parseFloat(String(raw));
  return Number.isFinite(value) && value > 0 ? value : null;
}

/* ─── Related Movies (Suspense streaming) ─── */
async function RelatedMovies({ categorySlug }: { categorySlug: string }) {
  try {
    const relatedMovies = await movieService.getMoviesByCategory(categorySlug, 1);
    if (!relatedMovies?.items?.length) return null;
    return (
      <section className="mt-20 pt-10 border-t border-white/5">
        <div className="flex items-center gap-3 mb-8 px-4 md:px-0">
          <div className="w-1 h-8 bg-red-600 rounded-full shadow-[0_0_10px_rgba(220,38,38,0.5)]" />
          <h2 className="text-2xl font-bold text-white tracking-tight uppercase">Có thể bạn muốn xem</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 px-4 md:px-0">
          {relatedMovies.items.slice(0, 12).map((m: any, i: number) => (
            <MovieCard key={m._id} movie={m} index={i} />
          ))}
        </div>
      </section>
    );
  } catch {
    return null;
  }
}

function RelatedMoviesSkeleton() {
  return (
    <section className="mt-20 pt-10 border-t border-white/5">
      <div className="flex items-center gap-3 mb-8 px-4 md:px-0">
        <div className="w-1 h-8 bg-zinc-800 rounded-full animate-pulse" />
        <div className="w-48 h-8 bg-zinc-800 rounded animate-pulse" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 px-4 md:px-0">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-[2/3] bg-zinc-900 rounded-xl mb-3" />
            <div className="h-4 bg-zinc-900 rounded mb-2 w-3/4" />
            <div className="h-3 bg-zinc-900 rounded w-1/2" />
          </div>
        ))}
      </div>
    </section>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { movie } = await movieService.getMovieDetail(slug);
    return {
      title: `${movie.name} (${movie.year}) - Vietsub | QMovie`,
      description: stripHtmlTags(movie.content).slice(0, 160),
      openGraph: {
        images: [movie.poster_url, movie.thumb_url],
      },
    };
  } catch {
    return { title: 'Phim không tìm thấy | QMovie' };
  }
}

export default async function MovieDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let movieData: any;

  try {
    movieData = await movieService.getMovieDetail(slug);
  } catch {
    notFound(); 
  }

  const { movie, episodes } = movieData;
  const categorySlug = movie.category?.[0]?.slug ?? null;
  const firstEpisode = episodes?.[0]?.server_data?.[0];
  const imdbRating = getImdbRating(movie);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 pb-20 font-sans selection:bg-red-500/30">
      
      {/* ══════════════════════════════════
          HERO SECTION (Cinematic)
      ══════════════════════════════════ */}
      <div className="relative w-full h-[65vh] lg:h-[75vh] overflow-hidden group">
        <div className="absolute inset-0 bg-black/60 z-10" />
        
        {/* Backdrop Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[10s] ease-out group-hover:scale-105"
          style={{ backgroundImage: `url('${movie.thumb_url}')` }}
        />
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent z-20" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent z-20" />
        
        {/* Content on Hero */}
        <div className="absolute inset-0 z-30 flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-20 lg:mt-0">
                <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-10 items-end">
                    
                    {/* Left: Poster (Desktop only placeholder to align layout) */}
                    <div className="hidden lg:block relative aspect-[2/3] rounded-xl shadow-2xl rotate-1 group-hover:rotate-0 transition-transform duration-500 origin-bottom-left border border-white/10 overflow-hidden bg-zinc-900">
                         <Image
                            src={movie.poster_url}
                            alt={movie.name}
                            fill
                            className="object-cover"
                            priority
                            sizes="300px"
                          />
                    </div>

                    {/* Right: Info */}
                    <div className="lg:mb-10 space-y-6">
                        {/* Breadcrumbs / Badges */}
                        <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wider text-red-500">
                             <span className="bg-red-600/10 border border-red-600/20 px-3 py-1 rounded text-red-500 backdrop-blur-md">
                                {movie.quality}
                             </span>
                             <span className="bg-white/5 border border-white/10 px-3 py-1 rounded text-zinc-300 backdrop-blur-md">
                                {movie.lang}
                             </span>
                             <span className="bg-white/5 border border-white/10 px-3 py-1 rounded text-zinc-300 backdrop-blur-md flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5" /> {movie.time}
                             </span>
                        </div>

                        <div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight drop-shadow-lg">
                                {movie.name}
                            </h1>
                            <p className="text-xl md:text-2xl text-zinc-400 font-light mt-2 italic tracking-wide">
                                {movie.origin_name} ({movie.year})
                            </p>
                        </div>
                        
                        {/* Meta */}
                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-zinc-300 text-sm md:text-base font-medium">
                            {movie.country?.[0] && (
                                <div className="flex items-center gap-2">
                                    <Globe className="w-4 h-4 text-red-500" />
                                    {movie.country.map((c: any) => c.name).join(', ')}
                                </div>
                            )}
                            {movie.category && (
                                <div className="flex items-center gap-2">
                                    <Hash className="w-4 h-4 text-red-500" />
                                    {movie.category.map((c: any) => c.name).join(', ')}
                                </div>
                            )}
                             <div className="flex items-center gap-2">
                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                              {imdbRating ? `${imdbRating.toFixed(1)} IMDb` : 'Chưa có IMDb'}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap items-center gap-4 pt-4">
                            {firstEpisode ? (
                                <Link
                                    href={`/xem-phim/${movie.slug}/${firstEpisode.slug}`}
                                    className="group relative inline-flex items-center gap-3 bg-red-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 hover:bg-red-700 shadow-[0_0_40px_-10px_rgba(220,38,38,0.6)]"
                                >
                                    <Play className="w-6 h-6 fill-current" />
                                    <span>Xem Ngay</span>
                                    <div className="absolute inset-0 rounded-full ring-2 ring-white/20 group-hover:ring-white/40 transition-all" />
                                </Link>
                            ) : (
                                <button disabled className="bg-zinc-800 text-zinc-500 px-8 py-4 rounded-full font-bold cursor-not-allowed">
                                    Sắp chiếu
                                </button>
                            )}
                            
                            <button className="h-14 w-14 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur border border-white/10 flex items-center justify-center transition-all hover:scale-110 group">
                                <Heart className="w-6 h-6 text-white group-hover:text-red-500 transition-colors" />
                            </button>
                            <button className="h-14 w-14 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur border border-white/10 flex items-center justify-center transition-all hover:scale-110 text-white">
                                <Share2 className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* ══════════════════════════════════
          BODY CONTENT
      ══════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-40">
        
        {/* Mobile Poster (visible only on small screens) */}
        <div className="lg:hidden -mt-24 mb-8 flex justify-center">
             <div className="relative w-48 aspect-[2/3] rounded-xl shadow-2xl overflow-hidden border-2 border-zinc-800">
                <Image
                    src={movie.poster_url}
                    alt={movie.name}
                    fill
                    className="object-cover"
                />
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-10 lg:gap-12">
            
            {/* Left Content */}
            <div className="space-y-12">
                {/* Tabs Component (Info, Episodes, Actors) */}
                <MovieDetailTabs movie={movie} episodes={episodes} />

                {/* Related Movies */}
                {categorySlug && (
                  <Suspense fallback={<RelatedMoviesSkeleton />}>
                    <RelatedMovies categorySlug={categorySlug} />
                  </Suspense>
                )}
            </div>
            
            {/* Right Sidebar */}
            <div className="hidden lg:block space-y-8">
              <div className="sticky top-24 space-y-6">
                <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/45 backdrop-blur-sm overflow-hidden shadow-xl shadow-black/30">
                  <div className="px-5 py-4 border-b border-zinc-800/70 flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center shrink-0">
                      <Info className="w-4 h-4 text-white" />
                    </span>
                    <h3 className="text-lg font-extrabold text-white uppercase tracking-wide">Thông tin phim</h3>
                  </div>

                  <div className="p-4 space-y-2.5">
                    {[
                      { label: 'Trạng thái', value: movie.episode_current, icon: Layers },
                      { label: 'Số tập', value: movie.episode_total, icon: Hash },
                      { label: 'Thời lượng', value: movie.time, icon: Clock },
                      { label: 'Năm', value: movie.year, icon: Calendar },
                      { label: 'Chất lượng', value: movie.quality, icon: Monitor },
                      { label: 'Ngôn ngữ', value: movie.lang, icon: Languages },
                    ].map((item, idx) => item.value && (
                      <div key={idx} className="rounded-xl border border-zinc-800/60 bg-zinc-900/60 px-3.5 py-2.5 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-zinc-400 min-w-0">
                          <item.icon className="w-4 h-4 shrink-0" />
                          <span className="text-xs font-semibold uppercase tracking-wide truncate">{item.label}</span>
                        </div>
                        <span className="text-base font-bold text-zinc-100 text-right truncate max-w-[52%]">{item.value}</span>
                      </div>
                    ))}

                    {movie.director && movie.director[0] !== 'Đang cập nhật' && (
                      <div className="pt-2 mt-1 border-t border-zinc-800/60">
                        <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-2.5 flex items-center gap-2">
                          <Users className="w-3.5 h-3.5" />
                          Đạo diễn
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {movie.director.map((d: string, i: number) => (
                            <span key={i} className="text-xs font-medium text-zinc-200 bg-zinc-800 border border-zinc-700 px-2.5 py-1 rounded-lg">
                              {d}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>

        </div>
      </div>
    </div>
  );
}

