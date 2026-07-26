import React, { useState } from 'react';
import { SAMPLE_QUIZZES } from '../data/mockData';
import { X, CheckCircle2, Award, BookOpen, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';

interface DiagnosisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToBookshelf: () => void;
}

export const DiagnosisModal: React.FC<DiagnosisModalProps> = ({ isOpen, onClose, onNavigateToBookshelf }) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [childGrade, setChildGrade] = useState<string>('초등 3~4학년');
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentQuiz = SAMPLE_QUIZZES[currentStep];

  const handleSelectOption = (index: number) => {
    const updated = [...selectedAnswers];
    updated[currentStep] = index;
    setSelectedAnswers(updated);
  };

  const handleNext = () => {
    if (currentStep < SAMPLE_QUIZZES.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setSelectedAnswers([]);
    setIsCompleted(false);
  };

  // Calculate Scores
  const correctCount = selectedAnswers.reduce((acc, ans, idx) => {
    return ans === SAMPLE_QUIZZES[idx].answer ? acc + 1 : acc;
  }, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-cream-light border-2 border-oak/40 rounded-3xl shadow-elevated overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-cream-dark bg-forest text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-oak text-forest flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-serif">
                북핏(BookFit) 3D 정밀 문해력 진단
              </h3>
              <p className="text-xs text-cream-card/80">
                어휘력 · 추론력 · 메타인지 종합 진단 테스트
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-cream-card hover:text-white rounded-full hover:bg-forest-light transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        {!isCompleted ? (
          <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
            
            {/* Grade Selection */}
            <div className="flex items-center justify-between bg-cream-card p-3 rounded-xl border border-oak/20">
              <span className="text-xs font-bold text-charcoal">진단 대상 학년:</span>
              <select
                value={childGrade}
                onChange={(e) => setChildGrade(e.target.value)}
                className="bg-cream-light border border-oak/40 text-charcoal text-xs font-semibold rounded-lg px-3 py-1.5 focus:outline-none focus:border-forest"
              >
                <option>초등 1~2학년</option>
                <option>초등 3~4학년</option>
                <option>초등 5~6학년</option>
              </select>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-charcoal font-semibold">
                <span>문항 {currentStep + 1} / {SAMPLE_QUIZZES.length}</span>
                <span className="text-forest">{currentQuiz.categoryLabel}</span>
              </div>
              <div className="w-full bg-cream-dark h-2 rounded-full overflow-hidden">
                <div
                  className="bg-forest h-full rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / SAMPLE_QUIZZES.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Quiz Passage Card */}
            {currentQuiz.passage && (
              <div className="p-4 bg-[#FAF5EE] rounded-xl border-l-4 border-oak text-xs text-charcoal leading-relaxed font-serif">
                <span className="block text-[10px] text-oak-dark font-sans font-bold uppercase mb-1">
                  [제시문]
                </span>
                "{currentQuiz.passage}"
              </div>
            )}

            {/* Question Title */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-forest bg-forest/10 px-2.5 py-0.5 rounded-full">
                Q{currentStep + 1}. {currentQuiz.categoryLabel}
              </span>
              <h4 className="text-base sm:text-lg font-bold text-charcoal leading-snug">
                {currentQuiz.question}
              </h4>
            </div>

            {/* Options List */}
            <div className="space-y-2.5 pt-2">
              {currentQuiz.options.map((opt: string, idx: number) => {
                const isSelected = selectedAnswers[currentStep] === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-forest/10 border-forest text-forest font-bold shadow-sm'
                        : 'bg-cream-light border-oak/30 text-charcoal hover:bg-cream-card'
                    }`}
                  >
                    <span>{idx + 1}. {opt}</span>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-forest shrink-0" />}
                  </button>
                );
              })}
            </div>

          </div>
        ) : (
          /* Result Summary Screen */
          <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-center">
            
            <div className="w-16 h-16 rounded-full bg-forest/10 text-forest mx-auto flex items-center justify-center border-2 border-forest/30 shadow-md">
              <Award className="w-9 h-9 text-oak-dark" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-oak-dark bg-oak/15 px-3 py-1 rounded-full">
                {childGrade} 진단 완료
              </span>
              <h4 className="text-2xl font-bold font-serif text-charcoal">
                우리 아이 맞춤 독서 핏 분석 결과
              </h4>
              <p className="text-xs text-charcoal-muted">
                정밀 측정된 종합 문해력 핏 점수입니다.
              </p>
            </div>

            {/* Score Showcase Box */}
            <div className="p-5 bg-cream-card rounded-2xl border border-oak/30 max-w-md mx-auto space-y-4">
              <div className="flex justify-around items-center divide-x divide-oak/20">
                <div className="px-3">
                  <p className="text-[11px] text-charcoal-muted">진단 맞춤율</p>
                  <p className="text-2xl font-bold text-forest font-serif mt-0.5">
                    {Math.round((correctCount / SAMPLE_QUIZZES.length) * 100)}%
                  </p>
                </div>
                <div className="px-3">
                  <p className="text-[11px] text-charcoal-muted">어휘 추천 레벨</p>
                  <p className="text-xl font-bold text-oak-dark font-serif mt-0.5">
                    Level 3.2
                  </p>
                </div>
                <div className="px-3">
                  <p className="text-[11px] text-charcoal-muted">권장 3-Track</p>
                  <p className="text-xs font-bold text-forest mt-1">
                    70:10:20 표준
                  </p>
                </div>
              </div>

              <div className="p-3 bg-[#FAF5EE] rounded-xl text-left text-xs space-y-1.5 border border-oak/20">
                <p className="font-bold text-forest flex items-center gap-1">
                  <BookOpen className="w-4 h-4 text-oak" />
                  북핏 총평 리포트
                </p>
                <p className="text-charcoal leading-relaxed">
                  어휘 이해력과 상황 맥락 파악 능력이 뛰어납니다. <strong className="text-forest font-semibold">적정 도서 70%</strong>로 읽기 몰입감을 유지하면서, 약간의 비유적 속담 도서(<strong className="text-oak-dark font-semibold">보완 도서 20%</strong>)를 병행하면 독해력이 급격히 성장할 것입니다.
                </p>
              </div>
            </div>

          </div>
        )}

        {/* Footer Actions */}
        <div className="p-4 bg-cream-card border-t border-cream-dark flex items-center justify-between gap-3">
          {!isCompleted ? (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-charcoal-muted hover:text-charcoal"
              >
                다음에 하기
              </button>
              <button
                disabled={selectedAnswers[currentStep] === undefined}
                onClick={handleNext}
                className={`px-6 py-2.5 text-xs font-bold text-white rounded-xl shadow-md transition-all flex items-center gap-2 ${
                  selectedAnswers[currentStep] !== undefined
                    ? 'bg-forest hover:bg-forest-dark'
                    : 'bg-charcoal-muted/50 cursor-not-allowed'
                }`}
              >
                <span>{currentStep === SAMPLE_QUIZZES.length - 1 ? '진단 결과 확인' : '다음 문항'}</span>
                <ArrowRight className="w-4 h-4 text-oak" />
              </button>
            </>
          ) : (
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={handleReset}
                className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-charcoal border border-oak/40 hover:bg-cream-dark rounded-xl flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                다시 진단하기
              </button>
              <button
                onClick={() => {
                  onClose();
                  onNavigateToBookshelf();
                }}
                className="w-full sm:w-auto px-6 py-2.5 bg-forest hover:bg-forest-dark text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-2"
              >
                <span>맞춤 큐레이션 서가로 이동</span>
                <ArrowRight className="w-4 h-4 text-oak" />
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
