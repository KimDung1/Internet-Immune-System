# Kiến trúc Thông tin (Information Architecture)

## Mục tiêu
Xây dựng cấu trúc tổ chức nội dung, phân cấp thông tin và sơ đồ điều hướng cho Internet Immune System. Đảm bảo người dùng dễ dàng chuyển đổi giữa 5 chế độ AI cốt lõi một cách logic và trực quan.

## Nội dung chính

### 1. Sơ đồ trang (Site Map)
Hệ thống được tổ chức xoay quanh một Dashboard trung tâm và 5 trụ cột (5 AI Modes):

* **Dashboard (Trung tâm Chỉ huy):**
  * Chỉ số "Sức đề kháng" hiện tại (Immunity Score).
  * Lịch sử các mối đe dọa đã bị chặn.
  * Thông báo nhanh.
* **1. Chế độ Detect (Scanner):**
  * Quét URL/Email/Tin nhắn.
  * Phân tích tệp đính kèm.
* **2. Chế độ Simulate (Consequence Theater):**
  * Lựa chọn kịch bản mô phỏng.
  * Cây quyết định và hậu quả tài chính/dữ liệu.
* **3. Chế độ Explain (AI Narrator):**
  * Phân tích kỹ thuật (cho người dùng nâng cao).
  * Giải thích bằng ngôn ngữ đời thường (cho người dùng cơ bản).
* **4. Chế độ Train (Gamified Drills):**
  * Các bài kiểm tra nhanh (Phishing quiz).
  * Bảng xếp hạng, cấp độ (Levels).
* **5. Chế độ Protect (Shield HUD):**
  * Cài đặt lá chắn thời gian thực (Browser Extension / App Overlay).
  * Whitelist/Blacklist tùy chỉnh.
  * Chế độ Lockdown khẩn cấp.

### 2. Cấu trúc Điều hướng (Navigation Structure)
* **Global Navigation:** Sử dụng Floating Action Bar (hoặc Bottom Navigation trên Mobile) chứa các icon đại diện cho 5 chế độ.
* **Contextual Navigation:** Khi đang ở chế độ Detect và phát hiện nguy cơ, hệ thống hiển thị nút chuyển tiếp nhanh sang chế độ Simulate để xem hậu quả, hoặc Explain để hiểu lý do.

### 3. Phân cấp Nội dung (Content Hierarchy)
* **Tầng 1 (Primary):** Tình trạng an toàn hiện tại (Safe / Warning / Danger).
* **Tầng 2 (Secondary):** Hành động người dùng cần thực hiện ngay lập tức (Cancel / Block / Investigate).
* **Tầng 3 (Tertiary):** Chi tiết phân tích, dữ liệu kỹ thuật từ Gemini AI, lịch sử bảo vệ.

## Checklist
- [x] Vẽ Site map phân bổ 5 chế độ AI.
- [x] Thiết lập Global và Contextual Navigation.
- [x] Quy định Content Hierarchy.

## Tài liệu liên quan
- `04_UX/UserFlows.md`
- `04_UX/WireframeSpecs.md`

## Việc cần làm tiếp
- Chuyển sơ đồ Site Map thành bản vẽ dạng đồ họa (Flowchart).
- Tiến hành Card Sorting session với người dùng để kiểm chứng cấu trúc.
