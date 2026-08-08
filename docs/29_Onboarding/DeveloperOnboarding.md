# Developer Onboarding Manual

## Mục tiêu
Cung cấp hướng dẫn toàn diện cho nhân sự mới của đội ngũ kỹ thuật. Tài liệu này là nguồn thông tin chính thức (Single Source of Truth) để các kỹ sư nắm vững quy trình làm việc, thiết lập môi trường chi tiết và các chuẩn mực kỹ thuật của Internet Immune System.

## Nội dung chính

### 1. Tổng quan hệ thống
"Internet Immune System" không phải là một chatbot; đó là một trải nghiệm AI liên tục, bảo vệ người dùng khỏi lừa đảo kỹ thuật số trong thời gian thực bằng sức mạnh của Gemini AI, Google Cloud và Firebase.

### 2. Thiết lập môi trường chuyên sâu
Ngoài Quickstart, kỹ sư cần thiết lập môi trường cho các module chuyên biệt:
- **Chrome Extension**: Cần load thư mục `extension/build` vào Chrome ở chế độ Developer Mode.
- **Firebase Local Emulator Suite**: Dùng để giả lập Firestore, Cloud Functions, Authentication. Cấu hình tại `firebase.json`.
- **Mock Gemini AI Setup**: Để tiết kiệm chi phí trong môi trường dev, chúng ta sử dụng một mock server để giả lập phản hồi của Gemini API. Để sử dụng API thật, xin cấp quyền từ DevOps và cập nhật biến `GEMINI_API_KEY`.

### 3. Cấp quyền truy cập (Credentials & Access)
- **Google Cloud IAM**: Gửi email cho `admin@yourorg.com` để được cấp quyền vào dự án GCP Development.
- **Firebase Console**: Truy cập dự án staging.
- **GitHub**: Yêu cầu quyền tham gia GitHub Team.

### 4. Quy trình làm việc (Git Flow)
- Main branches: `main` (Production), `staging` (Staging).
- Naming convention: `feat/<jira-id>-<description>`, `fix/<jira-id>-<description>`.
- Mọi PR đều phải pass CI/CD pipeline (Linting, Unit Tests) và có ít nhất 1 Approve từ Senior Engineer.

## Checklist
- [ ] Được cấp quyền truy cập GitHub, GCP, Firebase.
- [ ] Đã cài đặt Chrome Extension ở môi trường dev.
- [ ] Đã kết nối thành công với Firebase Local Emulator.
- [ ] Hiểu quy trình tạo và merge PR.

## Tài liệu liên quan
- [30-Minute Quickstart](file:///e:/PJ/docs/29_Onboarding/30MinQuickstart.md)
- [Environment Variables Guide](file:///e:/PJ/docs/28_Developer_Operations/EnvironmentVariablesGuide.md)

## Việc cần làm tiếp
- Tham gia kênh Slack `#engineering`.
- Cấu hình IDE tuân theo chuẩn ESLint/Prettier của dự án.
