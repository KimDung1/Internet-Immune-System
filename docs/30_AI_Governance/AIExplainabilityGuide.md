# AI Explainability Guide

## Mục tiêu
Đảm bảo rằng mọi quyết định, cảnh báo và mô phỏng của Internet Immune System đều có thể giải thích được một cách minh bạch (Explainable AI). Người dùng cần hiểu *tại sao* một nội dung bị đánh giá là lừa đảo, từ đó nâng cao nhận thức và được đào tạo thông qua quá trình sử dụng.

## Nội dung chính

### 1. Nguyên tắc Giải thích (Transparency Standards)
- **Không dùng Jargon**: Tránh các thuật ngữ kỹ thuật phức tạp (VD: "Chứng chỉ SSL hết hạn", "DNS Spoofing"). Thay vào đó sử dụng ngôn ngữ phổ thông (VD: "Trang web này không có hệ thống bảo mật tiêu chuẩn", "Tên miền đã bị làm giả để đánh lừa bạn").
- **Chỉ ra Bằng chứng cụ thể (Actionable Evidence)**: AI phải highlight chính xác phần nào của tin nhắn/URL là đáng ngờ (VD: "Tên ngân hàng bị viết sai chính tả thành 'Viietcombank'").
- **Tách biệt Sự thật và Suy luận**: Nêu rõ "Đây là thông tin chúng tôi tìm thấy" (Sự thật) và "Đây là rủi ro có thể xảy ra" (Suy luận).

### 2. Giọng điệu và Sự đồng cảm (Tone and Empathy)
- **Không phán xét (Non-judgmental)**: Không đổ lỗi cho người dùng. (Sai: "Bạn đã bất cẩn nhấn vào link này". Đúng: "Kẻ gian đã thiết kế tin nhắn này rất tinh vi để đánh lừa người nhận").
- **Bình tĩnh (Calm & Informative)**: Cảnh báo nhưng không gây hoảng loạn. Cung cấp ngay các bước hành động tiếp theo để bảo vệ bản thân.

### 3. Cấu trúc Lời Giải thích (Explainability Structure)
Mỗi cảnh báo nên bao gồm 3 phần:
1. **Kết luận (The Verdict)**: Tóm tắt rủi ro trong 1 câu (VD: "Đây có khả năng cao là tin nhắn lừa đảo mạo danh ngân hàng.").
2. **Dấu hiệu nhận biết (The "Why")**: Liệt kê 1-3 điểm bất thường chính yếu.
3. **Mô phỏng Hậu quả (The "What If")**: Nếu bạn làm theo, điều gì sẽ xảy ra? (Tính năng Consequence Simulation).
4. **Hành động khuyên dùng (The "Next Step")**: Hướng dẫn cách xử lý an toàn (VD: "Xóa tin nhắn này và không cung cấp mã OTP").

### 4. Giáo dục người dùng (User Training)
- Mục tiêu dài hạn của dự án là "Tiêm vaccine số" cho người dùng.
- Các lời giải thích của AI không chỉ là thông báo lỗi, mà là các "Micro-lessons" giúp người dùng tự nhận biết các mô-típ lừa đảo tương tự trong tương lai.

## Checklist
- [ ] Lời giải thích có dễ hiểu đối với một người không rành công nghệ (VD: người lớn tuổi) không?
- [ ] Có chỉ ra bằng chứng cụ thể trên văn bản/URL gốc không?
- [ ] Giọng điệu có mang tính đồng cảm và xây dựng không?
- [ ] Đã cung cấp hướng dẫn bước tiếp theo (Actionable advice) chưa?

## Tài liệu liên quan
- [PromptStandards.md](PromptStandards.md)
- [HallucinationMitigation.md](HallucinationMitigation.md)

## Việc cần làm tiếp
- Tạo các guideline về Tone & Voice cho mô hình AI trong System Instructions.
- Tiến hành User Testing (A/B testing các đoạn văn giải thích) để xem định dạng nào hiệu quả nhất trong việc thay đổi hành vi người dùng.
