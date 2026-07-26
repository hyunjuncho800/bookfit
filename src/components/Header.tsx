import React, { useState } from 'react';
import { BookOpen, Menu, X, Sparkles, ChevronRight, BarChart3, Search, Library } from 'lucide-react';

interface HeaderProps {
  onOpenDiagnosis: () => void;
  onNavigate: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenDiagnosis, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

          {/* Desktop Navigation (Visible only on xl screens 1280px+ for non-breaking 1-line layout) */}
          <nav className="hidden xl:flex items-center gap-4 lg:gap-6 shrink-0">
            <button
              onClick={() => handleNavClick('features')}
              className="text-charcoal hover:text-forest font-semibold text-sm transition-colors py-2 whitespace-nowrap tracking-tight"
            >
              서비스 소개
            </button>

            <button
              onClick={onOpenDiagnosis}
              className="text-forest font-bold text-xs lg:text-sm transition-colors py-1.5 px-3 rounded-xl bg-forest/10 border border-forest/20 hover:bg-forest/20 flex items-center gap-1.5 whitespace-nowrap tracking-tight"
            >
              <BarChart3 className="w-4 h-4 text-forest shrink-0" />
              <span className="whitespace-nowrap">정밀 문해력 검사 & 리포트</span>
            </button>

            <button
              onClick={() => handleNavClick('tracks')}
              className="text-charcoal hover:text-forest font-semibold text-sm transition-colors py-2 flex items-center gap-1.5 whitespace-nowrap tracking-tight"
            >
              <span className="whitespace-nowrap">3-Step 맞춤 큐레이션</span>
              <span className="text-[10px] bg-oak/20 text-oak-dark font-bold px-2 py-0.5 rounded-full border border-oak/30 whitespace-nowrap">
                BookFit Only
              </span>
            </button>

            <button
              onClick={() => handleNavClick('search-section')}
              className="text-charcoal hover:text-forest font-semibold text-sm transition-colors py-2 flex items-center gap-1.5 whitespace-nowrap tracking-tight"
            >
              <Search className="w-3.5 h-3.5 text-oak-dark shrink-0" />
              <span className="whitespace-nowrap">도서 검색대</span>
            </button>

            <button
              onClick={() => handleNavClick('my-library')}
              className="text-forest hover:text-forest-dark font-bold text-xs lg:text-sm transition-colors py-1.5 px-3 rounded-xl bg-oak/15 border border-oak/30 hover:bg-oak/25 flex items-center gap-1.5 whitespace-nowrap tracking-tight"
            >
              <Library className="w-4 h-4 text-oak-dark shrink-0" />
              <span className="whitespace-nowrap">마이 서재</span>
            </button>
          </nav>

          {/* Right Action Button (Desktop Only) */}
          <div className="hidden xl:flex items-center shrink-0">
            <button
              onClick={onOpenDiagnosis}
              className="group relative inline-flex items-center justify-center px-5 py-2.5 text-xs lg:text-sm font-bold text-white bg-forest hover:bg-forest-dark rounded-xl shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden whitespace-nowrap shrink-0"
            >
              <span className="relative z-10 flex items-center gap-2 whitespace-nowrap">
                <span>무료 문해력 진단 시작하기</span>
                <ChevronRight className="w-4 h-4 text-oak group-hover:translate-x-1 transition-transform shrink-0" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-forest via-forest-light to-forest opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>

          {/* Mobile & Tablet Hamburger Button (Visible on screens < 1280px) */}
          <div className="xl:hidden flex items-center">
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

      {/* Mobile & Tablet Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-cream-light border-b border-[#EAE3D2] px-4 pt-4 pb-6 space-y-3 shadow-xl animate-fadeIn">
          <button
            onClick={() => handleNavClick('features')}
            className="block w-full text-left px-4 py-3 rounded-xl text-sm font-semibold text-charcoal hover:bg-cream-card hover:text-forest whitespace-nowrap"
          >
            서비스 소개
          </button>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenDiagnosis();
            }}
            className="w-full text-left px-4 py-3 rounded-xl text-sm font-bold text-forest bg-forest/10 border border-forest/20 flex items-center justify-between whitespace-nowrap"
          >
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-forest" />
              <span>정밀 문해력 검사 & 리포트</span>
            </div>
            <ChevronRight className="w-4 h-4 text-oak" />
          </button>

          <button
            onClick={() => handleNavClick('tracks')}
            className="block w-full text-left px-4 py-3 rounded-xl text-sm font-semibold text-charcoal hover:bg-cream-card hover:text-forest whitespace-nowrap"
          >
            3-Step 맞춤 큐레이션 SYSTEM
          </button>

          <button
            onClick={() => handleNavClick('search-section')}
            className="block w-full text-left px-4 py-3 rounded-xl text-sm font-semibold text-charcoal hover:bg-cream-card hover:text-forest whitespace-nowrap"
          >
            알라딘 연동 도서 검색대
          </button>

          <button
            onClick={() => handleNavClick('my-library')}
            className="block w-full text-left px-4 py-3 rounded-xl text-sm font-bold text-forest bg-oak/20 border border-oak/30 whitespace-nowrap"
          >
            마이 서재 & 성취 기록
          </button>

          <div className="pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDiagnosis();
              }}
              className="w-full flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-bold text-white bg-forest hover:bg-forest-dark rounded-xl shadow-md whitespace-nowrap"
            >
              <span>무료 문해력 진단 시작하기</span>
              <ChevronRight className="w-4 h-4 text-oak shrink-0" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
