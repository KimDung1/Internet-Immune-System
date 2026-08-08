# Overall AI Strategy

## Mục tiêu
Xác định chiến lược sử dụng Trí tuệ Nhân tạo (AI) làm cốt lõi cho hệ thống "Internet Immune System". Đảm bảo AI hoạt động như một hệ miễn dịch thực sự: Phát hiện, Giải thích, Mô phỏng, Đào tạo, và Bảo vệ.

## Nội dung chính

### 1. Tầm nhìn AI
Internet Immune System không phải là một chatbot giao tiếp thông thường, nó là một **AI Experience** (Trải nghiệm AI ngầm định và chủ động). AI đóng vai trò như các tế bào bạch cầu, liên tục rà soát nội dung internet mà người dùng tiếp xúc, phân tích rủi ro và vô hiệu hóa các tác nhân gây hại (scam, phishing, fake news).

### 2. Kiến trúc Mô hình (Model Selection)
Tận dụng hệ sinh thái Google Cloud, chúng ta sử dụng dòng mô hình **Gemini**:
- **Gemini 2.5 Flash**: 
  - Nhiệm vụ: Tốc độ cao, chi phí thấp. Dùng cho luồng **Detect** và **Protect** (Real-time).
  - Yêu cầu: Quét qua hàng ngàn trang web, đưa ra quyết định "Có/Không" cực nhanh.
- **Gemini 2.5 Pro**: 
  - Nhiệm vụ: Xử lý ngữ cảnh sâu, suy luận logic phức tạp. Dùng cho luồng **Simulate** (Mô phỏng hậu quả nếu click) và **Explain** (Giải thích cặn kẽ tại sao lại là lừa đảo).
  - Yêu cầu: Khả năng phân tích tâm lý học tội phạm mạng, tạo kịch bản mô phỏng chân thực.

### 3. Phương pháp luận
- **Zero-shot & Few-shot Prompting**: Sử dụng các prompt được thiết kế kỹ lưỡng kèm theo ví dụ về các kịch bản lừa đảo phổ biến tại Việt Nam và quốc tế.
- **RAG (Tương lai)**: Lưu trữ các cơ sở dữ liệu về các vụ lừa đảo mới nhất vào Vector Database để cung cấp context thời gian thực cho Gemini.
- **Structured Output**: AI luôn phải trả về định dạng JSON (dùng JSON Schema) thay vì text thuần túy để Backend có thể xử lý lập trình được.

## Checklist
- [x] Xác định định vị sản phẩm (Không phải Chatbot)
- [x] Chọn loại model phù hợp cho từng chức năng
- [x] Xác định phương pháp Output cấu trúc (JSON)
- [ ] Lên kế hoạch đánh giá (Evaluation) độ chính xác của AI

## Tài liệu liên quan
- [Gemini Integration](GeminiIntegration.md)
- [Prompt Engineering](PromptEngineering.md)

## Việc cần làm tiếp
- Thiết lập tài khoản Google Cloud Vertex AI và lấy API key môi trường Dev.
