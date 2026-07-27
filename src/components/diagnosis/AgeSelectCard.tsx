import React from 'react';
import type { AgeGroup } from '../../types';
import { Baby, Sparkles, GraduationCap, BookOpen, ArrowRight } from 'lucide-react';

interface AgeSelectCardProps {
  onSelectAge: (ageGroup: AgeGroup) => void;
}

export const AGE_OPTIONS: Array<{
  id: AgeGroup;
  title: string;
  subTitle: string;
  badge: string;
  description: string;
  icon: React.ReactNode;
  bgGradient: string;
  borderColor: string;
}> = [
  {
    id: 'preschool',
    title: '학령전 유아',
    subTitle: '5 ~ 7세 (유치원/어린이집)',
    badge: '1단계 · 기초 파닉스',
    description: '그림 낱말, 소리 법칙 및 직관적 장면 이해 위주의 12문항',
    icon: <Baby className="w-7 h-7 text-amber-600" />,
    bgGradient: 'from-amber-50 to-orange-50/40',
    borderColor: 'border-amber-200 hover:border-amber-400',
  },
  {
    id: 'elementary_low',
    title: '초등 저학년',
    subTitle: '초등 1 ~ 2학년',
    badge: '2단계 · 문장 유창성',
    description: '기초 받침 문법, 다의어 어휘 및 짧은 서사 지문 위주의 12문항',
    icon: <Sparkles className="w-7 h-7 text-emerald-600" />,
    bgGradient: 'from-emerald-50 to-teal-50/40',
    borderColor: 'border-emerald-200 hover:border-emerald-400',
  },
  {
    id: 'elementary_mid',
    title: '초등 중학년',
    subTitle: '초등 3 ~ 4학년',
    badge: '3단계 · 고차 추론',
    description: '교과 한자어, 문맥 반의어, 인과 추론 및 오류 감지 위주의 12문항',
    icon: <BookOpen className="w-7 h-7 text-forest" />,
    bgGradient: 'from-forest/5 to-oak/10',
    borderColor: 'border-forest/30 hover:border-forest',
  },
  {
    id: 'elementary_high',
    title: '초등 고학년',
    subTitle: '초등 5 ~ 6학년',
    badge: '4단계 · 비판적 독해',
    description: '고급 한자어, 비문학 사회/기술 지문 및 논리 딜레마 위주의 12문항',
    icon: <GraduationCap className="w-7 h-7 text-indigo-600" />,
    bgGradient: 'from-indigo-50 to-purple-50/40',
    borderColor: 'border-indigo-200 hover:border-indigo-400',
  },
];

export const AgeSelectCard: React.FC<AgeSelectCardProps> = ({ onSelectAge }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-forest bg-forest/10 px-3.5 py-1.5 rounded-full border border-forest/20 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-oak-dark" />
          5대 학술 프레임워크 입각 · 연령별 4단계 정밀 검사
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold font-serif text-charcoal leading-tight">
          아이의 연령에 맞는 진단 단계를 선택해 주세요
        </h2>
        <p className="text-xs sm:text-sm text-charcoal-muted max-w-xl mx-auto">
          연령별 언어 발달 과업(SVR, Scarborough's Rope, Barrett's Taxonomy)에 입각하여 설계된 맞춤 12문항 검사가 진행됩니다.
        </p>
      </div>

      {/* 4 Age Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {AGE_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onSelectAge(opt.id)}
            className={`group text-left p-6 rounded-3xl border-2 bg-gradient-to-br ${opt.bgGradient} ${opt.borderColor} shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 flex flex-col justify-between space-y-4`}
          >
            <div className="flex items-start justify-between w-full">
              <div className="p-3 bg-white rounded-2xl shadow-xs border border-cream-dark">
                {opt.icon}
              </div>
              <span className="text-[11px] font-bold text-charcoal bg-white/80 backdrop-blur-xs px-3 py-1 rounded-full border border-charcoal/10 shadow-2xs">
                {opt.badge}
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-charcoal group-hover:text-forest transition-colors">
                {opt.title}
              </h3>
              <p className="text-xs font-semibold text-oak-dark">
                {opt.subTitle}
              </p>
              <p className="text-xs text-charcoal-muted leading-relaxed pt-1">
                {opt.description}
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs font-bold text-forest group-hover:translate-x-1 transition-transform">
              <span>진단 검사 시작하기</span>
              <ArrowRight className="w-4 h-4 text-oak" />
            </div>
          </button>
        ))}
      </div>

    </div>
  );
};
