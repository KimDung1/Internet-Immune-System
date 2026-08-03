# Error Handling & Degradation Strategy

## Mục tiêu
Thiết lập chiến lược xử lý lỗi, định nghĩa các mã lỗi (Error Codes) và chiến lược hạ cấp nhẹ nhàng (Graceful Degradation) để đảm bảo hệ thống vẫn hữu ích ngay cả khi có sự cố.

## Nội dung chính

### 1. Phân loại Lỗi và Error Codes

#### HTTP / Client Errors (4xx)
- `ERR_AUTH_01` (401): Token hết hạn hoặc không hợp lệ.
- `ERR_INPUT_01` (400): URL cần quét không đúng định dạng.
- `ERR_RATE_LIMIT` (429): Người dùng đã vượt quá số lần quét miễn phí trong phút (Spam/DDoS protection).

#### System / Backend Errors (5xx)
- `ERR_AI_TIMEOUT` (504): Quá trình gọi Gemini AI (Agent) bị vượt quá thời gian cho phép.
- `ERR_DB_UNAVAILABLE` (503): Lỗi kết nối Firestore.

### 2. Chiến lược Graceful Degradation (Hạ cấp nhẹ nhàng)

Trong hệ thống AI, việc LLM bị nghẽn mạng, timeout hoặc hết quota là rất bình thường. Hệ thống phải đảm bảo an toàn cho người dùng:

- **Tình huống 1: AI (Gemini) bị lỗi hoặc timeout**
  - Thay vì báo lỗi "Hệ thống đang bảo trì", Detector Agent sẽ bỏ qua phần (AI Context Analysis).
  - Hệ thống sẽ chỉ dựa vào phần Heuristics (Static Analysis) và kiểm tra Blacklist (Threat Intel).
  - Trả về thông báo: *"Chế độ quét sâu AI tạm thời không khả dụng, nhưng chúng tôi đã kiểm tra sơ bộ và nhận thấy URL này [An toàn / Có rủi ro trong danh sách đen]."*

- **Tình huống 2: Simulator Agent bị lỗi sinh ảnh (Image Generation fail)**
  - Nếu việc tạo UI giả lập thất bại, Simulator sẽ Fallback về việc chỉ trả về văn bản cảnh báo (Text-only consequence warning).

- **Tình huống 3: Mất kết nối WebSocket**
  - Client tự động thử lại kết nối (Exponential Backoff).
  - Nếu quét qua WebSocket thất bại liên tục, Frontend cung cấp nút "Quét chế độ cơ bản (REST)" gọi trực tiếp API HTTP tĩnh.

### 3. Logging & Monitoring
- Sử dụng Google Cloud Logging. Các lỗi sinh ra từ Agent (Hallucination, Tool calling fail) phải được gắn nhãn `severity: WARNING` hoặc `ERROR`.
- Thiết lập cảnh báo (Alerts) qua email nếu `ERR_AI_TIMEOUT` vượt quá 5% số lượng request trong 5 phút.

## Checklist
- [x] Định nghĩa chuẩn Error Code nội bộ.
- [x] Lập kịch bản Graceful Degradation cho AI Failure.
- [x] Xác định chiến lược Logging.

## Tài liệu liên quan
- [BackendArchitecture.md](./BackendArchitecture.md)
- [AgentSpecs.md](../10_Agent/AgentSpecs.md)

## Việc cần làm tiếp
- Triển khai middleware xử lý lỗi (Error Handler Middleware) trong Express/Fastify.
- Viết unit tests cho các kịch bản Fallback.
