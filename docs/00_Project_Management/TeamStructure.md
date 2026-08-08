# Team Structure & Responsibilities

## Mục tiêu
Định nghĩa rõ ràng cấu trúc đội ngũ, vai trò, trách nhiệm của từng cá nhân trong dự án **Internet Immune System**. Xây dựng Ma trận RACI để đảm bảo mọi công việc đều có người chịu trách nhiệm, tránh chồng chéo hoặc bỏ sót công việc, đồng thời thiết lập quy tắc giao tiếp hiệu quả.

## Nội dung chính

### 1. Cấu trúc đội ngũ (Team Roles)
Dự án được triển khai bởi một đội ngũ tinh gọn (Cross-functional team) để đảm bảo tốc độ và tính linh hoạt.

| Vai trò (Role) | Chức năng & Trách nhiệm (Responsibilities) |
| :--- | :--- |
| **Project Manager / Product Owner (PM/PO)** | Định hướng tầm nhìn sản phẩm, quản lý Product Backlog, đảm bảo team đi đúng hướng để đạt Top 10 AI Riser Vietnam. Quản lý tiến độ, ngân sách. |
| **AI/ML Engineer** | Tích hợp và tối ưu hóa **Gemini API**. Xây dựng logic cho Fraud Detection, AI Explanation, và tinh chỉnh prompt engineering. |
| **Backend / Cloud Engineer** | Xây dựng và quản lý hạ tầng **Google Cloud, Firebase, Cloud Run**. Đảm bảo API hiệu suất cao, bảo mật dữ liệu và kiến trúc microservices. |
| **Frontend / UX Engineer** | Thiết kế và phát triển giao diện người dùng. Xây dựng **AI Experience**, Consequence Simulation và module User Training. |
| **Security / Domain Expert** | Cung cấp kiến thức chuyên môn về các kịch bản lừa đảo (Scams) tại Việt Nam, kiểm thử độ chính xác của hệ thống, xây dựng nội dung cho module User Training. |

### 2. Ma trận RACI (RACI Matrix)
*R = Responsible (Người làm), A = Accountable (Người chịu trách nhiệm chính), C = Consulted (Người tư vấn), I = Informed (Người được thông báo)*

| Hạng mục công việc (Task) | PM/PO | AI Engineer | Cloud Engineer | UX Engineer | Security Expert |
| :--- | :---: | :---: | :---: | :---: | :---: |
| Lên ý tưởng & Yêu cầu sản phẩm | A/R | C | C | C | C |
| Thiết kế kiến trúc Google Cloud | I | C | A/R | C | I |
| Tích hợp & Tối ưu Gemini API | I | A/R | C | I | C |
| Phát triển giao diện AI Experience | I | I | C | A/R | C |
| Xây dựng dữ liệu lừa đảo & Prompt | C | R | I | I | A/R |
| Chuẩn bị Pitch Deck AI Riser | A/R | R | R | R | R |

### 3. Giao thức giao tiếp (Communication Protocols)
- **Slack/Teams**: Giao tiếp hàng ngày, chia thành các channel: `#general` (chung), `#dev-backend`, `#dev-frontend`, `#ai-models`, `#alerts` (cho system logs).
- **GitHub**: Code review (Pull Requests bắt buộc cần ít nhất 1 người review), quản lý version control.
- **Jira/Trello**: Cập nhật trạng thái công việc (To do, In Progress, Review, Done). Yêu cầu cập nhật daily.
- **Tài liệu**: Mọi quyết định kỹ thuật quan trọng phải được viết thành ADR (Architecture Decision Record) lưu trong thư mục `docs/`.

## Checklist
- [ ] Mọi thành viên đã nắm rõ vai trò và trách nhiệm của mình.
- [ ] Ma trận RACI đã được chia sẻ và đồng thuận.
- [ ] Quyền truy cập (Access Control) cho GitHub, Google Cloud, Firebase đã được cấp phát theo đúng vai trò.

## Tài liệu liên quan
- [Meeting Protocol](./MeetingProtocol.md)
- [Project Charter](./ProjectCharter.md)

## Việc cần làm tiếp
- Gán tên người cụ thể (Assignees) vào các vai trò trong danh sách đội ngũ.
- Thiết lập phân quyền trên IAM Google Cloud cho từng thành viên.
