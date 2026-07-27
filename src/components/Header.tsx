import React, { useState, useEffect } from 'react';
import { BookOpen, Menu, X, Sparkles, ChevronRight, User, LogOut, LogIn, Shield } from 'lucide-react';
import { supabase, checkIsAdmin } from '../services/supabaseService';

interface HeaderProps {
  onOpenDiagnosis: () => void;
  onNavigate: (sectionId: string) => void;
  onOpenAuth?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenDiagnosis, onNavigate, onOpenAuth }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAdminUser, setIsAdminUser] = useState<boolean>(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }: { data: any }) => {
      setUser(data.user);
    });
    checkIsAdmin().then((hasAdmin) => setIsAdminUser(hasAdmin));

    const { data: authListener } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setUser(session?.user ?? null);
      checkIsAdmin().then((hasAdmin) => setIsAdminUser(hasAdmin));
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FBF9F5]/95 backdrop-blur-md border-b border-[#EAE3D2] transition-all duration-300 break-keep">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer group shrink-0"
            onClick={() => handleNavClick('hero')}
          >
            <div className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-forest text-oak shadow-md group-hover:scale-105 transition-transform duration-300 shrink-0">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
              <Sparkles className="w-3 h-3 text-oak absolute -top-1 -right-1 animate-pulse" />
            </div>
            <div className="whitespace-nowrap">
              <div className="flex items-baseline gap-1">
                <span className="text-xl sm:text-2xl font-bold font-serif tracking-tight text-forest">
                  BookFit
                </span>
                <span className="w-2 h-2 rounded-full bg-oak inline-block"></span>
              </div>
              <p className="text-[10px] tracking-wider text-charcoal-muted font-medium whitespace-nowrap">
                아동 맞춤형 문해력 플랫폼
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 shrink-0">
            <button
              onClick={() => handleNavClick('features')}
              className="text-charcoal hover:text-forest font-medium text-sm transition-colors py-2 whitespace-nowrap tracking-tight relative group"
            >
              <span>서비스 소개</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-forest transition-all duration-200 group-hover:w-full" />
            </button>

            <button
              onClick={onOpenDiagnosis}
              className="text-charcoal hover:text-forest font-medium text-sm transition-colors py-2 whitespace-nowrap tracking-tight relative group"
            >
              <span>정밀 검사 & 리포트</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-forest transition-all duration-200 group-hover:w-full" />
            </button>

            <button
              onClick={() => handleNavClick('tracks')}
              className="text-charcoal hover:text-forest font-medium text-sm transition-colors py-2 whitespace-nowrap tracking-tight relative group"
            >
              <span>3-Step 큐레이션</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-forest transition-all duration-200 group-hover:w-full" />
            </button>

            <button
              onClick={() => handleNavClick('search-section')}
              className="text-charcoal hover:text-forest font-medium text-sm transition-colors py-2 whitespace-nowrap tracking-tight relative group"
            >
              <span>도서 검색대</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-forest transition-all duration-200 group-hover:w-full" />
            </button>

            <button
              onClick={() => handleNavClick('my-library')}
              className="text-charcoal hover:text-forest font-medium text-sm transition-colors py-2 whitespace-nowrap tracking-tight relative group"
            >
              <span>마이 서재</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-forest transition-all duration-200 group-hover:w-full" />
            </button>

            {user && (
              <button
                onClick={() => handleNavClick('my-library')}
                className="text-forest-dark hover:text-forest font-bold text-sm transition-colors py-2 whitespace-nowrap tracking-tight relative group flex items-center gap-1"
              >
                <span>마이페이지 📊</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-oak transition-all duration-200 group-hover:w-full" />
              </button>
            )}
          </nav>

          {/* Right Action & Auth Section */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            {user ? (
              <div className="flex items-center gap-3 bg-cream-card px-3 py-1.5 rounded-xl border border-oak/30">
                <button
                  onClick={() => handleNavClick('my-library')}
                  className="text-xs font-bold text-forest hover:text-forest-dark flex items-center gap-1.5 transition-colors"
                  title="마이페이지 이동"
                >
                  <User className="w-3.5 h-3.5 text-oak-dark" />
                  <span>{user.email?.split('@')[0]} 님</span>
                  {isAdminUser && (
                    <span className="text-[10px] font-extrabold text-amber-900 bg-amber-200 px-2 py-0.5 rounded-md border border-amber-400 shadow-2xs flex items-center gap-0.5">
                      <Shield className="w-3 h-3 fill-amber-500" />
                      관리자
                    </span>
                  )}
                </button>
                <button
                  onClick={handleSignOut}
                  className="text-[11px] font-semibold text-charcoal-muted hover:text-red-600 flex items-center gap-0.5 transition-colors border-l border-oak/20 pl-2"
                >
                  <LogOut className="w-3 h-3" />
                  로그아웃
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-oak-dark bg-oak/15 px-2.5 py-1 rounded-full border border-oak/30">
                  게스트 체험 중
                </span>
                <button
                  onClick={onOpenAuth}
                  className="px-3.5 py-2 text-xs font-bold text-forest hover:bg-forest/10 border border-forest/30 rounded-xl transition-all flex items-center gap-1"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>로그인 / 가입</span>
                </button>
              </div>
            )}

            <button
              onClick={onOpenDiagnosis}
              className="group relative inline-flex items-center justify-center px-4 py-2.5 text-xs lg:text-sm font-bold text-white bg-forest hover:bg-forest-dark rounded-xl shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden whitespace-nowrap shrink-0"
            >
              <span className="relative z-10 flex items-center gap-2 whitespace-nowrap">
                <span>무료 진단 시작하기</span>
                <ChevronRight className="w-4 h-4 text-oak group-hover:translate-x-1 transition-transform shrink-0" />
              </span>
            </button>
          </div>

          {/* Mobile & Tablet Hamburger Button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-charcoal hover:text-forest bg-cream-card hover:bg-cream-dark border border-oak/30 transition-colors"
              aria-label="메뉴 열기"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-cream-light border-b border-[#EAE3D2] px-5 pt-3 pb-6 space-y-2 shadow-xl animate-fadeIn">
          {/* User Auth Bar (Mobile) */}
          <div className="p-3 bg-cream-card rounded-2xl border border-oak/30 mb-3 space-y-2">
            {user ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-forest flex items-center gap-1.5">
                    <User className="w-4 h-4 text-oak-dark" />
                    {user.email?.split('@')[0]} 님
                    {isAdminUser && (
                      <span className="text-[10px] font-extrabold text-amber-900 bg-amber-200 px-2 py-0.5 rounded-md border border-amber-400 flex items-center gap-0.5">
                        <Shield className="w-3 h-3 fill-amber-500" />
                        관리자
                      </span>
                    )}
                  </span>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleSignOut();
                    }}
                    className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1 bg-red-50 px-2.5 py-1 rounded-lg border border-red-200"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    로그아웃
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-charcoal-muted">북핏 서비스를 이용해 보세요</span>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth?.();
                  }}
                  className="px-4 py-2 text-xs font-bold text-white bg-forest hover:bg-forest-dark rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                >
                  <LogIn className="w-4 h-4" />
                  <span>로그인 / 회원가입</span>
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => handleNavClick('features')}
            className="block w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-charcoal hover:bg-cream-card hover:text-forest transition-colors whitespace-nowrap"
          >
            서비스 소개
          </button>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenDiagnosis();
            }}
            className="block w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-charcoal hover:bg-cream-card hover:text-forest transition-colors whitespace-nowrap"
          >
            정밀 검사 & 리포트
          </button>

          <button
            onClick={() => handleNavClick('tracks')}
            className="block w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-charcoal hover:bg-cream-card hover:text-forest transition-colors whitespace-nowrap"
          >
            3-Step 큐레이션
          </button>

          <button
            onClick={() => handleNavClick('search-section')}
            className="block w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-charcoal hover:bg-cream-card hover:text-forest transition-colors whitespace-nowrap"
          >
            도서 검색대
          </button>

          <button
            onClick={() => handleNavClick('my-library')}
            className="block w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-charcoal hover:bg-cream-card hover:text-forest transition-colors whitespace-nowrap"
          >
            마이 서재
          </button>

          {/* Admin Mode Menu item only for Admin users in Mobile */}
          {isAdminUser && (
            <button
              onClick={() => handleNavClick('bookshelf')}
              className="block w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold text-amber-900 bg-amber-100 border border-amber-300 hover:bg-amber-200 transition-colors whitespace-nowrap flex items-center gap-2"
            >
              <Shield className="w-4 h-4 text-amber-700 fill-amber-300" />
              <span>⚙️ 관리자 서가 관리 모드</span>
            </button>
          )}

          <div className="pt-3 border-t border-cream-dark">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDiagnosis();
              }}
              className="w-full py-3 bg-forest text-white hover:bg-forest-dark font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-oak" />
              <span>무료 문해력 진단 시작하기</span>
              <ChevronRight className="w-4 h-4 text-oak" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
