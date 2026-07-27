import React, { useState, useEffect } from 'react';
import type { DetailedQuestion } from '../../types';
import { Clock, ChevronLeft, ChevronRight, CheckCircle2, AlertCircle, BookOpen, Sparkles } from 'lucide-react';

interface QuizInterfaceProps {
  questions: DetailedQuestion[];
  onComplete: (userAnswers: Record<number, number>) => void;
  onCancel: () => void;
}

export const QuizInterface: React.FC<QuizInterfaceProps> = ({ questions, onComplete, onCancel }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  // Reset quiz state when component mounts or questions prop updates
  useEffect(() => {
    setCurrentIndex(0);
    setUserAnswers({});
  }, [questions]);

  const currentQ = questions[currentIndex] || questions[0];
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  // Time Attack Timer Effect
  useEffect(() => {
    if (currentQ?.questionType === 'timeattack' && currentQ.timeLimitSeconds) {
      setTimeLeft(currentQ.timeLimitSeconds);
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setTimeLeft(null);
    }
  }, [currentIndex, currentQ]);

  const handleSelectOption = (optionIndex: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optionIndex,
    }));
  };

  const handleNext = () => {
    console.log("제출된 답안 리스트 (진행 중):", userAnswers);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      console.log("제출된 답안 리스트 (최종 완료):", userAnswers);
      onComplete(userAnswers);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const isCurrentAnswered = userAnswers[currentQ.id] !== undefined;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12 space-y-6">
      
      {/* Quiz Top Header & Progress Bar */}
      <div className="bg-cream-light border border-oak/30 rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-forest bg-forest/10 px-3 py-1 rounded-full">
              {currentQ.domainName}
            </span>
            <span className="text-xs font-semibold text-charcoal-muted">
              문항 {currentIndex + 1} / {questions.length}
            </span>
          </div>

          {/* Countdown Timer for Time-Attack Questions */}
          {timeLeft !== null && (
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-xs font-bold ${
              timeLeft <= 5 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-oak/20 text-oak-dark'
            }`}>
              <Clock className="w-3.5 h-3.5" />
              <span>제한시간: {timeLeft}초</span>
            </div>
          )}

          <div className="text-xs font-bold text-oak-dark">
            진도율 {progressPercent}%
          </div>
        </div>

        {/* Progress Bar Track */}
        <div className="w-full bg-cream-dark h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-forest via-forest-light to-oak h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-cream-light border-2 border-oak/40 rounded-3xl p-6 sm:p-8 shadow-elevated space-y-6">
        
        {/* Domain Badge & Question Type */}
        <div className="flex items-center justify-between border-b border-cream-dark pb-4">
          <span className="text-xs font-bold text-oak-dark flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-oak" />
            {currentQ.domain === 'decoding' && '⚡ 기초 해독 유창성 (타임어택)'}
            {currentQ.domain === 'vocabulary' && '📚 어휘 & 문장구조 진단'}
            {currentQ.domain === 'comprehension' && '🔍 고차 독해 & 추론 사고력'}
            {currentQ.domain === 'metacognition' && '🧠 메타인지 독서 전략 점검'}
          </span>

          <button
            onClick={onCancel}
            className="text-xs text-charcoal-muted hover:text-charcoal underline"
          >
            진단 중단
          </button>
        </div>

        {/* Passage Area (For High Comprehension Questions) */}
        {currentQ.passageContent && (
          <div className="p-5 bg-[#FAF5EE] rounded-2xl border-l-4 border-forest text-charcoal space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-forest">
              <BookOpen className="w-4 h-4 text-oak" />
              <span>{currentQ.passageTitle || '제시문'}</span>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed font-serif whitespace-pre-line">
              {currentQ.passageContent}
            </p>
          </div>
        )}

        {/* Question Prompt */}
        <h3 className="text-base sm:text-xl font-bold font-serif text-charcoal leading-snug whitespace-pre-line">
          Q{currentIndex + 1}. {currentQ.question}
        </h3>

        {/* Options List */}
        <div className="space-y-3 pt-2">
          {currentQ.options.map((option, idx) => {
            const isSelected = userAnswers[currentQ.id] === idx;
            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm font-medium transition-all duration-200 flex items-center justify-between group ${
                  isSelected
                    ? 'bg-forest/15 border-forest text-forest font-bold shadow-md translate-x-1'
                    : 'bg-cream border-oak/30 text-charcoal hover:bg-cream-card hover:border-oak/60'
                }`}
              >
                <span className="leading-relaxed">
                  <strong className="mr-2 font-serif text-oak-dark group-hover:text-forest">
                    {idx + 1}.
                  </strong>
                  {option}
                </span>

                {isSelected ? (
                  <CheckCircle2 className="w-5 h-5 text-forest shrink-0 ml-2" />
                ) : (
                  <div className="w-5 h-5 rounded-full border border-oak/40 group-hover:border-forest shrink-0 ml-2" />
                )}
              </button>
            );
          })}
        </div>

        {/* Unanswered Notice */}
        {!isCurrentAnswered && (
          <div className="flex items-center gap-1.5 text-xs text-oak-dark bg-oak/10 p-3 rounded-xl">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>답안을 선택해야 다음 문항으로 이동할 수 있습니다.</span>
          </div>
        )}

      </div>

      {/* Navigation Buttons (Prev / Next) */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`px-5 py-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all flex items-center gap-1 ${
            currentIndex === 0
              ? 'opacity-40 cursor-not-allowed border-cream-dark text-charcoal-muted'
              : 'border-oak/40 bg-cream-light text-charcoal hover:bg-cream-card'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>이전 문항</span>
        </button>

        <button
          onClick={handleNext}
          disabled={!isCurrentAnswered}
          className={`px-8 py-3 rounded-xl text-xs sm:text-sm font-bold text-white shadow-elevated transition-all flex items-center gap-2 ${
            isCurrentAnswered
              ? 'bg-forest hover:bg-forest-dark transform hover:-translate-y-0.5'
              : 'bg-charcoal-muted/40 cursor-not-allowed'
          }`}
        >
          <span>{currentIndex === questions.length - 1 ? '검사 완료 & 결과 생성' : '다음 문항으로'}</span>
          <ChevronRight className="w-4 h-4 text-oak" />
        </button>
      </div>

    </div>
  );
};
