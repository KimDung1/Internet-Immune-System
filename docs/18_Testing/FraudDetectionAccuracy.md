# Fraud Detection Accuracy Testing

## Mục tiêu
Đánh giá và tối ưu hóa độ chính xác của lõi AI (Vertex AI / Gemini) trong việc phát hiện lừa đảo (Fraud/Phishing detection). Đây là yếu tố sống còn của dự án; một hệ thống miễn dịch cảnh báo sai (False Positive) quá nhiều sẽ gây phiền nhiễu, trong khi bỏ lọt lừa đảo (False Negative) sẽ gây thiệt hại cho người dùng.

## Nội dung chính

### 1. Chỉ số mục tiêu (Target Metrics)
- **Độ chính xác (Accuracy)**: > 90% (tổng số ca đoán đúng trên tổng số ca).
- **Precision (Độ chuẩn xác)**: > 85%. (Khi hệ thống báo lừa đảo, tỷ lệ lừa đảo thật sự là bao nhiêu. Giảm thiểu báo động giả - False Positives).
- **Recall (Độ phủ)**: > 95%. (Trong tất cả các ca lừa đảo thực tế, hệ thống bắt được bao nhiêu. Giảm thiểu bỏ sót - False Negatives).
> *Triết lý hệ miễn dịch: Thà cảnh báo nhầm còn hơn bỏ sót, do đó mục tiêu Recall được ưu tiên cao hơn Precision.*

### 2. Bộ dữ liệu thử nghiệm (Test Datasets)
Cần xây dựng một bộ dữ liệu vàng (Golden Dataset) gồm:
- **Tập Lừa đảo (Phishing/Scams)**: 500 mẫu (URL độc hại từ PhishTank, Spamhaus, hoặc email scam thu thập từ hòm thư).
- **Tập An toàn (Benign/Legitimate)**: 500 mẫu (URL báo chí, ngân hàng thật, email công việc bình thường).
- Bộ dataset phải bao gồm nhiều ngôn ngữ, đặc biệt ưu tiên **Tiếng Việt** (do nhắm mục tiêu thị trường Việt Nam).

### 3. Phương pháp Test (Automated Evaluation)
- Xây dựng một Python pipeline tự động:
  1. Đọc dữ liệu từ file CSV (chứa Input Text/URL và Label thật).
  2. Gửi từng input qua Gemini API (thông qua hàm backend).
  3. Trích xuất kết quả dự đoán (Is_Fraud: True/False).
  4. So sánh với Label thật và tính toán Confusion Matrix (Ma trận nhầm lẫn), Precision, Recall, F1-Score.

### 4. Tối ưu hóa mô hình (A/B Testing Prompt)
- Nếu các chỉ số chưa đạt mục tiêu, thực hiện A/B Testing trên cấu trúc Prompt thay vì fine-tuning model (do chi phí fine-tuning cao).
- **Prompt A**: Cung cấp định nghĩa lừa đảo cơ bản.
- **Prompt B (Few-Shot Prompting)**: Cung cấp thêm 3-5 ví dụ (examples) điển hình về kịch bản lừa đảo ở Việt Nam (VD: lừa chuyển tiền giả danh công an, lừa đảo việc làm online) ngay trong prompt.
- Chạy tập dữ liệu qua cả 2 phiên bản và chọn prompt mang lại F1-score cao hơn.

## Checklist
- [x] Xác định các chỉ số đánh giá (Precision, Recall).
- [ ] Thu thập và gán nhãn thủ công cho bộ Golden Dataset (ít nhất 200 mẫu ban đầu).
- [ ] Viết script Python automation đánh giá model.
- [ ] Thiết kế 2-3 phiên bản Prompt (System Instructions) để A/B Test.
- [ ] Báo cáo kết quả ra bảng (Dashboard) cho ban cố vấn.

## Tài liệu liên quan
- [TestStrategy.md](./TestStrategy.md)
- [CostManagement.md](../16_Cloud/CostManagement.md) (Lưu ý chi phí API khi chạy test dataset lớn)

## Việc cần làm tiếp
- Thu thập mẫu email tiếng Việt lừa đảo đang thịnh hành (SMS brandname lừa đảo, email tống tiền giả mạo).
- Tích hợp framework đánh giá ML (ví dụ: MLflow hoặc bộ công cụ cơ bản) để lưu lịch sử độ chính xác qua các lần đổi prompt.
