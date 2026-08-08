# State Management

## Mục tiêu
Quy định cách quản lý state (trạng thái) trong ứng dụng Frontend của Internet Immune System. Đảm bảo luồng dữ liệu (data flow) rõ ràng, hiệu năng cao và dễ dàng debug.

## Nội dung chính
### 1. Phân loại State
- **Local State**: State chỉ sử dụng trong một component (Toggle modal, form input). Sử dụng `useState`, `useReducer`.
- **Global UI State**: State chia sẻ giữa nhiều components không liên quan nhưng không phải dữ liệu từ server (Theme, Sidebar open/close). Sử dụng `Zustand` hoặc `React Context`.
- **Server State**: Dữ liệu fetch từ API (Lịch sử scan, thông báo mối đe dọa, cấu hình user). Sử dụng `React Query` (TanStack Query) để caching, refetching, và synchronizing.
- **Auth State**: Trạng thái đăng nhập của người dùng. Sử dụng Firebase Auth SDK kết hợp với React Context để expose ra toàn app.

### 2. Zustand Store (Global UI State)
Zustand được chọn vì nhẹ, không cần boilerplate nhiều như Redux và re-render tối ưu.
```typescript
import { create } from 'zustand'

interface AppState {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  activeAnalysisId: string | null;
  setActiveAnalysis: (id: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isSidebarOpen: false,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  activeAnalysisId: null,
  setActiveAnalysis: (id) => set({ activeAnalysisId: id }),
}))
```

### 3. TanStack Query (Server State)
- Đảm bảo data luôn fresh.
- Xử lý Loading, Error states một cách tự nhiên.
- Chiến lược Cache: Invalid cache khi nhận được Webhook báo kết quả scan mới.

### 4. Data Flow cho Cảnh báo AI
1. Extension gửi URL lên API (thông qua Backend).
2. Backend gọi Gemini, xử lý và lưu kết quả.
3. Backend bắn Firebase Cloud Messaging / Webhook về Frontend.
4. TanStack Query invalidate cache.
5. UI cập nhật kết quả "Độc hại" thời gian thực.

## Checklist
- [ ] Cài đặt Zustand
- [ ] Cài đặt TanStack Query và thiết lập QueryClientProvider
- [ ] Xây dựng AuthContext để wrap Firebase Auth

## Tài liệu liên quan
- [Frontend Architecture](./FrontendArchitecture.md)
- [Auth Flow](../14_API/AuthFlow.md)

## Việc cần làm tiếp
- Xây dựng store cho các module: Threat Intelligence, User Settings.
- Viết hooks dùng chung cho việc fetch dữ liệu Dashboard.
