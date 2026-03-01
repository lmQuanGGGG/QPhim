'use client';

import { useState, useEffect } from 'react';
import { Maximize, Volume2, VolumeX, Play } from 'lucide-react';

interface VideoPlayerProps {
  embedUrl: string;
  movieName: string;
}

export default function VideoPlayer({ embedUrl, movieName }: VideoPlayerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Reset loading state khi URL thay đổi
    setIsLoading(true);
    setHasError(false);
  }, [embedUrl]);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div className="relative w-full">
      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center rounded-xl z-10">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-zinc-400 text-sm">Đang tải phim...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center rounded-xl z-10">
          <div className="text-center px-4">
            <div className="bg-red-600/20 rounded-full p-4 inline-block mb-4">
              <VolumeX className="w-12 h-12 text-red-500" />
            </div>
            <p className="text-white text-lg font-semibold mb-2">Không thể tải video</p>
            <p className="text-zinc-400 text-sm mb-4">Vui lòng thử lại sau hoặc chọn tập khác</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Tải lại trang
            </button>
          </div>
        </div>
      )}

      {/* Video Iframe */}
      <div className="relative aspect-video w-full bg-black rounded-xl overflow-hidden shadow-2xl border-2 border-zinc-800">
        <iframe
          src={embedUrl}
          className="w-full h-full"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          title={movieName}
          onLoad={handleLoad}
          onError={handleError}
          referrerPolicy="origin"
        />
      </div>

      {/* Player Info */}
      <div className="mt-4 flex items-center justify-between text-sm text-zinc-500">
        <div className="flex items-center gap-2">
          <Play className="w-4 h-4" />
          <span>Đang phát: {movieName}</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="hover:text-white transition-colors flex items-center gap-1">
            <Volume2 className="w-4 h-4" />
            <span>HD</span>
          </button>
          <button className="hover:text-white transition-colors flex items-center gap-1">
            <Maximize className="w-4 h-4" />
            <span>Toàn màn hình</span>
          </button>
        </div>
      </div>
    </div>
  );
}

