# Production Deployment Checklist

## Mục tiêu
Đảm bảo quá trình đưa "Internet Immune System" lên môi trường Production diễn ra suôn sẻ, an toàn, không có thời gian chết (zero-downtime) và tuân thủ các tiêu chuẩn cao nhất về bảo mật và hiệu suất cho Cloud Run, Firebase, và Extension Store.

## Nội dung chính
Tài liệu này cung cấp một danh sách kiểm tra (checklist) toàn diện các bước cần thực hiện trước, trong và sau khi triển khai phiên bản mới của hệ thống lên Production.

## Checklist

### 1. Pre-Deployment (Trước khi triển khai)
- [ ] **Môi trường Staging:** Tất cả tính năng đã được kiểm thử và phê duyệt trên môi trường Staging.
- [ ] **Database Migration:** Các script migration cho Firestore/Firebase đã được kiểm tra (nếu có).
- [ ] **Environment Variables:** Xác nhận tất cả các biến môi trường (API keys, secrets) cho môi trường Production đã được thiết lập đúng trên Google Cloud Secret Manager và Cloud Run.
- [ ] **Security Scan:** Hoàn thành quét bảo mật tĩnh (SAST) và quét lỗ hổng thư viện phụ thuộc (Snyk/Dependabot). Không có lỗi mức độ Critical/High.
- [ ] **Performance Tests:** Các chỉ số API latency (<200ms) và AI scan response time (<1.5s) đạt chuẩn.
- [ ] **Rollback Plan:** Đã chuẩn bị kịch bản rollback chi tiết trong trường hợp có sự cố.

### 2. Deployment (Quá trình triển khai)
- [ ] **Backend (Cloud Run):** 
  - Triển khai container image mới qua CI/CD pipeline (GitHub Actions/Cloud Build).
  - Áp dụng chiến lược traffic splitting (ví dụ: 10% -> 50% -> 100%) để theo dõi lỗi.
- [ ] **Frontend/Dashboard (Firebase Hosting):**
  - Build và deploy phiên bản mới lên Firebase Hosting.
- [ ] **Chrome Extension (Web Store):**
  - Tải gói `.zip` extension mới lên Chrome Web Store Developer Dashboard.
  - Cập nhật thông tin release notes, ảnh chụp màn hình (nếu có).
  - Gửi yêu cầu Review (lưu ý thời gian review của Google có thể mất vài ngày).

### 3. Post-Deployment (Sau khi triển khai)
- [ ] **Smoke Testing:** Thực hiện kiểm tra nhanh các tính năng cốt lõi trên môi trường Production (Đăng nhập, Quét AI, Report).
- [ ] **Monitoring & Alerts:** 
  - Theo dõi Google Cloud Monitoring, Firebase Crashlytics để phát hiện lỗi đột biến.
  - Xác nhận hệ thống cảnh báo (Slack/Email/PagerDuty) đang hoạt động.
- [ ] **Metrics Validation:** Kiểm tra các chỉ số Core Web Vitals trên Production.
- [ ] **Communication:** Thông báo cho toàn bộ team (Dev, QA, Product) về trạng thái triển khai thành công.

## Tài liệu liên quan
- [Kiến trúc Cloud Run & Firebase](../11_Architecture/SystemArchitecture.md)
- [Quy trình CI/CD](../30_DevOps/CICDPipeline.md)

## Việc cần làm tiếp
- Tự động hóa hoàn toàn bước Rollback trong CI/CD.
- Thiết lập quy trình Canary Release chi tiết hơn cho Backend.
