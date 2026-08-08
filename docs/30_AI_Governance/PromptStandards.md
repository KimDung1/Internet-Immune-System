# Master AI Prompt Standards

## Mục tiêu
Thiết lập bộ tiêu chuẩn thống nhất cho việc thiết kế, xây dựng và quản lý các Prompt tương tác với mô hình Gemini AI trong dự án Internet Immune System. Đảm bảo tính nhất quán, độ chính xác cao, định dạng đầu ra chuẩn xác và an toàn trước các rủi ro bảo mật.

## Nội dung chính

### 1. Cấu trúc Prompt Tiêu chuẩn (Prompt Structure)
Mọi prompt cấp production phải tuân thủ kiến trúc "4 thành phần" (4-Part Architecture):
- **System Instructions**: Định nghĩa persona, vai trò và các quy tắc bất biến. (VD: "You are the Internet Immune System AI, an expert in cybersecurity and fraud detection.")
- **Context/Grounding Data**: Cung cấp ngữ cảnh và dữ liệu đầu vào.
- **Task/Instructions**: Yêu cầu cụ thể, từng bước (Step-by-step reasoning).
- **Format Requirements**: Định dạng đầu ra bắt buộc (thường là JSON schema).

### 2. Sử dụng XML Tags (XML Tag Demarcation)
Sử dụng XML tags để phân tách rõ ràng các phần của prompt, giúp mô hình phân biệt giữa lệnh của hệ thống và dữ liệu của người dùng.
- `<system_rules>`: Các quy tắc không được vi phạm.
- `<user_input>`: Dữ liệu người dùng cung cấp (có rủi ro injection).
- `<examples>`: Các ví dụ Few-shot.
- `<output_format>`: Định nghĩa cấu trúc JSON.

### 3. Quy tắc Tiêm Biến (Variable Injection Rules)
- Tất cả các biến động (URL, đoạn text nghi ngờ) phải được escape/sanitize trước khi inject vào prompt.
- Đặt các biến có rủi ro cao vào trong các XML tags riêng biệt như `<untrusted_content>` để báo hiệu cho mô hình không thực thi lệnh từ phần này.

### 4. Safety Guardrails & Fallbacks
- Bắt buộc phải có câu lệnh: "If the input is highly ambiguous or you lack sufficient confidence, output `{\"is_fraud\": null, \"confidence\": 0, \"reason\": \"Insufficient data\"}`."
- Không bao giờ cho phép mô hình tạo ra các đường link thực thi (executable links) hoặc script.

## Checklist
- [ ] Prompt đã tuân thủ cấu trúc 4 phần chưa?
- [ ] Dữ liệu người dùng (User input) đã được bao bọc trong XML tags chưa?
- [ ] Định dạng đầu ra (JSON) đã được xác định rõ ràng với Schema cụ thể chưa?
- [ ] Đã có guardrails xử lý trường hợp thiếu dữ liệu hoặc không chắc chắn chưa?

## Tài liệu liên quan
- [PromptInjectionDefense.md](PromptInjectionDefense.md)
- [HallucinationMitigation.md](HallucinationMitigation.md)

## Việc cần làm tiếp
- Đưa các template prompt chuẩn vào thư viện chung (Prompt Registry).
- Tổ chức workshop training cho đội ngũ kỹ sư về kỹ năng Prompt Engineering với Gemini.
