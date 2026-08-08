/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  UserProfile,
  ScanResult,
  Badge,
  CommunityReport,
  TrainingSession,
  StandardEnvelope
} from '../types';

const STORAGE_KEYS = {
  USER_PROFILE: 'iis_user_profile_v1',
  SCAN_HISTORY: 'iis_scan_history_v1',
  COMMUNITY_REPORTS: 'iis_community_reports_v1',
  TRAINING_SESSIONS: 'iis_training_sessions_v1',
};

// Calculate antibody rank level and title based on trust score
export function getAntibodyRank(score: number): { level: number; title: string } {
  if (score < 15) return { level: 1, title: 'Hệ Thống Thức Tỉnh' };
  if (score < 30) return { level: 2, title: 'Phòng Thủ Cơ Bản' };
  if (score < 45) return { level: 3, title: 'Nhận Thức Phishing' };
  if (score < 60) return { level: 4, title: 'Phát Hiện Lừa Đảo' };
  if (score < 72) return { level: 5, title: 'Xác Định Mối Đe Dọa' };
  if (score < 82) return { level: 6, title: 'Chuyên Gia Cảnh Báo Đỏ' };
  if (score < 90) return { level: 7, title: 'Người Bảo Vệ Cộng Đồng' };
  if (score < 95) return { level: 8, title: 'Chuyên Gia Phân Tích Gian Lận' };
  if (score < 99) return { level: 9, title: 'Vô Địch Hệ Miễn Dịch' };
  return { level: 10, title: 'Huyền Thoại Internet Immune' };
}

export const ALL_BADGES: Badge[] = [
  {
    id: 'first_scan',
    name: 'Tế Bào Tuyên Phế',
    description: 'Thực hiện lần quét mối đe dọa đầu tiên trên Internet Immune System.',
    icon: '🔍',
    requirement: 'Thực hiện 1 lượt quét',
  },
  {
    id: 'phishing_expert',
    name: 'Bạch Cầu Phishing',
    description: 'Nhận diện và vạch trần thành công 3 trang web/email giả mạo ngân hàng.',
    icon: '🛡️',
    requirement: 'Phát hiện 3 cuộc tấn công Phishing',
  },
  {
    id: 'perfect_drill',
    name: 'Kháng Thể Hoàn Hảo',
    description: 'Đạt điểm tuyệt đối 100/100 trong đợt diễn tập vắc-xin số.',
    icon: '🎯',
    requirement: 'Hoàn thành bài tập Train Mode đạt 100%',
  },
  {
    id: 'community_guardian',
    name: 'Hiệp Sĩ Mạng',
    description: 'Báo cáo 1 mối đe dọa lừa đảo được cộng đồng xác minh.',
    icon: '🏆',
    requirement: 'Gửi 1 báo cáo cộng đồng verified',
  },
  {
    id: 'deepfake_defender',
    name: 'Mắt Thần Anti-AI',
    description: 'Phát hiện cuộc gọi hoặc kịch bản lừa đảo Deepfake/AI.',
    icon: '👁️',
    requirement: 'Phát hiện 1 lừa đảo Deepfake/AI',
  },
  {
    id: 'vaccine_certified',
    name: 'Chứng Nhận Kháng Thể',
    description: 'Sở hữu chứng chỉ tiêm chủng vắc-xin số chính thức.',
    icon: '💉',
    requirement: 'Kích hoạt Digital Vaccine Pass',
  },
];

export const GUEST_USER: UserProfile = {
  uid: 'guest',
  email: '',
  displayName: 'Khách (Chưa Đăng Nhập)',
  trustScore: 0,
  antibodyLevel: 1,
  antibodyTitle: 'Tài Khoản Khách',
  badges: [],
  totalScans: 0,
  threatsBlocked: 0,
  vaccineHash: 'IIS-VN-GUEST-0000',
  settings: {
    alertsEnabled: true,
    autoBlock: true,
    language: 'vi',
    sensitivity: 'balanced',
    realtimeExtensionShield: true,
    trustedDomains: ['google.com', 'vietcombank.com.vn', 'gov.vn'],
  },
  createdAt: new Date().toISOString(),
  lastActive: new Date().toISOString(),
};

