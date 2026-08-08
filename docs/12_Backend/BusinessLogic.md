# Business Logic

## Mục tiêu
Tài liệu hóa các thuật toán và logic nghiệp vụ (Business Logic) cốt lõi của Internet Immune System, đảm bảo tính minh bạch và có thể tái hiện được.

## Nội dung chính

### 1. Thuật toán Đánh giá Điểm rủi ro (Fraud Risk Score)
Khi phân tích một đối tượng (URL, Tin nhắn), Điểm rủi ro (0-100) được tổng hợp từ 3 yếu tố (Heuristics + AI):

$$ Risk = (W_1 \times T) + (W_2 \times S) + (W_3 \times A) $$

- **T (Threat Intel Lookup - $W_1 = 40\%$):** Kiểm tra đối tượng có nằm trong danh sách đen (Blacklist) hay không. Nếu có trên blacklist uy tín -> Điểm thành phần = 100.
- **S (Static Analysis - $W_2 = 20\%$):** Kiểm tra SSL, tuổi domain (Domain Age). Domain mới tạo < 7 ngày -> Điểm thành phần = 80.
- **A (AI Context Analysis - $W_3 = 40\%$):** Detector Agent đánh giá ngữ cảnh ngôn ngữ. Ví dụ: Sự khẩn cấp giả tạo ("Khóa tài khoản lập tức"), lỗi chính tả -> Điểm AI chấm (0-100).

*Mức độ cảnh báo:*
- `< 30`: SAFE
- `30 - 70`: WARNING (Cần Simulator vào cuộc nhẹ nhàng)
- `> 70`: CRITICAL (Kích hoạt Simulator cảnh báo đỏ, Protector đề xuất chặn)

### 2. Thuật toán User Trust Score
Điểm tin cậy của người dùng phản ánh "sức đề kháng" của họ trước lừa đảo trên Internet. (Thang điểm 0-100).

- **Khởi tạo:** User mới bắt đầu ở mức 50.
- **Trừ điểm (Penalty):**
  - Mở URL bị đánh giá > 70 điểm (Risk) mà không qua hệ thống quét: -5 điểm.
  - Bỏ qua cảnh báo đỏ của hệ thống và vẫn click tiếp tục: -10 điểm.
- **Cộng điểm (Reward):**
  - Sử dụng hệ thống để quét trước một URL đáng ngờ (và được xác nhận là lừa đảo): +5 điểm.
  - Hoàn thành một bài học (Training Session) với điểm tuyệt đối: +10 điểm.
  - Báo cáo chính xác (Report) một trang web lừa đảo mới: +15 điểm.

### 3. Logic Tổng hợp Threat Intelligence
- Khi người dùng gửi Fraud Report, nó sẽ ở trạng thái `PENDING`.
- Nếu có >= 5 người dùng khác nhau báo cáo cùng một URL trong 24h, hoặc có xác nhận từ AI phân tích sâu -> tự động chuyển thành `VERIFIED` và đưa vào hệ thống ngăn chặn toàn cầu của ứng dụng.

## Checklist
- [x] Lập công thức Fraud Risk Score.
- [x] Lập logic tính điểm User Trust Score.
- [x] Xác định quy trình xét duyệt Threat Intelligence.

## Tài liệu liên quan
- [AgentSpecs.md](../10_Agent/AgentSpecs.md) (Nơi Agent sử dụng các logic này)
- [DatabaseSchema.md](../11_Database/DatabaseSchema.md)

## Việc cần làm tiếp
- Tinh chỉnh trọng số (Weights) trong công thức Risk Score sau giai đoạn Beta testing.
