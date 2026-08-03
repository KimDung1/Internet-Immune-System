# Ma trận Năng lực AI (AI Capability Matrix)

## Mục tiêu
Đánh giá và giới hạn rõ ràng những gì Gemini AI có thể làm (Capabilities) và không thể làm (Limitations) trong bối cảnh phát hiện lừa đảo. Điều này giúp định hình các tính năng cốt lõi của **Internet Immune System** và quản lý kỳ vọng (expectation management) trong quá trình phát triển.

## Nội dung chính

### 1. Những gì Gemini AI có thể làm xuất sắc (Strengths)

| Năng lực | Ứng dụng trong Internet Immune System |
| :--- | :--- |
| **Đọc hiểu đa ngôn ngữ & ngữ cảnh (Multilingual NLU)** | Phân tích chính xác tin nhắn, email, bài đăng bằng tiếng Việt (kể cả tiếng lóng, viết tắt, không dấu) để tìm kiếm các dấu hiệu lừa đảo (Urgency, Threat, Greed). |
| **Phân tích hình ảnh (Multimodal Vision)** | Trích xuất văn bản (OCR) và phân tích ảnh chụp màn hình tin nhắn, bài viết Facebook. Đánh giá tính xác thực của biên lai chuyển tiền, căn cước công dân (phát hiện dấu vết chỉnh sửa thô, sai phông chữ). |
| **Giải thích cơ chế (Explainability)** | Không chỉ cảnh báo "Nguy hiểm", AI có thể giải thích chi tiết: *"Tin nhắn này giả mạo vì ngân hàng không bao giờ gửi link yêu cầu cung cấp OTP. Link `techcombank-vietnam.vip` là tên miền giả."* |
| **Mô phỏng hậu quả (Consequence Simulation)** | Sinh ra các kịch bản tương lai dựa trên hành động hiện tại của người dùng. VD: *"Nếu bạn cài file .apk này, hacker có thể tự động đọc màn hình và tự chuyển 50 triệu trong tài khoản của bạn lúc 2h sáng."* |
| **Cá nhân hóa giao tiếp (Persona Adoption)** | Điều chỉnh giọng điệu (tone of voice) phù hợp với người dùng: cảnh báo nghiêm khắc, nhẹ nhàng khuyên bảo, hoặc đóng vai "người bạn am hiểu công nghệ". |

### 2. Những giới hạn và thách thức (Limitations & Mitigation)

| Giới hạn của AI (Limitations) | Cách khắc phục (Mitigation Strategy) |
| :--- | :--- |
| **Ảo giác AI (Hallucinations)** | AI có thể bịa ra quy định pháp luật hoặc thông tin không có thật. Khắc phục: Sử dụng RAG (Retrieval-Augmented Generation), **Grounding** với cơ sở dữ liệu luật pháp và danh sách `FraudPatterns` đã được kiểm chứng. Prompt engineering chặt chẽ. |
| **Không biết thông tin Real-time tuyệt đối** | AI không có danh sách realtime mọi domain vừa được đăng ký 5 phút trước. Khắc phục: Kết hợp (Integrate) với các API bảo mật bên thứ 3 (Google Safe Browsing, VirusTotal, Tín Nhiệm Mạng) để kiểm tra URL/IP trước, lấy kết quả cho AI tổng hợp. |
| **Bị qua mặt bằng Prompt Injection** | Kẻ lừa đảo cố tình viết nội dung để lừa AI đánh giá đây là tin nhắn an toàn. Khắc phục: Đặt các bộ lọc (Guardrails) ở lớp trước và sau khi gọi model; sử dụng System Prompt ẩn cực mạnh để không bị ghi đè. |
| **Độ trễ xử lý (Latency)** | Phân tích AI sinh tạo có thể mất vài giây. Khắc phục: Cung cấp UI loading hiệu quả, sử dụng model nhẹ (Gemini Flash) cho các tác vụ cần tốc độ, lưu cache các trường hợp phổ biến. |

### 3. Năng lực Grounding (Căn cứ dữ liệu thực tế)
Để AI trở thành một hệ miễn dịch thực sự, nó không thể chỉ dựa vào kiến thức huấn luyện sẵn (pre-trained knowledge). Hệ thống cần sử dụng tính năng **Grounding (Search / RAG)** để:
- Tìm kiếm các bài báo mới nhất về các vụ lừa đảo tương tự để tăng tính thuyết phục cho người dùng (VD: *"Hôm qua báo Tuổi Trẻ vừa đăng tin một người mất 2 tỷ vì thủ đoạn y hệt"*).
- Tham chiếu cơ sở dữ liệu `FraudPatterns` cục bộ để ánh xạ (map) tình huống của người dùng vào các kịch bản lừa đảo đã biết.

## Checklist
- [x] Lập bản đồ tính năng cốt lõi với năng lực của Gemini.
- [x] Xác định các rủi ro (Hallucination) và giải pháp.
- [ ] Thiết kế System Prompt chuẩn để tối ưu hóa năng lực phân tích lừa đảo.

## Tài liệu liên quan
- [TechResearch.md](./TechResearch.md)
- [FraudPatterns.md](./FraudPatterns.md)

## Việc cần làm tiếp
- Xây dựng bản test benchmark (đưa 100 mẫu lừa đảo và 100 tin nhắn bình thường) để đo lường độ chính xác (Precision/Recall) của Gemini.
