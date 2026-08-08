# Scam Taxonomy

## Mục tiêu
Phân loại và cung cấp kiến thức nền tảng về các hình thức lừa đảo kỹ thuật số (Digital Scams) giúp đội ngũ phát triển, đặc biệt là Prompt Engineers và AI Engineers, hiểu rõ domain để xây dựng bộ quy tắc phát hiện hiệu quả cho Gemini AI.

## Nội dung chính

### 1. Phishing (Tấn công giả mạo)
- **Spear Phishing**: Tấn công nhắm mục tiêu vào cá nhân/tổ chức cụ thể, nội dung thường chứa thông tin riêng tư để tăng độ tin cậy.
- **Smishing / Vishing**: Phishing qua tin nhắn SMS hoặc cuộc gọi thoại.
- **Đặc điểm nhận diện**: Tên miền giả mạo (Typosquatting), cảnh báo khẩn cấp, yêu cầu cung cấp mã OTP/Password.

### 2. Social Engineering (Kỹ thuật xã hội)
- **Romance Scams (Lừa đảo tình cảm)**: Kẻ gian tạo hồ sơ giả, xây dựng lòng tin qua thời gian dài để vay mượn/xin tiền.
- **Tech Support Scams**: Giả danh nhân viên hỗ trợ từ Microsoft/Apple thông báo máy tính bị nhiễm virus và yêu cầu tải phần mềm từ xa (TeamViewer, AnyDesk).
- **Đặc điểm nhận diện**: Sử dụng yếu tố cảm xúc (sợ hãi, yêu thương), hối thúc người dùng thực hiện hành động ngay lập tức.

### 3. Investment & Crypto Scams (Lừa đảo đầu tư & Tiền ảo)
- **Ponzi / Pyramid Schemes**: Lấy tiền người sau trả cho người trước, cam kết lợi nhuận không tưởng (VD: "Lãi 10% mỗi ngày").
- **Rug Pulls**: Dự án tiền ảo mọc lên nhanh chóng, kêu gọi đầu tư, sau đó rút sạch thanh khoản.
- **Đặc điểm nhận diện**: Thiếu minh bạch về đội ngũ, cam kết lợi nhuận cao không rủi ro, website mới được đăng ký.

### 4. Deepfake & AI-Generated Scams
- **Deepfake Audio/Video**: Sử dụng AI để giả giọng/hình ảnh người thân gọi video call yêu cầu chuyển tiền gấp.
- **AI Phishing Emails**: Email lừa đảo được tạo bởi ngôn ngữ tự nhiên, không còn sai lỗi chính tả, cực kỳ khó phát hiện.
- **Đặc điểm nhận diện**: Hình ảnh đôi khi có biến dạng ở viền, giọng nói thiếu cảm xúc tự nhiên, số điện thoại lạ (dù hình ảnh có vẻ quen).

## Checklist
- [ ] Các prompt AI đã bao phủ đủ 4 nhóm lừa đảo này.
- [ ] Cơ sở dữ liệu mẫu (Training Data) có đủ ví dụ cho từng loại.

## Tài liệu liên quan
- [Knowledge Base Index](file:///e:/PJ/docs/41_Knowledge_Base/KnowledgeBaseIndex.md)

## Việc cần làm tiếp
- Thu thập dữ liệu thực tế (samples) của các loại lừa đảo thường gặp tại Việt Nam để tinh chỉnh mô hình cảnh báo.
- Đưa thêm mục Malware & Ransomware vào taxonomy trong tương lai.
