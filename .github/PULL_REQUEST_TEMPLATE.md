# Pull Request Template

## Mục tiêu
Đảm bảo mọi thay đổi mã nguồn (Pull Request) được áp dụng vào Internet Immune System đều đạt tiêu chuẩn chất lượng cao, an toàn, có tài liệu rõ ràng và đã được kiểm thử đầy đủ (DoD - Definition of Done).

## Nội dung chính

### Mô tả thay đổi (Description)
- PR này giải quyết vấn đề gì? Liên kết tới Issue liên quan.
- Tóm tắt các thay đổi kiến trúc/code quan trọng.
- **Issue liên quan:** Đóng #<issue_number>

### Loại thay đổi (Type of change)
- [ ] 🐛 Bug fix (sửa lỗi không phá vỡ tính tương thích)
- [ ] ✨ New feature (tính năng mới không phá vỡ tính tương thích)
- [ ] 💥 Breaking change (sửa đổi hoặc tính năng có thể gây ảnh hưởng đến chức năng hiện tại)
- [ ] 📝 Documentation update (chỉ cập nhật tài liệu)
- [ ] ♻️ Refactor (tái cấu trúc code, tối ưu hiệu suất)

### Hướng dẫn kiểm thử (How to Test)
Mô tả chi tiết các bước để người review có thể chạy thử mã của bạn.
1. Khởi động môi trường (vd: `pnpm dev:ext`)
2. Đi tới...
3. Thực hiện...
4. Kết quả mong đợi...

## Checklist Definition of Done (DoD)
- [ ] Tôi đã tự review code của chính mình nghiệm túc.
- [ ] Code tuân thủ đầy đủ các tiêu chuẩn kỹ thuật (`CodingConventions.md`, `TypeScriptStyleGuide.md`).
- [ ] **Bảo mật**: Các thay đổi không lộ lọt API Key, thông tin nhạy cảm, và đã xử lý sanitize dữ liệu đầu vào.
- [ ] **Test Coverage**: PR bổ sung hoặc cập nhật các Unit/Integration Tests. Coverage không bị giảm.
- [ ] **Tài liệu**: Các file docs liên quan đã được cập nhật (Swagger/OpenAPI, README, Engineering Standards).
- [ ] Cảnh báo CI/CD (Lint, Type check, SonarQube) đều báo xanh.

## Tài liệu liên quan
- [Code Review Checklist](../docs/26_Engineering_Standards/CodeReviewChecklist.md)
- [Coding Conventions](../docs/26_Engineering_Standards/CodingConventions.md)

## Việc cần làm tiếp
- Phân công ít nhất 1 người (reviewer) để đánh giá PR này.
- Chỉnh sửa code theo các góp ý trong quá trình review.
