# Acceptance Criteria & Definition of Done

## Mục tiêu
Thiết lập các tiêu chuẩn rõ ràng để đánh giá khi nào một tính năng (Feature) hoặc User Story được coi là hoàn thành. Đảm bảo chất lượng sản phẩm (QA/QC) và sự nhất quán trong toàn đội ngũ, đặc biệt là đáp ứng tiêu chuẩn của một sản phẩm dự thi AI Riser Vietnam.

## Nội dung chính

### 1. Definition of Done (DoD) - Tiêu chuẩn chung
Một tính năng chỉ được đánh dấu là "Done" khi thỏa mãn TẤT CẢ các điều kiện sau:
- [ ] Code đã được viết và lưu trữ trên Git Repository (GitHub/GitLab).
- [ ] Code không chứa các thông tin nhạy cảm (API Keys, Secrets) dạng hardcode. Đã sử dụng biến môi trường (Environment Variables).
- [ ] Tính năng đã được kiểm thử cục bộ (Local Testing) bởi Developer.
- [ ] Tính năng đã được deploy thành công lên môi trường Staging/Test (Cloud Run/Firebase Hosting).
- [ ] Không phát sinh lỗi nghiêm trọng (Fatal/Crash) trên Console.
- [ ] Tích hợp Firebase Analytics cho tính năng này đã được cài đặt và hoạt động.
- [ ] Tài liệu kỹ thuật hoặc API Docs liên quan đã được cập nhật (nếu có).
- [ ] Giao diện (UI) hiển thị đúng thiết kế trên cả thiết bị Mobile và Desktop (Responsive).

### 2. Acceptance Criteria (AC) - Tiêu chí chấp nhận cụ thể

#### Epic: Smart Detect (Phát hiện lừa đảo)
- **AC1:** Khi người dùng nhập một đoạn văn bản hoặc URL, hệ thống phải gọi tới Gemini API thành công.
- **AC2:** Thời gian chờ kết quả phản hồi không được vượt quá 5 giây với kết nối mạng ổn định.
- **AC3:** Kết quả trả về phải bao gồm: Mức độ rủi ro (Risk Level: Safe/Warning/Danger), Tóm tắt lý do, và Danh sách các Dấu hiệu cảnh báo (Red Flags).
- **AC4:** Nếu API lỗi hoặc quá tải, UI phải hiển thị thông báo lỗi thân thiện với người dùng ("Hệ thống đang bận, vui lòng thử lại sau"), không hiển thị mã lỗi kỹ thuật.

#### Epic: Consequence Simulation (Mô phỏng hậu quả)
- **AC1:** Khi bấm vào "Mô phỏng", hệ thống phải tạo ra một kịch bản liên quan trực tiếp đến nội dung phân tích trước đó.
- **AC2:** Giao diện mô phỏng phải sử dụng UI Components sinh động (Animation, Cảnh báo đỏ, Mock UI của điện thoại/ngân hàng).
- **AC3:** Nội dung mô phỏng không được chứa ngôn từ vi phạm tiêu chuẩn cộng đồng hoặc quá bạo lực (Tuân thủ Gemini Safety Guidelines).

#### Epic: Real-time Extension (Bảo vệ thời gian thực)
- **AC1:** Extension cài đặt thành công trên Chrome.
- **AC2:** Extension tự động quét các thẻ `<a>` và form `<input>` trên các trang web thuộc whitelist để test.
- **AC3:** Nếu phát hiện trang web lừa đảo, Extension tự động tiêm (inject) một lớp overlay (màn hình đỏ) chặn toàn bộ tương tác trên trang web đó và hiển thị nút "Quay lại an toàn".

## Checklist
- [x] Định nghĩa rõ ràng DoD chung cho toàn bộ Project.
- [x] Cung cấp AC cho các Core Epics.
- [x] Bao gồm các yêu cầu về hiệu năng và xử lý lỗi.

## Tài liệu liên quan
- [User Stories](UserStories.md)
- [PRD](PRD.md)

## Việc cần làm tiếp
- Tích hợp DoD và AC này vào quy trình Review Pull Request (PR).
- Đội ngũ Tester (nếu có) sử dụng tài liệu này để viết Test Cases.
