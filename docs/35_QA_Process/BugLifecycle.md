# Bug Tracking Lifecycle

## Mục tiêu
Thiết lập một quy trình chuẩn hóa, rõ ràng về vòng đời của một lỗi (bug) từ khi được phát hiện cho đến khi được sửa chữa và xác nhận hoàn thành, đảm bảo không có lỗi nào bị bỏ sót trong "Internet Immune System".

## Nội dung chính
Định nghĩa các trạng thái của một Bug, thang điểm đánh giá mức độ nghiêm trọng (Severity), ưu tiên (Priority) và quy trình xử lý lỗi (Workflow).

## 1. Trạng thái Vòng đời của Lỗi (Bug Status Workflow)

Quy trình luân chuyển trạng thái trên Jira / GitHub Issues:

1.  **New (Mới):** Bug vừa được report bởi QA, User, hoặc hệ thống giám sát.
2.  **Triage (Đánh giá):** Product Manager/Tech Lead xem xét, xác nhận đây đúng là lỗi (không phải tính năng), gán Severity và Priority.
3.  **Open / To Do:** Bug đã được duyệt và đưa vào Backlog hoặc Sprint hiện tại. Được gán cho một Developer.
4.  **In Progress:** Developer đang trong quá trình fix lỗi.
5.  **In Review:** Code fix đã được tạo Pull Request và đang chờ đánh giá (Code Review).
6.  **Ready for QA (Chờ test):** Code đã được merge và deploy lên môi trường Staging.
7.  **In QA / Testing:** QA thực hiện kiểm tra lại (Regression test).
    *   *Pass -> chuyển sang Done/Closed.*
    *   *Fail -> chuyển lại trạng thái In Progress (hoặc Reopened) cho Developer.*
8.  **Closed / Done:** Lỗi đã được xác nhận khắc phục thành công trên Production.

## 2. Phân loại Mức độ Nghiêm trọng (Severity Scoring)

Định nghĩa mức độ ảnh hưởng của lỗi đến hệ thống:

*   **S1 - Critical (Nghiêm trọng nhất):** Hệ thống bị sập (Crash), mất dữ liệu, hoặc tính năng cốt lõi (AI Scan) không hoạt động hoàn toàn. Chặn toàn bộ luồng sử dụng.
*   **S2 - High (Cao):** Tính năng lớn hoạt động sai lệch, ảnh hưởng nghiêm trọng đến bảo mật hoặc trải nghiệm người dùng, không có cách giải quyết tạm thời (workaround).
*   **S3 - Medium (Trung bình):** Lỗi chức năng nhỏ, UI/UX bị lỗi hiển thị nhưng luồng chính vẫn hoạt động, có cách vòng qua (workaround).
*   **S4 - Low (Thấp):** Sai sót chính tả, lỗi hiển thị thẩm mỹ rất nhỏ không ảnh hưởng đến thao tác.

## 3. Phân loại Mức độ Ưu tiên (Priority)

Xác định thứ tự thời gian cần giải quyết:

*   **P0 - Blocker (Hotfix):** Phải sửa ngay lập tức, can thiệp vào ban đêm/ngày nghỉ. Fix trong vòng 4 giờ.
*   **P1 - High:** Sửa trong Sprint hiện tại. Khắc phục trong vòng 24-48 giờ.
*   **P2 - Medium:** Lên lịch sửa trong Sprint tiếp theo.
*   **P3 - Low:** Đưa vào Backlog, làm khi có thời gian rảnh.

## 4. Tiêu chuẩn Report Lỗi (Bug Report Template)
Một report lỗi chất lượng phải bao gồm:
- **Title:** Mô tả ngắn gọn lỗi (Ví dụ: `[Dashboard] Nút "Quét lại" không hoạt động khi xem lịch sử`).
- **Environment:** (OS, Browser, Version, Staging/Prod).
- **Steps to Reproduce (Bước tái hiện):** 1, 2, 3...
- **Expected Result (Kết quả mong muốn):**
- **Actual Result (Kết quả thực tế):**
- **Evidences:** Ảnh chụp màn hình, Video quay màn hình, hoặc Log file (bắt buộc).

## Tài liệu liên quan
- [QA Process Overview](./QAProcessOverview.md)

## Việc cần làm tiếp
- Tích hợp Sentry/Crashlytics với Jira/Slack để tự động tạo ticket khi có lỗi S1/P0.
- Cấu hình template issue trên GitHub Repository theo chuẩn trên.
