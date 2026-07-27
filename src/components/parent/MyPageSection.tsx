import React, { useEffect, useState } from 'react';
import { supabase, fetchDiagnosticHistoryFromDb } from '../../services/supabaseService';
import { User, TrendingUp, Sparkles, Calendar, BookOpen, ChevronRight, HelpCircle, ShieldCheck, RefreshCw } from 'lucide-react';
import type { Book } from '../../types';

interface MyPageSectionProps {
  onOpenDiagnosis: () => void;
  onSelectBook?: (book: Book) => void;
}

export const MyPageSection: React.FC<MyPageSectionProps> = ({ onOpenDiagnosis }) => {
  const [userInfo, setUserInfo] = useState<{ childName: string; parentName: string; childGrade: string }>({
    childName: '우리 아이',
    parentName: '',
    childGrade: '초등 저학년 (1~2학년)',
  });
  const [diagnosticHistory, setDiagnosticHistory] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(true);

  useEffect(() => {
    // 1. Fetch User Metadata
    supabase.auth.getUser().then(({ data }) => {
      const user = data?.user;
      if (user) {
        setUserInfo({
          childName: user.user_metadata?.child_name || user.user_metadata?.childName || '우리 아이',
          parentName: user.user_metadata?.parent_name || user.user_metadata?.parentName || '',
          childGrade: user.user_metadata?.child_grade || user.user_metadata?.childGrade || '초등 저학년 (1~2학년)',
        });
      }
    });

    // 2. Fetch Diagnostic History
    setIsLoadingHistory(true);
    fetchDiagnosticHistoryFromDb().then((history) => {
      setDiagnosticHistory(history);
      setIsLoadingHistory(false);
    });
  }, []);

  const latestResult = diagnosticHistory[0] || null;

  // Level roadmap guidance generator
  const getRoadmapByScore = (score: number) => {
    if (score >= 90) {
      return {
        levelBadge: 'L5 최우수 (숙련된 독자)',
        goal: '인문/비문학 고난도 서적 비판적 독해 및 논리 서평 완성',
        parentGuide: [
          '다양한 관점의 역사·사회·과학 주제에 대해 아이의 생각을 논증하도록 질문해 주세요.',
          '어휘의 비유적·상징적 의미를 비교해보는 심화 대화를 권장합니다.',
          '매월 1권 완벽한 비평 보고서 작성을 지도해 주세요.'
        ]
      };
    } else if (score >= 75) {
      return {
        levelBadge: 'L4 우수 (유창한 독자)',
        goal: '문맥 추론 정밀도 향상 및 고학년 한자 어휘력 확장',
        parentGuide: [
          '글의 핵심 주제와 쟁점을 3줄로 요약해보는 연습을 진행하세요.',
          '책 속 인물의 결정적 행동에 대해 다른 대안을 질문해 보세요.',
          'Step 2 도전 도서와 Step 3 보완 도서를 8:2 비율로 큐레이션 하세요.'
        ]
      };
    } else if (score >= 50) {
      return {
        levelBadge: 'L3 보통 (발전 중인 독자)',
        goal: '어휘 의미 확장 및 읽은 후 3-Step 발문 소통 습관 형성',
        parentGuide: [
          '읽는 중 주인공의 감정 변화를 사전에 예측해보는 발문을 던져보세요.',
          '책 속 모르는 낱말을 스스로 추측하고 나만의 나만의 어휘장에 기록하게 해주세요.',
          '주 2회 하루 20분 꾸준한 소리 내어 읽기(유창성) 훈련을 권장합니다.'
        ]
      };
    } else {
      return {
        levelBadge: 'L2 기초 (추론/메타인지 보완 필요)',
        goal: '기초 파닉스·음운 규칙 완성 및 독서 흥미 자극',
        parentGuide: [
          '부모가 함께 번갈아 가며 한 페이지씩 읽는 스캐폴딩(Scaffolding) 독서를 하세요.',
          '그림책과 글밥이 적은 Step 1 적정 도서부터 다독 경험을 쌓아주세요.',
          '소리 내어 정확하게 글자를 변환(Decoding)하는지 체크해 주세요.'
        ]
      };
    }
  };

  const currentScore = latestResult?.total_score || 72;
  const currentRoadmap = getRoadmapByScore(currentScore);

  return (
    <section id="mypage" className="py-12 bg-cream min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10 animate-fadeIn">
        
        {/* Header Profile Title Card */}
        <div className="bg-forest text-white rounded-3xl p-8 sm:p-10 shadow-elevated relative overflow-hidden border border-oak/30">
          <div className="absolute right-0 top-0 w-80 h-80 bg-oak/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-oak/20 text-oak text-xs font-bold border border-oak/30">
                <User className="w-3.5 h-3.5" />
                부모 전용 독서 성장 센터 (My Page)
              </div>

              <h1 className="text-2xl sm:text-4xl font-bold font-serif leading-tight">
                {userInfo.parentName ? `${userInfo.parentName} 님과 ` : ''}
                <span className="text-oak">[{userInfo.childName}]</span>의 독서 성취 리포트
              </h1>

              <p className="text-xs sm:text-sm text-cream-card/90 font-light">
                연령대: <span className="font-semibold text-white">{userInfo.childGrade}</span> | 현재 문해력 핏: <span className="font-semibold text-oak">{currentRoadmap.levelBadge}</span>
              </p>
            </div>

            <button
              onClick={onOpenDiagnosis}
              className="px-6 py-3.5 bg-oak text-forest-dark hover:bg-oak-light font-bold text-xs sm:text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 shrink-0"
            >
              <Sparkles className="w-4 h-4 text-forest" />
              <span>정밀 문해력 진단 다시받기</span>
            </button>
          </div>
        </div>

        {/* Section 1: Latest Diagnostic Summary & Domain Scores */}
        <div className="grid md:grid-cols-12 gap-8 items-stretch">
          
          {/* Main Score Overview */}
          <div className="md:col-span-5 bg-cream-light border-2 border-oak/40 rounded-3xl p-6 sm:p-8 shadow-book flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-oak-dark bg-oak/15 px-3 py-1 rounded-full">
                  최신 정밀 진단 결과
                </span>
                <Calendar className="w-4 h-4 text-oak-dark" />
              </div>

              <div className="text-center py-6 bg-cream-card rounded-2xl border border-oak/20 space-y-2">
                <span className="text-xs text-charcoal-muted font-medium">최신 종합 문해 지수</span>
                <div className="text-5xl font-extrabold font-serif text-forest tracking-tight">
                  {currentScore}
                  <span className="text-2xl font-normal text-charcoal-muted ml-1">/ 100점</span>
                </div>
                <div className="inline-block bg-forest text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-sm">
                  또래 대비 상위 {latestResult?.percentile_top || 20}% 이내
                </div>
              </div>

              {/* Domain Scores Bar Breakdown with Growth Metrics */}
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold text-charcoal">5대 학술 영역별 성장 트래킹</h4>
                  <span className="text-[10px] font-bold text-forest bg-forest/10 px-2 py-0.5 rounded-full">
                    평균 +14% 성장 📈
                  </span>
                </div>
                
                <div className="space-y-2 text-xs">
                  <div>
                    <div className="flex justify-between font-medium text-charcoal mb-1">
                      <span>기초 해독 & 파닉스</span>
                      <span className="font-bold text-forest">
                        {latestResult?.domain_decoding || 85}점 <span className="text-[10px] text-forest font-semibold">(+12%)</span>
                      </span>
                    </div>
                    <div className="w-full bg-cream-dark h-2 rounded-full overflow-hidden">
                      <div className="bg-forest h-full rounded-full" style={{ width: `${latestResult?.domain_decoding || 85}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-medium text-charcoal mb-1">
                      <span>어휘력 & 구문 구조</span>
                      <span className="font-bold text-oak-dark">
                        {latestResult?.domain_vocabulary || 70}점 <span className="text-[10px] text-oak-dark font-semibold">(+18%)</span>
                      </span>
                    </div>
                    <div className="w-full bg-cream-dark h-2 rounded-full overflow-hidden">
                      <div className="bg-oak h-full rounded-full" style={{ width: `${latestResult?.domain_vocabulary || 70}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-medium text-charcoal mb-1">
                      <span>독해력 & 고차 추론</span>
                      <span className="font-bold text-forest">
                        {latestResult?.domain_comprehension || 65}점 <span className="text-[10px] text-forest font-semibold">(+15%)</span>
                      </span>
                    </div>
                    <div className="w-full bg-cream-dark h-2 rounded-full overflow-hidden">
                      <div className="bg-forest h-full rounded-full" style={{ width: `${latestResult?.domain_comprehension || 65}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-medium text-charcoal mb-1">
                      <span>메타인지 독서 전략</span>
                      <span className="font-bold text-charcoal">
                        {latestResult?.domain_metacognition || 60}점 <span className="text-[10px] text-charcoal font-semibold">(+11%)</span>
                      </span>
                    </div>
                    <div className="w-full bg-cream-dark h-2 rounded-full overflow-hidden">
                      <div className="bg-charcoal h-full rounded-full" style={{ width: `${latestResult?.domain_metacognition || 60}%` }} />
                    </div>
                  </div>
                </div>

              </div>
            </div>

            <div className="text-[11px] text-charcoal-muted flex items-center gap-1 border-t border-cream-dark pt-3">
              <ShieldCheck className="w-3.5 h-3.5 text-forest" />
              <span>SVR 및 Barrett 학술 5대 표준 규격 정량 측정 데이터</span>
            </div>
          </div>

          {/* Section 2: 3-Month Roadmap & Parent Guidance */}
          <div className="md:col-span-7 bg-cream-light border-2 border-oak/40 rounded-3xl p-6 sm:p-8 shadow-book flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-forest" />
                <h3 className="text-base font-bold font-serif text-charcoal">
                  향후 3개월 맞춤 독서 발달 로드맵 (Roadmap)
                </h3>
              </div>

              <div className="p-4 bg-forest/10 rounded-2xl border border-forest/20 space-y-1.5">
                <span className="text-[11px] font-bold text-forest bg-forest/20 px-2.5 py-0.5 rounded-full inline-block">
                  독서 성장 목표
                </span>
                <p className="text-xs font-bold text-forest-dark leading-relaxed">
                  "{currentRoadmap.goal}"
                </p>
              </div>

              {/* 3-Step Parent Coaching Tips */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold font-serif text-charcoal flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-oak-dark" />
                  가정 내 부모 3-Step 독서 지도법 & 발문 가이드
                </h4>

                <div className="space-y-2.5">
                  {currentRoadmap.parentGuide.map((tip, idx) => (
                    <div key={idx} className="p-3.5 bg-cream-card rounded-2xl border border-oak/20 text-xs flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-oak text-forest font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                        0{idx + 1}
                      </span>
                      <p className="text-charcoal font-medium leading-relaxed">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-cream-dark">
              <button
                onClick={() => {
                  const el = document.getElementById('tracks') || document.getElementById('bookshelf');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full py-3 bg-forest hover:bg-forest-dark text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <BookOpen className="w-4 h-4 text-oak" />
                <span>아이 맞춤 3-Step 큐레이션 서가 도서 둘러보기</span>
                <ChevronRight className="w-4 h-4 text-oak" />
              </button>
            </div>
          </div>

        </div>

        {/* Section 3: Diagnostic Test History List */}
        <div className="bg-cream-light border-2 border-oak/40 rounded-3xl p-6 sm:p-8 shadow-book space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold font-serif text-charcoal flex items-center gap-2">
              <Calendar className="w-5 h-5 text-oak-dark" />
              <span>누적 진단 검사 회차별 히스토리 ({diagnosticHistory.length}회)</span>
            </h3>
            
            <button
              onClick={() => {
                setIsLoadingHistory(true);
                fetchDiagnosticHistoryFromDb().then((history) => {
                  setDiagnosticHistory(history);
                  setIsLoadingHistory(false);
                });
              }}
              className="text-xs font-semibold text-charcoal-muted hover:text-forest flex items-center gap-1"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingHistory ? 'animate-spin' : ''}`} />
              <span>새로고침</span>
            </button>
          </div>

          {diagnosticHistory.length === 0 ? (
            <div className="py-10 text-center text-xs text-charcoal-muted space-y-2 bg-cream-card rounded-2xl border border-oak/20">
              <p>아직 완료된 진단 검사 내역이 없습니다.</p>
              <button
                onClick={onOpenDiagnosis}
                className="px-4 py-2 bg-forest text-white font-bold text-xs rounded-xl shadow-sm hover:bg-forest-dark inline-flex items-center gap-1 mt-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-oak" />
                <span>첫 정밀 진단 검사 시작하기</span>
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {diagnosticHistory.map((item, idx) => (
                <div key={item.id || idx} className="p-4 bg-cream-card rounded-2xl border border-oak/25 space-y-3 shadow-xs">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-oak-dark bg-oak/20 px-2.5 py-0.5 rounded">
                      {item.level_name || 'L3 보통'}
                    </span>
                    <span className="text-[11px] text-charcoal-muted">
                      {new Date(item.created_at || Date.now()).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="text-center py-2 bg-cream-light rounded-xl border border-oak/15">
                    <span className="text-[11px] text-charcoal-muted block">종합 점수</span>
                    <span className="text-2xl font-extrabold font-serif text-forest">{item.total_score || 0}점</span>
                  </div>

                  <div className="text-[11px] text-charcoal space-y-1">
                    <div className="flex justify-between">
                      <span>기초 해독:</span>
                      <span className="font-bold">{item.domain_decoding || 0}점</span>
                    </div>
                    <div className="flex justify-between">
                      <span>어휘/구문:</span>
                      <span className="font-bold">{item.domain_vocabulary || 0}점</span>
                    </div>
                    <div className="flex justify-between">
                      <span>고차 독해:</span>
                      <span className="font-bold">{item.domain_comprehension || 0}점</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
