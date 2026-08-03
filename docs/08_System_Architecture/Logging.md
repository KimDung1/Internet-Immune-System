# Logging Standards

## Mục tiêu
Tiêu chuẩn hóa việc ghi log trên toàn bộ hệ thống để phục vụ mục đích debug, audit, và trích xuất dữ liệu phân tích (analytics) mà không vi phạm quyền riêng tư của người dùng.

## Nội dung chính

### 1. Log Levels (Các cấp độ log)
Sử dụng thư viện Winston hoặc Pino (Node.js) cho backend.
- `FATAL/ERROR`: Các lỗi làm sập hệ thống, crash app, hoặc API bên thứ 3 (Gemini) down.
- `WARN`: Request không hợp lệ từ client, rate limit bị kích hoạt.
- `INFO`: Thông tin nghiệp vụ. Ví dụ: AI phát hiện một vụ lừa đảo (Fraud detected).
- `DEBUG`: Chi tiết payload request/response (chỉ bật ở môi trường Dev/Staging).

### 2. Định dạng Log (Log Format)
Tất cả log phải được xuất dưới dạng **JSON** để hệ thống Cloud Logging dễ dàng parse và index.
```json
{
  "timestamp": "2024-03-20T10:00:00Z",
  "level": "INFO",
  "service": "api-gateway",
  "traceId": "abc-123-def",
  "userId": "user_xyz123",
  "message": "Fraud detected on given URL",
  "metadata": {
    "url": "http://phishing-site.com",
    "aiConfidenceScore": 0.95
  }
}
```

### 3. Audit Trail cho Fraud Detection
- Mỗi khi AI đưa ra quyết định (Safe/Phishing), cần log lại một *Audit Event*.
- Event này chứa: Model version, Prompt hash, Input data (đã ẩn danh), và Output rationale (lý do).
- Phục vụ cho việc tinh chỉnh (fine-tune) model sau này.

### 4. Quyền riêng tư (Data Privacy & Masking)
- **Tuyệt đối KHÔNG log** mật khẩu, token, session IDs, thông tin thẻ tín dụng, dữ liệu cá nhân (PII) người dùng gửi vào form trên trang web bị quét.
- Cần có hàm `maskSensitiveData()` chạy trước khi ghi log ra console/file.

## Checklist
- [x] Chuẩn hóa Log Levels
- [x] Định dạng JSON format
- [x] Chính sách Audit Trail
- [x] Quy tắc Data Masking

## Tài liệu liên quan
- [Monitoring Strategy](Monitoring.md)
- [Safety And Guardrails](../09_AI/SafetyAndGuardrails.md)

## Việc cần làm tiếp
- Xây dựng Log middleware cho ExpressJS/NestJS áp dụng chuẩn này.
