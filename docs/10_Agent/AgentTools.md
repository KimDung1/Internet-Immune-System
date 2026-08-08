# Agent Tools Specification

## Mục tiêu
Định nghĩa danh sách các Tools (Công cụ/Hàm) mà các Agent (đặc biệt là Detector và Simulator) có thể gọi trong quá trình xử lý, tận dụng khả năng Function Calling của Gemini AI.

## Nội dung chính

### Detector Agent Tools

#### 1. `web_scraping_tool`
- **Mô tả:** Trích xuất nội dung văn bản (text), tiêu đề, và các thẻ meta từ một URL mà không cần tải UI/JS nặng.
- **Inputs:** `url` (String).
- **Outputs:** `content` (String), `status_code` (Int).

#### 2. `url_analysis_tool`
- **Mô tả:** Phân tích cấu trúc URL, tuổi của domain (WHOIS), chứng chỉ SSL, và so sánh độ tương đồng (Levenshtein) với các domain ngân hàng/tổ chức hợp pháp.
- **Inputs:** `url` (String).
- **Outputs:** `domain_age_days` (Int), `ssl_valid` (Boolean), `typosquatting_risk` (Float).

#### 3. `threat_intel_lookup`
- **Mô tả:** Truy vấn Firestore để xem SĐT, URL, hoặc STK ngân hàng đã từng bị báo cáo lừa đảo chưa.
- **Inputs:** `entity_type` (Enum: URL, PHONE, BANK_ACCOUNT), `entity_value` (String).
- **Outputs:** `is_blacklisted` (Boolean), `report_count` (Int), `threat_level` (String).

### Simulator Agent Tools

#### 4. `screenshot_generator`
- **Mô tả:** Tạo hình ảnh giả lập (ví dụ: màn hình chuyển tiền thành công, màn hình mất quyền kiểm soát) để tăng cường tác động thị giác.
- **Inputs:** `scenario_type` (String), `context_text` (String).
- **Outputs:** `image_url` (String).

### Trainer Agent Tools

#### 5. `fetch_training_quiz`
- **Mô tả:** Lấy một bộ câu hỏi kiểm tra ngẫu nhiên dựa trên điểm Trust Score hiện tại của người dùng.
- **Inputs:** `difficulty_level` (Int).
- **Outputs:** `quiz_json` (JSON Object).

## Checklist
- [x] Định nghĩa input/output cho công cụ phân tích URL và Scraping.
- [x] Định nghĩa công cụ truy vấn Threat Intelligence.
- [x] Công cụ hỗ trợ Simulator và Trainer.

## Tài liệu liên quan
- [AgentSpecs.md](./AgentSpecs.md)
- [BackendArchitecture.md](../12_Backend/BackendArchitecture.md)

## Việc cần làm tiếp
- Viết mã thực thi (Backend Handlers) cho các tools này trong Cloud Run.
- Cấu hình Function Declaration trong Gemini API.
