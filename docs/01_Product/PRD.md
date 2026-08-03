# Product Requirements Document (PRD): Internet Immune System

## Mục tiêu
Định nghĩa toàn diện các yêu cầu sản phẩm cho "Internet Immune System" - Hệ thống Miễn dịch AI cho Internet. PRD đóng vai trò là Nguồn Chân lý Đơn nhất (Single Source of Truth) để đội ngũ kỹ thuật, thiết kế và phát triển sản phẩm nắm bắt tầm nhìn, phạm vi và mục tiêu của dự án, đặc biệt hướng tới cuộc thi AI Riser Vietnam.

## Nội dung chính

### 1. Vision & Tầm nhìn
**"Your AI Immune System for the Internet"** - Trao quyền cho người dùng Internet khả năng tự bảo vệ trước các mối đe dọa lừa đảo trực tuyến bằng cách sử dụng sức mạnh của AI. Không chỉ là một công cụ chặn (blocker), đây là một "Hệ thống miễn dịch" chủ động: Phát hiện, Mô phỏng Hậu quả, Giải thích, Đào tạo và Bảo vệ theo thời gian thực (Real-time).

### 2. Problem Statement (Vấn đề)
Các hình thức lừa đảo trên không gian mạng ngày càng tinh vi (phishing, social engineering, giả mạo danh tính, deepfake) dễ dàng qua mặt các bộ lọc truyền thống. Người dùng thiếu nhận thức và không thể hình dung được hậu quả cho đến khi quá muộn. Các công cụ hiện tại thường bị động, chỉ cảnh báo hoặc chặn mà không giải thích "tại sao" (Explainability) và không giúp người dùng tự nhận biết trong tương lai (Training).

### 3. User Personas (Chân dung người dùng)
- **Người dùng phổ thông (The Vulnerable):** Ít kiến thức về an toàn thông tin, dễ tin tưởng, thường xuyên giao dịch và mua sắm online (Ví dụ: Người cao tuổi, học sinh sinh viên, nhân viên văn phòng).
- **Người dùng am hiểu (The Guardian):** Cần một công cụ mạnh mẽ để cài đặt và bảo vệ gia đình, người thân; muốn phân tích chuyên sâu các đường link hoặc email nghi ngờ.

### 4. Feature List & Priority (MoSCoW)
- **Must Have:**
  - **Detect:** Phân tích và phát hiện dấu hiệu lừa đảo qua văn bản, tin nhắn, URL bằng Gemini AI.
  - **Simulate:** Mô phỏng kịch bản và hậu quả tồi tệ nhất nếu người dùng thực hiện theo yêu cầu của kẻ lừa đảo (AI Experience).
  - **Explain:** Trích xuất và giải thích chi tiết các "red flags" (dấu hiệu cảnh báo).
- **Should Have:**
  - **Protect:** Browser Extension (Chrome/Edge) tự động quét và bảo vệ theo thời gian thực khi lướt web.
  - **Train:** Chế độ huấn luyện người dùng nhận biết lừa đảo thông qua các bài test tương tác sinh ra bởi AI (Human-in-the-loop).
- **Could Have:**
  - Cảnh báo dựa trên crowdsourcing (báo cáo từ cộng đồng người dùng khác).
- **Won't Have (This phase):**
  - Quét sâu file đính kèm/phần mềm độc hại (tập trung vào social engineering và phishing web).

### 5. Success Metrics (Chỉ số thành công)
- **Acquisition:** > 10,000 lượt cài đặt Extension / lượt đăng ký trải nghiệm trong giai đoạn demo.
- **Engagement:** 70% người dùng tiếp tục xem phần "Simulate" sau khi nhận cảnh báo "Detect".
- **Retention:** Tỷ lệ duy trì Extension sau 30 ngày đạt > 50%.
- **Impact (Core):** Tỷ lệ phát hiện (True Positive) > 95% trên tập dữ liệu thử nghiệm, độ trễ phân tích < 3s.

### 6. Non-Functional Requirements (Yêu cầu phi chức năng)
- **Hiệu suất (Performance):** Hệ thống API (Cloud Run) phản hồi < 2 giây/yêu cầu.
- **Bảo mật (Security):** Tuân thủ GDPR/PDPA, không lưu trữ dữ liệu cá nhân nhạy cảm, sử dụng mã hóa cho dữ liệu truyền tải.
- **Khả năng mở rộng (Scalability):** Hạ tầng Firebase + Google Cloud Run tự động scale để chịu tải lớn trong các buổi demo tại AI Riser Vietnam.
- **Trải nghiệm người dùng (UX):** Giao diện Immersive, không giống một cửa sổ chat đơn điệu.

### 7. Constraints (Ràng buộc)
- Phụ thuộc vào tốc độ và quota của Gemini API. Cần kỹ thuật Prompt Engineering tối ưu để giảm chi phí token.
- Yêu cầu kết nối Internet để phân tích dữ liệu.
- Thời gian phát triển ngắn cho MVP phục vụ cuộc thi.

## Checklist
- [x] Xác định Product Vision & Problem Statement.
- [x] Phác họa User Personas.
- [x] Phân loại tính năng theo MoSCoW.
- [x] Thiết lập Success Metrics & NFR.

## Tài liệu liên quan
- [Product Vision](ProductVision.md)
- [Feature List](FeatureList.md)
- [MVP Definition](MVP.md)

## Việc cần làm tiếp
- Review PRD với đội ngũ Kỹ thuật để chốt Technical Architecture.
- Thống nhất các sự kiện (events) để tracking trên Firebase Analytics.
