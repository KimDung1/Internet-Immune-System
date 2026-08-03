# Model Evaluation Criteria

## Mục tiêu
Thiết lập bộ tiêu chí rõ ràng để quyết định việc lựa chọn giữa các dòng mô hình AI (chủ yếu là Gemini 2.5 Flash và Gemini 2.5 Pro) cho từng tính năng cụ thể của Internet Immune System. Cân bằng giữa chi phí (Cost), độ trễ (Latency) và độ chính xác (Accuracy).

## Nội dung chính

### 1. Phân loại Mô hình
- **Gemini 2.5 Flash**: Tối ưu hóa cho tốc độ và chi phí thấp. Phù hợp cho các tác vụ cần phản hồi thời gian thực, xử lý văn bản ngắn, phân loại đơn giản.
- **Gemini 2.5 Pro**: Tối ưu hóa cho khả năng suy luận logic phức tạp, xử lý ngữ cảnh dài, độ chính xác cao. Phù hợp cho phân tích chuyên sâu, tổng hợp báo cáo.

### 2. Tiêu chí Đánh giá & Đánh đổi (Trade-offs)
| Tiêu chí | Gemini 2.5 Flash | Gemini 2.5 Pro |
| :--- | :--- | :--- |
| **Độ trễ (Latency)** | < 1 giây (Tuyệt vời cho Real-time) | 2-5 giây (Phù hợp Async/Background) |
| **Độ chính xác (Accuracy)**| Tốt cho cấu trúc rõ ràng | Xuất sắc cho các case mập mờ, tinh vi |
| **Chi phí (Cost)** | Rất thấp (High Volume) | Cao hơn (Low Volume, High Value) |
| **Context Window** | Phù hợp | Rất lớn (Tốt cho phân tích cả trang web) |

### 3. Chính sách Phân bổ Model (Model Routing Policy)
- **Real-time URL/Text Scanning (Trải nghiệm người dùng tức thì)**: SỬ DỤNG **Gemini 2.5 Flash**.
- **Deep Phishing Analysis (Phân tích chuyên sâu khi có dấu hiệu nghi ngờ cao)**: SỬ DỤNG **Gemini 2.5 Pro**.
- **Consequence Simulation (Mô phỏng hậu quả)**: SỬ DỤNG **Gemini 2.5 Pro** để có câu chuyện thuyết phục và logic hơn.
- **Fallback mechanism**: Nếu Flash trả về độ tự tin (confidence) < 0.7, tự động route request sang Pro để kiểm tra chéo (Cross-check).

### 4. Ngưỡng Chi phí (Cost Thresholds)
- Thiết lập cảnh báo ngân sách trên Google Cloud.
- Tính toán Cost-per-Scan và Cost-per-Active-User. Nếu vượt ngưỡng, kích hoạt chế độ "Economy Mode" (chỉ sử dụng Flash hoặc giảm độ dài Context).

## Checklist
- [ ] Use-case hiện tại có yêu cầu phản hồi < 1s không? (Nếu có -> Flash)
- [ ] Use-case có cần phân tích ngữ cảnh lớn (cả trang web phức tạp) không? (Nếu có -> Pro)
- [ ] Đã cấu hình fallback từ Flash sang Pro khi confidence thấp chưa?
- [ ] Đã thiết lập Billing Alerts cho API chưa?

## Tài liệu liên quan
- [PromptTestingFramework.md](PromptTestingFramework.md)

## Việc cần làm tiếp
- Viết script đo lường độ trễ thực tế (p50, p90, p99) của Flash và Pro trên Cloud Run.
- Triển khai Dynamic Model Routing logic trên Backend.
