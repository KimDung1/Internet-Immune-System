# Grid & Layout System

## Mục tiêu
Thiết lập hệ thống lưới (Grid) và quy tắc bố cục (Layout) giúp sắp xếp thông tin một cách ngăn nắp, có cấu trúc như một hệ thống y tế/quân sự, đồng thời đảm bảo tính tương thích trên mọi kích thước màn hình (Responsive Design).

## Nội dung chính

### 1. Nguyên tắc Không gian trắng (White Space Principles)
*   **Khoảng không để thở:** Giao diện phân tích dữ liệu thường chứa rất nhiều text (log, giải thích AI, đường link dài). Khoảng trắng (Negative space) đóng vai trò sống còn để giảm tải nhận thức cho người dùng.
*   **Hệ thống Grid 8-Point:** Tất cả các margins, paddings, heights và widths đều là bội số của 8 (8, 16, 24, 32, 40, 48, v.v.). Điều này tạo ra nhịp điệu toán học cho mắt người dùng.
*   (Trường hợp cực nhỏ có thể dùng bội số 4px cho các chi tiết nhỏ bên trong card).

### 2. Cấu trúc Lưới cơ bản (12-Column Grid)
Toàn bộ trang ứng dụng được chia thành 12 cột linh hoạt.

*   **Desktop (>= 1024px):** Lưới 12 cột. Gutter (Khoảng cách giữa các cột) = 24px. Margin (Khoảng cách lề hai bên) = Tự động ở giữa hoặc 32px. Max-width cho content thường là 1280px hoặc 1440px.
*   **Tablet (>= 768px):** Lưới 8 cột. Gutter = 16px. Margin = 24px.
*   **Mobile (< 768px):** Lưới 4 cột. Gutter = 16px. Margin = 16px.

### 3. Layout Patterns (Mô hình bố cục chính)

#### Dashboard Pattern (Bảng điều khiển)
*   **Cấu trúc:** Sidebar bên trái (Navigation - Rộng 240px cố định), Top bar (Header & Search - Cao 64px), Main Content Area (Nội dung chính).
*   **Đặc điểm:** Tận dụng tối đa không gian ngang, phù hợp cho màn hình Dashboard tổng quan sức khỏe thiết bị.

#### Focus Pattern (Quét / Phân tích chi tiết)
*   **Cấu trúc:** Bố cục trung tâm (Center-aligned), content tập trung vào một cột giữa (Max width 800px).
*   **Mục đích:** Dành cho trang nhập link để AI quét, hoặc đọc báo cáo giải thích chi tiết của một vụ lừa đảo. Người dùng không bị phân tâm bởi các menu phụ.

#### Split-Screen Pattern (Chia đôi màn hình)
*   **Cấu trúc:** Màn hình chia 50/50.
*   **Mục đích:** Một bên là giao diện thực tế của website nghi ngờ lừa đảo, một bên là Panel giải thích của AI (Gemini chỉ ra các điểm bất thường bằng các thẻ Card).

### 4. Quy tắc phân vùng nội dung
*   **Vùng Nóng (Red Zone):** Dành riêng cho các cảnh báo rủi ro cực cao, đặt ngay đầu trang (Top banner) hoặc ngay cạnh đối tượng bị nghi ngờ (Inline alert).
*   **Vùng Thông tin (Data Zone):** Chứa các lưới dữ liệu (Data grids), danh sách, sử dụng font monospace và đường kẻ phân chia mờ `var(--color-surface-300)` để duy trì trật tự.

## Checklist
- [x] Xác định hệ thống cơ sở Grid 8pt.
- [x] Định nghĩa lưới phản hồi (Responsive Grid 12-8-4).
- [x] Liệt kê 3 Layout patterns chính (Dashboard, Focus, Split-screen).

## Tài liệu liên quan
- [Design Tokens](DesignTokens.md)
- [Component Library](ComponentLibrary.md)

## Việc cần làm tiếp
- Tạo các Grid layout guides trong file thiết kế Figma.
- Xây dựng component `Container`, `Row`, `Col` chuẩn trong mã nguồn dự án.
