import React from 'react';
import { ShieldCheck, Award, ArrowRight, BookOpenCheck, Library, CheckCircle2 } from 'lucide-react';

interface HeroSectionProps {
  onOpenDiagnosis: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenDiagnosis }) => {
  return (
    <section id="hero" className="relative overflow-hidden pt-8 pb-20 lg:pt-16 lg:pb-28">
      {/* Subtle Background Glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-tr from-oak/10 via-forest/5 to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Text Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-oak/15 border border-oak/30 text-forest text-xs sm:text-sm font-semibold tracking-tight shadow-sm">
              <Award className="w-4 h-4 text-oak-dark" />
              <span>전문 어휘·독해력 종합 진단 프레임워크</span>
              <span className="w-1.5 h-1.5 rounded-full bg-forest animate-pulse" />
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-charcoal leading-[1.25] tracking-tight">
              아이마다 읽기 능력은 다릅니다.{' '}
              <br className="hidden sm:inline" />
              우리 아이에게{' '}
              <span className="relative inline-block text-forest underline decoration-oak decoration-wavy underline-offset-8">
                '딱 맞는 책'
              </span>
              을 찾아주세요.
            </h1>

            {/* Sub copy */}
            <p className="text-base sm:text-lg text-charcoal-light leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
              전문적인 어휘·독해력 정밀 진단부터, 아이의 정밀 진단 결과를 바탕으로 한 북핏 3-Step 맞춤 큐레이션 SYSTEM까지.{' '}
              <br className="hidden sm:inline" />
              도서관에 온 듯 편안한 공간에서 우리 아이만을 위한 독서 여정을 시작하세요.
            </p>

            {/* Key Value Bullets */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs sm:text-sm text-charcoal font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-forest" />
                <span>어휘·추론·메타인지 3D 분석</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-forest" />
                <span>70:10:20 골든 밸런스 큐레이션</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-forest" />
                <span>부모용 대화 리포트 제공</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={onOpenDiagnosis}
                className="w-full sm:w-auto px-8 py-4 bg-forest hover:bg-forest-dark text-white font-semibold rounded-2xl shadow-elevated hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-3 group border border-forest-light/30"
              >
                <BookOpenCheck className="w-5 h-5 text-oak group-hover:rotate-6 transition-transform" />
                <span className="text-base">10분 정밀 문해력 진단받기</span>
                <span className="ml-1 px-2 py-0.5 text-xs bg-oak text-forest-dark rounded-md font-bold">
                  FREE
                </span>
                <ArrowRight className="w-4 h-4 text-oak group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="#bookshelf"
                className="w-full sm:w-auto px-6 py-4 bg-cream-card hover:bg-cream-dark text-charcoal hover:text-forest font-semibold rounded-2xl border border-oak/30 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Library className="w-4 h-4 text-oak-dark" />
                <span>큐레이션 서가 둘러보기</span>
              </a>
            </div>

            {/* Trust Footer */}
            <div className="pt-4 flex items-center justify-center lg:justify-start gap-4 text-xs text-charcoal-muted border-t border-cream-dark/60">
              <div className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-forest" />
                <span>알라딘 Open API 20만+ 데이터베이스 연동</span>
              </div>
              <span>•</span>
              <span>누적 진단 아동 14,200명+</span>
            </div>

          </div>

          {/* Right Visual Element: Library Bookshelf Showcase Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Outer Decorative Frame */}
              <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-oak/40 via-forest/20 to-cream-card blur-md opacity-80" />

              {/* Wooden Bookshelf Preview Card */}
              <div className="relative bg-cream-light border-2 border-oak/40 rounded-2xl shadow-elevated p-6 space-y-5 overflow-hidden">
                
                {/* Header inside card */}
                <div className="flex items-center justify-between pb-3 border-b border-cream-dark">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-forest"></span>
                    <span className="w-3 h-3 rounded-full bg-oak"></span>
                    <span className="text-xs font-bold text-charcoal font-serif">BookFit Diagnosis Report Card</span>
                  </div>
                  <span className="text-[11px] font-semibold text-oak-dark bg-oak/15 px-2.5 py-1 rounded-full">
                    초등 3학년 샘플
                  </span>
                </div>

                {/* Main Graph/Score Preview */}
                <div className="bg-cream-card/80 p-4 rounded-xl border border-oak/20 space-y-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-charcoal-muted font-medium">종합 독서 핏 레벨</span>
                    <span className="text-lg font-bold font-serif text-forest">Level 3.4 (어휘 발달기)</span>
                  </div>
                  
                  {/* Progress Tracks */}
                  <div className="space-y-2 text-xs">
                    <div>
                      <div className="flex justify-between text-[11px] text-charcoal mb-1">
                        <span>어휘 유창성 (Vocabulary)</span>
                        <span className="font-semibold text-forest">88점</span>
                      </div>
                      <div className="w-full bg-cream-dark h-2 rounded-full overflow-hidden">
                        <div className="bg-forest h-full rounded-full w-[88%]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] text-charcoal mb-1">
                        <span>추론적 이해력 (Inference)</span>
                        <span className="font-semibold text-oak-dark">76점</span>
                      </div>
                      <div className="w-full bg-cream-dark h-2 rounded-full overflow-hidden">
                        <div className="bg-oak h-full rounded-full w-[76%]" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decorative Shelf Bar at Bottom */}
                <div className="h-3 w-full wood-shelf rounded-md" />

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
