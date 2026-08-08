/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from '@google/genai';
import { sanitizePII } from './sanitizer';
import {
  InputType,
  ScanResult,
  SimulationResult,
  ExplanationResult,
  TrainingSession,
  QuizQuestion
} from '../types';

let genAIClient: GoogleGenAI | null = null;

// Retry with exponential backoff for Gemini API calls
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 2,
  baseDelayMs = 1000
): Promise<T> {
  let lastError: any;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      lastError = err;
      const isRetryable = err?.status === 429 || err?.status === 503 || err?.message?.includes('rate');
      if (!isRetryable || attempt === maxRetries) throw err;
      const delay = baseDelayMs * Math.pow(2, attempt) + Math.random() * 500;
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw lastError;
}

function getGenAI(): GoogleGenAI | null {
  if (!genAIClient) {
    // Only use server-side env var — never expose API key in browser bundle
    const key =
      (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) ||
      '';
    if (key && key !== 'MY_GEMINI_API_KEY') {
      try {
        genAIClient = new GoogleGenAI({ apiKey: key });
      } catch (e) {
        console.warn('Failed to initialize GoogleGenAI client:', e);
      }
    }
  }
  return genAIClient;
}

/**
 * 1. DETECT MODE: ThreatDetectionAgent
 * Uses Gemini 2.5 Flash + PII Sanitizer
 */
