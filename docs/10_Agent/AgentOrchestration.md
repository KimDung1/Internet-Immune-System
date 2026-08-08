# Agent Orchestration

## Mục tiêu
Định nghĩa cách các Agent giao tiếp, phối hợp, quản lý trạng thái, và giải quyết xung đột trong quá trình hoạt động của hệ thống Internet Immune System.

## Nội dung chính

### Cơ chế truyền tin (Message Passing)
Hệ thống sử dụng kiến trúc **Hub-and-Spoke**, trong đó Orchestrator Agent đóng vai trò là Hub trung tâm.
- **Giao thức:** Các Agent giao tiếp thông qua các Message Queues hoặc gRPC streams (trong môi trường Cloud Run).
- **Định dạng tin nhắn:** JSON tiêu chuẩn hóa, bao gồm: `Sender`, `Receiver`, `TaskID`, `Payload`, `Timestamp`.

### Quản lý Trạng thái (State Management)
- **Session State:** Lưu trữ tạm thời trên Redis/Firestore trong suốt phiên làm việc của người dùng.
- Orchestrator lưu trữ state machine hiện tại (Ví dụ: `Scanning` -> `Analyzing` -> `Simulating` -> `Responding`).

### Giải quyết Xung đột (Conflict Resolution)
Khi có sự bất đồng hoặc quá tải:
1. **Timeout Handling:** Nếu Detector Agent mất quá 5 giây, Orchestrator sẽ trả về cảnh báo "Độ rủi ro không xác định" và yêu cầu người dùng cẩn trọng.
2. **Confidence Score Tương phản:** Nếu các module phân tích trong Detector cho ra kết quả trái ngược (ví dụ URL an toàn nhưng nội dung đáng ngờ), Orchestrator sẽ ưu tiên mức độ cảnh báo cao nhất (Fail-safe).

### Luồng thực thi chi tiết
1. Backend nhận Request.
2. Backend gửi Request cho Orchestrator Agent.
3. Orchestrator tạo TaskID và gửi lệnh `SCAN_URL` tới Detector.
4. Detector trả về `Fraud_Risk=85%` cùng `Reasoning`.
5. Orchestrator đánh giá > 70% là High Risk, gọi Simulator với `Fraud_Risk` và `Reasoning`.
6. Simulator trả về cảnh báo hậu quả giả lập.
7. Orchestrator kết hợp kết quả và trả về cho Backend -> User (qua WebSocket).

## Checklist
- [x] Định nghĩa cơ chế Message Passing.
- [x] Quản lý state.
- [x] Chiến lược giải quyết xung đột và timeout.

## Tài liệu liên quan
- [AgentArchitecture.md](./AgentArchitecture.md)
- [BackendArchitecture.md](../12_Backend/BackendArchitecture.md)

## Việc cần làm tiếp
- Cấu hình Timeout thực tế trong hệ thống ADK.
- Thiết kế Payload Schema chuẩn.
