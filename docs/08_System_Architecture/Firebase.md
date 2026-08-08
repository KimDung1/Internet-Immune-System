# Firebase Services Configuration

## Mục tiêu
Quy định cách sử dụng các dịch vụ của Firebase trong kiến trúc hệ thống, bao gồm schema cơ sở dữ liệu và cấu hình xác thực.

## Nội dung chính

### 1. Firebase Authentication
- **Phương thức**: Email/Password, Google OAuth.
- Tích hợp với Browser Extension: Lưu ID Token vào `chrome.storage.local` và gắn vào Header `Authorization: Bearer <token>` trong mỗi API call đến Cloud Run.

### 2. Firestore Database Schema
Cơ sở dữ liệu NoSQL với các Collection chính:

- `users` (Collection)
  - `uid` (Document - trùng UID Firebase Auth)
    - `email`: string
    - `plan`: string ("free", "premium")
    - `createdAt`: timestamp

- `scans` (Collection)
  - `scanId` (Document)
    - `uid`: string (Reference to user)
    - `url`: string
    - `timestamp`: timestamp
    - `threatLevel`: string ("safe", "suspicious", "malicious")
    - `aiResponse`: object (Chi tiết từ Gemini)
    - `mode`: string ("detect", "simulate")

### 3. Firebase Cloud Functions (Tùy chọn)
- Chỉ sử dụng cho các trigger ngầm định, ví dụ: 
  - Gửi email welcome khi tạo user mới (Auth trigger).
  - Cronjob dọn dẹp dữ liệu cũ.
- *Lưu ý: API chính xử lý AI sẽ nằm ở Cloud Run, không dùng Functions vì cần timeout dài hơn và tùy biến container.*

### 4. Firebase Hosting
- Dùng để host Next.js Web App (Dashboard & Landing page).
- Cấu hình CI/CD qua GitHub Actions (Deploy to Firebase Hosting).

## Checklist
- [x] Xác định các Firebase services sử dụng
- [x] Thiết kế Schema cơ bản cho Firestore
- [ ] Viết Security Rules cho Firestore

## Tài liệu liên quan
- [Tech Stack](TechStack.md)

## Việc cần làm tiếp
- Triển khai Firebase Emulator Suite cho môi trường dev local.
