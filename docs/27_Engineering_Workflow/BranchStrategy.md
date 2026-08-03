# Branch Strategy & Protection Rules

## Mục tiêu
Chuẩn hóa cách đặt tên nhánh và thiết lập các quy tắc bảo vệ (Protection Rules) trên hệ thống quản lý mã nguồn (GitHub/GitLab) nhằm đảm bảo sự minh bạch, dễ tra cứu và ngăn ngừa các lỗi vô ý ảnh hưởng đến code base của Internet Immune System.

## Nội dung chính

### 1. Quy ước đặt tên nhánh (Naming Conventions)
Mọi nhánh phải được bắt đầu bằng loại công việc, theo sau là mã ticket (Jira/Linear) và mô tả ngắn gọn.
**Cú pháp:** `<type>/<ticket-id>-<kebab-case-description>`

**Các loại nhánh (Types):**
- `feat/`: Tính năng mới (ví dụ: `feat/IIS-45-add-phishing-simulation`)
- `fix/`: Sửa lỗi (ví dụ: `fix/IIS-89-fix-gemini-timeout`)
- `chore/`: Các thay đổi không liên quan đến logic ứng dụng (ví dụ: cập nhật dependencies, setup build) (ví dụ: `chore/IIS-12-update-firebase-sdk`)
- `security/`: Các bản vá bảo mật (ví dụ: `security/IIS-99-patch-xss-vulnerability`)
- `docs/`: Cập nhật tài liệu.
- `test/`: Bổ sung hoặc sửa test cases.
- `refactor/`: Viết lại code nhưng không làm thay đổi hành vi.

### 2. Branch Protection Rules (Quy tắc bảo vệ nhánh)
Áp dụng bắt buộc cho nhánh `main` và các nhánh `release/*`:

- **Require Pull Request before merging:** Không được push trực tiếp. Mọi thay đổi phải qua PR.
- **Require approvals:** Ít nhất 1 approval từ các thành viên trong team (ưu tiên Senior/Tech Lead cho các thay đổi kiến trúc).
- **Require status checks to pass before merging:** 
  - CI Build phải thành công.
  - Coverage test phải đạt ngưỡng quy định (VD: > 80%).
  - Linter & Formatting checks passed.
  - Security Scan (SAST) passed.
- **Require conversation resolution before merging:** Mọi comments trên PR phải được resolve.
- **Require linear history:** Chặn merge commits, bắt buộc dùng Squash hoặc Rebase merge.

### 3. Yêu cầu khi Merge (Merge Requirements)
- Developer chịu trách nhiệm đảm bảo nhánh của mình đã được cập nhật bản mới nhất từ `main` trước khi yêu cầu merge.
- Tiêu đề PR (PR Title) phải tuân theo chuẩn Conventional Commits.
- Mô tả PR phải có link đến Ticket, giải thích ngắn gọn cách giải quyết và đính kèm hình ảnh/video nếu có thay đổi về UI/UX.

## Checklist
- [ ] Thiết lập Branch Protection Rules trên GitHub repo cho `main`.
- [ ] Phổ biến quy ước đặt tên nhánh cho toàn team.
- [ ] Cài đặt tự động validate tên nhánh (branch-name-lint) trong Git hooks.

## Tài liệu liên quan
- [Git Flow](GitFlow.md)
- [Commit Convention](CommitConvention.md)

## Việc cần làm tiếp
- Tích hợp công cụ kiểm tra tên nhánh tự động qua Husky.
- Cấu hình Codeowners để tự động assign reviewer theo từng module (Backend, Frontend, Extension).
