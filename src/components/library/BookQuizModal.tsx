import React, { useState } from 'react';
import type { Book } from '../../types';
import { CheckCircle2, Award, Sparkles, X, ArrowRight } from 'lucide-react';
import { BookCoverImage } from '../common/BookCoverImage';

interface BookQuizModalProps {
  book: Book;
  onClose: () => void;
  onComplete: (score: number, exp: number) => void;
}

export const BookQuizModal: React.FC<BookQuizModalProps> = ({ book, onClose, onComplete }) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Generate 3-Step Mini Quiz questions dynamically for the book
  const quizQuestions = [
    {
      id: 1,
      category: '1. 핵심 교과 어휘',
      question: `'${book.title}'에서 등장하는 핵심 어휘의 정확한 의미로 올바른 것은 무엇인가요?`,
      options: [
        '주인공의 용기 있는 마음과 행동을 뜻한다',
        '서로 사이좋게 지내며 양보하는 태도를 의미한다',
        '어려운 상황을 지혜롭게 해결하는 생각을 뜻한다',
        '이야기의 사건이 매끄럽게 전개되는 것을 의미한다'
      ],
      correctAnswer: 0,
      explanation: '이야기 속 맥락과 핵심 주제에 부합하는 교과 핵심 어휘의 정의입니다.'
    },
    {
      id: 2,
      category: '2. 사건 인과 관계 및 사실 이해',
      question: `'${book.title}'의 이야기 전개에서 결정적인 사건이 일어난 원인은 무엇인가요?`,
      options: [
        '주인공이 새로운 도전을 결심했기 때문이다',
        '친구와 오해가 생겨 솔직하게 대화를 나누었기 때문이다',
        '새로운 장소로 이동하며 새로운 문제에 직면했기 때문이다',
        '이야기 시작 부분의 뜻밖의 사건으로 촉발되었기 때문이다'
      ],
      correctAnswer: 1,
      explanation: '이야기의 원인과 결과(인과 관계)를 정밀하게 파악하는 문항입니다.'
    },
    {
      id: 3,
      category: '3. 맥락 추론 및 등장인물 동기',
      question: `주인공이 이야기 후반부에 보여준 행동을 통해 추론할 수 있는 성격과 동기는 무엇인가요?`,
      options: [
        '시련을 이겨내고 타인을 이해하는 성숙한 태도',
        '자기 주장을 솔직하게 표현하는 솔직함',
        '새로운 지식을 탐구하고자 하는 강한 호기심',
        '규칙을 준수하고 책임감을 다하려는 노력'
      ],
      correctAnswer: 0,
      explanation: '행간 읽기를 통해 등장인물의 숨겨진 동기와 정서를 추론하는 고차 독해 문항입니다.'
    }
  ];

  const handleSelectOption = (optIdx: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [currentIdx]: optIdx }));
  };

  const handleNext = () => {
    if (currentIdx < quizQuestions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setIsSubmitted(true);
    }
  };

  const calculateScore = () => {
    let correctCount = 0;
    quizQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        correctCount++;
      }
    });
    return Math.round((correctCount / quizQuestions.length) * 100);
  };

  const score = calculateScore();
  const expEarned = score >= 60 ? 100 : 50;

  const handleFinish = () => {
    onComplete(score, expEarned);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-cream-light border-2 border-oak/40 rounded-3xl shadow-elevated overflow-hidden flex flex-col my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-forest text-white">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-oak" />
            <span className="text-sm font-bold font-serif">
              완독 검증 3-Step 미니 형성평가
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-forest-light transition-colors text-cream-card hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          
          {/* Target Book Info Bar */}
          <div className="flex items-center gap-3 p-3 bg-cream-card rounded-2xl border border-oak/20">
            <BookCoverImage
              src={book.coverImage}
              alt={book.title}
              className="w-10 h-14 object-cover rounded-lg border border-oak/30 shadow-xs shrink-0"
            />
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-oak-dark bg-oak/15 px-2 py-0.5 rounded inline-block">
                완독 평가 대상 도서
              </span>
              <h4 className="text-xs sm:text-sm font-bold font-serif text-charcoal line-clamp-1">
                {book.title}
              </h4>
            </div>
          </div>

          {!isSubmitted ? (
            /* Quiz Questions Step */
            <div className="space-y-5">
              
              {/* Question Category & Counter */}
              <div className="flex items-center justify-between text-xs border-b border-cream-dark pb-2">
                <span className="font-bold text-forest bg-forest/10 px-2.5 py-1 rounded-full">
                  {quizQuestions[currentIdx].category}
                </span>
                <span className="text-charcoal-muted font-semibold">
                  문항 {currentIdx + 1} / {quizQuestions.length}
                </span>
              </div>

              {/* Question Text */}
              <h3 className="text-sm sm:text-base font-bold text-charcoal leading-relaxed font-serif">
                Q{currentIdx + 1}. {quizQuestions[currentIdx].question}
              </h3>

              {/* Options List */}
              <div className="space-y-2.5">
                {quizQuestions[currentIdx].options.map((opt, optIdx) => {
                  const isSelected = selectedAnswers[currentIdx] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full text-left p-3.5 rounded-2xl text-xs font-medium transition-all border flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-forest text-white border-forest shadow-md font-bold'
                          : 'bg-cream-card text-charcoal border-oak/20 hover:bg-cream-dark'
                      }`}
                    >
                      <span className="leading-snug">{optIdx + 1}. {opt}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-oak shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Action Next Button */}
              <div className="pt-2 flex justify-end">
                <button
                  disabled={selectedAnswers[currentIdx] === undefined}
                  onClick={handleNext}
                  className="px-6 py-2.5 bg-forest disabled:opacity-40 text-white font-bold text-xs rounded-xl shadow-md transition-all inline-flex items-center gap-1.5"
                >
                  <span>{currentIdx < quizQuestions.length - 1 ? '다음 문항' : '퀴즈 제출 및 평가 완료'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          ) : (
            /* Quiz Result & EXP Reward View */
            <div className="py-6 text-center space-y-5 animate-fadeIn">
              <div className="w-16 h-16 bg-oak/20 rounded-3xl flex items-center justify-center mx-auto text-forest text-3xl shadow-inner">
                🏆
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-bold font-serif text-charcoal">
                  3-Step 형성평가 검증 완료!
                </h3>
                <p className="text-xs text-charcoal-muted">
                  총점 <span className="font-bold text-forest text-base">{score}점</span>을 받으셨습니다.
                </p>
              </div>

              <div className="p-4 bg-forest/10 rounded-2xl border border-forest/20 text-xs text-forest-dark space-y-1">
                <div className="font-bold flex items-center justify-center gap-1">
                  <Award className="w-4 h-4 text-oak" />
                  <span>완독 축하 경험치 +{expEarned} EXP 획득!</span>
                </div>
                <p className="text-[11px] text-charcoal-muted">
                  도서가 완독 서가 목록으로 안전하게 이동되었습니다.
                </p>
              </div>

              <button
                onClick={handleFinish}
                className="w-full py-3 bg-forest hover:bg-forest-dark text-white font-bold text-xs rounded-xl shadow-md transition-all"
              >
                완독 서가 확인하기
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
