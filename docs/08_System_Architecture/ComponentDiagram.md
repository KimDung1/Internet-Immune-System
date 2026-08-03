# Component Breakdown

## Mục tiêu
Chi tiết hóa các thành phần (components) trong hệ thống Internet Immune System và nhiệm vụ cụ thể của từng thành phần.

## Nội dung chính

### 1. Browser Extension (Client)
- **Background Script**: Lắng nghe sự kiện điều hướng web (webNavigation), quản lý state.
- **Content Script**: Đọc DOM, trích xuất text/HTML, tiêm (inject) UI cảnh báo vào trang web.
- **Popup/Options UI**: Giao diện cài đặt và lịch sử, được xây dựng bằng React/Next.js (SSG).

### 2. Web App (User Dashboard)
- Cổng thông tin cho người dùng xem báo cáo chi tiết, bài học (Train mode).
- Quản lý tài khoản, thiết lập cấu hình.
- Xây dựng bằng Next.js, hosting trên Firebase Hosting hoặc Cloud Run.

### 3. API Gateway / Load Balancer
- Tiếp nhận toàn bộ request từ Extension và Web App.
- Rate limiting, DDoS protection.

### 4. Backend Service (Cloud Run API)
- **Node.js / Express or NestJS**.
- **Auth Middleware**: Xác thực token Firebase.
- **Analysis Controller**: Xử lý logic 5 chế độ: Detect, Simulate, Explain, Train, Protect.

### 5. AI Engine
- Tích hợp **Google Gemini 2.5 Pro** (cho Explain, Simulate phức tạp) và **Gemini 2.5 Flash** (cho Detect real-time).
- Prompt Management: Quản lý version các prompt template.

### 6. Database Layer (Firebase)
- **Firestore**: Lưu trữ lịch sử quét, cấu hình người dùng, logs hệ thống.
- **Cloud Storage**: Lưu trữ hình ảnh screenshot trang web (nếu cần cho phân tích).

## Checklist
- [x] Phân tách rõ ràng các components
- [x] Chỉ định công nghệ cho từng component
- [ ] Thiết kế API contract giữa Client và Backend

## Tài liệu liên quan
- [Architecture Overview](Architecture.md)
- [Tech Stack](TechStack.md)

## Việc cần làm tiếp
- Viết API documentation (Swagger/OpenAPI) cho Backend Service.
