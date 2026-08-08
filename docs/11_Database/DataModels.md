# Data Models Definition

## Mục tiêu
Định nghĩa chi tiết các mô hình dữ liệu (Data Models/Interfaces) sử dụng trong mã nguồn Backend và Frontend (TypeScript/Dart) để tương tác với Firestore.

## Nội dung chính

### 1. User Model
```typescript
interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  trustScore: number;       // 0-100, ảnh hưởng bởi hành vi quét và học tập
  createdAt: Date;
  updatedAt: Date;
  preferences: {
    notificationsEnabled: boolean;
    language: 'vi' | 'en';
  };
}
```

### 2. ScanResult Model
Lưu trữ kết quả mỗi lần Hệ thống Miễn dịch phân tích dữ liệu.
```typescript
interface ScanResult {
  id: string;               // Firestore doc ID
  uid: string;              // User who requested
  inputPayload: {
    type: 'URL' | 'TEXT' | 'IMAGE';
    value: string;          // Nội dung bị quét
  };
  analysis: {
    riskScore: number;      // 0: An toàn, 100: Nguy hiểm tột độ
    riskLevel: 'SAFE' | 'WARNING' | 'CRITICAL';
    categories: string[];   // vd: ['Phishing', 'Fake_Bank']
    explanation: string;    // Lời giải thích từ LLM
  };
  simulationData?: {
    scenarioHtml?: string;  // HTML giả lập
    financialImpact?: string;
  };
  timestamp: Date;
}
```

### 3. FraudReport Model
Dữ liệu do người dùng chủ động báo cáo.
```typescript
interface FraudReport {
  id: string;
  reporterUid: string;
  targetInfo: string;       // SĐT, URL, hoặc TK Ngân hàng lừa đảo
  targetType: 'PHONE' | 'URL' | 'BANK';
  description: string;
  evidenceUrls: string[];   // Links tới Storage chứa ảnh chụp màn hình
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  createdAt: Date;
}
```

### 4. ThreatIntelligence Model
Cơ sở dữ liệu danh sách đen, được sử dụng để Agent tra cứu nhanh.
```typescript
interface ThreatIntelligence {
  entityId: string;         // Hash của value
  entityType: 'URL' | 'PHONE' | 'BANK_ACCOUNT' | 'IP';
  entityValue: string;      // Giá trị thực
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  indicators: string[];     // Dấu hiệu nhận biết
  sources: string[];        // Hệ thống nào đã báo cáo (System, NCSC)
  lastSeenAt: Date;
}
```

### 5. TrainingSession Model
```typescript
interface TrainingSession {
  id: string;
  uid: string;
  topic: string;            // 'Phishing Email', 'Social Engineering'
  score: number;            // Điểm bài test (0-10)
  completedAt: Date;
}
```

## Checklist
- [x] Định nghĩa TypeScript Interface cho User, Scan, Report, TI, Training.
- [x] Chú thích các trường quan trọng.

## Tài liệu liên quan
- [DatabaseSchema.md](./DatabaseSchema.md)

## Việc cần làm tiếp
- Xuất các Interface này thành thư viện dùng chung cho Frontend và Backend.
