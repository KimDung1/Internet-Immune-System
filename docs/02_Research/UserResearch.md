# Nghiên cứu người dùng (User Research)

## Mục tiêu
Phân tích hành vi, tâm lý và những điểm yếu (vulnerabilities) của người dùng Internet tại Việt Nam trước các hình thức lừa đảo trực tuyến. Hiểu rõ nguyên nhân vì sao người dùng dễ sập bẫy và từ đó xác định cách thức tiếp cận phù hợp cho **Internet Immune System**.

## Nội dung chính

### 1. Phương pháp nghiên cứu (Research Methodology)
- **Secondary Research (Nghiên cứu thứ cấp)**: Phân tích các báo cáo hành vi người tiêu dùng từ Google, Meta, các công ty an ninh mạng (Viettel Cyber Security, Bkav, NCS, Kaspersky) và các báo cáo quốc gia về kỹ năng số.
- **Case Study Analysis**: Đánh giá chi tiết (post-mortem) các vụ lừa đảo lớn được báo chí phản ánh (lừa đảo tuyển dụng CTV, lừa đảo đầu tư tiền ảo, giả mạo công an).
- **Phân tích tâm lý học xã hội**: Ứng dụng các lý thuyết về kỹ thuật xã hội (Social Engineering) để giải mã hành vi thao túng tâm lý của tội phạm.

### 2. Phát hiện chính (Key Findings) về mức độ dễ bị tổn thương của người dùng Việt Nam
- **Khoảng trống về kiến thức số (Digital Literacy Gap)**: Một bộ phận lớn người dùng (đặc biệt là người lớn tuổi, phụ nữ nội trợ, người lao động thu nhập thấp) biết cách sử dụng smartphone và mạng xã hội nhưng không hiểu rõ cơ chế hoạt động của internet, bảo mật tài khoản hay mã hóa.
- **Thói quen chia sẻ thông tin**: Người dùng có thói quen chia sẻ quá mức (oversharing) thông tin cá nhân (CCCD, số điện thoại, địa chỉ nhà, quan hệ gia đình) lên mạng xã hội, tạo điều kiện cho tội phạm thu thập OSINT (Open Source Intelligence).
- **Tâm lý sợ hãi và tham lam**: 
  - *Sợ hãi (Fear)*: Dễ bị thao túng bởi các kịch bản đe dọa (giả mạo công an, viện kiểm sát báo vi phạm pháp luật).
  - *Tham lam (Greed)*: Dễ tin vào các hứa hẹn lợi nhuận cao, công việc nhẹ lương cao (làm nhiệm vụ TikTok, Shopee).
- **Thiếu khả năng nhận diện khi sự việc chưa xảy ra**: **(Key Insight)** Người dùng thường có tâm lý "việc này sẽ không xảy ra với mình" hoặc quá tự tin. Họ không nhận ra các dấu hiệu (red flags) cho đến khi đã chuyển tiền.
- **Thiếu công cụ hỗ trợ thời gian thực (Real-time Assistance)**: Khi nghi ngờ, người dùng không có công cụ chuyên sâu để kiểm chứng thông tin, thường chỉ biết hỏi người thân (có thể cũng không có chuyên môn) hoặc tìm kiếm Google một cách thụ động.

### 3. Đề xuất cho sản phẩm
- **Không chỉ là cảnh báo**: Cảnh báo đơn thuần (chữ đỏ, biểu tượng nguy hiểm) thường bị bỏ qua (Warning Fatigue). Cần phải **mô phỏng hậu quả (Consequence Simulation)** để đánh mạnh vào cảm xúc của người dùng, giúp họ "thức tỉnh" trước khi hành động.
- **Giải thích bằng AI (AI Explanation)**: Sử dụng AI để bóc tách từng chi tiết vô lý trong tin nhắn lừa đảo và giải thích cho người dùng bằng ngôn ngữ dễ hiểu, thân thiện, không mang tính công nghệ khô khan.

## Checklist
- [x] Xác định các lỗ hổng tâm lý chính.
- [x] Đưa ra insight cốt lõi: Cần mô phỏng hậu quả.
- [ ] Hoàn thiện khảo sát định lượng (Quantitative Survey) với mẫu 1000 người dùng thực tế.

## Tài liệu liên quan
- [UserPersonas.md](../03_User/UserPersonas.md)
- [UserPainPoints.md](../03_User/UserPainPoints.md)

## Việc cần làm tiếp
- Tổ chức các buổi phỏng vấn sâu (In-depth Interviews) với những người từng là nạn nhân của lừa đảo.
- Phân tích hiệu quả của các chiến dịch nâng cao nhận thức truyền thống so với giải pháp AI.
