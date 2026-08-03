# Python Style Guide

## Mục tiêu
Chuẩn hóa việc viết code Python trong hệ sinh thái của Internet Immune System, áp dụng cho các scripts phân tích dữ liệu, Data Pipelines, và các thành phần Machine Learning/AI (nếu triển khai các model phụ trợ hoặc scripts đánh giá Gemini AI).

## Nội dung chính

### 1. Tiêu chuẩn chung
- Code phải tuân thủ chuẩn **PEP 8**.
- Sử dụng **Black** làm trình định dạng mã tự động (line length = 88).
- Sử dụng **Ruff** hoặc **Flake8** cho linting.

### 2. Định kiểu tĩnh (Type Hinting)
Tất cả các dự án Python phải áp dụng Type Hints cho các tham số hàm và giá trị trả về. Sử dụng `mypy` để kiểm tra tĩnh.
```python
# Sai
def analyze_threat(url, context):
    return {"risk": "high"}

# Đúng
from typing import Dict, Any

def analyze_threat(url: str, context: Dict[str, Any]) -> Dict[str, str]:
    """Phân tích mức độ đe dọa của một URL."""
    return {"risk": "high"}
```

### 3. Cấu trúc dự án AI/ML & Scripts
- Sử dụng `Poetry` thay vì `pip`/`requirements.txt` để quản lý dependencies và môi trường ảo nhằm đảm bảo tính lặp lại (reproducibility).
- Tổ chức thư mục rõ ràng:
  - `src/`: Mã nguồn chính.
  - `notebooks/`: Các file Jupyter cho thử nghiệm (phải xóa output trước khi commit hoặc dùng Jupytext).
  - `tests/`: Unit tests (sử dụng `pytest`).

### 4. Docstrings
Sử dụng chuẩn Google Style Docstrings cho tất cả các module, lớp, và hàm công khai.
```python
def fetch_gemini_response(prompt: str) -> str:
    """
    Calls the Gemini API with the given prompt.

    Args:
        prompt (str): The input text to send to the model.

    Returns:
        str: The generated text response.

    Raises:
        APIConnectionError: If the API endpoint is unreachable.
    """
```

### 5. Quản lý Môi trường & Khóa API
- Không bao giờ hardcode API Keys (Gemini, Firebase, v.v.). Sử dụng module `os` kết hợp với `python-dotenv` để nạp biến môi trường.

## Checklist
- [ ] Code vượt qua kiểm tra của Black và Ruff.
- [ ] Tất cả hàm đều có Type Hints rõ ràng.
- [ ] Đã chạy `mypy` và không có lỗi định kiểu.
- [ ] Đảm bảo file `.env` đã nằm trong `.gitignore`.

## Tài liệu liên quan
- [Naming Conventions](NamingConventions.md)

## Việc cần làm tiếp
- Tích hợp pre-commit hooks cho Black và Ruff vào repo.
- Thiết lập Github Action để tự động chạy pytest cho các dự án Python.
