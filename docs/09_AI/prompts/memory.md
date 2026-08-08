# 🧠 MEMORY PROMPT LIBRARY
### Agent: MemoryAgent | Model: No Gemini call | Version: v1.0.0-FROZEN
### Source: [AgentArchitecture.md](../../10_Agent/AgentArchitecture.md)

> MemoryAgent does NOT call Gemini. It is a stateful data service.
> This file documents the data schemas, caching strategies, trust score logic,
> and context injection templates used to personalize other agents.

---

## Overview

MemoryAgent provides **user context** to all other agents, enabling:
- **Personalization** — adapt response complexity to trust score
- **Deduplication** — skip redundant scans (same content in last hour)
- **Pattern detection** — identify users being targeted repeatedly
- **Trust evolution** — update immunity score based on user learning

---

## Context Schema

```typescript
interface MemoryContext {
  // Identity
  uid:                      string
  trustScore:               number      // 0–100
  antibodyLevel:            number      // 1–10

  // Behavioral context (last 24 hours)
  recentThreatsInLastHour:  number      // threats encountered this hour
  recentScansLast24h:       number      // total scans in 24h
  mostCommonThreatType:     string | null  // 'phishing' | 'scam' | etc.
  hasSeenSimilarDomain:     boolean     // is this domain pattern familiar to this user?

  // Preferences
  userSensitivity:          'strict' | 'balanced' | 'lenient'
  trustedDomains:           string[]   // user-whitelisted domains
  language:                 'vi' | 'en'
  autoBlock:                boolean

  // Learning state
  seenTipIds:               string[]   // which educational tips user has already seen
  seenScenarioTypes:        string[]   // which training scenario types recently shown
  lastTrainingAt:           Date | null
  consecutivePerfectDrills: number     // for badge calculation

  // Session (per-request only, not persisted)
  currentScanId?:           string
  currentChain?:            string[]   // [scanId, simulationId, explanationId]
}
```

---

## Context Injection Template

> This template is injected into other agents' prompts when memory context is available.

```
── MEMORY CONTEXT ─────────────────────────────────────────────────
User Trust Level: {{trust_score}}/100 (Antibody Level {{antibody_level}})
Sensitivity Setting: {{sensitivity}}
Threats encountered this hour: {{threats_in_last_hour}}
User has seen similar domain before: {{has_seen_similar_domain}}
Recommended explanation depth: {{depth_recommendation}}

{{#if (gte trust_score 70)}}
CALIBRATE: User is experienced. Use technical language. Include attack chain detail.
{{else if (gte trust_score 40)}}
CALIBRATE: User is learning. Explain mechanism briefly with consequence.
{{else}}
CALIBRATE: User is beginner. Use simple language. Focus on 1-2 key actions only.
{{/if}}

{{#if (gt threats_in_last_hour 3)}}
NOTE: User is being actively targeted ({{threats_in_last_hour}} threats this hour).
Emphasize: they may be in an active phishing campaign. Recommend extra caution.
{{/if}}
───────────────────────────────────────────────────────────────────
```

---

## Caching Strategy

### Layer 1: In-Memory LRU Cache

```typescript
import LRUCache from 'lru-cache'

const contextCache = new LRUCache<string, MemoryContext>({
  max: 1000,           // max 1000 users per Cloud Run instance
  ttl: 5 * 60 * 1000, // 5 minutes TTL
})

// Key: uid
// Invalidate on: trust_score update, settings change, login event
```

### Layer 2: Firestore (Persistent)

```typescript
// Read path (on cache miss):
const [userDoc, recentScansSnap] = await Promise.all([
  firestore.doc(`users/${uid}`).get(),
  firestore.collection('scan_results')
    .where('uid', '==', uid)
    .where('timestamp', '>=', Timestamp.fromDate(new Date(Date.now() - 86_400_000)))
    .orderBy('timestamp', 'desc')
    .limit(20)
    .get()
])
```

### Layer 3: Session Memory (Per-request, not persisted)

```typescript
// Key: requestId (from X-Request-ID header)
const sessionMap = new Map<string, SessionState>()

interface SessionState {
  uid:          string
  scanId?:      string
  simulationId?: string
  explanationId?: string
  startedAt:    number
}

// Auto-clear after 10 minutes (request lifecycle)
setTimeout(() => sessionMap.delete(requestId), 600_000)
```

---

## Trust Score Engine

### Score Update Rules

