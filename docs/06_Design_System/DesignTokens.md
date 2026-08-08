# Design Tokens

## Mục tiêu
Tài liệu này định nghĩa các biến số thiết kế (design tokens) cốt lõi của Internet Immune System, tạo nền tảng cho sự nhất quán trên toàn bộ giao diện (UI) và trải nghiệm người dùng (UX). Design tokens giúp chuyển đổi các giá trị thiết kế tĩnh thành các biến số có thể tái sử dụng trong code.

## Nội dung chính

### 1. Color Tokens (Màu sắc)
Dựa trên nền tảng giao diện tối (Dark Mode) kết hợp ánh sáng kỹ thuật số (Teal/Cyan pulse).

*   **Nền (Background & Surface)**
    *   `--color-bg-base`: `#0B1120` (Deep Space Navy - Nền chính)
    *   `--color-surface-100`: `#111827` (Card nền thấp)
    *   `--color-surface-200`: `#1F2937` (Card nổi, Hover)
    *   `--color-surface-300`: `#374151` (Border, Divider)
*   **Chủ đạo (Primary - Immune Pulse)**
    *   `--color-primary-base`: `#06B6D4` (Cyan - Digital Pulse)
    *   `--color-primary-hover`: `#0891B2`
    *   `--color-primary-glow`: `rgba(6, 182, 212, 0.3)`
*   **Cảnh báo & Đe dọa (Semantic)**
    *   `--color-danger-base`: `#EF4444` (Red - Virus/Threat)
    *   `--color-warning-base`: `#F59E0B` (Amber - Suspicious)
    *   `--color-success-base`: `#10B981` (Emerald - Safe/Clean)

### 2. Typography Tokens (Kích thước chữ)
Sử dụng thang đo tỷ lệ để đảm bảo sự phân cấp rõ ràng. Base size: 16px.

*   `--text-xs`: `0.75rem` (12px)
*   `--text-sm`: `0.875rem` (14px)
*   `--text-base`: `1rem` (16px)
*   `--text-lg`: `1.125rem` (18px)
*   `--text-xl`: `1.25rem` (20px)
*   `--text-2xl`: `1.5rem` (24px)
*   `--text-3xl`: `1.875rem` (30px)
*   `--text-4xl`: `2.25rem` (36px)

### 3. Spacing Tokens (Khoảng cách)
Hệ thống Grid 8pt (8-point grid system).

*   `--space-1`: `0.25rem` (4px)
*   `--space-2`: `0.5rem` (8px)
*   `--space-3`: `0.75rem` (12px)
*   `--space-4`: `1rem` (16px)
*   `--space-6`: `1.5rem` (24px)
*   `--space-8`: `2rem` (32px)
*   `--space-12`: `3rem` (48px)
*   `--space-16`: `4rem` (64px)

### 4. Border Radius Tokens (Bo góc)
Phong cách "Clinical nhưng approachable" (Công nghệ nhưng vẫn thân thiện).

*   `--radius-sm`: `0.25rem` (4px) - Dành cho Checkbox, Tag nhỏ
*   `--radius-md`: `0.5rem` (8px) - Dành cho Button, Input
*   `--radius-lg`: `1rem` (16px) - Dành cho Card, Modal
*   `--radius-full`: `9999px` - Dành cho Avatar, Badge tròn

### 5. Shadow & Glow Tokens (Đổ bóng & Ánh sáng)
Do giao diện tối, shadow truyền thống ít hiệu quả. Thay vào đó sử dụng Inner Glow và Drop Shadow phát sáng.

*   `--glow-primary`: `0 0 12px rgba(6, 182, 212, 0.4)`
*   `--glow-danger`: `0 0 12px rgba(239, 68, 68, 0.4)`
*   `--shadow-surface`: `0 4px 6px -1px rgba(0, 0, 0, 0.5)`

### 6. Z-Index Scale (Phân lớp không gian)
*   `--z-hide`: `-1`
*   `--z-base`: `0`
*   `--z-elevated`: `10` (Dropdowns)
*   `--z-sticky`: `20` (Headers)
*   `--z-overlay`: `30` (Modal Backdrops)
*   `--z-modal`: `40` (Modals, Popovers)
*   `--z-toast`: `50` (Notifications, Alerts)

## Checklist
- [x] Định nghĩa màu nền và bề mặt
- [x] Thiết lập màu semantic (Danger, Warning, Success)
- [x] Thiết lập Spacing scale 8pt
- [x] Áp dụng Z-Index cho các thành phần bay (floating)

## Tài liệu liên quan
- [Color System](ColorSystem.md)
- [Typography System](TypographySystem.md)

## Việc cần làm tiếp
- Chuyển đổi file này thành định dạng JSON/CSS Variables để developer import thẳng vào dự án (Ví dụ: Tailwind config).
