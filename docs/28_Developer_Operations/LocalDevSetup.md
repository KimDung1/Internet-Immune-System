# Local Development Setup

## Mục tiêu
Hướng dẫn chi tiết từng bước (step-by-step) để khởi tạo và chạy các thành phần của hệ thống Internet Immune System trên môi trường cục bộ (Local Environment).

## Nội dung chính

### 1. Yêu cầu hệ thống
- Hệ điều hành: Windows, macOS, hoặc Linux.
- **Node.js**: v18.x (khuyên dùng nvm để quản lý phiên bản).
- **Docker**: Docker Desktop cho quản lý container.
- **Java**: JRE 11+ (Yêu cầu bắt buộc để chạy Firebase Emulator Suite).

### 2. Cài đặt các công cụ CLI
```bash
npm install -g firebase-tools
npm install -g nx # Nếu dùng monorepo workspace
```

### 3. Cấu hình Firebase Emulators
Khởi động emulator cục bộ để không ảnh hưởng đến database thực:
```bash
firebase emulators:start --only firestore,auth,functions
```
Truy cập Emulator UI tại `http://localhost:4000`.

### 4. Load Chrome Extension chưa đóng gói (Unpacked)
1. Chạy lệnh build liên tục (watch mode) cho extension:
   ```bash
   cd apps/extension
   npm run build:watch
   ```
2. Mở Chrome, điều hướng đến `chrome://extensions/`.
3. Bật **Developer mode** ở góc trên bên phải.
4. Nhấn **Load unpacked** và chọn thư mục `apps/extension/dist`.
5. Extension sẽ tự động cập nhật lại (hot-reload) khi code thay đổi (nếu có sử dụng webpack/vite hot-reload plugin).

### 5. Khởi chạy Local API Server (Cloud Run Mock)
Sử dụng Docker để mô phỏng môi trường Cloud Run:
```bash
cd apps/api
docker build -t local-api-server .
docker run -p 8080:8080 --env-file .env.local local-api-server
```

## Checklist
- [ ] Đã chạy thành công Firebase Emulators.
- [ ] Đã load extension vào trình duyệt Chrome.
- [ ] API server phản hồi ở `http://localhost:8080/health`.

## Tài liệu liên quan
- [Environment Variables Guide](file:///e:/PJ/docs/28_Developer_Operations/EnvironmentVariablesGuide.md)
- [Troubleshooting Guide](file:///e:/PJ/docs/28_Developer_Operations/TroubleshootingGuide.md)

## Việc cần làm tiếp
- Kiểm tra kết nối từ Chrome Extension tới Local API bằng tab Network trong DevTools.
- Tham khảo Troubleshooting Guide nếu extension không load được.
