# Security Architecture

## Mục tiêu
Tài liệu định nghĩa kiến trúc bảo mật tổng thể của Internet Immune System. Với tư cách là một sản phẩm bảo mật, bản thân hệ thống phải áp dụng nguyên tắc Phòng thủ theo chiều sâu (Defense in Depth) và Zero Trust.

## Nội dung chính
### 1. Kiến trúc Defense in Depth
- **Lớp mạng (Network Layer)**: 
  - Ẩn toàn bộ backend sau Google Cloud API Gateway và Cloud Armor (WAF).
  - Từ chối mọi truy cập trực tiếp bằng IP.
- **Lớp ứng dụng (Application Layer)**: 
  - Stateless API với JWT Auth.
  - Phân tích và sanitize toàn bộ input từ Extension (đặc biệt là mã HTML từ các trang bị nghi ngờ).
- **Lớp dữ liệu (Data Layer)**:
  - Encryption in transit (TLS 1.3).
  - Encryption at rest (AES-256 cho Cloud SQL / Firestore).
  - Anonymization dữ liệu người dùng khi gửi cho Gemini AI phân tích.

### 2. Zero Trust Principles
- Không tin tưởng bất kỳ client nào (kể cả Extension chính thức).
- Mọi request đều phải được xác thực và phân quyền (AuthN & AuthZ).
- Extension chỉ được gửi dữ liệu, không có quyền xóa hoặc sửa đổi lịch sử.

### 3. Bảo mật AI (AI Security)
- **Prompt Injection Defense**: 
  - Các prompt gửi cho Gemini phải được sanitize kỹ càng. 
  - Không cho phép người dùng truyền trực tiếp tham số vào system prompt của AI để tránh "jailbreak".
- **Data Leakage Prevention**:
  - Không gửi PII (Thông tin định danh cá nhân) của người dùng vào Gemini prompt. Các session token/cookie lấy từ trang web phải bị strip bỏ trước khi phân tích.

## Checklist
- [ ] Thiết lập Google Cloud Armor (WAF).
- [ ] Đánh giá lại cơ chế lọc input trước khi gửi vào Gemini.
- [ ] Cấu hình Firewall Rules chặn truy cập database từ bên ngoài VPC.

## Tài liệu liên quan
- [Threat Model](./ThreatModel.md)
- [Data Privacy](./DataPrivacy.md)

## Việc cần làm tiếp
- Mời chuyên gia độc lập audit kiến trúc.
- Triển khai hệ thống SIEM nội bộ (như Wazuh hoặc Google Chronicle) để giám sát chính hệ thống của chúng ta.
