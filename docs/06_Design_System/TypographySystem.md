# Typography System

## Mục tiêu
Hệ thống kiểu chữ (Typography) của Internet Immune System cần truyền tải sự chuyên nghiệp, chính xác (medical/clinical) nhưng phải hiện đại, công nghệ (cyberpunk/AI). Đặc biệt, font chữ phải hỗ trợ tiếng Việt (có dấu) hoàn hảo mà không bị lỗi hiển thị.

## Nội dung chính

### 1. Lựa chọn Font chữ (Font Families)
*   **Primary Font (UI & Body Text): `Inter`**
    *   *Đặc điểm:* Sans-serif hiện đại, độ nét cao (highly legible) trên màn hình số, tỷ lệ x-height lớn giúp đọc dễ dàng ở kích thước nhỏ. Hỗ trợ tiếng Việt xuất sắc.
    *   *Vai trò:* Dùng cho 90% giao diện (Nội dung bài viết, Text trong Component, Input, Tooltip).
*   **Display / Monospace Font (Numbers, Code, Stats): `JetBrains Mono` hoặc `Roboto Mono`**
    *   *Đặc điểm:* Font đơn cách (monospace), tạo cảm giác dòng lệnh (terminal), dữ liệu thô, giống góc nhìn của JARVIS.
    *   *Vai trò:* Dùng để hiển thị ID giao dịch, mã độc (hash), IP address, con số phân tích tỷ lệ %, dòng code mẫu.

### 2. Typography Hierarchy (Phân cấp)

| Cấp độ | Kích thước (Size) | Độ đậm (Weight) | Chiều cao dòng (Line-height) | Mục đích |
| :--- | :--- | :--- | :--- | :--- |
| **Display 1** | 48px / 3rem | Bold (700) | 1.1 | Tiêu đề lớn (Hero section) |
| **Heading 1 (H1)** | 36px / 2.25rem | Semi-Bold (600)| 1.2 | Tiêu đề trang chính |
| **Heading 2 (H2)** | 30px / 1.875rem | Semi-Bold (600)| 1.25 | Tiêu đề section / Module |
| **Heading 3 (H3)** | 24px / 1.5rem | Medium (500) | 1.3 | Tiêu đề Card lớn, Pop-up |
| **Heading 4 (H4)** | 20px / 1.25rem | Medium (500) | 1.4 | Tiêu đề danh mục con |
| **Body Large** | 18px / 1.125rem | Regular (400) | 1.5 | Đoạn văn bản giới thiệu (Lead) |
| **Body Base** | 16px / 1rem | Regular (400) | 1.5 | Nội dung chính, đoạn văn bản |
| **Body Small** | 14px / 0.875rem | Regular (400) | 1.4 | Chú thích, thông tin phụ, Label |
| **Caption / Tiny**| 12px / 0.75rem | Medium (500) | 1.3 | Tooltip, Badge, Timestamp |

### 3. Cân nhắc cho Tiếng Việt (Vietnamese Considerations)
*   **Dấu câu (Diacritics):** Tiếng Việt có các dấu mở rộng cao (như ể, ễ, ặ). Cần duy trì **Line-height tối thiểu 1.4 đến 1.5** cho Body text để các dấu không bị cắt ngang bởi dòng trên/dưới.
*   **Độ dài từ (Word length):** Các cụm từ tiếng Việt có xu hướng dài hơn tiếng Anh khoảng 15-20% về mặt thị giác. UI Component (đặc biệt là Button) cần sử dụng padding động thay vì width cố định.

### 4. Letter Spacing (Khoảng cách chữ)
*   **Headings / Display:** Chữ lớn nên áp dụng `letter-spacing: -0.02em` để các ký tự đứng sát nhau hơn, tạo cảm giác liền mạch, mạnh mẽ.
*   **Body text:** Giữ nguyên `letter-spacing: 0` để dễ đọc.
*   **Uy quyền / Nhãn (Uppercase Text):** Đối với Badge, Tag (ví dụ: PHISHING, SAFE), áp dụng `letter-spacing: 0.05em` để tăng sự chú ý và tính y khoa/công nghệ.

## Checklist
- [x] Xác định Font Primary (Inter) và Font Monospace (JetBrains Mono)
- [x] Lập bảng phân cấp kích thước từ Display đến Caption
- [x] Ghi chú các vấn đề về dấu câu tiếng Việt và line-height
- [x] Quy tắc letter-spacing cho các loại text khác nhau

## Tài liệu liên quan
- [Design Tokens](DesignTokens.md)
- [Brand Identity](../07_Branding/BrandIdentity.md)

## Việc cần làm tiếp
- Tải bộ font chuẩn và nhúng vào dự án Frontend.
- Thiết lập CSS Variables cho Typography trong global stylesheet.
