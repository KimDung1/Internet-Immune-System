# Feature Flag Management

## Mục tiêu
Cung cấp phương pháp luận quản lý các tính năng (Feature Flags/Toggles) của Internet Immune System. Cho phép team phát triển ẩn/hiện tính năng trên production mà không cần deploy lại code, hỗ trợ rollout an toàn, A/B testing và có cơ chế kill-switch (công tắc khẩn cấp) để tắt ngay tính năng lỗi.

## Nội dung chính

### 1. Cơ sở hạ tầng (Infrastructure)
Chúng ta sẽ sử dụng **Firebase Remote Config** (hoặc một nền tảng chuyên dụng như LaunchDarkly/PostHog) làm hệ thống quản lý Feature Flag chính cho cả Chrome Extension và Backend.

### 2. Phân loại Feature Flags
- **Release Flags**: (Vòng đời ngắn). Dùng để ẩn các tính năng đang phát triển (work-in-progress) khỏi end-user. Khi tính năng hoàn thiện 100% và rollout thành công, flag này **phải được xóa bỏ** khỏi codebase.
- **Kill-Switches (Ops Flags)**: (Vòng đời dài). Dùng để tắt khẩn cấp một service. VD: `disable_gemini_vision` nếu API của Google bị lỗi hàng loạt.
- **Experiment Flags**: (Vòng đời trung bình). Dùng cho A/B testing (Ví dụ: Thử nghiệm 2 prompt khác nhau cho Gemini AI để xem cái nào phát hiện lừa đảo chính xác hơn).

### 3. Chiến lược Rollout
- **Ring 0 (Internal/Dogfooding)**: Chỉ mở flag cho tài khoản của dev team.
- **Ring 1 (Beta Testers)**: Mở cho 5-10% user đăng ký chương trình early access.
- **Ring 2 (Canary)**: Mở ngẫu nhiên cho 25% - 50% tập người dùng.
- **Ring 3 (General Availability - GA)**: Rollout 100%.

### 4. Vòng đời của một Feature Flag
1. **Tạo Flag**: Định nghĩa flag trên Firebase Remote Config (tên chuẩn `snake_case`, vd: `enable_realtime_phishing_scan`). Thêm giá trị default (thường là `false`) vào codebase.
2. **Sử dụng**: Wrap logic tính năng mới bên trong câu lệnh IF kiểm tra flag.
3. **Rollout**: Tăng dần phần trăm theo chiến lược ở mục 3. Theo dõi metrics (Sentry, Analytics).
4. **Cleanup (Dọn dẹp)**: Sau khi rollout 100% an toàn trong 1-2 tuần, tạo PR để xóa bỏ cấu trúc IF và gỡ bỏ flag khỏi code base và hệ thống Remote Config (đối với Release Flags).

## Checklist
- [ ] Mọi tính năng lớn đều phải được wrap trong Feature Flag.
- [ ] Không lạm dụng Feature Flag gây ra hiệu ứng "Flag Hell" (code quá phức tạp do nhiều IF lồng nhau).
- [ ] Cập nhật trạng thái flag (Rollout %, mô tả) rõ ràng trên hệ thống quản lý.
- [ ] Dọn dẹp (cleanup) flag ngay khi không còn cần thiết.

## Tài liệu liên quan
- [Release Process](ReleaseProcess.md)

## Việc cần làm tiếp
- Tích hợp Firebase Remote Config SDK vào Chrome Extension và Backend.
- Xây dựng quy trình review định kỳ (hàng tháng) để phát hiện và dọn dẹp các "stale flags" (flag cũ không còn dùng).
