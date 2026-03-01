'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Info, Film, Users, ChevronDown, ChevronUp,
  Calendar, Clock, Globe, FileText, Star, Eye
} from 'lucide-react';
import type { Movie, Episode as Server } from '@/types/movie';

interface Props {
  movie: Movie;
  episodes: Server[];
  currentEpisodeSlug?: string;
  defaultTab?: string;
  excludeTabs?: string[];
}

const ALL_TABS = [
  { id: 'info', label: 'Thông tin', icon: Info },
  { id: 'episodes', label: 'Tập phim', icon: Film },
  { id: 'actors', label: 'Diễn viên', icon: Users },
];

export default function MovieDetailTabs({
  movie,
  episodes,
  currentEpisodeSlug,
  defaultTab = 'episodes',
  excludeTabs = [],
}: Props) {
  const [activeTab, setActiveTab] = useState(() => {
    if (excludeTabs.includes(defaultTab)) {
      return ALL_TABS.find((t) => !excludeTabs.includes(t.id))?.id || defaultTab;
    }
    return defaultTab;
  });

  const TABS = ALL_TABS.filter((t) => !excludeTabs.includes(t.id));
  const [activeServer, setActiveServer] = useState(0);
  const [showAllEpisodes, setShowAllEpisodes] = useState(false);

  const currentServer = episodes?.[activeServer];
  const EPISODE_LIMIT = 30;
  const episodesToShow = showAllEpisodes
    ? currentServer?.server_data
    : currentServer?.server_data?.slice(0, EPISODE_LIMIT);

  return (
    <div className="w-full">
      {/* ── Tab Navigation ── */}
      <div className="flex items-center gap-2 bg-zinc-900/60 border border-zinc-800/60 rounded-full p-1.5 mb-8 w-fit mx-auto sm:mx-0 backdrop-blur-md sticky md:static top-20 z-40 shadow-2xl shadow-black/50">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 overflow-hidden ${
                activeTab === tab.id
                  ? 'text-white shadow-[0_0_20px_rgba(220,38,38,0.4)]'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {activeTab === tab.id && (
                <span className="absolute inset-0 bg-gradient-to-r from-red-600 to-rose-600 -z-10" />
              )}
              <Icon className={`w-4 h-4 ${activeTab === tab.id ? 'animate-pulse' : ''}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── Tab: Thông tin ── */}
      {activeTab === 'info' && (
        <div className="animate-fadeIn space-y-8">
          
          {/* Top Grid: Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-zinc-900/40 p-4 rounded-2xl border border-zinc-800/50 flex flex-col items-center justify-center text-center gap-2">
               <div className="p-2 bg-red-500/10 rounded-full text-red-500"><Star className="w-5 h-5 fill-current" /></div>
               <div>
                  <div className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Đánh giá</div>
                  <div className="text-lg font-bold text-white">9.8 <span className="text-xs text-zinc-500 font-normal">/ 10</span></div>
               </div>
            </div>
            <div className="bg-zinc-900/40 p-4 rounded-2xl border border-zinc-800/50 flex flex-col items-center justify-center text-center gap-2">
               <div className="p-2 bg-blue-500/10 rounded-full text-blue-500"><Eye className="w-5 h-5" /></div>
               <div>
                  <div className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Lượt xem</div>
                  <div className="text-lg font-bold text-white">{movie.view.toLocaleString()}</div>
               </div>
            </div>
            <div className="bg-zinc-900/40 p-4 rounded-2xl border border-zinc-800/50 flex flex-col items-center justify-center text-center gap-2">
               <div className="p-2 bg-purple-500/10 rounded-full text-purple-500"><Calendar className="w-5 h-5" /></div>
               <div>
                  <div className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Năm</div>
                  <div className="text-lg font-bold text-white">{movie.year}</div>
               </div>
            </div>
            <div className="bg-zinc-900/40 p-4 rounded-2xl border border-zinc-800/50 flex flex-col items-center justify-center text-center gap-2">
               <div className="p-2 bg-amber-500/10 rounded-full text-amber-500"><Clock className="w-5 h-5" /></div>
               <div>
                  <div className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Thời lượng</div>
                  <div className="text-lg font-bold text-white">{movie.time || 'N/A'}</div>
               </div>
            </div>
          </div>

          {/* Main Info Block */}
          <div className="space-y-6">
            <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-6 md:p-8">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-zinc-400" />
                Nội dung phim
              </h3>
              <div
                className="text-zinc-300 leading-relaxed text-[15px]"
                dangerouslySetInnerHTML={{ __html: movie.content || 'Đang cập nhật...' }}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-5">
                <h4 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Globe className="w-4 h-4" /> Quốc gia
                </h4>
                <div className="flex flex-wrap gap-2">
                  {movie.country?.length ? (
                    movie.country.map((c, index) => (
                      <Link
                        key={`${c.id}-${index}`}
                        href={`/quoc-gia/${c.slug}`}
                        className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1.5 rounded-lg transition-colors border border-zinc-700/50"
                      >
                        {c.name}
                      </Link>
                    ))
                  ) : (
                    <span className="text-sm text-zinc-500">Đang cập nhật</span>
                  )}
                </div>
              </div>

              <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-5">
                <h4 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-3">Thể loại</h4>
                <div className="flex flex-wrap gap-2">
                  {movie.category?.length ? (
                    movie.category.map((c, index) => (
                      <Link
                        key={`${c.id}-${index}`}
                        href={`/the-loai/${c.slug}`}
                        className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1.5 rounded-lg transition-colors border border-zinc-700/50"
                      >
                        {c.name}
                      </Link>
                    ))
                  ) : (
                    <span className="text-sm text-zinc-500">Đang cập nhật</span>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ── Tab: Tập phim ── */}
      {activeTab === 'episodes' && (
        <div className="animate-fadeIn">
          {episodes?.length > 0 ? (
            <div className="bg-zinc-900/50 border border-zinc-800/60 rounded-2xl overflow-hidden">
              {/* Server tabs */}
              {episodes.length > 1 && (
                <div className="px-6 py-4 border-b border-zinc-800/60 flex flex-wrap gap-2">
                  {episodes.map((server, idx) => (
                    <button
                      key={idx}
                      onClick={() => { setActiveServer(idx); setShowAllEpisodes(false); }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        activeServer === idx
                          ? 'bg-blue-600 text-white'
                          : 'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700'
                      }`}
                    >
                      {server.server_name}
                    </button>
                  ))}
                </div>
              )}
              {episodes.length === 1 && (
                <div className="px-6 py-4 border-b border-zinc-800/60 flex items-center gap-2.5">
                  <span className="w-1 h-5 bg-blue-500 rounded-full block" />
                  <h3 className="text-base font-bold text-white">{episodes[0].server_name}</h3>
                </div>
              )}

              {/* Episode grid */}
              <div className="px-6 py-5">
                <div className="grid grid-cols-6 sm:grid-cols-9 md:grid-cols-12 gap-2">
                  {episodesToShow?.map((episode, idx) => (
                    <Link
                      key={`${episode.slug}-${idx}`}
                      href={`/xem-phim/${movie.slug}/${episode.slug}`}
                      className={`text-center py-2.5 rounded-xl transition-all hover:scale-105 text-sm font-semibold border ${
                        episode.slug === currentEpisodeSlug
                          ? 'bg-red-600 text-white border-red-600 shadow-md shadow-red-600/20'
                          : 'bg-zinc-800/80 hover:bg-red-600 text-zinc-300 hover:text-white border-zinc-700/40 hover:border-red-600'
                      }`}
                    >
                      {episode.name}
                    </Link>
                  ))}
                </div>

                {/* Show more / less */}
                {currentServer?.server_data?.length > EPISODE_LIMIT && (
                  <button
                    onClick={() => setShowAllEpisodes(!showAllEpisodes)}
                    className="mt-4 w-full flex items-center justify-center gap-2 py-3 text-sm text-zinc-400 hover:text-white bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/50 rounded-xl transition-all font-semibold"
                  >
                    {showAllEpisodes ? (
                      <>
                        <ChevronUp className="w-4 h-4" /> Rút gọn
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4" /> Xem thêm ({currentServer.server_data.length - EPISODE_LIMIT} tập)
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-zinc-500">Chưa có tập phim nào.</div>
          )}
        </div>
      )}

      {/* ── Tab: Diễn viên ── */}
      {activeTab === 'actors' && (
        <div className="animate-fadeIn">
          {movie.actor?.length > 0 ? (
            <div className="bg-zinc-900/50 border border-zinc-800/60 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-zinc-800/60 flex items-center gap-2.5">
                <span className="w-1 h-5 bg-purple-500 rounded-full block" />
                <h3 className="text-base font-bold text-white">Diễn viên</h3>
              </div>
              <div className="px-6 py-5 flex flex-wrap gap-2.5">
                {movie.actor.map((name, i) => (
                  <span
                    key={i}
                    className="bg-zinc-800 border border-zinc-700/50 text-zinc-300 text-sm px-3.5 py-2 rounded-xl hover:border-zinc-500 hover:text-white transition-all cursor-default"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-zinc-500">Chưa có thông tin diễn viên.</div>
          )}

          {/* Director */}
          {movie.director?.length > 0 && movie.director[0] !== 'Đang cập nhật' && (
            <div className="mt-4 bg-zinc-900/50 border border-zinc-800/60 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-zinc-800/60 flex items-center gap-2.5">
                <span className="w-1 h-5 bg-amber-500 rounded-full block" />
                <h3 className="text-base font-bold text-white">Đạo diễn</h3>
              </div>
              <div className="px-6 py-5 flex flex-wrap gap-2.5">
                {movie.director.map((name, i) => (
                  <span
                    key={i}
                    className="bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm px-3.5 py-2 rounded-xl"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
