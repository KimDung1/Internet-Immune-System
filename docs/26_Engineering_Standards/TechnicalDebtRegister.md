# Technical Debt Register (Quản lý Nợ Kỹ Thuật)

## Mục tiêu
Ghi nhận, theo dõi và lên kế hoạch xử lý "Nợ kỹ thuật" (Technical Debt) của dự án Internet Immune System một cách minh bạch. Mục tiêu không phải là không có nợ, mà là quản lý nợ thông minh để duy trì tốc độ phát triển (Series A pace) mà không làm sụp đổ kiến trúc.

## Nội dung chính

### 1. Chính sách Ngân sách Nợ (Debt Budget Policy)
- **Tỉ lệ phân bổ**: Dành khoảng 15-20% thời gian của mỗi Sprint/Chu kỳ phát triển để refactor và trả nợ kỹ thuật.
- **Tiêu chí vay nợ có ý thức**: Nợ kỹ thuật chỉ được chấp nhận nếu nó mang lại giá trị kinh doanh ngắn hạn lớn (ví dụ: ra mắt kịp sự kiện, chứng minh giả thuyết) VÀ phải được ghi nhận ngay vào tài liệu này hoặc Jira/Github Issues.
- **Cấm vay nợ do thiếu hiểu biết**: Bất kỳ nợ kỹ thuật nào sinh ra do lười biếng hoặc phớt lờ tiêu chuẩn (Engineering Standards) đều không được chấp nhận trong Code Review.

### 2. Phân loại Nợ (Debt Categories)
- **Code Debt**: Code khó đọc, lặp code, thiếu abstraction.
- **Architecture Debt**: Lựa chọn công nghệ sai, kiến trúc nguyên khối cần tách microservices.
- **Testing Debt**: Thiếu test coverage, test flaky.
- **Documentation Debt**: Tài liệu lỗi thời, API thiếu Swagger.

### 3. Ma trận theo dõi Nợ (Tracking Matrix)

*Danh sách này cần được cập nhật thường xuyên. Gắn link tới Github Issue tương ứng.*

| ID | Ngày ghi nhận | Thành phần | Mô tả nợ | Tác động (High/Med/Low) | Effort xử lý | Trạng thái | Issue |
|---|---|---|---|---|---|---|---|
| TD-001 | 2024-05-10 | Extension / Content Script | Logic parse HTML đang dính cứng với một vài trang web cụ thể. Cần viết bộ parser tổng quát hóa hơn. | High | Lớn (1 tuần) | Open | #42 |
| TD-002 | 2024-05-15 | API / Firestore | Các query lưu lịch sử scan đang thiếu index ghép (Composite Index), sẽ bị chậm khi dữ liệu lớn. | Med | Nhỏ (1 ngày) | Open | #55 |
| TD-003 | 2024-06-01 | Web / UI | Bỏ qua việc viết Unit Test cho một số Dashboard Charts để kịp release MVP. | Low | Vừa (3 ngày) | In Progress| #89 |

### 4. Quy trình xử lý (Resolution Process)
1. Trong buổi Sprint Planning, Tech Lead rà soát danh sách này.
2. Chọn các Nợ Kỹ Thuật có "Tác động High" và đưa vào backlog của Sprint.
3. Các Nợ có tác động thấp có thể giao làm "good first issue" cho người mới.

## Checklist
- [ ] Mọi lập trình viên đều biết cách báo cáo Nợ kỹ thuật.
- [ ] Nợ mới phát sinh phải có lý do rõ ràng trong PR mô tả.
- [ ] Đội ngũ cam kết thời gian hàng tháng để refactor.

## Tài liệu liên quan
- [Code Review Checklist](CodeReviewChecklist.md)

## Việc cần làm tiếp
- Chuyển Tracking Matrix này thành dự án Kanban trên GitHub Projects để dễ quản lý trạng thái hơn.
- Thiết lập định kỳ họp "Refactoring Day" hàng tháng.
