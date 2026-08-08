# Feature List: Internet Immune System

## Mục tiêu
Cung cấp một danh mục tính năng (Feature Catalog) toàn diện và chi tiết cho hệ thống. Danh sách này được sử dụng để lập kế hoạch phát triển, phân bổ tài nguyên, và theo dõi tiến độ.

## Nội dung chính

Hệ thống được xoay quanh **5 Core Modes**: Detect, Simulate, Explain, Train, Protect.

| Feature ID | Tên Feature | Mô tả | User Story (Tóm tắt) | Độ ưu tiên | Effort Estimate | Dependencies |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **F-01** | **Smart Detect** | Phân tích URL, nội dung tin nhắn, email để phát hiện lừa đảo bằng Gemini. | Là người dùng, tôi muốn công cụ phân tích link tôi chuẩn bị bấm vào để biết có an toàn không. | P0 (High) | 5 days | Gemini API, Firebase |
| **F-02** | **Consequence Simulation** | Mô phỏng trực quan các hậu quả (mất tiền, lộ thông tin) nếu user làm theo lời kẻ lừa đảo. | Là người dùng, tôi muốn thấy điều tồi tệ nhất có thể xảy ra để nâng cao cảnh giác. | P0 (High) | 7 days | F-01, UI/UX Engine |
| **F-03** | **AI Explainer** | Giải thích chi tiết các "Red Flags" theo ngôn ngữ dễ hiểu, chỉ ra thủ thuật tâm lý kẻ gian dùng. | Là người dùng, tôi muốn hiểu TẠI SAO tin nhắn này là lừa đảo. | P0 (High) | 4 days | F-01, Gemini API |
| **F-04** | **Real-time Protect (Extension)** | Chrome Extension quét liên tục nội dung DOM để cảnh báo kịp thời mà không cần user chủ động copy-paste. | Là người dùng, tôi muốn tự động được bảo vệ khi lướt web mà không cần thao tác thêm. | P1 (Medium)| 10 days | Chrome API, API Backend |
| **F-05** | **Interactive Train** | Đưa ra các tình huống lừa đảo giả lập (do AI sinh ra) để người dùng thực hành nhận diện. | Là người dùng, tôi muốn luyện tập kỹ năng phát hiện lừa đảo qua các bài test tương tác. | P1 (Medium)| 8 days | Gemini API (Generator) |
| **F-06** | **Immunity Dashboard** | Trang thống kê "kháng thể" người dùng thu thập được, lịch sử phát hiện, bảng xếp hạng. | Là người dùng, tôi muốn xem lịch sử bảo vệ và tiến bộ của mình để có động lực. | P2 (Low) | 5 days | Firebase Firestore, Auth |
| **F-07** | **Report & Share** | Báo cáo các mẫu lừa đảo mới và chia sẻ cảnh báo cho người thân qua mạng xã hội. | Là người dùng, tôi muốn chia sẻ cảnh báo để bảo vệ gia đình và cộng đồng. | P2 (Low) | 3 days | Cloud Run, Firestore |

### Chi tiết Acceptance Criteria (Tiêu chí chấp nhận)

**Đối với F-01 (Smart Detect):**
- Hệ thống phải nhận text/URL từ người dùng.
- Trả về kết quả Xanh (An toàn), Vàng (Nghi ngờ), Đỏ (Lừa đảo) trong vòng <3s.
- Cần có log ghi nhận trên Firebase.

**Đối với F-02 (Consequence Simulation):**
- UI phải hiển thị dạng Immersive (ví dụ: màn hình điện thoại rung lên, tin nhắn trừ tiền tài khoản ngân hàng).
- Nội dung mô phỏng phải bám sát với ngữ cảnh lừa đảo cụ thể (Gemini sinh ra).

## Checklist
- [x] Liệt kê đầy đủ tính năng theo 5 Core Modes.
- [x] Phân bổ Độ ưu tiên (Priority) hợp lý cho MVP.
- [x] Ước lượng Effort (Man-days) sơ bộ.
- [x] Xác định Dependencies giữa các tính năng.

## Tài liệu liên quan
- [PRD](PRD.md)
- [User Stories](UserStories.md)

## Việc cần làm tiếp
- Cập nhật Feature List này thành các task cụ thể trên Jira/Trello hoặc Github Projects.
- Đội Technical phân bổ nguồn lực dựa trên Effort Estimate.
