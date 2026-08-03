# Service Catalog

## Mục tiêu
Liệt kê chi tiết danh mục các dịch vụ (Microservices) chạy trong Backend của Internet Immune System, mô tả trách nhiệm và API cơ bản của chúng.

## Nội dung chính

Hệ thống được chia thành 4 Services độc lập trên Cloud Run, nhằm dễ bảo trì và phân bổ tài nguyên.

### 1. Auth & User Service
- **Trách nhiệm:** Quản lý thông tin profile, thiết lập tùy chọn của người dùng, tích hợp với Firebase Auth.
- **Endpoints (REST):**
  - `GET /api/users/me`
  - `PUT /api/users/me/preferences`
  - `GET /api/users/me/trust-score`

### 2. Real-time Agent Service (AI Orchestration)
- **Trách nhiệm:** Điểm vào duy nhất cho mọi tương tác liên quan đến AI. Quản lý kết nối WebSocket, gọi Gemini API và điều phối 5 Agents.
- **Endpoints:**
  - `WS /ws/scan`: Luồng WebSocket nhận yêu cầu phân tích và trả về cảnh báo.
  - `POST /api/agents/chat`: Hỗ trợ luồng chat trực tiếp với Simulator/Trainer Agent (Fallback HTTP).

### 3. Threat Intelligence Service
- **Trách nhiệm:** Cung cấp API nội bộ nhanh chóng để tra cứu Blacklist, đồng thời cung cấp API công khai cho tính năng chủ động báo cáo.
- **Endpoints (REST):**
  - `GET /api/intel/lookup?value={url}`: Tra cứu siêu tốc.
  - `POST /api/intel/report`: Gửi báo cáo nghi ngờ gian lận (người dùng report).
  - `GET /api/intel/stats`: Thống kê các mối đe dọa đang thịnh hành.

### 4. Analytics & Background Service
- **Trách nhiệm:** Xử lý các tác vụ nặng, tổng hợp dữ liệu, chấm điểm Trust Score theo lô (batch processing), và dọn dẹp Database.
- Dịch vụ này không phơi bày API ra public, chỉ nhận yêu cầu từ Google Cloud Scheduler hoặc Pub/Sub.

## Phân bổ Tài nguyên Khuyến nghị (Cloud Run)
- **Agent Service:** CPU cao (2-4 vCPU), RAM 1-2GB, Concurrency thấp (để đảm bảo hiệu suất WebSocket và kết nối LLM).
- **Auth & Threat Intel Service:** CPU thấp (1 vCPU), RAM 512MB, Concurrency cao (xử lý nhanh I/O).

## Checklist
- [x] Liệt kê 4 services chính.
- [x] Định nghĩa Endpoint cơ bản.
- [x] Phân bổ cấu hình Cloud Run.

## Tài liệu liên quan
- [BackendArchitecture.md](./BackendArchitecture.md)
- [BackgroundJobs.md](./BackgroundJobs.md)

## Việc cần làm tiếp
- Viết Swagger/OpenAPI specification cho các REST Endpoints.
- Định nghĩa chuẩn WebSocket message protocol.
