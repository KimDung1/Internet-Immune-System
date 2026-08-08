# Scalability Design

## Mục tiêu
Hệ thống phải có khả năng xử lý lượng người dùng tăng đột biến (scale out) mà không làm suy giảm hiệu năng, đáp ứng mục tiêu mở rộng lớn trong tương lai.

## Nội dung chính

### 1. Horizontal Scaling (Mở rộng ngang)
- **API (Cloud Run)**: Hoàn toàn stateless. Khi có lượng traffic lớn, GCP tự động spin up thêm nhiều container (lên tới giới hạn Max instances đã đặt là 100 hoặc hơn).
- **Web Client**: Cung cấp tĩnh qua CDN (Firebase Hosting), tự động scale toàn cầu.

### 2. Cân bằng tải (Load Handling)
- Sử dụng Google Cloud Load Balancing để phân phối traffic.
- Tích hợp **Cloud Armor** để chống DDoS, giới hạn rate limit (ví dụ: tối đa 50 requests/phút/IP) để tránh tình trạng spam API làm cạn kiệt ngân sách AI.

### 3. Xử lý hàng đợi (Message Queues) - Tương lai
- Nếu hệ thống quá tải (đặc biệt là hạn mức API của Gemini), kiến trúc sẽ chuyển một phần xử lý sang luồng Event-driven.
- Sử dụng **Google Cloud Pub/Sub**: 
  - Request tới đưa vào Queue.
  - Worker xử lý chậm rãi và cập nhật lại Firestore.
  - Client listen thay đổi trên Firestore (real-time listener) để nhận kết quả.

### 4. Database Scaling
- Firestore tự động scale cực kỳ tốt đối với số lượng Read/Write lớn.
- Thiết kế Data Schema tránh "hotspots" (ví dụ: không dùng ID tuần tự, sử dụng ID ngẫu nhiên cho document).

## Checklist
- [x] Chiến lược mở rộng ngang (Stateless API)
- [x] Cấu hình chống DDoS và Rate Limit
- [x] Đề xuất kiến trúc Message Queue dự phòng
- [ ] Load Testing (Stress test) trên môi trường Staging

## Tài liệu liên quan
- [Cloud Run Config](CloudRun.md)
- [Architecture Overview](Architecture.md)

## Việc cần làm tiếp
- Sử dụng công cụ như k6 hoặc Artillery để mô phỏng 10,000 concurrent users.
