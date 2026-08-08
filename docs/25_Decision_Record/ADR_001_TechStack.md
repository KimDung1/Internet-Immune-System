# ADR-001: Lựa chọn Tech Stack - Gemini, Firebase, Cloud Run

## Mục tiêu
Xác định công nghệ cốt lõi để xây dựng MVP Internet Immune System cho cuộc thi AI Riser Vietnam.

## Nội dung chính
**Ngày:** 15/07/2026 (Giả định)
**Trạng thái:** Chấp nhận (Accepted)

### 1. Bối cảnh
Chúng ta cần xây dựng một hệ thống phân tích lừa đảo thời gian thực, yêu cầu khả năng xử lý ngôn ngữ tự nhiên (đọc tin nhắn), thị giác máy tính (đọc ảnh chụp màn hình), và hệ thống backend chịu tải linh hoạt để demo. Thời gian từ nay đến Demo Day chỉ còn vài tuần.

### 2. Các giải pháp được xem xét
- **Option 1:** Tự train mô hình AI (Llama/Mistral) + Host trên AWS EC2 + PostgreSQL.
  - *Nhược điểm:* Tốn quá nhiều thời gian setup hạ tầng MLOps, chi phí GPU đắt đỏ, không tối ưu cho thời gian ngắn.
- **Option 2:** OpenAI GPT-4 + AWS Lambda + DynamoDB.
  - *Nhược điểm:* Team chưa quen AWS, chi phí OpenAI cao cho multimodal.
- **Option 3:** Google Gemini 1.5 Pro + GCP Cloud Run + Firebase.
  - *Ưu điểm:* Gemini 1.5 Pro có context window khổng lồ, xử lý multimodal (ảnh/text) cực tốt. Hệ sinh thái GCP tích hợp mượt mà. Cloud Run hỗ trợ serverless container (0 to N). Firebase Realtime/Firestore giúp cập nhật trạng thái UI ngay lập tức cho phần Simulation.

### 3. Quyết định
Chọn **Option 3**: Sử dụng Gemini AI làm bộ não, Cloud Run làm backend API, và Firebase làm cơ sở dữ liệu và xác thực.

### 4. Lý do
- Tốc độ phát triển (Time-to-market): Firebase giúp rút ngắn 50% thời gian code backend CRUD.
- Sức mạnh AI: Gemini lý tưởng để phân tích ngữ cảnh lừa đảo phức tạp (multimodal).
- Độ ổn định: Cloud Run tự động scale, đảm bảo không sập server lúc Demo.

### 5. Hậu quả
- **Tích cực:** Code cực nhanh, hạ tầng ổn định, dễ dàng tích hợp.
- **Tiêu cực:** Bị vendor lock-in vào Google Cloud Platform. Nếu gọi Gemini API quá nhiều, chi phí có thể tăng cao (cần giải pháp caching ở Phase sau).

## Checklist
- [ ] Setup GCP Project, kích hoạt các API cần thiết.
- [ ] Xin cấp quota Gemini API cho tài khoản dự án.

## Tài liệu liên quan
- [TechnicalRoadmap.md](file:///e:/PJ/docs/22_Roadmap/TechnicalRoadmap.md)

## Việc cần làm tiếp
- Thiết lập CI/CD pipeline từ GitHub Actions sang Cloud Run.
