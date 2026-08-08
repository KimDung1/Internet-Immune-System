# Luồng Người dùng (User Flows)

## Mục tiêu
Mô tả chi tiết các bước tương tác của người dùng trong các kịch bản cốt lõi của Internet Immune System, từ lúc bắt đầu sử dụng cho đến khi đối mặt và xử lý các mối đe dọa.

## Nội dung chính

### 1. Luồng Onboarding
* **B1:** Màn hình chào mừng với câu slogan "Your AI Immune System for the Internet".
* **B2:** Quét thiết bị/trình duyệt lần đầu để đánh giá "Tình trạng miễn dịch" ban đầu.
* **B3:** Hướng dẫn nhanh (Quick Tour) về 5 chế độ AI thông qua một kịch bản giả định (ví dụ: nhận 1 email lừa đảo).
* **B4:** Kích hoạt chế độ Protect (Cấp quyền hệ thống/trình duyệt).
* **B5:** Chuyển đến Dashboard chính.

### 2. Luồng Quét Gian lận (Fraud Scan - Detect)
* **B1:** Người dùng sao chép một link nghi ngờ hoặc hệ thống tự động bắt một URL mới.
* **B2:** UI chuyển sang trạng thái "Scanning" (Hiệu ứng radar AI).
* **B3:** Kết quả trả về trong 1-3 giây.
  * *Nếu An toàn:* Hiển thị tick xanh, hiệu ứng mềm mại.
  * *Nếu Nguy hiểm:* Chuyển sang "Immune Response" (Cảnh báo đỏ, rung màn hình nhẹ).
* **B4:** Hiển thị nút gọi hành động (Call to Action): "Block link" hoặc "Explain why".

### 3. Luồng Mô phỏng Hậu quả (Consequence Simulation)
* **B1:** Người dùng chọn "Simulate" trên một mối đe dọa vừa bị phát hiện.
* **B2:** Giao diện tối lại (Theater Mode).
* **B3:** AI bắt đầu trình chiếu diễn tiến: "Nếu bạn click... -> Kẻ gian chiếm phiên đăng nhập -> Tài khoản ngân hàng mất 50,000,000 VNĐ".
* **B4:** Kết thúc mô phỏng với thông điệp: "Rất may, hệ miễn dịch của bạn đã chặn điều này".
* **B5:** Tùy chọn xem giải thích kỹ thuật hoặc quay lại Dashboard.

### 4. Luồng Chế độ Huấn luyện (Training Mode)
* **B1:** Người dùng nhận được thông báo "Có 1 đợt diễn tập mới".
* **B2:** Vào chế độ Train, hệ thống hiển thị một kịch bản lừa đảo deepfake giả định.
* **B3:** Người dùng phải chỉ ra 3 điểm bất thường.
* **B4:** Hệ thống chấm điểm, cấp huy hiệu "Kháng thể mức 2", và cộng điểm Immunity Score.

### 5. Luồng Bảo vệ Thời gian thực (Real-time Protection)
* **B1:** Chạy ngầm trong nền (HUD Mode).
* **B2:** Người dùng lướt web bình thường. Tín hiệu xanh mờ góc màn hình.
* **B3:** Phát hiện trang web phishing đổi hướng. Tín hiệu HUD chớp đỏ, chặn tải trang ngay lập tức.
* **B4:** Hiện Pop-up: "Mối đe dọa bị tiêu diệt bới Kháng thể AI" (Hiệu ứng hạt vỡ ra).

## Checklist
- [x] Lập bản đồ luồng Onboarding.
- [x] Xây dựng kịch bản cho 5 tính năng cốt lõi.
- [x] Tích hợp các khoảnh khắc "Emotional Design" vào từng bước.

## Tài liệu liên quan
- `04_UX/InformationArchitecture.md`
- `05_UI/MotionDesign.md`

## Việc cần làm tiếp
- Vẽ User Flows chi tiết bằng FigJam hoặc Miro.
- Lấy ý kiến từ đội ngũ kỹ thuật (Firebase/Cloud Run) về độ trễ dự kiến ở B3 phần Fraud Scan.
