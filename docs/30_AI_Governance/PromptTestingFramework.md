# Prompt Testing Framework

## Mục tiêu
Xây dựng một hệ thống đánh giá tự động và định lượng hiệu năng của các AI Prompts trước khi đưa lên Production. Đảm bảo mô hình duy trì độ chính xác cao trong việc phát hiện lừa đảo và không tạo ra kết quả sai lệch (False Positives/False Negatives).

## Nội dung chính

### 1. Tập Dữ liệu Đánh giá (Evaluation Datasets)
- **Golden Dataset**: Tập dữ liệu chuẩn (đã được dán nhãn bởi chuyên gia) chứa 1000+ mẫu (50% scam, 50% safe, bao gồm các edge cases).
- **Adversarial Dataset**: Tập dữ liệu chứa các prompt injection, các mẫu lừa đảo tinh vi (jailbreak attempts) để kiểm tra độ vững (robustness).
- **Dynamic Dataset**: Dữ liệu mới thu thập từ thực tế, được bổ sung hàng tuần.

### 2. Các Chỉ số Đánh giá (Metrics & Benchmarks)
- **Precision**: Tỷ lệ cảnh báo đúng trên tổng số cảnh báo (giảm thiểu False Positives - không làm phiền người dùng với link an toàn).
- **Recall**: Tỷ lệ bắt được scam trên tổng số scam thực tế (giảm thiểu False Negatives - không bỏ sót link độc hại). Ưu tiên Recall cao cho tính năng Cảnh báo rủi ro cao.
- **F1-Score**: Sự cân bằng giữa Precision và Recall.
- **Format Adherence**: Tỷ lệ mô hình trả về đúng định dạng JSON yêu cầu.

### 3. Pipeline Kiểm thử Tự động (Automated Eval)
Sử dụng framework đánh giá (như `promptfoo` hoặc công cụ nội bộ):
- Chạy batch inference trên Golden Dataset.
- Sử dụng "LLM-as-a-Judge" (dùng Gemini 2.5 Pro để chấm điểm câu trả lời của mô hình nhỏ hơn dựa trên rubrics).
- So sánh kết quả JSON output với Expected Output.

### 4. Human-in-the-Loop Evaluation
- Định kỳ (hàng tháng), chuyên gia phân tích bảo mật sẽ review ngẫu nhiên 5% các đánh giá tự động để calibrate lại hệ thống "LLM-as-a-Judge".

## Checklist
- [ ] Golden Dataset đã được cập nhật với các mẫu lừa đảo mới nhất trong tháng chưa?
- [ ] Kết quả Precision/Recall có đạt ngưỡng tối thiểu (vd: > 95%) không?
- [ ] Tỷ lệ Format Adherence có đạt 100% không?
- [ ] Pipeline CI có tự động chặn deploy nếu điểm Eval thấp hơn phiên bản trước không?

## Tài liệu liên quan
- [PromptVersionControl.md](PromptVersionControl.md)
- [ModelEvaluationCriteria.md](ModelEvaluationCriteria.md)

## Việc cần làm tiếp
- Tích hợp công cụ tự động hóa test (VD: promptfoo) vào repo.
- Xây dựng dashboard hiển thị các chỉ số Eval qua từng phiên bản.
