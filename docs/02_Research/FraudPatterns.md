# Phân loại và Mẫu lừa đảo (Fraud Patterns)

## Mục tiêu
Xây dựng một danh mục (catalog) chi tiết các hình thức lừa đảo trực tuyến phổ biến tại Việt Nam. Tài liệu này đóng vai trò làm dữ liệu nền (grounding data) để huấn luyện hoặc cung cấp ngữ cảnh cho Gemini AI khi phân tích các trường hợp nghi ngờ.

## Nội dung chính

### 1. Phishing & Giả mạo cơ quan chức năng
- **Giả mạo Công an, Viện kiểm sát**: Gọi điện đe dọa nạn nhân liên quan đến đường dây ma túy, rửa tiền, hoặc vi phạm giao thông. Yêu cầu chuyển tiền vào "tài khoản tạm giữ của cơ quan điều tra" để xác minh.
- **Giả mạo cán bộ thuế, bảo hiểm xã hội**: Yêu cầu cài đặt ứng dụng Dịch vụ công giả mạo (file .apk chứa mã độc) để chiếm quyền điều khiển điện thoại (Accessibility Services), từ đó chiếm đoạt mã OTP và rút tiền từ tài khoản ngân hàng.
- **Brandname giả mạo**: Gửi tin nhắn SMS chứa link phishing giả mạo ngân hàng, thông báo tài khoản bị khóa và yêu cầu đăng nhập để mở khóa.

### 2. Lừa đảo Đầu tư & Tài chính (Investment Scams)
- **Lừa đảo "Việc nhẹ lương cao"**: Mời làm cộng tác viên (CTV) chốt đơn Shopee, Lazada, TikTok, thanh toán đơn hàng trước nhận hoa hồng sau. Những đơn đầu trả tiền sòng phẳng, các đơn lớn sau đó báo lỗi hệ thống và bắt nạp thêm tiền.
- **Đầu tư chứng khoán quốc tế, Forex, Tiền ảo**: Lôi kéo vào các nhóm Telegram/Zalo có nhiều "chim mồi" khoe lãi. Cung cấp app/web đầu tư giao diện đẹp nhưng hoàn toàn do đối tượng điều khiển (chỉnh sửa số liệu ảo). Khi muốn rút tiền phải đóng phí xác minh, phí thuế.

### 3. Lừa đảo Tình cảm (Romance Scams)
- **Bẫy tình tài chính (Pig Butchering Scam - Mổ lợn)**: Đối tượng xây dựng profile hoàn hảo (doanh nhân, người thành đạt), tiếp cận nạn nhân qua ứng dụng hẹn hò (Tinder) hoặc mạng xã hội. Dành thời gian dài xây dựng tình cảm, sau đó rủ rê đầu tư tài chính chung và lừa chiếm đoạt.
- **Tặng quà từ nước ngoài**: Giả danh người nước ngoài, gửi quà giá trị cao về Việt Nam. Sẽ có đối tượng giả mạo hải quan gọi điện yêu cầu đóng phí thông quan, phí phạt để nhận quà.

### 4. Lừa đảo Thương mại điện tử (Fake E-commerce)
- **Bán hàng giả, hàng không tồn tại**: Yêu cầu chuyển khoản trước hoặc đặt cọc, sau đó chặn liên lạc.
- **Chiếm đoạt tài khoản (Account Takeover)**: Gửi link bình chọn, nhận quà để lừa nạn nhân đăng nhập Facebook/Zalo, sau đó dùng tài khoản chiếm được đi vay tiền bạn bè.

### 5. Các hình thức lừa đảo kỹ thuật số khác
- **Deepfake cuộc gọi Video**: Sử dụng AI để ghép mặt và giả giọng người thân, gọi điện qua Messenger/Zalo mượn tiền gấp. Đặc điểm: Cuộc gọi thường ngắn, chất lượng hình ảnh kém, lấy lý do mạng yếu.
- **SIM Swap / Chiếm đoạt SIM**: Lừa nạn nhân nhắn tin theo cú pháp chuyển đổi SIM sang e-SIM của đối tượng, từ đó chiếm đoạt số điện thoại để nhận mã OTP ngân hàng.

## Checklist
- [x] Phân loại theo các nhóm chính.
- [x] Mô tả chi tiết kịch bản và cách thức hoạt động (modus operandi).
- [ ] Cập nhật các mẫu lừa đảo mới (Zero-day scams) định kỳ.

## Tài liệu liên quan
- [TechResearch.md](./TechResearch.md)
- [MarketResearch.md](./MarketResearch.md)

## Việc cần làm tiếp
- Chuyển đổi các kịch bản này thành định dạng JSON hoặc Vector Database để hệ thống AI (RAG - Retrieval-Augmented Generation) có thể truy xuất nhanh chóng.
