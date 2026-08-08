# Live Demo Execution Checklist

## Mục tiêu
Đảm bảo phần trình diễn trực tiếp (Live Demo) của "Internet Immune System" tại cuộc thi AI Riser Vietnam diễn ra hoàn hảo, không gặp sự cố kỹ thuật, và phô diễn được tối đa sức mạnh của hệ thống.

## Nội dung chính
Danh sách các bước chuẩn bị, thiết lập môi trường và kịch bản dự phòng cho buổi Demo. "Fail to prepare is prepare to fail".

## Checklist

### 1. Chuẩn bị Môi trường Demo (Trước sự kiện)
- [ ] **Tài khoản Demo:** Tạo riêng 1 tài khoản sạch (Clean Account) chỉ dùng cho demo, dữ liệu mẫu đầy đủ và hiển thị đẹp mắt trên Dashboard.
- [ ] **Mạng & Kết nối:** 
  - Kiểm tra kết nối mạng tại địa điểm thi.
  - Chuẩn bị thiết bị phát 4G/5G dự phòng với gói cước tốc độ cao.
- [ ] **Trình duyệt & Extension:**
  - Sử dụng profile Chrome sạch (không có các extension chặn quảng cáo hay extension khác gây xung đột).
  - Cài đặt bản Extension ổn định nhất (khóa phiên bản, không tự động cập nhật).
- [ ] **Dữ liệu mồi (Seed Data):**
  - Chuẩn bị sẵn 3 link thật để demo: 1 link an toàn, 1 link lừa đảo rõ ràng, 1 link lừa đảo tinh vi (để khoe sức mạnh của AI/Gemini).

### 2. Thiết bị & Hiển thị
- [ ] **Màn hình:** Kiểm tra tỷ lệ màn hình máy chiếu (16:9 hoặc 4:3), đảm bảo UI hiển thị không bị vỡ. Tăng kích thước font chữ (Zoom 125%) nếu cần.
- [ ] **Âm thanh (Nếu có video/cảnh báo):** Kiểm tra cáp HDMI và đầu ra âm thanh.
- [ ] **Chế độ không làm phiền (Do Not Disturb):** Bật chế độ "Focus/DND" trên laptop, tắt các ứng dụng chat (Slack, Zalo, Telegram) để tránh thông báo nhảy lên màn hình.

### 3. Kịch bản dự phòng (Plan B)
- [ ] **Video Backup:** Đã quay sẵn một video demo chất lượng cao, có thuyết minh hoặc phụ đề, phòng trường hợp mạng sập hoàn toàn.
- [ ] **Local Environment:** Chạy một phiên bản backend và frontend ở localhost (nếu khả thi) để phòng ngừa đứt cáp quang hoặc server ngỏm.
- [ ] **Nút "Magic":** Tính năng demo bypass (bỏ qua thời gian chờ API thật nếu API quá chậm).

### 4. Thực thi Demo (Trong sự kiện)
- [ ] Khởi động lại trình duyệt trước khi lên sân khấu.
- [ ] Clear cache (nếu cần thiết để bắt đầu luồng mới).
- [ ] Nói theo nhịp độ các hành động trên màn hình, giải thích rõ AI đang làm gì ở hậu trường ("Ở bước này, Gemini AI đang phân tích DOM của trang web...").

## Tài liệu liên quan
- [Pitch Deck Script](../01_Overview/PitchDeckScript.md)
- [AI Riser Criteria](../23_Checklist/JudgeChecklist.md)

## Việc cần làm tiếp
- Diễn tập toàn bộ kịch bản demo 5 lần với bấm giờ (khớp với thời gian pitch).
- Chọn người bấm slide/chuột và người thuyết trình phối hợp nhịp nhàng.
