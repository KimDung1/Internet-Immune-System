# Project Wiki: Internet Immune System

## Mục tiêu
Đóng vai trò là trang chủ (Home Page) của cơ sở tri thức (Knowledge Base) cho toàn bộ dự án Internet Immune System. Cung cấp cái nhìn tổng quan về hệ thống, thông tin liên lạc của đội ngũ và các quyết định kỹ thuật quan trọng.

## Nội dung chính

### 1. Thông tin dự án
- **Tên sản phẩm**: Internet Immune System
- **Tagline**: "Your AI Immune System for the Internet"
- **Tầm nhìn**: Xây dựng một hệ thống phát hiện lừa đảo bằng AI có khả năng giải thích, mô phỏng hậu quả, và bảo vệ thời gian thực cho người dùng trên mạng.
- **Mục tiêu**: Trở thành Top 10 AI Riser Vietnam.

### 2. Danh bạ đội ngũ (Team Directory)
- **Product Owner**: [Tên] - `email@yourorg.com`
- **Lead AI Engineer**: [Tên] - `email@yourorg.com`
- **Lead Frontend/Extension**: [Tên] - `email@yourorg.com`
- **Lead Backend/DevOps**: [Tên] - `email@yourorg.com`

### 3. Sổ tay Kiến trúc và Quyết định kỹ thuật (Tech Decisions)
- **Ngôn ngữ & Framework**: TypeScript, React (Dashboard), Vanilla/Vite (Extension), Node.js (API).
- **Core AI**: **Google Gemini AI**. Được chọn vì khả năng hiểu ngữ cảnh dài, xử lý đa phương thức và độ trễ thấp phù hợp cho realtime API.
- **Backend & Cloud**: Google Cloud Platform (Cloud Run) và Firebase. Lựa chọn hệ sinh thái Google nhằm tối ưu hóa chi phí tích hợp và sự liền mạch của các dịch vụ.
- **Giao thức mở rộng**: Không dùng cơ chế chặn toàn bộ traffic (VPN) để tránh rủi ro quyền riêng tư; chỉ intercept (chặn bắt) dữ liệu từ phía trình duyệt thông qua Chrome Extension.

## Checklist
- [ ] Thông tin danh bạ luôn được cập nhật.
- [ ] Mọi kiến trúc mới (ADR - Architecture Decision Records) đều được cập nhật vào mục Tech Decisions.

## Tài liệu liên quan
- [Knowledge Base Index](file:///e:/PJ/docs/41_Knowledge_Base/KnowledgeBaseIndex.md)
- [Architecture Overview For Devs](file:///e:/PJ/docs/29_Onboarding/ArchitectureOverviewForDevs.md)

## Việc cần làm tiếp
- Gắn link các bản thiết kế UI/UX trên Figma.
- Cập nhật tiến độ OKR (Objectives and Key Results) cho từng quý.
