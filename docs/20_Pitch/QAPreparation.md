# Chuẩn bị Trả lời Câu hỏi (Q&A Preparation)

## Mục tiêu
Dự đoán các câu hỏi khó từ ban giám khảo và chuẩn bị câu trả lời sắc bén, chuyên nghiệp.

## Nội dung chính

**1. Q: Nếu AI phân tích sai (False Positive) và chặn nhầm giao dịch hợp lệ thì sao?**
- **A:** Đó chính là lý do chúng tôi chọn cách tiếp cận "Simulate & Explain" thay vì "Hard Block". Nếu nghi ngờ, hệ thống cảnh báo và mô phỏng rủi ro, nhưng quyền quyết định cuối cùng vẫn thuộc về người dùng (Override). Hơn nữa, với LLM như Gemini, chúng tôi liên tục giảm tỷ lệ false positive nhờ context-awareness tốt hơn các thuật toán rule-based cũ.

**2. Q: Gemini API có độ trễ (latency), làm sao để đảm bảo realtime protection?**
- **A:** Chúng tôi áp dụng kiến trúc Hybrid. Lớp 1 (Local/Edge) dùng các rule nhẹ và model nhỏ để quét tĩnh siêu nhanh (<50ms). Khi phát hiện khả nghi, hệ thống giữ chân người dùng bằng UX (ví dụ: màn hình loading an toàn) trong khi Lớp 2 gọi Gemini API để phân tích sâu chuyên sâu (mất ~1-2s). 

**3. Q: Quyền riêng tư (Privacy) của người dùng được đảm bảo thế nào khi AI đọc màn hình/tin nhắn?**
- **A:** Hệ thống thiết kế theo nguyên lý Privacy-by-design. Các thông tin nhạy cảm (PII - Mật khẩu, số thẻ) được bóc tách và che giấu (masking) tại local bằng Regex trước khi gửi context lên đám mây phân tích. Chúng tôi không lưu trữ dữ liệu cá nhân của người dùng trên máy chủ.

**4. Q: Lợi thế cạnh tranh của các bạn so với tính năng chống lừa đảo tích hợp sẵn của Apple/Google là gì?**
- **A:** Apple/Google tập trung bảo vệ ở tầng OS và Network (chặn malware, chặn domain xấu). Họ không bảo vệ được "Human bug" (tâm lý con người) trong các vụ lừa đảo Social Engineering (như chuyển tiền cho kẻ mạo danh). Chúng tôi tập trung vào việc Educate và Simulate để bảo vệ tâm lý người dùng.

## Checklist
- [ ] Tập dượt Q&A thực tế với team, giả lập áp lực cao.
- [ ] Phân công người trả lời (Ví dụ: Tech thì CTO trả lời, Business thì CEO trả lời).

## Tài liệu liên quan
- [JudgeCriteria.md](file:///e:/PJ/docs/20_Pitch/JudgeCriteria.md)

## Việc cần làm tiếp
- Liên tục cập nhật danh sách câu hỏi trong quá trình test sản phẩm.