```typescript
// packages/agents/src/services/trust-score.service.ts

enum TrustDelta {
  SCAN_COMPLETED         = 1,   // any scan done
  THREAT_WARNED          = 2,   // system warned, user acknowledged
  TRAINING_COMPLETED     = 3,   // finished training drill
  TRAINING_PERFECT       = 5,   // 100% score
  COMMUNITY_REPORT       = 3,   // submitted report (before verification)
  COMMUNITY_REPORT_VERIFIED = 5,  // report verified by admin
  COMMUNITY_FALSE_REPORT = -3,  // report rejected (anti-abuse)
  EXPLAINED_THREAT       = 2,   // read full explanation
  SIMULATION_WATCHED     = 2,   // watched consequence simulation
  CONSECUTIVE_PERFECT    = 8,   // 3 perfect drills in a row
}

async function applyTrustDelta(
  uid: string,
  delta: TrustDelta,
  reason: keyof typeof TrustDelta
): Promise<{ newScore: number; levelUp: boolean }> {

  // Rule: max ±10 per operation from client (anti-cheat)
  const clampedDelta = Math.min(Math.max(delta, -10), 10)

  // Atomic update
  const ref = firestore.doc(`users/${uid}`)
  await ref.update({
    trust_score: FieldValue.increment(clampedDelta),
    last_active: FieldValue.serverTimestamp(),
  })

  // Read new value
  const updatedDoc = await ref.get()
  const newScore = Math.min(100, Math.max(0, (updatedDoc.data() as UserDocument).trust_score))

  // Ensure clamped in Firestore too
  if (newScore < 0 || newScore > 100) {
    await ref.update({ trust_score: newScore })
  }

  const oldLevel = calculateAntibodyLevel(newScore - clampedDelta)
  const newLevel = calculateAntibodyLevel(newScore)
  const levelUp = newLevel > oldLevel

  // Invalidate cache
  contextCache.delete(uid)

  // Level up notification (async)
  if (levelUp) {
    notificationService.send(uid, 'badge_earned', {
      title: `🛡️ Lên cấp Kháng Thể ${newLevel}!`,
      body: `Điểm miễn dịch của bạn đã đạt ${newScore}. Hệ thống bảo vệ được nâng cấp.`,
      actionUrl: '/profile#antibody',
    }).catch(() => {})
  }

  logger.info('Trust score updated', { uid, delta: clampedDelta, reason, newScore, levelUp })
  return { newScore, levelUp }
}
```

### Antibody Level Mapping

```typescript
function calculateAntibodyLevel(score: number): number {
  if (score < 10)  return 1   // 0–9:    Immune System Awakening
  if (score < 20)  return 2   // 10–19:  Basic Defense Active
  if (score < 35)  return 3   // 20–34:  Phishing Awareness
  if (score < 50)  return 4   // 35–49:  Scam Detector
  if (score < 65)  return 5   // 50–64:  Threat Identifier
  if (score < 75)  return 6   // 65–74:  Red Flag Expert
  if (score < 82)  return 7   // 75–81:  Community Guardian
  if (score < 89)  return 8   // 82–88:  Fraud Analyst
  if (score < 95)  return 9   // 89–94:  Immune System Champion
  return 10                   // 95–100: Internet Immune Legend
}

// Level display names
const LEVEL_NAMES: Record<number, string> = {
  1:  'Hệ Thống Thức Tỉnh',
  2:  'Phòng Thủ Cơ Bản',
  3:  'Nhận Thức Phishing',
  4:  'Phát Hiện Lừa Đảo',
  5:  'Xác Định Mối Đe Dọa',
  6:  'Chuyên Gia Cảnh Báo Đỏ',
  7:  'Người Bảo Vệ Cộng Đồng',
  8:  'Chuyên Gia Phân Tích Gian Lận',
  9:  'Vô Địch Hệ Miễn Dịch',
  10: 'Huyền Thoại Internet Immune',
}
```

---

## Badge System

### Badge Definitions

