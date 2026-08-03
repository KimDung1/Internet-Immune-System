# Comprehensive PR Reviewer Checklist

## Mục tiêu
Đảm bảo mã nguồn của "Internet Immune System" luôn đạt chất lượng cao nhất, tuân thủ các tiêu chuẩn về kiến trúc, bảo mật, hiệu năng và dễ bảo trì trước khi được merge vào nhánh chính.

## Nội dung chính
Cung cấp hướng dẫn chi tiết cho người đánh giá (Reviewer) khi kiểm tra các Pull Request (PR). Checklist bao gồm kiểm tra Code Quality, Security, Performance, Accessibility, và Tests.

## Checklist

### 1. Code Quality & Architecture
- [ ] **Clean Code:** Code có dễ đọc, dễ hiểu không? Việc đặt tên biến, hàm, class có rõ ràng và mang tính mô tả không?
- [ ] **Single Responsibility:** Các hàm và class có đảm nhiệm một nhiệm vụ duy nhất không?
- [ ] **No Magic Numbers/Strings:** Các giá trị hằng số đã được chuyển ra file config hoặc constants chưa?
- [ ] **DRY (Don't Repeat Yourself):** Không có code lặp lại. Các logic dùng chung đã được extract ra utilities chưa?
- [ ] **Error Handling:** Đã xử lý các trường hợp ngoại lệ (exceptions, API failures) hợp lý chưa? Có trả về thông báo lỗi thân thiện cho user không?

### 2. Security (Bảo mật)
- [ ] **No Secrets in Code:** Tuyệt đối không hardcode API keys, passwords, hoặc tokens trong code.
- [ ] **Data Sanitization:** Input từ người dùng đã được validate và sanitize để phòng tránh XSS, SQL/NoSQL Injection chưa?
- [ ] **Authentication/Authorization:** Các endpoint nhạy cảm đã được bảo vệ đúng cách bằng middleware kiểm tra quyền hạn chưa?

### 3. Performance (Hiệu suất)
- [ ] **Optimal Queries:** Truy vấn database (Firestore) đã được tối ưu chưa? Có tránh các truy vấn N+1 không?
- [ ] **Memory Leaks:** Có nguy cơ rò rỉ bộ nhớ (ví dụ: không clear event listeners trong React, unclosed connections) không?
- [ ] **Bundle Size:** PR có đưa thêm thư viện ngoài (dependencies) quá nặng không? Có lazy load các module lớn chưa?

### 4. Accessibility (Trợ năng) & UI/UX
- [ ] **Semantic HTML:** Sử dụng đúng các thẻ HTML5 (nav, main, section, button vs a).
- [ ] **ARIA Tributes:** Các thành phần UI phức tạp đã có thuộc tính ARIA cần thiết chưa?
- [ ] **Responsive Design:** Giao diện hiển thị tốt trên các thiết bị Mobile, Tablet, Desktop chưa? (Kiểm tra CSS).

### 5. Testing
- [ ] **Unit Tests:** Các hàm logic chính đã có unit test bao phủ (Coverage >= 80%) chưa?
- [ ] **Integration/E2E Tests:** Các luồng nghiệp vụ quan trọng bị thay đổi đã được cập nhật test chưa?
- [ ] **Test Passing:** Tất cả các test trong CI pipeline đều xanh (passed).

## Tài liệu liên quan
- [Coding Standards](../31_Standards/CodingStandards.md)
- [Security Guidelines](../40_Security/SecurityGuidelines.md)

## Việc cần làm tiếp
- Tích hợp SonarQube vào pipeline PR để tự động đánh giá Code Quality.
- Tạo GitHub PR template chứa checklist này.
