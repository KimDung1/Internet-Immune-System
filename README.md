# 🛡️ Internet Immune System
> **Hệ Miễn Dịch Không Gian Mạng** | AI-Powered Anti-Fraud Platform

![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![Gemini 2.5](https://img.shields.io/badge/Gemini_2.5_Flash-AI-1A73E8?logo=google&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Auth_%7C_Firestore-FFCA28?logo=firebase&logoColor=white)
![Tailwind 4](https://img.shields.io/badge/Tailwind_CSS-4.0-06B6D4?logo=tailwindcss&logoColor=white)

*Built for AI Riser Vietnam 2026 — Scam & Fraud Track*

---

## 🚨 The Problem (Vấn Đề)
- **16,000 tỷ VNĐ** (~$650M) lost to cyber fraud in Vietnam annually.
- **78%** of Vietnamese internet users are exposed to online scams.
- Traditional anti-virus software relies on signatures; modern scams rely on social engineering.

## 💡 The Solution (Giải Pháp)
The **Internet Immune System** is an AI-powered platform that protects users using a biological immune system metaphor. Instead of just blocking sites, it *immunizes* users through detection, explanation, and simulation.

### 🌟 Key Innovation: Consequence Simulation (Mô phỏng hậu quả)
Unique in Vietnam: We don't just warn users; we show them exactly what will happen if they proceed, using an AI-generated personalized 3-step loss timeline (Consequence Theater).

---

## ✨ Features (Tính Năng Lõi)

- **🔍 DETECT (Nhận Diện)**: Multi-agent AI threat detection powered by Gemini 2.5 Flash analyzing URLs, DOM content, and behavioral patterns.
- **📖 EXPLAIN (Giải Thích)**: Plain-language, jargon-free risk explanation in native Vietnamese.
- **⚡ SIMULATE (Mô Phỏng)**: *Consequence Theater* — A vivid 3-step timeline showing the exact financial and emotional consequences of falling for the specific scam.
- **💉 VACCINE (Tiêm Chủng)**: Interactive anti-fraud training drills with personalized quizzes to build "digital antibodies".
- **🛡️ PROTECT (Bảo Vệ)**: A Shadow DOM Chrome Extension Shield that safely overlays warnings without breaking site functionality.

---

## 🛠 Tech Stack

| Domain | Technology | Purpose |
|--------|------------|---------|
| **AI Engine** | Gemini 2.5 Flash | 6 specialized AI agents for threat analysis |
| **Frontend** | React, Vite, TypeScript | High-performance user interface |
| **Styling** | Tailwind CSS 4 | Modern, responsive UI components |
| **Backend/BFF** | Express.js | Secure proxy for AI calls, rate limiting |
| **Database/Auth**| Firebase Auth, Firestore | User management and threat telemetry |
| **Deployment** | Google Cloud Run | Scalable serverless container hosting |

---

## 🏗 Architecture

```text
[ User Browser ]
       |
 (Extension Shield / Web App)
       |
[ Express.js BFF Server ] ---> [ Firebase ]
       |
[ Gemini AI Gateway ]
  |-- Pattern Agent
  |-- DOM Agent
  |-- Simulation Agent
  |-- ...
```

---

## 🚀 Quick Start (Khởi Động Nhanh)

1. **Clone & Install**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   ```
   *(Note: In production, the Gemini key is moved to the server-side proxy)*

3. **Run Development Server**
   ```bash
   npm run dev
   ```

---

## 🎬 Demo Flow

1. 🌐 **Enter URL**: User pastes a suspicious link or the extension detects one.
2. 🤖 **AI Scan**: The Gemini Multi-Agent System analyzes the content.
3. 🛑 **Shield Appears**: If dangerous, the Shadow DOM shield blocks the page.
4. 💔 **Consequence Theater**: User reads the 3-step consequence simulation.
5. 🛡️ **Vaccine Drill**: User completes a quick quiz to unlock the site (or safely retreat).

---

## 🔒 Security Features
- **PII Sanitization**: Strips personal data before sending to LLM.
- **Prompt Injection Defense**: Validates input against adversarial prompts.
- **Server-Side Proxy**: BFF architecture hides API keys from the client.

---

## 🏆 About AI Riser Vietnam 2026
Developed by the Internet Immune System team for the **AI Riser Vietnam 2026** competition.
**Track**: Scam & Fraud Prevention.

---

## 📄 License
This project is licensed under the [Apache-2.0 License](LICENSE).
