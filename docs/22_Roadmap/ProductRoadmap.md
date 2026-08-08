# Lộ trình Sản phẩm (Product Roadmap)

## Mục tiêu
Hoạch định các tính năng phát triển từ giai đoạn thi đấu (Phase 0) đến hoàn thiện (Phase 3).

## Nội dung chính
**Phase 0: MVP / Demo cho AI Riser (Hiện tại)**
- Core Engine sử dụng Gemini API.
- Tính năng: Quét URL, nhận diện tin nhắn rác bằng văn bản.
- Trọng tâm: Consequence Simulation (Giao diện web giả lập).

**Phase 1: Ứng dụng Di động cơ bản (M+3)**
- App Android/iOS cơ bản.
- Tích hợp SMS Scanner (Android) và Safari Extension (iOS).
- Tính năng Explain (Giải thích thủ đoạn) hoàn thiện.
- Tích hợp Authentication (Firebase).

**Phase 2: Tính năng Nhận diện Nâng cao (M+6)**
- Nhận diện Voice/Cuộc gọi lừa đảo (Cảnh báo thời gian thực).
- Phân tích hình ảnh (Screen capture scanning) tìm Deepfake.
- Dashboard cho Family (Quản lý thiết bị người thân).

**Phase 3: Tự động hóa & Hệ sinh thái (M+12)**
- Auto-Protect Mode (Tự động chặn mà không cần hỏi nếu risk score > 95%).
- Phát hành API cho các đối tác B2B (Ngân hàng, Sàn TMĐT).
- Tích hợp on-device AI model để giảm độ trễ và tăng cường privacy.

## Checklist
- [ ] Cập nhật Roadmap này vào Pitch Deck.
- [ ] Đồng bộ hóa các tính năng Phase 0 vào hệ thống Jira/Trello.

## Tài liệu liên quan
- [TechnicalRoadmap.md](file:///e:/PJ/docs/22_Roadmap/TechnicalRoadmap.md)

## Việc cần làm tiếp
- Đánh giá khả năng kỹ thuật của tính năng quét cuộc gọi trên iOS (rất khó do limit OS).
