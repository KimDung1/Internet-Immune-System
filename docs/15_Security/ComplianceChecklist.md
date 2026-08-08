# Compliance Checklist

## Mục tiêu
Theo dõi và đảm bảo dự án Internet Immune System tuân thủ các quy định về an ninh mạng, pháp lý của Việt Nam và các tiêu chuẩn quốc tế (như GDPR) nếu mở rộng thị trường, cũng như chính sách của nhà cung cấp (Google, Chrome Web Store).

## Nội dung chính
### 1. Luật pháp Việt Nam
- [ ] **Nghị định 13/2023/NĐ-CP (Bảo vệ dữ liệu cá nhân)**:
  - Có hợp đồng/thỏa thuận xử lý dữ liệu với bên thứ 3 (Google Cloud).
  - Lấy sự đồng ý rõ ràng của người dùng trước khi phân tích URL.
  - Thông báo vi phạm dữ liệu trong vòng 72 giờ (nếu xảy ra).
- [ ] **Luật An ninh mạng (Nghị định 53/2022/NĐ-CP)**:
  - Xem xét yêu cầu lưu trữ dữ liệu tại Việt Nam (nếu hệ thống đạt ngưỡng người dùng hoặc thuộc nhóm dịch vụ viễn thông/mạng xã hội theo quy định).

### 2. Google / Chrome Web Store Policies
- [ ] **Quyền mở rộng (Extension Permissions)**: Đã cung cấp lý do chính đáng cho từng quyền trong bảng khai báo khi submit lên Web Store.
- [ ] **Google API Service: User Data Policy**: Hiển thị rõ ràng cách sử dụng dữ liệu. Không bán dữ liệu của người dùng cho bên thứ ba.

### 3. GDPR Principles (Chuẩn bị cho tương lai)
- [ ] Data Portability (Tính di động của dữ liệu).
- [ ] Right to be forgotten (Quyền được lãng quên - tính năng xóa tài khoản vĩnh viễn).
- [ ] Privacy by Design (Bảo mật ngay từ khâu thiết kế).

## Tài liệu liên quan
- [Data Privacy](./DataPrivacy.md)
- [Incident Response](./IncidentResponse.md)

## Việc cần làm tiếp
- Thuê dịch vụ tư vấn pháp lý (Legal Counsel) chuyên về IT để rà soát toàn bộ văn bản pháp lý.
- Chuẩn bị tài liệu cần thiết để giải trình cho Chrome Web Store review.
