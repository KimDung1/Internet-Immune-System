# Background Jobs

## Mục tiêu
Thiết kế và mô tả các công việc chạy ngầm (Background Jobs) định kỳ, tự động hóa các quy trình bảo trì, tổng hợp dữ liệu và đồng bộ hóa Threat Intelligence cho hệ thống.

## Nội dung chính

Các Background Jobs được lên lịch bằng **Google Cloud Scheduler** và gửi trigger (thường qua HTTP POST hoặc Pub/Sub) tới dịch vụ `Analytics & Background Service`.

### 1. Cron Job: Đồng bộ Threat Intelligence (Daily)
- **Tần suất:** Mỗi 00:00 (Nửa đêm, múi giờ GMT+7).
- **Mô tả:** 
  - Kéo danh sách URL/IP độc hại mới nhất từ các API Open Source (ví dụ: PhishTank, AbuseIPDB, NCSC VN).
  - So sánh và cập nhật vào Collection `threat_intelligence` trên Firestore.
  - Xóa các mục (entities) đã quá 1 năm không còn hoạt động để làm nhẹ Database.
- **Timeout cho phép:** 10 phút.

### 2. Cron Job: Nhắc nhở Huấn luyện Người dùng (Weekly)
- **Tần suất:** Mỗi Thứ Hai, lúc 09:00 sáng.
- **Mô tả:**
  - Quét Collection `users` tìm những người dùng có `Trust Score < 60`.
  - Nếu họ chưa hoàn thành khóa Training nào trong tuần qua, gửi thông báo đẩy (Push Notification) mời họ làm một bài quiz ngắn do Trainer Agent chuẩn bị.
- **Tích hợp:** Firebase Cloud Messaging (FCM).

### 3. Cron Job: Tổng hợp Báo cáo Gian lận (Hourly)
- **Tần suất:** Mỗi giờ một lần.
- **Mô tả:**
  - Quét Collection `fraud_reports` có trạng thái `PENDING`.
  - Nhóm các báo cáo có cùng một URL/Số điện thoại.
  - Nếu nhóm có đủ lượng báo cáo tin cậy (>= 5), cập nhật tự động sang trạng thái `VERIFIED` và đẩy vào `threat_intelligence`. (Tham khảo BusinessLogic.md).

### 4. Cron Job: Dọn dẹp & Ẩn danh hóa dữ liệu (Weekly)
- **Tần suất:** Mỗi Chủ nhật lúc 02:00 sáng.
- **Mô tả:**
  - Chạy theo chính sách Retention Policy.
  - Tìm các document trong `scan_results` cũ hơn 90 ngày.
  - Gỡ bỏ trường `uid` và các thông tin định danh khác, chỉ giữ lại mẫu câu/định dạng để phục vụ Data Science (Data Anonymization).

## Checklist
- [x] Lịch trình cho việc đồng bộ Blacklist.
- [x] Tính năng nhắc nhở người dùng (Trainer automation).
- [x] Tác vụ dọn dẹp (Retention enforcement).

## Tài liệu liên quan
- [DataRetention.md](../11_Database/DataRetention.md)
- [BusinessLogic.md](./BusinessLogic.md)

## Việc cần làm tiếp
- Cấu hình Terraform cho các Cloud Scheduler Jobs này để quản lý tự động.
- Viết API handlers (được bảo mật bằng token nội bộ) nhận các trigger này.
