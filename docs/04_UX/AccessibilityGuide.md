# Hướng dẫn Trợ năng (Accessibility Guide)

## Mục tiêu
Đảm bảo Internet Immune System tuân thủ tiêu chuẩn Web Content Accessibility Guidelines (WCAG) 2.1 Mức AA. Một hệ miễn dịch số phải bảo vệ tất cả mọi người, đặc biệt là nhóm người dùng yếu thế (người cao tuổi, người có khiếm khuyết thị lực/thính lực).

## Nội dung chính

### 1. Độ tương phản (Contrast)
* **Văn bản thông thường:** Tỉ lệ tương phản giữa văn bản và nền phải đạt tối thiểu **4.5:1**.
* **Văn bản lớn & Thành phần UI (Nút, Icon):** Tỉ lệ tương phản tối thiểu là **3:1**.
* *Đặc biệt lưu ý:* Các trạng thái cảnh báo (Đỏ/Cam) trong "Immune Response" phải được điều chỉnh để không gây chói hoặc mất chữ cho người mù màu (Color Blindness).

### 2. Sử dụng Màu sắc & Ký hiệu (Color & Signifiers)
* **Không chỉ dùng màu sắc để truyền đạt thông tin.**
  * *Sai:* Chỉ viền ô nhập liệu màu đỏ khi phát hiện URL độc hại.
  * *Đúng:* Viền ô màu đỏ + Xuất hiện icon (X) + Dòng text "Cảnh báo: URL chứa mã độc".
* Cung cấp các họa tiết hoặc biểu tượng đi kèm ở chế độ Simulate để phân biệt giữa "Hành động an toàn" và "Rủi ro".

### 3. Đọc màn hình & Điều hướng bàn phím (Screen Readers & Keyboard Nav)
* Đảm bảo thứ tự tab (Tab order) hợp lý: Từ trên xuống dưới, trái sang phải.
* **Focus State:** Trạng thái focus của bàn phím phải hiển thị rõ ràng (ví dụ: viền highlight 2px).
* Cung cấp thẻ `aria-label` và `alt text` cho mọi thành phần hình ảnh, đặc biệt là các hình ảnh mô phỏng "Kháng thể" và sơ đồ "Consequence Theater".

### 4. Nội dung Động & Thời gian (Dynamic Content & Timing)
* **AI Typewriter Effect:** Hiệu ứng gõ chữ của AI (Explain mode) có thể gây phiền cho người dùng dùng Screen Reader. Phải cung cấp nút "Hiển thị toàn bộ" (Show all text) hoặc cho phép Screen Reader đọc đoạn text hoàn chỉnh ở backend.
* **Thời gian phản hồi:** Pop-up cảnh báo lừa đảo không được tự động biến mất quá nhanh. Yêu cầu người dùng phải chủ động tắt hoặc cho phép cài đặt thời gian timeout dài hơn.

### 5. An toàn Cảm giác (Sensory Safety)
* **Tránh chớp nháy mạnh:** Hiệu ứng "AI pulse" hoặc "Immune Response" phải được kiểm soát tần số chớp (không quá 3 lần/giây) để tránh gây co giật cho người bị chứng động kinh (Photosensitive Epilepsy).
* Cung cấp nút gạt "Giảm chuyển động" (Reduce Motion) trong phần Cài đặt.

## Checklist
- [x] Kiểm tra độ tương phản màu (Contrast ratio > 4.5:1).
- [x] Không phụ thuộc hoàn toàn vào màu sắc.
- [x] Hỗ trợ điều hướng bằng bàn phím và Screen Reader.
- [x] Cảnh báo chớp nháy < 3 lần/giây.
- [x] Có tùy chọn "Giảm chuyển động".

## Tài liệu liên quan
- `04_UX/UXStrategy.md`
- `05_UI/UISpecs.md`

## Việc cần làm tiếp
- Chạy công cụ kiểm tra Accessibility (như Lighthouse, axe DevTools) trên bản Prototype/Bản dựng web.
- Tích hợp tài liệu này vào quy trình QA/Testing.
