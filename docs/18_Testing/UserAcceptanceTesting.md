# User Acceptance Testing (UAT)

## Mục tiêu
Nghiệm thu hệ thống từ góc độ người dùng cuối (End-users) và ban giám khảo (đối với cuộc thi AI Riser Vietnam). Đảm bảo sản phẩm trực quan, dễ hiểu, giải quyết đúng nỗi đau (pain point) của người dùng về vấn nạn lừa đảo qua mạng.

## Nội dung chính

### 1. Nhóm đối tượng UAT (UAT Audience)
Thay vì kỹ sư, UAT cần được thực hiện bởi:
- **Người dùng không am hiểu công nghệ (Non-tech users)**: Phản ánh đúng tệp khách hàng dễ bị lừa đảo nhất.
- **Sinh viên/Dân văn phòng**: Đối tượng sử dụng Internet thường xuyên.
- **Cố vấn (Mentors)**: Đóng vai trò là giám khảo để đánh giá tính thương mại và độ hoàn thiện của sản phẩm.

### 2. Kịch bản đánh giá UAT (UAT Scenarios)
Tập trung vào **Tính trực quan (UI/UX)** và **Giá trị nhận được**.

**Trải nghiệm Onboarding (Cài đặt ban đầu)**
- Người dùng cài đặt extension và tạo tài khoản lần đầu.
- Tiêu chí: Mất bao lâu để sẵn sàng sử dụng? Các bước có rõ ràng không?

**Trải nghiệm Thực chiến (Thử nghiệm với lừa đảo thật)**
- Đưa cho người dùng một màn hình chứa email lừa đảo trúng thưởng. Yêu cầu họ dùng công cụ kiểm tra.
- Tiêu chí đánh giá:
  - Họ có biết click vào đâu để bắt đầu phân tích không?
  - Văn bản giải thích của AI (Gemini) có dễ hiểu không, hay quá chứa nhiều từ ngữ kỹ thuật (như "DNS", "SSL certificate")?
  - Màu sắc cảnh báo (Đỏ/Vàng/Xanh) có truyền đạt được mức độ nguy hiểm?

**Trải nghiệm tính năng "Mô phỏng hậu quả"**
- Người dùng ấn nút "Mô phỏng hậu quả" trên một link lừa đảo đánh cắp tài khoản ngân hàng.
- Tiêu chí: Lời văn của AI có đủ sức răn đe không? Kịch bản đưa ra có thực tế với bối cảnh Việt Nam không?

### 3. Phương thức thu thập phản hồi
- Quay video quá trình người dùng sử dụng sản phẩm (Think-aloud protocol: Yêu cầu người dùng nói ra suy nghĩ của họ khi dùng).
- Khảo sát nhanh (Google Forms) cuối mỗi buổi test: Đánh giá thang điểm từ 1-5 về sự hữu ích và độ tin cậy.

### 4. Tiêu chí Nghiệm thu (Acceptance Criteria)
Sản phẩm được coi là "Sẵn sàng Demo" (Go-live) khi:
- 100% người dùng test thành công cảnh báo lừa đảo.
- Không có lỗi vỡ UI nghiêm trọng.
- Thông điệp giải thích từ AI được đánh giá > 4/5 điểm về độ dễ hiểu.

## Checklist
- [x] Lên kịch bản UAT.
- [ ] Chọn ra nhóm 5-10 người dùng thử nghiệm nội bộ.
- [ ] Soạn thảo form khảo sát đánh giá.
- [ ] Tổ chức các buổi UAT (từ xa hoặc trực tiếp).
- [ ] Tổng hợp feedback và tinh chỉnh UI/UX (hoặc sửa đổi AI Prompt để văn phong gần gũi hơn).

## Tài liệu liên quan
- [TestPlan.md](./TestPlan.md)
- [FraudDetectionAccuracy.md](./FraudDetectionAccuracy.md)

## Việc cần làm tiếp
- Tinh chỉnh lại Prompt của Gemini dựa trên feedback của UAT để loại bỏ các thuật ngữ IT cứng nhắc, thay bằng các ví dụ ẩn dụ thân thiện hơn.
- Thiết kế luồng User Journey Map hoàn chỉnh để thuyết trình trước ban giám khảo AI Riser.
