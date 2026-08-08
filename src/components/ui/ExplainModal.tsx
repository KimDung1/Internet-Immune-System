/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { ScanResult, ExplanationResult } from '../../types';
import { runReasoningExplain, askAiExplanationQuestion } from '../../lib/gemini';
import {
  BookOpen,
  AlertTriangle,
  ShieldCheck,
  PhoneCall,
  Award,
  X,
  Zap,
  Volume2,
  VolumeX,
  MessageSquare,
  Share2,
  Copy,
  Check,
  BrainCircuit,
  Cpu,
  CheckCircle,
  Send,
  HelpCircle,
  Sparkles
} from 'lucide-react';

interface ExplainModalProps {
  scan: ScanResult | null;
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  time: string;
}

export const ExplainModal: React.FC<ExplainModalProps> = ({ scan, isOpen, onClose }) => {
  const [explanation, setExplanation] = useState<ExplanationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'deep' | 'chat'>('overview');

  // TTS Speech Synthesis State
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Chat Q&A State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [isAiAnswering, setIsAiAnswering] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Copy state
  const [copiedWarning, setCopiedWarning] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (isOpen && scan) {
      setLoading(true);
      setActiveTab('overview');
      setChatMessages([]);
      setIsSpeaking(false);
      window.speechSynthesis?.cancel();

      runReasoningExplain(scan).then((res) => {
        if (isMounted) {
          setExplanation(res);
          setLoading(false);

          // Add initial AI greeting in Chat
          setChatMessages([
            {
              sender: 'ai',
              text: `Xin chào! Tôi là Trợ Lý AI Chuyên Gia An Ninh Mạng. Bạn có câu hỏi nào cần hỏi thêm về ${scan.inputType === 'bank' ? 'tài khoản' : scan.inputType === 'phone' ? 'số điện thoại' : 'đường link/tin nhắn'} này không?`,
              time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
            },
          ]);
        }
      });
    }

    return () => {
      isMounted = false;
      window.speechSynthesis?.cancel();
    };
  }, [isOpen, scan]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isAiAnswering]);

  if (!isOpen || !scan) return null;

  // Toggle Speech Synthesis
  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('Trình duyệt của bạn không hỗ trợ đọc giọng nói TTS.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else if (explanation) {
      window.speechSynthesis.cancel();
      const textToRead = `${explanation.aiNarrative}. Quy tắc vàng: ${explanation.educationalTip}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = 'vi-VN';
      utterance.rate = 0.95;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Copy Warning Text for Zalo/SMS
  const handleCopyWarning = () => {
    if (!explanation) return;
    const warningText = `🚨 CẢNH BÁO LỪA ĐẢO TỪ INTERNET IMMUNE SYSTEM 🚨\n\n` +
      `Mục tiêu nghi vấn: ${scan.sanitizedValue}\n` +
      `Đánh giá AI: ${scan.classification.toUpperCase()} (Độ rủi ro: ${scan.riskScore}/100)\n\n` +
      `Lý do: ${explanation.aiNarrative}\n\n` +
      `💡 Quy tắc an toàn: ${explanation.educationalTip}\n` +
      `👉 Vui lòng không bấm link / không chuyển tiền / không cung cấp mã OTP!`;

    navigator.clipboard.writeText(warningText);
    setCopiedWarning(true);
    setTimeout(() => setCopiedWarning(false), 2500);
  };

  // Send Follow-up Chat Question
  const handleSendQuestion = async (questionText?: string) => {
    const q = questionText || inputQuestion.trim();
    if (!q || !explanation || isAiAnswering) return;

    const timeStr = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = { sender: 'user', text: q, time: timeStr };

    setChatMessages((prev) => [...prev, userMsg]);
    if (!questionText) setInputQuestion('');
    setIsAiAnswering(true);

    const ansText = await askAiExplanationQuestion(scan, explanation, q);
    const aiMsg: ChatMessage = {
      sender: 'ai',
      text: ansText,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, aiMsg]);
    setIsAiAnswering(false);
  };

  const sampleQuestions = [
    'Làm sao biết tên miền này không phải do ngân hàng sở hữu?',
    'Lỡ bấm vào link/chuyển tiền rồi thì tôi phải làm gì ngay?',
    'Số tài khoản ngân hàng này đã bị nhiều người báo cáo chưa?',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-3xl bg-[#0F172A] border border-cyan-500/40 rounded-2xl p-6 shadow-[0_0_60px_rgba(6,182,212,0.3)] text-white max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-950/90 border border-cyan-500/40 text-cyan-400">
              <BookOpen className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-lg text-white">
                  Phân Tích Chi Tiết AI (Explain Mode)
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                  GEMINI 2.5 REASONING
                </span>
              </div>
              <p className="text-xs text-slate-400">Bản Đồ Phân Tích Đa Chiều, Thủ Đoạn Tâm Lý & Hướng Dẫn Xử Lý</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Speech Button */}
            <button
              onClick={handleToggleSpeech}
              title={isSpeaking ? 'Dừng đọc giọng nói' : 'Đọc lời giải thích bằng giọng nói AI'}
              className={`p-2 rounded-xl border font-mono text-xs font-bold transition-all flex items-center gap-1.5 ${
                isSpeaking
                  ? 'bg-rose-950 text-rose-300 border-rose-500 animate-pulse'
                  : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
              <span className="hidden sm:inline">{isSpeaking ? 'Dừng Đọc' : 'Đọc Giọng Nói'}</span>
            </button>

            {/* Copy Warning Button */}
            <button
              onClick={handleCopyWarning}
              title="Sao chép lời cảnh báo để gửi Zalo/FB cho người thân"
              className="p-2 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900 font-mono text-xs font-bold transition-all flex items-center gap-1.5"
            >
              {copiedWarning ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span className="hidden sm:inline">{copiedWarning ? 'Đã Chép' : 'Chép Cảnh Báo'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation Header */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-4 font-mono text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>TỔNG QUAN & DẤU HIỆU</span>
          </button>

          <button
            onClick={() => setActiveTab('deep')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap ${
              activeTab === 'deep'
                ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <BrainCircuit className="w-4 h-4" />
            <span>THỦ ĐOẠN & KỸ THUẬT</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap ${
              activeTab === 'chat'
                ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>HỎI ĐÁP VỚI AI ({chatMessages.length - 1})</span>
          </button>
        </div>

        {/* Main Content Body */}
        <div className="flex-1 overflow-y-auto pr-1">
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center text-center space-y-3">
              <Zap className="w-10 h-10 text-cyan-400 animate-spin" />
              <p className="text-sm text-cyan-300 font-mono font-bold">
                ReasoningAgent Đang Phân Tích Đa Chiều Với Gemini 2.5...
              </p>
              <p className="text-xs text-slate-500 max-w-sm">
                Đang đối chiếu dữ liệu với ngân hàng dấu hiệu nhận biết lừa đảo an ninh mạng Việt Nam
              </p>
            </div>
          ) : (
            explanation && (
              <>
                {/* TAB 1: OVERVIEW */}
                {activeTab === 'overview' && (
                  <div className="space-y-5 text-sm">
                    {/* Target info Banner */}
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <span className="text-slate-500">Đối Tượng Quét:</span>{' '}
                        <span className="text-cyan-300 font-bold">{scan.sanitizedValue}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500">Phân loại:</span>
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-950 text-rose-300 border border-rose-500/40 uppercase">
                          {scan.classification} ({scan.riskScore}/100)
                        </span>
                      </div>
                    </div>

                    {/* AI Narrative */}
                    <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 space-y-2">
                      <h4 className="font-bold text-cyan-300 flex items-center gap-2 font-mono text-xs">
                        <Sparkles className="w-4 h-4 text-cyan-400" />
                        <span>TÓM TẮT ĐÁNH GIÁ TỪ TRỢ LÝ AI:</span>
                      </h4>
                      <p className="text-slate-100 leading-relaxed text-sm font-sans">{explanation.aiNarrative}</p>
                    </div>

                    {/* Red Flags Detailed Breakdown */}
                    {explanation.redFlagDetails && explanation.redFlagDetails.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-bold text-slate-200 uppercase text-xs tracking-wider font-mono flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4 text-rose-400" />
                          <span>Dấu Hiệu Bất Thường Quan Trọng ({explanation.redFlagDetails.length}):</span>
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {explanation.redFlagDetails.map((item, index) => (
                            <div key={index} className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-1.5">
                              <div className="flex items-center gap-1.5 font-bold text-rose-300 text-xs">
                                <AlertTriangle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                                <span>{item.label}</span>
                              </div>
                              <p className="text-slate-300 text-xs leading-relaxed">{item.explanation}</p>
                              <div className="text-[11px] text-cyan-300 pt-1 border-t border-rose-900/40 italic">
                                💡 Lời khuyên: {item.learnMore}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* What to do right now */}
                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5">
                      <h4 className="font-bold text-emerald-400 font-mono text-xs flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        <span>3 HÀNH ĐỘNG CẦN LÀM NGAY:</span>
                      </h4>
                      <ul className="space-y-2 text-slate-300 text-xs">
                        {explanation.whatToDo.map((act, i) => (
                          <li key={i} className="flex items-start gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                            <span className="font-bold text-emerald-400 font-mono">{i + 1}.</span>
                            <span>{act}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Educational Tip & Hotline */}
                    <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-200 text-xs space-y-2">
                      <div className="font-bold text-amber-400 font-mono flex items-center gap-2">
                        <span>🌟 Quy Tắc Vàng Tự Bảo Vệ:</span>
                      </div>
                      <p className="italic text-slate-200">{explanation.educationalTip}</p>
                      {explanation.hotline && (
                        <div className="pt-2 border-t border-amber-900/50 flex items-center gap-2 text-rose-400 font-bold font-mono">
                          <PhoneCall className="w-4 h-4" />
                          <span>{explanation.hotline}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 2: DEEP TACTICS & TECH */}
                {activeTab === 'deep' && (
                  <div className="space-y-5 text-sm">
                    {/* Psychological Tactics Breakdown */}
                    <div className="space-y-3">
                      <h4 className="font-bold text-amber-300 uppercase text-xs tracking-wider font-mono flex items-center gap-2">
                        <BrainCircuit className="w-4 h-4 text-amber-400" />
                        <span>Bẫy Lừa Đảo Tâm Lý Lợi Dụng (Psychological Tactics):</span>
                      </h4>
                      <div className="space-y-2.5">
                        {explanation.psychologicalTactics?.map((tac, idx) => (
                          <div key={idx} className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-1">
                            <div className="font-bold text-amber-300 text-xs font-mono">
                              🧠 {tac.tacticName}
                            </div>
                            <p className="text-slate-300 text-xs leading-relaxed">{tac.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Technical Risk Explanations */}
                    <div className="space-y-3">
                      <h4 className="font-bold text-cyan-300 uppercase text-xs tracking-wider font-mono flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-cyan-400" />
                        <span>Rủi Ro Kỹ Thuật Công Nghệ (Technical Risks):</span>
                      </h4>
                      <div className="space-y-2.5">
                        {explanation.technicalExplanations?.map((tech, idx) => (
                          <div key={idx} className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 space-y-1">
                            <div className="font-bold text-cyan-300 text-xs font-mono">
                              💻 {tech.feature}
                            </div>
                            <p className="text-slate-300 text-xs leading-relaxed">{tech.risk}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Official Verification Checklist */}
                    <div className="space-y-3">
                      <h4 className="font-bold text-emerald-300 uppercase text-xs tracking-wider font-mono flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>Cách Tự Kiểm Tra Tính Xác Thực Chính Chủ:</span>
                      </h4>
                      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs text-slate-300">
                        {explanation.officialVerificationSteps?.map((step, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: LIVE Q&A CHAT */}
                {activeTab === 'chat' && (
                  <div className="flex flex-col h-[400px]">
                    {/* Chat Messages List */}
                    <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-3">
                      {chatMessages.map((msg, idx) => (
                        <div
                          key={idx}
                          className={`flex flex-col ${
                            msg.sender === 'user' ? 'items-end' : 'items-start'
                          }`}
                        >
                          <div
                            className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                              msg.sender === 'user'
                                ? 'bg-cyan-500 text-black font-semibold rounded-br-none'
                                : 'bg-slate-900 border border-slate-700 text-slate-200 rounded-bl-none'
                            }`}
                          >
                            <p className="whitespace-pre-wrap">{msg.text}</p>
                            <span className={`block text-[10px] mt-1 text-right opacity-70 ${
                              msg.sender === 'user' ? 'text-black' : 'text-slate-400'
                            }`}>
                              {msg.time}
                            </span>
                          </div>
                        </div>
                      ))}

                      {isAiAnswering && (
                        <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono p-2">
                          <Zap className="w-4 h-4 animate-spin" />
                          <span>AI đang suy nghĩ câu trả lời...</span>
                        </div>
                      )}
                      <div ref={chatBottomRef} />
                    </div>

                    {/* Quick Suggestions */}
                    <div className="mb-2 flex items-center gap-1.5 overflow-x-auto text-[11px] font-mono pb-1">
                      <span className="text-slate-500 whitespace-nowrap">Gợi ý:</span>
                      {sampleQuestions.map((sq, i) => (
                        <button
                          key={i}
                          onClick={() => handleSendQuestion(sq)}
                          className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 whitespace-nowrap transition-all"
                        >
                          {sq}
                        </button>
                      ))}
                    </div>

                    {/* Chat Input */}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSendQuestion();
                      }}
                      className="flex items-center gap-2 pt-2 border-t border-slate-800"
                    >
                      <input
                        type="text"
                        value={inputQuestion}
                        onChange={(e) => setInputQuestion(e.target.value)}
                        placeholder="Đặt câu hỏi thắc mắc cho AI chuyên gia an ninh mạng..."
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                      />
                      <button
                        type="submit"
                        disabled={!inputQuestion.trim() || isAiAnswering}
                        className="px-4 py-2.5 rounded-xl bg-cyan-500 text-black font-bold text-xs hover:bg-cyan-400 disabled:opacity-50 transition-all flex items-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Gửi</span>
                      </button>
                    </form>
                  </div>
                )}
              </>
            )
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between flex-wrap gap-2 text-xs font-mono">
          <div className="flex items-center gap-2 text-cyan-300">
            <Award className="w-4 h-4 text-cyan-400" />
            <span>Thưởng Kháng Thể AI: +{explanation?.immunityPointsEarned || 10} Điểm Miễn Dịch</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-cyan-400 text-black font-bold hover:bg-cyan-300 transition-all"
          >
            Đã Kháng Thể Đầy Đủ
          </button>
        </div>

      </div>
    </div>
  );
};

