# TypeScript Style Guide

## Mục tiêu
Cung cấp các quy tắc khắt khe nhất dành cho việc viết mã TypeScript trong dự án Internet Immune System, tối đa hóa Type Safety và ngăn chặn các lỗi runtime.

## Nội dung chính

### 1. Quy tắc "Không any" (No Explicit Any)
- **Tuyệt đối không dùng `any`**. Bất kỳ PR nào chứa `any` sẽ bị từ chối tự động.
- Nếu không biết kiểu dữ liệu tại thời điểm viết, sử dụng `unknown` và thực hiện Type Narrowing hoặc Type Guards trước khi thao tác.

```typescript
// Sai
function processPayload(payload: any) {
  console.log(payload.id);
}

// Đúng
function processPayload(payload: unknown) {
  if (typeof payload === 'object' && payload !== null && 'id' in payload) {
    console.log(payload.id);
  }
}
```

### 2. Interface vs. Type
- Dùng `interface` cho định nghĩa đối tượng/cấu trúc dữ liệu có thể được mở rộng (extends/implements) - chủ yếu là Data Models, API Responses.
- Dùng `type` cho Unions, Intersections, Mapped Types, Tuples, hoặc các kiểu nguyên thủy.

```typescript
// Dùng Interface
interface User {
  id: string;
  email: string;
}

// Dùng Type
type ThreatLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
type AsyncState<T> = { data: T | null; error: Error | null; isLoading: boolean };
```

### 3. Nullability và Optional
- Ưu tiên dùng Optional Chaining (`?.`) và Nullish Coalescing (`??`) thay vì kiểm tra falsy thông thường, để tránh các lỗi liên quan đến số `0` hoặc chuỗi rỗng `""`.

### 4. Bắt lỗi chặt chẽ (Strict Mode)
File `tsconfig.json` luôn phải bật cờ `"strict": true`.
- Không cho phép unused variables (`noUnusedLocals`, `noUnusedParameters`).
- Kích hoạt `strictNullChecks`.

### 5. Type Inference
- Để TypeScript tự suy luận kiểu cho các biến cục bộ đơn giản để tránh dài dòng.
- NHƯNG **bắt buộc** định nghĩa kiểu trả về rõ ràng cho toàn bộ functions và methods.

```typescript
// Sai
const getUser = async (id: string) => { /* ... */ };

// Đúng
const getUser = async (id: string): Promise<User | null> => { /* ... */ };
```

## Checklist
- [ ] Không có từ khóa `any` nào trong codebase.
- [ ] Tất cả hàm export đều có kiểu dữ liệu trả về rõ ràng.
- [ ] Phân biệt đúng việc sử dụng `interface` và `type`.
- [ ] Cấu hình `tsconfig.json` tuân thủ strict mode.

## Tài liệu liên quan
- [Coding Conventions](CodingConventions.md)
- [Naming Conventions](NamingConventions.md)

## Việc cần làm tiếp
- Tích hợp Zod cho việc validate dữ liệu tại runtime (API Boundaries, Chrome Message Passing) và tự động trích xuất Type từ Zod schemas.