const CUSTOM_EVENT_PROFILE_CHANGE = 'iis_profile_changed';

export function notifyProfileChanged() {
  window.dispatchEvent(new Event(CUSTOM_EVENT_PROFILE_CHANGE));
}

export function subscribeUserProfile(callback: (profile: UserProfile) => void) {
  const handler = () => {
    callback(getUserProfile());
  };
  window.addEventListener('storage', handler);
  window.addEventListener(CUSTOM_EVENT_PROFILE_CHANGE, handler);
  return () => {
    window.removeEventListener('storage', handler);
    window.removeEventListener(CUSTOM_EVENT_PROFILE_CHANGE, handler);
  };
}

export function initUserProfileFromFirebase(fbUser: { uid: string; email?: string | null; displayName?: string | null }): UserProfile {
  const currentRaw = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
  if (currentRaw) {
    try {
      const parsed = JSON.parse(currentRaw);
      if (parsed.uid === fbUser.uid) {
        notifyProfileChanged();
        return parsed;
      }
    } catch (e) {
      console.error(e);
    }
  }

  const email = fbUser.email || '';
  const name = fbUser.displayName || email.split('@')[0] || 'Chiến Binh Mạng';
  const newProfile: UserProfile = {
    uid: fbUser.uid,
    email: email,
    displayName: name,
    trustScore: 85,
    antibodyLevel: 6,
    antibodyTitle: 'Chuyên Gia Cảnh Báo Đỏ',
    badges: ['first_scan', 'phishing_expert', 'vaccine_certified'],
    totalScans: 0,
    threatsBlocked: 0,
    vaccineHash: `IIS-VN-${fbUser.uid.substring(0, 6).toUpperCase()}`,
    settings: {
      alertsEnabled: true,
      autoBlock: true,
      language: 'vi',
      sensitivity: 'balanced',
      realtimeExtensionShield: true,
      trustedDomains: ['google.com', 'vietcombank.com.vn', 'gov.vn'],
    },
    createdAt: new Date().toISOString(),
    lastActive: new Date().toISOString(),
  };

  localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(newProfile));
  window.dispatchEvent(new Event('storage'));
  notifyProfileChanged();
  return newProfile;
}

export function clearUserDataOnLogout() {
  localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
  localStorage.removeItem(STORAGE_KEYS.SCAN_HISTORY);
  window.dispatchEvent(new Event('storage'));
  notifyProfileChanged();
}

