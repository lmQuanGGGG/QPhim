'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import type { Episode as Server } from '@/types/movie';

interface Props {
  episodes: Server[];
  currentEpisodeSlug: string;
  movieSlug: string;
}

export default function EpisodeSidebar({ episodes, currentEpisodeSlug, movieSlug }: Props) {
  const [activeServer, setActiveServer] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
    const [activeChunk, setActiveChunk] = useState(0);
    const CHUNK_SIZE = 30;
  
  const currentServer = episodes?.[activeServer];
  const allEpisodes = currentServer?.server_data || [];
    const normalizedQuery = searchQuery.trim().toLowerCase();
  
  // Filter episodes
    const filteredEpisodes = allEpisodes.filter((ep) =>
        ep.name.toLowerCase().includes(normalizedQuery)
  );

    const totalChunks = Math.ceil(allEpisodes.length / CHUNK_SIZE);
    const chunkStart = activeChunk * CHUNK_SIZE;
    const chunkEnd = chunkStart + CHUNK_SIZE;

    const episodesToRender = normalizedQuery
        ? filteredEpisodes
        : allEpisodes.slice(chunkStart, chunkEnd);

    const getVisibleChunkIndexes = () => {
        if (totalChunks <= 5) {
            return Array.from({ length: totalChunks }, (_, idx) => idx);
        }

        const indexes = new Set<number>([0, totalChunks - 1, activeChunk]);
        if (activeChunk - 1 > 0) indexes.add(activeChunk - 1);
        if (activeChunk + 1 < totalChunks - 1) indexes.add(activeChunk + 1);

        return Array.from(indexes).sort((a, b) => a - b);
    };

    const visibleChunkIndexes = getVisibleChunkIndexes();

  // Auto-scroll to current episode
  const activeEpisodeRef = useRef<HTMLAnchorElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
        if (!normalizedQuery) {
            const currentIndex = allEpisodes.findIndex((ep) => ep.slug === currentEpisodeSlug);
            if (currentIndex >= 0) {
                setActiveChunk(Math.floor(currentIndex / CHUNK_SIZE));
            }
        }

    if (activeEpisodeRef.current && listRef.current) {
            activeEpisodeRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            });
    }
    }, [currentEpisodeSlug, activeServer, allEpisodes, normalizedQuery]);

  if (!episodes || episodes.length === 0) return null;

    return (
        <div className="bg-zinc-900/60 backdrop-blur-sm border border-zinc-800/50 rounded-2xl overflow-hidden flex flex-col h-[620px] lg:h-[600px]">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800/50 bg-zinc-900/80 backdrop-blur-md z-10">
                <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
                        <span className="w-1 h-5 bg-red-600 rounded-full" />
                        Danh sách tập
        </h3>

        {/* Server Selection if multiple */}
        {episodes.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-2">
                {episodes.map((server, idx) => (
                    <button
                        key={idx}
                                                onClick={() => {
                                                    setActiveServer(idx);
                                                    setSearchQuery('');
                                                    setActiveChunk(0);
                                                }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all border ${
                            activeServer === idx
                                ? 'bg-red-600 text-white border-red-500'
                                : 'bg-zinc-900 text-zinc-400 border-zinc-700 hover:text-white hover:bg-zinc-800'
                        }`}
                    >
                        {server.server_name}
                    </button>
                ))}
            </div>
        )}

        {/* Search */}
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
                type="text" 
                placeholder="Tìm tập..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-sm text-zinc-200 focus:outline-none focus:border-red-600/50 transition-colors"
            />
        </div>

      </div>

            {/* Title / Range */}
            <div className="px-4 py-3 border-b border-zinc-800/50 flex items-center justify-between gap-2">
                <h4 className="text-zinc-100 font-bold text-xl">Danh sách tập</h4>
                <p className="text-zinc-400 text-sm font-medium whitespace-nowrap">
                    Tập {Math.min(chunkStart + 1, allEpisodes.length)}-{Math.min(chunkEnd, allEpisodes.length)} / {allEpisodes.length}
                </p>
            </div>

      {/* Episode List */}
            <div ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
                {episodesToRender.length > 0 ? (
                         <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-3 gap-2.5">
                                {episodesToRender.map((episode, idx) => {
                    const isActive = episode.slug === currentEpisodeSlug;
                    return (
                        <Link
                            key={`${episode.slug}-${idx}`}
                            href={`/xem-phim/${movieSlug}/${episode.slug}`}
                            ref={isActive ? activeEpisodeRef : null}
                                                        className={`group relative flex items-center justify-center py-3.5 px-2 rounded-xl text-lg font-semibold transition-all border ${
                                isActive 
                                                                        ? 'bg-zinc-700/90 text-white border-zinc-500 shadow-lg' 
                                                                        : 'bg-zinc-800/40 text-zinc-300 border-zinc-700/40 hover:bg-zinc-800 hover:text-white hover:border-zinc-600'
                            }`}
                        >
                                                        {isActive && <span className="absolute left-3 right-3 bottom-1 h-1 rounded-full bg-yellow-300" />}
                            <span className="truncate">{episode.name}</span>
                        </Link>
                    );
                })}
             </div>
        ) : (
            <div className="text-center py-8 text-zinc-500 text-sm">
                Không tìm thấy tập phim
            </div>
        )}
      </div>
      
            {/* Bottom pager */}
            {!normalizedQuery && totalChunks > 1 && (
                <div className="p-3 bg-zinc-900/80 border-t border-zinc-800/50">
                    <div className="flex items-center justify-between gap-2">
                        <button
                            onClick={() => setActiveChunk((prev) => Math.max(prev - 1, 0))}
                            disabled={activeChunk === 0}
                            className="px-2.5 py-1.5 rounded-lg text-zinc-300 disabled:text-zinc-600 disabled:cursor-not-allowed hover:bg-zinc-800 transition-colors"
                        >
                            ‹
                        </button>

                        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
                            {visibleChunkIndexes.map((idx, i) => {
                                const prev = visibleChunkIndexes[i - 1];
                                const showDots = i > 0 && prev !== undefined && idx - prev > 1;
                                const start = idx * CHUNK_SIZE + 1;
                                const end = Math.min((idx + 1) * CHUNK_SIZE, allEpisodes.length);
                                const isActive = idx === activeChunk;

                                return (
                                    <div key={`chunk-wrap-${idx}`} className="flex items-center gap-2">
                                        {showDots && <span className="text-zinc-500">...</span>}
                                        <button
                                            onClick={() => setActiveChunk(idx)}
                                            className={`px-3 py-1.5 rounded-lg text-sm font-semibold whitespace-nowrap border transition-colors ${
                                                isActive
                                                    ? 'bg-yellow-300 text-zinc-900 border-yellow-200'
                                                    : 'bg-zinc-900 text-zinc-400 border-zinc-700 hover:text-white hover:border-zinc-500'
                                            }`}
                                        >
                                            {start}-{end}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>

                        <button
                            onClick={() => setActiveChunk((prev) => Math.min(prev + 1, totalChunks - 1))}
                            disabled={activeChunk === totalChunks - 1}
                            className="px-2.5 py-1.5 rounded-lg text-zinc-300 disabled:text-zinc-600 disabled:cursor-not-allowed hover:bg-zinc-800 transition-colors"
                        >
                            ›
                        </button>
                    </div>
                </div>
            )}

            {/* Footer / Stats */}
            <div className="p-3 bg-zinc-900/80 border-t border-zinc-800/50 text-center">
                <p className="text-xs text-zinc-500">
                        Tổng số: <span className="text-zinc-300 font-bold">{allEpisodes.length}</span> tập
                </p>
            </div>
    </div>
  );
}
