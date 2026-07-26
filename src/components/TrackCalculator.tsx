import React, { useState } from 'react';
import { BookOpen, TrendingUp, ShieldAlert, Sparkles, Sliders } from 'lucide-react';

export const TrackCalculator: React.FC = () => {
  const [monthlyCount, setMonthlyCount] = useState<number>(10);

  const comfortCount = Math.round(monthlyCount * 0.7);
  const challengeCount = Math.round(monthlyCount * 0.1);
  const supplementCount = monthlyCount - comfortCount - challengeCount;

  return (
    <section id="tracks" className="py-20 bg-cream relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-forest text-white rounded-3xl p-8 sm:p-12 shadow-elevated relative overflow-hidden border border-oak/30">
          
          {/* Background Glow Elements */}
          <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-oak/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute left-1/3 top-0 w-64 h-64 bg-forest-light/20 rounded-full blur-3xl pointer-events-none" />

          <div className="grid lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Left Description */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-oak/20 border border-oak/40 text-oak text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                BookFit Only | 정밀 맞춤 매칭
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold font-serif leading-tight">
                북핏 3-Step 맞춤 큐레이션 SYSTEM <br />
                <span className="text-oak font-serif">70 : 10 : 20 황금 밸런스</span>
              </h2>

              <p className="text-sm sm:text-base text-cream-card/90 leading-relaxed font-light">
                아이의 정밀 진단 결과를 바탕으로 적정·도전·보완 3가지 맞춤 영역으로 도서를 매칭합니다. 독서 흥미 유지와 사고력 확장을 동시에 실현하는 북핏만의 독자적 시스템입니다.
              </p>

              {/* Slider for Monthly Target */}
              <div className="pt-4 p-5 bg-forest-dark/70 rounded-2xl border border-oak/20 space-y-3">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-cream-light flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-oak" />
                    한 달 목표 독서량 커스텀 시뮬레이션
                  </span>
                  <span className="text-xl font-bold text-oak font-serif">{monthlyCount}권 / 월</span>
                </div>
                
                <input
                  type="range"
                  min="5"
                  max="30"
                  step="1"
                  value={monthlyCount}
                  onChange={(e) => setMonthlyCount(Number(e.target.value))}
                  className="w-full h-2 bg-forest rounded-lg appearance-none cursor-pointer accent-oak"
                />

                <div className="flex justify-between text-[11px] text-cream-card/60">
                  <span>5권 (기초)</span>
                  <span>15권 (권장)</span>
                  <span>30권 (다독)</span>
                </div>
              </div>
            </div>

            {/* Right Interactive 3-Step Cards Display */}
            <div className="lg:col-span-6 space-y-4">
              
              {/* Step 1: 적정 도서 (70%) */}
              <div className="bg-cream-light text-charcoal rounded-2xl p-5 shadow-md border-l-8 border-forest hover:scale-[1.02] transition-transform">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-forest/15 text-forest flex items-center justify-center font-bold">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-forest bg-forest/10 px-2 py-0.5 rounded">
                          Step 1
                        </span>
                        <h4 className="font-bold font-serif text-forest text-base">
                          적정 도서 (70%)
                        </h4>
                      </div>
                      <p className="text-xs text-charcoal-muted mt-1">
                        스스로 술술 읽으며 성공 경험을 쌓는 책
                      </p>
                    </div>
                  </div>
                  <span className="text-xl font-bold font-serif text-forest bg-forest/10 px-3 py-1 rounded-xl">
                    {comfortCount}권
                  </span>
                </div>
              </div>

              {/* Step 2: 도전 도서 (10%) */}
              <div className="bg-cream-light text-charcoal rounded-2xl p-5 shadow-md border-l-8 border-oak hover:scale-[1.02] transition-transform">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-oak/20 text-oak-dark flex items-center justify-center font-bold">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-oak-dark bg-oak/20 px-2 py-0.5 rounded">
                          Step 2
                        </span>
                        <h4 className="font-bold font-serif text-oak-dark text-base">
                          도전 도서 (10%)
                        </h4>
                      </div>
                      <p className="text-xs text-charcoal-muted mt-1">
                        부모님과 함께 읽으며 사고력을 확장하는 책
                      </p>
                    </div>
                  </div>
                  <span className="text-xl font-bold font-serif text-oak-dark bg-oak/20 px-3 py-1 rounded-xl">
                    {challengeCount}권
                  </span>
                </div>
              </div>

              {/* Step 3: 약점 보완 (20%) */}
              <div className="bg-cream-light text-charcoal rounded-2xl p-5 shadow-md border-l-8 border-charcoal-muted hover:scale-[1.02] transition-transform">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-charcoal-muted/15 text-charcoal flex items-center justify-center font-bold">
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-charcoal bg-charcoal/10 px-2 py-0.5 rounded">
                          Step 3
                        </span>
                        <h4 className="font-bold font-serif text-charcoal text-base">
                          약점 보완 (20%)
                        </h4>
                      </div>
                      <p className="text-xs text-charcoal-muted mt-1">
                        어휘력·추론력 등 약점을 집중적으로 채워주는 책
                      </p>
                    </div>
                  </div>
                  <span className="text-xl font-bold font-serif text-charcoal bg-charcoal/10 px-3 py-1 rounded-xl">
                    {supplementCount}권
                  </span>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
