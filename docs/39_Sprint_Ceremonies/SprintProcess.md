# Sprint Lifecycle & Ceremonies

## Mục tiêu
Chuẩn hóa chu kỳ làm việc linh hoạt (Agile/Scrum) của team Internet Immune System. Thiết lập nhịp độ làm việc 2 tuần/Sprint, định nghĩa rõ các buổi lễ (ceremonies) và cách vận hành nhằm tối ưu hóa hiệu suất, sự minh bạch và tinh thần tự chủ của các thành viên.

## Nội dung chính

### 1. Chu kỳ Sprint (Sprint Cycle)
- **Độ dài**: 2 tuần (14 ngày).
- **Bắt đầu**: Thứ Tư (để tránh sự mệt mỏi của thứ Hai và sự hối hả của thứ Sáu).
- **Công cụ quản lý**: Jira hoặc Linear (Quản lý Backlog, Board, Velocity).

### 2. Các buổi lễ (Scrum Ceremonies)

#### A. Sprint Planning (Lập kế hoạch)
- **Thời gian**: Ngày đầu tiên của Sprint (Thứ Tư, 2 tiếng).
- **Thành phần**: PO/PM, Scrum Master/Agile Coach, Development Team.
- **Nội dung**:
  - PO trình bày mục tiêu Sprint (Sprint Goal).
  - Chọn các Ticket từ Product Backlog đã thỏa mãn [Definition of Ready (DoR)](DefinitionOfReady.md).
  - Team estimate (Planning Poker/T-shirt sizing) và commit khối lượng công việc phù hợp với Velocity.

#### B. Daily Async Standups (Họp hằng ngày bất đồng bộ)
Để tối ưu hóa thời gian và phù hợp với team làm việc linh hoạt/remote, áp dụng hình thức Async.
- **Thời gian**: Trước 10:00 AM mỗi ngày.
- **Công cụ**: Kênh #daily-standup trên Slack/Discord.
- **Cấu trúc báo cáo**:
  1. Hôm qua làm gì? (Kèm link Ticket/PR).
  2. Hôm nay làm gì?
  3. Có blocker (trở ngại) nào không? Ai có thể giúp?

#### C. Backlog Refinement (Làm mịn Backlog)
- **Thời gian**: Giữa Sprint (Khoảng 1 tiếng).
- **Nội dung**: Review các Ticket cho Sprint tiếp theo. Cập nhật mô tả, chia nhỏ task lớn, đảm bảo các ticket sẵn sàng (DoR) để tiết kiệm thời gian cho buổi Planning.

#### D. Sprint Review (Đánh giá Sprint)
- **Thời gian**: Chiều ngày cuối cùng của Sprint (Thứ Ba, 1 tiếng).
- **Nội dung**:
  - Dev team demo các tính năng đã hoàn thành (phải thỏa mãn [Definition of Done](DefinitionOfDone.md)).
  - Nhận feedback từ Stakeholders.

#### E. Sprint Retrospective (Cải tiến liên tục)
- **Thời gian**: Ngay sau Sprint Review (1 tiếng).
- **Nội dung**: 
  - Phân tích: Cái gì làm tốt? Cái gì chưa tốt? Cần cải thiện điều gì? (Start/Stop/Continue).
  - Đưa ra ít nhất 1-2 Action Items cụ thể để áp dụng vào Sprint tới.

### 3. Quản lý Velocity (Tốc độ)
- Velocity là tổng số Story Points hoàn thành trong 1 Sprint.
- Sử dụng Velocity trung bình của 3 Sprints gần nhất để làm cơ sở cho việc commit khối lượng công việc ở Sprint Planning kế tiếp, tránh over-commitment.

## Checklist
- [ ] Đặt lịch định kỳ (Recurring Calendar Invites) cho tất cả các ceremonies.
- [ ] Thiết lập bot nhắc nhở Daily Standup trên Slack.
- [ ] Không ai được phép thêm task mới vào Sprint đang chạy trừ khi có sự đồng ý của cả team và là cờ khẩn cấp (Production Bug).

## Tài liệu liên quan
- [Definition of Done](DefinitionOfDone.md)
- [Definition of Ready](DefinitionOfReady.md)

## Việc cần làm tiếp
- Setup Sprint Board trên công cụ quản lý dự án (Jira/Linear).
- Định nghĩa thang điểm Story Points (VD: Dãy Fibonacci 1, 2, 3, 5, 8).
