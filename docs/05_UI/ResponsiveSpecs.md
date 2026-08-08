# Đặc tả Hiển thị Tương thích (Responsive Specifications)

## Mục tiêu
Đảm bảo Internet Immune System hoạt động hoàn hảo và giữ vững trải nghiệm "AI Experience" trên mọi kích thước màn hình. Hệ thống áp dụng phương pháp tiếp cận **Mobile-First**, do hành vi người dùng đối mặt với lừa đảo chủ yếu qua điện thoại (tin nhắn, mạng xã hội).

## Nội dung chính

### 1. Điểm ngắt (Breakpoints)
Sử dụng các điểm ngắt tiêu chuẩn tương thích với Tailwind CSS/Bootstrap:
* **Mobile (Mặc định):** < 768px
* **Tablet (md):** ≥ 768px
* **Desktop (lg):** ≥ 1024px
* **Large Desktop (xl):** ≥ 1440px

### 2. Chiến lược Layout (Layout Adaptation)
* **Mobile (< 768px):**
  * *Navigation:* Sử dụng Bottom Navigation Bar cố định chứa 5 icon cho 5 chế độ AI.
  * *Layout:* Cấu trúc 1 cột (1-column layout). Các phần tử như biểu đồ, bảng xếp hạng xếp chồng lên nhau (Stack).
  * *Tương tác:* Vuốt (Swipe) được ưu tiên cho các hành động phụ. Nút Action chính (Block/Scan) full-width bám dưới đáy màn hình.
* **Tablet (≥ 768px):**
  * *Navigation:* Chuyển sang Sidebar dọc bên trái (thu gọn thành icon).
  * *Layout:* Cấu trúc 2 cột. Ví dụ, trong "Explain Mode", màn hình có thể chia đôi: bên trái là nội dung đang phân tích, bên phải là Chatbot AI.
* **Desktop (≥ 1024px):**
  * *Navigation:* Sidebar mở rộng (chứa cả icon và text).
  * *Layout:* Sử dụng lưới (Grid) 12 cột. Tận dụng không gian rộng để hiển thị "Consequence Theater" toàn màn hình, bao gồm nhiều đồ thị phức tạp hơn.
  * *Extension/HUD mode:* Chế độ Protect trên Desktop chủ yếu là các Pop-up Overlay hoặc thanh cảnh báo dán trên trình duyệt, không chiếm toàn bộ màn hình.

### 3. Quy định về Typography & Hình ảnh
* **Fluid Typography:** Kích thước chữ tiêu đề (H1, H2) thu phóng tỉ lệ thuận với kích thước màn hình (sử dụng đơn vị `rem` hoặc `vw` có giới hạn).
* **Hình ảnh (Assets):** Các ảnh 3D mô phỏng kháng thể/mối đe dọa phải load các kích cỡ khác nhau (`srcset`) để tiết kiệm băng thông trên Mobile, nhưng hiển thị sắc nét trên màn hình Retina của Desktop.

### 4. Khả năng truy cập chạm (Touch Targets)
* Trên Mobile và Tablet, mọi vùng có thể tương tác (Nút, Icon, Links) phải có kích thước tối thiểu **44x44 pt/px** để dễ dàng chạm bằng ngón tay.
* Khoảng cách giữa các thành phần tương tác tối thiểu là **8px** để tránh chạm nhầm.

## Checklist
- [x] Quy định Breakpoints chuẩn.
- [x] Chiến lược Mobile-first và sự thay đổi Layout trên Tablet/Desktop.
- [x] Đảm bảo kích thước Touch Targets tối thiểu trên di động.

## Tài liệu liên quan
- `04_UX/WireframeSpecs.md`
- `05_UI/UISpecs.md`

## Việc cần làm tiếp
- Kiểm tra tính Responsive của các Component chính trong Figma (sử dụng Auto Layout).
- Thống nhất với Dev về việc sử dụng Grid System (ví dụ: Tailwind Grid).
