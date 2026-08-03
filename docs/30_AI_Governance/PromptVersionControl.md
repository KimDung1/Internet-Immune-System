# Prompt Version Control

## Mục tiêu
Thiết lập quy trình và chiến lược quản lý phiên bản (Version Control) cho các Prompt. Đảm bảo mọi thay đổi đối với Prompt đều được theo dõi, kiểm thử kỹ lưỡng và có thể rollback an toàn, tương tự như quy trình phát triển phần mềm (Software Engineering).

## Nội dung chính

### 1. Chiến lược Định dạng Phiên bản (SemVer for Prompts)
Áp dụng Semantic Versioning (MAJOR.MINOR.PATCH) cho các prompt:
- **MAJOR**: Thay đổi cấu trúc cốt lõi, thay đổi mô hình (VD: từ Gemini 1.5 Pro lên Gemini 2.5 Pro), thay đổi Schema JSON đầu ra khiến client bị break.
- **MINOR**: Thêm features mới vào prompt, tinh chỉnh system instructions cải thiện độ chính xác nhưng giữ nguyên schema đầu ra.
- **PATCH**: Sửa lỗi chính tả, thay đổi nhỏ trong Few-shot examples để fix một case cụ thể mà không ảnh hưởng tổng thể.

### 2. Lưu trữ và Quản lý (Prompt Registry)
- Các prompt production KHÔNG ĐƯỢC hardcode trong source code ứng dụng.
- Lưu trữ các prompt trong Firebase Remote Config hoặc một Prompt CMS chuyên dụng.
- Dưới dạng file `.txt` hoặc `.yaml` trong repository Git (thư mục `prompts/`).

### 3. Quy trình Triển khai (Deployment Pipeline)
- **Dev**: Chỉnh sửa prompt cục bộ, chạy unit test.
- **Staging**: Chạy bộ Regression Test (đánh giá trên Golden Dataset).
- **Production**: Triển khai qua CI/CD pipeline, hỗ trợ A/B Testing hoặc Shadow Mode trước khi rollout 100%.

### 4. Kiểm thử Hồi quy (Regression Testing)
- Mỗi khi nâng cấp phiên bản Prompt, phải chạy lại toàn bộ tập test cases hiện có để đảm bảo không làm giảm hiệu suất của các tính năng cũ (No regressions).

## Checklist
- [ ] Prompt mới đã được gán đúng phiên bản SemVer chưa?
- [ ] Thay đổi prompt đã được commit vào Git chưa?
- [ ] Cập nhật Prompt đã pass toàn bộ Regression Test chưa?
- [ ] Có kế hoạch Rollback nếu phiên bản mới gặp lỗi trên Production chưa?

## Tài liệu liên quan
- [PromptTestingFramework.md](PromptTestingFramework.md)

## Việc cần làm tiếp
- Thiết lập CI/CD pipeline trên GitHub Actions để tự động hóa việc test prompt.
- Xây dựng hệ thống quản lý Prompt trên Firebase Remote Config.
