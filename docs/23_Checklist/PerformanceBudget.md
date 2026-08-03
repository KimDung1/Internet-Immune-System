# Strict Performance Budgets

## Mục tiêu
Thiết lập và duy trì các giới hạn hiệu suất nghiêm ngặt cho "Internet Immune System". Hiệu suất là một tính năng cốt lõi, đặc biệt khi xử lý phân tích AI theo thời gian thực (real-time protection).

## Nội dung chính
Định nghĩa các ngưỡng (budgets) cụ thể cho kích thước bundle, chỉ số Core Web Vitals, độ trễ của API và thời gian phản hồi của AI.

## Checklist (Các chỉ số bắt buộc)

### 1. Bundle Size (Frontend & Extension)
- [ ] **Initial JS Bundle:** < 150KB (gzipped).
- [ ] **CSS Bundle:** < 30KB (gzipped).
- [ ] **Chrome Extension Package:** Tổng dung lượng < 2MB để cài đặt nhanh chóng.

### 2. Core Web Vitals (Web Dashboard)
- [ ] **LCP (Largest Contentful Paint):** < 2.5 giây.
- [ ] **FID (First Input Delay):** < 100 mili-giây.
- [ ] **CLS (Cumulative Layout Shift):** < 0.1.

### 3. API & Backend Latency (Cloud Run & Firestore)
- [ ] **Standard API Response Time (P95):** < 200 mili-giây.
- [ ] **Database Read/Write Latency:** < 50 mili-giây.
- [ ] **Cold Start (Cloud Run):** Dưới 2 giây.

### 4. AI & Gemini Integration Performance
- [ ] **AI Scan Response Time (P90):** < 1.5 giây cho mỗi lần phân tích nội dung/URL (Bao gồm thời gian gọi Gemini API và xử lý kết quả).
- [ ] **Phân tích theo luồng (Streaming):** Các phản hồi giải thích từ AI (AI Explanation) phải bắt đầu hiển thị byte đầu tiên (TTFB) trong vòng < 500 mili-giây.

## Kiểm soát & Giám sát
- Các cảnh báo (Alerts) phải được thiết lập trên Google Cloud Monitoring nếu P95 của API vượt qua mức ngân sách.
- CI/CD pipeline (Lighthouse CI) sẽ thất bại (fail build) nếu điểm Performance rớt xuống dưới 90 hoặc LCP vượt quá ngưỡng.

## Tài liệu liên quan
- [Performance Optimization Guide](../15_Performance/OptimizationGuide.md)
- [Monitoring & Alerting Setup](../30_DevOps/MonitoringSetup.md)

## Việc cần làm tiếp
- Tích hợp công cụ đo lường kích thước bundle (size-limit) vào pre-commit hooks.
- Tối ưu hóa prompt và hệ thống caching cho Gemini để đảm bảo mốc 1.5s cho AI Scan.
