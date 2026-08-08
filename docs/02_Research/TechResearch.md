# Nghiên cứu Công nghệ (Tech Research)

## Mục tiêu
Đánh giá năng lực công nghệ của hệ sinh thái Google, đặc biệt là **Gemini AI**, trong việc phát hiện lừa đảo, phân tích hành vi và cung cấp giải pháp an ninh mạng cá nhân. Đồng thời, nghiên cứu các cách tiếp cận bảo mật AI hiện có trên thị trường.

## Nội dung chính

### 1. Năng lực của Gemini AI trong việc phát hiện lừa đảo (Fraud Detection Capabilities)
- **Hiểu ngôn ngữ tự nhiên (Natural Language Understanding - NLU)**: Gemini có khả năng xuất sắc trong việc đọc hiểu tiếng Việt, bao gồm cả tiếng lóng, cách viết tắt, viết sai chính tả có chủ đích của các đối tượng lừa đảo.
- **Phân tích ngữ cảnh (Contextual Analysis)**: Vượt qua các bộ lọc từ khóa (keyword-based filters) truyền thống, Gemini có thể nhận diện **ý đồ thao túng tâm lý (manipulative intent)** trong một đoạn hội thoại dài (ví dụ: tạo áp lực thời gian, yêu cầu chuyển tiền gấp).
- **Phân tích đa phương thức (Multimodal Analysis)**: 
  - Khả năng xử lý ảnh (chụp màn hình tin nhắn, biên lai chuyển tiền giả, giấy tờ giả).
  - Phân tích các thành phần hình ảnh (logo ngân hàng bị mờ, font chữ sai lệch, dấu mộc giả).
  - (Tương lai) Phân tích âm thanh để nhận diện giọng nói Deepfake hoặc kịch bản lừa đảo qua cuộc gọi.
- **Giải thích suy luận (Reasoning & Explanation)**: Gemini không chỉ đưa ra kết luận "Có Lừa Đảo" mà còn giải thích được *tại sao*, chỉ ra các *red flags* một cách cụ thể, giúp tăng tính giáo dục cho người dùng.

### 2. Các phương pháp tiếp cận bảo mật AI hiện có (Existing AI Security Approaches)
- **Threat Intelligence Feeds**: Dựa trên danh sách các URL, IP đen đã được biết đến (Blacklisting). Nhược điểm: Phản ứng chậm với các chiến dịch lừa đảo mới (Zero-day phishing).
- **Machine Learning truyền thống**: Phân loại tin nhắn rác (Spam classification) bằng Naive Bayes hoặc SVM. Nhược điểm: Dễ bị qua mặt bằng các cách viết lách luật, không xử lý tốt ngữ cảnh hội thoại phức tạp.
- **Quy trình hoạt động của hệ thống đề xuất**: 
  - Người dùng cung cấp input (chụp màn hình, copy tin nhắn).
  - Hệ thống sử dụng OCR (được tích hợp sẵn trong Gemini) hoặc trích xuất văn bản.
  - Gemini phân tích và đối chiếu với cơ sở dữ liệu các mẫu lừa đảo (Grounding with Fraud Patterns).
  - Trả về kết quả phân tích và *mô phỏng hậu quả*.

### 3. Kiến trúc kỹ thuật dự kiến
- **AI Core**: Google Gemini Pro/Flash (tùy thuộc vào yêu cầu về tốc độ và độ phức tạp của tác vụ).
- **Backend & Cơ sở dữ liệu**: Firebase (Firestore, Cloud Functions) & Google Cloud Run.
- **Giao diện**: Mobile App (Flutter/React Native) hoặc Web App / Trợ lý ảo.

## Checklist
- [x] Đánh giá khả năng xử lý tiếng Việt của Gemini.
- [x] Xác định ưu thế của Multimodal AI so với các giải pháp truyền thống.
- [ ] Thiết lập Proof of Concept (PoC) cho tính năng đọc biên lai chuyển tiền giả.

## Tài liệu liên quan
- [AICapabilityMatrix.md](./AICapabilityMatrix.md)
- [FraudPatterns.md](./FraudPatterns.md)

## Việc cần làm tiếp
- Đánh giá chi phí API (Pricing Analysis) khi scale up lên hàng triệu request.
- Thử nghiệm độ trễ (Latency test) của Gemini Flash trong các kịch bản thời gian thực.
