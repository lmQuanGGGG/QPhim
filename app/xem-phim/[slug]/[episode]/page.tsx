import { movieService } from '@/services/api';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import VideoPlayer from '@/components/VideoPlayer';
import MovieDetailTabs from '@/components/MovieDetailTabs';
import EpisodeSidebar from '@/components/EpisodeSidebar';
import { Home, ChevronRight } from 'lucide-react';

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string; episode: string }>
}) {
  const resolvedParams = await params;
  try {
    const { movie } = await movieService.getMovieDetail(resolvedParams.slug);
    return {
      title: `Xem ${movie.name} - ${resolvedParams.episode} | QMovie`,
      description: `Xem phim ${movie.name} ${resolvedParams.episode} vietsub full HD miễn phí`,
    };
  } catch {
    return {
      title: 'Xem phim | QMovie',
    };
  }
}

export default async function WatchMoviePage({ 
  params 
}: { 
  params: Promise<{ slug: string; episode: string }>
}) {
  const resolvedParams = await params;
  let movieData;
  
  try {
    movieData = await movieService.getMovieDetail(resolvedParams.slug);
  } catch (error) {
    notFound();
  }

  const { movie, episodes } = movieData;
  
  // Tìm episode hiện tại
  let currentEpisode = null;
  let currentServer = null;
  
  for (const server of episodes) {
    const ep = server.server_data.find((e: any) => e.slug === resolvedParams.episode);
    if (ep) {
      currentEpisode = ep;
      currentServer = server;
      break;
    }
  }

  if (!currentEpisode || !currentServer) {
    notFound();
  }

  // Tìm episode trước và sau
  const currentIndex = currentServer.server_data.findIndex((e: any) => e.slug === resolvedParams.episode);
  const prevEpisode = currentIndex > 0 ? currentServer.server_data[currentIndex - 1] : null;
  const nextEpisode = currentIndex < currentServer.server_data.length - 1 
    ? currentServer.server_data[currentIndex + 1] 
    : null;

  return (
    <div className="min-h-screen bg-[#0f0f0f] pb-24 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-zinc-600 mb-6 flex-wrap">
          <Link href="/" className="hover:text-zinc-300 transition-colors">
            <Home className="w-4 h-4" />
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link href={`/phim/${movie.slug}`} className="hover:text-zinc-300 transition-colors truncate max-w-[200px]">
            {movie.name}
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-zinc-400 font-medium">{currentEpisode.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 lg:gap-10">

          {/* ── Main Content ── */}
          <div className="flex flex-col gap-5">

            {/* Video Player */}
            <div className="rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/5">
              <VideoPlayer
                embedUrl={currentEpisode.link_embed}
                movieName={`${movie.name} - ${currentEpisode.name}`}
              />
            </div>

            {/* Prev / Now Playing / Next */}
            <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/50 px-5 py-4 flex items-center justify-between gap-4 flex-wrap">
              <div className="order-2 sm:order-1">
                {prevEpisode ? (
                  <Link
                    href={`/xem-phim/${movie.slug}/${prevEpisode.slug}`}
                    className="inline-flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm px-5 py-2.5 rounded-xl font-semibold transition-all hover:scale-105"
                  >
                    ← Tập trước
                  </Link>
                ) : (
                  <span className="inline-flex items-center gap-2 bg-zinc-900/80 text-zinc-700 text-sm px-5 py-2.5 rounded-xl font-semibold cursor-not-allowed border border-zinc-800">
                    ← Tập trước
                  </span>
                )}
              </div>

              <div className="text-center order-1 w-full sm:w-auto sm:order-2 mb-2 sm:mb-0">
                <p className="text-zinc-600 text-[11px] uppercase tracking-widest mb-0.5">Đang xem</p>
                <p className="text-white font-bold text-sm">{currentEpisode.name}</p>
              </div>

              <div className="order-3">
                {nextEpisode ? (
                  <Link
                    href={`/xem-phim/${movie.slug}/${nextEpisode.slug}`}
                    className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white text-sm px-5 py-2.5 rounded-xl font-semibold transition-all hover:scale-105 shadow-lg shadow-red-600/20"
                  >
                    Tập sau →
                  </Link>
                ) : (
                  <span className="inline-flex items-center gap-2 bg-zinc-900/80 text-zinc-700 text-sm px-5 py-2.5 rounded-xl font-semibold cursor-not-allowed border border-zinc-800">
                    Tập sau →
                  </span>
                )}
              </div>
            </div>

            {/* Movie title card */}
            <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/40 px-6 py-4 flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-lg md:text-xl font-black text-white leading-snug">
                  {movie.name}
                </h1>
                <p className="text-sm text-zinc-500 font-medium mt-0.5 italic">{movie.origin_name}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg">{movie.quality}</span>
                  <span className="bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-semibold px-3 py-1.5 rounded-lg">{movie.lang}</span>
                  <span className="bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-semibold px-3 py-1.5 rounded-lg">{movie.year}</span>
                </div>
              </div>
              <Link
                href={`/phim/${movie.slug}`}
                className="shrink-0 inline-flex items-center gap-1.5 text-sm text-red-400 hover:text-red-300 font-semibold border border-red-600/30 hover:border-red-500/60 px-4 py-2 rounded-xl transition-all"
              >
                Xem chi tiết →
              </Link>
            </div>

            {/* Mobile: Episode selector */}
            <div className="lg:hidden">
              <EpisodeSidebar
                episodes={episodes}
                currentEpisodeSlug={resolvedParams.episode}
                movieSlug={movie.slug}
              />
            </div>

            {/* Movie info / actors */}
            <MovieDetailTabs
              movie={movie}
              episodes={episodes}
              currentEpisodeSlug={resolvedParams.episode}
              defaultTab="info"
              excludeTabs={['episodes']}
            />
          </div>

           <div className="hidden lg:block relative">
             <div className="sticky top-20 space-y-6">
                 {/* Playlist / Episode List Component */}
                 <div className="z-20 relative">
                    <EpisodeSidebar 
                      episodes={episodes} 
                      currentEpisodeSlug={resolvedParams.episode} 
                      movieSlug={movie.slug}
                    />
                 </div>
                 
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
