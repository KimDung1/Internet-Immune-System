# Google Cloud Run Configuration

## Mục tiêu
Cấu hình chi tiết, chiến lược container hóa và policy scaling cho dịch vụ API chạy trên Google Cloud Run.

## Nội dung chính

### 1. Containerization Strategy
Ứng dụng API sẽ được đóng gói bằng Docker. Sử dụng Multi-stage build để giảm kích thước image.
```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 8080
CMD ["node", "dist/index.js"]
```

### 2. Cấu hình Cloud Run (Service Config)
- **Region**: `asia-southeast1` (Singapore) để có độ trễ thấp nhất về Việt Nam.
- **Memory**: 1GiB (có thể scale lên nếu xử lý payload HTML lớn).
- **CPU**: 1 vCPU (Sử dụng CPU allocation "CPU is only allocated during request processing").
- **Concurrency**: 80 (Số request đồng thời mà một container có thể xử lý).

### 3. Scaling Policies
- **Min instances**: `1` (Để tránh cold start delay cho các request đầu tiên, giữ hệ thống "Immune" luôn sẵn sàng).
- **Max instances**: `100` (Giới hạn chi phí, chống DDoS làm tốn tài nguyên).

### 4. Môi trường (Environment Variables)
Quản lý qua Google Cloud Secret Manager, mount vào Cloud Run dưới dạng Env Vars.
- `GEMINI_API_KEY`
- `FIREBASE_SERVICE_ACCOUNT`

## Checklist
- [x] Chiến lược Dockerfile build
- [x] Cấu hình instance size
- [x] Chiến lược scaling
- [ ] Setup Cloud Build CI/CD pipeline để deploy tự động

## Tài liệu liên quan
- [Scalability Design](Scalability.md)
- [Performance Optimization](Performance.md)

## Việc cần làm tiếp
- Viết script Terraform để provisioning resource trên GCP tự động.
