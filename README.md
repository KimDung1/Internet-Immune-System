# 🛡️ Internet Immune System (Hệ Miễn Dịch Internet)

[![Version](https://img.shields.io/badge/version-1.1.0-cyan.svg)](https://github.com/KimDung1/Internet-Immune-System/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](./LICENSE)
[![Google Gemini AI](https://img.shields.io/badge/AI-Google%20Gemini%202.5%20Flash%2FPro-blue.svg)](https://deepmind.google/technologies/gemini/)
[![Turborepo](https://img.shields.io/badge/Monorepo-Turborepo%202.x-red.svg)](https://turbo.build/)
[![Target](https://img.shields.io/badge/Target-AI%20Riser%20Vietnam%20Top%2010-amber.svg)](#)

> **"Đây KHÔNG PHẢI chatbot. Đây là một AI Experience phòng thủ lừa đảo thời gian thực đa tầng, bảo vệ người dùng Internet Việt Nam."**

---

## 📖 Tổng Quan Dự Án (Overview)

**Internet Immune System (Hệ Miễn Dịch Internet)** áp dụng mô hình sinh học của **Hệ Miễn Dịch** vào không gian mạng. Hệ thống liên tục quét, phát hiện, giải thích kịch tính kịch bản hậu quả lừa đảo, huấn luyện người dùng thích ứng và kích hoạt lá chắn bảo vệ thời gian thực qua Chrome Extension.

### 🌟 5 AI Modes Cốt Lõi (5 Immune Responses)
1. **Detect (Phát Hiện Nguy Cơ)**: Sử dụng **Gemini 2.5 Flash** quét URL/Email/Text/DOM với PII Redaction tự động.
2. **Explain (Giải Thích Chuyên Sâu)**: Sử dụng **Gemini 2.5 Pro** phân tích lý do nguy hiểm theo 3 cấp độ diễn giải tiếng Việt bình dân.
3. **Simulate (Kịch Bản Hậu Quả)**: Recreate kịch bản thiệt hại 3 bước (`T+0:00`, `T+seconds`, `T+minutes`) và ước tính tài chính VNĐ mất mát nếu bị lừa.
4. **Train (Luyện Tập Kháng Thể)**: Diễn tập tình huống lừa đảo giả lập thích ứng 3 câu hỏi trắc nghiệm, thưởng điểm Trust Score.
5. **Protect (Lá Chắn Thời Gian Thực)**: Chrome Extension Manifest V3 tiêm Red Alert Shield bằng **Shadow DOM** cách ly CSS.

---

## 🏗️ Kiến Trúc Monorepo (Monorepo Architecture)

```text
internet-immune-system/
├── apps/
│   ├── extension/          # Chrome Extension Manifest V3 (Background Service Worker + Shadow DOM Shield + Popup UI)
│   ├── web/                # Next.js 14 App Router (Landing, Scan, Train, Community, Dashboard, History, Profile, Vaccination)
│   └── api/                # Hono.js Cloud Run Serverless API Gateway (Auth, Scans, Simulations, Training, Reports, Vaccine, Users)
├── packages/
│   ├── agents/             # Multi-Agent System (ThreatDetectionAgent, ReasoningAgent, SimulationAgent, TrainingAgent, CommunityAgent, MemoryAgent)
│   ├── ui/                 # Cyber UI Component Library (Button, Card, RiskBadge, AIOrb, ScanInput)
│   ├── config/             # Shared TypeScript Presets (base, react, node)
│   └── core/               # Shared Zod Validation Schemas & Types (Scan, User, Simulation, Training)
├── firestore.rules         # Production Firestore Security Rules
├── firestore.indexes.json  # 12 Firestore Composite Indexes
├── .github/workflows/ci.yml# CI/CD GitHub Actions Pipeline
└── CHANGELOG.md            # Release Documentation
```

---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

- **Frontend Core**: Next.js 14 (App Router), React 18, TailwindCSS, Vanilla CSS Cyberpunk Glassmorphism.
- **Backend API**: Hono.js on Google Cloud Run (Node.js Serverless Container).
- **AI Brain**: `@google/genai` (Gemini 2.5 Flash & Gemini 2.5 Pro).
- **Database & Auth**: Firebase Auth (Google OAuth) + Google Cloud Firestore.
- **Browser Extension**: Chrome Extension Manifest V3 (Service Worker + Shadow DOM isolation).
- **Monorepo Tools**: Turborepo 2.x, pnpm Workspaces, TypeScript 5.4+ (Strict Mode).

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy (Quick Start)

### 1. Yêu Cầu Tiền Đề (Prerequisites)
- Node.js >= 18.0.0
- pnpm >= 9.0.0 (`npm i -g pnpm`)

### 2. Cài Đặt Dependencies
```bash
git clone https://github.com/KimDung1/Internet-Immune-System.git
cd Internet-Immune-System
pnpm install
```

### 3. Cấu Hình Biến Môi Trường (Environment Setup)
Tạo file `.env` từ mẫu `.env.example`:
```bash
cp .env.example .env
```
Cập nhật `GEMINI_API_KEY` và thông tin `FIREBASE` của bạn.

### 4. Khởi Chạy Development Local Server
```bash
# Khởi chạy đồng thời Web App (Port 3000) và API Backend (Port 8080)
pnpm dev
```
- Web Application: `http://localhost:3000`
- API Backend Gateway: `http://localhost:8080/v1/health`

### 5. Build Kiểm Thử Production
```bash
# Build toàn bộ 6 workspace packages & apps
pnpm build

# Kiểm tra strict type safety
pnpm check-types
```

### 6. Cài Đặt Chrome Extension (Local Load Unpacked)
1. Mở Google Chrome và truy cập `chrome://extensions/`.
2. Bật **Developer mode** (Chế độ dành cho nhà phát triển) ở góc trên bên phải.
3. Bấm **Load unpacked** (Tải tiện ích đã giải nén) và chọn thư mục `apps/extension/dist`.

---

## 📄 Giấy Phép (License)

Dự án được phân phối dưới giấy phép [MIT License](./LICENSE).

---

## 🤝 Liên Hệ & Đóng Góp (Contribution)

**Repository**: [KimDung1/Internet-Immune-System](https://github.com/KimDung1/Internet-Immune-System)  
**Target Event**: Top 10 AI Riser Vietnam Competition  
**Team**: Internet Immune System Core Team
