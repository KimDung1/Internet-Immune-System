# Hallucination Mitigation

## Mục tiêu
Ngăn chặn và giảm thiểu hiện tượng "ảo giác" (Hallucinations) của AI, nơi mô hình tạo ra các thông tin sai lệch, bịa đặt về nguồn gốc URL hoặc các chi tiết lừa đảo không có thật. Đảm bảo hệ thống Internet Immune System luôn cung cấp thông tin đáng tin cậy.

## Nội dung chính

### 1. Kỹ thuật Grounding (Grounding Techniques)
- **Retrieval-Augmented Generation (RAG)**: AI chỉ được phép đưa ra kết luận dựa trên dữ liệu được cung cấp trong prompt (nội dung trang web, danh sách blacklist từ Firebase).
- Cấm AI tự suy diễn thông tin bên ngoài nếu không có bằng chứng rõ ràng. Thêm lệnh: *"Only answer based on the provided context. If the context is insufficient, state explicitly that you cannot verify the safety."*
- Sử dụng Google Search Grounding (nếu được hỗ trợ bởi API) để kiểm chứng thông tin thực thể (ví dụ: xác minh tên miền chính thức của một ngân hàng).

### 2. Xác thực cấu trúc đầu ra (Structured JSON Validation)
- Yêu cầu AI luôn trả về định dạng JSON nghiêm ngặt.
- Bắt buộc phải có các trường `evidence` hoặc `reasoning` đi kèm với mọi kết luận `is_fraud: true`.
- Backend phải parse và validate JSON schema (sử dụng Pydantic hoặc Zod). Nếu lỗi parse, thử lại (retry) hoặc chuyển sang Fallback.

### 3. Cổng Đánh giá Độ Tự Tin (Confidence Scoring Gates)
- Bắt buộc AI trả về trường `confidence_score` (0.0 - 1.0).
- Nếu `confidence_score` < 0.8: Không hiển thị màn hình Cảnh báo Đỏ (Red Alert) trực tiếp, mà hiển thị màn hình Cảnh báo Vàng (Cần sự chú ý) để tránh False Positives.
- Không tự động chặn truy cập nếu AI không chắc chắn.

### 4. Human-in-the-Loop & Fallback
- Khi hệ thống gặp các mẫu hoàn toàn mới hoặc điểm tự tin quá thấp liên tục, sự cố sẽ được log lại và đưa vào hàng đợi cho chuyên gia con người (Threat Intelligence team) phân tích.
- Nếu API fail hoặc trả về lỗi, luôn fallback về trạng thái an toàn mặc định (Fail-Safe), hiển thị thông báo: "Hệ thống AI hiện không thể quét liên kết này, vui lòng tự cẩn thận."

## Checklist
- [ ] Prompt đã có lệnh yêu cầu chỉ sử dụng dữ liệu được cung cấp (Grounding) chưa?
- [ ] Backend đã có cơ chế validate JSON schema chưa?
- [ ] Logic xử lý UI đã dựa trên mức độ `confidence_score` chưa?
- [ ] Đã có cơ chế ghi log các trường hợp AI từ chối trả lời do thiếu dữ liệu chưa?

## Tài liệu liên quan
- [PromptStandards.md](PromptStandards.md)
- [AIExplainabilityGuide.md](AIExplainabilityGuide.md)

## Việc cần làm tiếp
- Tích hợp Zod (TypeScript) / Pydantic (Python) vào backend để validate JSON.
- Đánh giá tính khả thi của việc tích hợp Google Search Grounding tool vào luồng quét URL.
