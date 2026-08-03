# Git Flow & Trunk-Based Development Hybrid

## Mục tiêu
Xác định luồng làm việc (workflow) quản lý mã nguồn linh hoạt, kết hợp sự chặt chẽ của Git Flow cho các bản release chính thức và sự nhanh nhẹn của Trunk-based development cho quá trình phát triển hàng ngày. Giúp team Internet Immune System duy trì tốc độ phát triển cao (Continuous Integration/Continuous Delivery) mà vẫn đảm bảo tính ổn định của hệ thống AI-powered.

## Nội dung chính

### 1. Mô hình Hybrid Workflow
Internet Immune System sử dụng mô hình lai:
- **Trunk-based development** cho backend (Firebase, Cloud Run) và AI Services (Gemini AI integration): Đẩy nhanh tốc độ iteration, merges nhỏ và liên tục vào `main`.
- **Git Flow (Modified)** cho Chrome Extension: Do tính chất review app store mất thời gian, cần quản lý các phiên bản release cụ thể qua nhánh `release/` và `tag`.

### 2. Các nhánh (Branches) chính
- **`main`**: Nhánh cốt lõi. Luôn ở trạng thái có thể deploy (deployable state) đối với Backend/AI và là source of truth. Không được push trực tiếp, phải thông qua PR.
- **`development`**: (Không sử dụng). Chúng ta merge thẳng vào `main` cho backend.
- **Nhánh tính năng (`feat/*`, `fix/*`, `chore/*`)**: Tách ra từ `main`. Vòng đời ngắn (tối đa 2-3 ngày).
- **`release/vX.Y.Z`**: (Chỉ dành cho Extension). Tách ra từ `main` khi chuẩn bị release lên Chrome Web Store. Chỉ nhận các bug fixes vào phút chót.
- **`hotfix/*`**: Tách ra từ `main` hoặc `tag` khi có lỗi nghiêm trọng trên Production cần fix ngay lập tức (VD: AI model failing, critical security vulnerability).

### 3. Quy trình thực thi (Life Cycles)
1. **Khởi tạo**: Developer tạo nhánh `feat/TICKET-123-short-desc` từ `main`.
2. **Phát triển**: Commit code thường xuyên. Push lên remote.
3. **Pull Request (PR)**: Tạo PR vào `main`. Yêu cầu ít nhất 1 code review (Approval) và pass toàn bộ CI pipeline (Tests, Linter, Security Scan).
4. **Merge**: Sử dụng chiến lược `Squash and Merge` để giữ lịch sử `main` sạch sẽ.
5. **Release (Extension)**: Cắt nhánh `release/vX.Y.Z` từ `main`. Chạy E2E tests, sau đó đánh `Tag` và release. Merge ngược những thay đổi (nếu có) về `main`.

## Checklist
- [ ] Mọi thay đổi đều phải thực hiện trên nhánh riêng biệt và tạo PR.
- [ ] Không ai có quyền push trực tiếp (Direct push) vào `main`.
- [ ] PR vào `main` phải pass CI/CD pipeline (Unit Test, E2E Test, Build).
- [ ] Vòng đời của một nhánh tính năng không nên vượt quá 3 ngày.

## Tài liệu liên quan
- [Branch Strategy](BranchStrategy.md)
- [Commit Convention](CommitConvention.md)
- [Release Process](ReleaseProcess.md)

## Việc cần làm tiếp
- Cấu hình CI/CD trên GitHub Actions để chặn merge nếu tests fail.
- Setup tự động gán nhãn (auto-labeling) cho PR dựa trên tên nhánh.
