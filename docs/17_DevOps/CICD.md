# CI/CD Pipeline

## Mục tiêu
Tự động hóa quá trình tích hợp mã nguồn (Continuous Integration) và triển khai (Continuous Deployment) từ GitHub lên môi trường Google Cloud Run, đảm bảo mã nguồn luôn được kiểm thử và release một cách an toàn, nhanh chóng.

## Nội dung chính

### 1. Kiến trúc CI/CD chung
- **Công cụ**: GitHub Actions.
- **Chiến lược nhánh (Branching Strategy)**: Trunk-based development hoặc GitFlow rút gọn (nhánh `main` cho production, nhánh `staging` cho kiểm thử, các nhánh `feature/*` cho phát triển mới).
- **Quy trình luồng (Workflow flow)**:
  Lint/Format ➔ Unit Tests ➔ Integration Tests ➔ Build Docker Image ➔ Push to Artifact Registry ➔ Deploy to Cloud Run.

### 2. Workflows cấu hình GitHub Actions (YAML Structure)
Hệ thống sử dụng các workflows chính sau:

#### A. Pull Request Workflow (`.github/workflows/pr-check.yml`)
- Kích hoạt khi có sự kiện mở hoặc cập nhật Pull Request vào nhánh `main` hoặc `staging`.
- **Steps**:
  - Checkout mã nguồn.
  - Cài đặt môi trường (Python/Node.js).
  - Chạy Linter (Ruff/ESLint).
  - Chạy Unit Tests (Pytest/Jest).
  - (Chỉ khi pass 100% tests mới cho phép Merge).

#### B. Deploy to Staging (`.github/workflows/deploy-staging.yml`)
- Kích hoạt khi merge vào nhánh `staging`.
- **Steps**:
  - Xác thực với GCP thông qua Workload Identity Federation (WIF).
  - Build container image sử dụng Docker.
  - Push image lên Google Artifact Registry (ví dụ: `asia-southeast1-docker.pkg.dev/iis-staging/images/backend:commit-sha`).
  - Triển khai image lên Cloud Run project `iis-staging`.
  - Chạy E2E Tests (Playwright) trên môi trường Staging.

#### C. Deploy to Production (`.github/workflows/deploy-prod.yml`)
- Kích hoạt khi merge hoặc release tag vào nhánh `main`.
- Tương tự như quy trình Staging nhưng đích đến là project `iis-production`.
- **Đặc điểm**:
  - Không expose toàn bộ traffic ngay lập tức. Sử dụng tính năng Traffic Splitting của Cloud Run để gửi 10% traffic vào phiên bản mới (Canary Release).
  - Đội ngũ giám sát lỗi, nếu an toàn sẽ nâng lên 100%.

### 3. Bảo mật CI/CD
- **Không sử dụng Service Account Keys**: Áp dụng Workload Identity Federation, cấp quyền cho GitHub Repo tin tưởng được giao tiếp với GCP.
- Cấu hình secrets (như `WIF_PROVIDER`, `SERVICE_ACCOUNT`) thông qua GitHub Repository Secrets.

## Checklist
- [x] Thiết kế luồng CI/CD logic.
- [ ] Viết cấu hình YAML cho `pr-check.yml`.
- [ ] Thiết lập GCP Workload Identity Pool và Provider.
- [ ] Viết cấu hình YAML cho deploy Staging và Production.
- [ ] Bật tính năng Branch Protection Rules trên GitHub cho nhánh `main`.

## Tài liệu liên quan
- [DeploymentGuide.md](./DeploymentGuide.md)
- [ContainerStrategy.md](./ContainerStrategy.md)
- [TestStrategy.md](../18_Testing/TestStrategy.md)

## Việc cần làm tiếp
- Tối ưu hóa thời gian build bằng cách cache Docker layers và test dependencies.
- Bổ sung bước kiểm tra lỗ hổng bảo mật Docker image (Container Scanning) vào CI.
