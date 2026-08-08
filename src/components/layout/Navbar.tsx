/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Search,
  BookOpen,
  Users,
  History,
  User,
  Award,
  Shield,
  Activity,
  Zap,
  Menu,
  X,
  LogIn,
  Database
} from 'lucide-react';
import { getUserProfile, getAntibodyRank, initUserProfileFromFirebase, clearUserDataOnLogout, subscribeUserProfile } from '../../lib/storage';
import { subscribeAuth } from '../../lib/firebase';
import { User as FirebaseUser } from 'firebase/auth';
import { AuthModal } from '../ui/AuthModal';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  addToast: (type: 'success' | 'danger' | 'warning' | 'info', title: string, message: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate, addToast }) => {
  const [user, setUser] = useState(getUserProfile());
  const [fbUser, setFbUser] = useState<FirebaseUser | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribeAuth = subscribeAuth((fUser) => {
      setFbUser(fUser);
      if (fUser) {
        initUserProfileFromFirebase(fUser);
      } else {
        clearUserDataOnLogout();
      }
      setUser(getUserProfile());
    });

    const unsubscribeProfile = subscribeUserProfile((updated) => {
      setUser(updated);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeProfile();
    };
  }, []);

  const rank = getAntibodyRank(user.trustScore);

  const navItems = [
    { path: '/', label: 'SOC Tổng Quan', icon: Activity },
    { path: '/scan', label: 'Quét Đe Dọa', icon: Search },
    { path: '/simulate', label: 'Mô Phỏng', icon: Zap },
    { path: '/train', label: 'Vắc-xin Số', icon: BookOpen },
    { path: '/community', label: 'Cảnh Báo', icon: Users },
    { path: '/history', label: 'Nhật Ký Quét', icon: History },
    { path: '/protect', label: 'Lá Chắn', icon: ShieldAlert },
    { path: '/vaccination', label: 'Kháng Thể', icon: ShieldCheck },
    { path: '/profile', label: 'Hồ Sơ', icon: User },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#070B14]/95 backdrop-blur-md border-b border-slate-800 shadow-xl transition-all font-sans">
        
        {/* Top SOC System Status Bar */}
        <div className="hidden md:flex items-center justify-between px-6 py-1 bg-[#04070D] border-b border-slate-900 text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              SOC DEFENSE: ONLINE
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-cyan-400">FIREBASE DB: {fbUser ? 'CONNECTED' : 'GUEST MODE'}</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">STATUS: DEFCON 4</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setAuthModalOpen(true)}
              className="text-cyan-400 hover:underline flex items-center gap-1 font-bold"
            >
              <Database className="w-3 h-3" />
              <span>{fbUser ? `DB Sync (${fbUser.email?.split('@')[0]})` : 'Kết Nối Database / Đăng Nhập'}</span>
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            
            {/* Logo & Tactical Shield Icon */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('/')}>
              <div className="flex items-center justify-center w-8 h-8 rounded-md bg-cyan-950/90 border border-cyan-500/50 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.25)]">
                <Shield className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-base tracking-wider text-white uppercase">
                    CYBER<span className="text-cyan-400">IMMUNE</span>
                  </span>
                  <span className="px-1.5 py-0.2 text-[9px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/30 rounded">
                    SOC v1.2
                  </span>
                </div>
              </div>
            </div>

            {/* Nav Links */}
            <nav className="hidden lg:flex items-center space-x-1 font-mono">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPath === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => onNavigate(item.path)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-slate-800 text-cyan-300 border border-cyan-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* User Agent Badge & Auth Trigger */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setAuthModalOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/80 text-xs font-mono transition-all cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 text-cyan-400" />
                <span>{fbUser ? fbUser.displayName || fbUser.email?.split('@')[0] : 'Đăng Nhập'}</span>
              </button>

              <div
                onClick={() => onNavigate('/profile')}
                className="flex items-center gap-2 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer font-mono"
              >
                <div className="text-right">
                  <div className="text-[10px] text-slate-400">AGENT #{user.trustScore * 102}</div>
                  <div className="text-xs font-bold text-cyan-400">{user.trustScore}/100</div>
                </div>
                <div className="w-7 h-7 rounded bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Award className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-1.5 rounded bg-slate-900 text-slate-300 hover:text-white border border-slate-800"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#070B14] border-b border-slate-800 px-4 pt-2 pb-4 space-y-1 font-mono">
            <button
              onClick={() => {
                setAuthModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded text-xs font-medium bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 mb-2"
            >
              <LogIn className="w-4 h-4 text-cyan-400" />
              <span>{fbUser ? `Tài khoản (${fbUser.email})` : 'Đăng Nhập / Đăng Ký Database'}</span>
            </button>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    onNavigate(item.path);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:bg-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </header>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        currentUser={fbUser}
        addToast={addToast}
      />
    </>
  );
};
