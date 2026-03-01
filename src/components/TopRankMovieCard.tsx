'use client';

import Link from 'next/link';
import type { Movie } from '@/types/movie';

interface TopRankMovieCardProps {
  movie: Movie;
  rank: number;
}

export default function TopRankMovieCard({ movie, rank }: TopRankMovieCardProps) {
  return (
    <Link href={`/phim/${movie.slug}`} className="group block">
      <div className="relative rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800/70 shadow-xl">
        <img
          src={`https://img.ophim.live/uploads/movies/${movie.poster_url}`}
          alt={movie.name}
          loading="lazy"
          draggable={false}
          className="block w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105 select-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="bg-black/70 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-lg border border-white/10">
            {movie.quality}
          </span>
          <span className="bg-blue-600/90 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
            {movie.episode_current}
          </span>
        </div>
      </div>

      <div className="mt-3 flex items-start gap-3">
        <span className="text-5xl md:text-6xl font-black italic leading-none text-yellow-300/90 drop-shadow-sm">
          {rank}
        </span>
        <div className="min-w-0 pt-1">
          <h3 className="text-white font-bold text-2xl/6 line-clamp-1">{movie.name}</h3>
          <p className="text-zinc-400 text-xl line-clamp-1 mt-1">{movie.origin_name}</p>
          <p className="text-zinc-300 text-xl font-medium mt-1 line-clamp-1">{movie.episode_current}</p>
        </div>
      </div>
    </Link>
  );
}
