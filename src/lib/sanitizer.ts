/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SanitizerResult {
  sanitizedText: string;
  redactedCount: number;
  redactedItems: {
    type: 'CCCD' | 'PHONE' | 'EMAIL' | 'BANK_ACC';
    original: string;
    masked: string;
  }[];
}

export function sanitizePII(text: string): SanitizerResult {
  if (!text) {
    return { sanitizedText: '', redactedCount: 0, redactedItems: [] };
  }

  let sanitized = text;
  const redactedItems: SanitizerResult['redactedItems'] = [];

  // 1. Email pattern
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  sanitized = sanitized.replace(emailRegex, (match) => {
    const masked = '[EMAIL_REDACTED]';
    redactedItems.push({ type: 'EMAIL', original: match, masked });
    return masked;
  });

  // 2. Vietnam Phone Numbers (e.g., 0901234567, 038 123 4567, +84901234567)
  const phoneRegex = /(?:\+84|84|0)(?:3|5|7|8|9)(?:[.\s-]?\d){8}\b/g;
  sanitized = sanitized.replace(phoneRegex, (match) => {
    const masked = '[SĐT_REDACTED]';
    redactedItems.push({ type: 'PHONE', original: match, masked });
    return masked;
  });

  // 3. CCCD / CMND (9 or 12 digits)
  const cccdRegex = /\b\d{12}\b|\b\d{9}\b/g;
  sanitized = sanitized.replace(cccdRegex, (match) => {
    // Avoid masking timestamps or simple numbers if not standalone ID-like
    if (match.startsWith('0') || match.length === 12) {
      const masked = '[CCCD_REDACTED]';
      redactedItems.push({ type: 'CCCD', original: match, masked });
      return masked;
    }
    return match;
  });

  // 4. Bank Account / Credit Card numbers (10 to 16 digits)
  const bankAccRegex = /\b\d{10,16}\b/g;
  sanitized = sanitized.replace(bankAccRegex, (match) => {
    const masked = '[STK_REDACTED]';
    redactedItems.push({ type: 'BANK_ACC', original: match, masked });
    return masked;
  });

  return {
    sanitizedText: sanitized,
    redactedCount: redactedItems.length,
    redactedItems,
  };
}
