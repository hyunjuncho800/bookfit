import React, { useState } from 'react';
import { supabase } from '../services/supabaseService';
import { migrateGuestDataToSupabase } from '../services/authService';
import { X, Sparkles, Mail, Lock, LogIn, ArrowRight, ShieldCheck } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  title?: string;
  subTitle?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  title = "진단 결과를 안전하게 보관하세요",
  subTitle = "회원가입 후 아이의 연령별 독서 성장 리포트와 3-Track 맞춤 서가를 계속 관리하세요."
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;

        if (data.user) {
          await migrateGuestDataToSupabase(data.user.id);
          alert('회원가입이 완료되었습니다! 게스트 데이터가 안전하게 이관되었습니다.');
          onSuccess?.();
          onClose();
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;

        if (data.user) {
          await migrateGuestDataToSupabase(data.user.id);
          onSuccess?.();
          onClose();
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || '인증 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (err: any) {
      setErrorMessage(err.message || '구글 로그인 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-cream-light border-2 border-oak/40 rounded-3xl shadow-elevated overflow-hidden flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-cream-dark bg-forest text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-oak text-forest flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold font-serif">{title}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-cream-card hover:text-white rounded-full hover:bg-forest-light transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          <p className="text-xs text-charcoal-muted leading-relaxed">
            {subTitle}
          </p>

          {/* Social Google Login */}
          <button
            onClick={handleGoogleLogin}
            className="w-full py-2.5 px-4 bg-white border border-oak/30 hover:border-oak hover:bg-cream-card rounded-xl font-bold text-xs text-charcoal shadow-2xs flex items-center justify-center gap-2.5 transition-all"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Google 계정으로 빠른 시작</span>
          </button>

          <div className="relative flex items-center justify-center my-2">
            <div className="border-t border-oak/20 w-full"></div>
            <span className="bg-cream-light px-3 text-[10px] text-charcoal-muted font-semibold absolute">
              또는 이메일로 시작
            </span>
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailAuth} className="space-y-3">
            <div className="relative">
              <Mail className="w-4 h-4 text-oak-dark absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder="이메일 주소"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-oak/30 focus:border-forest rounded-xl text-xs text-charcoal outline-none font-medium"
              />
            </div>

            <div className="relative">
              <Lock className="w-4 h-4 text-oak-dark absolute left-3 top-3" />
              <input
                type="password"
                required
                minLength={6}
                placeholder="비밀번호 (6자 이상)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-oak/30 focus:border-forest rounded-xl text-xs text-charcoal outline-none font-medium"
              />
            </div>

            {errorMessage && (
              <p className="text-[11px] text-red-600 font-semibold bg-red-50 p-2 rounded-lg">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-forest hover:bg-forest-dark text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              {loading ? (
                <span>처리 중...</span>
              ) : (
                <>
                  <LogIn className="w-4 h-4 text-oak" />
                  <span>{mode === 'signup' ? '무료 회원가입 및 데이터 저장' : '로그인'}</span>
                </>
              )}
            </button>
          </form>

          {/* Toggle Mode */}
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-charcoal-muted">
              {mode === 'signup' ? '이미 계정이 있으신가요?' : '아직 계정이 없으신가요?'}
            </span>
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'signup' ? 'login' : 'signup');
                setErrorMessage('');
              }}
              className="font-bold text-forest hover:underline"
            >
              {mode === 'signup' ? '로그인 하기' : '회원가입 하기'}
            </button>
          </div>
        </div>

        {/* Modal Footer: Guest mode option */}
        <div className="p-4 bg-cream-card border-t border-cream-dark flex items-center justify-between">
          <span className="text-[11px] font-semibold text-charcoal-muted flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-forest" />
            게스트 데이터 무료 보존
          </span>
          <button
            onClick={onClose}
            className="text-xs font-bold text-oak-dark hover:text-charcoal flex items-center gap-1"
          >
            <span>게스트로 계속 둘러보기</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
