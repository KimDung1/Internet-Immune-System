# UX Audit Checklist

## Mục tiêu
Đảm bảo "Internet Immune System" mang lại Trải nghiệm Người dùng (UX) xuất sắc, mượt mà, trực quan và tạo cảm giác an toàn, tin cậy – phù hợp với một sản phẩm bảo mật và AI.

## Nội dung chính
Danh sách kiểm tra các khía cạnh về tương tác vi mô (micro-interactions), chế độ sáng/tối (Dark/Light mode), tính đáp ứng (responsiveness) và phản hồi hệ thống.

## Checklist

### 1. Tương tác vi mô (Micro-interactions)
- [ ] **Loading States:** Có skeleton screens hoặc spinner khi đang xử lý phân tích AI (đặc biệt khi chờ Gemini API). Không để màn hình trống tĩnh.
- [ ] **Hover/Active States:** Mọi nút bấm và liên kết đều có phản hồi thị giác khi hover hoặc nhấn.
- [ ] **Transitions:** Các chuyển động (animation) mượt mà, thời gian < 300ms, không gây rối mắt.

### 2. Chế độ hiển thị (Dark Mode / Light Mode)
- [ ] **Hỗ trợ System Preference:** Tự động nhận diện và áp dụng chế độ theo hệ điều hành của người dùng.
- [ ] **Khả năng chuyển đổi:** Có nút chuyển đổi rõ ràng trên UI.
- [ ] **Bảng màu đồng nhất:** Màu sắc cảnh báo (Đỏ/Vàng/Xanh) hiển thị rõ ràng và giữ nguyên sắc thái trên cả hai chế độ.

### 3. Tính Đáp ứng (Mobile Responsiveness)
- [ ] **Mobile-First:** Bố cục không bị vỡ trên các thiết bị màn hình nhỏ (từ 320px).
- [ ] **Touch Targets:** Kích thước vùng nhấn cho các phần tử tương tác trên thiết bị di động tối thiểu là 44x44px.
- [ ] **Sidebar/Navigation:** Menu điều hướng thích ứng tốt (ví dụ: chuyển sang hamburger menu trên mobile).

### 4. Phản hồi và Xử lý Lỗi (Error Feedback & Messaging)
- [ ] **Empty States:** Khi không có dữ liệu (chưa có lịch sử quét), màn hình trống có hình minh họa và hướng dẫn hành động (Call to Action) rõ ràng.
- [ ] **Clear Error Messages:** Thông báo lỗi dễ hiểu, giải thích vấn đề bằng ngôn ngữ của người dùng (không show mã lỗi kỹ thuật như `Error 500` mà không giải thích).
- [ ] **Thành công (Success States):** Thông báo (Toast/Snackbar) xuất hiện khi người dùng thực hiện hành động thành công (ví dụ: "Đã thêm vào danh sách an toàn").

### 5. Đặc thù Trải nghiệm AI
- [ ] **AI Explanation:** Giải thích của AI về lý do một trang web là lừa đảo được trình bày rõ ràng, phân cấp thông tin (Tóm tắt -> Chi tiết).
- [ ] **Confidence Score:** Hiển thị rõ mức độ tự tin của AI (Ví dụ: "95% khả năng là lừa đảo") bằng thanh tiến trình trực quan.

## Tài liệu liên quan
- [Design System & UI Kit](../20_Design/DesignSystem.md)
- [User Journey Maps](../05_Product/UserJourneys.md)

## Việc cần làm tiếp
- Tổ chức phiên kiểm thử tính khả dụng (Usability Testing) với 5 người dùng ngẫu nhiên trước khi ra mắt Beta.
- Cải thiện các animation liên quan đến biểu tượng "Immune System".
