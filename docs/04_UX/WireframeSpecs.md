# Đặc tả Khung xương giao diện (Wireframe Specifications)

## Mục tiêu
Định nghĩa bố cục, các thành phần và hệ thống phân cấp trực quan cho các màn hình chính của Internet Immune System bằng văn bản. Đây là tài liệu đầu vào quan trọng cho giai đoạn thiết kế UI độ trung thực cao (High-fidelity).

## Nội dung chính

### 1. Dashboard (Trung tâm Chỉ huy)
* **Header:** Logo "Internet Immune System", Avatar người dùng, Nút Cài đặt.
* **Hero Section (Nửa trên):**
  * Vòng tròn hiển thị "Immunity Score" (0-100) ở trung tâm.
  * Bao quanh vòng tròn là hiệu ứng sóng năng lượng biểu thị trạng thái "Protect".
* **Main Content (Nửa dưới):**
  * Tab 1: "Hoạt động gần đây" (List view các mối đe dọa đã chặn, icon shield nhỏ).
  * Tab 2: "Kháng thể của bạn" (Lưới hiển thị các huy hiệu/cấp độ đạt được từ Train Mode).
* **Floating Action Menu:** Nút bấm đa năng ở giữa dưới cùng màn hình (quét URL, báo cáo).

### 2. Màn hình Detect (Quét Gian lận)
* **Top Bar:** Nút "Quay lại", Tiêu đề "AI Scanner".
* **Center:**
  * Input field lớn để dán URL hoặc Text.
  * Hoặc khu vực drop-zone để thả file.
* **Scanning State:** Input mờ đi, xuất hiện một đường quét ngang màn hình kết hợp với text typing (ví dụ: "Phân tích metadata...", "Kiểm tra cơ sở dữ liệu...").
* **Result Card:**
  * Icon lớn (Tick xanh hoặc Cảnh báo Đỏ).
  * Đoạn text tóm tắt (AI-generated).
  * Nút "Xem mô phỏng hậu quả" (Simulate) và "Giải thích chi tiết" (Explain).

### 3. Màn hình Simulate (Consequence Theater)
* **Layout:** Full-screen, chế độ tối (Dark mode) hoàn toàn.
* **Timeline View:** Giao diện phân chia theo trục thời gian dọc hoặc ngang.
  * Node 1: Người dùng thao tác.
  * Node 2: Kẻ tấn công phản hồi.
  * Node 3: Hậu quả.
* **Footer:** Control bar để Pause/Play mô phỏng, Nút "Thoát mô phỏng".

### 4. Pop-up Cảnh báo (Real-time Protection Overlay)
* **Bố cục Pop-up:** Nổi lên ở giữa màn hình hoặc thả xuống từ trên cùng (Toast notification) nếu là rủi ro thấp.
* **Rủi ro cao:** Chiếm 1/3 màn hình. Icon lá chắn vỡ (nếu là trang bị hỏng), hoặc lá chắn kim cương. Nút "Quay về nơi an toàn" (Primary, to, rõ) và "Vẫn tiếp tục truy cập" (Text link nhỏ, xám, cần xác nhận hai lần).

## Checklist
- [x] Đặc tả cho Dashboard, Detect, Simulate, và Overlay.
- [x] Liệt kê vị trí các phần tử UI chính.
- [x] Quy định mức độ ưu tiên của các nút hành động (Call to action).

## Tài liệu liên quan
- `04_UX/InformationArchitecture.md`
- `05_UI/UISpecs.md`

## Việc cần làm tiếp
- Chuyển các mô tả văn bản này thành Wireframes dạng lo-fi trên Figma.
- Review wireframes với đội ngũ phát triển để đảm bảo tính khả thi trên môi trường Google Cloud/Firebase.
