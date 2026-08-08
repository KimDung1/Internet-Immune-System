# Kế hoạch Dự phòng Demo (Demo Fallback Plan)

## Mục tiêu
Đảm bảo luôn có phương án B, C trong trường hợp xảy ra sự cố kỹ thuật (rớt mạng, sập server, API lỗi) trong lúc thuyết trình.

## Nội dung chính
**Mức độ 1: Trễ mạng nhẹ (Slight Delay)**
- Hệ thống cần hiển thị skeleton loading màn hình chờ có thông điệp vui vẻ ("AI đang phân tích sâu...").
- Người thuyết trình tiếp tục nói về quy trình xử lý của AI để lấp thời gian trống.

**Mức độ 2: API Timeout / Không kết nối được Gemini**
- Hệ thống tự động fallback sử dụng Cache / Pre-generated responses đã được lưu sẵn trong cơ sở dữ liệu local (SQLite/Firebase Local).
- Giao diện không thay đổi, người xem không nhận ra hệ thống đang dùng dữ liệu offline.

**Mức độ 3: Sự cố thiết bị / Không thể kết nối màn hình**
- Bật ngay Video Demo chất lượng cao (đã quay màn hình từ trước, độ dài đúng 2 phút phần thao tác hệ thống).
- Thuyết trình viên lồng tiếng trực tiếp (live dubbing) cho đoạn video đó thay vì thao tác trên máy thật.

## Checklist
- [ ] Quay 3 bản video backup ở các tốc độ/kịch bản khác nhau.
- [ ] Kiểm tra hệ thống tự động fallback khi ngắt kết nối internet (chế độ máy bay).
- [ ] Chép video vào ít nhất 2 USB và 1 máy dự phòng.

## Tài liệu liên quan
- [DemoScript.md](file:///e:/PJ/docs/19_Demo/DemoScript.md)

## Việc cần làm tiếp
- Tích hợp logic fallback vào core engine của ứng dụng demo.
