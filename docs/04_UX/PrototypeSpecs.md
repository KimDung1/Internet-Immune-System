# Đặc tả Bản mẫu Tương tác (Prototype Specifications)

## Mục tiêu
Tài liệu này chuẩn hóa các tương tác, hành vi và luồng chuyển đổi giữa các màn hình trong Prototype, đảm bảo trải nghiệm liền mạch, thể hiện rõ tính chất "AI Experience" và Emotional Design.

## Nội dung chính

### 1. Hành vi Chuyển cảnh (Screen Transitions)
* **Dashboard -> Detect:** Chuyển đổi trượt từ dưới lên (Slide up) thể hiện sự sẵn sàng của hệ thống.
* **Detect -> Simulate (Consequence Theater):** Hiệu ứng "Zoom in" và mờ dần nền (Fade to dark). Chuyển sang không gian ba chiều mô phỏng.
* **Simulate -> Dashboard:** Hiệu ứng "Zoom out" nhanh và Fade to light, đưa người dùng trở về vùng an toàn.

### 2. Tương tác Chạm / Click (Touch/Click Interactions)
* **Nút Action (Quét, Chặn):** Phải có hiệu ứng "Haptic feedback" (rung nhẹ trên mobile) hoặc "Ripple effect" tỏa ra xung quanh nút khi được nhấn.
* **Vuốt (Swipe):** Trong danh sách "Hoạt động gần đây", vuốt sang trái để Xóa, vuốt sang phải để "Đánh dấu là an toàn (Whitelist)".

### 3. Tương tác "AI Experience" Đặc thù
* **The "Immune Response" (Phản ứng hệ miễn dịch):**
  * Khi nhập URL nguy hiểm, toàn bộ màn hình có một nhịp chớp (pulse) nhẹ màu cam/đỏ.
  * Điện thoại rung theo nhịp tim.
  * Nút "Block" tự động nảy (bounce) để thu hút sự chú ý.
* **The "Antibody Creation" (Tạo kháng thể):**
  * Khi hoàn thành một bài Train, một hình ảnh 3D mô phỏng "kháng thể" xuất hiện xoay vòng giữa màn hình, sau đó bay vào kho lưu trữ (Avatar hoặc biểu tượng khiên).
* **AI Narrator (Người kể chuyện AI):**
  * Trong chế độ Explain, văn bản do Gemini sinh ra không xuất hiện toàn bộ ngay lập tức, mà dùng hiệu ứng Typewriter (gõ chữ) tốc độ vừa phải, đồng bộ với sóng âm (audio wave) giả lập sự giao tiếp của AI.

### 4. Xử lý Trạng thái Trễ (Delay / Loading States)
* Khi gọi API tới Cloud Run / Gemini AI (thường mất 1-3 giây):
  * **Không dùng Spinner truyền thống.**
  * Sử dụng hiệu ứng "AI Thinking": Sóng hạt lan tỏa, kèm text "AI đang cô lập các đoạn mã nghi ngờ...", "Đang phân tích cấu trúc lừa đảo...".

## Checklist
- [x] Quy định hiệu ứng chuyển cảnh.
- [x] Đặc tả các tương tác chạm và vuốt.
- [x] Định nghĩa các hiệu ứng "AI Experience" độc quyền.
- [x] Xử lý tương tác trong lúc chờ API phản hồi.

## Tài liệu liên quan
- `04_UX/UserFlows.md`
- `05_UI/MotionDesign.md`
- `05_UI/MicrointeractionLibrary.md`

## Việc cần làm tiếp
- Tạo các Interactive Components trên Figma dựa trên đặc tả này.
- Ghi hình (Record) một luồng sử dụng hoàn chỉnh từ Prototype để báo cáo.