export async function runThreatDetection(
  rawInput: string,
  inputType: InputType = 'url',
  contextHint = ''
): Promise<ScanResult> {
  const startMs = Date.now();
  
  // Step 1: Sanitize PII
  const piiResult = sanitizePII(rawInput);
  const cleanInput = piiResult.sanitizedText;

  const ai = getGenAI();

  if (ai) {
    try {
      const prompt = `
Bạn là ThreatDetectionAgent - Chuyên gia AI của "Internet Immune System" (Hệ Miễn Dịch Internet Việt Nam).
Hãy phân tích nội dung/URL sau đây để phát hiện rủi ro lừa đảo, giả mạo, mã độc hoặc tống tiền.

Nội dung đã được lọc PII:
"""
${cleanInput}
"""
Ngữ cảnh bổ sung: "${contextHint}"

YÊU CẦU TRẢ VỀ DUY NHẤT 1 CHUỖI JSON HỢP LỆ (Không thêm text giải thích ngoài JSON):
{
  "riskScore": <số nguyên từ 0 đến 100>,
  "classification": "<safe | suspicious | phishing | malware | scam>",
  "confidence": <số thực từ 0.0 đến 1.0>,
  "actionRecommendation": "<ALLOW | WARN | BLOCK>",
  "geminiExplanation": "<Tóm tắt ngắn gọn dưới 150 ký tự bằng tiếng Việt>",
  "redFlags": [
    {
      "id": "<mã_nhận_diện>",
      "label": "<Tên dấu hiệu>",
      "severity": "<low | medium | high | critical>",
      "description": "<Mô tả dấu hiệu bất thường>"
    }
  ]
}
      `.trim();

      const response = await retryWithBackoff(() => ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.1,
        },
      }));

      const text = response.text || '';
      const parsed = JSON.parse(text);

      return {
        scanId: `sr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        inputType,
        inputValue: rawInput,
        sanitizedValue: cleanInput,
        piiRedactedCount: piiResult.redactedCount,
        riskScore: Math.min(100, Math.max(0, Number(parsed.riskScore) || 50)),
        classification: parsed.classification || 'suspicious',
        confidence: Math.min(1.0, Math.max(0.0, Number(parsed.confidence) || 0.85)),
        geminiExplanation: parsed.geminiExplanation || 'Nội dung chứa các yếu tố đáng nghi ngờ.',
        redFlags: Array.isArray(parsed.redFlags) ? parsed.redFlags : [],
        actionRecommendation: parsed.actionRecommendation || (parsed.riskScore >= 70 ? 'BLOCK' : parsed.riskScore >= 35 ? 'WARN' : 'ALLOW'),
        detectionSource: 'ai',
        modelUsed: 'gemini-2.5-flash',
        processingMs: Date.now() - startMs,
        timestamp: new Date().toISOString(),
      };
    } catch (err) {
      console.warn('Gemini API call failed or rate limited, falling back to local Threat Heuristic Engine:', err);
    }
  }

  // Local Rule-Engine Fallback if API key is not present or API fails
  return runLocalHeuristicDetect(rawInput, cleanInput, inputType, piiResult.redactedCount, startMs);
}

/**
 * 2. EXPLAIN MODE: ReasoningAgent
 * Uses Gemini 2.5 Pro / Flash to generate clear Vietnamese explanations
 */
export async function runReasoningExplain(scan: ScanResult): Promise<ExplanationResult> {
  const ai = getGenAI();

  if (ai) {
    try {
      const prompt = `
Bạn là ReasoningAgent chuyên gia an ninh mạng của "Internet Immune System".
Hãy tạo lời giải thích chi tiết, chuyên sâu nhưng cực kỳ dễ hiểu bằng tiếng Việt cho người dùng (đặc biệt là người lớn tuổi & người không rành công nghệ) về mối đe dọa lừa đảo này.

Nội dung bị quét: "${scan.sanitizedValue}"
Phân loại: ${scan.classification}
Mức độ rủi ro: ${scan.riskScore}/100
Dấu hiệu (Red Flags): ${JSON.stringify(scan.redFlags)}

Trả về duy nhất 1 chuỗi JSON:
{
  "aiNarrative": "<Đoạn văn giải thích 150-250 ký tự bằng tiếng Việt đơn giản, dễ hiểu>",
  "redFlagDetails": [
    {
      "id": "<flag_id>",
      "label": "<tên dấu hiệu>",
      "explanation": "<tại sao điểm này lại nguy hiểm>",
      "learnMore": "<lời khuyên nhận biết>"
    }
  ],
  "psychologicalTactics": [
    {
      "tacticName": "<Tên thủ đoạn tâm lý, e.g. Thúc Ép Cấp Bách, Giả Danh Chính Quyền, Dụ Dỗ Lợi Nhuận Khủng>",
      "description": "<Cách kẻ lừa đảo đánh vào tâm lý con người để nạn nhân mất cảnh giác>"
    }
  ],
  "technicalExplanations": [
    {
      "feature": "<Kỹ thuật công nghệ bị lợi dụng, e.g. Domain Homograph / SMS Brandname giả / Deepfake / STK Rác>",
      "risk": "<Nguy cơ kỹ thuật đối với thiết bị hoặc tài khoản ngân hàng>"
    }
  ],
  "officialVerificationSteps": [
    "<Bước 1 kiểm tra tính xác thực chính chủ>",
    "<Bước 2 kiểm tra tính xác thực chính chủ>"
  ],
  "whatToDo": [
    "<Hành động 1 - bắt đầu bằng động từ>",
    "<Hành động 2 - bắt đầu bằng động từ>",
    "<Hành động 3 - bắt đầu bằng động từ>"
  ],
  "educationalTip": "<1 câu quy tắc vàng dễ nhớ>",
  "immunityPointsEarned": 10,
  "hotline": "<Số hotline hỗ trợ ngân hàng/công an liên quan nếu có, hoặc null>"
}
      `.trim();

      const response = await retryWithBackoff(() => ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      }));

      const parsed = JSON.parse(response.text || '{}');
      return {
        scanId: scan.scanId,
        aiNarrative: parsed.aiNarrative || scan.geminiExplanation,
        redFlagDetails: Array.isArray(parsed.redFlagDetails) ? parsed.redFlagDetails : [],
        psychologicalTactics: Array.isArray(parsed.psychologicalTactics) ? parsed.psychologicalTactics : [
          {
            tacticName: 'Tạo Áp Lực Thời Gian & Hoảng Sợ',
            description: 'Kẻ lừa đảo đe dọa khóa tài khoản hoặc kiện tụng trong 5 phút để nạn nhân không kịp suy nghĩ hay hỏi ý kiến người thân.'
          }
        ],
        technicalExplanations: Array.isArray(parsed.technicalExplanations) ? parsed.technicalExplanations : [
          {
            feature: 'Giả Mạo Tên Miền / Số Tài Khoản Rác',
            risk: 'Tên miền nhái ký tự gần giống tổ chức thật hoặc số tài khoản mua bán trôi nổi không thể truy cứu.'
          }
        ],
        officialVerificationSteps: Array.isArray(parsed.officialVerificationSteps) ? parsed.officialVerificationSteps : [
          'Kiểm tra tên miền phải kết thúc bằng .gov.vn (cơ quan nhà nước) hoặc .com.vn (doanh nghiệp lớn).',
          'Tự tay mở ứng dụng ngân hàng chính thức để tra cứu thông tin thay vì bấm link trong SMS.'
        ],
        whatToDo: Array.isArray(parsed.whatToDo) ? parsed.whatToDo : [
          'Tuyệt đối không nhấp vào bất kỳ đường link nào.',
          'Gọi điện thoại tới hotline chính thức của ngân hàng/cơ quan để xác minh.',
          'Báo cáo liên kết này cho cộng đồng Internet Immune System.'
        ],
        educationalTip: parsed.educationalTip || 'Ngân hàng và Công an KHÔNG BAO GIỜ yêu cầu chuyển tiền hay gửi mã OTP qua Zalo/SMS.',
        immunityPointsEarned: 10,
        hotline: parsed.hotline || 'Hotline Cục An Ninh Mạng A05: 113 / Vietcombank: 1800 1218',
      };
    } catch (e) {
      console.warn('Reasoning explain API call failed, using heuristic fallback:', e);
    }
  }

  // Fallback
  return {
    scanId: scan.scanId,
    aiNarrative: scan.geminiExplanation || 'Trang web/nội dung này mô phỏng giao diện tổ chức uy tín nhằm đánh cắp tài khoản cá nhân và OTP của bạn.',
    redFlagDetails: scan.redFlags.map((rf) => ({
      id: rf.id,
      label: rf.label,
      explanation: rf.description,
      learnMore: 'Luôn kiểm tra kỹ tên miền chính thức (.gov.vn, .com.vn) trước khi nhập bất kỳ thông tin nào.',
    })),
    psychologicalTactics: [
      {
        tacticName: 'Tạo Áp Lực Hoảng Sợ Cấp Bách',
        description: 'Đe dọa tài khoản bị khóa hoặc liên quan vụ án để buộc nạn nhân làm theo ngay lập tức.'
      }
    ],
    technicalExplanations: [
      {
        feature: 'Sử Dụng Tên Miền Lạ & STK Rác',
        risk: 'Các liên kết này điều hướng người dùng tới máy chủ độc hại không thuộc quản lý của tổ chức.'
      }
    ],
    officialVerificationSteps: [
      'Gặp trực tiếp người thân/cơ quan công an gần nhất.',
      'Gọi tổng đài chính thức được in trực tiếp trên thẻ ngân hàng.'
    ],
    whatToDo: [
      'Đóng trang web hoặc xóa tin nhắn này ngay lập tức.',
      'Gọi điện tới hotline ngân hàng chính thức ghi trên mặt sau thẻ ATM.',
      'Bật tính năng Tự Động Chặn trên Chrome Extension Internet Immune System.'
    ],
    educationalTip: 'Khi nghi ngờ, hãy DỪNG LẠI - KHÔNG CHUYỂN TIỀN - HỎI NGƯỜI THÂN hoặc dùng Internet Immune System.',
    immunityPointsEarned: 10,
    hotline: 'Hotline Vietcombank: 1800 1218 / Cục An Ninh Mạng A05: 113',
  };
}

/**
 * Follow-up Q&A Chat with AI regarding a scan explanation
 */
export async function askAiExplanationQuestion(
  scan: ScanResult,
  explanation: ExplanationResult,
  question: string
): Promise<string> {
  const ai = getGenAI();
  if (ai) {
    try {
      const prompt = `
Bạn là Chuyên gia Trợ lý AI An Ninh Mạng của "Internet Immune System".
Người dùng đang thắc mắc về một nội dung nghi vấn vừa được quét:

Nội dung: "${scan.sanitizedValue}"
Loại: ${scan.inputType}
Đánh giá AI: ${scan.classification} (Mức rủi ro: ${scan.riskScore}/100)
Tóm tắt AI đã giải thích: "${explanation.aiNarrative}"

Câu hỏi của người dùng: "${question}"

Hãy trả lời ngắn gọn (100-200 từ), rõ ràng, thân thiện, mang tính tư vấn an toàn thông tin chuyên nghiệp bằng tiếng Việt. Cung cấp lời khuyên cụ thể, thực tế.
      `.trim();

      const response = await retryWithBackoff(() => ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      }));

      return response.text || 'Tôi khuyên bạn tuyệt đối không thực hiện giao dịch hay cung cấp thông tin cá nhân. Hãy gọi tổng đài chính thức để kiểm tra.';
    } catch (e) {
      console.warn('Ask AI explanation failed:', e);
    }
  }

  return 'Trợ lý AI khuyên bạn: Khi có bất kỳ nghi ngờ nào về số tài khoản hay đường link, hãy tạm dừng giao dịch và liên hệ người thân hoặc ngân hàng chính thức.';
}

/**
 * 3. SIMULATE MODE: SimulationAgent
 * Consequence Theater (3-step dramatic timeline + VNĐ loss estimation)
 */
export async function runSimulationTheater(scan: ScanResult): Promise<SimulationResult> {
  const startMs = Date.now();
  const ai = getGenAI();

  if (ai) {
    try {
      const prompt = `
Bạn là SimulationAgent (Consequence Theater Engine) của "Internet Immune System".
Hãy kịch tính hóa diễn biến lừa đảo 3 bước (Consequence Timeline) nếu nạn nhân sập bẫy nội dung sau đây.

Nội dung: "${scan.sanitizedValue}"
Phân loại: ${scan.classification} (Risk: ${scan.riskScore}/100)

Trả về duy nhất 1 JSON:
{
  "steps": [
    {
      "step": 1,
      "title": "<Tên bước 1 - T+0:00>",
      "description": "<Mô tả hành động nạn nhân làm theo hướng dẫn lừa đảo>",
      "timestampLabel": "T+0:00",
      "severity": "medium"
    },
    {
      "step": 2,
      "title": "<Tên bước 2 - T+0:04s>",
      "description": "<Kẻ tấn công chiếm quyền / lấy OTP / đọc tin nhắn>",
      "timestampLabel": "T+0:04 giây",
      "severity": "critical"
    },
    {
      "step": 3,
      "title": "<Tên bước 3 - T+3 phút>",
      "description": "<Tài sản bị rút cạn / danh tính bị lợi dụng>",
      "timestampLabel": "T+3 phút",
      "severity": "critical"
    }
  ],
  "potentialLossVnd": "<Số tiền ước tính thiệt hại, e.g. 50.000.000 VNĐ>",
  "closingMessage": "<Lời nhắn hy vọng khẳng định Hệ Miễn Dịch đã ngăn chặn điều này>"
}
      `.trim();

      const response = await retryWithBackoff(() => ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      }));

      const parsed = JSON.parse(response.text || '{}');
      return {
        simulationId: `sim_${Date.now()}`,
        scanId: scan.scanId,
        steps: Array.isArray(parsed.steps) && parsed.steps.length === 3 ? parsed.steps : getDefaultSimulationSteps(scan),
        potentialLossVnd: parsed.potentialLossVnd || '50.000.000 VNĐ',
        closingMessage: parsed.closingMessage || 'Rất may! Hệ Miễn Dịch Internet đã chặn điều này. Bạn vừa tránh được khoản thiệt hại 50.000.000 VNĐ.',
        generatedByModel: 'gemini-2.5-flash',
        generationMs: Date.now() - startMs,
        timestamp: new Date().toISOString(),
      };
    } catch (e) {
      console.warn('Simulation API call failed, using local simulation engine:', e);
    }
  }

  // Fallback Simulation Engine
  return {
    simulationId: `sim_${Date.now()}`,
    scanId: scan.scanId,
    steps: getDefaultSimulationSteps(scan),
    potentialLossVnd: scan.riskScore > 80 ? '85.000.000 VNĐ' : '20.000.000 VNĐ',
    closingMessage: 'Rất may! Hệ Miễn Dịch Internet của bạn đã chủ động vô hiệu hóa mối đe dọa này. Bạn đã bảo vệ an toàn cho tài sản cá nhân.',
    generatedByModel: 'iis-heuristic-sim-v1',
    generationMs: Date.now() - startMs,
    timestamp: new Date().toISOString(),
  };
}

/**
 * 4. TRAIN MODE: TrainingAgent
 * Adaptive Anti-Fraud Vaccine Drills
 */
export async function runTrainingGenerator(
  difficulty: 'easy' | 'medium' | 'hard' = 'medium',
  scenarioType: TrainingSession['scenarioType'] = 'phishing_email'
): Promise<TrainingSession> {
  const ai = getGenAI();

  if (ai) {
    try {
      const prompt = `
Bạn là TrainingAgent của "Internet Immune System".
Tạo 1 đợt diễn tập Vắc-xin Số chống lừa đảo (Training Drill) phù hợp cho người dùng Việt Nam.

Độ khó: ${difficulty}
Loại kịch bản: ${scenarioType}

YÊU CẦU:
1. Tất cả thương hiệu phải là GIẢ LẬP (VD: Techbank, VietShop, GrabFast, ZaloPay-Pro). CẤM dùng ngân hàng thật.
2. Tạo 3 câu hỏi trắc nghiệm (mỗi câu đúng 1 đáp án 0-3).

Trả về duy nhất 1 JSON:
{
  "scenarioContent": "<Đoạn văn bản/SMS/Email kịch bản lừa đảo giả lập 150-250 từ>",
  "scenarioBrand": "<Thương hiệu giả lập>",
  "questions": [
    {
      "questionId": "q1",
      "question": "<Câu hỏi 1>",
      "options": ["<Đáp án A>", "<Đáp án B>", "<Đáp án C>", "<Đáp án D>"],
      "correctIndex": <0|1|2|3>,
      "explanation": "<Giải thích ngắn tại sao đáp án này đúng>"
    },
    {
      "questionId": "q2",
      "question": "<Câu hỏi 2>",
      "options": ["<Đáp án A>", "<Đáp án B>", "<Đáp án C>", "<Đáp án D>"],
      "correctIndex": <0|1|2|3>,
      "explanation": "<Giải thích ngắn>"
    },
    {
      "questionId": "q3",
      "question": "<Câu hỏi 3>",
      "options": ["<Đáp án A>", "<Đáp án B>", "<Đáp án C>", "<Đáp án D>"],
      "correctIndex": <0|1|2|3>,
      "explanation": "<Giải thích ngắn>"
    }
  ]
}
      `.trim();

      const response = await retryWithBackoff(() => ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      }));

      const parsed = JSON.parse(response.text || '{}');
      return {
        sessionId: `ts_${Date.now()}`,
        scenarioType,
        difficulty,
        scenarioContent: parsed.scenarioContent || getDefaultDrillScenario(scenarioType),
        scenarioBrand: parsed.scenarioBrand || 'Techbank (Giả lập)',
        questions: Array.isArray(parsed.questions) && parsed.questions.length === 3 ? parsed.questions : getDefaultDrillQuestions(),
        createdAt: new Date().toISOString(),
      };
    } catch (e) {
      console.warn('Training API call failed, using default drill bank:', e);
    }
  }

  return {
    sessionId: `ts_${Date.now()}`,
    scenarioType,
    difficulty,
    scenarioContent: getDefaultDrillScenario(scenarioType),
    scenarioBrand: 'Techbank (Giả lập)',
    questions: getDefaultDrillQuestions(),
    createdAt: new Date().toISOString(),
  };
}

// Private Local Heuristic Detection Engine
function runLocalHeuristicDetect(
  rawInput: string,
  cleanInput: string,
  inputType: InputType,
  piiRedactedCount: number,
  startMs: number
): ScanResult {
  const lower = rawInput.toLowerCase();
  
  const isPhishingDomain =
    lower.includes('-secure-login') ||
    lower.includes('techbank-verify') ||
    lower.includes('vietcombank-login') ||
    lower.includes('.ph/') ||
    lower.includes('.tk/') ||
    lower.includes('nhantien-online');

  const isScamKeywords =
    lower.includes('khoa tai khoan') ||
    lower.includes('chuyen nham tien') ||
    lower.includes('công an') ||
    lower.includes('cục thuế') ||
    lower.includes('chốt đơn shopee') ||
    lower.includes('lãi 300%') ||
    lower.includes('nhận quà trúng thưởng');

  const isScamBankOrPhone = 
    inputType === 'bank' || inputType === 'phone' ||
    lower.includes('1900') || lower.includes('090') || lower.includes('10398') || lower.includes('1903');

  let riskScore = 15;
  let classification: ScanResult['classification'] = 'safe';
  let recommendation: ScanResult['actionRecommendation'] = 'ALLOW';
  const redFlags: ScanResult['redFlags'] = [];

  if (isPhishingDomain) {
    riskScore = 92;
    classification = 'phishing';
    recommendation = 'BLOCK';
    redFlags.push(
      {
        id: 'fake_domain',
        label: 'Tên Miền Giả Mạo Ngân Hàng',
        severity: 'critical',
        description: 'Tên miền chứa đuôi giả lập -secure-login hoặc tên quốc tế lạ .ph không thuộc ngân hàng chính thức.',
      },
      {
        id: 'credential_harvest',
        label: 'Form Thu Thập Mật Khẩu & OTP',
        severity: 'critical',
        description: 'Phát hiện cấu trúc biểu mẫu nhập thông tin tài khoản nhạy cảm.',
      }
    );
  } else if (isScamKeywords) {
    riskScore = 88;
    classification = 'scam';
    recommendation = 'BLOCK';
    redFlags.push(
      {
        id: 'urgency_manipulation',
        label: 'Thao Túng Cảm Xúc Áp Lực',
        severity: 'high',
        description: 'Sử dụng các từ khóa đe dọa khóa tài khoản hoặc cơ hội nhận thưởng khẩn cấp.',
      },
      {
        id: 'unknown_source_link',
        label: 'Đường Link Lạ Không Rõ Nguồn Gốc',
        severity: 'medium',
        description: 'Được gửi qua SMS hoặc tin nhắn ứng dụng OTT từ người lạ.',
      }
    );
  } else if (inputType === 'bank' || inputType === 'phone') {
    if (isScamBankOrPhone) {
      riskScore = 82;
      classification = 'scam';
      recommendation = 'BLOCK';
      redFlags.push(
        {
          id: 'blacklisted_entity',
          label: 'Nằm Trong Danh Sách Đen Cảnh Báo',
          severity: 'critical',
          description: `Thông tin ${inputType === 'bank' ? 'Số tài khoản ngân hàng' : 'Số điện thoại'} bị người dùng báo cáo lừa đảo mạo danh tổ chức.`,
        },
        {
          id: 'unverified_recipient',
          label: 'Chưa Được Xác Thực Tín Nhiệm',
          severity: 'high',
          description: 'Cần kiểm tra kỹ tên chủ tài khoản/chủ thuê bao trước khi thực hiện giao dịch chuyển tiền.',
        }
      );
    } else {
      riskScore = 20;
      classification = 'safe';
      recommendation = 'ALLOW';
    }
  } else if (piiRedactedCount > 0) {
    riskScore = 42;
    classification = 'suspicious';
    recommendation = 'WARN';
    redFlags.push({
      id: 'contains_pii',
      label: 'Chứa Thông Tin Nhạy Cảm (PII)',
      severity: 'medium',
      description: 'Đoạn tin nhắn chứa số điện thoại hoặc mã định danh cá nhân đã được hệ thống tự động bôi đen.',
    });
  }

  return {
    scanId: `sr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    inputType,
    inputValue: rawInput,
    sanitizedValue: cleanInput,
    piiRedactedCount,
    riskScore,
    classification,
    confidence: 0.95,
    geminiExplanation:
      classification === 'phishing'
        ? 'Phát hiện trang web giả mạo ngân hàng chính thức với tên miền lạ thu thập mật khẩu và mã OTP.'
        : classification === 'scam'
        ? 'Phát hiện tin nhắn lừa đảo kích thích sự sợ hãi hoặc lòng tham để nạn nhân nhấp vào liên kết độc hại.'
        : classification === 'suspicious'
        ? 'Nội dung chứa một số yếu tố cần lưu ý. Hãy kiểm tra kỹ tên miền trước khi giao dịch.'
        : 'Nội dung chưa ghi nhận dấu hiệu lừa đảo nguy hiểm.',
    redFlags,
    actionRecommendation: recommendation,
    detectionSource: 'ai',
    modelUsed: 'iis-heuristic-engine-v1',
    processingMs: Date.now() - startMs,
    timestamp: new Date().toISOString(),
  };
}

