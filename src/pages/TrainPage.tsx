/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { runTrainingGenerator } from '../lib/gemini';
import { getUserProfile, updateUserProfile, unlockBadge, getAntibodyRank } from '../lib/storage';
import { TrainingSession } from '../types';
import { BookOpen, Award, CheckCircle2, XCircle, ArrowLeft, RefreshCw, Zap, ShieldCheck } from 'lucide-react';

interface TrainPageProps {
  onNavigate: (path: string) => void;
  addToast: (type: 'success' | 'error' | 'warning' | 'threat', title: string, desc?: string) => void;
}

export const TrainPage: React.FC<TrainPageProps> = ({ onNavigate, addToast }) => {
  const [user, setUser] = useState(getUserProfile());
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [scenarioType, setScenarioType] = useState<TrainingSession['scenarioType']>('phishing_email');
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<TrainingSession | null>(null);
  const [userAnswers, setUserAnswers] = useState<number[]>([-1, -1, -1]);
  const [submitted, setSubmitted] = useState(false);

  const rank = getAntibodyRank(user.trustScore);

  const handleStartDrill = async () => {
    setLoading(true);
    setSubmitted(false);
    setUserAnswers([-1, -1, -1]);
    addToast('warning', 'Đang Khởi Tạo Đợt Diễn Tập...', 'TrainingAgent đang sinh kịch bản vắc-xin số thích ứng...');

    try {
      const res = await runTrainingGenerator(difficulty, scenarioType);
      setSession(res);
      setLoading(false);
      addToast('success', '✅ Đã Sẵn Sàng Diễn Tập!', 'Đọc kịch bản giả lập và trả lời 3 câu hỏi trắc nghiệm.');
    } catch (e: any) {
      setLoading(false);
      addToast('error', 'Lỗi Khởi Tạo', e.message || 'Vui lòng thử lại.');
    }
  };

  const handleSelectOption = (questionIdx: number, optionIndex: number) => {
    if (submitted) return;
    const next = [...userAnswers];
    next[questionIdx] = optionIndex;
    setUserAnswers(next);
  };

  const handleSubmitDrill = () => {
    if (!session) return;
    
    let correctCount = 0;
    session.questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctIndex) {
        correctCount += 1;
      }
    });

    const calculatedScore = Math.round((correctCount / 3) * 100);
    const trustBoost = correctCount === 3 ? 10 : correctCount === 2 ? 5 : 2;

    setSubmitted(true);

    // Boost trust score
    const updated = updateUserProfile({
      trustScore: Math.min(100, user.trustScore + trustBoost),
    });
    setUser(updated);

    if (calculatedScore === 100) {
      unlockBadge('perfect_drill');
      addToast(
        'success',
        `🎉 XUẤT SẮC! Điểm 100/100 (+${trustBoost} Điểm Miễn Dịch)`,
        'Bạn đã nhận được huy hiệu "Kháng Thể Hoàn Hảo"!'
      );
    } else {
      addToast(
        'warning',
        `Kết Quả Diễn Tập: ${calculatedScore}/100 (+${trustBoost} Điểm)`,
        'Đọc lời giải thích bên dưới để rút kinh nghiệm cho đợt sau.'
      );
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      
      {/* Header */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('/')}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-extrabold text-2xl text-white tracking-tight">
                Luyện Tập Kháng Thể (Train Mode - Vaccine Drills)
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/40 rounded">
                Gemini 2.5 Pro
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Diễn Tập Vắc-xin Số Chống Lừa Đảo Thích Ứng · Tăng Điểm Trust Score & Mở Khóa Huy Hiệu
            </p>
          </div>
        </div>

        {/* User Rank Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 font-mono text-xs text-emerald-300">
          <Award className="w-4 h-4 text-emerald-400" />
          <span>Level {rank.level}: {rank.title}</span>
        </div>
      </div>

      {/* Drill Config Form */}
      <div className="p-6 rounded-2xl bg-[#111827] border border-emerald-500/30 space-y-4 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Scenario Type */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-400">Loại Kịch Bản Diễn Tập:</label>
            <select
              value={scenarioType}
              onChange={(e) => setScenarioType(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
            >
              <option value="phishing_email">📧 Email Phishing Giả Mạo Ngân Hàng</option>
              <option value="fake_sms">💬 SMS Brandname Rút Tiền Độc Hại</option>
              <option value="fake_site">🌐 Website Giả Mạo Dịch Vụ Công/Thuế</option>
              <option value="investment_scam">📈 Lừa Đảo Đầu Tư Lãi Cao 300%</option>
              <option value="romance_scam">💘 Lừa Đảo Tình Cảm & Chuyển Quà</option>
            </select>
          </div>

          {/* Difficulty */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-400">Mức Độ Thách Thức:</label>
            <div className="flex gap-2">
              {(['easy', 'medium', 'hard'] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDifficulty(d)}
                  className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold capitalize transition-all ${
                    difficulty === d
                      ? 'bg-emerald-500 text-black shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  {d === 'easy' ? 'Dễ' : d === 'medium' ? 'Vừa' : 'Khó'}
                </button>
              ))}
            </div>
          </div>

        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleStartDrill}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-display font-bold text-sm transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-black" />
                <span>AI Đang Sinh Kịch Bản Vắc-xin...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-black" />
                <span>Bắt Đầu Đợt Diễn Tập</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Drill Active Session View */}
      {session && !loading && (
        <div className="p-6 rounded-2xl bg-[#090E1A] border border-emerald-500/50 space-y-6 shadow-[0_0_50px_rgba(16,185,129,0.2)] animate-fadeIn">
          
          {/* Scenario Content Box */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between text-emerald-400 font-bold border-b border-slate-900 pb-2">
              <span>KỊCH BẢN GIẢ LẬP: {session.scenarioBrand}</span>
              <span className="uppercase text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                {session.difficulty}
              </span>
            </div>
            <p className="text-slate-200 leading-relaxed text-sm p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
              {session.scenarioContent}
            </p>
          </div>

          {/* 3 Questions Form */}
          <div className="space-y-6">
            <h3 className="font-bold text-sm text-white font-mono flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>Trả Lời 3 Câu Hỏi Nhận Diện Dấu Hiệu Lừa Đảo:</span>
            </h3>

            {session.questions.map((q, qIdx) => (
              <div key={q.questionId} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                <h4 className="font-bold text-sm text-cyan-300 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 flex items-center justify-center text-xs font-mono">
                    0{qIdx + 1}
                  </span>
                  <span>{q.question}</span>
                </h4>

                <div className="grid grid-cols-1 gap-2 pl-8">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = userAnswers[qIdx] === optIdx;
                    const isCorrect = q.correctIndex === optIdx;

                    let btnStyle = 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800';
                    if (submitted) {
                      if (isCorrect) btnStyle = 'bg-emerald-950/90 border-emerald-500 text-emerald-300 font-bold';
                      else if (isSelected && !isCorrect) btnStyle = 'bg-rose-950/90 border-rose-500 text-rose-300';
                    } else if (isSelected) {
                      btnStyle = 'bg-cyan-950 border-cyan-500 text-cyan-200 font-bold shadow-[0_0_12px_rgba(6,182,212,0.3)]';
                    }

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleSelectOption(qIdx, optIdx)}
                        className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between gap-2 ${btnStyle}`}
                      >
                        <span>{opt}</span>
                        {submitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
                        {submitted && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* Question Explanation after submit */}
                {submitted && (
                  <div className="pl-8 pt-2 text-xs font-mono text-cyan-300 italic border-t border-slate-800/80">
                    💡 Giải thích: {q.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800 flex-wrap gap-3">
            <span className="text-xs font-mono text-slate-500">Thưởng đợt này: +10 Điểm Trust Score max</span>
            
            {!submitted ? (
              <button
                onClick={handleSubmitDrill}
                disabled={userAnswers.includes(-1)}
                className={`px-8 py-2.5 rounded-xl font-display font-bold text-sm text-black transition-all ${
                  userAnswers.includes(-1)
                    ? 'bg-slate-700 text-slate-400 opacity-50 cursor-not-allowed'
                    : 'bg-emerald-400 hover:bg-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.4)] cursor-pointer'
                }`}
              >
                Nộp Bài Diễn Tập
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> Đã ghi nhận điểm Trust Score!
                </span>
                <button
                  onClick={handleStartDrill}
                  className="px-6 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-bold text-sm"
                >
                  Làm Đợt Tiếp Theo
                </button>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
