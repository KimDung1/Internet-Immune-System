# Gemini API Integration

## Mục tiêu
Chi tiết kỹ thuật về việc tích hợp API của Google Gemini, cách định tuyến request tới các mô hình khác nhau, giới hạn rate limit và quản lý chi phí.

## Nội dung chính

### 1. Setup SDK
Sử dụng SDK chính thức của Google: `@google/genai` (hoặc Vertex AI SDK).
Khởi tạo Client trong Node.js backend:
```typescript
import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
```

### 2. Endpoints & Models
Hệ thống sử dụng linh hoạt 2 models dựa trên `mode` được client gọi:

- **Endpoint**: `/api/analyze`
- **Logic định tuyến**:
  - Nếu `mode === 'detect' || mode === 'protect'`:
    Sử dụng model: `gemini-2.5-flash`
  - Nếu `mode === 'simulate' || mode === 'explain' || mode === 'train'`:
    Sử dụng model: `gemini-2.5-pro`

### 3. Structured Output (Rất quan trọng)
Yêu cầu Gemini trả về JSON chuẩn xác bằng tính năng `responseSchema`.
```typescript
const responseSchema = {
  type: "OBJECT",
  properties: {
    threatLevel: { type: "STRING", enum: ["safe", "suspicious", "malicious"] },
    confidenceScore: { type: "NUMBER" },
    reasoning: { type: "STRING" }
  },
  required: ["threatLevel", "confidenceScore", "reasoning"]
};

const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: promptText,
    config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.1 // Thấp để đảm bảo tính logic và ổn định
    }
});
```

### 4. Quản lý Rate Limit & Cost
- Tận dụng hệ thống Caching (như đã nêu trong [Performance](../08_System_Architecture/Performance.md)) để giảm số lượng API calls.
- **Fallback Mechanism**: Nếu gọi Gemini API thất bại do rate limit, API tự động fallback về một danh sách chặn tĩnh (Static Blacklist) để tạm thời bảo vệ người dùng.

## Checklist
- [x] Khởi tạo SDK
- [x] Định tuyến model phù hợp
- [x] Ép định dạng JSON Output
- [x] Chiến lược dự phòng (Fallback)

## Tài liệu liên quan
- [AI Strategy](AIStrategy.md)

## Việc cần làm tiếp
- Triển khai file service xử lý Gemini core (`gemini.service.ts`).
