# Thư viện Tương tác Vi mô (Microinteraction Library)

## Mục tiêu
Cung cấp danh mục các tương tác nhỏ gọn (micro-interactions) nhằm nâng cao cảm giác phản hồi của hệ thống. Những chi tiết nhỏ này làm cho Internet Immune System trở nên "sống động", tinh tế, giảm bớt sự lo âu và củng cố niềm tin cho người dùng.

## Nội dung chính

### 1. Trạng thái Hover & Nút bấm
* **Nút Primary (Scan/Protect):**
  * *Tương tác:* Khi chuột lướt qua (Hover), một hiệu ứng bóng đổ (Glow) màu Cyber Blue lan ra ngoài 4px.
  * *Click:* Nút lún xuống (Scale 0.98) trong 100ms.
* **Nút Danger (Block/Delete):**
  * *Hover:* Nền chuyển đỏ gắt hơn, icon khiên bên trong nứt nhẹ.
* **Text Links:**
  * *Hover:* Dòng gạch chân (Underline) trượt từ trái sang phải, không hiện ngay lập tức.

### 2. Trạng thái Tải dữ liệu (Loading / Processing)
* **Input URL / Quét file:**
  * Thay vì vòng xoay (Spinner) cơ bản, sử dụng hiệu ứng **"Mã quét" (Matrix Scan)**: Một đường kẻ sáng lướt từ trên xuống dưới icon file/text.
* **Giao tiếp Gemini API:**
  * Hiển thị ba chấm "..." lượn sóng (Wave), hoặc icon AI Core xoay chậm kèm hiệu ứng chớp tắt nhịp điệu (Breathing effect).

### 3. Trạng thái Thành công / Thất bại (Success & Error States)
* **Thành công (Tiêu diệt mối đe dọa / Đạt bài Train):**
  * *Tương tác:* Icon Tick xanh hoặc Khiên bung ra (Pop-up burst) bằng một đám hạt nhỏ (Confetti particles dạng số 0, 1). Điện thoại rung nhẹ (Haptic: Success).
* **Thất bại (Phát hiện lừa đảo):**
  * *Tương tác:* Input field viền đỏ, rung lắc ngang (Shake) 3 lần. Thông báo xuất hiện với viền mờ màu đỏ gắt. Điện thoại rung mạnh (Haptic: Error).

### 4. Tương tác Chế độ Mô phỏng (Simulate - Consequence Theater)
* **Mở rộng kịch bản (Expand Node):**
  * Khi bấm vào một bước trong kịch bản (vd: "Kẻ gian rút tiền"), chi tiết lộ ra bằng cách đẩy các phần tử khác xuống dưới một cách mượt mà (Accordion slide down), kèm âm thanh digital click nhỏ (nếu có bật âm thanh).
* **Chuyển đổi số liệu tài chính:**
  * Nếu mô phỏng việc mất tiền, con số không hiện ngay mà chạy bộ đếm (Number counter) lăn từ 0 lên số tiền bị mất (ví dụ 50,000,000) một cách nhanh chóng để tăng tính kịch tính.

### 5. Skeleton Loaders (Khung xương tải trang)
* Dùng cho Dashboard khi load dữ liệu lịch sử.
* Skeleton không dùng màu xám tĩnh, mà sử dụng luồng sáng quét ngang (Shimmer) trên nền màu `Surface Dark` với màu ánh sáng `Cyber Blue` mờ để giữ vibe công nghệ.

## Checklist
- [x] Liệt kê micro-interactions cho Buttons và Links.
- [x] Quy định hiệu ứng Loading và Success/Error đặc thù AI.
- [x] Đặc tả tương tác đếm số và mở rộng trong Simulate mode.

## Tài liệu liên quan
- `04_UX/PrototypeSpecs.md`
- `05_UI/MotionDesign.md`

## Việc cần làm tiếp
- Dev sử dụng các thư viện như Framer Motion (React) hoặc CSS Animations để hiện thực hóa thư viện này.
- Thử nghiệm cường độ rung (Haptics) trên môi trường thiết bị thực (iOS/Android).
