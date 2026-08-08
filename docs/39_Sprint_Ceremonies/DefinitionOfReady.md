# Definition of Ready (DoR)

## Mục tiêu
Định nghĩa tiêu chuẩn "Sẵn sàng" (Definition of Ready) cho các hạng mục (User Stories, Tasks, Bugs) trong Product Backlog. DoR đảm bảo một công việc đã được chuẩn bị đủ thông tin, rõ ràng và có thể thi công ngay lập tức trước khi được kéo vào Sprint, giúp giảm thiểu rủi ro tắc nghẽn (blockers) cho Dev Team.

## Nội dung chính

### Tiêu chuẩn chung cho một Ticket được coi là "Ready"
Một User Story hoặc Task chỉ được phép đưa vào Sprint Planning khi đạt TẤT CẢ các điều kiện sau:

- [ ] **Giá trị rõ ràng (Clear Value)**: Mục đích và giá trị mang lại cho người dùng cuối (hoặc hệ thống) được định nghĩa rõ ràng ("Là một [user], tôi muốn [hành động] để [nhận được giá trị]").
- [ ] **Tiêu chí chấp nhận (Acceptance Criteria - AC)**: AC đã được định nghĩa chi tiết, dễ hiểu và có thể test được (VD: Bằng định dạng Given/When/Then).
- [ ] **Thiết kế (Design UI/UX)**: Đã có đủ các bản thiết kế UI, mockups, flowcharts trên Figma (đã chốt, không còn ở trạng thái Draft).
- [ ] **Phụ thuộc (Dependencies)**: Các rào cản hoặc phụ thuộc bên ngoài (API từ bên thứ 3, hạ tầng, giấy phép) đã được giải quyết hoặc xác định rõ ràng là có sẵn.
- [ ] **Khả năng ước lượng (Estimable)**: Team đã hiểu rõ vấn đề, có thể hình dung ra giải pháp kỹ thuật và có thể ước lượng kích cỡ (Story Points hoặc số giờ).
- [ ] **Phạm vi vừa phải (Sized Properly)**: Kích thước của công việc không được lớn hơn khả năng hoàn thành trong 1 Sprint. Nếu quá lớn (Epic), phải được chia nhỏ (Slice) thành các Stories nhỏ hơn.

## Ví dụ cụ thể (Internet Immune System Context)
**Không Ready**: "Thêm tính năng AI quét trang web." (Quá chung chung, không có AC, không rõ thiết kế).

**Ready**:
- *Story*: "Là người dùng, tôi muốn thấy cảnh báo màu đỏ hiện lên khi AI xác định trang web hiện tại là phishing, để tôi không bị lừa mất mật khẩu."
- *Acceptance Criteria*:
  - Cảnh báo phải che 100% nội dung trang web.
  - Có nút "Tôi hiểu rủi ro và tiếp tục" (nhỏ) và nút "Quay lại an toàn" (to, nổi bật).
  - Thời gian AI response < 2 giây.
- *Thiết kế*: Kèm link Figma màn hình cảnh báo.
- *Kỹ thuật*: Có sẵn API endpoint `POST /api/v1/scan` từ backend.

## Checklist
- [ ] Áp dụng DoR như bộ lọc chính trong buổi Backlog Refinement.
- [ ] PO/PM chịu trách nhiệm chính trong việc chuẩn bị các ticket đạt chuẩn DoR.
- [ ] Dev Team có quyền "Reject" (Từ chối) đưa vào Sprint những ticket chưa đạt DoR.

## Tài liệu liên quan
- [Sprint Process](SprintProcess.md)
- [Definition of Done](DefinitionOfDone.md)

## Việc cần làm tiếp
- Tạo Template tạo Issue/Ticket trên công cụ quản lý để bắt buộc người điền phải cung cấp đủ Acceptance Criteria.
