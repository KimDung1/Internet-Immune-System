# Code Review Checklist

## Mục tiêu
Chuẩn hóa quy trình đánh giá mã nguồn (Code Review) để đảm bảo chất lượng, tính bảo mật và sự đồng nhất trước khi merge code vào nhánh chính của Internet Immune System. Xây dựng văn hóa review tích cực, tập trung vào code, không phải cá nhân.

## Nội dung chính

### 1. Vai trò của Người Review (Reviewer)
- Xem code như một cơ hội để học hỏi và chỉ bảo.
- Sử dụng ngôn ngữ mang tính xây dựng. Thay vì nói: "Viết thế này sai rồi", hãy dùng: "Chúng ta có nên cân nhắc cách tiếp cận X vì lý do Y không?".
- Không review qua loa (LGTM - Looks Good To Me) cho những thay đổi lớn. Phải tải code về chạy thử (nếu cần).

### 2. Mandatory PR Review Checklist

#### A. Kiến trúc và Thiết kế (Architecture & Design)
- [ ] Code có tuân thủ nguyên lý Single Responsibility (chia nhỏ, mỗi hàm/component làm 1 việc)?
- [ ] Các module mới có phụ thuộc quá nhiều vào các module khác một cách không cần thiết (Coupling)?
- [ ] Việc tái sử dụng code có được ưu tiên (DRY)?
- [ ] Giải pháp triển khai có giải quyết đúng vấn đề nêu trong Issue không?

#### B. Tính chính xác & Logic (Correctness & Logic)
- [ ] Các logic xử lý lõi (đặc biệt là tích hợp Gemini AI, phân tích rủi ro) có chính xác không?
- [ ] Có bao phủ hết các trường hợp ngoại lệ (Edge cases), lỗi mạng, API timeout không?
- [ ] Dữ liệu đầu vào từ phía extension/client có được validate trước khi xử lý không?

#### C. Chất lượng Code & Conventions (Code Quality & Style)
- [ ] Tuân thủ hoàn toàn `CodingConventions.md` và `NamingConventions.md`.
- [ ] Không có cảnh báo Linting, không có kiểu `any` trong TypeScript.
- [ ] Code có dễ đọc và tự giải thích không?
- [ ] Các comments có giải thích "Tại sao" thay vì "Cái gì" không?

#### D. Bảo mật (Security)
- [ ] KHÔNG có API keys, mật khẩu, hay thông tin nhạy cảm bị hard-code.
- [ ] Phòng chống XSS (đặc biệt chú ý khi render HTML nội dung do AI sinh ra trong Extension).
- [ ] Quyền truy cập Firestore/Database đã được phân quyền đúng đắn chưa? (Security Rules).

#### E. Hiệu năng & Tối ưu (Performance)
- [ ] Không có query database dư thừa, vấn đề N+1 query.
- [ ] Component React không bị re-render không cần thiết.
- [ ] Service Worker của Extension có giải phóng bộ nhớ đúng cách không?

#### F. Kiểm thử (Testing)
- [ ] Có bổ sung Unit Test / Integration Test cho các logic quan trọng không?
- [ ] Code mới có làm phá vỡ các test cũ không?
- [ ] Các bài kiểm thử có thực sự kiểm tra logic, hay chỉ để đạt Coverage?

## Tài liệu liên quan
- [Pull Request Template](../../.github/PULL_REQUEST_TEMPLATE.md)
- [React Component Standards](ReactComponentStandards.md)
- [Technical Debt Register](TechnicalDebtRegister.md)

## Việc cần làm tiếp
- Cấu hình GitHub Actions để yêu cầu bắt buộc phê duyệt PR từ danh sách `CODEOWNERS`.
- Tích hợp công cụ tự động phát hiện API Key lộ (Secret Scanner).
