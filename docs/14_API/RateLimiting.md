# Rate Limiting & Quota Management

## Mục tiêu
Kiểm soát lưu lượng truy cập vào hệ thống API, ngăn chặn tấn công DDoS, abuse hệ thống và quản lý chi phí gọi Google Gemini API (tránh bill shock).

## Nội dung chính
### 1. Chiến lược Rate Limiting
- **Theo IP**: Ngăn chặn spam từ các nguồn không xác thực.
- **Theo User (UID)**: Kiểm soát mức sử dụng của từng tài khoản.
- **Thuật toán**: Token Bucket hoặc Sliding Window Log sử dụng Redis.

### 2. Định mức (Quotas)
| Endpoint | User Role | Giới hạn |
| :--- | :--- | :--- |
| `POST /scans/analyze` | Free User | 50 requests / ngày |
| `POST /scans/analyze` | Premium | 1000 requests / ngày |
| `GET /scans` | All | 100 requests / phút |
| `POST /auth/*` | IP | 5 requests / phút |

### 3. Quản lý chi phí Gemini API
- **Caching**: Kết quả phân tích (cùng URL, cùng hash nội dung) sẽ được cache trong Redis trong 24h. Nếu người dùng khác yêu cầu trùng URL, trả kết quả từ cache, không gọi Gemini.
- **Payload Truncation**: Cắt ngắn nội dung HTML/DOM gửi lên Gemini (tối đa 4000 tokens) để tiết kiệm chi phí tính toán.

### 4. Phản hồi hệ thống
Khi vượt quá giới hạn, hệ thống trả về mã lỗi `429 Too Many Requests` với header `Retry-After`.
```json
{
  "status": "error",
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Bạn đã hết lượt quét miễn phí hôm nay."
  }
}
```

## Checklist
- [ ] Triển khai Redis để đếm rate limit.
- [ ] Cấu hình API Gateway Rate Limiting.
- [ ] Cài đặt cảnh báo Billing Alarm trên Google Cloud.

## Tài liệu liên quan
- [API Design](./APIDesign.md)

## Việc cần làm tiếp
- Tích hợp Stripe/VNPay để xử lý logic nâng cấp Premium.
