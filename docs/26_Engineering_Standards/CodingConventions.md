# Coding Conventions

## Mục tiêu
Thiết lập bộ quy chuẩn viết code thống nhất cho toàn bộ dự án Internet Immune System. Tài liệu này bao gồm các hướng dẫn cấp cao áp dụng chéo cho hệ sinh thái công nghệ (TypeScript, Next.js, Chrome Extension MV3, Node.js), giúp mã nguồn dễ đọc, dễ bảo trì và dễ mở rộng khi dự án tăng trưởng.

## Nội dung chính

### 1. Nguyên tắc chung (General Principles)
- **Tính thống nhất (Consistency)**: Thống nhất quan trọng hơn sở thích cá nhân. Một codebase tốt trông như do một người viết.
- **Nguyên lý SOLID & DRY**: Tránh lặp code vô nghĩa, chia nhỏ module theo Single Responsibility.
- **Tính dễ đọc (Readability)**: Code phải giải thích được "TẠI SAO", tài liệu mô tả "CÁI GÌ".

### 2. Cấu trúc dự án (Monorepo)
Dự án sử dụng Monorepo (pnpm workspaces):
```
/apps
  /web          # Next.js Dashboard
  /extension    # Chrome Extension MV3 (React + Background Service Workers)
  /api          # Node.js/Express hoặc Cloud Functions backend
/packages
  /ui           # Shared UI components (Radix + Tailwind)
  /core         # Core logic, Gemini AI integration, Fraud detection algorithms
  /config       # ESLint, Prettier, TSConfig chia sẻ
```

### 3. Công nghệ Frontend (Next.js & Chrome Extension MV3)
- Sử dụng **React 18+** với Functional Components và Hooks. Không dùng Class Components.
- **Next.js**: 
  - Ưu tiên App Router (`app/` directory).
  - Sử dụng Server Components cho việc fetch dữ liệu an toàn và giảm bundle size.
  - Client Components chỉ dùng khi cần tương tác (state, effects).
- **Chrome Extension MV3**:
  - Tuân thủ chặt chẽ vòng đời của Service Workers (không giữ trạng thái trong bộ nhớ toàn cục).
  - Giao tiếp giữa Content Scripts và Background bằng cơ chế Messaging chuẩn có định kiểu.
- **Styling**: TailwindCSS. Tuân thủ Design Tokens được định nghĩa trong `tailwind.config.js`.

### 4. Công nghệ Backend (Node.js/Cloud Run)
- Framework: Fastify hoặc Express (định hình theo kiến trúc Microservices/Serverless).
- Tách biệt rõ ràng các tầng: Controller (xử lý HTTP), Service (logic nghiệp vụ), và Repository (truy xuất DB/Firebase).
- Quản lý lỗi (Error Handling): Bắt mọi ngoại lệ và ném ra Custom Error Classes có HTTP Status Code tương ứng.

### 5. Formatting & Linting
- **Prettier**: Công cụ định dạng code duy nhất. Độ dài dòng tối đa: 100. Tab width: 2. (Cấu hình chung ở `.prettierrc`).
- **ESLint**: Sử dụng bộ quy tắc nghiêm ngặt, bao gồm `eslint-plugin-react-hooks`, `eslint-plugin-jsx-a11y`.
- Mọi commit đều bị chặn bởi Husky pre-commit hook nếu không pass Lint & Format.

## Checklist
- [ ] Hiểu rõ cấu trúc thư mục của Monorepo.
- [ ] Trình soạn thảo (VSCode) đã tích hợp ESLint và Prettier tự động chạy khi lưu file.
- [ ] Áp dụng đúng ranh giới Client/Server Components trong Next.js.
- [ ] Logic Extension nằm trong Service Workers tuân thủ chuẩn MV3.

## Tài liệu liên quan
- [TypeScript Style Guide](TypeScriptStyleGuide.md)
- [React Component Standards](ReactComponentStandards.md)
- [Naming Conventions](NamingConventions.md)

## Việc cần làm tiếp
- Triển khai cấu hình chia sẻ `@iis/eslint-config` vào thư mục `packages/config`.
- Viết tài liệu hướng dẫn gỡ lỗi (Debugging Guide) riêng cho Chrome Extension.
