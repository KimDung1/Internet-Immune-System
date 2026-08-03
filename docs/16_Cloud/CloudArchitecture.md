# Cloud Architecture

## Mục tiêu
Tài liệu này mô tả chi tiết kiến trúc tổng thể trên Google Cloud Platform (GCP) của dự án Internet Immune System. Hệ thống được thiết kế để đảm bảo khả năng mở rộng (scalability), tính sẵn sàng cao (high availability), bảo mật, và tối ưu chi phí nhằm hỗ trợ mục tiêu tham gia Top 10 AI Riser Vietnam.

## Nội dung chính

### 1. Project Structure
Dự án áp dụng mô hình phân tách tài nguyên (resource isolation) thành nhiều GCP Projects khác nhau:
- **`iis-production`**: Môi trường Live dành cho end-user.
- **`iis-staging`**: Môi trường kiểm thử tương đồng với production, sử dụng để UAT và performance testing.
- **`iis-development`**: Môi trường cho các developers triển khai và kiểm thử các tính năng mới.

### 2. Virtual Private Cloud (VPC) & Networking
- **Custom VPC**: Mỗi project sử dụng một Custom VPC network thay vì Default VPC để kiểm soát chặt chẽ IP ranges và firewall rules.
- **Subnets**: Phân chia subnets theo khu vực (region), ưu tiên `asia-southeast1` (Singapore) để tối ưu độ trễ cho người dùng tại Việt Nam.
- **Cloud NAT**: Cho phép các instances không có Public IP (ví dụ Cloud Run instances nếu config internal-only) vẫn có thể truy cập Internet để gọi các external APIs an toàn.
- **Cloud Armor**: Thiết lập phía trước Global HTTP(S) Load Balancer để chống DDoS và áp dụng các chính sách WAF cơ bản, bảo vệ API endpoints.

### 3. Identity and Access Management (IAM)
- Áp dụng nguyên tắc **Đặc quyền tối thiểu (Principle of Least Privilege)**.
- **IAM Groups**: Tạo các Google Groups (ví dụ: `gcp-admins@domain.com`, `gcp-devs@domain.com`) thay vì gán quyền trực tiếp cho từng user.
- **Custom Roles**: Định nghĩa các custom roles cho những tác vụ đặc thù nếu predefined roles quá rộng.

### 4. Service Accounts
Service Accounts được sử dụng riêng biệt cho từng dịch vụ và môi trường:
- `sa-cloudrun-backend@iis-production.iam.gserviceaccount.com`: Cho Cloud Run services, quyền truy cập Secret Manager, Cloud Storage, và Vertex AI/Gemini API.
- `sa-github-actions@iis-production.iam.gserviceaccount.com`: Cấu hình Workload Identity Federation để GitHub Actions có thể deploy lên GCP mà không cần lưu trữ long-lived service account keys.

### 5. Billing Alerts
- Thiết lập Budget Alerts tại mức 50%, 80%, 90% và 100% của ngân sách dự kiến.
- Gửi thông báo đến kênh Slack/Discord của đội DevOps thông qua Pub/Sub.

## Checklist
- [x] Tạo tổ chức/folder structure trên GCP.
- [ ] Thiết lập Custom VPC, subnets và firewall rules.
- [ ] Cấu hình Cloud Armor và Load Balancing.
- [ ] Thiết lập IAM Groups và Service Accounts.
- [ ] Bật Budget Alerts và cấu hình Webhooks báo cáo chi phí.
- [ ] Tích hợp Workload Identity Federation cho GitHub Actions.

## Tài liệu liên quan
- [GCPServices.md](./GCPServices.md)
- [CostManagement.md](./CostManagement.md)
- [InfrastructureAsCode.md](../17_DevOps/InfrastructureAsCode.md)

## Việc cần làm tiếp
- Viết mã Terraform cho VPC, IAM, và Service Accounts.
- Kiểm tra tính kết nối của Cloud NAT.
- Thiết lập Cloud Armor rules để chặn bot traffic độc hại.
