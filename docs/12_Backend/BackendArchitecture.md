# Backend Architecture

## Mục tiêu
Tài liệu này trình bày kiến trúc tổng thể của hệ thống Backend cung cấp sức mạnh cho Internet Immune System, tập trung vào khả năng mở rộng, độ trễ thấp và tích hợp mượt mà với Gemini AI Agents.

## Nội dung chính

Hệ thống Backend được thiết kế theo kiến trúc **Microservices nhẹ** chạy trên nền tảng Serverless (Google Cloud Run).

### 1. Các thành phần công nghệ cốt lõi
- **Compute:** Google Cloud Run (Containerized Node.js/Go services, tự động scale down về 0 để tiết kiệm chi phí, scale up nhanh chóng khi có lượng quét lớn).
- **Database:** Firebase Firestore (Tốc độ đọc cao, real-time sync).
- **AI Engine:** Google Gemini API (qua Vertex AI hoặc Google AI Studio).
- **Communication:** REST APIs (cho các tác vụ CRUD) và WebSockets (cho phân tích thời gian thực).

### 2. Sơ đồ Kiến trúc Backend
```mermaid
graph TD
    Client[Client Apps (Web/Mobile)]
    API_GW[API Gateway / Load Balancer]
    
    Auth[Auth Service (Firebase Auth)]
    Client --> API_GW
    API_GW --> Auth
    
    API_GW -- REST --> API_REST[REST Services]
    API_GW -- WebSocket --> WS[Realtime Agent Gateway]
    
    WS --> AI_Orch[Orchestrator Agent Service]
    API_REST --> AI_Orch
    
    AI_Orch --> Gemini[Gemini API / Agent Logic]
    
    AI_Orch --> Firestore[(Firestore Database)]
    API_REST --> Firestore
    
    CRON[Cloud Scheduler] --> Jobs[Background Jobs Service]
    Jobs --> Firestore
```

### 3. Giao tiếp Thời gian thực (Real-time Communication)
Do các Agent phân tích URL/văn bản cần có thời gian suy luận (inference time), việc dùng REST đơn thuần sẽ gây timeout hoặc trải nghiệm UX kém.
- **Giải pháp:** Sử dụng WebSocket cho tính năng quét (Scan).
- Client gửi URL qua WebSocket. Backend đẩy (push) trạng thái về liên tục: `[Scanning] -> [Calling Detector] -> [Simulating] -> [Done]`.

### 4. Service Mesh & Giao tiếp nội bộ
Các Cloud Run Services giao tiếp với nhau (nếu cần) thông qua HTTP/gRPC nội bộ của Google Cloud VPC, sử dụng token nội bộ (Service Account) để bảo mật.

## Checklist
- [x] Xác định kiến trúc Serverless với Cloud Run.
- [x] Lựa chọn giao thức (REST + WS).
- [x] Vẽ sơ đồ tương tác.

## Tài liệu liên quan
- [ServiceCatalog.md](./ServiceCatalog.md)
- [AgentArchitecture.md](../10_Agent/AgentArchitecture.md)

## Việc cần làm tiếp
- Cài đặt CI/CD pipeline sử dụng GitHub Actions để tự động build Docker image và deploy lên Cloud Run.
- Cấu hình API Gateway cho việc Rate Limiting bảo vệ chống DDoS.