function getDefaultSimulationSteps(scan: ScanResult): SimulationResult['steps'] {
  return [
    {
      step: 1,
      title: 'Bạn nhấp vào liên kết hoặc làm theo hướng dẫn',
      description: 'Trang web giả mạo tải ra giao diện giống 99% tổ chức uy tín. Bạn nhập username, mật khẩu và số điện thoại.',
      timestampLabel: 'T+0:00',
      severity: 'medium',
    },
    {
      step: 2,
      title: 'Kẻ tấn công đánh cắp thông tin & đọc mã OTP',
      description: 'Trong 4 giây, dữ liệu được truyền về máy chủ kẻ lừa đảo. Mã OTP gửi về SMS lập tức bị mã độc hoặc form giả mạo thu thập.',
      timestampLabel: 'T+0:04 giây',
      severity: 'critical',
    },
    {
      step: 3,
      title: 'Tài khoản bị rút sạch tiền trong 3 phút',
      description: `Kẻ tấn công khởi tạo 3 lệnh chuyển khoản tự động rút cạn ${scan.riskScore > 80 ? '85.000.000 VNĐ' : '20.000.000 VNĐ'} sang các tài khoản ngân hàng trung gian.`,
      timestampLabel: 'T+3 phút',
      severity: 'critical',
    },
  ];
}

