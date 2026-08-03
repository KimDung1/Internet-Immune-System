# Prompt Engineering

## Mục tiêu
Lưu trữ và quản lý các template Prompt cho 5 chế độ hoạt động cốt lõi của Internet Immune System. Các prompt được thiết kế để yêu cầu AI đóng vai trò như một chuyên gia an ninh mạng.

## Nội dung chính

### System Instruction (Chung cho tất cả modes)
> "You are the core intelligence of the 'Internet Immune System'. Your objective is to protect users from web-based fraud, phishing, and social engineering. Analyze the provided context clinically and objectively. Output must perfectly match the requested JSON schema."

### 1. Mode: Detect (Phát hiện)
**Mục đích**: Nhận diện rủi ro nhanh chóng từ nội dung web.
**Model**: `gemini-2.5-flash`
**Prompt Template**:
```text
Analyze the following webpage content and metadata to determine if it is a phishing attempt, scam, or malicious site.
URL: {{url}}
Page Title: {{title}}
Extracted Content: {{content}}

Look for urgency cues, fake login forms, suspicious domains mimicking real ones, or unrealistic promises.
Calculate a threat level and confidence score.
```

### 2. Mode: Simulate (Mô phỏng hậu quả)
**Mục đích**: Cho người dùng thấy điều tồi tệ gì sẽ xảy ra nếu họ "sập bẫy".
**Model**: `gemini-2.5-pro`
**Prompt Template**:
```text
The user is viewing a highly suspicious webpage: {{url}}. 
Simulate exactly what the attackers intend to do if the user interacts with this page (e.g., enters credentials, downloads file). 
Write a realistic, 3-step timeline of the consequences (e.g., '1. Your banking password is sent to a server in X. 2. Bots automate a transfer...'). Make it visceral but factual.
```

### 3. Mode: Explain (Giải thích)
**Mục đích**: Giáo dục người dùng, phân tích chi tiết các dấu hiệu lừa đảo.
**Model**: `gemini-2.5-pro`
**Prompt Template**:
```text
Explain WHY the following content is classified as 'malicious'.
Identify specific 'Red Flags' (e.g., grammatical errors, mismatched URLs, psychological manipulation techniques like artificial urgency).
Provide the explanation in clear, non-technical language.
```

### 4. Mode: Train (Huấn luyện)
**Mục đích**: Tạo các bài kiểm tra giả lập (Phishing Quiz) cho người dùng.
**Model**: `gemini-2.5-pro`
**Prompt Template**:
```text
Generate a realistic but fake phishing email or SMS message aimed at Vietnamese users (e.g., fake bank alert, delivery failure).
Then, provide 3 multiple choice questions testing the user's ability to spot the red flags in your generated message.
```

### 5. Mode: Protect (Bảo vệ chủ động)
Tương tự Detect nhưng chạy ngầm, trigger các action bảo mật mạnh (block DOM, redirect).

## Checklist
- [x] Viết System Instruction
- [x] Tạo template cho 5 chế độ
- [ ] Tối ưu độ dài prompt để giảm token usage
- [ ] Dịch prompt sang tiếng Việt nếu cần AI trả lời tiếng Việt xuất sắc hơn

## Tài liệu liên quan
- [Gemini Integration](GeminiIntegration.md)
- [Fraud Detection Logic](FraudDetectionLogic.md)

## Việc cần làm tiếp
- Test các prompt này trực tiếp trên Google AI Studio để tinh chỉnh (Tune).
