# Risk Register & Management

## Mục tiêu
Nhận diện, phân tích và lên kế hoạch kiểm soát các rủi ro có thể ảnh hưởng đến chất lượng, tiến độ và mục tiêu của dự án **Internet Immune System** (đặc biệt là mục tiêu lọt Top 10 AI Riser Vietnam). Tài liệu này được cập nhật liên tục trong suốt vòng đời dự án.

## Nội dung chính

### 1. Ma trận đánh giá rủi ro (Risk Assessment Matrix)
Đánh giá dựa trên Xác suất xảy ra (Probability: 1-5) và Tác động (Impact: 1-5).
*Mức độ Rủi ro (Risk Score) = Probability x Impact.*
- Cao (High): 15 - 25
- Trung bình (Medium): 8 - 14
- Thấp (Low): 1 - 7

### 2. Danh sách Rủi ro (Risk Register)

| ID | Tên Rủi ro (Risk Description) | Loại | P | I | Score | Chiến lược Giảm thiểu (Mitigation Strategy) | Người phụ trách (Owner) |
|:---|:---|:---:|:-:|:-:|:---:|:---|:---|
| **R01** | **Chi phí Gemini API / Cloud Run vượt ngân sách.** Do số lượng request quá lớn hoặc dữ liệu phân tích nặng. | Tài chính | 4 | 4 | **16 (Cao)** | Thiết lập Quota/Budgets alerts trên Google Cloud. Áp dụng caching, tối ưu prompt và nén dữ liệu trước khi gửi lên AI. | Cloud Engineer |
| **R02** | **Độ trễ (Latency) cao khi bảo vệ thời gian thực.** Người dùng phải chờ quá lâu để hệ thống xác định web/tin nhắn là lừa đảo. | Kỹ thuật | 3 | 5 | **15 (Cao)** | Tối ưu hóa kiến trúc, sử dụng gRPC/WebSockets. Xây dựng rule-based filter cục bộ kết hợp với Gemini API cho các case phức tạp. | AI/Cloud Engineer |
| **R03** | **AI dự đoán sai (False Positives/Negatives).** Chặn nhầm trang web hợp lệ hoặc bỏ sót các vụ lừa đảo tinh vi. | Chất lượng | 4 | 4 | **16 (Cao)** | Liên tục fine-tuning model, thêm cơ chế "Report" để người dùng phản hồi. Giải thích rõ ràng (AI Explanation) lý do chặn. | AI / Security Expert |
| **R04** | **Thiếu dữ liệu lừa đảo đặc thù tại thị trường Việt Nam.** (Ngôn ngữ tiếng Việt lóng, kịch bản lừa đảo qua Zalo/Facebook). | Dữ liệu | 4 | 3 | **12 (TB)** | Thu thập dữ liệu từ các dự án cộng đồng (Chống Lừa Đảo), tạo bộ dataset chuẩn. Sử dụng khả năng xử lý đa ngôn ngữ tốt của Gemini. | Security Expert |
| **R05** | **UX bị đánh giá giống "Chatbot thông thường".** Không làm nổi bật được yếu tố "AI Experience" và "Immune System". | Sản phẩm | 3 | 4 | **12 (TB)** | Tập trung phát triển mạnh tính năng Consequence Simulation và thiết kế giao diện tương tác chủ động (Proactive UI) thay vì giao diện chat. | UX Engineer / PO |
| **R06** | **Trễ tiến độ nộp bài cuộc thi AI Riser Vietnam.** Do không hoàn thành tích hợp các tính năng cốt lõi. | Tiến độ | 2 | 5 | **10 (TB)** | Áp dụng chặt chẽ Agile. Giữ phạm vi MVP tinh gọn, tập trung vào "Wow factor" cho ban giám khảo thay vì ôm đồm tính năng. | Project Manager |

### 3. Quy trình giám sát rủi ro
- Xem xét lại Risk Register vào mỗi buổi **Sprint Planning**.
- Báo cáo ngay lập tức các rủi ro có Risk Score > 15 cho toàn bộ đội ngũ và Stakeholders.
- Bổ sung rủi ro mới khi phát hiện trong quá trình phát triển.

## Checklist
- [ ] Tất cả các rủi ro High (Cao) đã có Action Plan và Assigned Owner rõ ràng.
- [ ] Đã thiết lập cảnh báo ngân sách (Billing alerts) trên Google Cloud Console.
- [ ] Kế hoạch test (Test Plan) đã bao gồm việc kiểm tra độ trễ (latency) và tính chính xác của AI.

## Tài liệu liên quan
- [Project Charter](./ProjectCharter.md)
- [Team Structure](./TeamStructure.md)

## Việc cần làm tiếp
- Cấu hình Budget Alert trên Google Cloud Platform.
- Xây dựng kho lưu trữ dữ liệu (Dataset) các mẫu câu lừa đảo tiếng Việt để test R04.
