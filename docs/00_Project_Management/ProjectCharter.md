# Project Charter: Internet Immune System

## Mục tiêu
Xác định chính thức tầm nhìn, sứ mệnh, phạm vi, chỉ số thành công, tiến độ dự kiến và khung ngân sách cho dự án **Internet Immune System**. Tài liệu này đóng vai trò là kim chỉ nam và cơ sở để ra quyết định xuyên suốt vòng đời dự án, đảm bảo sự đồng thuận giữa tất cả các bên liên quan.

## Nội dung chính

### 1. Tầm nhìn và Sứ mệnh (Vision & Mission)
- **Tầm nhìn**: Trở thành tiêu chuẩn bảo vệ an toàn thông tin cá nhân hàng đầu tại Việt Nam, mang đến một môi trường internet không lừa đảo.
- **Sứ mệnh**: Cung cấp một "hệ miễn dịch" số thông minh dựa trên sức mạnh của Gemini AI, giúp người dùng nhận diện, hiểu rõ và phòng tránh các nguy cơ lừa đảo trực tuyến (Scam) một cách tự động và trực quan qua trải nghiệm AI cá nhân hóa.
- **Tagline**: "Your AI Immune System for the Internet"

### 2. Phạm vi dự án (Project Scope)
- **In-Scope**:
  - Tích hợp Gemini AI để phân tích và phát hiện dấu hiệu lừa đảo trong văn bản, hình ảnh và URL.
  - Xây dựng module **Consequence Simulation** (Mô phỏng hậu quả) trực quan hóa thiệt hại nếu người dùng sập bẫy.
  - Xây dựng module **AI Explanation** giải thích rõ ràng tại sao nội dung đó là lừa đảo (không phải dạng chatbot, mà là AI Experience tương tác một chiều hoặc có định hướng).
  - Module **User Training** cung cấp các bài học vi mô (micro-learning) ngay tại thời điểm phát hiện.
  - Backend xây dựng trên **Firebase** và **Cloud Run** (Google Cloud).
- **Out-of-Scope**:
  - Các giải pháp bảo mật phần cứng.
  - Quét mã độc tĩnh trên máy tính (chỉ tập trung vào lừa đảo trực tuyến, hành vi kỹ thuật xã hội).

### 3. Tiêu chí thành công (Success Metrics)
- **Mục tiêu chính**: Đạt thứ hạng **Top 10 tại cuộc thi AI Riser Vietnam**.
- **Kỹ thuật**: 
  - Độ chính xác (Accuracy) của Gemini AI trong việc phát hiện lừa đảo > 95%.
  - Thời gian phản hồi (Latency) của hệ thống bảo vệ thời gian thực < 500ms.
- **Người dùng**: Thu hút được 5,000 người dùng thử nghiệm nghiệm (Beta users) tại thị trường Việt Nam trong vòng 3 tháng đầu.
- **Tính khả dụng**: Hệ thống Uptime > 99.9% trên Google Cloud.

### 4. Tiến độ dự kiến (Timeline - High Level)
- **Tháng 1**: Kiến trúc hệ thống, tích hợp hạ tầng GCP (Firebase, Cloud Run) và thử nghiệm Gemini API.
- **Tháng 2**: Xây dựng Core Features (Fraud Detection, AI Explanation).
- **Tháng 3**: Hoàn thiện Consequence Simulation & User Training. Tích hợp UI/UX dạng AI Experience.
- **Tháng 4**: Beta testing, thu thập phản hồi, tối ưu hóa mô hình AI.
- **Tháng 5**: Launching, chuẩn bị hồ sơ và trình diễn tại AI Riser Vietnam.

### 5. Khung ngân sách (Budget Framework)
- **Cơ sở hạ tầng (Cloud Infrastructure)**: Tận dụng Google Cloud credits (dành cho startup) chi trả cho Cloud Run, Firebase, Cloud Storage.
- **AI API Costs**: Ngân sách dự kiến cho Gemini API (tính theo token/request) tối đa $500/tháng trong giai đoạn Beta.
- **Marketing & User Acquisition**: $2000 cho chiến dịch nâng cao nhận thức an toàn thông tin tại Việt Nam.

## Checklist
- [ ] Đã được phê duyệt bởi Project Sponsor.
- [ ] Đã xác định rõ ràng ranh giới phạm vi (Scope baseline).
- [ ] Các chỉ số KPI/Metrics có thể đo lường được.

## Tài liệu liên quan
- [README.md](./README.md)
- [Team Structure](./TeamStructure.md)

## Việc cần làm tiếp
- Đệ trình Project Charter cho Ban Giám khảo / Mentors của AI Riser Vietnam (nếu cần thiết cho vòng sơ loại).
- Phân rã tiến độ High-level thành các Sprint Backlog cụ thể trong Jira/Trello.