```typescript
interface Badge {
  id:          string
  name:        string
  description: string
  icon:        string
  trigger:     BadgeTrigger
}

type BadgeTrigger =
  | { type: 'first_action'; action: string }
  | { type: 'count'; field: string; threshold: number }
  | { type: 'score'; field: string; threshold: number }
  | { type: 'streak'; count: number }

const BADGES: Badge[] = [
  {
    id: 'first_scan_v1',
    name: 'First Scan',
    description: 'Thực hiện lần quét đầu tiên',
    icon: '🔍',
    trigger: { type: 'first_action', action: 'scan' }
  },
  {
    id: 'phishing_awareness_v1',
    name: 'Phishing Awareness',
    description: 'Nhận diện chính xác tấn công phishing đầu tiên',
    icon: '🛡️',
    trigger: { type: 'first_action', action: 'identify_phishing' }
  },
  {
    id: 'perfect_drill_v1',
    name: 'Perfect Drill',
    description: 'Đạt điểm tuyệt đối trong một buổi luyện tập',
    icon: '🎯',
    trigger: { type: 'score', field: 'training_score', threshold: 100 }
  },
  {
    id: 'community_reporter_v1',
    name: 'Community Reporter',
    description: 'Gửi báo cáo lừa đảo đầu tiên được xác minh',
    icon: '📣',
    trigger: { type: 'first_action', action: 'verified_report' }
  },
  {
    id: 'community_guardian_v1',
    name: 'Community Guardian',
    description: 'Gửi 10 báo cáo được xác minh',
    icon: '🏆',
    trigger: { type: 'count', field: 'verified_reports', threshold: 10 }
  },
  {
    id: 'threat_blocker_v1',
    name: 'Threat Blocker',
    description: 'Chặn 50 mối đe dọa thành công',
    icon: '⚔️',
    trigger: { type: 'count', field: 'threats_blocked', threshold: 50 }
  },
  {
    id: 'immune_legend_v1',
    name: 'Internet Immune Legend',
    description: 'Đạt điểm miễn dịch 100 — Huyền thoại!',
    icon: '🌟',
    trigger: { type: 'score', field: 'trust_score', threshold: 100 }
  },
  {
    id: 'drill_streak_v1',
    name: 'Training Streak',
    description: 'Hoàn thành 3 bài drill hoàn hảo liên tiếp',
    icon: '🔥',
    trigger: { type: 'streak', count: 3 }
  },
]
```

### Badge Award Logic
```typescript
async function checkAndAwardBadges(
  uid: string,
  event: { action: string; data: Record<string, number> }
): Promise<Badge[]> {
  const user = await getUserDoc(uid)
  const earned: Badge[] = []

  for (const badge of BADGES) {
    if (user.badges.includes(badge.id)) continue  // already earned

    let qualify = false
    const t = badge.trigger

    if (t.type === 'first_action' && event.action === t.action) qualify = true
    if (t.type === 'count' && (event.data[t.field] ?? 0) >= t.threshold) qualify = true
    if (t.type === 'score' && (event.data[t.field] ?? 0) >= t.threshold) qualify = true
    if (t.type === 'streak' && user.consecutivePerfectDrills >= t.count) qualify = true

    if (qualify) {
      await firestore.doc(`users/${uid}`).update({
        badges: FieldValue.arrayUnion(badge.id)
      })
      earned.push(badge)
      await notificationService.send(uid, 'badge_earned', {
        title: `🎉 Huy hiệu mới: ${badge.name}!`,
        body: badge.description,
        data: { badgeId: badge.id },
        actionUrl: '/profile#badges',
      })
    }
  }

  return earned
}
```

---

## System Prompt (None — MemoryAgent is not an AI agent)

> MemoryAgent does NOT use Gemini. It has no system prompt.
> All operations are pure TypeScript data access (Firestore + in-memory cache).

---

## Fallback Strategy

```typescript
// If Firestore read fails → return minimal context with safe defaults
const FALLBACK_CONTEXT: MemoryContext = {
  uid: input.uid,
  trustScore: 50,
  antibodyLevel: 3,
  recentThreatsInLastHour: 0,
  recentScansLast24h: 0,
  mostCommonThreatType: null,
  hasSeenSimilarDomain: false,
  userSensitivity: 'balanced',
  trustedDomains: [],
  language: 'vi',
  autoBlock: false,
  seenTipIds: [],
  seenScenarioTypes: [],
  lastTrainingAt: null,
  consecutivePerfectDrills: 0,
}

// Coordinator uses this fallback gracefully — never blocks main request
// Memory failure is logged but does not fail the scan
```

---

## Guardrails

```typescript
// GUARDRAIL 1: trust_score always 0–100
function clampTrustScore(score: number): number {
  return Math.min(100, Math.max(0, Math.round(score)))
}

// GUARDRAIL 2: antibody_level always 1–10
function validateAntibodyLevel(level: number): number {
  return Math.min(10, Math.max(1, level))
}

// GUARDRAIL 3: never decrement trust_score below 0
async function safeDecrement(uid: string, delta: number): Promise<void> {
  const user = await getUserDoc(uid)
  if (user.trust_score + delta < 0) {
    await firestore.doc(`users/${uid}`).update({ trust_score: 0 })
  } else {
    await firestore.doc(`users/${uid}`).update({
      trust_score: FieldValue.increment(delta)
    })
  }
}

// GUARDRAIL 4: seenScenarioTypes max 10 items (circular)
function updateScenarioHistory(existing: string[], newType: string): string[] {
  return [...existing.slice(-9), newType]  // keep last 10
}
```

### Version History
| Version | Date | Change |
|---|---|---|
| v1.0.0-FROZEN | 2026-08-02 | Initial. Trust engine. Badge system. Multi-layer cache. |
