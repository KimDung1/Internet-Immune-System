# End-to-End Release Process

## Mục tiêu
Định nghĩa quy trình phát hành sản phẩm (Release Process) cho dự án Internet Immune System (bao gồm Backend, AI Services và Chrome Extension) từ môi trường Staging đến Production. Đảm bảo các đợt release an toàn, giảm thiểu downtime và có cơ chế fallback (rollback) khi gặp sự cố.

## Nội dung chính

### 1. Chuẩn bị Release (Release Preparation)
- **Freeze Code**: Tạm dừng merge các PR không liên quan đến release vào nhánh `main` (hoặc cắt nhánh `release/*`).
- **Versioning**: Sử dụng CI/CD để tự động bump version (SemVer) dựa trên commit history (feat = minor, fix = patch, breaking change = major).
- **Changelog Automation**: Tự động sinh `CHANGELOG.md` (Release Notes) qua GitHub Actions (`release-please` hoặc `standard-version`).

### 2. Quy trình Release các thành phần

#### A. Backend & AI Services (Cloud Run / Firebase)
Chúng ta sử dụng chiến lược **Continuous Deployment (CD)** cho backend.
- **Staging Deployment**: Mỗi commit vào `main` tự động deploy lên môi trường Staging. QAs thực hiện kiểm thử tự động và thủ công.
- **Production Canary Deployment**:
  - Deploy phiên bản mới lên Cloud Run song song với phiên bản cũ.
  - Điều hướng 10% traffic (Canary) vào phiên bản mới.
  - Giám sát log, error rate và latency của Gemini API trong 1 giờ.
  - Nếu ổn định, scale up lên 100% traffic. Nếu có lỗi, rollback về 0% ngay lập tức.

#### B. Chrome Extension
Quá trình release Extension phụ thuộc vào review process của Google.
- **Staging**: Đóng gói `.zip` và tự động publish lên kênh internal testers trên Chrome Web Store.
- **Production Submission**:
  - CI tự động build file zip production.
  - CI gọi API của Chrome Web Store để submit phiên bản mới dưới dạng "Draft" hoặc "Published".
  - **Lưu ý**: Khuyến nghị sử dụng tính năng "Phased Rollout" (Rollout theo phần trăm) của Chrome Web Store nếu bản cập nhật có thay đổi lớn về UI hoặc logic core.

### 3. Post-Release
- **Sanity Check**: Đội QA/Dev thực hiện smoke test trên Production environment ngay sau khi deploy/publish.
- **Monitoring**: Theo dõi Google Cloud Monitoring, Firebase Crashlytics và Sentry để phát hiện các spike về errors hoặc latency.
- **Communication**: Cập nhật Release Notes trên kênh Slack/Discord của team và thông báo cho Stakeholders.

## Checklist
- [ ] Version được bump tự động và đúng chuẩn SemVer.
- [ ] Release Notes được tự động sinh ra và đính kèm vào GitHub Release.
- [ ] Có chiến lược Canary cho Backend và Phased Rollout cho Extension.
- [ ] Kế hoạch Rollback (Kill-switch hoặc Revert) luôn sẵn sàng.

## Tài liệu liên quan
- [Git Flow](GitFlow.md)
- [Feature Flag Management](FeatureFlagManagement.md)

## Việc cần làm tiếp
- Xây dựng GitHub Actions pipeline cho việc tự động submit bản build lên Chrome Web Store.
- Cấu hình Traffic Splitting tự động trên Google Cloud Run cho Canary deployments.
