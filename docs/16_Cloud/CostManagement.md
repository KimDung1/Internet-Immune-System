# Cost Management

## Mục tiêu
Thiết lập chiến lược quản lý, ước tính, và tối ưu hóa chi phí đám mây (Cloud) nhằm giữ cho chi phí của Internet Immune System ở mức thấp nhất có thể trong khi vẫn duy trì hiệu suất, đặc biệt là quản lý chi phí cho dịch vụ Gemini API thông qua Vertex AI.

## Nội dung chính

### 1. Cloud Cost Estimation (Ước tính chi phí hàng tháng cho 10,000 MAU)
- **Cloud Run**: Dựa trên thời gian tính toán và số lượng requests.
  - ~1M requests/tháng, thời lượng 1s/request.
  - Chi phí ước tính: $0 - $5 (do được hưởng Free Tier khá lớn).
- **Firestore (Firebase)**:
  - Lượt Đọc/Ghi: ~30M Đọc, ~5M Ghi.
  - Chi phí ước tính: $5 - $15.
- **Vertex AI (Gemini 1.5 Flash/Pro)**:
  - Giả sử trung bình 50,000 phân tích AI/tháng.
  - Mỗi phân tích: ~2,000 tokens input, ~500 tokens output.
  - Sử dụng chủ yếu **Gemini 1.5 Flash** cho các tác vụ nhanh: ~$0.35/1M input tokens, ~$1.05/1M output tokens.
  - Tổng tokens: 100M input, 25M output.
  - Chi phí ước tính: ~$35 (Input) + ~$26 (Output) = ~$61.
  - Lưu ý: Dùng bản Pro cho các ca phức tạp (ít hơn) sẽ đắt hơn.
- **Network Egress**:
  - ~50GB outbound traffic.
  - Chi phí ước tính: ~$5.
- **Các dịch vụ khác** (Cloud Storage, Secret Manager, Cloud Logging): < $5.
- **Tổng ngân sách dự kiến**: ~$90 - $100 / tháng.

### 2. Chiến lược tối ưu hóa chi phí (Optimization Strategies)
- **Bộ nhớ đệm (Caching)**: Bộ nhớ đệm các URL, email, và kết quả phân tích AI đã biết bằng Redis (hoặc dùng Firestore với TTL) để không phải gọi AI API nhiều lần cho cùng một payload phổ biến (ví dụ: các trang web lừa đảo ngân hàng vừa bùng phát).
- **Gemini Flash vs Pro**: Mặc định sử dụng mô hình Gemini 1.5 Flash cho 90% lượng requests vì tốc độ nhanh và chi phí rẻ. Chỉ fallback hoặc escalate lên mô hình Pro đối với những ca phân tích rất phức tạp, đòi hỏi suy luận sâu hoặc khi user trả phí (nếu có).
- **Tối ưu Prompt (Prompt Engineering)**: Thiết kế prompt súc tích, yêu cầu model trả về JSON tinh gọn thay vì đoạn văn bản dài không cần thiết để giảm output tokens.
- **Cloud Run Concurrency**: Cấu hình 80 requests/container để tận dụng tối đa một instance thay vì spin up nhiều instances.
- **Log Sampling**: Giảm lượng debug logs ở môi trường production.

### 3. Budget Alerts (Cảnh báo ngân sách)
- Thiết lập ngân sách (Budget) là $100/tháng trên Google Cloud Billing.
- Cấu hình Threshold rules:
  - 50% ($50): Gửi email cảnh báo sớm.
  - 80% ($80): Gửi tin nhắn PagerDuty / Slack Channel.
  - 90% ($90): Gửi cảnh báo khẩn cấp, cân nhắc tắt các tính năng ngốn tài nguyên nhưng không cốt lõi.
  - 100% ($100): Cảnh báo đỏ. (Có thể cấu hình Cloud Functions để tự động block API calls mới nếu vượt quá ngưỡng chịu đựng, ngăn chặn billing attack).

## Checklist
- [x] Lập bảng ước tính chi phí.
- [ ] Thiết lập Google Cloud Billing Budget và Alerts.
- [ ] Cấu hình Webhooks liên kết Budget Alerts với kênh thông báo nội bộ.
- [ ] Tích hợp cơ chế Caching (Redis/Firestore) cho các kết quả AI.
- [ ] Theo dõi và đo lường số lượng token sử dụng (logging tokens_used).

## Tài liệu liên quan
- [GCPServices.md](./GCPServices.md)
- [CloudArchitecture.md](./CloudArchitecture.md)

## Việc cần làm tiếp
- Xây dựng dashboard Monitoring hiển thị chính xác chi phí Vertex AI dựa trên metrics.
- Viết kịch bản tự động ngắt kết nối/throttling trong trường hợp phát hiện DDoS/Billing attack.
