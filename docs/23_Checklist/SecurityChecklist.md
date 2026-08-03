# Danh sách Kiểm tra Bảo mật (Security Checklist)

## Mục tiêu
Đảm bảo hệ thống (dù là MVP) không bị hack, lộ lọt dữ liệu hoặc cạn kiệt tài nguyên (DDoS) trong quá trình Launch.

## Nội dung chính
**API & Secrets**
- [ ] Tuyệt đối không commit file `.env`, service account json lên GitHub (đã đưa vào `.gitignore`).
- [ ] Gemini API Key được giới hạn domain/IP truy cập.
- [ ] Firebase Config sử dụng App Check để chống giả mạo client.

**Cơ sở Dữ liệu (Firestore)**
- [ ] Firestore Security Rules đã được thiết lập chặt chẽ (không cho phép read/write toàn quyền).
- [ ] Dữ liệu mô phỏng lừa đảo không được lẫn với dữ liệu thật.

**Hạ tầng (Cloud Run)**
- [ ] Set Max Instances = 10 (tránh bị bot spam làm bill tăng vọt).
- [ ] Cấu hình Cloud Armor (WAF) để chặn các IP spam/DDoS cơ bản.

**Dữ liệu người dùng**
- [ ] Áp dụng cơ chế Masking cho các input văn bản trước khi gửi cho LLM.
- [ ] Cập nhật Privacy Policy trên Landing Page.

## Tài liệu liên quan
- [ADR_001_TechStack.md](file:///e:/PJ/docs/25_Decision_Record/ADR_001_TechStack.md)

## Việc cần làm tiếp
- Chạy công cụ quét lỗ hổng cơ bản (như SonarQube hoặc OWASP ZAP) trước khi deploy bản cuối.
