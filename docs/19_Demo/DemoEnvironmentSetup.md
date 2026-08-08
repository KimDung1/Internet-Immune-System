# Thiết lập Môi trường Demo (Demo Environment Setup)

## Mục tiêu
Hướng dẫn thiết lập môi trường kỹ thuật ổn định, không phụ thuộc vào các yếu tố ngoại cảnh khó lường để đảm bảo buổi demo diễn ra trơn tru.

## Nội dung chính
- **Mạng (Network):** 
  - Không dùng Wi-Fi sự kiện.
  - Sử dụng cục phát 4G/5G cá nhân (router riêng).
  - Có phương án kết nối cáp mạng (Ethernet) nếu được ban tổ chức cho phép.
- **Mock Data & Dummy Sites:**
  - Cấu hình file `hosts` để điều hướng các domain lừa đảo mẫu (ví dụ: vietcombank-login.com) về localhost đang chạy server giả lập phishing.
  - Sử dụng Docker container cho các backend service (Firebase Emulator, Cloud Run local).
- **Thiết bị:**
  - Máy tính chính (Laptop 1) chạy demo trực tiếp.
  - Điện thoại kết nối phản chiếu màn hình (Screen Mirroring) thông qua cáp (hạn chế cast không dây).
- **Gemini API:**
  - Chuẩn bị ít nhất 2 API Keys khác nhau để dự phòng rate limit.
  - Thiết lập timeout ngắn và fallback sang cache response nếu mạng chậm.

## Checklist
- [ ] Mua gói cước 4G tốc độ cao và test tốc độ tại địa điểm thi đấu (nếu có thể).
- [ ] Khởi chạy toàn bộ hệ thống bằng 1 script duy nhất (`start_demo.sh`).
- [ ] Test screen mirroring qua cáp USB.

## Tài liệu liên quan
- [DemoFallbackPlan.md](file:///e:/PJ/docs/19_Demo/DemoFallbackPlan.md)

## Việc cần làm tiếp
- Viết script tự động setup file `hosts` và gỡ bỏ sau demo.
