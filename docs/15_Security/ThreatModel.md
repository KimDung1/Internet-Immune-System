# STRIDE Threat Model

## Mục tiêu
Nhận diện và lên kế hoạch phòng chống các mối đe dọa (Threats) đối với Internet Immune System theo mô hình STRIDE.

## Nội dung chính
### 1. Bảng phân tích STRIDE

| Hạng mục (STRIDE) | Mối đe dọa cụ thể (Threat) | Biện pháp giảm nhẹ (Mitigation) |
| :--- | :--- | :--- |
| **S**poofing (Giả mạo) | Kẻ tấn công giả mạo là người dùng khác để xem lịch sử duyệt web/scan. | Sử dụng Firebase Auth JWT. API verify token sinh ra từ đúng phiên làm việc. |
| **T**ampering (Sửa đổi) | Mã độc trên máy người dùng sửa đổi file Extension để vô hiệu hóa chức năng bảo vệ. | Extension được ký số bởi Google (Chrome Web Store). Sử dụng CSP (Content Security Policy) khắt khe trong Extension. |
| **R**epudiation (Chối bỏ) | Một Admin doanh nghiệp thay đổi cấu hình bảo mật nhưng chối bỏ. | Áp dụng Audit Logging tập trung, không thể sửa đổi (Immutable logs). |
| **I**nformation Disclosure | Dữ liệu nội dung trang web nhạy cảm (chứa mật khẩu) bị gửi về hệ thống và rò rỉ. | Extension chạy regex xóa bỏ dữ liệu nhạy cảm (thẻ `<input type="password">`, credit card) trước khi đẩy lên API. |
| **D**enial of Service | Tấn công DDoS vào API analyze để làm kiệt quệ tài nguyên và tiền Gemini API. | Áp dụng Rate Limiting khắt khe. Sử dụng reCAPTCHA v3 (Enterprise). Cấu hình Cloud Armor chặn traffic bất thường. |
| **E**levation of Privilege | Người dùng thường leo quyền lên Enterprise Admin để xem dữ liệu toàn tổ chức. | Kiểm tra Custom Claims trong JWT tại tầng middleware thay vì client. |

### 2. Các Attack Vectors đặc thù cho Sản phẩm AI
- **Adversarial Machine Learning**: Kẻ lừa đảo (Phishers) thiết kế trang web sao cho Gemini AI bị "nhầm lẫn" và đánh giá là an toàn (False Negative).
  - *Mitigation*: Kết hợp AI với các danh sách đen (Blacklist) truyền thống (Google Safe Browsing). Liên tục fine-tune/few-shot prompt bằng các mẫu phishing mới nhất.

## Checklist
- [ ] Hoàn thiện tài liệu kiến trúc kỹ thuật để phục vụ cho Threat Modeling chi tiết hơn.
- [ ] Rà soát lại code Extension đảm bảo không rò rỉ thông tin (Information Disclosure).

## Tài liệu liên quan
- [Security Architecture](./SecurityArchitecture.md)

## Việc cần làm tiếp
- Thực hiện Threat Modeling định kỳ mỗi khi ra mắt tính năng lớn mới (ví dụ: quét file tải xuống).
