# Master Definition of Done (DoD)

## Mục tiêu
Định nghĩa bộ tiêu chuẩn "Hoàn thành" (Definition of Done) áp dụng cho mọi nhiệm vụ trong dự án Internet Immune System. Đảm bảo mọi tính năng, bản sửa lỗi hay hạ tầng khi được đánh dấu là "Done" đều đạt chất lượng cao nhất (production-grade), sẵn sàng phát hành mà không gây ra nợ kỹ thuật (technical debt).

## Nội dung chính

### 1. DoD cho User Stories / Features (Tính năng mới)
Một tính năng chỉ được coi là "Done" khi thỏa mãn TẤT CẢ các điều kiện sau:
- [ ] **Mã nguồn (Code)**: Đã được push, tạo PR, và pass qua quá trình Code Review (ít nhất 1 Approval).
- [ ] **Kiểm thử (Testing)**:
  - Unit tests đã được viết và qua ngưỡng coverage (VD: > 80%).
  - E2E / Integration tests cho happy path đã được pass.
- [ ] **Kiểm tra chất lượng (QA)**: QA hoặc một người khác không phải tác giả đoạn code đã test thành công trên môi trường Staging.
- [ ] **Tài liệu (Documentation)**: API Docs (Swagger/Postman), Readme hoặc nội dung hướng dẫn đã được cập nhật.
- [ ] **Thiết kế & UI/UX**: Đáp ứng pixel-perfect với thiết kế Figma, hoạt động tốt trên các độ phân giải màn hình khác nhau và các browser mục tiêu (Chrome, Edge).
- [ ] **Feature Flags**: Tính năng đã được wrap trong hệ thống Feature Flag (nếu có rủi ro cao).
- [ ] **Analytics/Telemetry**: Các sự kiện tracking cần thiết (VD: click_phishing_warning) đã được gắn vào code.

### 2. DoD cho Bug Fixes (Bản sửa lỗi)
- [ ] Căn nguyên vấn đề (Root cause) đã được xác định và ghi chú vào ticket.
- [ ] Lỗi đã được fix thành công.
- [ ] **Test bổ sung**: Đã viết Unit Test/Integration Test mô phỏng lại đúng lỗi đó để đảm bảo không bị regression trong tương lai.
- [ ] Đã pass QA verification trên Staging.

### 3. DoD cho Infrastructure / DevOps tasks (Công việc hạ tầng)
- [ ] IaC (Infrastructure as Code) - Terraform/Pulumi (nếu có) đã được review và apply thành công.
- [ ] Tài liệu hệ thống, sơ đồ kiến trúc (Architecture Diagram) đã được cập nhật.
- [ ] Monitoring và Alerting (Cảnh báo lỗi, CPU/Memory spikes) đã được thiết lập cho thành phần hạ tầng mới.
- [ ] Pass các bài kiểm tra bảo mật nội bộ (không rò rỉ keys, mở port trái phép).

## Checklist
- [ ] In và gắn DoD vào mô tả tự động (Template) của PR trên GitHub.
- [ ] Team cam kết không đóng Ticket nếu chưa hoàn thành 100% các tiêu chí DoD tương ứng.

## Tài liệu liên quan
- [Sprint Process](SprintProcess.md)
- [Definition of Ready](DefinitionOfReady.md)

## Việc cần làm tiếp
- Tích hợp GitHub Actions để tự động check một số phần của DoD (VD: Test coverage, Linter) trực tiếp trên PR.
