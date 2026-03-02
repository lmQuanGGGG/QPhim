'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Play, Info, Crown, Star, Calendar, Languages, Tv } from 'lucide-react';

interface HeroMovie {
  _id: string;
  name: string;
  slug: string;
  origin_name: string;
  thumb_url: string;
  poster_url: string;
  quality: string;
  year: number;
  lang: string;
  episode_current: string;
}

interface HeroCarouselProps {
  movies: HeroMovie[];
}

export default function HeroCarousel({ movies }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [key, setKey] = useState(0); // force re-render progress bar

  const goTo = useCallback(
    (index: number) => {
      if (index === current || isTransitioning) return;
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrent(index);
        setKey((k) => k + 1);
        setTimeout(() => setIsTransitioning(false), 50);
      }, 400);
    },
    [current, isTransitioning]
  );

  // Auto-advance every 5s
  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % movies.length);
        setKey((k) => k + 1);
        setTimeout(() => setIsTransitioning(false), 50);
      }, 400);
    }, 5000);
    return () => clearInterval(timer);
  }, [movies.length]);

  const movie = movies[current];
  if (!movie) return null;

  return (
    <section className="relative h-[75vh] sm:h-[80vh] lg:h-[88vh] overflow-hidden">
      {/* Backdrop images */}
      {movies.map((m, i) => (
        <div
          key={m._id}
          className={`absolute inset-0 transition-opacity duration-[900ms] ease-in-out ${
            i === current && !isTransitioning ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={`https://img.ophim.live/uploads/movies/${m.thumb_url}`}
            alt=""
            className="w-full h-full object-cover"
            draggable={false}
          />
        </div>
      ))}

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#07070d] via-[#07070d]/60 to-transparent z-[1]" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#07070d] via-[#07070d]/30 to-transparent z-[1]" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#07070d]/40 via-transparent to-transparent z-[1]" />

      {/* Hero content */}
      <div className="relative z-10 h-full max-w-[1920px] mx-auto px-5 sm:px-8 lg:px-14 xl:px-20 flex items-end pb-28 sm:pb-32 lg:pb-36">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between w-full gap-8 lg:gap-16">
          {/* Left: movie info */}
          <div
            className={`max-w-2xl transition-all duration-500 ${
              isTransitioning
                ? 'opacity-0 translate-y-4'
                : 'opacity-100 translate-y-0'
            }`}
          >
            {/* Trending badge + quality */}
            <div className="flex items-center gap-2.5 mb-5">
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 to-red-500 text-white text-xs sm:text-sm font-bold tracking-wide shadow-lg shadow-red-600/25">
                <Crown className="w-3.5 h-3.5" />
                #{current + 1} Trending
              </span>
              <span className="px-3 py-2 rounded-lg bg-white/10 backdrop-blur-md text-white text-xs sm:text-sm font-bold border border-white/10">
                {movie.quality}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.2rem] font-black text-white leading-[1.08] tracking-tight mb-3">
              {movie.name}
            </h1>

            {/* Origin name */}
            <p className="text-sm sm:text-base md:text-lg text-zinc-300/80 font-medium italic mb-5">
              {movie.origin_name}
            </p>

            {/* Meta chips */}
            <div className="flex flex-wrap items-center gap-2 mb-7">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/[0.08] text-zinc-300 text-xs sm:text-sm font-medium">
                <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                {movie.year}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/[0.08] text-zinc-300 text-xs sm:text-sm font-medium">
                <Languages className="w-3.5 h-3.5 text-zinc-400" />
                {movie.lang}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/[0.08] text-zinc-300 text-xs sm:text-sm font-medium">
                <Tv className="w-3.5 h-3.5 text-zinc-400" />
                {movie.episode_current}
              </span>
            </div>

            {/* CTA buttons */}
            <div className="flex items-center gap-3">
              <Link
                href={`/phim/${movie.slug}`}
                className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-red-600 to-red-500 text-white pl-5 pr-7 py-3.5 sm:py-4 rounded-2xl font-bold text-sm sm:text-base shadow-xl shadow-red-600/30 hover:shadow-red-600/50 hover:scale-[1.03] active:scale-[0.98] transition-all overflow-hidden"
              >
                <span className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-xl group-hover:bg-white/30 transition-colors">
                  <Play className="w-5 h-5 fill-white text-white" />
                </span>
                Xem ngay
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </Link>
              <Link
                href={`/phim/${movie.slug}`}
                className="group inline-flex items-center gap-2.5 px-6 py-3.5 sm:py-4 rounded-2xl font-semibold text-sm sm:text-base text-white/90 bg-white/[0.08] backdrop-blur-xl border border-white/[0.1] hover:bg-white/[0.15] hover:border-white/20 transition-all"
              >
                <Info className="w-4.5 h-4.5 text-zinc-300" />
                Chi tiết
              </Link>
            </div>
          </div>

          {/* Right: thumbnail selectors (xl+) */}
          <div className="hidden xl:flex items-end gap-3 pb-2">
            {movies.slice(0, 6).map((m, i) => (
              <button
                key={m._id}
                onClick={() => goTo(i)}
                className={`group relative transition-all duration-300 ${
                  i === current
                    ? 'scale-105'
                    : 'opacity-50 hover:opacity-90'
                }`}
              >
                <div
                  className={`relative overflow-hidden rounded-2xl transition-all duration-300 ${
                    i === current
                      ? 'border-2 border-red-500/70 w-[115px] h-[170px] shadow-lg shadow-red-500/20'
                      : 'border border-white/[0.08] hover:border-white/20 w-[95px] h-[142px]'
                  }`}
                >
                  <img
                    src={`https://img.ophim.live/uploads/movies/${m.poster_url}`}
                    alt={m.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    draggable={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-white text-[10px] font-semibold line-clamp-2 leading-tight drop-shadow-md">
                      {m.name}
                    </p>
                  </div>
                </div>
                <span
                  className={`absolute -top-1.5 -left-1.5 z-10 w-6 h-6 text-[10px] font-black rounded-full flex items-center justify-center shadow-lg transition-colors ${
                    i === current
                      ? 'bg-red-600 text-white'
                      : 'bg-white/90 text-[#07070d]'
                  }`}
                >
                  {i + 1}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom progress bar + dots – mobile / tablet */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 xl:hidden flex items-center gap-2">
        {movies.slice(0, 6).map((m, i) => (
          <button
            key={`${m._id}-${key}`}
            onClick={() => goTo(i)}
            className="relative h-1.5 rounded-full overflow-hidden transition-all duration-300"
            style={{ width: i === current ? 36 : 8 }}
          >
            <div
              className={`absolute inset-0 rounded-full ${
                i === current ? 'bg-white/40' : 'bg-white/20'
              }`}
            />
            {i === current && (
              <div
                className="absolute inset-0 bg-red-500 rounded-full origin-left"
                style={{ animation: 'progressFill 5s linear forwards' }}
              />
            )}
          </button>
        ))}
      </div>
    </section>
  );
}
