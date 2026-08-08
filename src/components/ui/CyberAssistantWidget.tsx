/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Zap, 
  Trash2, 
  Volume2, 
  VolumeX, 
  Minimize2 
} from 'lucide-react';
import { askCyberAssistant } from '../../lib/gemini';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  time: string;
}

export const CyberAssistantWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'assistant',
      text: 'Xin chào! Tôi là Trợ Lý AI An Ninh Mạng CyberImmune (24/7). Tôi có thể giúp bạn kiểm tra thủ đoạn lừa đảo, hướng dẫn xử lý khẩn cấp khi lỡ bấm link lạ hoặc lỡ chuyển khoản. Bạn cần tư vấn điều gì?',
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeakingId, setIsSpeakingId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const queryText = textToSend || inputValue.trim();
    if (!queryText || isTyping) return;

    const timeNow = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: queryText,
      time: timeNow,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsTyping(true);

    try {
      const historyForAi = messages.map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      const replyText = await askCyberAssistant(historyForAi, queryText);

      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleToggleSpeech = (msgId: string, text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeakingId === msgId) {
      window.speechSynthesis.cancel();
      setIsSpeakingId(null);
    } else {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[*_#\-]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'vi-VN';
      utterance.rate = 0.95;
      utterance.onend = () => setIsSpeakingId(null);
      utterance.onerror = () => setIsSpeakingId(null);

      setIsSpeakingId(msgId);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleClearChat = () => {
    window.speechSynthesis?.cancel();
    setIsSpeakingId(null);
    setMessages([
      {
        id: `msg_welcome_${Date.now()}`,
        sender: 'assistant',
        text: 'Cuộc trò chuyện đã được dọn dẹp. Tôi là Trợ Lý AI An Ninh Mạng CyberImmune. Bạn có câu hỏi nào mới không?',
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const samplePrompts = [
    '🚔 SĐT xưng Công An/Thuế đòi nộp tiền phạt?',
    '💸 Lỡ chuyển tiền lừa đảo phải làm gì ngay?',
    '🔗 Dấu hiệu nhận biết website ngân hàng giả mạo?',
    '📲 Tải nhầm file .APK Dịch Vụ Công giả mạo?',
  ];

  return (
    <>
      {/* Floating Toggle Icon */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 group flex items-center gap-2.5 px-4 py-3 rounded-full bg-cyan-950 border-2 border-cyan-500/60 text-cyan-300 shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:bg-cyan-900 transition-all hover:scale-105 active:scale-95 cursor-pointer font-mono"
        >
          <div className="relative">
            <Bot className="w-6 h-6 text-cyan-400 group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400" />
          </div>
          <div className="hidden sm:flex flex-col items-start text-left">
            <span className="text-xs font-bold text-white tracking-wider">TRỢ LÝ AI SOC</span>
            <span className="text-[10px] text-cyan-400">An Ninh Mạng 24/7</span>
          </div>
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 z-50 w-[92vw] sm:w-[420px] h-[550px] max-h-[85vh] bg-[#0A0E1A] border-2 border-cyan-500/50 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.3)] flex flex-col overflow-hidden font-sans">
          
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#04070D] border-b border-slate-800 font-mono">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-400">
                <Bot className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm text-white">TRỢ LÝ CYBERIMMUNE</h3>
                  <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-500/40">
                    24/7 AI
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">Tư Vấn & Xử Lý Khẩn Cấp Lừa Đảo Mạng</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearChat}
                title="Xóa lịch sử trò chuyện"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  window.speechSynthesis?.cancel();
                  setIsOpen(false);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#070B14]/80">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1 text-[10px] text-slate-500 font-mono">
                  <span>{msg.sender === 'user' ? 'Bạn' : 'Trợ Lý AI SOC'}</span>
                  <span>•</span>
                  <span>{msg.time}</span>
                </div>

                <div
                  className={`relative group max-w-[88%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-cyan-500 text-black font-medium rounded-br-none shadow-md shadow-cyan-500/10'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none shadow-md'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {/* Audio read button for AI message */}
                  {msg.sender === 'assistant' && (
                    <button
                      onClick={() => handleToggleSpeech(msg.id, msg.text)}
                      title={isSpeakingId === msg.id ? 'Tắt đọc' : 'Đọc bằng giọng nói AI'}
                      className="absolute -bottom-2.5 right-2 p-1 rounded-full bg-slate-950 border border-slate-700 text-slate-400 hover:text-cyan-300 opacity-80 hover:opacity-100 transition-all"
                    >
                      {isSpeakingId === msg.id ? (
                        <VolumeX className="w-3 h-3 text-rose-400 animate-pulse" />
                      ) : (
                        <Volume2 className="w-3 h-3" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono p-2">
                <Zap className="w-4 h-4 animate-spin" />
                <span>Trợ lý AI đang suy nghĩ câu trả lời...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Suggestions */}
          <div className="p-2 bg-[#04070D] border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-[11px] font-mono scrollbar-none">
            {samplePrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(p)}
                className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 whitespace-nowrap transition-all flex-shrink-0"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Text Input Area */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-[#04070D] border-t border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Hỏi AI về lừa đảo, SĐT lạ, khôi phục tiền..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-sans"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="p-2.5 rounded-xl bg-cyan-500 text-black hover:bg-cyan-400 disabled:opacity-40 transition-all cursor-pointer font-bold flex items-center justify-center shadow-md shadow-cyan-500/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
};
