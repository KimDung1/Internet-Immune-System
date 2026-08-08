# Naming Conventions

## Mục tiêu
Quy định cách đặt tên nhất quán cho tất cả các khía cạnh của dự án Internet Immune System (File, Biến, Hàm, Database Keys, API Routes), giúp codebase trở nên trực quan, dự đoán được, và dễ tìm kiếm.

## Nội dung chính

### 1. Tên File và Thư mục (Files & Directories)
- **Kebab-case**: Cho thư mục và file thông thường, file cấu hình, scripts. (VD: `utils-format.ts`, `data-processing/`).
- **PascalCase**: Cho các file export React Components, Interfaces/Types chính. (VD: `ThreatCard.tsx`, `UserModels.ts`).
- **Next.js App Router**: Tuân thủ chuẩn Next.js (`page.tsx`, `layout.tsx`, `api/route.ts`). Thư mục chứa route dùng `kebab-case` (VD: `app/dashboard/threat-reports/page.tsx`).

### 2. Biến và Hàm (Variables & Functions)
- **camelCase**: Biến cục bộ, tên hàm, instance.
- Tên hàm phải bắt đầu bằng động từ hành động.
  - CRUD: `createX`, `getX`, `updateX`, `deleteX`.
  - Boolean: Bắt đầu bằng `is`, `has`, `should`, `can` (VD: `isVerified`, `hasPermission`).
  - Event Handlers: Bắt đầu bằng `handle` hoặc tiền tố `on` ở props (VD: `handleSubmit`, `onClick`).
- **UPPER_SNAKE_CASE**: Hằng số (Constants), Biến môi trường. (VD: `MAX_RETRY_COUNT`, `NEXT_PUBLIC_API_URL`).

### 3. Types và Interfaces
- **PascalCase**: Interface, Type, Class, Enum.
- **Không** sử dụng tiền tố `I` cho Interface (VD: Dùng `User`, không dùng `IUser`).
- **Không** dùng hậu tố `Type` trừ khi bắt buộc để tránh trùng lặp.

### 4. API Routes và Giao thức
- **RESTful URLs**: Bắt buộc sử dụng `kebab-case`, danh từ số nhiều cho collections.
  - Tốt: `GET /api/v1/threat-reports`, `POST /api/v1/users/{id}/scan-history`
  - Xấu: `/api/getReports`, `/api/User/Scan`
- **Tên tham số (Query Params)**: Sử dụng `snake_case` (VD: `?page_size=20&sort_by=created_at`).

### 5. Cơ sở dữ liệu (Firestore / Database Keys)
- **Tên Collections**: Dùng `camelCase` hoặc `snake_case` nhưng phải NHẤT QUÁN. Khuyến nghị: `camelCase` số nhiều (VD: `threatReports`, `userProfiles`).
- **Tên Field**: `camelCase`. (VD: `createdAt`, `threatScore`).

### 6. CSS / Tailwind Tokens
- Tuân theo chuẩn Tailwind (`kebab-case`).
- Các lớp CSS tùy chỉnh nên có không gian tên dự án, ví dụ tiền tố `iis-` (VD: `.iis-glass-panel`).

## Checklist
- [ ] Tên file component dùng PascalCase.
- [ ] Tên hàm bắt đầu bằng động từ, rõ nghĩa.
- [ ] Tên API endpoint dạng danh từ số nhiều, kebab-case.
- [ ] Không có các tên biến vô nghĩa như `data1`, `temp`, `res`.

## Tài liệu liên quan
- [Coding Conventions](CodingConventions.md)
- [TypeScript Style Guide](TypeScriptStyleGuide.md)

## Việc cần làm tiếp
- Bổ sung cấu hình linter cảnh báo việc đặt tên sai chuẩn (VD: dùng `eslint-plugin-unicorn` cho file naming convention).
