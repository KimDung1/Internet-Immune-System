# Container Strategy

## Mục tiêu
Tối ưu hóa quá trình container hóa (Dockerization) cho ứng dụng Backend của Internet Immune System. Nhằm đảm bảo image nhẹ, thời gian khởi động nhanh (giảm thiểu cold starts trên Cloud Run), và bảo mật.

## Nội dung chính

### 1. Base Images
Thay vì sử dụng các base image khổng lồ (như `python:3.10` hay `ubuntu`), dự án tiêu chuẩn hóa việc sử dụng base image siêu nhẹ và an toàn:
- Sử dụng **Alpine Linux** (vd: `python:3.11-alpine`) hoặc **Slim-buster / Slim-bullseye** (vd: `python:3.11-slim`).
- Lợi ích: Kích thước image giảm từ ~1GB xuống còn khoảng < 150MB, giúp quá trình pull image trong Cloud Run diễn ra nhanh hơn nhiều lần, tiết kiệm chi phí network Egress.

### 2. Chiến lược Multi-stage Builds
Sử dụng Multi-stage build trong Dockerfile để loại bỏ các công cụ build (compiler, gcc, dev-dependencies) khỏi image production cuối cùng.

**Ví dụ Kiến trúc Multi-stage cho Python (FastAPI):**
- **Stage 1 (Builder):**
  - Sử dụng base image lớn hơn để dễ dàng `pip install` các thư viện yêu cầu compile C.
  - Tạo một virtual environment (venv) và cài đặt toàn bộ dependencies vào đó.
- **Stage 2 (Runner / Production):**
  - Sử dụng base image siêu nhẹ (slim/alpine).
  - Chỉ copy thư mục virtual environment (venv) và mã nguồn đã hoàn chỉnh từ stage 1 sang.
  - Loại bỏ hoàn toàn các file rác, logs, và trình biên dịch.

### 3. Tối ưu thời gian chạy (Runtime Optimization)
- **Layer Caching**: Tối ưu thứ tự các lệnh trong Dockerfile. Copy file `requirements.txt` (hoặc `package.json`) và cài đặt dependencies trước khi copy toàn bộ mã nguồn. Việc này giúp Docker tận dụng bộ nhớ đệm (cache) trong trường hợp mã nguồn thay đổi nhưng thư viện thì không, tăng tốc độ CI pipeline lên gấp nhiều lần.
- **Non-root User**: Vì lý do bảo mật, không bao giờ chạy ứng dụng dưới quyền root. Thiết lập user riêng trong container:
  ```dockerfile
  RUN adduser --disabled-password appuser
  USER appuser
  ```
- **Tắt log buffer**: Đối với Python, set biến `ENV PYTHONUNBUFFERED=1` để logs in ngay lập tức ra standard out, tích hợp tốt với Google Cloud Logging.

### 4. Ví dụ cấu trúc Dockerfile lý tưởng
```dockerfile
# Stage 1: Build dependencies
FROM python:3.11-slim AS builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

# Stage 2: Runtime image
FROM python:3.11-slim
WORKDIR /app
COPY --from=builder /root/.local /root/.local
COPY . .
ENV PATH=/root/.local/bin:$PATH
ENV PYTHONUNBUFFERED=1
EXPOSE 8080
# Run as non-root user (tùy chọn nhưng khuyến nghị)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
```

## Checklist
- [x] Chọn base image (Python slim/alpine).
- [ ] Áp dụng Multi-stage build cho file Dockerfile hiện tại.
- [ ] Kiểm tra dung lượng image sau khi build (mục tiêu < 200MB).
- [ ] Cấu hình non-root user.
- [ ] Thiết lập Cloud Run để sử dụng image này với các biến môi trường hiệu năng cao.

## Tài liệu liên quan
- [CICD.md](./CICD.md)
- [DeploymentGuide.md](./DeploymentGuide.md)

## Việc cần làm tiếp
- Triển khai công cụ quét bảo mật (Trivy hoặc Google Container Analysis) để dò tìm lỗ hổng trong container image trước khi push.
- Cấu hình file `.dockerignore` thật chuẩn để không nhúng file `.git`, `.env` vào image.
