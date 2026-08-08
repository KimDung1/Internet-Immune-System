# Icon System

## Mục tiêu
Tài liệu định hướng hệ thống biểu tượng (icon) dùng trong Internet Immune System. Icon cần truyền tải sự gãy gọn, y khoa (phân tích, bảo vệ), và kỹ thuật số (AI, mạng lưới) đồng thời hỗ trợ khả năng nhận diện tức thì các mối đe dọa.

## Nội dung chính

### 1. Lựa chọn Thư viện Icon gốc
*   **Đề xuất:** Dùng thư viện **Lucide Icons** hoặc **Phosphor Icons**.
*   **Lý do:** 
    *   Sạch sẽ, nét mượt mà, đồng nhất về độ dày (stroke width).
    *   Cung cấp các dạng outline (viền) rất hợp với giao diện Dark mode tối giản.
    *   Nét chữ 1.5px (Stroke) là hoàn hảo để không bị quá nặng nề hoặc quá mỏng manh.

### 2. Nguyên tắc thiết kế (Usage Guidelines)
*   **Thống nhất độ dày viền (Stroke-width):** Luôn dùng stroke 1.5px hoặc 2px. Không mix các icon có nét đậm nhạt khác nhau.
*   **Bo góc (Rounded):** Đầu các đường nét (line-cap) và các góc (join) nên dùng kiểu `round` để tạo cảm giác thân thiện, tránh sắc nhọn thái quá.
*   **Icon + Text:** Hầu hết icon phải luôn đi kèm text giải thích, không dùng icon đơn độc cho các chức năng hệ trọng (trừ các icon phổ quát như 'X' tắt, mũi tên).

### 3. Icon Ẩn dụ - "Hệ Miễn Dịch" (Custom/Thematic Icons)
Một số khái niệm cần thiết kế icon tùy chỉnh (custom SVG) để khớp với concept:
*   **Virus / Malware:** Hình cầu gai (Spike protein) kết hợp với các rãnh số hóa (glitch/circuit).
*   **Kháng thể (Antibody):** Hình chữ Y (Y-shaped protein) cách điệu kết hợp thành biểu tượng giống cây đinh ba hoặc lưới chắn sáng.
*   **Phân tích (Scan/Phagocytosis - Thực bào):** Vòng tròn bao lấy một hạt nhỏ bên trong (tượng trưng cho AI đang cô lập mối đe dọa).
*   **Miễn dịch học (AI Learning):** Biểu tượng não bộ kết hợp với các kết nối mạng nơ-ron sinh học.

### 4. Kích thước chuẩn (Sizes)
*   `Sm (16x16)`: Dùng trong các label nhỏ, nút inline, dropdown item.
*   `Md (20x20)`: Kích thước tiêu chuẩn dùng cạnh chữ Body Text, icon trên các button vừa.
*   `Lg (24x24)`: Icon ở thanh Sidebar (Menu), tiêu đề các Widget.
*   `Xl (48x48) trở lên`: Trạng thái trống (Empty state), minh họa tính năng lớn trên trang.

### 5. Màu sắc Icon
*   Icon thông thường: Sử dụng `Text-Secondary` hoặc `Text-Muted`.
*   Icon Trạng thái: Cảnh báo (Red/Amber) hoặc An toàn (Emerald).
*   Icon AI đang hoạt động: Màu `Cyan-400` kèm hiệu ứng animation phát sáng nhịp nhàng (Pulse).

## Checklist
- [x] Lựa chọn thư viện gốc (Lucide/Phosphor) với nét 1.5px.
- [x] Định nghĩa concept cho các icon ẩn dụ miễn dịch.
- [x] Thiết lập hệ thống kích thước (16, 20, 24, 48px).
- [x] Quy tắc màu sắc icon theo ngữ cảnh.

## Tài liệu liên quan
- [Visual Language](../07_Branding/VisualLanguage.md)
- [Component Library](ComponentLibrary.md)

## Việc cần làm tiếp
- Vẽ bộ icon Custom (Virus, Antibody, Shield) dưới dạng SVG.
- Đóng gói các icon thành React/Vue Component để dễ dàng truyền biến số `size` và `color`.
