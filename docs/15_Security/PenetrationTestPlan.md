# Penetration Testing Plan

## Mục tiêu
Xác định phạm vi, phương pháp luận và các kịch bản kiểm thử xâm nhập (PenTest) để phát hiện lỗ hổng của dự án Internet Immune System trước khi phát hành phiên bản chính thức.

## Nội dung chính
### 1. Phạm vi kiểm thử (Scope)
- **Web App**: `https://app.immune-system.vn` (Bảng điều khiển người dùng)
- **API**: `https://api.immune-system.vn` (Các endpoints)
- **Browser Extension**: Phân tích mã nguồn và hành vi của Extension (Tĩnh và Động).
- *Loại trừ (Out of Scope)*: Cơ sở hạ tầng của Google Cloud, Firebase Auth, Google Gemini API.

### 2. Phương pháp luận
- **Black-box Testing**: Mô phỏng kẻ tấn công từ bên ngoài không có kiến thức về hệ thống (Không có mã nguồn).
- **Grey-box Testing**: Cấp cho người kiểm thử tài khoản người dùng thông thường và tài khoản Admin để test các lỗ hổng phân quyền (BOLA/IDOR).
- Dựa trên danh sách **OWASP Top 10 (2021)**.

### 3. Kịch bản kiểm thử chính (Test Cases)
1. **Broken Access Control**:
   - Thử sử dụng tài khoản User truy cập endpoint của Admin.
   - Thử thay đổi ID trong URL để xem lịch sử scan của người khác (IDOR).
2. **Injection (Đặc biệt là Prompt/HTML Injection)**:
   - Truyền mã XSS vào trang giả mạo, xem extension có vô tình render mã XSS đó lên popup cảnh báo không.
   - Truyền payload cố tình đánh lừa AI (Prompt Injection) qua URL để AI trả về đánh giá "An toàn".
3. **API Security**:
   - Thử vượt qua giới hạn Rate Limit (DDoS ở quy mô nhỏ).
   - Kiểm tra Token Manipulation (Đổi chữ ký JWT, sử dụng token hết hạn).

## Checklist
- [ ] Chuẩn bị môi trường Staging cách ly hoàn toàn với Production cho PenTest.
- [ ] Cấp tài khoản test cho đội ngũ Security (Nội bộ hoặc thuê ngoài).

## Tài liệu liên quan
- [Threat Model](./ThreatModel.md)

## Việc cần làm tiếp
- Lên lịch chạy các công cụ quét tự động (DAST/SAST) như SonarQube, ZAP proxy trong luồng CI/CD.
- Chạy Bug Bounty Program sau khi public release.
