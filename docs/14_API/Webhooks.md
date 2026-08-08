# Webhooks & Real-time Communication

## Mục tiêu
Thiết lập cơ chế giao tiếp theo thời gian thực (Real-time) hoặc bất đồng bộ (Asynchronous) giữa Backend, Frontend, Browser Extension và các dịch vụ bên thứ ba (Third-party integrations).

## Nội dung chính
### 1. Phân loại Webhooks
- **Internal Webhooks (FCM / WebSocket)**: Backend báo cho Frontend/Extension kết quả phân tích bất đồng bộ.
- **External Webhooks**: Gửi dữ liệu về các sự cố bảo mật (Threats) tới hệ thống SIEM của tổ chức doanh nghiệp (cho gói Enterprise).

### 2. Server-Sent Events (SSE) vs WebSockets
Đối với Internet Immune System, ta ưu tiên sử dụng **FCM (Firebase Cloud Messaging) / Server-Sent Events** hơn là WebSockets thuần túy vì:
- API chủ yếu là tính chất một chiều (Backend đẩy notification về Client).
- Extension Manifest V3 quản lý kết nối WebSocket rất khó (Service worker bị tắt sau một thời gian), dùng Push Notifications (FCM) ổn định hơn.

### 3. Payload Webhook (Ví dụ External)
```json
{
  "event": "threat_detected",
  "timestamp": "2026-08-02T15:00:00Z",
  "data": {
    "url": "http://malicious-login.com",
    "threatType": "phishing",
    "affectedUser": "user_123",
    "geminiAnalysis": "Trang web này mô phỏng giao diện Office 365 để đánh cắp thông tin đăng nhập."
  }
}
```

### 4. Bảo mật Webhook
- Yêu cầu cấu hình Webhook Secret Key.
- Ký payload bằng HMAC SHA-256. Bên nhận (Receiver) phải verify chữ ký này trong header `X-Immune-Signature`.

## Checklist
- [ ] Cấu hình FCM cho Extension.
- [ ] Viết tài liệu tích hợp Webhook cho gói Enterprise.
- [ ] Xây dựng tính năng Retry nếu webhook gửi thất bại.

## Tài liệu liên quan
- [Browser Extension Architecture](../13_Frontend/BrowserExtension.md)

## Việc cần làm tiếp
- Triển khai hàng đợi (Task Queue) như Google Cloud Tasks để xử lý việc gửi Webhook không làm block main API thread.
