# Authentication Flow

## Mục tiêu
Mô tả quy trình xác thực và phân quyền người dùng trong Internet Immune System, sử dụng Firebase Authentication để đảm bảo an toàn, dễ tích hợp và hỗ trợ đa nền tảng (Web, Extension).

## Nội dung chính
### 1. Giải pháp xác thực
Sử dụng **Firebase Authentication**. Hỗ trợ các phương thức:
- Đăng nhập bằng Email/Password.
- OAuth (Google Sign-In) - Khuyến nghị cho trải nghiệm liền mạch.

### 2. Luồng xác thực (Authentication Flow)
1. **Client (Web/Extension)**: Người dùng thực hiện đăng nhập qua Firebase SDK.
2. **Firebase**: Trả về một `ID Token` (JWT) ngắn hạn (sống 1 giờ) và `Refresh Token`.
3. **Client**: Đính kèm `ID Token` này vào header `Authorization: Bearer <ID_Token>` trong mọi request gọi lên API nội bộ (Cloud Run).
4. **Backend (API Gateway / Cloud Run)**: 
   - Sử dụng Firebase Admin SDK để verify `ID Token`.
   - Lấy `uid` từ token đã verify.
   - Kiểm tra `uid` trong cơ sở dữ liệu (Firestore / Cloud SQL).
   - Nếu user hợp lệ, tiếp tục xử lý request. Nếu token hết hạn, trả về `401 Unauthorized`.
5. **Client**: Nếu nhận `401`, SDK Firebase sẽ tự động dùng `Refresh Token` lấy `ID Token` mới và retry lại request.

### 3. Session Management trên Extension
- Trình duyệt đóng, Service Worker có thể ngủ.
- Extension lưu trữ trạng thái đăng nhập Firebase trong `chrome.storage.local`.
- Tận dụng cơ chế đồng bộ của trình duyệt Chrome nếu người dùng đã log in vào Google Account để tự động authenticate extension (Sử dụng `chrome.identity.getAuthToken`).

### 4. Phân quyền (Authorization)
Hệ thống áp dụng Role-Based Access Control (RBAC):
- `USER`: Quyền cơ bản, chỉ truy cập lịch sử scan của mình.
- `ENTERPRISE_ADMIN`: Xem thống kê của các thành viên trong tổ chức.
- `SYS_ADMIN`: Truy cập dashboard quản trị tổng thể.
- *Role được lưu dưới dạng Custom Claims trong Firebase Auth Token để backend verify không cần query DB.*

## Checklist
- [ ] Cấu hình Firebase Project.
- [ ] Kích hoạt Google Auth Provider trong Firebase Console.
- [ ] Thiết lập Middleware ở Backend verify Firebase Token.
- [ ] Tích hợp tính năng set Custom Claims cho Admin.

## Tài liệu liên quan
- [Security Architecture](../15_Security/SecurityArchitecture.md)

## Việc cần làm tiếp
- Thử nghiệm đăng nhập Single Sign-On (SSO) giữa Web App và Extension.
- Viết kịch bản xử lý khi user thu hồi quyền truy cập (Revoke Access).
