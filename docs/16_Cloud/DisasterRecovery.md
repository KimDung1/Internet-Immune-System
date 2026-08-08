# Disaster Recovery (DR) Plan

## Mục tiêu
Đảm bảo tính liên tục của dự án Internet Immune System trong trường hợp xảy ra sự cố hạ tầng, lỗi phần mềm nghiêm trọng hoặc tấn công mạng. Do hệ thống cung cấp "hệ miễn dịch", nên yêu cầu downtime thấp để đảm bảo người dùng luôn được bảo vệ khi lướt web.

## Nội dung chính

### 1. Mục tiêu khôi phục (Recovery Targets)
- **RTO (Recovery Time Objective)**: Thời gian tối đa để khôi phục dịch vụ sau sự cố. Target: **< 1 giờ**.
- **RPO (Recovery Point Objective)**: Lượng dữ liệu tối đa chấp nhận bị mất (tính bằng thời gian). Target: **< 15 phút** cho dữ liệu user/logs.

### 2. Chiến lược Sao lưu (Backup Strategy)
- **Firestore (Database)**:
  - Cấu hình Point-in-Time Recovery (PITR): Bật tính năng này cho phép khôi phục dữ liệu tại bất kỳ thời điểm nào trong vòng 7 ngày qua với độ phân giải phút.
  - Export Database định kỳ: Chạy Scheduled Cloud Run (hoặc Cloud Functions) mỗi ngày lúc 2:00 AM (giờ ít truy cập) để export toàn bộ collections ra Cloud Storage bucket.
- **Cloud Storage**:
  - Kích hoạt Object Versioning để chống lại việc xóa/sửa nhầm file hệ thống hoặc tài sản quan trọng.
- **Source Code & Cấu hình**:
  - Mã nguồn lưu 100% trên GitHub.
  - Infrastructure as Code (Terraform) giúp khôi phục toàn bộ hạ tầng đám mây chỉ trong vài phút.

### 3. Cân nhắc Đa khu vực (Multi-Region Considerations)
Dành cho Giai đoạn Mở rộng (Scale Phase), đối với MVP (AI Riser Vietnam):
- **Single Region (MVP)**: Sử dụng region `asia-southeast1` làm môi trường chính để tiết kiệm chi phí.
- **Multi-Region (Tương lai)**: 
  - Triển khai Cloud Run services ở 2 regions (ví dụ `asia-southeast1` và `asia-east1`).
  - Dùng Global HTTP(S) Load Balancer để tự động chuyển luồng traffic sang region còn lại nếu một region gặp sự cố (Failover).
  - Sử dụng Firestore multi-region configuration.

### 4. Quy trình phản ứng sự cố (Incident Response Process)
- **Phase 1: Detection**: Cloud Monitoring / Uptime Checks cảnh báo dịch vụ offline hoặc latency tăng đột biến.
- **Phase 2: Triage**: Đội trực ban kiểm tra logs, xác định nguyên nhân (code lỗi, GCP lỗi hạ tầng, quá tải).
- **Phase 3: Mitigation**: 
  - Nếu do code lỗi: Rollback ngay lập tức về bản image ổn định trước đó trên Cloud Run (thời gian tính bằng giây).
  - Nếu do hạ tầng GCP: Cập nhật status page, triển khai IaC lên region dự phòng (nếu có cấu hình).
- **Phase 4: Post-Mortem**: Phân tích lỗi (Root Cause Analysis - RCA) và lập action items sau sự cố.

## Checklist
- [x] Xác định các chỉ số RTO/RPO.
- [ ] Bật Firestore Point-in-Time Recovery.
- [ ] Tạo job export database tự động hàng ngày ra Cloud Storage.
- [ ] Kiểm thử quy trình Rollback Cloud Run (Chaos Engineering).
- [ ] Viết tài liệu "Incident Response Playbook" chi tiết cho đội ngũ vận hành.

## Tài liệu liên quan
- [CloudArchitecture.md](./CloudArchitecture.md)
- [InfrastructureAsCode.md](../17_DevOps/InfrastructureAsCode.md)

## Việc cần làm tiếp
- Thực hiện một buổi diễn tập khôi phục thảm họa (DR Drill) giả lập mất kết nối DB và xóa dữ liệu nhầm.
- Cấu hình Uptime Checks trong Cloud Monitoring để tự động ping API health-check endpoint mỗi 1 phút.
