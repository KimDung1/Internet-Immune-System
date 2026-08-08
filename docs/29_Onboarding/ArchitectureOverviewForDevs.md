# Architecture Overview for Devs

## Mục tiêu
Cung cấp bức tranh toàn cảnh về mặt kiến trúc phần mềm, luồng dữ liệu và sự tương tác giữa các services trong hệ thống Internet Immune System cho các kỹ sư mới gia nhập.

## Nội dung chính

### 1. Mô hình kiến trúc cấp cao (High-Level Architecture)
Hệ thống tuân theo mô hình Event-Driven Microservices kết hợp với Serverless Computing:
- **Client Layer**: 
  - *Browser Extension*: Chặn bắt dữ liệu DOM, URL, Network requests theo thời gian thực.
  - *Web Dashboard*: Giao diện quản lý, báo cáo, và mô phỏng hệ quả (Consequence simulation).
- **API Gateway & Serverless**: 
  - *Google Cloud Run*: Chứa các container backend xử lý logic phức tạp.
  - *Firebase Cloud Functions*: Xử lý các trigger thời gian thực (database updates, auth events).
- **AI Engine Layer**: 
  - *Gemini AI API*: Phân tích ngữ nghĩa, phát hiện ý định lừa đảo, tạo giải thích AI.
- **Data Layer**: 
  - *Firestore*: Cơ sở dữ liệu NoSQL thời gian thực.
  - *Cloud Storage*: Lưu trữ logs, file bằng chứng (screenshots).

### 2. Luồng dữ liệu chính (Core Data Flow)
1. **Thu thập dữ liệu**: Chrome Extension phát hiện URL khả nghi.
2. **Gửi cảnh báo**: Payload được mã hóa gửi tới Cloud Run API.
3. **Phân tích AI**: Hệ thống gọi Gemini API với prompt tối ưu để đánh giá mức độ rủi ro (Risk Scoring).
4. **Phản hồi thời gian thực**: Trả kết quả về Extension hiển thị cảnh báo đỏ hoặc mô phỏng hậu quả lừa đảo để huấn luyện người dùng.
5. **Lưu trữ & Học hỏi**: Dữ liệu nặc danh hóa được đưa vào Firestore để cải thiện model trong tương lai.

## Checklist
- [ ] Nắm được vai trò của Browser Extension vs Web App.
- [ ] Hiểu cách hệ thống tương tác với Gemini AI qua Cloud Run.
- [ ] Nắm được mô hình lưu dữ liệu trên Firestore.

## Tài liệu liên quan
- [Developer Onboarding](file:///e:/PJ/docs/29_Onboarding/DeveloperOnboarding.md)
- [Project Wiki](file:///e:/PJ/docs/41_Knowledge_Base/ProjectWiki.md)

## Việc cần làm tiếp
- Nghiên cứu sơ đồ luồng dữ liệu (Mermaid) trong repo source code.
- Xem code mẫu trong thư mục `packages/ai-engine`.
