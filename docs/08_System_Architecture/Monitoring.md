# Monitoring Strategy

## Mục tiêu
Giám sát sức khỏe hệ thống, theo dõi hiệu năng và lỗi để xử lý sự cố kịp thời, đảm bảo độ ổn định (uptime) cao nhất.

## Nội dung chính

### 1. Công cụ sử dụng
- **Google Cloud Operations (Stackdriver)**: Giám sát tài nguyên hạ tầng.
- **Sentry**: Bắt lỗi ứng dụng (Exception Tracking) cho Frontend và Backend.
- **Firebase Crashlytics / Performance**: Nếu có kế hoạch phát hành Mobile App sau này.

### 2. Các chỉ số quan trọng (Key Metrics)
- **Error Rate**: Tỷ lệ HTTP 5xx trả về.
- **Latency (P95, P99)**: Thời gian phản hồi của API. Đặc biệt chú ý latency của endpoint kết nối với Gemini.
- **Gemini Quota & Quota Errors (HTTP 429)**: Giám sát giới hạn hạn mức gọi API của mô hình AI.
- **Container Memory/CPU Usage**: Giám sát Cloud Run để tối ưu instance size.

### 3. Alerting (Cảnh báo)
Thiết lập chính sách cảnh báo (Alert Policies) qua Email hoặc Slack/Telegram webhook:
- **Critical Alert**: Error Rate > 5% trong 5 phút.
- **Warning Alert**: P95 Latency > 3000ms.
- **Cost Alert**: Chi phí GCP vượt quá ngân sách hàng ngày.

### 4. Synthetic Monitoring (Giám sát chủ động)
- Chạy các script tự động ping tới health-check endpoint `/api/health` mỗi phút một lần.

## Checklist
- [x] Xác định công cụ giám sát
- [x] Định nghĩa Key Metrics
- [x] Thiết lập ngưỡng cảnh báo (Alerting Thresholds)
- [ ] Tích hợp Sentry vào codebase

## Tài liệu liên quan
- [Logging Standards](Logging.md)
- [Performance Optimization](Performance.md)

## Việc cần làm tiếp
- Tạo Dashboard trên Google Cloud Monitoring hiển thị các chỉ số tổng hợp.
