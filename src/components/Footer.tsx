import { Film, Facebook, Youtube, Mail } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800/60 mt-20">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-24 py-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-red-600 to-pink-600 p-1.5 rounded-lg">
              <Film className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
              QMovie
            </span>
          </Link>

          {/* Links */}
          <div className="flex items-center gap-5 text-sm text-zinc-500">
            <Link href="/phim-bo" className="hover:text-zinc-300 transition-colors">Phim bộ</Link>
            <Link href="/phim-le" className="hover:text-zinc-300 transition-colors">Phim lẻ</Link>
            <Link href="/hoat-hinh" className="hover:text-zinc-300 transition-colors">Hoạt hình</Link>
            <Link href="/phim-moi" className="hover:text-zinc-300 transition-colors">Phim mới</Link>
          </div>

          {/* Social + Copyright */}
          <div className="flex items-center gap-3">
            <a href="#" className="text-zinc-600 hover:text-white transition-colors">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="#" className="text-zinc-600 hover:text-white transition-colors">
              <Youtube className="w-4 h-4" />
            </a>
            <a href="#" className="text-zinc-600 hover:text-white transition-colors">
              <Mail className="w-4 h-4" />
            </a>
            <span className="text-zinc-700 text-xs ml-1">© {new Date().getFullYear()} QMovie</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

