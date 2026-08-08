# Data Privacy & Compliance

## Mục tiêu
Đảm bảo Internet Immune System xử lý dữ liệu người dùng một cách an toàn, tôn trọng quyền riêng tư, và tuân thủ các đạo luật an ninh mạng, đặc biệt là tại Việt Nam (Luật An ninh mạng, Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân).

## Nội dung chính
### 1. Nguyên tắc tối thiểu hóa dữ liệu (Data Minimization)
- Hệ thống chỉ thu thập dữ liệu phục vụ trực tiếp cho tính năng phân tích mối đe dọa (URL nghi ngờ, HTML DOM metadata).
- KHÔNG thu thập lịch sử duyệt web toàn thời gian của người dùng. Trình duyệt chỉ gửi dữ liệu lên Backend khi phát hiện có rủi ro tiềm ẩn dựa trên heuristics cục bộ, hoặc khi người dùng chủ động yêu cầu quét.

### 2. Khử định danh (Anonymization & Pseudonymization)
- Dữ liệu gửi sang cho Google Gemini phân tích không gắn kèm User ID hoặc Email.
- Backend thực hiện quá trình làm sạch: xóa token, ID, số điện thoại, số thẻ tín dụng khỏi nội dung trang trước khi gửi đi.

### 3. Lưu trữ và Mã hóa
- **Data Residency**: Máy chủ CSDL phải được đặt tại các Data Center đáp ứng yêu cầu lưu trữ dữ liệu tại Việt Nam (hoặc sử dụng Google Cloud region châu Á đảm bảo độ trễ và tuân thủ nhất định, lưu ý tư vấn luật sư về NĐ 53).
- **Encryption**: Sử dụng AES-256 cho dữ liệu at-rest (tại cơ sở dữ liệu) và TLS 1.2/1.3 cho in-transit.

### 4. Quyền của người dùng
- Chức năng **Export Data**: Cho phép người dùng tải xuống lịch sử bảo mật của họ.
- Chức năng **Delete Account**: Người dùng có thể yêu cầu xóa vĩnh viễn toàn bộ dữ liệu cá nhân khỏi hệ thống (Right to be forgotten).

## Checklist
- [ ] Viết Chính sách quyền riêng tư (Privacy Policy) và Điều khoản sử dụng (Terms of Service) rõ ràng trên website.
- [ ] Tích hợp tính năng xóa tài khoản trong Dashboard.
- [ ] Thực hiện che giấu PII (Personally Identifiable Information) trong quá trình log hệ thống.

## Tài liệu liên quan
- [Compliance Checklist](./ComplianceChecklist.md)

## Việc cần làm tiếp
- Mời luật sư tư vấn và review lại điều khoản để đảm bảo đúng Nghị định 13/2023/NĐ-CP (Bảo vệ dữ liệu cá nhân tại VN).
