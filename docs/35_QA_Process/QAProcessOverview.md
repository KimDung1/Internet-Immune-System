# QA Process & Strategy Overview

## Mục tiêu
Định hình chiến lược Đảm bảo Chất lượng (QA) toàn diện cho "Internet Immune System". Thiết lập một quy trình chuẩn mực kết hợp giữa kiểm thử tự động (Automation) và thủ công (Manual) nhằm đảm bảo hệ thống hoạt động chính xác, bảo mật và hiệu năng cao.

## Nội dung chính
Tài liệu cung cấp cái nhìn tổng quan về các cấp độ kiểm thử, chiến lược tự động hóa, và chu kỳ kiểm thử thủ công trong suốt vòng đời phát triển phần mềm (SDLC).

## 1. Chiến lược Kiểm thử (Testing Strategy)
Sản phẩm là một hệ thống bảo mật AI, do đó độ chính xác (Accuracy) và độ trễ (Latency) là yếu tố sống còn.

*   **Shift-Left Testing:** Đưa QA tham gia ngay từ giai đoạn thiết kế (Design/Requirement) để phát hiện lỗ hổng logic sớm.
*   **Continuous Testing:** Tích hợp kiểm thử tự động vào mọi bước của CI/CD pipeline.
*   **AI Model Validation:** Cần có bộ dataset chuẩn để đánh giá chất lượng phản hồi của Gemini AI định kỳ (chống hallucination).

## 2. Ma trận Tự động hóa (Automation Matrix)

| Cấp độ | Công cụ / Framework | Phạm vi bao phủ (Coverage Target) | Trách nhiệm |
| :--- | :--- | :--- | :--- |
| **Unit Testing** | Jest (JS), PyTest (Python) | > 80% logic nghiệp vụ cốt lõi | Backend/Frontend Devs |
| **Integration Testing** | Supertest, Firebase Emulators | 100% các API Endpoints và Cloud Functions | Backend Devs / SDET |
| **E2E Testing (UI)** | Cypress hoặc Playwright | Luồng quan trọng: Đăng nhập, Báo cáo lừa đảo, Cài đặt | QA Automation |
| **AI Evaluation** | Custom Scripts + Vertex AI Eval | 100% thay đổi prompt/model phải qua benchmark | AI/ML Engineer |
| **Performance** | k6, Lighthouse CI | Core APIs, Frontend Web Vitals | DevOps / QA |

## 3. Chu kỳ Kiểm thử Thủ công (Manual Test Cycles)
Dù đẩy mạnh tự động hóa, kiểm thử thủ công vẫn cần thiết cho UX và các tình huống phức tạp.

*   **Exploratory Testing (Kiểm thử Khám phá):** Thực hiện khi có tính năng mới liên quan đến trải nghiệm tương tác với AI.
*   **Accessibility & UX Audit:** Kiểm tra thủ công định kỳ hằng tháng dựa trên [UX Checklist](../23_Checklist/UXChecklist.md) và [Accessibility Checklist](../23_Checklist/AccessibilityChecklist.md).
*   **UAT (User Acceptance Testing):** Product Manager và nhóm nội bộ đánh giá lần cuối trước khi phát hành (Release Candidate).

## 4. Môi trường Kiểm thử (Environments)
1.  **Local/Emulators:** Sử dụng Firebase Local Emulator Suite.
2.  **Staging:** Bản sao của Production (ẩn danh dữ liệu). Dùng cho Integration/E2E test và Manual test.
3.  **Production:** Môi trường thật. Chỉ thực hiện Smoke Tests nhẹ nhàng không làm hỏng dữ liệu.

## Tài liệu liên quan
- [Bug Lifecycle](./BugLifecycle.md)
- [CI/CD Pipeline Setup](../30_DevOps/CICDPipeline.md)

## Việc cần làm tiếp
- Xây dựng kho dữ liệu mẫu (Golden Dataset) chứa 500 URL lừa đảo thực tế để benchmark AI.
- Thiết lập hạ tầng chạy E2E Cypress tự động trên GitHub Actions.
