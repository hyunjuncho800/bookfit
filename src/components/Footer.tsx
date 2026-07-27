import React from 'react';
import { BookOpen, Database, ShieldCheck, Heart, Mail, Phone } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-forest text-cream-light border-t border-oak/30 pt-16 pb-12 relative overflow-hidden">
      
      {/* Top Gold Subtle Border Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-forest via-oak to-forest opacity-60" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-oak text-forest flex items-center justify-center shadow-md">
                <BookOpen className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-2xl font-bold font-serif tracking-tight text-white">
                BookFit <span className="text-oak">.</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-cream-card/80 leading-relaxed font-light max-w-md">
              북핏(BookFit)은 아동 맞춤형 문해력 정밀 진단 및 3-Step 도서 큐레이션 전문 기술 플랫폼입니다. 아이마다 다르게 형성된 언어 습관과 읽기 능력을 고풍스러운 서재의 감성으로 정밀 분석합니다.
            </p>

            <div className="flex items-center gap-2 text-xs text-oak bg-forest-dark/80 px-3.5 py-2 rounded-xl border border-oak/20 w-fit">
              <Database className="w-4 h-4 text-oak shrink-0" />
              <span>본 서비스의 도서 DB는 <strong>알라딘 Open API</strong> 데이터와 연동되어 제공됩니다.</span>
            </div>
          </div>

          {/* Nav Links Col 1 */}
          <div className="md:col-span-2 space-y-3 text-xs">
            <h4 className="text-sm font-bold font-serif text-oak uppercase tracking-wider">
              서비스 탐색
            </h4>
            <ul className="space-y-2 text-cream-card/80">
              <li><a href="#hero" className="hover:text-oak transition-colors">서비스 메인</a></li>
              <li><a href="#features" className="hover:text-oak transition-colors">3차원 정밀 진단</a></li>
              <li><a href="#tracks" className="hover:text-oak transition-colors">3-Step 추천 시스템</a></li>
              <li><a href="#bookshelf" className="hover:text-oak transition-colors">큐레이션 서가 미리보기</a></li>
            </ul>
          </div>

          {/* Nav Links Col 2 */}
          <div className="md:col-span-2 space-y-3 text-xs">
            <h4 className="text-sm font-bold font-serif text-oak uppercase tracking-wider">
              고객지원 & 안내
            </h4>
            <ul className="space-y-2 text-cream-card/80">
              <li><a href="#privacy" className="hover:text-oak transition-colors">개인정보 처리방침</a></li>
              <li><a href="#terms" className="hover:text-oak transition-colors">이용약관</a></li>
              <li><a href="#faq" className="hover:text-oak transition-colors font-medium text-cream-light">자주 묻는 질문 (FAQ)</a></li>
              <li><a href="#partners" className="hover:text-oak transition-colors">제휴 및 학교/기관 문의</a></li>
            </ul>
          </div>

          {/* Contact Col */}
          <div className="md:col-span-3 space-y-3 text-xs">
            <h4 className="text-sm font-bold font-serif text-oak uppercase tracking-wider">
              북핏 고객센터
            </h4>
            <p className="text-cream-card/80 leading-relaxed">
              평일 09:00 - 18:00 (점심시간 12:00 - 13:00) <br />
              주말 및 공휴일 휴무
            </p>
            <div className="space-y-1.5 pt-1 text-cream-light font-medium">
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-oak" />
                1588-BOOK (1588-2665)
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-oak" />
                support@bookfit.co.kr
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 border-t border-forest-light/40 flex flex-col sm:flex-row justify-between items-center text-xs text-cream-card/60 gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-oak" />
            <span>© {new Date().getFullYear()} BookFit Corp. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-1 text-[11px]">
            <span>Designed with</span>
            <Heart className="w-3 h-3 text-oak fill-oak inline" />
            <span>for Children's Literacy Growth</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
