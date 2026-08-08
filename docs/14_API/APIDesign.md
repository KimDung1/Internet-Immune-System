# API Design Principles

## Mục tiêu
Tài liệu định hướng cách thiết kế các RESTful APIs và Webhooks cho Backend (Cloud Run) của Internet Immune System, đảm bảo tính nhất quán, bảo mật, và khả năng mở rộng.

## Nội dung chính
### 1. Triết lý Thiết kế
- **RESTful Conventions**: Sử dụng đúng các HTTP Methods (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`).
- **Resource-Oriented**: Các endpoint xoay quanh các thực thể (resources) như `users`, `scans`, `alerts`, `reports`.
- **Stateless**: API không lưu trữ session state. Mọi request phải chứa thông tin xác thực (JWT).
- **JSON Standard**: Request và Response body luôn dùng định dạng `application/json`.

### 2. URL Structure & Versioning
- Phải có tiền tố phiên bản để đảm bảo tương thích ngược: `/api/v1/`
- Tên resource dùng số nhiều (plural).
- Ví dụ: `GET /api/v1/scans` (Lấy danh sách các lần quét), `POST /api/v1/scans` (Tạo yêu cầu quét mới).

### 3. Định dạng Response
**Thành công (2xx):**
```json
{
  "status": "success",
  "data": {
    "id": "123",
    "url": "http://example.com",
    "riskLevel": "high"
  },
  "meta": {
    "timestamp": "2026-08-02T15:00:00Z"
  }
}
```

**Thất bại (4xx, 5xx):**
```json
{
  "status": "error",
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Quá nhiều yêu cầu. Vui lòng thử lại sau 60 giây.",
    "details": []
  }
}
```

### 4. HTTP Status Codes
- `200 OK`: Request thành công.
- `201 Created`: Tạo mới resource thành công.
- `400 Bad Request`: Lỗi validation dữ liệu đầu vào.
- `401 Unauthorized`: Thiếu token hoặc token không hợp lệ.
- `403 Forbidden`: Có token nhưng không có quyền truy cập resource.
- `404 Not Found`: Resource không tồn tại.
- `429 Too Many Requests`: Vượt quá giới hạn Rate Limit.
- `500 Internal Server Error`: Lỗi logic phía server hoặc lỗi gọi API Gemini.

## Checklist
- [ ] Thống nhất response format cho toàn bộ dự án.
- [ ] Triển khai middleware xử lý lỗi tập trung.
- [ ] Định nghĩa Swagger / OpenAPI spec.

## Tài liệu liên quan
- [API Reference](./APIReference.md)
- [Rate Limiting](./RateLimiting.md)

## Việc cần làm tiếp
- Viết file OpenAPI yaml mô tả chi tiết.
- Cấu hình API Gateway trên Google Cloud để map các routes.
