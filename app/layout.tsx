import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "QMovie - Xem phim online miễn phí chất lượng cao",
  description: "Xem phim online miễn phí, phim mới nhất, phim hay chất lượng HD. Cập nhật liên tục phim bộ, phim lẻ, hoạt hình.",
  keywords: ["phim", "xem phim", "phim online", "phim hay", "phim mới"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  return (
    <html lang="vi" className="dark">
      <body className={`${inter.variable} antialiased bg-black text-white font-sans`}>
        {adsenseClient && (
          <Script
            id="adsense-script"
            async
            strategy="afterInteractive"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
            crossOrigin="anonymous"
          />
        )}
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
