# Environment Configuration

## Mục tiêu
Xây dựng chiến lược phân tách các môi trường rõ ràng và phương pháp quản lý các biến môi trường, thông tin bảo mật (secrets) một cách an toàn cho toàn bộ vòng đời phát triển dự án Internet Immune System.

## Nội dung chính

### 1. Chiến lược Môi trường
Hệ thống sử dụng ba môi trường độc lập:
- **Development (Dev)**: 
  - Mục đích: Dành cho lập trình viên code và test ở máy cá nhân hoặc nhánh feature.
  - Backend URL: `localhost:8000` hoặc server dev tạm.
  - Data: Firebase Emulator Suite (local) hoặc một project GCP Dev.
- **Staging (Stg)**:
  - Mục đích: Bản sao thu nhỏ của Production. Dùng cho kiểm thử tích hợp, QA, E2E Tests, và UAT nội bộ trước khi phát hành.
  - URL: `api-staging.immune-system.com`.
  - Database: Dữ liệu ẩn danh (anonymized) hoặc dữ liệu sinh tự động.
- **Production (Prod)**:
  - Mục đích: Hệ thống thực, người dùng thực, dữ liệu thật. Được chuẩn bị kỹ cho đợt ra mắt AI Riser Vietnam.
  - URL: `api.immune-system.com`.

### 2. Quản lý Biến môi trường (Environment Variables)
- **Frontend / Extension**: Các biến cấu hình không nhạy cảm (như API Base URL, Firebase Project ID) được lưu trực tiếp vào các file `.env.staging` và `.env.production` trong mã nguồn và được build theo gói (bundler).
- **Backend (Cloud Run)**: Các biến (như Cấu hình Log level, CORS origins, Environment Name) được cấu hình dưới dạng Environment Variables bên trong Terraform và được truyền vào khi Cloud Run khởi chạy.

### 3. Quản lý Bí mật (Secrets Management)
**TUYỆT ĐỐI KHÔNG** commit các chuỗi khóa bí mật (API Keys, JWT Secrets, Database Passwords) vào source code GitHub.
- **Sử dụng Google Cloud Secret Manager**:
  - Lưu các khóa như `GEMINI_API_KEY`, `FIREBASE_ADMIN_CERT`, `JWT_SECRET_KEY` trong Secret Manager của GCP project tương ứng.
  - Cấu hình Cloud Run tích hợp với Secret Manager: Các bí mật được nạp thẳng vào instance thành biến môi trường ở runtime. Hạ tầng này không bị lộ ra bên ngoài.
  - Cấu trúc khóa: `projects/{project_id}/secrets/{secret_name}/versions/latest`.

### 4. Nạp cấu hình Local (Local Development)
- Lập trình viên sử dụng file `.env` (đã được đưa vào `.gitignore`) để chứa các biến môi trường khi chạy local.
- Dùng thư viện `python-dotenv` (backend) hoặc `dotenv` (Node.js) để nạp biến môi trường trong quá trình chạy thử.

## Checklist
- [x] Xác định 3 môi trường chính (Dev, Staging, Prod).
- [x] Đưa toàn bộ `.env` và `*-key.json` vào `.gitignore`.
- [ ] Khởi tạo các Secret trong Google Secret Manager cho cả 2 môi trường (Staging, Prod).
- [ ] Cấu hình Cloud Run service để đọc thông số từ Secret Manager.
- [ ] Viết hướng dẫn setup `.env` mẫu (`.env.example`) cho developer.

## Tài liệu liên quan
- [InfrastructureAsCode.md](./InfrastructureAsCode.md)
- [GCPServices.md](../16_Cloud/GCPServices.md)

## Việc cần làm tiếp
- Tổ chức audit định kỳ các quyền truy cập vào Secret Manager.
- Tạo một script rút trích các biến cần thiết từ Secret Manager đổ vào `.env` local cho các developer có thẩm quyền.
