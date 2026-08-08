# Bản đồ hành trình khách hàng (User Journey)

## Mục tiêu
Vẽ ra hành trình từ lúc người dùng tiếp xúc với rủi ro lừa đảo, sử dụng **Internet Immune System** để nhận diện và phòng tránh, cho đến cảm xúc và hành động sau khi được bảo vệ thành công. Điều này giúp định vị các "điểm chạm" (touchpoints) quan trọng nhất.

## Nội dung chính

### 1. Kịch bản 1: "Cú điện thoại từ Cơ quan điều tra" (Người dùng: Cô Lan - Người nội trợ)

| Giai đoạn | Trải nghiệm của người dùng | Cảm xúc & Suy nghĩ | Vai trò của Internet Immune System (Touchpoint) |
| :--- | :--- | :--- | :--- |
| **Tiếp xúc (Trigger)** | Nhận cuộc gọi tự xưng là công an, báo có bưu phẩm chứa ma túy. Yêu cầu kết bạn Zalo để làm việc. | Hoảng sợ, bối rối, lo lắng cực độ. *"Tôi có làm gì sai đâu?"* | (Hệ thống chưa can thiệp lúc nghe điện thoại thông thường). |
| **Tương tác (Interaction)** | Kẻ lừa đảo gửi qua Zalo "Lệnh bắt giam" có dấu đỏ và yêu cầu chuyển tiền bảo lãnh vào tài khoản. | Căng thẳng, tin tưởng vì thấy giấy tờ có mộc đỏ. Chuẩn bị thao tác chuyển khoản. | Cô Lan nhớ lời con dặn, chụp ảnh màn hình "Lệnh bắt giam" và gửi vào ứng dụng Hệ Miễn Dịch. |
| **Phân tích (Analysis)** | Người dùng chờ đợi kết quả. | Hồi hộp. | **Gemini AI xử lý**: Đọc văn bản, phát hiện lỗi chính tả, đối chiếu format văn bản pháp luật, nhận diện tài khoản ngân hàng cá nhân thay vì kho bạc. |
| **Can thiệp & Mô phỏng hậu quả (Intervention)** | Hệ thống báo ĐỎ. Hiển thị thông báo: *"CẢNH BÁO: Giấy tờ giả mạo. Cơ quan CA không làm việc qua Zalo"*. **Mô phỏng**: *"Nếu cô chuyển 50 triệu lúc này, tiền sẽ bị tẩu tán sang Campuchia trong 10 giây và không thể lấy lại."* | "Thức tỉnh", bừng tỉnh. Giảm hoảng sợ. Chuyển sang cảm thấy may mắn. | Cung cấp lý do cụ thể và minh chứng (ảnh bài báo về vụ lừa đảo tương tự). |
| **Hậu kỳ (Post-protection)** | Chặn Zalo kẻ lừa đảo, kể lại cho gia đình. | An tâm, tin tưởng ứng dụng. | Gửi thông báo khích lệ: *"Chúc mừng cô đã tránh được một vụ lừa đảo. Hãy chia sẻ app cho người thân."* |

### 2. Kịch bản 2: "Việc nhẹ lương cao - Đơn hàng đầu tiên" (Người dùng: Minh - Sinh viên)

| Giai đoạn | Trải nghiệm của người dùng | Cảm xúc & Suy nghĩ | Vai trò của Internet Immune System (Touchpoint) |
| :--- | :--- | :--- | :--- |
| **Tiếp xúc (Trigger)** | Thấy quảng cáo trên Facebook: "Xem video TikTok nhận 500k/ngày", click vào link nhóm Telegram. | Tò mò, hưng phấn, muốn kiếm tiền nhanh. | Tùy thuộc vào việc hệ thống có theo dõi clipboard hoặc được người dùng chủ động hỏi hay không. |
| **Tương tác (Interaction)** | Vào nhóm, thấy nhiều "người" khoe biên lai nhận tiền. Admin yêu cầu nạp 500k để mở khóa "nhiệm vụ cao cấp". | Nửa tin nửa ngờ, sợ mất cơ hội. Lấy link website đăng ký nạp tiền. | Minh copy link website lạ và dán vào ứng dụng Hệ Miễn Dịch để nhờ kiểm tra. |
| **Phân tích (Analysis)** | Minh chờ kết quả. | Kỳ vọng. | **AI & Threat Intel xử lý**: Phân tích tên miền (mới tạo 3 ngày), server đặt tại nước ngoài, không có chứng chỉ an toàn, nội dung website khớp với mẫu "Lừa đảo CTV". |
| **Can thiệp (Intervention)** | Hệ thống giải thích: *"Đây là mô hình lừa đảo đa cấp Ponzi. Họ sẽ cho bạn ăn 1-2 lần đầu vài chục ngàn, sau đó sẽ yêu cầu nạp số tiền lớn và khóa tài khoản."* | Hụt hẫng (vì mất cơ hội kiếm tiền), nhưng tỉnh táo nhận ra sự thật. | Cung cấp phân tích logic để đánh bại sự "tham lam" và tự tin thái quá của người dùng. |
| **Hậu kỳ (Post-protection)** | Thoát khỏi nhóm Telegram, report quảng cáo. | Nhận thức cao hơn về an toàn. | Ghi nhận case lừa đảo mới vào hệ thống chung để bảo vệ người khác. |

## Checklist
- [x] Lập bản đồ hành trình cho ít nhất 2 kịch bản chính.
- [x] Xác định rõ cảm xúc người dùng (Emotional journey) và vai trò của AI.
- [ ] Thiết kế luồng User Flow chi tiết (Wireframes) dựa trên Journey này.

## Tài liệu liên quan
- [UserPersonas.md](./UserPersonas.md)
- [FraudPatterns.md](../02_Research/FraudPatterns.md)

## Việc cần làm tiếp
- Tổ chức workshop vẽ Customer Journey Map với đội ngũ UI/UX để đưa ra các thiết kế màn hình tương ứng.
