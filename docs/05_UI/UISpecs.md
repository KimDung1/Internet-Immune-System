# Đặc tả Giao diện Người dùng (UI Specifications)

## Mục tiêu
Chuẩn hóa hệ thống thiết kế (Design System) của Internet Immune System, bao gồm màu sắc, typography, và các UI component cơ bản, đảm bảo tính nhất quán trên mọi nền tảng (Web/App/Extension).

## Nội dung chính

### 1. Bảng màu (Color Palette)
Hệ thống sử dụng bảng màu mang tính "công nghệ sâu" (deep tech) và "bảo vệ":
* **Primary Brand:** `Cyber Blue` (#00E5FF) - Đại diện cho AI và sự an toàn.
* **Backgrounds:** 
  * `Deep Void` (#0B0D17) - Nền tối, giúp các thành phần phát sáng nổi bật.
  * `Surface Dark` (#1A1D2D) - Dùng cho các thẻ (Cards) và Pop-ups.
* **Semantic Colors (Màu ngữ nghĩa):**
  * `Safe (Kháng thể)`: #00E676 (Neon Green)
  * `Warning (Nghi ngờ)`: #FFEA00 (Neon Yellow)
  * `Danger (Mối đe dọa)`: #FF1744 (Alert Red) - Dùng cho "Immune Response".

### 2. Kiểu chữ (Typography)
* **Font chính:** `Inter` (Sans-serif) cho nội dung đọc để tối ưu độ rõ ràng.
* **Font hiển thị (Display):** `Space Grotesk` hoặc `JetBrains Mono` dùng cho các thông số kỹ thuật (Immunity Score, AI data) tạo cảm giác lập trình/AI.
* **Cấp bậc (Hierarchy):**
  * H1 (Hero/Scores): 48px, Bold.
  * H2 (Titles): 24px, Semi-Bold.
  * Body (AI Explaination): 16px, Regular, Line-height 150%.
  * Caption (Metadata): 12px, Medium, mờ 60%.

### 3. Components (Thành phần UI)
* **Buttons:**
  * *Primary:* Background Cyber Blue, Text Đen, bo góc 8px (Radius), có hiệu ứng Glow nhẹ khi hover.
  * *Alert/Block (Danger):* Background Alert Red, Text Trắng.
  * *Ghost/Secondary:* Không nền, viền 1px mờ.
* **Cards (Thẻ nội dung):**
  * Nền `Surface Dark`, viền 1px (#FFFFFF opacity 10%), đổ bóng (Drop shadow) mờ lan tỏa nhẹ màu Cyber Blue.
* **Input Fields (Ô nhập liệu):**
  * Nền tối hơn Surface, có icon Scan ở bên phải. Khi Focus, viền chuyển sáng màu Cyber Blue.
* **Immunity Ring (Vòng tròn biểu đồ):**
  * Hiển thị điểm số bằng vòng tròn SVG có độ dày 8px. Màu vòng tròn gradient từ Safe Green sang Cyber Blue.

### 4. Trạng thái (States)
Mọi component phải định nghĩa đủ 5 trạng thái:
1. `Default` (Bình thường)
2. `Hover` (Di chuột)
3. `Focus` (Được chọn / Bàn phím)
4. `Active/Pressed` (Đang nhấn)
5. `Disabled` (Vô hiệu hóa - Độ mờ 30%)

## Checklist
- [x] Quy định mã màu HEX cho toàn hệ thống.
- [x] Thiết lập Typographic scale.
- [x] Định nghĩa kiểu dáng cho Buttons, Cards, Inputs.
- [x] Cập nhật các trạng thái của Component.

## Tài liệu liên quan
- `04_UX/WireframeSpecs.md`
- `05_UI/ResponsiveSpecs.md`

## Việc cần làm tiếp
- Xây dựng file Design System chung trên Figma.
- Xuất các Design Tokens (JSON) để đội Dev sử dụng trong CSS/Tailwind.
