# Deployment Guide

## Mục tiêu
Cung cấp hướng dẫn từng bước chi tiết (step-by-step) về quá trình triển khai các thành phần của Internet Immune System. Mặc dù hệ thống có CI/CD tự động, tài liệu này hướng dẫn cách deploy thủ công hoặc khắc phục sự cố (troubleshooting) trong trường hợp pipeline CI/CD gặp vấn đề.

## Nội dung chính

### 1. Chuẩn bị (Prerequisites)
- Yêu cầu đã cài đặt `gcloud` CLI.
- Yêu cầu cài đặt `docker`.
- Đã đăng nhập vào hệ thống: `gcloud auth login`.
- Định cấu hình project: `gcloud config set project iis-production` (hoặc `iis-staging`).

### 2. Triển khai Backend API (Cloud Run)
Trong trường hợp CI/CD bị ngắt, cần cập nhật bản vá nóng (hotfix):

**Bước 1: Build Docker Image locally**
```bash
docker build -t asia-southeast1-docker.pkg.dev/iis-production/backend/api:hotfix-1 .
```

**Bước 2: Push Image lên Artifact Registry**
```bash
# Cấu hình Docker với gcloud
gcloud auth configure-docker asia-southeast1-docker.pkg.dev
# Push image
docker push asia-southeast1-docker.pkg.dev/iis-production/backend/api:hotfix-1
```

**Bước 3: Deploy lên Cloud Run**
```bash
gcloud run deploy iis-backend-api \
  --image asia-southeast1-docker.pkg.dev/iis-production/backend/api:hotfix-1 \
  --region asia-southeast1 \
  --platform managed \
  --allow-unauthenticated
```
Lưu ý: Các biến môi trường và liên kết Secret Manager đã được cấu hình từ trước bằng Terraform, nên bước deploy image này sẽ tự động kế thừa cấu hình cũ.

### 3. Triển khai Web Extension (Frontend)
Web extension dành cho Chrome/Edge:
**Bước 1: Build bộ mã cho extension**
```bash
npm install
npm run build:prod
```
**Bước 2: Đóng gói và phát hành**
- Mã nguồn sau build sẽ nằm ở thư mục `dist/`.
- Nén thư mục này thành tệp `extension-v1.0.zip`.
- Truy cập vào Chrome Web Store Developer Dashboard và tải tệp zip lên, điền thông tin và xin xét duyệt (Publish).

### 4. Triển khai Firebase Rules (Database Security)
Cập nhật bảo mật Firestore:
```bash
npm install -g firebase-tools
firebase login
firebase use iis-production
firebase deploy --only firestore:rules
```

### 5. Cơ chế Rollback (Khôi phục phiên bản cũ)
Nếu bản deploy mới gây lỗi:
**Rollback Cloud Run:**
Truy cập GCP Console -> Cloud Run -> Chọn Service -> Tab "Revisions" -> Chọn bản revision trước đó đang hoạt động ổn định -> Click "Manage Traffic" -> Chuyển 100% traffic về revision cũ.
Hoặc qua CLI:
```bash
gcloud run services update-traffic iis-backend-api --to-revisions=REVISION_NAME=100
```

## Checklist
- [x] Đã thiết lập tài khoản CLI `gcloud`.
- [ ] Viết scripts build và nén (zip) tự động cho Web Extension.
- [ ] Đảm bảo quyền IAM (Cloud Run Admin, Artifact Registry Writer) cho người thực hiện manual deploy.

## Tài liệu liên quan
- [CICD.md](./CICD.md)
- [ContainerStrategy.md](./ContainerStrategy.md)

## Việc cần làm tiếp
- Ghi chú lại danh sách các Revisions có lỗi để xóa, tiết kiệm dung lượng storage (Artifact Registry).
- Tích hợp hướng dẫn deploy Extension tự động sử dụng Chrome Web Store API.
