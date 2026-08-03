# Data Migration & Seeding

## Mục tiêu
Định nghĩa chiến lược Migration (chuyển đổi cấu trúc Database) và quy trình Seeding (đổ dữ liệu mẫu ban đầu) cho Firestore, đặc biệt là việc mồi dữ liệu Threat Intelligence cho Internet Immune System.

## Nội dung chính

### 1. Chiến lược Migration
Firestore là cơ sở dữ liệu NoSQL không có lược đồ (schema-less), do đó không có khái niệm "ALTER TABLE".
- **Version Management:** Nếu một Document cần thay đổi cấu trúc, chúng ta sẽ thêm trường `schema_version` vào Document đó.
- **Lazy Migration (On-Read):** Khi Frontend hoặc Backend đọc một Document cũ (ví dụ version 1), ứng dụng sẽ tự động map dữ liệu sang cấu trúc version 2 và lưu lại ngầm.
- **Batch Migration:** Đối với những thay đổi phá vỡ (Breaking Changes), sẽ viết các script Node.js chạy một lần (One-off Scripts) để cập nhật hàng loạt Document.

### 2. Quy trình Seeding Dữ liệu

Khi hệ thống mới khởi chạy (Cold Start), AI sẽ không có đủ ngữ cảnh lừa đảo địa phương. Cần thực hiện Seeding:

#### Dữ liệu mồi: Threat Intelligence
- **Nguồn:** Thu thập từ các tổ chức an ninh mạng công cộng (chongluadao.vn, tín nhiệm mạng).
- **Phương pháp:** Viết một script Python `seed_threat_intel.py` đọc từ file CSV và đẩy hàng loạt vào Firestore Collection `threat_intelligence`.

```python
# Pseudo code
import firebase_admin
from firebase_admin import credentials, firestore
import csv

# Initialize
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

# Seed Data
def seed_data():
    with open('blacklist.csv', mode='r') as file:
        reader = csv.DictReader(file)
        batch = db.batch()
        count = 0
        for row in reader:
            doc_ref = db.collection('threat_intelligence').document()
            batch.set(doc_ref, {
                'entityType': row['type'],
                'entityValue': row['value'],
                'riskLevel': 'HIGH',
                'source': 'CHONGLUADAO_SEED',
            })
            count += 1
            if count % 500 == 0:
                batch.commit()
                batch = db.batch()
        batch.commit()
```

#### Dữ liệu mồi: User Training
- Đổ các câu hỏi trắc nghiệm (Quizzes) mẫu về lừa đảo thẻ tín dụng, giả danh công an vào collection `training_content` để Trainer Agent có sẵn tài liệu.

## Checklist
- [x] Lên kịch bản quản lý version tài liệu Firestore.
- [x] Viết quy trình Seeding Threat Intelligence.
- [x] Chuẩn bị nguồn dữ liệu để seed.

## Tài liệu liên quan
- [DatabaseSchema.md](./DatabaseSchema.md)

## Việc cần làm tiếp
- Viết file CSV chứa dữ liệu mồi (Mock data) khoảng 1000 domain lừa đảo phổ biến tại Việt Nam.
- Thực thi script seeding lên môi trường DEV.