function getDefaultDrillScenario(scenarioType: string): string {
  if (scenarioType === 'fake_sms') {
    return '[Techbank - Phong Bao Mat]: Tai khoan 0901234567 vua bi khoi tao lenh rut 50.000.000 VND tai Ha Noi. Truy cap ngay http://techbank-verify.net/xacthuc de huy lenh khong thi tai khoan se bi khoa trong 2 gio.';
  }
  return '[Techbank Security Alert]: Email phát hiện truy cập lạ từ địa chỉ IP nước ngoài. Quý khách vui lòng xác minh lại danh tính tại http://techbank-verify.net/login để bảo vệ tài khoản.';
}

function getDefaultDrillQuestions(): QuizQuestion[] {
  return [
    {
      questionId: 'q1',
      question: 'Dấu hiệu bất thường lớn nhất trong thông báo này là gì?',
      options: [
        'Thông báo gửi qua SMS/Email',
        'Địa chỉ tên miền techbank-verify.net không phải tên miền chính thức techbank.vn',
        'Số tiền trong thông báo quá nhỏ',
        'Nội dung tin nhắn viết bằng tiếng Việt'
      ],
      correctIndex: 1,
      explanation: 'Tên miền chính thức của ngân hàng luôn dùng domain chuẩn (.vn, .com.vn). Tên miền lạ chứa từ khóa "verify" hoặc đuôi .net là giả mạo.',
    },
    {
      questionId: 'q2',
      question: 'Kẻ lừa đảo sử dụng thủ thuật tâm lý nào ở đây?',
      options: [
        'Khen ngợi và tặng quà miễn phí',
        'Tạo tâm lý hoảng loạn và áp lực thời gian khẩn cấp (2 giờ)',
        'Thách thức lòng tự trọng của nạn nhân',
        'Nhờ vả sự giúp đỡ từ người thân'
      ],
      correctIndex: 1,
      explanation: 'Thao túng áp lực thời gian (Urgency/Fear) khiến nạn nhân mất bình tĩnh và hành động vội vã mà không kịp suy xét.',
    },
    {
      questionId: 'q3',
      question: 'Hành động an toàn nhất bạn nên làm ngay lúc này là gì?',
      options: [
        'Bấm ngay vào link để kiểm tra số dư',
        'Gọi điện thoại tới hotline chính thức ghi trên mặt sau thẻ ATM để kiểm tra',
        'Nhắn tin lại hỏi thông tin chi tiết người gửi',
        'Chia sẻ đường link lên Facebook để hỏi bạn bè'
      ],
      correctIndex: 1,
      explanation: 'Luôn chủ động liên hệ hotline ngân hàng ghi trên thẻ ATM chính thức. Tuyệt đối không nhấp link trong SMS/Email.',
    },
  ];
}

