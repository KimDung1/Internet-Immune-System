# GCP Services

## Mục tiêu
Liệt kê và mô tả cấu hình chi tiết của tất cả các dịch vụ Google Cloud Platform (GCP) được sử dụng trong dự án Internet Immune System để đảm bảo khả năng triển khai, vận hành và quản lý hiệu quả.

## Nội dung chính

### 1. Cloud Run
Dịch vụ serverless container cho backend API (FastAPI/Node.js).
- **Region**: `asia-southeast1` (Singapore)
- **Concurrency**: Cấu hình 80 requests/container để xử lý đồng thời, tối ưu chi phí.
- **CPU/Memory**: 1 CPU, 512MiB/1GiB RAM (tùy thuộc vào service, ví dụ service xử lý embedding AI cần nhiều RAM hơn).
- **Auto-scaling**: 
  - Min instances: 0 (hoặc 1 cho production để tránh cold start)
  - Max instances: 50 (giới hạn để kiểm soát chi phí)
- **Security**: Cho phép `allUsers` (unauthenticated) gọi qua HTTPS, nhưng xác thực bằng JWT (từ Firebase Auth) ở lớp ứng dụng.

### 2. Firebase
Nền tảng Backend-as-a-Service (BaaS) hỗ trợ frontend và ứng dụng di động/extension.
- **Firebase Authentication**: Quản lý định danh (Email/Password, Google OAuth).
- **Cloud Firestore**: Database NoSQL lưu trữ hồ sơ người dùng, lịch sử quét, logs cảnh báo lừa đảo.
  - Cấu hình index cho các truy vấn phức tạp.
  - Thiết lập Security Rules chặt chẽ, chỉ cho phép user đọc/ghi dữ liệu của chính họ.
- **Firebase Hosting**: (Tùy chọn) Lưu trữ trang web landing page, bảng điều khiển quản trị.
- **Firebase Cloud Messaging (FCM)**: Gửi thông báo đẩy (push notifications) real-time khi phát hiện nguy cơ.

### 3. Vertex AI / Gemini API
Lõi AI của "Hệ miễn dịch".
- Sử dụng **Gemini 1.5 Pro/Flash** qua Vertex AI để phân tích nội dung trang web, URL, email, tin nhắn nhằm phát hiện lừa đảo, giải thích rủi ro và mô phỏng hậu quả.
- Cấu hình hạn ngạch (Quotas): Đảm bảo giới hạn số lượng token/requests per minute (RPM) để tránh bị lạm dụng và quá tải chi phí.

### 4. Cloud Storage
Lưu trữ các đối tượng phi cấu trúc.
- **Buckets**:
  - `iis-assets-prod`: Chứa tài nguyên tĩnh (hình ảnh, icons).
  - `iis-reports-prod`: Lưu trữ các file báo cáo PDF xuất ra từ hệ thống (có thiết lập lifecycle tự động xóa sau 30 ngày).
- Bật tính năng Object Versioning cho các file cấu hình quan trọng.

### 5. Secret Manager
Bảo mật cấu hình.
- Quản lý các biến môi trường nhạy cảm như API keys (ví dụ các 3rd party APIs, Gemini API key nếu không dùng ADC), JWT secrets, và database credentials.
- Cloud Run instances được cấu hình để đọc secret trực tiếp dưới dạng biến môi trường hoặc file volume tại thời điểm khởi động.

### 6. Cloud Logging & Monitoring
- **Cloud Logging**: Ghi nhận mọi logs từ Cloud Run, Firebase. Áp dụng structured logging (JSON format) cho backend.
- **Cloud Monitoring**: Tạo Dashboards theo dõi metrics (Request Count, Latency, 4xx/5xx Errors, Vertex AI API usage).

## Checklist
- [x] Kích hoạt các API cần thiết trên GCP.
- [ ] Cấu hình và deploy Cloud Run services với thông số chuẩn.
- [ ] Cài đặt Firebase Project và liên kết với GCP Project.
- [ ] Thiết lập Firestore Security Rules.
- [ ] Lưu tất cả cấu hình nhạy cảm vào Secret Manager.
- [ ] Khởi tạo Cloud Storage buckets và phân quyền IAM phù hợp.

## Tài liệu liên quan
- [CloudArchitecture.md](./CloudArchitecture.md)
- [EnvironmentConfig.md](../17_DevOps/EnvironmentConfig.md)

## Việc cần làm tiếp
- Tinh chỉnh thông số auto-scaling cho Cloud Run dựa trên kết quả load test.
- Xây dựng dashboard monitoring cụ thể cho nhóm vận hành.
