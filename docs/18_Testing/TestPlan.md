# Test Plan (MVP cho AI Riser Vietnam)

## Mục tiêu
Xác định kế hoạch kiểm thử cụ thể cho phiên bản Minimum Viable Product (MVP) của Internet Immune System, tập trung vào những tính năng cốt lõi cần phải hoàn hảo để trình diễn (demo) tại sự kiện AI Riser Vietnam.

## Nội dung chính

### 1. Phạm vi kiểm thử (In-Scope)
- **Tính năng Cốt lõi**:
  - Giao tiếp giữa trình duyệt web (Extension) và Backend qua API.
  - Phân tích và phát hiện trang web lừa đảo theo thời gian thực (Real-time Scanning).
  - Phân tích Email nghi ngờ lừa đảo.
  - Tính năng tạo mô phỏng hậu quả ("Nếu tôi click thì sao?").
- **Hạ tầng cơ sở**:
  - Đăng nhập/Đăng ký qua Firebase Auth.
  - Ghi nhận lịch sử phân tích vào Firestore.
  - Tốc độ phản hồi (Latency) của API.

### 2. Kịch bản kiểm thử (Test Scenarios) cho Demo
**Kịch bản 1: Phishing Website**
- **Action**: User vào một trang web giả mạo giao diện ngân hàng VCB.
- **Expected**: Extension popup hiện lên cảnh báo màu đỏ trong vòng < 3 giây. Nội dung giải thích từ AI chỉ ra chính xác yếu tố bất thường (URL sai, không có chứng chỉ bảo mật hợp lệ).

**Kịch bản 2: Scam Email**
- **Action**: User bôi đen đoạn email báo trúng thưởng và chọn "Phân tích".
- **Expected**: Hệ thống đánh dấu đây là lừa đảo (Scam). Đưa ra các đặc điểm (yêu cầu chuyển tiền trước, tính khẩn cấp giả tạo).

**Kịch bản 3: Mô phỏng Hậu quả (Consequence Simulation)**
- **Action**: User ấn vào "Mô phỏng".
- **Expected**: AI tạo ra một cốt truyện ngắn, cảnh báo số tiền trong tài khoản sẽ bị trừ và thông tin cá nhân bị đánh cắp, trình bày dạng text thân thiện.

### 3. Phương pháp thực hiện & Công cụ
- **Unit Testing (Jest, Pytest)**: Viết test cho các hàm tiện ích bóc tách text từ HTML, hàm tạo JWT.
- **E2E Testing (Playwright)**: Sử dụng Playwright để nạp Web Extension vào instance của Chromium, tự động điều hướng tới trang web giả mạo và bắt xem extension có hiển thị popup cảnh báo không. (Vô cùng quan trọng để đảm bảo UX không bị vỡ).
- **Manual Exploratory Testing**: Đội phát triển trực tiếp dùng thử hệ thống như một người dùng thông thường trong 3 ngày trước sự kiện để tìm bug edge-cases.

### 4. Môi trường kiểm thử
- Sử dụng môi trường `iis-staging`.
- Không sử dụng dữ liệu thẻ tín dụng hoặc mật khẩu thật. Sử dụng bộ dữ liệu mock đã được chuẩn bị sẵn (ví dụ các phishing URLs từ thư viện PhishTank).

## Checklist
- [x] Lên kịch bản Demo chính.
- [ ] Chuẩn bị bộ dữ liệu test (danh sách 50 URL an toàn, 50 URL lừa đảo).
- [ ] Viết automation script Playwright giả lập quá trình lướt web.
- [ ] Phân công nhân sự thực hiện Manual Testing.

## Tài liệu liên quan
- [TestStrategy.md](./TestStrategy.md)
- [UserAcceptanceTesting.md](./UserAcceptanceTesting.md)

## Việc cần làm tiếp
- Chạy thử toàn bộ kịch bản E2E trên hệ thống CI để đảm bảo tính ổn định.
- Thực hiện diễn tập "Dry Run" buổi Demo AI Riser Vietnam để đo thời gian phản hồi thực tế của toàn hệ thống.