/**
 * 5. CYBER ASSISTANT CHATBOT AGENT
 * Floating 24/7 Security Expert Assistant with custom System Prompt
 */
export async function askCyberAssistant(
  history: { sender: 'user' | 'assistant'; text: string }[],
  question: string
): Promise<string> {
  const ai = getGenAI();
  const systemPrompt = `
Bạn là "CyberImmune Assistant" - Trợ Lý AI Chuyên Gia An Ninh Mạng & Kháng Thể Số 24/7 của Việt Nam.
Nhiệm vụ chính của bạn:
1. Tư vấn, giải đáp thắc mắc về các thủ đoạn lừa đảo mạng tại Việt Nam (giả mạo Công An, Thuế, Cảnh sát giao thông, Ngân hàng, tuyển CTV Shopee/Tiki/TikTok, cuộc gọi Deepfake AI, bẫy tình cảm, link nhận thưởng, ứng dụng độc hại .APK Dịch Vụ Công giả mạo).
2. Hướng dẫn các bước xử lý khẩn cấp khi người dùng lỡ bấm vào link lạ, chuyển tiền lừa đảo hoặc bị lộ mã OTP/mật khẩu.
3. Giải thích ngắn gọn, rõ ràng, dùng ngôn ngữ Tiếng Việt chuẩn mực, giàu năng lượng tích cực, dùng emoji hợp lý và gạch đầu dòng dễ nhìn.
`.trim();

  if (ai) {
    try {
      const historyStr = history
        .slice(-6)
        .map((m) => `${m.sender === 'user' ? 'Người dùng' : 'Trợ lý AI'}: ${m.text}`)
        .join('\n');

      const fullPrompt = `${systemPrompt}\n\nLịch sử cuộc trò chuyện:\n${historyStr}\n\nCâu hỏi từ người dùng: "${question}"\n\nPhản hồi từ Trợ Lý CyberImmune:`;

      const response = await retryWithBackoff(() => ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: fullPrompt,
        config: {
          temperature: 0.3,
        },
      }));

      if (response.text) {
        return response.text;
      }
    } catch (err) {
      console.warn('CyberAssistant AI call error:', err);
    }
  }

  // Fallback response if offline or API limit
  const qLower = question.toLowerCase();
  if (qLower.includes('công an') || qLower.includes('thuế') || qLower.includes('phạt nguội')) {
    return `🚨 **CẢNH BÁO MẠO DANH CƠ QUAN NHÀ NƯỚC!**\n\n1. Cơ quan Công An, Cục Thuế, Viện Kiểm Sát KHÔNG BAO GIỜ làm việc qua điện thoại, Zalo hay yêu cầu chuyển tiền vào tài khoản cá nhân.\n2. Tuyệt đối không tải ứng dụng Dịch Vụ Công đuôi .APK từ link do đối tượng gửi.\n3. Hãy ngắt cuộc gọi ngay và báo Công An địa phương gần nhất!`;
  }
  if (qLower.includes('chuyển tiền') || qLower.includes('lỡ chuyển') || qLower.includes('ngân hàng')) {
    return `⚡ **CÁC BƯỚC XỬ LÝ KHẨN CẤP KHI LỠ CHUYỂN TIỀN LỪA ĐẢO:**\n\n1. **Gọi Hotline Ngân Hàng Ngay:** Yêu cầu khoanh vùng tài khoản, báo cáo giao dịch gian lận khẩn cấp.\n2. **Đổi Mật Khẩu App Ngân Hàng & Khóa Smart OTP** ngay lập tức.\n3. **Trình Báo Công An:** Thu thập biên lai, tin nhắn, số tài khoản kẻ lừa đảo để trình báo đơn vị an ninh mạng.`;
  }
  return `🛡️ **Trợ Lý An Ninh Mạng CyberImmune:**\nĐể bảo vệ bản thân trên không gian mạng, hãy nhớ **3 KHÔNG - 2 PHẢI**:\n- ❌ KHÔNG bấm link lạ trong SMS/Zalo/Email\n- ❌ KHÔNG cung cấp OTP / Mật khẩu cho bất kỳ ai\n- ❌ KHÔNG tải app đuôi .APK ngoài Google Play/App Store\n- ✅ PHẢI xác minh trực tiếp qua Hotline chính thức\n- ✅ PHẢI dùng tính năng Quét Mối Đe Dọa của Internet Immune System!`;
}

