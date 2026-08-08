# User Stories: Internet Immune System

## Mục tiêu
Chuyển đổi các tính năng thành góc nhìn của người dùng cuối thông qua định dạng User Story chuẩn Agile (`Là một [persona], tôi muốn [action], để [benefit]`). Điều này giúp đội ngũ phát triển thấu hiểu giá trị mang lại cho người dùng.

## Nội dung chính

### Epic 1: Phát hiện và Cảnh báo (Detect & Explain)
- **US-1.1:** Là một người dùng phổ thông, tôi muốn dán một đường link lạ vào hệ thống, để hệ thống phân tích xem đó có phải trang web lừa đảo không trước khi tôi cung cấp thông tin.
- **US-1.2:** Là một người dùng, tôi muốn nhận được cảnh báo rõ ràng (Màu Đỏ/Cảnh báo lớn) nếu nội dung chứa dấu hiệu lừa đảo, để tôi dừng lại ngay lập tức.
- **US-1.3:** Là một người dùng, tôi muốn đọc phần giải thích chi tiết "Tại sao" đây là lừa đảo (ví dụ: dùng từ ngữ tạo áp lực, domain giả mạo), để tôi học được cách nhận biết thủ đoạn này.
- **US-1.4:** Là một người dùng, tôi muốn hệ thống phân tích cả ảnh chụp màn hình tin nhắn (OCR + AI), để tôi kiểm tra các tin nhắn rác trên Zalo/SMS.

### Epic 2: Trải nghiệm Hậu quả (Consequence Simulation)
- **US-2.1:** Là một người dùng, tôi muốn xem một đoạn mô phỏng trực quan về điều gì sẽ xảy ra nếu tôi tin lời kẻ lừa đảo, để tôi cảm nhận được tính nghiêm trọng của vấn đề.
- **US-2.2:** Là một người dùng, tôi muốn hậu quả được mô phỏng phù hợp với đúng kịch bản tôi đang gặp phải (ví dụ: kịch bản giả danh công an -> hậu quả bị tống tiền/chuyển khoản), để trải nghiệm chân thực nhất.

### Epic 3: Huấn luyện và Miễn dịch (Train)
- **US-3.1:** Là một người dùng, tôi muốn tham gia các bài test tương tác giả định các tình huống lừa đảo mới nhất, để tôi rèn luyện sự nhạy bén.
- **US-3.2:** Là một người dùng, tôi muốn nhận được điểm thưởng/huy hiệu ("Kháng thể số") sau khi hoàn thành huấn luyện, để tôi có động lực tiếp tục học hỏi.

### Epic 4: Bảo vệ Thời gian thực (Real-time Protect - Extension)
- **US-4.1:** Là một người dùng am hiểu công nghệ, tôi muốn cài đặt Extension này cho trình duyệt của bố mẹ, để họ được bảo vệ tự động mà không cần thao tác kiểm tra thủ công.
- **US-4.2:** Là một người dùng, tôi muốn Extension sẽ tự động chặn hoặc làm mờ các form nhập liệu trên trang web nếu phát hiện đó là trang phishing, để ngăn chặn tôi nhập mật khẩu.

### Epic 5: Quản lý và Cộng đồng (Dashboard & Share)
- **US-5.1:** Là một người dùng, tôi muốn xem bảng điều khiển tổng hợp các cảnh báo tôi đã nhận và kỹ năng của tôi, để tôi biết mức độ an toàn của mình.
- **US-5.2:** Là một người dùng, tôi muốn có nút bấm chia sẻ nhanh báo cáo lừa đảo qua mạng xã hội, để cảnh báo bạn bè không mắc bẫy tương tự.

## Checklist
- [x] Bao phủ toàn bộ 5 Core Modes của sản phẩm.
- [x] Sử dụng đúng cú pháp User Story.
- [x] Phân chia theo các Epic hợp lý.

## Tài liệu liên quan
- [Feature List](FeatureList.md)
- [Acceptance Criteria](AcceptanceCriteria.md)

## Việc cần làm tiếp
- Gắn Acceptance Criteria (Tiêu chí chấp nhận) cho từng User Story.
- Đưa các User Story vào Backlog để chuẩn bị cho Sprint Planning.
