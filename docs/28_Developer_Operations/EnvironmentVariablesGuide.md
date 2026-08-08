# Environment Variables Guide

## Mục tiêu
Quản lý tập trung ma trận các biến môi trường (Environment Variables) sử dụng xuyên suốt các môi trường (Dev, Staging, Prod). Đảm bảo tính bảo mật và tính thống nhất cho toàn bộ kỹ sư.

## Nội dung chính

### 1. Ma trận Biến Môi Trường (Environment Variables Matrix)

| Tên biến | Kiểu dữ liệu | Bắt buộc | Môi trường Dev | Mô tả |
|----------|--------------|----------|----------------|-------|
| `PORT` | Number | Không | `8080` | Cổng để chạy API server |
| `NODE_ENV` | String | Có | `development` | Chế độ chạy: `development`, `staging`, `production` |
| `FIREBASE_PROJECT_ID` | String | Có | `demo-immune-system` | ID dự án Firebase. Môi trường dev dùng prefix `demo-` để tận dụng local emulator mà không cần kết nối mạng. |
| `GEMINI_API_KEY` | String | Có | `mock_key_123` | API key để gọi Google Gemini. (Dev dùng mock API trừ khi được cấp). |
| `GCP_SERVICE_ACCOUNT` | JSON/Path | Tùy chọn | `./keys/dev.json`| File Service Account key cho Cloud Run (Chỉ dùng cho prod/staging deployment). |
| `REDIS_URL` | String | Không | `redis://localhost:6379`| Chuỗi kết nối cache server. |

### 2. Quy định bảo mật (Security Rules)
- **TUYỆT ĐỐI KHÔNG** commit các file `.env`, `.env.production` hay bất kỳ API key thật nào vào Git repository.
- Các secret của Production phải được lưu trữ an toàn bằng **Google Cloud Secret Manager**.
- Biến `.env.example` phải chứa tất cả các khóa cần thiết (nhưng có giá trị trống hoặc dummy) để hướng dẫn cho dev mới.

### 3. Phân biệt môi trường (Dev vs. Staging vs. Prod)
- **Dev**: Sử dụng Local Firebase Emulators, Mock Gemini API (không tốn phí).
- **Staging**: Trỏ tới dự án Firebase `immune-system-staging`. Sử dụng Gemini API key dành riêng cho test (bị rate limit).
- **Production**: Môi trường Live. Truy cập bị hạn chế (RBAC IAM).

## Checklist
- [ ] Đã có file `.env.example` trong dự án.
- [ ] File `.gitignore` đã liệt kê `*.env`.
- [ ] Không có API key nhạy cảm nào bị rò rỉ trong log hoặc repository.

## Tài liệu liên quan
- [Local Dev Setup](file:///e:/PJ/docs/28_Developer_Operations/LocalDevSetup.md)

## Việc cần làm tiếp
- Cập nhật biến môi trường mới vào file này mỗi khi thêm tính năng tích hợp 3rd party API (ví dụ: Twilio, SendGrid).
