# Test Strategy

## Mục tiêu
Định hình phương pháp luận kiểm thử toàn diện cho Internet Immune System theo mô hình Kim tự tháp kiểm thử (Testing Pyramid). Đặc biệt, tích hợp thêm lớp "AI Behavior Testing" để đảm bảo tính chính xác và an toàn của module phát hiện lừa đảo bằng Gemini AI, chuẩn bị kỹ lưỡng cho buổi demo AI Riser Vietnam.

## Nội dung chính

### 1. Kim tự tháp kiểm thử (Testing Pyramid)
Chiến lược sử dụng cách tiếp cận từ dưới lên, số lượng test cases giảm dần nhưng độ phức tạp và độ bao phủ tăng lên:
- **Unit Tests (Cấp thấp nhất, số lượng lớn nhất)**:
  - Kiểm thử các logic hàm, modules nhỏ nhất biệt lập. Ví dụ: hàm bóc tách URL, hàm format chuỗi JSON, utility functions.
  - Yêu cầu độ bao phủ (Coverage) >= 80%.
- **Integration Tests (Cấp trung)**:
  - Kiểm thử giao tiếp giữa các modules. Ví dụ: API backend có gọi được và lấy đúng dữ liệu từ Firebase Emulator không? Cấu hình router có hoạt động đúng chuẩn HTTP không?
- **End-to-End (E2E) Tests (Cấp cao nhất, số lượng ít)**:
  - Mô phỏng hành vi của người dùng trên Extension (Chrome) tương tác với toàn bộ hệ thống (Frontend -> Backend -> DB).
- **AI Behavior Testing (Lớp đặc thù)**:
  - Đánh giá chất lượng của mô hình LLM. Kiểm tra xem với các prompt đầu vào (emails lừa đảo, phishing URLs), hệ thống AI có phân loại chính xác và đưa ra lời giải thích hợp lý hay không.

### 2. Các công cụ sử dụng
- **Backend (Python/FastAPI)**: Sử dụng `pytest` kết hợp `pytest-asyncio` và `pytest-mock`.
- **Frontend/Extension (Node.js/React/Vanilla)**: Sử dụng `Jest` cho logic và `Playwright` hoặc `Puppeteer` cho tự động hóa trình duyệt (E2E testing với extension).
- **AI Testing**: Script Python custom kết hợp bộ datasets chuẩn để đo lường độ chính xác (Precision/Recall).

### 3. Tích hợp liên tục
Mọi test sẽ được chạy tự động trên hệ thống CI/CD (GitHub Actions). Bất kỳ đoạn mã nào không vượt qua Unit và Integration test sẽ bị block, không cho phép gộp (merge) vào nhánh chính.

### 4. Triết lý Shift-Left
Mang quá trình kiểm thử dịch chuyển sang giai đoạn sớm nhất của phát triển phần mềm. 
- Lập trình viên phải tự viết Unit Tests cùng lúc với việc viết tính năng mới (TDD - Test Driven Development khuyến nghị).
- Chạy công cụ phân tích mã tĩnh (Static Analysis: SonarQube, Ruff) trước khi test.

## Checklist
- [x] Xác định các cấp độ kiểm thử.
- [ ] Chọn và cài đặt stack công cụ (Pytest, Jest, Playwright).
- [ ] Thiết lập quy định Code Coverage > 80% trong CI.
- [ ] Viết kịch bản khung (Mocking framework) để giả lập Gemini API trong Integration test nhằm tiết kiệm chi phí.

## Tài liệu liên quan
- [TestPlan.md](./TestPlan.md)
- [FraudDetectionAccuracy.md](./FraudDetectionAccuracy.md)
- [CICD.md](../17_DevOps/CICD.md)

## Việc cần làm tiếp
- Khởi tạo thư mục `tests/` cấu trúc chuẩn cho dự án Backend và Extension.
- Viết Unit Tests đầu tiên cho module URL Parsing.