const SAMPLE_SCANS: ScanResult[] = [
  {
    scanId: 'sr_v1_001',
    inputType: 'url',
    inputValue: 'http://vietcombank-secure-login.ph/dang-nhap',
    sanitizedValue: 'http://vietcombank-secure-login.ph/dang-nhap',
    piiRedactedCount: 0,
    riskScore: 92,
    classification: 'phishing',
    confidence: 0.96,
    geminiExplanation: 'Domain vietcombank-secure-login.ph không phải tên miền chính thức của Vietcombank. Trang web có biểu mẫu giả mạo giao diện thu thập mật khẩu và mã OTP ngân hàng.',
    redFlags: [
      {
        id: 'fake_domain',
        label: 'Giả Mạo Tên Miền (Lookalike Domain)',
        severity: 'critical',
        description: 'Tên miền sử dụng đuôi .ph (Philippines) thay vì domain chính thức .com.vn của Vietcombank.',
      },
      {
        id: 'no_https',
        label: 'Không Có Mã Hóa SSL/HTTPS',
        severity: 'high',
        description: 'Kết nối HTTP không an toàn, dữ liệu mật khẩu bị truyền đi dạng văn bản thuần.',
      },
      {
        id: 'urgency_cue',
        label: 'Thao Túng Cảm Xúc Áp Lực',
        severity: 'medium',
        description: 'Nội dung đe dọa khóa tài khoản trong 2 giờ nếu không nhập mã xác thực.',
      },
    ],
    actionRecommendation: 'BLOCK',
    detectionSource: 'ai',
    modelUsed: 'gemini-2.5-flash',
    processingMs: 820,
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    simulationId: 'sim_v1_001',
  },
  {
    scanId: 'sr_v1_002',
    inputType: 'text',
    inputValue: '[Techbank]: Tai khoan 0901234567 vua bi khoi tao lenh rut 50.000.000 VND tai Ha Noi. Truy cap ngay http://techbank-verify.net/xacthuc de huy.',
    sanitizedValue: '[Techbank]: Tai khoan [SĐT_REDACTED] vua bi khoi tao lenh rut 50.000.000 VND tai Ha Noi. Truy cap ngay http://techbank-verify.net/xacthuc de huy.',
    piiRedactedCount: 1,
    riskScore: 88,
    classification: 'scam',
    confidence: 0.94,
    geminiExplanation: 'Tin nhắn giả mạo thương hiệu ngân hàng gửi thông báo giao dịch giả nhằm kích thích tâm lý sợ hãi, dẫn dụ nạn nhân bấm link độc hại.',
    redFlags: [
      {
        id: 'fake_brand_sms',
        label: 'Mạo Danh Ngân Hàng Qua SMS',
        severity: 'critical',
        description: 'Sử dụng thương hiệu Techbank giả mạo trỏ về link không chính thống techbank-verify.net.',
      },
      {
        id: 'urgency_fear',
        label: 'Tạo Sợ Hãi Mất Tiền Khẩn Cấp',
        severity: 'high',
        description: 'Thông báo giao dịch rút tiền rủi ro lớn để làm nạn nhân hoảng loạn.',
      },
    ],
    actionRecommendation: 'BLOCK',
    detectionSource: 'ai',
    modelUsed: 'gemini-2.5-flash',
    processingMs: 950,
    timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    scanId: 'sr_v1_003',
    inputType: 'url',
    inputValue: 'https://vtv.vn/xa-hoi/canh-bao-chuyen-nham-tien-de-lua-dao-cac-thu-thuat-moi-2026.htm',
    sanitizedValue: 'https://vtv.vn/xa-hoi/canh-bao-chuyen-nham-tien-de-lua-dao-cac-thu-thuat-moi-2026.htm',
    piiRedactedCount: 0,
    riskScore: 5,
    classification: 'safe',
    confidence: 0.99,
    geminiExplanation: 'Liên kết chính thức từ Đài Truyền hình Việt Nam (vtv.vn). Nội dung là bài báo tin tức cảnh báo an toàn thông tin.',
    redFlags: [],
    actionRecommendation: 'ALLOW',
    detectionSource: 'ai',
    modelUsed: 'gemini-2.5-flash',
    processingMs: 410,
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
];

const SAMPLE_REPORTS: CommunityReport[] = [
  {
    reportId: 'rep_v1_001',
    reporterUid: 'user_v1_local',
    reporterName: 'Lê Kim Dũng',
    entityType: 'URL',
    entityValue: 'http://vietcombank-secure-login.ph',
    description: 'Trang web mạo danh Vietcombank gửi qua SMS chứa đường link độc hại đánh cắp tài khoản.',
    status: 'verified',
    riskLevel: 'critical',
    verifiedCount: 142,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    reportId: 'rep_v1_002',
    reporterUid: 'user_v1_02',
    reporterName: 'Trần Hoàng Nam',
    entityType: 'PHONE',
    entityValue: '0901 829 381',
    description: 'Số điện thoại tự xưng cán bộ Cục Thuế yêu cầu cài app Dịch Vụ Công giả mạo .apk.',
    status: 'verified',
    riskLevel: 'critical',
    verifiedCount: 89,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    reportId: 'rep_v1_003',
    reporterUid: 'user_v1_03',
    reporterName: 'Nguyễn Thị Mai',
    entityType: 'BANK_ACCOUNT',
    entityValue: '1039829102 (MB Bank - NGUYEN VAN SCAM)',
    description: 'STK dùng trong trò lừa đảo tuyển CTV chốt đơn Shopee hoa hồng 20%.',
    status: 'verified',
    riskLevel: 'high',
    verifiedCount: 56,
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
];

export function getUserProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.uid && parsed.uid !== 'guest') {
        const rank = getAntibodyRank(parsed.trustScore || 0);
        return {
          ...parsed,
          antibodyLevel: rank.level,
          antibodyTitle: rank.title,
        };
      }
    }
  } catch (e) {
    console.error('Error loading user profile:', e);
  }
  return GUEST_USER;
}

