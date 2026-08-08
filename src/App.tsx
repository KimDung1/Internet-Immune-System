/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ToastContainer, ToastMessage } from './components/ui/Toast';
import { CyberAssistantWidget } from './components/ui/CyberAssistantWidget';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { ScanPage } from './pages/ScanPage';
import { SimulatePage } from './pages/SimulatePage';
import { TrainPage } from './pages/TrainPage';
import { CommunityPage } from './pages/CommunityPage';
import { HistoryPage } from './pages/HistoryPage';
import { ProfilePage } from './pages/ProfilePage';
import { VaccinationPage } from './pages/VaccinationPage';
import { ProtectPage } from './pages/ProtectPage';

// Error Boundary — prevents white screen crashes during demo
interface EBProps { children: React.ReactNode; onReset?: () => void; }
interface EBState { hasError: boolean; error: Error | null; }

function ErrorBoundaryFallback({ error, onReset }: { error: Error | null; onReset: () => void }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="max-w-md p-8 rounded-2xl bg-[#111827] border border-rose-500/40 text-center space-y-4 shadow-[0_0_40px_rgba(239,68,68,0.15)]">
        <div className="text-4xl">🛡️</div>
        <h2 className="font-display font-bold text-xl text-white">Hệ Miễn Dịch Phát Hiện Lỗi</h2>
        <p className="text-sm text-slate-400">Module gặp sự cố kỹ thuật. Dữ liệu của bạn vẫn an toàn.</p>
        <p className="text-xs text-rose-400 font-mono bg-rose-950/40 p-2 rounded break-all">
          {error?.message || 'Unknown error'}
        </p>
        <button
          onClick={onReset}
          className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-display font-bold text-sm transition-all"
        >
          Khởi Động Lại Module
        </button>
      </div>
    </div>
  );
}

class ErrorBoundary extends React.Component<EBProps, EBState> {
  constructor(props: EBProps) {
    super(props);
    (this as any).state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error): EBState {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[IIS Error Boundary]', error, info.componentStack);
  }
  render() {
    const s = this as any;
    if (s.state.hasError) {
      return (
        <ErrorBoundaryFallback
          error={s.state.error}
          onReset={() => {
            s.setState({ hasError: false, error: null });
            s.props.onReset?.();
          }}
        />
      );
    }
    return s.props.children;
  }
}


export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname || '/');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    // Handle browser navigation / hash
    const handlePopState = () => {
      const path = window.location.pathname || '/';
      setCurrentPath(path);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    window.history.pushState({}, '', path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addToast = (
    type: 'success' | 'error' | 'warning' | 'threat' | 'danger' | 'info',
    title: string,
    description?: string
  ) => {
    const newToast: ToastMessage = {
      id: `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      type,
      title,
      description,
    };
    setToasts((prev) => [newToast, ...prev.slice(0, 4)]);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Render current view
  const renderPage = () => {
    switch (currentPath) {
      case '/scan':
        return <ScanPage onNavigate={handleNavigate} addToast={addToast} />;
      case '/simulate':
        return <SimulatePage onNavigate={handleNavigate} addToast={addToast} />;
      case '/train':
        return <TrainPage onNavigate={handleNavigate} addToast={addToast} />;
      case '/community':
        return <CommunityPage onNavigate={handleNavigate} addToast={addToast} />;
      case '/history':
        return <HistoryPage onNavigate={handleNavigate} addToast={addToast} />;
      case '/profile':
        return <ProfilePage onNavigate={handleNavigate} addToast={addToast} />;
      case '/vaccination':
        return <VaccinationPage onNavigate={handleNavigate} addToast={addToast} />;
      case '/protect':
        return <ProtectPage onNavigate={handleNavigate} addToast={addToast} />;
      case '/':
      default:
        return <DashboardPage onNavigate={handleNavigate} addToast={addToast} />;
    }
  };

  return (
    <div lang="vi" className="min-h-screen bg-[#0B1120] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-cyan-500 focus:text-black focus:rounded-lg focus:font-bold focus:text-sm">
        Chuyển đến nội dung chính
      </a>
      
      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />

      {/* Global Cyberpunk Glass Navigation */}
      <Navbar currentPath={currentPath} onNavigate={handleNavigate} addToast={addToast} />

      {/* Main Content Area */}
      <main id="main-content" role="main" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <ErrorBoundary onReset={() => handleNavigate('/')}>
          {renderPage()}
        </ErrorBoundary>
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Floating 24/7 Cyber Security AI Assistant Chatbot */}
      <CyberAssistantWidget />

    </div>
  );
}
