import React, { useState } from 'react';
import type { DiagnosticResultData, Book } from '../../types';
import { RadarChart } from './RadarChart';
import { Award, TrendingUp, AlertTriangle, BookOpen, CheckCircle, HelpCircle, Heart, Share2, Printer, ArrowLeft, Sparkles, ShieldCheck } from 'lucide-react';
import { shareKakaoReport } from '../../lib/kakaoShare';

interface DiagnosticReportProps {
  data: DiagnosticResultData;
  onRestart: () => void;
  onSelectBook: (book: Book) => void;
}

export const DiagnosticReport: React.FC<DiagnosticReportProps> = ({ data, onRestart, onSelectBook }) => {
  const [activeParentTab, setActiveParentTab] = useState<'before' | 'during' | 'after'>('before');

  const handleShare = () => {
    shareKakaoReport({
      totalScore: data.totalScore,
      levelName: data.gradeLevelName,
    });
  };

  const getTrackBadgeStyle = (track: 'comfort' | 'challenge' | 'supplement') => {
    switch (track) {
      case 'comfort':
        return 'bg-forest/15 text-forest border-forest/30';
      case 'challenge':
        return 'bg-oak/20 text-oak-dark border-oak/40';
      case 'supplement':
        return 'bg-charcoal/10 text-charcoal border-charcoal/30';
    }
  };

  const getTrackName = (track: 'comfort' | 'challenge' | 'supplement') => {
    switch (track) {
      case 'comfort':
        return 'Step 1. 적정 도서 (70%)';
      case 'challenge':
        return 'Step 2. 도전 도서 (10%)';
      case 'supplement':
        return 'Step 3. 약점 보완 (20%)';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12 space-y-10 animate-fadeIn">
      
      {/* Top Header Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-cream-dark pb-4">
        <button
          onClick={onRestart}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal hover:text-forest bg-cream-light border border-oak/30 px-3.5 py-2 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>새로운 검사 진행</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1 text-xs font-medium text-charcoal-muted hover:text-charcoal bg-cream-card px-3 py-1.5 rounded-lg border border-oak/20"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>리포트 인쇄</span>
          </button>
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1 text-xs font-medium text-charcoal-muted hover:text-charcoal bg-cream-card px-3 py-1.5 rounded-lg border border-oak/20"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>공유하기</span>
          </button>
        </div>
      </div>

      {/* Report Title Banner */}
      <div className="bg-forest text-white rounded-3xl p-8 sm:p-10 shadow-elevated relative overflow-hidden border border-oak/30">
        <div className="absolute right-0 top-0 w-80 h-80 bg-oak/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-oak/20 text-oak text-xs font-bold border border-oak/30">
            <Sparkles className="w-3.5 h-3.5" />
            북핏(BookFit) 정밀 진단 종합 결과 리포트
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold font-serif leading-tight">
            우리 아이 맞춤 문해력 핏은 <br />
            <span className="text-oak font-serif">[{data.gradeLevelName}]</span>입니다.
          </h1>

          <p className="text-xs sm:text-sm text-cream-card/90 font-light leading-relaxed">
            전국 동일 연령대 아동 대비 4대 문해력 영역(기초 해독, 어휘/구문, 독해/추론, 메타인지)을 정밀 정량 분석한 최종 결과입니다.
          </p>
        </div>
      </div>

      {/* Grid: 1) 종합 지수 Card + 2) 방사형 그래프 UI */}
      <div className="grid md:grid-cols-12 gap-8 items-stretch">
        
        {/* ① 종합 문해력 지수 카드 */}
        <div className="md:col-span-5 bg-cream-light border-2 border-oak/40 rounded-3xl p-6 sm:p-8 shadow-book flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-oak-dark bg-oak/15 px-3 py-1 rounded-full">
                종합 문해력 지수 (Overall Index)
              </span>
              <Award className="w-6 h-6 text-oak" />
            </div>

            <div className="text-center py-4 bg-cream-card rounded-2xl border border-oak/20 space-y-2">
              <span className="text-xs text-charcoal-muted font-medium">종합 핏 점수</span>
              <div className="text-5xl font-extrabold font-serif text-forest tracking-tight">
                {data.totalScore}
                <span className="text-2xl font-normal text-charcoal-muted ml-1">/ 100점</span>
              </div>
              <div className="inline-block bg-forest text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-sm">
                또래 대비 상위 <span className="text-oak">{data.percentileTop}%</span> 이내
              </div>
            </div>

            {/* Score Breakdown Bullets */}
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center p-2.5 bg-cream rounded-xl border border-oak/15">
                <span className="text-charcoal font-medium">기초 해독 & 유창성</span>
                <span className="font-bold text-forest">{data.domainScores.decoding}점</span>
              </div>
              <div className="flex justify-between items-center p-2.5 bg-cream rounded-xl border border-oak/15">
                <span className="text-charcoal font-medium">어휘 & 문장구조</span>
                <span className="font-bold text-oak-dark">{data.domainScores.vocabulary}점</span>
              </div>
              <div className="flex justify-between items-center p-2.5 bg-cream rounded-xl border border-oak/15">
                <span className="text-charcoal font-medium">고차 독해 & 사고력</span>
                <span className="font-bold text-forest">{data.domainScores.comprehension}점</span>
              </div>
              <div className="flex justify-between items-center p-2.5 bg-cream rounded-xl border border-oak/15">
                <span className="text-charcoal font-medium">메타인지 독서 전략</span>
                <span className="font-bold text-charcoal">{data.domainScores.metacognition}점</span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-charcoal-muted flex items-center gap-1 border-t border-cream-dark pt-3">
            <ShieldCheck className="w-3.5 h-3.5 text-forest" />
            <span>북핏 14,200명 무작위 데이터 기준 백분위 표출</span>
          </div>
        </div>

        {/* ② 4대 영역 방사형 그래프 (Radar Chart) UI */}
        <div className="md:col-span-7 bg-cream-light border-2 border-oak/40 rounded-3xl p-6 sm:p-8 shadow-book flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-lg font-bold font-serif text-charcoal flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-forest" />
              4대 문해력 영역 방사형 진단 그래프
            </h3>
            <p className="text-xs text-charcoal-muted mt-1">
              각 축은 100점 만점 기준이며, 차트 면적이 클수록 균형 잡힌 문해 능력을 보유함을 뜻합니다.
            </p>
          </div>

          {/* Radar Chart Component */}
          <RadarChart scores={data.domainScores} />
        </div>

      </div>

      {/* ③ 강점 및 약점 영역 상세 분석 카드 */}
      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Strength Card */}
        <div className="bg-cream-light border border-forest/40 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4 relative overflow-hidden">
          <div className="w-2 h-full bg-forest absolute left-0 top-0 bottom-0" />
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-forest/15 text-forest flex items-center justify-center font-bold">
              <CheckCircle className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold font-serif text-forest">
              우수한 강점 영역 (Strengths)
            </h3>
          </div>

          <ul className="space-y-2.5 text-xs sm:text-sm text-charcoal">
            {data.strengths.map((str, idx) => (
              <li key={idx} className="flex items-start gap-2 p-3 bg-forest/5 rounded-xl border border-forest/10">
                <span className="font-bold text-forest mt-0.5">•</span>
                <span className="leading-relaxed font-medium">{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weakness Card */}
        <div className="bg-cream-light border border-oak/50 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4 relative overflow-hidden">
          <div className="w-2 h-full bg-oak absolute left-0 top-0 bottom-0" />

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-oak/20 text-oak-dark flex items-center justify-center font-bold">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold font-serif text-oak-dark">
              집중 보완 영역 (Areas for Growth)
            </h3>
          </div>

          <ul className="space-y-2.5 text-xs sm:text-sm text-charcoal">
            {data.weaknesses.map((weak, idx) => (
              <li key={idx} className="flex items-start gap-2 p-3 bg-oak/10 rounded-xl border border-oak/20">
                <span className="font-bold text-oak-dark mt-0.5">•</span>
                <span className="leading-relaxed font-medium">{weak}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* ④ 처방형 3-Track 도서 추천 카드 목록 */}
      <div className="bg-cream-light border-2 border-oak/40 rounded-3xl p-6 sm:p-10 shadow-elevated space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-cream-dark pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-oak/15 text-oak-dark text-xs font-bold">
              <BookOpen className="w-4 h-4 text-oak-dark" />
              Prescribed 3-Step Books
            </div>
            <h3 className="text-2xl font-bold font-serif text-charcoal mt-1">
              북핏 3-Step 맞춤 큐레이션 SYSTEM 처방
            </h3>
          </div>
          <span className="text-xs text-charcoal-muted font-medium">
            적정 70% : 도전 10% : 약점보완 20% 황금 핏
          </span>
        </div>

        {/* 3-Track Prescribed Books Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {data.prescribedBooks.map((book) => (
            <div
              key={book.id}
              onClick={() => onSelectBook(book)}
              className="group relative bg-cream border border-oak/30 hover:border-forest/60 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                <span className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-md border ${getTrackBadgeStyle(book.trackType)}`}>
                  {getTrackName(book.trackType)}
                </span>

                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-full h-40 object-cover rounded-xl shadow-md border border-oak/20 group-hover:scale-102 transition-transform"
                />

                <div>
                  <span className="text-[10px] font-bold text-oak-dark bg-oak/15 px-2 py-0.5 rounded">
                    {book.lexileLevel}
                  </span>
                  <h4 className="text-base font-bold font-serif text-charcoal group-hover:text-forest transition-colors mt-1">
                    {book.title}
                  </h4>
                  <p className="text-xs text-charcoal-muted">{book.author} 저</p>
                </div>

                <div className="p-2.5 bg-cream-card rounded-lg border border-oak/20 text-xs text-charcoal italic">
                  "{book.recommendReason}"
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-cream-dark text-xs font-bold text-forest flex items-center justify-between">
                <span>독후 대화 질문지 보기</span>
                <span>→</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ⑤ 가정 내 독서 지도 팁 & 사후 대화 가이드 */}
      <div className="bg-cream-card/60 border border-oak/30 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
        <div className="space-y-1">
          <h3 className="text-2xl font-bold font-serif text-charcoal flex items-center gap-2">
            <Heart className="w-6 h-6 text-forest fill-forest/20" />
            부모를 위한 가정 내 독서 지도 팁 & 대화 가이드
          </h3>
          <p className="text-xs text-charcoal-light">
            독서의 주도권을 아이에게 전달하고 지적 호기심을 확장하는 단계별 부모 가이드입니다.
          </p>
        </div>

        {/* Stage Tabs (Before / During / After Reading) */}
        <div className="flex border-b border-oak/30 text-xs font-bold">
          <button
            onClick={() => setActiveParentTab('before')}
            className={`px-5 py-3 border-b-2 transition-all ${
              activeParentTab === 'before'
                ? 'border-forest text-forest bg-forest/5'
                : 'border-transparent text-charcoal-muted hover:text-charcoal'
            }`}
          >
            1. 읽기 전 (Before Reading)
          </button>
          <button
            onClick={() => setActiveParentTab('during')}
            className={`px-5 py-3 border-b-2 transition-all ${
              activeParentTab === 'during'
                ? 'border-forest text-forest bg-forest/5'
                : 'border-transparent text-charcoal-muted hover:text-charcoal'
            }`}
          >
            2. 읽는 중 (During Reading)
          </button>
          <button
            onClick={() => setActiveParentTab('after')}
            className={`px-5 py-3 border-b-2 transition-all ${
              activeParentTab === 'after'
                ? 'border-forest text-forest bg-forest/5'
                : 'border-transparent text-charcoal-muted hover:text-charcoal'
            }`}
          >
            3. 읽은 후 (After Reading)
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-5 bg-cream-light rounded-2xl border border-oak/20 space-y-3">
          {activeParentTab === 'before' && (
            <div className="space-y-2 text-xs sm:text-sm text-charcoal">
              {data.parentGuide.beforeReading.map((tip, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-3 bg-cream rounded-xl border border-oak/15">
                  <CheckCircle className="w-4 h-4 text-forest shrink-0 mt-0.5" />
                  <p className="leading-relaxed font-medium">{tip}</p>
                </div>
              ))}
            </div>
          )}

          {activeParentTab === 'during' && (
            <div className="space-y-2 text-xs sm:text-sm text-charcoal">
              {data.parentGuide.duringReading.map((tip, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-3 bg-cream rounded-xl border border-oak/15">
                  <CheckCircle className="w-4 h-4 text-forest shrink-0 mt-0.5" />
                  <p className="leading-relaxed font-medium">{tip}</p>
                </div>
              ))}
            </div>
          )}

          {activeParentTab === 'after' && (
            <div className="space-y-2 text-xs sm:text-sm text-charcoal">
              {data.parentGuide.afterReading.map((tip, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-3 bg-cream rounded-xl border border-oak/15">
                  <CheckCircle className="w-4 h-4 text-forest shrink-0 mt-0.5" />
                  <p className="leading-relaxed font-medium">{tip}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Parent Discussion Question Cards */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold font-serif text-charcoal flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-oak-dark" />
            아이와 나눌 추천 독후 질문지 (Discussion Starter)
          </h4>
          <div className="grid sm:grid-cols-3 gap-4">
            {data.parentGuide.discussionQuestions.map((q, idx) => (
              <div key={idx} className="p-4 bg-cream-light rounded-2xl border border-oak/30 space-y-2">
                <span className="text-[10px] font-bold text-oak-dark bg-oak/20 px-2 py-0.5 rounded">
                  질문 0{idx + 1}
                </span>
                <p className="text-xs text-charcoal font-medium leading-relaxed italic">
                  "{q}"
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
