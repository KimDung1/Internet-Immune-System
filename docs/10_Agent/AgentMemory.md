# Agent Memory Architecture

## Mục tiêu
Thiết kế kiến trúc bộ nhớ cho các Agent trong hệ thống Internet Immune System để đảm bảo khả năng học tập, ghi nhớ ngữ cảnh người dùng, và thích ứng với các mẫu lừa đảo mới.

## Nội dung chính

Hệ thống Agent Memory được chia làm 4 loại cơ bản, kết hợp giữa bộ nhớ cục bộ (trong LLM context) và bộ nhớ ngoại vi (Database).

### 1. Short-Term Memory (Working Memory)
- **Mục đích:** Ghi nhớ bối cảnh của cuộc trò chuyện hoặc phiên làm việc hiện tại.
- **Triển khai:** Lưu trữ trong Context Window của Gemini AI. Đối với các chuỗi tác vụ dài, lưu trữ tạm trên Redis.
- **Vòng đời:** Kết thúc khi phiên (Session) người dùng đóng lại hoặc sau 30 phút không hoạt động.

### 2. Long-Term Memory (Episodic & Semantic)
- **Mục đích:** Ghi nhớ các quyết định trước đó của hệ thống để tránh lặp lại phân tích tốn thời gian.
- **Triển khai:** Vector Database hoặc Firestore. Dữ liệu là các Embeddings của các trường hợp lừa đảo đã giải quyết.

### 3. User Profile Memory
- **Mục đích:** Cá nhân hóa trải nghiệm và lộ trình đào tạo cho từng người dùng.
- **Dữ liệu lưu trữ:** 
  - User Trust Score.
  - Lịch sử tương tác (những loại lừa đảo người dùng hay mắc bẫy).
  - Mức độ hoàn thành các khóa đào tạo của Trainer Agent.
- **Quyền truy cập:** Chủ yếu được Trainer Agent và Orchestrator truy cập thông qua Firestore.

### 4. Fraud Pattern Memory (Threat Intelligence)
- **Mục đích:** Lưu trữ các mẫu lừa đảo chung, toàn cầu hoặc đặc thù khu vực (Việt Nam).
- **Nguồn dữ liệu:** Cập nhật liên tục bởi Detector Agent, cộng đồng và các đối tác An ninh mạng.
- **Kiến trúc:** Firestore Collections được Index để truy vấn nhanh chóng qua Hash (URL, SĐT, IP).

## Checklist
- [x] Phân loại bộ nhớ (Short-term, Long-term).
- [x] Tách biệt bộ nhớ người dùng (User Profile) và bộ nhớ toàn cục (Fraud Pattern).
- [x] Định hướng công nghệ lưu trữ.

## Tài liệu liên quan
- [DatabaseSchema.md](../11_Database/DatabaseSchema.md)
- [AgentSpecs.md](./AgentSpecs.md)

## Việc cần làm tiếp
- Lựa chọn giải pháp Vector Search (có thể dùng Firestore Vector Search hoặc Pinecone) cho Long-Term Memory.
