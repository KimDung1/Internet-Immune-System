# Lộ trình Kỹ thuật (Technical Roadmap)

## Mục tiêu
Vạch ra lộ trình kiến trúc hệ thống, chuyển đổi công nghệ để đáp ứng quy mô mở rộng và cải tiến AI.

## Nội dung chính
**Phase 0 (Demo): Kiến trúc nguyên khối nhẹ (Lightweight Monolith)**
- Backend: Cloud Run (1 service xử lý mọi logic).
- DB: Firebase Firestore.
- AI: Gọi trực tiếp Google Gemini 1.5 Pro API.
- Mục tiêu: Tốc độ phát triển nhanh, dễ deploy.

**Phase 1 (App Launch): Kiến trúc Microservices cơ bản**
- Tách riêng Auth Service, Scanning Service, Simulation Service.
- Thêm Redis Cache (Memorystore) để lưu trữ kết quả phân tích URL/Pattern đã biết, giảm chi phí gọi Gemini API.
- Bắt đầu thu thập dữ liệu (an danh) để tạo dataset riêng.

**Phase 2 (Scale): Hybrid AI & Edge Computing**
- AI: Triển khai mô hình nhỏ (Small Language Model/SLM) trực tiếp trên thiết bị (On-device) cho các tác vụ phân loại cơ bản. Chỉ gọi Gemini API cho các trường hợp phức tạp (Zero-day).
- Hạ tầng: Cấu hình Auto-scaling cao cấp trên GCP. Sử dụng Pub/Sub cho xử lý bất đồng bộ (ví dụ: crawl và phân tích website khả nghi dưới background).

**Phase 3 (Enterprise): Phân tích đồ thị (Graph Analytics)**
- Tích hợp Graph Database (Neo4j) để phân tích mối liên hệ giữa các chiến dịch lừa đảo (liên kết IP, Domain, Wallet, STK ngân hàng).
- Trở thành Threat Intelligence Platform.

## Checklist
- [ ] Review kiến trúc Phase 0 đảm bảo chịu tải được trong ngày Demo.
- [ ] Thiết lập ngân sách (Budget alert) cho GCP và Gemini API.

## Tài liệu liên quan
- [ADR_001_TechStack.md](file:///e:/PJ/docs/25_Decision_Record/ADR_001_TechStack.md)
- [ProductRoadmap.md](file:///e:/PJ/docs/22_Roadmap/ProductRoadmap.md)

## Việc cần làm tiếp
- Nghiên cứu các framework chạy AI on-device (TensorFlow Lite, ExecuTorch).
