# 30-Minute Onboarding Guide

## Mục tiêu
Giúp mọi kỹ sư phần mềm (bất kể múi giờ hay địa điểm) có thể clone source code, thiết lập môi trường, chạy thử nghiệm cục bộ và tạo Pull Request (PR) đầu tiên của họ cho dự án "Internet Immune System" chỉ trong vòng 30 phút.

## Nội dung chính

### 1. Điều kiện tiên quyết (Phút 0-5)
- Đảm bảo bạn đã cài đặt các công cụ sau:
  - **Git** (Phiên bản mới nhất)
  - **Node.js** (v18 LTS trở lên)
  - **Docker Desktop** (Đang chạy)
  - **VS Code** (Khuyên dùng với các extension: ESLint, Prettier, Firebase)

### 2. Clone dự án và cài đặt dependencies (Phút 5-10)
```bash
# Clone repository
git clone https://github.com/YourOrg/internet-immune-system.git
cd internet-immune-system

# Cài đặt dependencies cho toàn bộ workspace
npm install
```

### 3. Cấu hình môi trường (Phút 10-15)
Sao chép template cấu hình môi trường mẫu:
```bash
cp .env.example .env
```
*Lưu ý: Môi trường dev cục bộ sẽ tự động trỏ đến Firebase Emulator và hệ thống Mock Gemini AI. Bạn không cần API Key thực tế cho bước này.*

### 4. Khởi chạy hệ thống cục bộ (Phút 15-20)
Khởi động Docker containers (nếu có) và Firebase Emulators:
```bash
# Bật Docker compose cho database/cache (nếu dùng Redis/Postgres phụ)
docker-compose up -d

# Khởi chạy toàn bộ hệ thống (Frontend, Backend, Firebase Emulators)
npm run dev
```
Hệ thống sẽ khả dụng tại:
- Web App: `http://localhost:3000`
- Firebase UI: `http://localhost:4000`
- Mock API Server: `http://localhost:8080`

### 5. Kiểm thử và tạo PR đầu tiên (Phút 20-30)
1. Tạo branch mới: `git checkout -b feature/my-first-pr`
2. Thay đổi một file đơn giản (ví dụ: `README.md` hoặc thêm tên bạn vào `CONTRIBUTORS.md`).
3. Chạy test suite: `npm test`
4. Commit thay đổi: `git commit -am "docs: added my name to contributors"`
5. Push branch lên origin và tạo Pull Request.

## Checklist
- [ ] Đã clone repository thành công.
- [ ] Đã chạy `npm install` không gặp lỗi.
- [ ] Đã sao chép file `.env`.
- [ ] Hệ thống khởi chạy thành công với `npm run dev`.
- [ ] Đã submit PR đầu tiên.

## Tài liệu liên quan
- [Developer Onboarding](file:///e:/PJ/docs/29_Onboarding/DeveloperOnboarding.md)
- [Local Dev Setup](file:///e:/PJ/docs/28_Developer_Operations/LocalDevSetup.md)

## Việc cần làm tiếp
- Đọc [Architecture Overview For Devs](file:///e:/PJ/docs/29_Onboarding/ArchitectureOverviewForDevs.md) để hiểu sâu hơn về kiến trúc hệ thống.
- Yêu cầu Review PR từ Tech Lead.
