# Component Guide

## Mục tiêu
Định nghĩa các tiêu chuẩn, pattern thiết kế và quy ước đặt tên cho React Components trong hệ thống Internet Immune System, đảm bảo mã nguồn dễ bảo trì, tái sử dụng và mở rộng.

## Nội dung chính
### 1. Quy ước đặt tên
- **Thư mục Component**: PascalCase (VD: `Button/`, `UserProfile/`)
- **Tên File Component**: PascalCase (VD: `Button.tsx`, `UserProfile.tsx`)
- **Tên Component (Function)**: PascalCase (VD: `export const Button = () => {}`)
- **Tên File CSS/Module**: Kebab-case hoặc CamelCase tùy dự án (Khuyến nghị dùng Tailwind, không cần CSS rời).

### 2. Phân loại Component
- **UI Components (`src/components/ui`)**: Các component cơ bản, dumb components không chứa logic nghiệp vụ (Button, Input, Modal, Card). Xây dựng dựa trên Shadcn UI.
- **Feature Components (`src/components/features`)**: Smart components gắn liền với logic nghiệp vụ cụ thể (ThreatChart, AIExplanationBox, PhishingAlert).
- **Layout Components (`src/components/layout`)**: Header, Footer, Sidebar.

### 3. React Component Patterns
- **Composition**: Thay vì truyền quá nhiều props, hãy sử dụng `children` và composition để chia nhỏ UI.
- **Server vs Client Components**: 
  - Mặc định sử dụng Server Components.
  - Chỉ thêm `'use client'` khi component cần tương tác (onClick, hooks như useState, useEffect) hoặc sử dụng Web APIs.

### 4. Component Structure Template
```tsx
import React from 'react';
import { cn } from '@/lib/utils'; // Cho Tailwind classes

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  isLoading?: boolean;
}

export const ActionButton: React.FC<ActionButtonProps> = ({ 
  children, 
  variant = 'primary',
  isLoading,
  className,
  ...props 
}) => {
  return (
    <button 
      className={cn("base-classes", variant === 'primary' ? 'bg-blue-500' : 'bg-gray-200', className)}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? 'Processing...' : children}
    </button>
  );
};
```

## Checklist
- [ ] Hoàn thành tài liệu hướng dẫn viết component
- [ ] Tạo thư viện UI Components cơ bản bằng Shadcn UI
- [ ] Áp dụng linter để bắt buộc quy tắc đặt tên

## Tài liệu liên quan
- [Frontend Architecture](./FrontendArchitecture.md)

## Việc cần làm tiếp
- Triển khai Storybook để tài liệu hóa trực quan các UI components.
- Review các component hiện tại xem có tuân thủ cấu trúc không.
