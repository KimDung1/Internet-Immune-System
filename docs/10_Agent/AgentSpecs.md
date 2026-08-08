# Agent Specifications

## Mục tiêu
Tài liệu này cung cấp thông số kỹ thuật chi tiết cho từng Agent trong hệ thống Internet Immune System, bao gồm đầu vào, đầu ra, các công cụ (tools) sử dụng, bộ nhớ, mục tiêu và các kịch bản lỗi (failure modes).

## Nội dung chính

### 1. Orchestrator Agent
- **Mục tiêu:** Điều phối luồng thông tin và đảm bảo hệ thống phản hồi nhanh chóng, chính xác.
- **Inputs:** Yêu cầu từ người dùng (văn bản, URL, hình ảnh), Trạng thái phiên (Session State).
- **Outputs:** Kế hoạch thực thi (Execution Plan), Phản hồi tổng hợp.
- **Tools:** Không sử dụng tool ngoại vi; chủ yếu gọi các Agent khác (CallDetector, CallSimulator, CallTrainer).
- **Memory:** Ngắn hạn (Session Context).
- **Failure Modes:** Timeout khi chờ các Agent khác -> Chuyển sang phản hồi mặc định "Đang xử lý, vui lòng chờ".

### 2. Detector Agent
- **Mục tiêu:** Xác định chính xác tỷ lệ lừa đảo của một đối tượng mục tiêu.
- **Inputs:** URL, nội dung tin nhắn, siêu dữ liệu email.
- **Outputs:** Fraud Risk Score (0-100), Lý do (Reasoning), Cờ báo hiệu (Flags).
- **Tools:**
  - `web_scraping`: Trích xuất nội dung trang web.
  - `url_analysis`: Kiểm tra domain age, chứng chỉ SSL.
  - `threat_intel_lookup`: Truy vấn Firestore Threat Intelligence.
- **Memory:** Dữ liệu Pattern lừa đảo ngắn hạn.
- **Failure Modes:** Trang web chặn scraping -> Báo cáo "Không thể xác minh, rủi ro tiềm ẩn".

### 3. Simulator Agent
- **Mục tiêu:** Trực quan hóa và giải thích hậu quả lừa đảo bằng ngôn ngữ tự nhiên, dễ hiểu.
- **Inputs:** Fraud Risk Score, Loại lừa đảo (Phishing, Malware, Scam), Ngữ cảnh người dùng.
- **Outputs:** Kịch bản giả lập (Scenario), Cảnh báo.
- **Tools:** `screenshot_generator` (tạo UI giả lập), `explanation_engine`.
- **Memory:** Không có (Stateless).
- **Failure Modes:** Thiếu ngữ cảnh lừa đảo -> Sinh ra kịch bản cảnh báo chung.

### 4. Trainer Agent
- **Mục tiêu:** Cải thiện User Trust Score thông qua giáo dục.
- **Inputs:** Lịch sử bị lừa đảo của người dùng, Trust Score, Kịch bản lỗi.
- **Outputs:** Câu hỏi trắc nghiệm (Quizzes), Lời khuyên, Bài học tương tác.
- **Tools:** `training_db_lookup`, `progress_updater`.
- **Memory:** Dài hạn (User Profile Memory).
- **Failure Modes:** Người dùng bỏ qua bài học -> Tăng tần suất nhắc nhở nhẹ nhàng.

### 5. Protector Agent
- **Mục tiêu:** Theo dõi nền và cảnh báo sớm.
- **Inputs:** Log mạng (nếu có quyền), SMS/Email đến (trên di động).
- **Outputs:** Push Notification, Block action (nếu ủy quyền).
- **Tools:** `real_time_monitor`, `notification_sender`.
- **Memory:** Ngắn hạn (Sliding Window Log).
- **Failure Modes:** False positive (Cảnh báo nhầm) -> Cho phép người dùng "Bỏ qua" và học lại.

## Checklist
- [x] Xác định Inputs, Outputs cho 5 Agent.
- [x] Xác định Tools & Memory.
- [x] Xác định Failure Modes để thiết kế hệ thống đáng tin cậy.

## Tài liệu liên quan
- [AgentTools.md](./AgentTools.md)
- [AgentMemory.md](./AgentMemory.md)

## Việc cần làm tiếp
- Triển khai cụ thể các Tools cho Agent trong Backend.
