# Thiết kế Chuyển động (Motion Design)

## Mục tiêu
Xây dựng "ngôn ngữ chuyển động" (motion language) mang tính biểu tượng cho Internet Immune System. Các chuyển động không chỉ để làm đẹp mà phải truyền tải trạng thái của hệ thống AI, tạo ra "AI Experience" và tác động đến cảm xúc người dùng (Emotional Design).

## Nội dung chính

### 1. Nguyên tắc Chuyển động chung (Motion Principles)
* **Hữu cơ & Công nghệ (Organic Tech):** Kết hợp sự chính xác của máy tính với sự mượt mà của hệ sinh học (hệ miễn dịch).
* **Thời lượng (Timing):** 
  * Micro-interactions: 150ms - 200ms.
  * Transitions (Chuyển trang): 300ms - 400ms.
  * AI Animations (Mô phỏng): Dài hơn (có thể lặp lại), tạo cảm giác đang xử lý sâu.
* **Easing (Hàm gia tốc):** Ưu tiên dùng `Ease-Out` cho các đối tượng xuất hiện, và `Ease-In` cho đối tượng biến mất.

### 2. Thư viện Chuyển động Cốt lõi (Core Animations)
* **The AI Pulse (Nhịp đập AI):**
  * *Trạng thái:* Chờ (Idle), Đang bảo vệ.
  * *Mô tả:* Vòng tròn bao quanh "Immunity Score" mở rộng và co lại nhẹ nhàng, chậm rãi (như nhịp thở), độ mờ từ 10% đến 40%.
* **The Immune Response (Phản ứng Miễn dịch):**
  * *Trạng thái:* Phát hiện nguy cơ (Red Alert).
  * *Mô tả:* Màn hình giật nhẹ (shake 2px trong 100ms), hiệu ứng Pulse chuyển đỏ khẩn cấp và nhịp nhanh gấp 3 lần. Các đường viền UI chớp đỏ.
* **The Antibody Creation (Sinh kháng thể):**
  * *Trạng thái:* Giải quyết xong mối đe dọa hoặc hoàn thành bài Train.
  * *Mô tả:* Các hạt phân tử (Particles) nhỏ màu xanh lá chụm lại, hợp nhất thành một biểu tượng khiên, sau đó nổ tia sáng (Glow burst) nhẹ.

### 3. Chuyển động Chế độ Mô phỏng (Simulate Mode)
* **Consequence Theater Flow:**
  * Khi vào chế độ, giao diện UI bình thường chìm xuống (Scale down 0.95, fade to dark).
  * Một luồng sáng (Laser line) vẽ ra lộ trình lừa đảo trên màn hình.
  * Các node (điểm nút) xuất hiện bằng hiệu ứng "Pop & Bounce".

### 4. Chuyển động Chế độ Giải thích (Explain Mode)
* **AI Narrator Typewriter:**
  * Chữ xuất hiện theo tốc độ gõ phím của con người (khoảng 20-30ms/ký tự).
  * Từ khóa quan trọng (như "Lừa đảo", "Mất dữ liệu") sẽ sáng lên (Highlight glow) sau khi được gõ xong.

## Checklist
- [x] Định nghĩa Timing và Easing chung.
- [x] Mô tả chi tiết hiệu ứng "AI Pulse" và "Immune Response".
- [x] Quy định chuyển động cho "Consequence Theater".

## Tài liệu liên quan
- `04_UX/PrototypeSpecs.md`
- `05_UI/MicrointeractionLibrary.md`

## Việc cần làm tiếp
- Tạo các file prototype chuyển động mẫu (MP4/GIF) hoặc file Lottie (JSON) trên After Effects/Figma để Dev sử dụng trực tiếp.
- Đảm bảo tuân thủ Accessibility (Cho phép tắt chuyển động nếu cần).
