# Performance Optimization

## Mục tiêu
Đảm bảo hệ thống phản hồi nhanh chóng, đặc biệt ở chế độ Real-time Protection của Extension. Độ trễ phải thấp để không làm gián đoạn trải nghiệm lướt web.

## Nội dung chính

### 1. Performance Targets (SLAs)
- **Phản hồi cơ bản (API Gateway)**: < 100ms.
- **Thời gian phân tích AI (Detect Mode - Gemini Flash)**: < 1500ms.
- **Thời gian xử lý luồng phức tạp (Simulate/Explain - Gemini Pro)**: < 5000ms.

### 2. Chiến lược Caching (Bộ nhớ đệm)
Để giảm tải cho AI Engine và tối ưu chi phí:
- **Global Cache (Redis / Memorystore)**: Cache kết quả của các URL đã được phân tích. Key: `hash(URL)`. Nếu URL phổ biến đã được quét, trả về kết quả ngay (Cache Hit).
- **Time To Live (TTL)**: 
  - Malicious URL: Cache lâu dài (30 ngày).
  - Safe URL: Cache ngắn hạn (24 giờ) vì trang web có thể bị hack.

### 3. Tối ưu Payload
- Thay vì gửi toàn bộ HTML của một trang web lên API, Browser Extension chỉ trích xuất các thành phần quan trọng (Context Extraction):
  - Tiêu đề (Title), Meta description.
  - Các đường link (href) trong body.
  - Các form nhập liệu (input fields).
  - Chữ hiển thị nổi bật.
- Nén payload bằng GZIP trước khi gửi.

### 4. Phân luồng Async (Bất đồng bộ)
- Đối với **Protect Mode**: Quá trình quét diễn ra ngầm định (background). Nếu phát hiện lừa đảo, extension mới push notification lên UI. Không block tiến trình load trang của trình duyệt.

## Checklist
- [x] Thiết lập SLA mục tiêu
- [x] Thiết kế chiến lược Caching
- [x] Tối ưu payload từ client
- [ ] Tích hợp Redis cho Global Cache

## Tài liệu liên quan
- [Cloud Run Config](CloudRun.md)
- [Gemini Integration](../09_AI/GeminiIntegration.md)

## Việc cần làm tiếp
- Xây dựng module trích xuất content thông minh trên Browser Extension (loại bỏ CSS/JS rác).
