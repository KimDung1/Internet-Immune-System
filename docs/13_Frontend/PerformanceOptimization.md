# Performance Optimization

## Mục tiêu
Đảm bảo tốc độ tải trang, trải nghiệm mượt mà và tối ưu hóa SEO cho Web Dashboard và Landing Page. Đạt điểm số cao trong Core Web Vitals, phù hợp với tiêu chuẩn của một sản phẩm công nghệ AI hàng đầu (Top 10 AI Riser).

## Nội dung chính
### 1. Core Web Vitals Targets
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay) / INP (Interaction to Next Paint)**: < 100ms / < 200ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### 2. Các chiến lược tối ưu
- **Code Splitting & Lazy Loading**:
  - Dùng `next/dynamic` cho các component nặng (như Biểu đồ Recharts, 3D Models nếu có) để chúng chỉ load khi cần.
  - Các tuyến đường (routes) trong App Router tự động được code-split.
- **Image Optimization**:
  - Luôn sử dụng component `<Image />` của Next.js (`next/image`) để tự động resize, tối ưu định dạng (WebP/AVIF) và lazy load ảnh.
- **Font Optimization**:
  - Sử dụng `next/font` để tự động host fonts nội bộ, loại bỏ round-trip lên Google Fonts, giảm CLS.
- **Caching Strategy**:
  - Cấu hình revalidation cho các trang SSG (`revalidate: 3600`).
  - Cache API response (TanStack Query) trên client.
- **Bundle Size Management**:
  - Sử dụng `@next/bundle-analyzer` để theo dõi kích thước bundle.
  - Tránh import toàn bộ thư viện (VD: dùng `import { throttle } from 'lodash/throttle'` thay vì `import _ from 'lodash'`).

### 3. Tối ưu Extension
- Hạn chế kích thước thư viện bên thứ 3 trong content script để trang web của người dùng không bị chậm đi do "Internet Immune System".
- Dùng `requestIdleCallback` cho các tác vụ phân tích DOM không khẩn cấp.

## Checklist
- [ ] Cấu hình Next/Image và Next/Font.
- [ ] Triển khai Bundle Analyzer vào script build.
- [ ] Chạy Lighthouse Audit và đạt điểm >90 (Performance, Accessibility, SEO).

## Tài liệu liên quan
- [Frontend Architecture](./FrontendArchitecture.md)

## Việc cần làm tiếp
- Thiết lập CI/CD chạy Lighthouse tự động trên mỗi Pull Request.
- Cấu hình CDN (Cloudflare hoặc Vercel Edge Network) để giảm độ trễ (latency).
