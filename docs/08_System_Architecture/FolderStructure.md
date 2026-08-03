# Folder / Repository Structure

## Mục tiêu
Đề xuất cấu trúc thư mục tiêu chuẩn cho codebase của dự án. Áp dụng kiến trúc Monorepo để dễ dàng quản lý code share giữa các frontend và backend.

## Nội dung chính

Sử dụng **Turborepo** hoặc **Nx** làm công cụ quản lý Monorepo.

```text
internet-immune-system/
├── apps/
│   ├── extension/          # Chrome/Edge Browser Extension (React/Vite/CRXJS)
│   │   ├── src/
│   │   │   ├── background/
│   │   │   ├── content/
│   │   │   └── popup/
│   │   └── manifest.json
│   ├── web/                # Next.js Web App (Dashboard, Landing Page)
│   │   ├── src/
│   │   │   ├── app/
│   │   │   └── components/
│   └── api/                # Express/Node.js Backend on Cloud Run
│       ├── src/
│       │   ├── controllers/
│       │   ├── services/
│       │   │   ├── gemini.service.ts
│       │   │   └── firebase.service.ts
│       │   └── routes/
├── packages/
│   ├── ui/                 # Shared UI components (React)
│   ├── config/             # Shared ESLint, TSConfig
│   └── core/               # Shared interfaces, types, schemas (Zod)
├── docs/                   # Dự án Project Bible
├── .github/                # CI/CD workflows
├── package.json
└── turbo.json
```

## Checklist
- [x] Thiết kế cấu trúc Monorepo
- [x] Phân chia các module hợp lý (apps, packages)
- [ ] Cài đặt CI/CD pipeline cho monorepo

## Tài liệu liên quan
- [Component Diagram](ComponentDiagram.md)

## Việc cần làm tiếp
- Khởi tạo repo với cấu trúc đã đề xuất sử dụng pnpm workspaces và Turborepo.
