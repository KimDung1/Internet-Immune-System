# Brand Voice & Copywriting

## Mục tiêu
Tài liệu hướng dẫn giọng văn (Tone of Voice - ToV) và cách viết nội dung (Copywriting) cho hệ thống. Đảm bảo Internet Immune System luôn giao tiếp với tư cách một thực thể AI (đại diện cho Gemini) thông minh, điềm tĩnh, và bảo vệ người dùng, tránh gây hoảng loạn.

## Nội dung chính

### 1. Giọng văn tổng thể (Tone of Voice)
*   **Trấn an & Điềm tĩnh (Calming & Composed):** Kể cả khi phát hiện mối đe dọa nghiêm trọng cấp độ cao, hệ thống không la hét (Không dùng Dấu chấm than liên tục "!!!", không dùng từ "CHẾT RỒI"). Thay vào đó, nó báo cáo sự cố một cách nghiệp vụ như một chuyên gia.
*   **Phân tích & Rõ ràng (Analytical & Lucid):** Giải thích rõ ràng TẠI SAO. (Ví dụ: Thay vì nói "Web này lừa đảo", hãy nói "Hệ thống phát hiện URL này có chứa ký tự cyrillic mạo danh chữ cái tiếng Latin, một thủ thuật lừa đảo phổ biến").
*   **Khích lệ (Empowering):** Ghi nhận khi người dùng có thao tác đúng, giúp họ tự tin hơn trong môi trường số.

### 2. Nguyên tắc Copywriting

#### Viết cho UI (Microcopy)
*   **Ngắn gọn, Action-oriented (Hướng hành động).**
*   Ví dụ:
    *   *Tệ:* Xin vui lòng bấm vào đây để hệ thống quét đường link này xem có an toàn không.
    *   *Tốt:* Phân tích liên kết (Analyze Link) / Quét mục tiêu (Scan Target).

#### Viết cho Giải thích AI (AI Explanations - Prompting Gemini)
*   Khi thiết kế Prompt cho Gemini, cần yêu cầu AI trả về kết quả theo cấu trúc: [Trạng thái tóm tắt] + [Bằng chứng kỹ thuật] + [Kết luận mô phỏng hậu quả].
*   Dùng ngôn ngữ sinh học một cách tinh tế: "Phát hiện mẫu kháng nguyên" (Dấu hiệu bất thường), "Tiêm phòng kiến thức" (Bài học rút ra).

### 3. Ví dụ về Giọng văn (Tone Examples: EN / VN)

**Tình huống 1: Phát hiện email Phishing tinh vi.**
*   *Phần mềm cũ:* CẢNH BÁO MÃ ĐỘC! Xóa email này ngay!
*   *Immune System:* 
    *   [EN] Threat Detected. This email mimics your bank, but the return address points to an unregistered domain. Interacting with this may compromise your credentials.
    *   [VN] Phát hiện đe dọa. Email này mô phỏng ngân hàng của bạn, nhưng địa chỉ phản hồi trỏ về một tên miền chưa đăng ký. Tương tác với email này có thể làm lộ thông tin đăng nhập.

**Tình huống 2: Người dùng quét một link an toàn.**
*   *Phần mềm cũ:* Không có virus.
*   *Immune System:*
    *   [EN] Target clear. No malicious signatures found. The domain has a solid reputation and SSL encryption is valid.
    *   [VN] Mục tiêu an toàn. Không tìm thấy chữ ký mã độc. Tên miền có uy tín tốt và chứng chỉ SSL hợp lệ.

### 4. Thuật ngữ cốt lõi (Terminology Glossary)
Sử dụng các từ ngữ này thống nhất trên toàn app:
*   **Threat / Mối đe dọa:** Dùng thay cho từ "Virus" chung chung.
*   **Quarantine / Cách ly:** Trạng thái khi chặn người dùng truy cập một nội dung nguy hiểm.
*   **Immune Response / Phản ứng miễn dịch:** Hành động can thiệp của hệ thống để bảo vệ người dùng.
*   **Antibody generated / Kháng thể đã hình thành:** Thông báo khi người dùng vừa học xong một bài học về lừa đảo (Training/Simulation).
*   **Zero-day Variant / Biến chủng mới:** Các thủ đoạn lừa đảo tinh vi chưa từng có tiền lệ vừa bị AI bóc mẽ.

## Checklist
- [x] Định nghĩa 3 tính chất của giọng văn (Trấn an, Phân tích, Khích lệ).
- [x] Quy tắc viết Microcopy cho giao diện.
- [x] Cung cấp ví dụ thực tế song ngữ VN/EN.
- [x] Bảng thuật ngữ (Glossary) liên kết sinh học và mạng.

## Tài liệu liên quan
- [Brand Identity](BrandIdentity.md)
- [Typography System](../06_Design_System/TypographySystem.md)

## Việc cần làm tiếp
- Tích hợp Tone of Voice này vào System Prompt của Gemini để AI tự động generate câu trả lời theo đúng phong cách "Hệ miễn dịch".
