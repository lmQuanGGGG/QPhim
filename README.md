# QMovie - Xem phim online miễn phí 🎬

Website xem phim online hiện đại, được xây dựng với Next.js 15 và Tailwind CSS.

## ✨ Tính năng

- 🎥 **Xem phim miễn phí** - Hàng ngàn bộ phim, phim lẻ, hoạt hình
- 🔍 **Tìm kiếm thông minh** - Tìm phim nhanh chóng và chính xác
- 📱 **Responsive Design** - Hoạt động mượt mà trên mọi thiết bị
- ⚡ **Tốc độ cao** - Tối ưu hóa với Next.js App Router và caching
- 🎨 **Giao diện đẹp mắt** - UI/UX hiện đại với Framer Motion
- 💰 **Tích hợp quảng cáo** - Sẵn sàng monetization

## 🚀 Công nghệ sử dụng

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Library**: Lucide React Icons
- **Animation**: Framer Motion
- **API**: Ophim API (https://ophim1.com)

## 📦 Cài đặt

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem kết quả.

## 📁 Cấu trúc thư mục

```
my-movie-web/
├── app/                    # Next.js App Router pages
│   ├── phim/              # Trang chi tiết phim
│   ├── xem-phim/          # Trang xem phim
│   ├── phim-bo/           # Danh sách phim bộ
│   ├── phim-le/           # Danh sách phim lẻ
│   ├── hoat-hinh/         # Danh sách hoạt hình
│   └── tim-kiem/          # Trang tìm kiếm
├── src/
│   ├── components/        # React components
│   ├── services/          # API services
│   ├── types/             # TypeScript types
│   └── lib/               # Utility functions
└── public/                # Static files
```

## 💰 Monetization

Website đã được tích hợp sẵn các vị trí quảng cáo chiến lược. Để kích hoạt, thay thế code trong:
- `src/components/ads/AdsBanner.tsx`
- `src/components/ads/AdsSidebar.tsx`

## 🚀 Deploy

```bash
npm run build
npm start
```

---

Made with ❤️ by Quang
# QPhim
