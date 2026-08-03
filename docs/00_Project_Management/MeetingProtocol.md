# Meeting Protocol

## Mục tiêu
Thiết lập nhịp độ cuộc họp (Meeting Cadences), cấu trúc chương trình họp và quy trình ra quyết định nhằm đảm bảo thông tin thông suốt, tiết kiệm thời gian và tăng cường sự phối hợp trong đội ngũ phát triển **Internet Immune System**.

## Nội dung chính

### 1. Nhịp độ cuộc họp (Meeting Cadences)

| Tên cuộc họp | Tần suất | Thời lượng | Người tham gia | Mục đích chính |
| :--- | :--- | :--- | :--- | :--- |
| **Daily Standup** | Hàng ngày | 15 phút | Toàn bộ team | Đồng bộ tiến độ nhanh. Trả lời 3 câu hỏi: Hôm qua làm gì? Hôm nay làm gì? Có blocker nào không? |
| **Sprint Planning** | 2 tuần/lần | 1-2 giờ | Toàn bộ team | PO trình bày các task ưu tiên; team thảo luận và đánh giá effort (Story Points) để đưa vào Sprint backlog. |
| **Sprint Review & Demo**| Cuối Sprint | 1 giờ | Toàn bộ team, Stakeholders | Demo các tính năng đã hoàn thành (Ví dụ: Module phát hiện lừa đảo bằng Gemini, UI Consequence Simulation). Thu thập feedback. |
| **Sprint Retrospective**| Cuối Sprint | 45 phút | Toàn bộ team | Thảo luận: Cái gì tốt? Cái gì chưa tốt? Hành động cải tiến cho Sprint sau là gì? |
| **Architecture / Tech Sync**| Khi cần thiết | 1 giờ | AI Eng, Cloud Eng | Thảo luận chuyên sâu về kiến trúc Google Cloud, tối ưu Firebase, tinh chỉnh Gemini model. |

### 2. Nguyên tắc tổ chức họp (Meeting Guidelines)
- **Có Agenda rõ ràng**: Bất kỳ cuộc họp nào > 30 phút đều phải có Agenda gửi trước ít nhất 12 giờ.
- **Đúng giờ (Punctuality)**: Bắt đầu và kết thúc đúng thời gian quy định. Tôn trọng thời gian của nhau.
- **Tập trung (Focus)**: Hạn chế đa nhiệm (multitasking) trong lúc họp. 
- **Biên bản (Meeting Notes)**: Người tổ chức (hoặc người được chỉ định) phải ghi lại Action Items và quyết định chính, gửi lên Slack/Teams ngay sau buổi họp.

### 3. Quy trình ra quyết định (Decision-Making Process)
- **Đồng thuận (Consensus)**: Khuyến khích thảo luận để đạt sự đồng thuận trong các vấn đề kiến trúc và thiết kế.
- **Quyết định dựa trên dữ liệu (Data-driven)**: Mọi tranh luận về hiệu năng (VD: thời gian phản hồi của Gemini API) hay trải nghiệm người dùng đều phải được kiểm chứng bằng log từ Google Cloud hoặc A/B testing.
- **Cơ chế leo thang (Escalation)**: Nếu sau 1 thời gian thảo luận (VD: 30 phút) không đạt được đồng thuận, quyết định cuối cùng sẽ thuộc về:
  - **Tech Lead / Architecture Lead**: Cho các vấn đề kỹ thuật (hạ tầng, API).
  - **Product Owner (PO)**: Cho các vấn đề về tính năng, trải nghiệm người dùng và ưu tiên tiến độ.

## Checklist
- [ ] Lịch họp cố định (Recurring invites) đã được thiết lập trên Google Calendar.
- [ ] Template cho biên bản họp (Meeting notes template) đã có sẵn.
- [ ] Team đã thống nhất với các nguyên tắc họp và quy trình ra quyết định.

## Tài liệu liên quan
- [Team Structure](./TeamStructure.md)
- [Project Charter](./ProjectCharter.md)

## Việc cần làm tiếp
- Gửi Calendar Invites cho tất cả các cuộc họp định kỳ của Sprint 1.
- Chỉ định người luân phiên ghi chép biên bản (Meeting Scribe) cho các buổi họp.
