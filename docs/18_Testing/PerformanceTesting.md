# Performance & Load Testing

## Mục tiêu
Đảm bảo hệ thống backend (Cloud Run) và cơ sở dữ liệu (Firestore) chịu tải tốt trong điều kiện có nhiều người dùng sử dụng Extension cùng lúc. Tốc độ phản hồi (Latency) là yếu tố quyết định trải nghiệm người dùng (UX) khi trình diễn sản phẩm thực tế.

## Nội dung chính

### 1. Chỉ số mục tiêu (Target Metrics)
- **API Latency (Độ trễ trung bình)**:
  - Cache hits (Dữ liệu đã có sẵn): < 200ms.
  - Phân tích bằng luật logic (Rule-based): < 500ms.
  - Phân tích qua AI (Gemini Flash): **< 3000ms (3 giây)**. (Yêu cầu khắt khe nhất để tránh người dùng nản và tắt trình duyệt).
- **Throughput (Thông lượng)**: 
  - Khả năng xử lý 50 - 100 requests per second (RPS) trên môi trường Cloud Run giới hạn mà không bị lỗi.
- **Error Rate (Tỷ lệ lỗi)**: < 1% HTTP 5xx errors dưới tải nặng.

### 2. Công cụ sử dụng
- **k6 (by Grafana)**: Công cụ load testing viết bằng JavaScript hiện đại, có khả năng giả lập hàng nghìn virtual users. (Hoặc có thể dùng JMeter, Locust, nhưng ưu tiên k6 vì nhẹ và tích hợp CI tốt).

### 3. Kịch bản Load Test (Test Scenarios)
**Scenario 1: Spike Testing (Thử nghiệm đột biến)**
- Mục tiêu: Xem phản ứng của tính năng auto-scaling của Cloud Run (Cold start).
- Kịch bản: Bất ngờ tăng từ 0 lên 50 Virtual Users (VUs) trong vòng 10 giây gọi vào API phân tích. 
- Quan sát thời gian khởi động container và phần trăm requests bị nghẽn.

**Scenario 2: Sustained Load (Tải ổn định định mức)**
- Mục tiêu: Kiểm tra độ ổn định và chi phí memory/CPU.
- Kịch bản: Duy trì 30 VUs liên tục gửi request đều đặn trong 10 phút.
- Quan sát memory leaks (nếu có) trên Cloud Run.

### 4. Khắc phục vấn đề chậm do AI API (Mocking & Caching)
- Do việc gọi Vertex AI thực tế có giới hạn về Quota và tốn tiền, hệ thống Load Test sẽ được cấu hình đi qua 2 phase:
  - **Phase 1 (Mocked AI)**: Đánh giá thuần túy hiệu năng của FastAPI, routing, DB read/write bằng cách mock kết quả trả về từ Gemini (thời gian cố định 1s).
  - **Phase 2 (Real AI, Low volume)**: Đánh giá độ trễ thực của Google's Gemini network. Chỉ test với lượng RPS nhỏ (ví dụ 5 RPS) để không vi phạm quota.

## Checklist
- [x] Xác định Target Metrics (đặc biệt Latency < 3s cho AI request).
- [ ] Viết kịch bản test bằng thư viện `k6`.
- [ ] Triển khai một Mock server hoặc biến môi trường `MOCK_LLM=true` trên backend Staging.
- [ ] Chạy thử nghiệm trên máy local hướng vào môi trường Staging.
- [ ] Phân tích báo cáo k6, xác định nút thắt cổ chai (Bottleneck).

## Tài liệu liên quan
- [GCPServices.md](../16_Cloud/GCPServices.md)
- [TestStrategy.md](./TestStrategy.md)

## Việc cần làm tiếp
- Nếu thời gian khởi động (Cold Start) của Cloud Run chậm (> 5s), cấu hình `min-instances=1` (ít nhất 1 instance luôn chạy) trước khi đi thi/demo.
- Cân nhắc sử dụng Streaming Response (Server-Sent Events / WebSockets) nếu phân tích LLM mất quá lâu, giúp hiện kết quả từng đoạn (typing effect) cho người dùng thấy ứng dụng không bị treo.