export function updateUserProfile(updates: Partial<UserProfile>): UserProfile {
  const current = getUserProfile();
  const nextScore = updates.trustScore !== undefined ? Math.min(100, Math.max(0, updates.trustScore)) : current.trustScore;
  const rank = getAntibodyRank(nextScore);

  const updated: UserProfile = {
    ...current,
    ...updates,
    trustScore: nextScore,
    antibodyLevel: rank.level,
    antibodyTitle: rank.title,
    lastActive: new Date().toISOString(),
  };

  try {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving user profile:', e);
  }
  notifyProfileChanged();
  return updated;
}

export function getScanHistory(): ScanResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SCAN_HISTORY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error loading scan history:', e);
  }
  return [];
}

export function saveScanResult(result: ScanResult): ScanResult[] {
  const history = getScanHistory();
  const updated = [result, ...history.filter((s) => s.scanId !== result.scanId)];
  try {
    localStorage.setItem(STORAGE_KEYS.SCAN_HISTORY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving scan result:', e);
  }

  // Update user stats
  const profile = getUserProfile();
  const isThreat = result.classification !== 'safe';
  updateUserProfile({
    totalScans: profile.totalScans + 1,
    threatsBlocked: isThreat ? profile.threatsBlocked + 1 : profile.threatsBlocked,
  });

  return updated;
}

export function getCommunityReports(): CommunityReport[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COMMUNITY_REPORTS);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error loading community reports:', e);
  }
  return SAMPLE_REPORTS;
}

export function addCommunityReport(report: Omit<CommunityReport, 'reportId' | 'createdAt' | 'status' | 'verifiedCount'>): CommunityReport {
  const reports = getCommunityReports();
  const newReport: CommunityReport = {
    ...report,
    reportId: `rep_${Date.now()}`,
    status: 'verified',
    verifiedCount: 1,
    createdAt: new Date().toISOString(),
  };
  const updated = [newReport, ...reports];
  try {
    localStorage.setItem(STORAGE_KEYS.COMMUNITY_REPORTS, JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving community report:', e);
  }

  // Boost trust score for reporting
  const profile = getUserProfile();
  updateUserProfile({
    trustScore: Math.min(100, profile.trustScore + 3),
  });

  return newReport;
}

export function unlockBadge(badgeId: string): UserProfile {
  const profile = getUserProfile();
  if (!profile.badges.includes(badgeId)) {
    const updatedBadges = [...profile.badges, badgeId];
    return updateUserProfile({
      badges: updatedBadges,
      trustScore: Math.min(100, profile.trustScore + 5),
    });
  }
  return profile;
}

export function createStandardEnvelope<T>(data: T | null, error: any = null, processingMs = 350): StandardEnvelope<T> {
  return {
    status: error ? 'error' : 'success',
    data,
    error: error
      ? {
          code: error.code || 'INTERNAL_ERROR',
          message: error.message || 'Đã xảy ra lỗi hệ thống.',
          details: error.details,
        }
      : null,
    meta: {
      requestId: `req_${Math.random().toString(36).substring(2, 10)}`,
      timestamp: new Date().toISOString(),
      processingMs,
    },
  };
}
