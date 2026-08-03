# Các Kịch Bản Demo (Demo Scenarios)

## Mục tiêu
Chi tiết hóa 3 kịch bản lừa đảo phổ biến tại Việt Nam để sử dụng trong bản demo, chứng minh khả năng Detect và Simulate của hệ thống.

## Nội dung chính

### Scenario 1: Phishing Tấn công Ngân hàng (Dùng cho Main Demo)
- **Kịch bản:** Người dùng nhận được tin nhắn SMS Brandname giả mạo (V1ETCOMBANK) thông báo khóa tài khoản.
- **Detect:** Hệ thống nhận diện URL bất thường, SSL chứng chỉ không hợp lệ, phân tích hình ảnh trang web giả giống 99% thật.
- **Simulate:** Mô phỏng quá trình mất thông tin đăng nhập, bị đánh cắp OTP, và trình diễn quá trình chuyển tiền đi (mô phỏng).
- **Explain:** Gemini phân tích cú pháp SMS "Tài khoản của bạn đã bị khóa...", chỉ ra sự vô lý và domain name sai lệch.

### Scenario 2: Đầu tư tài chính siêu lợi nhuận (Crypto/Forex Scam)
- **Kịch bản:** Tham gia nhóm Telegram, được mời tải app "Sàn Giao Dịch Quốc Tế" với cam kết lợi nhuận 50%/tháng.
- **Detect:** Hệ thống quét APK/URL tải app, nhận diện pattern mã độc, kiểm tra độ tin cậy của domain sàn.
- **Simulate:** Mô phỏng quá trình nạp tiền thật vào, thấy số dư tăng ảo trên app, nhưng khi yêu cầu rút tiền (Withdraw), hệ thống mô phỏng thông báo "Bắt buộc nạp thêm 20% phí xác minh".
- **Explain:** AI phân tích mô hình Ponzi/Lừa đảo, giải thích rủi ro từ việc cấp quyền cho app không rõ nguồn gốc.

### Scenario 3: Lừa đảo tình cảm (Romance Scam)
- **Kịch bản:** Chat với một "chuyên gia tài chính nước ngoài" trên ứng dụng hẹn hò, dẫn dụ tải ứng dụng hoặc truy cập link mua quà.
- **Detect:** Phân tích ngữ cảnh hội thoại (cần quyền Accessibility hoặc phân tích ảnh chụp màn hình được người dùng chủ động share), nhận diện pattern ngôn ngữ lừa đảo lãng mạn.
- **Simulate:** Mô phỏng kịch bản kẻ lừa đảo yêu cầu chuyển tiền làm thủ tục nhận quà từ nước ngoài.
- **Explain:** AI chỉ ra các "cờ đỏ" (red flags) trong phong cách nói chuyện và timeline quen biết.

## Checklist
- [ ] Chuẩn bị mockup cho trang web phishing ngân hàng.
- [ ] Chuẩn bị mockup cho nhóm chat Telegram giả mạo.
- [ ] Đảm bảo kịch bản số 1 hoàn hảo để lên sóng.

## Tài liệu liên quan
- [DemoScript.md](file:///e:/PJ/docs/19_Demo/DemoScript.md)

## Việc cần làm tiếp
- Xây dựng dummy endpoints để mô phỏng tương tác mạng.
