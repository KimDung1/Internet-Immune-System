/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type InputType = 'url' | 'phone' | 'bank' | 'email' | 'text' | 'dom';

export type ClassificationType = 'safe' | 'suspicious' | 'phishing' | 'malware' | 'scam';

export type SeverityType = 'low' | 'medium' | 'high' | 'critical';

export type ActionRecommendation = 'ALLOW' | 'BLOCK' | 'WARN';

export interface RedFlag {
  id: string;
  label: string;
  severity: SeverityType;
  description: string;
  evidenceSnippet?: string;
}

export interface ScanResult {
  scanId: string;
  uid?: string;
  inputType: InputType;
  inputValue: string;
  sanitizedValue: string;
  piiRedactedCount: number;
  riskScore: number; // 0 - 100
  classification: ClassificationType;
  confidence: number; // 0.0 - 1.0
  geminiExplanation: string;
  redFlags: RedFlag[];
  actionRecommendation: ActionRecommendation;
  detectionSource: 'ai' | 'threat_intelligence' | 'cache' | 'fallback';
  modelUsed: string;
  processingMs: number;
  timestamp: string;
  simulationId?: string | null;
}

export interface SimulationStep {
  step: 1 | 2 | 3;
  title: string;
  description: string;
  timestampLabel: string; // e.g. "T+0:00", "T+0:04 giây", "T+3 phút"
  severity: 'medium' | 'high' | 'critical';
}

export interface SimulationResult {
  simulationId: string;
  scanId: string;
  steps: SimulationStep[];
  potentialLossVnd: string; // e.g. "50.000.000 VNĐ"
  closingMessage: string;
  generatedByModel: string;
  generationMs: number;
  timestamp: string;
}

export interface ExplanationResult {
  scanId: string;
  aiNarrative: string;
  redFlagDetails: {
    id: string;
    label: string;
    explanation: string;
    learnMore: string;
  }[];
  psychologicalTactics?: {
    tacticName: string;
    description: string;
  }[];
  technicalExplanations?: {
    feature: string;
    risk: string;
  }[];
  officialVerificationSteps?: string[];
  whatToDo: string[];
  educationalTip: string;
  immunityPointsEarned: number;
  hotline?: string | null;
}

export interface QuizQuestion {
  questionId: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
}

export interface TrainingSession {
  sessionId: string;
  scenarioType: 'phishing_email' | 'fake_sms' | 'fake_site' | 'investment_scam' | 'romance_scam';
  difficulty: 'easy' | 'medium' | 'hard';
  scenarioContent: string;
  scenarioBrand: string;
  questions: QuizQuestion[];
  userAnswers?: number[];
  score?: number | null;
  trustScoreDelta?: number;
  badgesEarned?: string[];
  completedAt?: string | null;
  createdAt: string;
}

export interface CommunityReport {
  reportId: string;
  reporterUid: string;
  reporterName: string;
  entityType: 'URL' | 'PHONE' | 'BANK_ACCOUNT' | 'EMAIL';
  entityValue: string;
  description: string;
  status: 'pending' | 'verified' | 'rejected';
  riskLevel: SeverityType;
  verifiedCount: number;
  createdAt: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt?: string | null;
  requirement: string;
}

export interface UserSettings {
  alertsEnabled: boolean;
  autoBlock: boolean;
  language: 'vi' | 'en';
  sensitivity: 'strict' | 'balanced' | 'lenient';
  realtimeExtensionShield: boolean;
  trustedDomains: string[];
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  trustScore: number; // 0 - 100
  antibodyLevel: number; // 1 - 10
  antibodyTitle: string;
  badges: string[];
  totalScans: number;
  threatsBlocked: number;
  vaccineHash: string; // Digital Vaccine Certificate ID
  settings: UserSettings;
  createdAt: string;
  lastActive: string;
}

export interface StandardEnvelope<T> {
  status: 'success' | 'error';
  data: T | null;
  error: {
    code: string;
    message: string;
    details?: any;
  } | null;
  meta: {
    requestId: string;
    timestamp: string;
    processingMs: number;
  };
}
