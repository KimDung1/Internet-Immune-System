# Data Retention & Privacy Policies

## Mục tiêu
Xác định chính sách lưu giữ dữ liệu (Data Retention) và các biện pháp tuân thủ quyền riêng tư (bao gồm Nghị định 13/2023/NĐ-CP của Việt Nam về bảo vệ dữ liệu cá nhân) cho Internet Immune System.

## Nội dung chính

### 1. Nguyên tắc cốt lõi
- **Thu thập tối thiểu (Data Minimization):** Chỉ lưu trữ những nội dung thực sự cần thiết để phân tích gian lận. Nội dung quét (như tin nhắn nhạy cảm) sẽ được ẩn danh hoặc xóa ngay sau khi phân tích nếu không có giá trị học máy.
- **Mã hóa (Encryption):** Mọi dữ liệu in-transit (TLS 1.3) và at-rest (Firestore AES-256 mặc định).

### 2. Vòng đời dữ liệu (Data Lifecycle)

#### User Profiles (`users`)
- **Lưu giữ:** Xuyên suốt thời gian hoạt động của tài khoản.
- **Xóa bỏ:** Nếu người dùng yêu cầu xóa tài khoản (Right to be Forgotten), mọi dữ liệu liên quan trong `users` và thông tin định danh (PII) trong `scan_results` sẽ bị xóa hoàn toàn trong vòng 7 ngày.

#### Lịch sử quét (`scan_results`)
- **Lưu giữ:** 90 ngày để người dùng xem lại.
- **Ẩn danh hóa:** Sau 90 ngày, trường `uid` bị gỡ bỏ, dữ liệu quét được tổng hợp (aggregated) để phục vụ huấn luyện AI hệ thống, không thể truy vết lại người dùng.

#### Threat Intelligence (`threat_intelligence`)
- **Lưu giữ:** Vĩnh viễn (hoặc tới khi được xác minh là False Positive).
- Dữ liệu này không chứa PII của người dùng hệ thống.

### 3. Tuân thủ Quyền riêng tư (Việt Nam)
- **Sự đồng ý (Consent):** Người dùng phải chọn (Opt-in) đồng ý với điều khoản sử dụng khi đăng ký. Nếu có tính năng "Bảo vệ theo thời gian thực" đọc tin nhắn/clipboard, cần có cờ đồng ý riêng biệt.
- **Bảo vệ PII:** SĐT, Căn cước công dân có trong dữ liệu quét sẽ được hệ thống (Detector Agent) tự động bôi đen (redacted) trước khi lưu vào Database dài hạn.

## Checklist
- [x] Xác định thời gian lưu trữ cho từng loại dữ liệu.
- [x] Định nghĩa chính sách ẩn danh hóa (Anonymization).
- [x] Đánh giá tuân thủ quy định bảo mật cơ bản.

## Tài liệu liên quan
- [DatabaseSchema.md](./DatabaseSchema.md)
- [BackgroundJobs.md](../12_Backend/BackgroundJobs.md) (Nơi thực thi xóa dữ liệu định kỳ)

## Việc cần làm tiếp
- Cài đặt Google Cloud Scheduler để tự động chạy hàm ẩn danh hóa/xóa dữ liệu sau 90 ngày.
- Cập nhật chính sách này vào Điều khoản sử dụng (Terms of Service) trên Ứng dụng.
