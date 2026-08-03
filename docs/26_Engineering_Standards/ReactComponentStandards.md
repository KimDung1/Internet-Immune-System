# React Component Standards

## Mục tiêu
Định nghĩa cấu trúc chuẩn, các mô hình thiết kế và thực hành tối ưu hiệu suất cho việc phát triển React Components (Next.js & Chrome Extension UI).

## Nội dung chính

### 1. Cấu trúc thư mục Component
Một Component phức tạp không nên nằm gộp trong một file. Sử dụng cấu trúc thư mục (Folder-based).
```
/ThreatCard
  index.ts           # Chứa public exports
  ThreatCard.tsx     # Logic hiển thị chính
  ThreatCard.css.ts  # Style/Tailwind wrapper (nếu có)
  ThreatCard.test.tsx# Unit tests
  hooks/             # Custom hooks chỉ dùng cho Component này
  types.ts           # Interfaces cục bộ
```

### 2. Tách biệt Logic và Giao diện (Presentation / Container Pattern)
- UI Components (Dumb components): Chỉ nhận `props` và render giao diện. Dễ test, dễ tái sử dụng.
- Logic Components (Smart components/Containers): Xử lý việc gọi API, quản lý State, và truyền dữ liệu xuống UI Components.
- Khuyến khích mạnh mẽ việc đóng gói logic phức tạp vào **Custom Hooks**.

```tsx
// Custom Hook đóng gói logic
const useThreatDetection = (url: string) => {
  const [risk, setRisk] = useState<RiskLevel>(null);
  // ... fetch data logic
  return { risk, isLoading };
};

// Component chỉ tập trung render
export const ThreatDisplay = ({ url }: { url: string }) => {
  const { risk, isLoading } = useThreatDetection(url);
  if (isLoading) return <Spinner />;
  return <RiskBadge level={risk} />;
};
```

### 3. Quản lý State (State Isolation)
- Hạn chế sử dụng Global State (Zustand/Redux) khi không cần thiết.
- Giữ State ở mức thấp nhất (Colocation) gần với nơi nó được sử dụng.
- Dùng React Context chủ yếu cho Theme, Auth, hoặc Settings toàn cục.
- Với Server State (data fetching), dùng **SWR** hoặc **React Query** (hoặc RSC data fetching trong Next.js App Router).

### 4. Tối ưu Hiệu suất (Performance Patterns)
- Không lạm dụng `useMemo` và `useCallback`. Chỉ sử dụng khi truyền functions/objects xuống Child Components được bọc bởi `React.memo`, hoặc khi quá trình tính toán thực sự tốn kém.
- Tránh Render không cần thiết: Cẩn thận với việc thay đổi cấu trúc mảng/object inline trong JSX (VD: `style={{ margin: 0 }}`).

### 5. Props Drilling và Children
- Tránh truyền props qua quá nhiều tầng (Prop Drilling).
- Sử dụng pattern `children` (Composition) để giảm sự phức tạp:
```tsx
// Ưu tiên Composition
<Card>
  <CardHeader title="Phishing Alert" />
  <CardContent>{content}</CardContent>
</Card>
```

## Checklist
- [ ] Component có được chia nhỏ thành UI và Logic không?
- [ ] Các logic lấy dữ liệu phức tạp có được tách vào Custom Hooks chưa?
- [ ] Kiểm tra việc quản lý state có bị lạm dụng global state không?
- [ ] Không có render-blocking từ các quá trình tính toán nặng chưa được tối ưu.

## Tài liệu liên quan
- [TypeScript Style Guide](TypeScriptStyleGuide.md)
- [Coding Conventions](CodingConventions.md)

## Việc cần làm tiếp
- Triển khai Storybook cho các thành phần UI dùng chung (`packages/ui`).
- Viết tài liệu hướng dẫn viết Unit Test cho React với Testing Library.
