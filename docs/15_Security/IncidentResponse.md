# Incident Response Playbook

## Mục tiêu
Hướng dẫn các bước phản ứng nhanh chóng và hiệu quả khi xảy ra sự cố bảo mật (Security Incident) đối với hệ thống Internet Immune System.

## Nội dung chính
### 1. Phân loại sự cố (Incident Severity)
- **P1 (Critical)**: Dữ liệu người dùng bị rò rỉ, hệ thống bị sập hoàn toàn (DDoS), API Key của Gemini bị lộ. (Response Time: < 30 phút).
- **P2 (High)**: Một phần dịch vụ không hoạt động, lỗi AI phân loại sai hàng loạt chặn trang web hợp lệ của người dùng. (Response Time: < 2 giờ).
- **P3 (Medium)**: Lỗi UI/UX, trục trặc nhỏ không ảnh hưởng bảo mật cốt lõi. (Response Time: < 24 giờ).

### 2. Quy trình xử lý (IR Lifecycle)
1. **Preparation**: Backup DB liên tục, lưu logs trên Cloud Logging, thiết lập Alerts trên Discord/Slack.
2. **Identification**: Phát hiện sự cố qua cảnh báo tự động hoặc báo cáo từ người dùng.
3. **Containment**: 
   - Nếu rò rỉ API Key: Revoke (thu hồi) ngay lập tức trên Google Cloud Console.
   - Nếu bị DDoS: Kích hoạt chế độ "Under Attack" của Cloud Armor hoặc tắt tạm thời API public.
4. **Eradication**: Vá lỗ hổng, deploy bản vá (Hotfix).
5. **Recovery**: Khôi phục dịch vụ từ bản backup an toàn nhất.
6. **Lessons Learned**: Viết báo cáo Post-Mortem.

### 3. Kênh liên lạc và Ma trận leo thang (Escalation)
- **DevOps/SecOps Team Lead**: Chịu trách nhiệm trực PagerDuty.
- **Project Manager**: Liên lạc với đối tác (nếu có) và điều phối.
- **PR/Legal**: Chuẩn bị thông cáo báo chí, báo cáo với Cục An toàn thông tin (nếu có rò rỉ dữ liệu).

## Checklist
- [ ] Cấu hình PagerDuty / Slack Alerts cho các log bất thường.
- [ ] Đảm bảo có kế hoạch Disaster Recovery (DR).

## Tài liệu liên quan
- [Security Architecture](./SecurityArchitecture.md)

## Việc cần làm tiếp
- Tổ chức Diễn tập an ninh (Tabletop Exercise) 6 tháng/lần với team để rèn luyện kĩ năng phản ứng.
