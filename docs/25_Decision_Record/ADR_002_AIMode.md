# ADR-002: Kiến trúc AI 5 Chế độ (5-Mode AI Architecture)

## Mục tiêu
Thiết lập phương pháp luận và luồng xử lý cốt lõi của hệ thống AI bảo vệ người dùng: Detect, Simulate, Explain, Train, Protect.

## Nội dung chính
**Ngày:** 20/07/2026 (Giả định)
**Trạng thái:** Chấp nhận (Accepted)

### 1. Bối cảnh
Các giải pháp antivirus truyền thống chỉ dừng ở mức "Detect" và "Protect" (chặn/cấm). Điều này dẫn đến trải nghiệm người dùng kém (thấy phiền phức) và không giáo dục được người dùng (user education). Chúng ta cần một giải pháp khác biệt hoàn toàn (Innovation) để gây ấn tượng mạnh tại AI Riser.

### 2. Các giải pháp được xem xét
- **Luồng chặn cứng (Hard Block):** Hệ thống phát hiện link xấu -> Chặn truy cập -> Hiện cảnh báo "Trang web nguy hiểm". (Quá nhàm chán, giống Google Safe Browsing).
- **Luồng Cảnh báo mềm (Soft Warning):** Hệ thống phát hiện -> Hiện cảnh báo -> Cho phép người dùng "Proceed at your own risk". (Nguy hiểm vì người dùng tò mò vẫn sẽ bấm vào).
- **Kiến trúc 5 Chế độ (The Immune Workflow):** Kết hợp khả năng tạo sinh (Generative) của LLM để tạo ra trải nghiệm bảo vệ toàn diện.

### 3. Quyết định
Áp dụng **Kiến trúc 5 Chế độ**:
1. **Detect (Phát hiện):** Quét tĩnh & AI đánh giá rủi ro (Risk Score).
2. **Simulate (Mô phỏng - Cốt lõi):** Nếu rủi ro cao, tạo ra môi trường Sandbox ảo, cho phép người dùng click tiếp và AI mô phỏng (bằng UI sinh ra) cảnh bị mất tiền/mất dữ liệu.
3. **Explain (Giải thích):** AI chat với người dùng, phân tích từng dấu hiệu lừa đảo trên trang đó.
4. **Train (Huấn luyện):** AI tạo ra các câu hỏi nhỏ (micro-quiz) dựa trên tình huống vừa rồi để kiểm tra nhận thức.
5. **Protect (Bảo vệ):** Sau khi hiểu rõ, hệ thống cách ly mối đe dọa.

### 4. Lý do
- Đây chính là "WOW Moment" của sản phẩm. Việc thay thế trải nghiệm khô khan bằng "Hậu quả trực quan" (Consequence Simulation) tận dụng tối đa thế mạnh tạo sinh của Gemini (Generative UI/Text).
- Phù hợp hoàn hảo với tagline "Hệ Miễn Dịch" - cho cơ thể tiếp xúc với lượng nhỏ virus (mô phỏng) để sinh ra kháng thể (nhận thức).

### 5. Hậu quả
- **Tích cực:** UX đột phá, tính giáo dục cao, điểm Innovation tối đa.
- **Tiêu cực:** Độ phức tạp UI frontend rất cao. Cần thiết kế nhiều kịch bản mô phỏng đa dạng. Độ trễ có thể cao nếu bắt AI render UI thời gian thực.

## Checklist
- [ ] Chốt 3 kịch bản Simulate chính để code cứng (hardcode một phần) cho Demo.
- [ ] Thiết kế prompt cho phần Explain sao cho giọng văn đồng cảm, không trách móc người dùng.

## Tài liệu liên quan
- [DemoScript.md](file:///e:/PJ/docs/19_Demo/DemoScript.md)
- [DemoScenarios.md](file:///e:/PJ/docs/19_Demo/DemoScenarios.md)

## Việc cần làm tiếp
- Viết spec cho module Simulation Engine.
