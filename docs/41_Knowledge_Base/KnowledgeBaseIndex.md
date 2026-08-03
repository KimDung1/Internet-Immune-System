# Knowledge Base Index

## Mục tiêu
Đóng vai trò là mục lục tra cứu nhanh cho toàn bộ tài liệu tri thức nội bộ. Giúp kỹ sư và nhân viên dự án dễ dàng tìm kiếm từ vựng chuyên ngành, FAQ và các mô hình nghiệp vụ (Domain Models).

## Nội dung chính

### 1. Thuật ngữ và Khái niệm (Glossary)
- **Consequence Simulation (Mô phỏng hậu quả)**: Tính năng sử dụng AI để tạo ra các kịch bản/hình ảnh thực tế về điều gì sẽ xảy ra nếu người dùng nhấp vào một link lừa đảo (ví dụ: bị lộ mật khẩu, mất tiền trong ví).
- **AI Explanation (Giải thích AI)**: Thay vì chỉ báo "Nguy hiểm", AI phân tích cụ thể tại sao link hoặc nội dung đó đáng ngờ (ví dụ: "URL có sai chính tả chữ 'amazon' thành 'arnazon'").
- **Zero-Trust Analysis**: Hệ thống không tin tưởng bất kỳ tên miền nào cho đến khi được đánh giá kỹ lưỡng, nhưng vẫn có whitelist cục bộ để giảm thiểu call API.

### 2. Các mô hình nghiệp vụ (Domain Models)
- **User Profile**: Chứa thông tin cấu hình cảnh báo, điểm tin cậy (Trust Score) dựa trên kết quả các đợt mô phỏng.
- **Threat Intelligence Feed**: Cơ sở dữ liệu chứa mẫu các URL, Email lừa đảo đã được báo cáo, liên tục được làm giàu bởi hệ thống và bên thứ ba.
- **Analysis Event**: Một bản ghi trên Firestore theo dõi một truy vấn AI, chứa `payload`, `ai_response`, `latency`, `timestamp`.

### 3. FAQ (Câu hỏi thường gặp)
**Q: Hệ thống có đọc tin nhắn riêng tư của người dùng không?**
A: KHÔNG. Chrome Extension được cấu hình chỉ quét các URL công khai hoặc cấu trúc trang đã được định nghĩa. Mọi dữ liệu nhạy cảm phải được loại bỏ (sanitize) ở client-side trước khi gửi lên AI.

**Q: Tại sao lại chọn Firebase?**
A: Firebase cung cấp khả năng đẩy dữ liệu realtime thông qua WebSockets (Firestore) rất tốt, cho phép extension hiển thị cảnh báo ngay lập tức khi backend phân tích xong rủi ro.

## Checklist
- [ ] Phân loại rõ ràng các liên kết đến tài liệu cấp dưới.
- [ ] Kiểm tra định kỳ các đường dẫn nội bộ (broken links).

## Tài liệu liên quan
- [Project Wiki](file:///e:/PJ/docs/41_Knowledge_Base/ProjectWiki.md)
- [Scam Taxonomy](file:///e:/PJ/docs/41_Knowledge_Base/ScamTaxonomy.md)

## Việc cần làm tiếp
- Thêm phần Threat Intelligence API Documentation.
- Cập nhật các thuật ngữ liên quan đến công nghệ Machine Learning và Prompt Engineering.
