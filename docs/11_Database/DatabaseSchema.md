# Database Schema (Firestore)

## Mục tiêu
Cung cấp thiết kế cơ sở dữ liệu tổng thể trên Google Cloud Firestore cho hệ thống Internet Immune System. Bao gồm Collections, Documents, Indexes, và Security Rules cơ bản.

## Nội dung chính

### 1. Tổng quan các Collections chính
Hệ thống sử dụng cấu trúc NoSQL phẳng, tránh lồng ghép (nesting) quá sâu để tối ưu chi phí đọc.
- `users`: Dữ liệu người dùng và Trust Score.
- `scan_results`: Lịch sử quét của người dùng.
- `fraud_reports`: Các báo cáo từ cộng đồng.
- `threat_intelligence`: Cơ sở dữ liệu danh sách đen (Blacklist).
- `training_sessions`: Lịch sử học tập của người dùng.

### 2. Sơ đồ dữ liệu mẫu

#### Collection: `users`
- Document ID: `uid` (Firebase Auth)
- Fields:
  - `email` (String)
  - `display_name` (String)
  - `trust_score` (Number: 0-100)
  - `created_at` (Timestamp)
  - `settings` (Map): `{ alerts_enabled: true, auto_block: false }`

#### Collection: `threat_intelligence`
- Document ID: Auto-generated hoặc Hash của giá trị
- Fields:
  - `entity_type` (String: "URL", "PHONE", "BANK_ACCOUNT")
  - `entity_value` (String: "lode88.com")
  - `risk_level` (String: "HIGH", "MEDIUM")
  - `source` (String: "SYSTEM", "COMMUNITY", "NCSC_VN")
  - `last_updated` (Timestamp)

#### Collection: `scan_results`
- Document ID: Auto-generated
- Fields:
  - `uid` (String - Ref to user)
  - `input_type` (String: "URL", "TEXT")
  - `input_value` (String)
  - `risk_score` (Number)
  - `analysis_summary` (String)
  - `timestamp` (Timestamp)

### 3. Indexes (Composite Indexes)
Cần thiết lập các Index sau trên Firebase Console:
- `scan_results`: `uid` (ASC) + `timestamp` (DESC) - Để hiển thị lịch sử quét của người dùng.
- `threat_intelligence`: `entity_type` (ASC) + `entity_value` (ASC) - Để Agent lookup siêu tốc.

### 4. Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /scan_results/{docId} {
      allow read: if request.auth != null && request.auth.uid == resource.data.uid;
      allow create: if request.auth != null; // Backend/Agent writes this mostly
    }
    match /threat_intelligence/{docId} {
      allow read: if true; // Public read for quick lookup
      allow write: if false; // Only Admin/Backend can write
    }
  }
}
```

## Checklist
- [x] Định nghĩa cấu trúc các Collection chính.
- [x] Liệt kê trường dữ liệu.
- [x] Khai báo Index và Security Rules.

## Tài liệu liên quan
- [DataModels.md](./DataModels.md)
- [DataRetention.md](./DataRetention.md)

## Việc cần làm tiếp
- Triển khai Security Rules lên Firebase project.
- Thiết lập tự động tạo Index thông qua Terraform.
