# Tech Stack Decision Record

## Mục tiêu
Ghi lại quyết định về Tech Stack cho dự án, kèm theo lý do (rationale) cho mỗi lựa chọn.

## Nội dung chính

### 1. Frontend & Client
- **Web App**: Next.js (React)
  - *Lý do*: Hỗ trợ SSR/SSG tốt, tối ưu SEO cho Landing page. Cộng đồng lớn, dễ dàng tích hợp UI libraries.
- **Browser Extension**: React + Vite + CRXJS
  - *Lý do*: CRXJS hỗ trợ HMR (Hot Module Replacement) cho Extension rất tốt, giúp dev experience mượt mà.

### 2. Backend API
- **Runtime & Framework**: Node.js + Express (hoặc Hono.js/NestJS)
  - *Lý do*: Đồng nhất ngôn ngữ (TypeScript) với frontend (Fullstack TS). Khởi động nhanh, rất phù hợp với môi trường Serverless/Cloud Run.
- **Hosting**: Google Cloud Run
  - *Lý do*: Scale down to 0, chi phí tối ưu, tự động scale theo HTTP request, tích hợp hoàn hảo với hệ sinh thái GCP.

### 3. Database & Auth
- **Database**: Firebase Firestore
  - *Lý do*: NoSQL phù hợp với cấu trúc dữ liệu linh hoạt của JSON trả về từ AI. Real-time updates hữu ích cho dashboard.
- **Authentication**: Firebase Auth
  - *Lý do*: Hỗ trợ sẵn Google/Social Login, dễ tích hợp với Firestore rules.

### 4. AI Engine
- **Mô hình**: Google Gemini API (qua Vertex AI)
  - *Lý do*: Phân tích context siêu dài, xử lý đa phương thức (hình ảnh/văn bản). Tích hợp sâu vào GCP. Mục tiêu: Top 10 AI Riser Vietnam.

### 5. Ngôn ngữ & Tooling
- **Ngôn ngữ**: TypeScript 100%
- **Monorepo**: Turborepo + pnpm
- **Styling**: Tailwind CSS + Shadcn UI

## Checklist
- [x] Xác định Tech Stack toàn diện
- [x] Đưa ra lý do cho từng sự lựa chọn
- [ ] Chốt phiên bản cụ thể cho các thư viện core

## Tài liệu liên quan
- [Architecture Overview](Architecture.md)

## Việc cần làm tiếp
- Tạo tài liệu thiết lập môi trường phát triển (Local Setup) dựa trên stack này.
