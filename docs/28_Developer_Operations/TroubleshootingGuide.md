# Troubleshooting Guide

## Mục tiêu
Tài liệu cung cấp các giải pháp nhanh chóng cho những vấn đề thường gặp của developer trong quá trình phát triển dự án Internet Immune System (lỗi build, lỗi emulator, API failures).

## Nội dung chính

### 1. Lỗi Build Extension
**Triệu chứng:** Chrome báo lỗi "Unrecognized manifest key" hoặc "Failed to load extension".
- **Nguyên nhân:** File `manifest.json` không đúng định dạng cho Manifest V3, hoặc thiếu các trường bắt buộc.
- **Cách khắc phục:** 
  - Đảm bảo `"manifest_version": 3`.
  - Nếu thay đổi code không hiển thị, hãy nhấn nút "Refresh" trong `chrome://extensions` hoặc xoá extension rồi cài lại (Load unpacked).
  - Kiểm tra console log của Background Service Worker trong Chrome (Nhấp vào liên kết 'service worker' trên card của extension).

### 2. Lỗi Firebase Emulator không khởi động
**Triệu chứng:** Báo lỗi port in use hoặc báo lỗi liên quan đến Java.
- **Nguyên nhân:** Xung đột cổng mạng (cổng 4000, 8080, 9099...) hoặc chưa cài đặt Java JRE 11+.
- **Cách khắc phục:**
  - Kiểm tra port: `lsof -i :8080` và kill process (`kill -9 <PID>`).
  - Kiểm tra version Java: `java -version`. Cài đặt JRE nếu chưa có.
  - Xóa cache của emulator: `rm -rf ~/.cache/firebase/emulators/`.

### 3. Mock Gemini API không hoạt động
**Triệu chứng:** Frontend nhận lỗi 500 hoặc Timeout khi yêu cầu phân tích rủi ro.
- **Nguyên nhân:** Local Server chưa được bật, hoặc giá trị biến môi trường `GEMINI_API_KEY` bị sai logic, dẫn đến module AI engine ném ra exception.
- **Cách khắc phục:**
  - Chắc chắn `NODE_ENV=development`.
  - Chạy `curl http://localhost:8080/health` để xác minh API mock server đang chạy.
  - Khởi động lại Docker container nếu đang chạy mock server trong Docker.

## Checklist
- [ ] Xác minh lỗi đã được đề cập trong danh sách hay chưa.
- [ ] Thử thực hiện theo các bước khắc phục sự cố.
- [ ] Nếu vẫn lỗi, hãy tìm kiếm từ khóa trên Slack channel `#dev-help`.

## Tài liệu liên quan
- [Local Dev Setup](file:///e:/PJ/docs/28_Developer_Operations/LocalDevSetup.md)
- [Environment Variables Guide](file:///e:/PJ/docs/28_Developer_Operations/EnvironmentVariablesGuide.md)

## Việc cần làm tiếp
- Thường xuyên bổ sung các lỗi mới, đặc biệt sau các đợt phát hành lớn hoặc khi cập nhật version của framework (như React, Node, Firebase).
