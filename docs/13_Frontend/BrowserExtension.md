# Browser Extension Architecture

## Mục tiêu
Tài liệu hóa cấu trúc và phương thức hoạt động của Chrome Extension - thành phần quan trọng của "Internet Immune System" để theo dõi và bảo vệ người dùng trên trình duyệt theo thời gian thực.

## Nội dung chính
### 1. Kiến trúc Manifest V3
Extension sử dụng Manifest V3 (tiêu chuẩn mới nhất của Google Chrome) đảm bảo bảo mật và hiệu năng.
- **Manifest.json**: Khai báo quyền hạn (permissions: `activeTab`, `storage`, `scripting`, `webRequest` hoặc `declarativeNetRequest`).
- **Background Service Worker (`background.js`)**:
  - Chạy ngầm, không có DOM.
  - Lắng nghe các sự kiện điều hướng (navigation), thay đổi tab.
  - Chịu trách nhiệm gọi API lên Backend để phân tích URL bằng Gemini AI.
- **Content Scripts (`content.js`)**:
  - Tiêm vào các trang web người dùng truy cập.
  - Có quyền truy cập DOM của trang: dùng để highlight các đường link nguy hiểm, chèn cảnh báo AI trực tiếp lên trang (overlay).
- **Popup UI (`popup.html` / React)**:
  - Hiển thị tóm tắt tình trạng trang hiện tại, điểm an toàn, cho phép người dùng bật/tắt các tính năng.

### 2. Luồng bảo vệ thời gian thực (Real-time Protection)
1. User click vào một URL hoặc trang tải một trang mới.
2. Background script bắt sự kiện `chrome.webNavigation.onCommitted`.
3. Background script kiểm tra cache cục bộ (chrome.storage). Nếu chưa có, gửi URL (ẩn danh/mã hóa) lên Cloud Run API.
4. API trả về kết quả (Safe/Phishing/Malware) + Giải thích từ Gemini.
5. Nếu nguy hiểm, Background gửi message tới Content Script.
6. Content Script render một "Red Warning Overlay" chặn người dùng thao tác, hiển thị AI Explanation.

### 3. Giao tiếp giữa các thành phần
- Sử dụng `chrome.runtime.sendMessage` và `chrome.runtime.onMessage.addListener`.
- Dữ liệu giữa web app và extension có thể được đồng bộ thông qua `chrome.storage.sync` hoặc nhận diện qua token đăng nhập chung.

## Checklist
- [ ] Tạo khung dự án Extension với React/Vite.
- [ ] Khai báo `manifest.json` chuẩn V3.
- [ ] Cấp quyền (Permissions) tối thiểu nhất có thể (Nguyên tắc Privilege Minimization).
- [ ] Xây dựng Background Worker giao tiếp thành công với API.

## Tài liệu liên quan
- [API Reference](../14_API/APIReference.md)
- [Data Privacy](../15_Security/DataPrivacy.md)

## Việc cần làm tiếp
- Phát triển UI cho Popup.
- Test khả năng tiêm Content Script vào các trang web phức tạp (SPA).
- Tối ưu hóa kích thước extension để publish lên Chrome Web Store.
