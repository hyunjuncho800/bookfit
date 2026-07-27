import React, { useState } from 'react';
import { Target, Layers, FileText, Sparkles, Check, HelpCircle } from 'lucide-react';
import { FeatureDetailModal } from './modals/FeatureDetailModal';
import type { FeatureModalType } from './modals/FeatureDetailModal';

interface FeatureSectionProps {
  onOpenDiagnosis?: () => void;
}

export const FeatureSection: React.FC<FeatureSectionProps> = ({ onOpenDiagnosis }) => {
  const [activeModal, setActiveModal] = useState<FeatureModalType>(null);

  return (
    <section id="features" className="py-20 bg-cream-card/50 border-y border-[#EAE3D2] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-forest/10 text-forest text-xs font-bold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-oak" />
            BookFit Core Features
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-charcoal tracking-tight">
            왜 북핏(BookFit) 문해력 솔루션일까요?
          </h2>
          <p className="text-base text-charcoal-light leading-relaxed">
            단순한 도서 목록 나열을 넘어, 아동 발달 단계에 맞춘 3차원 검증과 3-Step 구조로 
            읽기 흥미와 깊이를 동시에 완성합니다.
          </p>
        </div>

        {/* Feature Cards Grid (3 Cards) */}
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Card 1: 3차원 정밀 진단 */}
          <div
            onClick={() => setActiveModal('structure')}
            className="group relative bg-cream-light border border-oak/30 hover:border-forest/50 rounded-2xl p-8 shadow-book hover:shadow-elevated transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between cursor-pointer"
          >
            <div className="space-y-5">
              {/* Icon Container */}
              <div className="w-14 h-14 rounded-2xl bg-forest text-oak flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <Target className="w-7 h-7 stroke-[2]" />
              </div>

              <div>
                <span className="text-xs font-bold text-oak-dark tracking-wide uppercase">Feature 01</span>
                <h3 className="text-xl font-bold font-serif text-charcoal mt-1 group-hover:text-forest transition-colors">
                  3차원 정밀 진단 시스템
                </h3>
              </div>

              <p className="text-sm text-charcoal-light leading-relaxed">
                단순 단어 시험이 아닌, <strong className="text-charcoal font-semibold">어휘력</strong>, <strong className="text-charcoal font-semibold">사실적·추론적 이해력</strong>, 그리고 스스로 읽기 상태를 점검하는 <strong className="text-charcoal font-semibold">메타인지</strong>까지 3차원으로 다각도 정밀 측정합니다.
              </p>

              {/* Sub Check Points */}
              <ul className="space-y-2 pt-2 border-t border-cream-dark/80 text-xs text-charcoal font-medium">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-forest shrink-0" />
                  <span>학년별 필수 교과 어휘 지수 반영</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-forest shrink-0" />
                  <span>문맥 파악 능력 및 행간 읽기 진단</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-forest shrink-0" />
                  <span>자기조절 독서 태도 메타분석</span>
                </li>
              </ul>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveModal('structure');
              }}
              className="mt-6 pt-4 text-xs font-semibold text-forest flex items-center gap-1 group-hover:translate-x-1 transition-transform cursor-pointer outline-none"
            >
              <span>진단 구조 알아보기</span>
              <span>→</span>
            </button>
          </div>

          {/* Card 2: 3-Step 맞춤 추천 */}
          <div
            onClick={() => setActiveModal('ratio')}
            className="group relative bg-cream-light border border-oak/30 hover:border-oak-dark rounded-2xl p-8 shadow-book hover:shadow-elevated transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between cursor-pointer"
          >
            {/* Recommended Tag */}
            <div className="absolute top-4 right-4 text-[10px] font-bold bg-oak text-forest-dark px-2.5 py-1 rounded-full shadow-sm">
              핵심 로직
            </div>

            <div className="space-y-5">
              {/* Icon Container */}
              <div className="w-14 h-14 rounded-2xl bg-oak text-forest flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <Layers className="w-7 h-7 stroke-[2]" />
              </div>

              <div>
                <span className="text-xs font-bold text-oak-dark tracking-wide uppercase">Feature 02</span>
                <h3 className="text-xl font-bold font-serif text-charcoal mt-1 group-hover:text-forest transition-colors">
                  북핏 3-Step 맞춤 큐레이션 SYSTEM
                </h3>
              </div>

              <p className="text-sm text-charcoal-light leading-relaxed">
                아이의 정밀 진단 결과를 바탕으로 <strong className="text-forest">적정 도서(70%)</strong>, <strong className="text-oak-dark">도전 도서(10%)</strong>, <strong className="text-charcoal">약점 보완(20%)</strong> 3가지 맞춤 영역으로 도서를 매칭합니다.
              </p>

              {/* Track Breakdown Box */}
              <div className="p-3 bg-cream-card rounded-xl border border-oak/20 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-forest">Step 1. 적정 도서 (70%)</span>
                  <span className="text-[11px] text-charcoal-muted">스스로 읽는 성취감</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-oak-dark">Step 2. 도전 도서 (10%)</span>
                  <span className="text-[11px] text-charcoal-muted">사고력 지평 확장</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-charcoal">Step 3. 약점 보완 (20%)</span>
                  <span className="text-[11px] text-charcoal-muted">어휘·추론 집중 케어</span>
                </div>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveModal('ratio');
              }}
              className="mt-6 pt-4 text-xs font-semibold text-oak-dark flex items-center gap-1 group-hover:translate-x-1 transition-transform cursor-pointer outline-none"
            >
              <span>황금 비율 상세 보기</span>
              <span>→</span>
            </button>
          </div>

          {/* Card 3: 독후 가이드 & 리포트 */}
          <div
            onClick={() => setActiveModal('report')}
            className="group relative bg-cream-light border border-oak/30 hover:border-forest/50 rounded-2xl p-8 shadow-book hover:shadow-elevated transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between cursor-pointer"
          >
            <div className="space-y-5">
              {/* Icon Container */}
              <div className="w-14 h-14 rounded-2xl bg-forest text-oak flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <FileText className="w-7 h-7 stroke-[2]" />
              </div>

              <div>
                <span className="text-xs font-bold text-oak-dark tracking-wide uppercase">Feature 03</span>
                <h3 className="text-xl font-bold font-serif text-charcoal mt-1 group-hover:text-forest transition-colors">
                  부모 전용 독후 대화 가이드
                </h3>
              </div>

              <p className="text-sm text-charcoal-light leading-relaxed">
                "책 읽고 뭐 느꼈니?" 대신 아이의 생각을 끌어내는 <strong className="text-charcoal font-semibold">맞춤형 독후 질문지</strong>와 책 속에 등장한 주요 <strong className="text-charcoal font-semibold">어휘 확장 학습 리포트</strong>를 매월 제공합니다.
              </p>

              {/* Sample Question Mock */}
              <div className="p-3 bg-cream-card rounded-xl border border-oak/20 space-y-1 text-xs">
                <p className="text-[11px] font-bold text-forest flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5 text-oak" />
                  오늘의 추천 독후 질문
                </p>
                <p className="text-charcoal italic text-[11px] leading-snug">
                  "주인공이 만약 그 행동을 하지 않았다면 결말은 어떻게 달라졌을까?"
                </p>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveModal('report');
              }}
              className="mt-6 pt-4 text-xs font-semibold text-forest flex items-center gap-1 group-hover:translate-x-1 transition-transform cursor-pointer outline-none"
            >
              <span>샘플 리포트 확인</span>
              <span>→</span>
            </button>
          </div>

        </div>

      </div>

      {/* Feature Details Modal */}
      <FeatureDetailModal
        modalType={activeModal}
        onClose={() => setActiveModal(null)}
        onOpenDiagnosis={onOpenDiagnosis}
      />
    </section>
  );
};
