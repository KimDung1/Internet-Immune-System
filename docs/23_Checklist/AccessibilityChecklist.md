# Accessibility Audit Checklist (WCAG 2.1 AA)

## Mục tiêu
Đảm bảo sản phẩm "Internet Immune System" có thể truy cập và sử dụng được bởi mọi người dùng, bao gồm cả những người khuyết tật. Tuân thủ tiêu chuẩn Web Content Accessibility Guidelines (WCAG) 2.1 mức độ AA.

## Nội dung chính
Danh sách kiểm tra các yếu tố trợ năng quan trọng trên giao diện Web Dashboard và Chrome Extension, đảm bảo tương thích với các trình đọc màn hình và thao tác bằng bàn phím.

## Checklist

### 1. Điều hướng bằng Bàn phím (Keyboard Navigation)
- [ ] **Tab Order:** Thứ tự tab hợp lý, di chuyển từ trên xuống dưới, trái qua phải.
- [ ] **Focus Visible:** Mọi thành phần tương tác (link, button, input) phải có viền báo hiệu rõ ràng khi nhận focus (không được dùng `outline: none` mà không có thay thế).
- [ ] **No Keyboard Traps:** Người dùng có thể dùng bàn phím để di chuyển vào và thoát khỏi mọi thành phần (đặc biệt là modals, popups).

### 2. Hỗ trợ Trình đọc màn hình (Screen Readers)
- [ ] **Alt Text:** Mọi hình ảnh quan trọng đều có thuộc tính `alt` mô tả ý nghĩa. Hình ảnh trang trí có `alt=""`.
- [ ] **ARIA Roles/Labels:** Sử dụng `aria-label`, `aria-expanded`, `aria-hidden` đúng cách cho các thành phần UI phức tạp (ví dụ: nút toggle, menu dropdown).
- [ ] **Semantic Structure:** Sử dụng đúng các thẻ heading (`<h1>` đến `<h6>`) để cấu trúc trang, không bỏ cóc cấp độ heading.

### 3. Màu sắc và Tương phản (Color & Contrast)
- [ ] **Độ tương phản văn bản:** Tỷ lệ tương phản giữa chữ và nền tối thiểu là 4.5:1 (đối với chữ thường) và 3:1 (đối với chữ lớn/đậm).
- [ ] **Không phụ thuộc vào màu sắc:** Thông tin không được truyền đạt chỉ bằng màu sắc (ví dụ: cảnh báo lừa đảo không chỉ hiện màu đỏ mà còn phải có icon cảnh báo và text chữ "Nguy hiểm").

### 4. Tương tác và Cảnh báo
- [ ] **Form Labels:** Mọi input field đều có thẻ `<label>` liên kết (thông qua `id` và `for`).
- [ ] **Thông báo lỗi (Error feedback):** Khi nhập sai form, thông báo lỗi phải rõ ràng và trình đọc màn hình có thể đọc được ngay (sử dụng `aria-live`).
- [ ] **Thời gian (Time limits):** Nếu có chức năng nào bị giới hạn thời gian (session timeout), người dùng có thể kéo dài thời gian.

## Tài liệu liên quan
- [UI/UX Guidelines](../20_Design/UIGuidelines.md)
- [WCAG 2.1 Documentation](https://www.w3.org/TR/WCAG21/)

## Việc cần làm tiếp
- Tích hợp axe-core vào quy trình e2e testing để quét lỗi accessibility tự động.
- Lên lịch kiểm tra thủ công định kỳ với các screen reader phổ biến (NVDA, VoiceOver).
