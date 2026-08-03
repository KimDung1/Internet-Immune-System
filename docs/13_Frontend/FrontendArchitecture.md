# Frontend Architecture

## Mục tiêu
Tài liệu này xác định kiến trúc tổng thể của Frontend (Web Dashboard và Landing Page) cho Internet Immune System. Hệ thống sử dụng Next.js 14+ với App Router để đạt hiệu suất cao, SEO tốt và trải nghiệm người dùng tối ưu, hướng tới Top 10 AI Riser Vietnam.

## Nội dung chính
### 1. Công nghệ cốt lõi
- **Framework**: Next.js 14 (App Router)
- **Ngôn ngữ**: TypeScript
- **Styling**: Tailwind CSS, Shadcn UI
- **State Management**: Zustand cho Global State, React Context cho Theme/Auth
- **Data Fetching**: React Query (TanStack Query), Server Actions

### 2. Cấu trúc thư mục (App Router)
```text
src/
├── app/                  # Next.js App Router (Pages, Layouts, API Routes)
│   ├── (auth)/           # Route group cho Authentication
│   ├── dashboard/        # Bảng điều khiển người dùng
│   ├── api/              # Route handlers (BFF - Backend for Frontend)
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Landing page
├── components/           # Các component tái sử dụng (UI, Form, Layout)
├── lib/                  # Tiện ích, cấu hình, helper functions (Firebase, Gemini init)
├── hooks/                # Custom React Hooks
├── store/                # Zustand stores
└── types/                # TypeScript type definitions
```

### 3. Chiến lược Rendering (SSR/SSG/CSR)
- **Static Site Generation (SSG)**: Dành cho Landing Page, Blog, Documentation (Tốc độ tối đa, SEO tốt).
- **Server-Side Rendering (SSR)**: Dành cho các trang cần dữ liệu real-time từ server trước khi render, tối ưu cho SEO động.
- **Client-Side Rendering (CSR)**: Dành cho các thành phần tương tác trong Dashboard, biểu đồ, kết quả phân tích AI thời gian thực.
- **Server Actions**: Xử lý form submissions (Login, Sign up, Feedback) trực tiếp không cần API routes rườm rà.

## Checklist
- [ ] Cấu hình Next.js 14 với App Router thành công
- [ ] Tích hợp Tailwind CSS và Shadcn UI
- [ ] Cài đặt Absolute Imports (e.g., `@/components/`)
- [ ] Thiết lập quy tắc ESLint và Prettier cho TypeScript

## Tài liệu liên quan
- [Component Guide](./ComponentGuide.md)
- [State Management](./StateManagement.md)

## Việc cần làm tiếp
- Cấu hình CI/CD Pipeline để deploy Next.js lên Vercel hoặc Google Cloud Run.
- Xây dựng hệ thống Design System với Storybook.
