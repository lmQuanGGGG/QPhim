'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Film, Search, Menu, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/tim-kiem?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-b border-zinc-800 shadow-2xl">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-br from-red-600 to-pink-600 p-1.5 rounded-lg group-hover:scale-110 transition-transform">
              <Film className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
              QMovie
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-zinc-300 hover:text-white transition-colors">
              Trang chủ
            </Link>
            <Link href="/phim-bo" className="text-zinc-300 hover:text-white transition-colors">
              Phim bộ
            </Link>
            <Link href="/phim-le" className="text-zinc-300 hover:text-white transition-colors">
              Phim lẻ
            </Link>
            <Link href="/hoat-hinh" className="text-zinc-300 hover:text-white transition-colors">
              Hoạt hình
            </Link>
            
            {/* Dropdown Quốc gia */}
            <div className="relative group">
              <button className="text-zinc-300 hover:text-white transition-colors flex items-center gap-1">
                Quốc gia
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute top-full left-0 mt-2 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 min-w-[200px]">
                <Link href="/quoc-gia/han-quoc" className="block px-4 py-2 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors rounded-t-lg">
                  🇰🇷 Phim Hàn Quốc
                </Link>
                <Link href="/quoc-gia/trung-quoc" className="block px-4 py-2 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors">
                  🇨🇳 Phim Trung Quốc
                </Link>
                <Link href="/quoc-gia/nhat-ban" className="block px-4 py-2 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors">
                  🇯🇵 Phim Nhật Bản
                </Link>
                <Link href="/quoc-gia/thai-lan" className="block px-4 py-2 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors">
                  🇹🇭 Phim Thái Lan
                </Link>
                <Link href="/quoc-gia/au-my" className="block px-4 py-2 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors rounded-b-lg">
                  🇺🇸 Phim Âu Mỹ
                </Link>
              </div>
            </div>
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center">
            <div className="relative w-80">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm phim, diễn viên..."
                className="w-full h-10 bg-zinc-900/85 text-white px-4 pr-12 rounded-full border border-zinc-700/70 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all placeholder:text-zinc-500 text-sm text-left leading-5"
              />
              <button
                type="submit"
                aria-label="Tìm phim"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center transition-colors"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white p-1.5"
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-zinc-800">
            <nav className="flex flex-col gap-4">
              <Link href="/" className="text-zinc-300 hover:text-white transition-colors">
                Trang chủ
              </Link>
              <Link href="/phim-bo" className="text-zinc-300 hover:text-white transition-colors">
                Phim bộ
              </Link>
              <Link href="/phim-le" className="text-zinc-300 hover:text-white transition-colors">
                Phim lẻ
              </Link>
              <Link href="/hoat-hinh" className="text-zinc-300 hover:text-white transition-colors">
                Hoạt hình
              </Link>
              
              {/* Mobile Quốc gia */}
              <div className="border-t border-zinc-800 pt-4">
                <p className="text-zinc-500 text-sm mb-2 uppercase">Quốc gia</p>
                <Link href="/quoc-gia/han-quoc" className="block text-zinc-300 hover:text-white transition-colors mb-2">
                  🇰🇷 Phim Hàn Quốc
                </Link>
                <Link href="/quoc-gia/trung-quoc" className="block text-zinc-300 hover:text-white transition-colors mb-2">
                  🇨🇳 Phim Trung Quốc
                </Link>
                <Link href="/quoc-gia/nhat-ban" className="block text-zinc-300 hover:text-white transition-colors mb-2">
                  🇯🇵 Phim Nhật Bản
                </Link>
                <Link href="/quoc-gia/thai-lan" className="block text-zinc-300 hover:text-white transition-colors mb-2">
                  🇹🇭 Phim Thái Lan
                </Link>
                <Link href="/quoc-gia/au-my" className="block text-zinc-300 hover:text-white transition-colors">
                  🇺🇸 Phim Âu Mỹ
                </Link>
              </div>
              
              <form onSubmit={handleSearch} className="mt-2 border-t border-zinc-800 pt-4">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm phim, diễn viên..."
                    className="w-full h-11 bg-zinc-900 text-white px-4 pr-12 rounded-full border border-zinc-700 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20 placeholder:text-zinc-500 text-sm text-between leading-5"
                  />
                  <button
                    type="submit"
                    aria-label="Tìm phim"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center transition-colors"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </nav>
          </div>
        )}
      </nav>
    </header>
  );
}
