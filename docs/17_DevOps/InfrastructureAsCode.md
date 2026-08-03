# Infrastructure as Code (IaC)

## Mục tiêu
Quản lý toàn bộ hạ tầng điện toán đám mây cho dự án Internet Immune System (GCP resources) bằng mã nguồn (Infrastructure as Code) thay vì cấu hình thủ công (ClickOps). Việc này đảm bảo tính nhất quán, khả năng tái sử dụng giữa các môi trường, và khả năng tracking phiên bản.

## Nội dung chính

### 1. Lựa chọn Công cụ
- **Công cụ chính**: **Terraform** (bởi HashiCorp).
- Phù hợp nhất do hệ sinh thái lớn, hỗ trợ GCP rất tốt và được cộng đồng DevOps ưa chuộng. Không sử dụng Cloud Deployment Manager do đang dần trở nên lỗi thời so với Terraform.

### 2. Cấu trúc thư mục Terraform
Mã nguồn IaC được tổ chức theo môi trường để tránh xung đột state:
```
infrastructure/
├── modules/                   # Các thành phần tái sử dụng
│   ├── cloud-run/
│   ├── firestore/
│   ├── network/
│   └── iam/
├── environments/
│   ├── staging/
│   │   ├── main.tf            # Gọi các modules với tham số cho staging
│   │   ├── variables.tf
│   │   └── backend.tf         # Cấu hình GCS backend lưu state
│   └── production/
│       ├── main.tf
│       ├── variables.tf
│       └── backend.tf
```

### 3. Quản lý State
- **Remote Backend**: Sử dụng Google Cloud Storage (GCS) làm nơi lưu trữ tệp tin `.tfstate` cho Terraform.
- **State Locking**: Kết hợp với tính năng locking của GCS để đảm bảo không có hai người (hoặc CI process) chạy Terraform áp dụng hạ tầng cùng lúc, tránh hỏng file state.

### 4. Quy ước Đặt tên (Naming Conventions)
Các tài nguyên (Resource Names) được định nghĩa chuẩn:
- Mẫu chung: `[project]-[env]-[service]-[resource-type]`
- Ví dụ:
  - Artifact Registry: `iis-prod-backend-repo`
  - Cloud Run Service: `iis-prod-api-service`
  - Service Account: `sa-cloudrun-api@iis-production.iam.gserviceaccount.com`

### 5. Tích hợp với CI/CD (GitOps)
Quá trình áp dụng hạ tầng cũng được tự động hóa qua GitHub Actions:
- Khi tạo Pull Request thay đổi trong folder `infrastructure/`: Chạy `terraform plan` và báo cáo sự thay đổi lên comment của PR.
- Khi Merge vào `main`: Chạy `terraform apply -auto-approve` để áp dụng cấu hình thật lên GCP.

## Checklist
- [x] Lựa chọn Terraform là công cụ IaC.
- [ ] Thiết lập GCS bucket lưu trữ Terraform state.
- [ ] Xây dựng Terraform modules cơ bản (Network, Cloud Run, IAM).
- [ ] Viết file cấu hình hạ tầng cho môi trường Staging.
- [ ] Viết workflow GitHub Actions cho Terraform Plan/Apply.

## Tài liệu liên quan
- [CloudArchitecture.md](../16_Cloud/CloudArchitecture.md)
- [EnvironmentConfig.md](./EnvironmentConfig.md)

## Việc cần làm tiếp
- Triển khai script thiết lập project tự động (Project Bootstrap) để tạo GCP project, billing liên kết và tạo bucket state trước khi chạy Terraform.
- Định nghĩa phân quyền IAM bằng mã Terraform.
