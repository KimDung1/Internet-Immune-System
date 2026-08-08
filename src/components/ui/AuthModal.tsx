import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { 
  LogIn, 
  LogOut, 
  Mail, 
  Lock, 
  User as UserIcon, 
  ShieldCheck, 
  X, 
  Zap, 
  Eye, 
  EyeOff, 
  KeyRound, 
  ArrowLeft,
  CheckCircle
} from 'lucide-react';
import { 
  loginWithGoogle, 
  loginWithEmail, 
  registerWithEmail, 
  sendResetPassword, 
  logoutUser, 
  getVietnameseAuthErrorMessage 
} from '../../lib/firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  addToast: (type: 'success' | 'danger' | 'warning' | 'info', title: string, message: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  addToast
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  if (!isOpen) return null;

  const resetFormState = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setDisplayName('');
    setResetSent(false);
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      addToast('warning', 'Thiếu Thông Tin', 'Vui lòng nhập địa chỉ email.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'register') {
        if (!password || password.length < 6) {
          addToast('warning', 'Mật Khẩu Mỏng', 'Mật khẩu phải có tối thiểu 6 ký tự.');
          setLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          addToast('warning', 'Mật Khẩu Không Khớp', 'Mật khẩu xác nhận không giống với mật khẩu đã nhập.');
          setLoading(false);
          return;
        }

        await registerWithEmail(email, password, displayName.trim() || email.split('@')[0]);
        addToast('success', 'Đăng Ký Thành Công!', 'Tài khoản đã được tạo và lưu trữ trên Firebase.');
        onClose();
        resetFormState();
      } else if (mode === 'login') {
        if (!password) {
          addToast('warning', 'Thiếu Mật Khẩu', 'Vui lòng nhập mật khẩu.');
          setLoading(false);
          return;
        }
        await loginWithEmail(email, password);
        addToast('success', 'Đăng Nhập Thành Công!', 'Đã kết nối cơ sở dữ liệu Firebase.');
        onClose();
        resetFormState();
      } else if (mode === 'forgot') {
        await sendResetPassword(email);
        setResetSent(true);
        addToast('info', 'Đã Gửi Email Khôi Phục', 'Vui lòng kiểm tra hộp thư đến (hoặc Spam) để đặt lại mật khẩu.');
      }
    } catch (err: any) {
      const msg = getVietnameseAuthErrorMessage(err);
      addToast('danger', 'Lỗi Xác Thực', msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      addToast('success', 'Đăng Nhập Google Thành Công!', 'Đã đồng bộ thông tin tài khoản Firebase.');
      onClose();
      resetFormState();
    } catch (err: any) {
      if (err?.code !== 'auth/popup-closed-by-user') {
        const msg = getVietnameseAuthErrorMessage(err);
        addToast('danger', 'Lỗi Google Auth', msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      addToast('info', 'Đã Đăng Xuất', 'Bạn đã thoát tài khoản an toàn.');
      onClose();
      resetFormState();
    } catch (err: any) {
      addToast('danger', 'Lỗi Đăng Xuất', err.message || 'Không thể đăng xuất.');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-sans">
      <div className="relative w-full max-w-md bg-[#0A0E1A] border border-cyan-500/40 rounded-xl p-6 font-mono text-slate-200 shadow-[0_0_50px_rgba(6,182,212,0.2)]">
        
        <button
          onClick={() => {
            onClose();
            resetFormState();
          }}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {currentUser ? (
          <div className="space-y-5 text-center py-2">
            <div className="w-16 h-16 mx-auto rounded-full bg-cyan-950 border-2 border-cyan-500/50 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/20">
              <ShieldCheck className="w-8 h-8 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white font-display">TÀI KHOẢN ĐÃ KẾT NỐI</h3>
              <p className="text-xs text-cyan-400 font-bold mt-1">{currentUser.displayName || 'Chiến Binh Mạng'}</p>
              <p className="text-xs text-slate-400 mt-0.5">{currentUser.email}</p>
              <p className="text-[10px] text-slate-500 font-mono mt-1">UID: {currentUser.uid}</p>
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-left text-xs space-y-1">
              <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Hệ thống ghi nhận:</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Dữ liệu quét mối đe dọa & chứng chỉ vắc-xin số của bạn đang được đồng bộ thời gian thực với Cloud Firestore database.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-rose-950 border border-rose-500/40 text-rose-300 hover:bg-rose-900 font-bold text-xs transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>ĐĂNG XUẤT TÀI KHOẢN</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            
            {/* Modal Title & Navigation Tabs */}
            <div className="border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 mb-2">
                <LogIn className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-base text-white font-display uppercase tracking-wide">
                  {mode === 'login' && 'Đăng Nhập Hệ Thống'}
                  {mode === 'register' && 'Đăng Ký Tài Khoản'}
                  {mode === 'forgot' && 'Khôi Phục Mật Khẩu'}
                </h3>
              </div>
              
              <div className="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => { setMode('login'); setResetSent(false); }}
                  className={`pb-1 border-b-2 font-bold transition-all ${
                    mode === 'login' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Đăng Nhập
                </button>
                <span className="text-slate-700">|</span>
                <button
                  type="button"
                  onClick={() => { setMode('register'); setResetSent(false); }}
                  className={`pb-1 border-b-2 font-bold transition-all ${
                    mode === 'register' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Tạo Tài Khoản
                </button>
              </div>
            </div>

            {/* FORGOT PASSWORD SUCCESS MESSAGE */}
            {mode === 'forgot' && resetSent ? (
              <div className="py-4 space-y-4 text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <Mail className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-white text-sm">Đã Gửi Hướng Dẫn!</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Hệ thống đã gửi liên kết đặt lại mật khẩu đến email <span className="text-cyan-300 font-bold">{email}</span>. Vui lòng kiểm tra hòm thư.
                  </p>
                </div>
                <button
                  onClick={() => setMode('login')}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-bold text-xs hover:bg-slate-800 transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Quay Lại Đăng Nhập</span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleEmailAuth} className="space-y-3.5">
                
                {/* Display Name Field for Register */}
                {mode === 'register' && (
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Họ & Tên / Bí Danh:</label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Nguyễn Văn A (ví dụ)"
                        className="w-full bg-[#04070D] border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                )}

                {/* Email Field */}
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Địa Chỉ Email:</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="user@example.com"
                      className="w-full bg-[#04070D] border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                {/* Password Field (for Login and Register) */}
                {mode !== 'forgot' && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] text-slate-400">Mật Khẩu:</label>
                      {mode === 'login' && (
                        <button
                          type="button"
                          onClick={() => setMode('forgot')}
                          className="text-[11px] text-cyan-400 hover:underline"
                        >
                          Quên mật khẩu?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-[#04070D] border border-slate-800 rounded-lg pl-9 pr-10 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {/* Confirm Password Field (for Register) */}
                {mode === 'register' && (
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Xác Nhận Mật Khẩu:</label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Nhập lại mật khẩu"
                        className="w-full bg-[#04070D] border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                )}

                {/* Submit Action Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-cyan-500 text-black font-bold text-xs hover:bg-cyan-400 transition-all cursor-pointer shadow-lg shadow-cyan-500/20 disabled:opacity-50"
                >
                  {loading ? (
                    <Zap className="w-4 h-4 animate-spin" />
                  ) : mode === 'register' ? (
                    'TẠO TÀI KHOẢN MỚI'
                  ) : mode === 'login' ? (
                    'ĐĂNG NHẬP HỆ THỐNG'
                  ) : (
                    'GỬI EMAIL ĐẶT LAI MẬT KHẨU'
                  )}
                </button>
              </form>
            )}

            {/* Google OAuth Divider */}
            {mode !== 'forgot' && (
              <>
                <div className="relative my-3 text-center">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
                  <span className="relative bg-[#0A0E1A] px-2 text-[10px] text-slate-500 font-mono">HOẶC ĐĂNG NHẬP NHANH</span>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-bold text-xs hover:bg-slate-800 transition-all cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z" />
                    <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                    <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z" />
                    <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z" />
                  </svg>
                  <span>ĐĂNG NHẬP VỚI TÀI KHOẢN GOOGLE</span>
                </button>
              </>
            )}

            {/* Bottom Toggle Note */}
            <div className="text-center pt-2">
              {mode === 'forgot' ? (
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-xs text-cyan-400 hover:underline flex items-center justify-center gap-1 mx-auto"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Quay lại trang Đăng Nhập</span>
                </button>
              ) : mode === 'login' ? (
                <p className="text-xs text-slate-400">
                  Chưa có tài khoản?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('register')}
                    className="text-cyan-400 font-bold hover:underline"
                  >
                    Đăng ký ngay
                  </button>
                </p>
              ) : (
                <p className="text-xs text-slate-400">
                  Đã có tài khoản?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="text-cyan-400 font-bold hover:underline"
                  >
                    Đăng nhập tại đây
                  </button>
                </p>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

