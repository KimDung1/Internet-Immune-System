# Minimum Viable Product (MVP): Internet Immune System

## Mục tiêu
Xác định phạm vi cốt lõi của sản phẩm (MVP) để ưu tiên phát triển, nhằm tạo ra phiên bản hoàn thiện nhất, ấn tượng nhất phục vụ cho việc Demo tại cuộc thi AI Riser Vietnam. Giảm thiểu các tính năng không cần thiết để tối ưu hóa thời gian và nguồn lực.

## Nội dung chính

### 1. Trọng tâm của MVP
MVP sẽ tập trung vào **"The AI Experience"** - Chứng minh khả năng của hệ thống trong việc thay đổi nhận thức người dùng.
Phiên bản này sẽ là một **Web Application** (Progressive Web App - PWA) kết hợp với một **Chrome Extension cơ bản**.

### 2. Phạm vi tính năng MVP (In Scope)

1. **Giao diện Web App (Trung tâm điều khiển & Trải nghiệm)**
   - **Input Box:** Nơi người dùng dán tin nhắn, email, hoặc URL nghi ngờ.
   - **Smart Detect Engine:** Sử dụng Gemini để phân tích nội dung, nhận diện các thủ đoạn lừa đảo (Giả danh công an, Trúng thưởng, Tuyển dụng lừa đảo, Phishing ngân hàng).
   - **Explain UI:** Hiển thị kết quả trực quan với các thẻ "Red Flags" được highlight rõ ràng.
   - **Simulate Mode:** Sinh ra một đoạn hội thoại hoặc kịch bản hậu quả sinh động bằng AI.

2. **Chrome Extension (Bảo vệ chủ động)**
   - Chỉ hoạt động ở mức MVP: Cảnh báo người dùng khi truy cập vào một URL được Extension quét qua API của hệ thống và bị đánh giá là rủi ro cao.
   - Hiển thị pop-up cảnh báo do Gemini sinh ra giải thích lý do chặn.

3. **Cơ sở hạ tầng & Backend**
   - API viết bằng Node.js / Python trên Cloud Run.
   - Tích hợp Gemini API (Pro/Flash) với Prompt được tối ưu hóa.
   - Đăng nhập (Authentication) cơ bản bằng Firebase (Google Sign-in).

### 3. Các tính năng nằm ngoài MVP (Out of Scope - Dành cho v2.0)
- **Interactive Train:** Chế độ huấn luyện và cấp chứng chỉ/điểm số phức tạp.
- **Phân tích hình ảnh (OCR chuyên sâu):** Phân tích ảnh chụp màn hình bill chuyển khoản giả mạo (sẽ thêm vào nếu còn thời gian).
- **Crowdsourcing Report:** Hệ thống cho phép người dùng tự báo cáo và duyệt web lừa đảo.
- **Native Mobile Apps (iOS/Android):** Hiện tại tập trung vào Web và Extension.

### 4. Kịch bản Demo tại AI Riser Vietnam (Demo Flow)
1. **Hook:** Bắt đầu bằng một tin nhắn lừa đảo thực tế tại Việt Nam (ví dụ: "Cơ quan thuế yêu cầu cài đặt ứng dụng...").
2. **Action:** Copy tin nhắn đó dán vào Internet Immune System.
3. **Wow Moment 1 (Explain):** Hệ thống chỉ ra ngay 3 điểm bất thường trong tin nhắn (Giọng điệu dọa nạt, Link APK đuôi lạ, v.v.).
4. **Wow Moment 2 (Simulate):** Nhấn nút "Nếu tôi tin thì sao?". Hệ thống tạo ra một mô phỏng: "Điện thoại của bạn sẽ bị chiếm quyền điều khiển -> Tài khoản VCB bị trừ 50 triệu -> Dữ liệu danh bạ bị lấy cắp". Trực quan và gây shock.
5. **Conclusion:** Chuyển sang trình duyệt có cài Extension, thử bấm vào link lừa đảo -> Bị chặn đứng ngay lập tức với lời giải thích từ AI.

## Checklist
- [x] Chốt phạm vi In Scope và Out of Scope cho MVP.
- [x] Lên kịch bản Demo rõ ràng.
- [x] Đảm bảo MVP thể hiện đủ sức mạnh của Gemini AI.

## Tài liệu liên quan
- [PRD](PRD.md)
- [Feature List](FeatureList.md)

## Việc cần làm tiếp
- Đóng băng phạm vi (Feature Freeze) để tập trung code.
- Xây dựng Prototype/Mockup trên Figma dựa theo kịch bản Demo.
- Tối ưu hóa System Prompt cho Gemini để đảm bảo kết quả trả về trong Demo luôn ổn định và ấn tượng.
