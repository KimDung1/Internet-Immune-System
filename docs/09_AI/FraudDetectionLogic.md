# Fraud Detection Logic

## Mục tiêu
Quy định thuật toán chấm điểm rủi ro (Scoring system) và ngưỡng (threshold) để đưa ra quyết định. Quản lý việc giảm thiểu Positive Hails (cảnh báo nhầm).

## Nội dung chính

### 1. Hệ thống Chấm điểm (Scoring System)
AI sẽ trả về một `confidenceScore` từ `0.0` đến `1.0`. Hệ thống Backend sẽ ánh xạ điểm này thành các mức độ:

- **0.0 - 0.3**: `SAFE` (An toàn)
  - Không có dấu hiệu bất thường, các domain uy tín.
  - Action: Extension không hiển thị gì (Immune system at rest).

- **0.31 - 0.7**: `SUSPICIOUS` (Đáng ngờ)
  - Có yếu tố rủi ro nhưng chưa chắc chắn (ví dụ: web mới lập, giật tít câu view nhưng không lừa đảo tài sản).
  - Action: Extension hiển thị viền vàng cảnh báo nhẹ, đề xuất người dùng bật "Explain mode" để xem chi tiết.

- **0.71 - 1.0**: `MALICIOUS` (Nguy hiểm)
  - Có bằng chứng rõ ràng (phishing login form, giả mạo tên miền, mã độc).
  - Action: Extension hiển thị màn hình Đỏ toàn màn hình (Blocker), ngăn cản truy cập. Đề xuất "Simulate mode" để xem hậu quả.

### 2. Thuật toán kết hợp (Hybrid Approach)
Để tránh phụ thuộc 100% vào AI gây ra độ trễ hoặc lỗi halucination:
1. **Bước 1**: URL khớp với Blacklist nội bộ / Google Safe Browsing API -> Đánh `MALICIOUS` ngay lập tức (Score 1.0), bỏ qua gọi AI.
2. **Bước 2**: URL khớp với Whitelist (google.com, vnexpress.net, facebook.com) -> Đánh `SAFE` ngay, bỏ qua AI.
3. **Bước 3**: URL lạ hoặc khả nghi -> Chuyển nội dung cho Gemini AI phân tích.

### 3. Quản lý False Positives (Báo động nhầm)
- Cung cấp nút "This is safe (Report Incorrect)" trên giao diện cảnh báo.
- Nếu người dùng report, đẩy log này về Firestore. Dữ liệu này được dùng làm Few-shot examples trong các Prompt sau này để dạy AI không lặp lại lỗi.

## Checklist
- [x] Định nghĩa thang điểm Risk Score
- [x] Thiết lập thuật toán phân luồng Hybrid
- [x] Luồng xử lý False Positives
- [ ] Lập danh sách Whitelist domain phổ biến tại VN

## Tài liệu liên quan
- [AI Strategy](AIStrategy.md)
- [Prompt Engineering](PromptEngineering.md)

## Việc cần làm tiếp
- Cấu hình database bảng `whitelists` và `blacklists` trong Firestore.
