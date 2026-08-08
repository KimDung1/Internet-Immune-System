# Commit Convention & Hooks

## Mục tiêu
Chuẩn hóa cách viết commit message theo chuẩn Conventional Commits để tự động hóa việc tạo Release Notes, xác định Semantic Versioning và giúp lịch sử thay đổi code của Internet Immune System rõ ràng, dễ truy xuất.

## Nội dung chính

### 1. Cấu trúc Commit (Conventional Commits Specification)
Chúng ta tuân thủ nghiêm ngặt chuẩn [Conventional Commits](https://www.conventionalcommits.org/).

**Cú pháp:**
```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

### 2. Định nghĩa các thành phần
**Type:** (Bắt buộc)
- `feat`: Tính năng mới (tương ứng với MINOR trong semver).
- `fix`: Sửa lỗi (tương ứng với PATCH trong semver).
- `docs`: Chỉ thay đổi tài liệu.
- `style`: Thay đổi không ảnh hưởng đến ý nghĩa của code (khoảng trắng, formatting, dấu chấm phẩy...).
- `refactor`: Thay đổi code không phải fix bug cũng không phải thêm tính năng.
- `perf`: Thay đổi code cải thiện hiệu năng (quan trọng cho AI processing).
- `test`: Thêm mới hoặc sửa các test bị thiếu.
- `build`: Thay đổi ảnh hưởng đến hệ thống build hoặc dependencies ngoại vi (npm, pip, docker).
- `ci`: Thay đổi các file cấu hình CI và script (GitHub Actions).
- `chore`: Các thay đổi khác không sửa đổi `src` hay file test.

**Scope:** (Tùy chọn) 
Vùng mã nguồn bị ảnh hưởng. Các scope phổ biến của project:
- `extension`: Chrome extension UI/background.
- `backend`: Cloud Run / API.
- `ai`: Các module liên quan đến Gemini / Prompt engineering.
- `auth`: Firebase Authentication.
- `db`: Firestore / Database schemas.

**Subject:** (Bắt buộc)
Mô tả ngắn gọn về thay đổi. 
- Sử dụng thì hiện tại (imperative, present tense): "add feature" thay vì "added feature".
- Không viết hoa chữ cái đầu tiên (trừ danh từ riêng).
- Không có dấu chấm ở cuối.

### 3. Ví dụ
- `feat(ai): integrate Gemini vision model for phishing detection`
- `fix(auth): resolve token expiration issue`
- `perf(extension): optimize content script loading time`
- `feat(backend)!: change API response structure for explanations` (Dấu `!` báo hiệu BREAKING CHANGE - MAJOR version).

### 4. Git Hooks Setup (Husky + Commitlint)
Để đảm bảo mọi commit đều đúng chuẩn trước khi push, chúng ta sử dụng `husky` kết hợp với `@commitlint/config-conventional`.

- **pre-commit**: Chạy `lint-staged` (ESLint, Prettier) để format code và kiểm tra lỗi.
- **commit-msg**: Chạy `commitlint` để validate cấu trúc commit message.

## Checklist
- [ ] Tuân thủ Conventional Commits cho mọi commit được push.
- [ ] Cài đặt thành công Husky và Commitlint ở local environment.
- [ ] Title của các Pull Request phải tuân thủ chuẩn commit để quá trình squash merge tạo ra commit chuẩn xác.

## Tài liệu liên quan
- [Branch Strategy](BranchStrategy.md)
- [Release Process](ReleaseProcess.md)

## Việc cần làm tiếp
- Cấu hình file `commitlint.config.js` với các scope cụ thể của dự án.
- Tích hợp `standard-version` hoặc `release-please` để tự động bump version và sinh CHANGELOG dựa trên commit history.
