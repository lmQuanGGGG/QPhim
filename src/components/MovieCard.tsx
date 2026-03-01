'use client';

import { Movie } from '@/types/movie';
import Link from 'next/link';
import { Play, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface MovieCardProps {
  movie: Movie;
  index?: number;
}

export default function MovieCard({ movie, index = 0 }: MovieCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative"
    >
      <Link href={`/phim/${movie.slug}`}>
        <div className="relative rounded-2xl overflow-hidden bg-zinc-900 shadow-2xl transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-red-500/20">
          {/* Movie Poster */}
          <img
            src={`https://img.ophim.live/uploads/movies/${movie.poster_url}`}
            alt={movie.name}
            loading="lazy"
            draggable={false}
            className="block w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500 select-none"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

          {/* Play Button - Shows on hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="bg-red-600 rounded-full p-4 transform scale-0 group-hover:scale-100 transition-transform duration-300 shadow-2xl">
              <Play className="w-8 h-8 text-white fill-white" />
            </div>
          </div>

          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2 z-10">
            {/* Quality Badge */}
            <span className="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
              {movie.quality}
            </span>
            
            {/* Episode Count */}
            {movie.episode_current && (
              <span className="bg-black/70 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
                {movie.episode_current}
              </span>
            )}
          </div>

          {/* Bottom Info */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-center gap-2 text-xs text-yellow-400 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Star className="w-3 h-3 fill-yellow-400" />
              <span className="font-semibold">
                {movie.year} • {movie.lang}
              </span>
            </div>
            <h3 className="text-white font-bold text-sm leading-tight line-clamp-2 drop-shadow-lg">
              {movie.name}
            </h3>
            <p className="text-zinc-300 text-xs mt-1 line-clamp-1 opacity-80">
              {movie.origin_name}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
