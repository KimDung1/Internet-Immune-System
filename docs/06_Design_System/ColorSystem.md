# Color System

## Mục tiêu
Hệ thống màu sắc được thiết kế để củng cố ẩn dụ về "Hệ miễn dịch kỹ thuật số". Màu sắc không chỉ dùng để trang trí, mà còn là công cụ phân loại dữ liệu, cảnh báo rủi ro, và hướng dẫn sự chú ý của người dùng. Phong cách tổng thể: Môi trường tối (Không gian mạng rộng lớn) kết hợp với các luồng ánh sáng neon (Sự sống/AI).

## Nội dung chính

### 1. Semantic Meaning (Ý nghĩa màu sắc)

*   **Bóng tối (Môi trường mạng):** Các sắc độ của Xanh Navy siêu tối, Xám sẫm. Đại diện cho thế giới internet phức tạp, bao la.
*   **Teal / Cyan (Kháng thể AI):** Màu sắc của sự sống số, quét dữ liệu, phân tích thông minh, năng lượng bảo vệ. (Cảm hứng từ JARVIS / y sinh học tương lai).
*   **Red / Crimson (Virus / Kẻ tấn công):** Đe dọa rõ ràng, lừa đảo (phishing), mã độc. Báo động đỏ khẩn cấp.
*   **Amber / Orange (Nhiễm trùng / Nghi ngờ):** Trạng thái bất thường, rủi ro tiềm ẩn, yêu cầu người dùng phải xem xét kỹ (hệ thống chưa chắc chắn 100% nhưng thấy có dấu hiệu).
*   **Emerald (Khỏe mạnh / An toàn):** Dữ liệu sạch, trang web an toàn, giao dịch đã được xác minh.

### 2. Color Palette (Bảng màu)

#### Nền và Giao diện (Surface & Background)
*   `Navy-900 (Base)`: `#070F1A` - Nền chính của toàn app.
*   `Navy-800`: `#0F172A` - Nền của các Panel lớn.
*   `Slate-800`: `#1E293B` - Các thẻ Card, Hover state của Menu.
*   `Slate-700`: `#334155` - Đường viền (Border), Divider phân cách nội dung.

#### Màu chủ đạo (Primary - The Digital Antibody)
*   `Cyan-400 (Chính)`: `#22D3EE` - Dùng cho Button chính, text nổi bật, các đường biểu đồ quét dữ liệu.
*   `Cyan-600`: `#0891B2` - Dùng cho Hover state của Button.
*   `Cyan-Glow`: `rgba(34, 211, 238, 0.2)` - Đổ bóng phát sáng xung quanh các khu vực AI đang làm việc.

#### Trạng thái tín hiệu (Signal States)
*   **Hiểm họa (Threat):** 
    *   `Red-500`: `#EF4444` (Text/Icon báo lỗi)
    *   `Red-900`: `#7F1D1D` (Nền nhạt cho thẻ cảnh báo nguy hiểm)
*   **Cảnh báo (Warning):** 
    *   `Amber-500`: `#F59E0B`
    *   `Amber-900`: `#78350F`
*   **An toàn (Safe):** 
    *   `Emerald-400`: `#34D399`
    *   `Emerald-900`: `#064E3B`

#### Màu chữ (Text Colors)
*   `Text-Primary`: `#F8FAFC` (Trắng tinh/Hơi xám nhạt) - Độ tương phản cao nhất.
*   `Text-Secondary`: `#94A3B8` (Xám nhạt) - Dùng cho phụ đề, text giải thích.
*   `Text-Muted`: `#475569` (Xám sẫm) - Dùng cho placeholder, text bị vô hiệu hóa.

### 3. Trải nghiệm Dark Mode & Ánh sáng
Dự án ưu tiên Dark Mode-first. Do nền rất tối, không dùng Shadow đen truyền thống, mà dùng "Glow" (Ánh sáng phát ra từ bản thân vật thể) giống như bảng điều khiển của tàu vũ trụ hay máy quét y tế. 

### 4. Trợ năng (Accessibility & Contrast)
*   Đảm bảo tất cả văn bản thông thường (Text-Primary trên nền Navy-900) đạt chuẩn **WCAG 2.1 tỷ lệ tối thiểu 4.5:1**.
*   Văn bản trên Button chính (Text đen hoặc Navy-900 trên nền Cyan-400) đảm bảo khả năng đọc. KHÔNG dùng text trắng trên nền Cyan vì độ tương phản thấp.

## Checklist
- [x] Xác định ý nghĩa semantic cho từng cụm màu (Cyan, Red, Amber, Emerald).
- [x] Cung cấp mã HEX cho Surface, Primary, Signals và Text.
- [x] Lưu ý về hiệu ứng Glow thay vì Shadow trong không gian tối.
- [x] Quy định về độ tương phản WCAG.

## Tài liệu liên quan
- [Design Tokens](DesignTokens.md)
- [Visual Language](../07_Branding/VisualLanguage.md)

## Việc cần làm tiếp
- Kiểm tra các cặp màu bằng công cụ WebAIM Contrast Checker.
- Import bảng màu này vào TailwindCSS `tailwind.config.js`.
