import React, { useState, useEffect } from 'react';
import { DIAGNOSTIC_QUESTIONS, DEFAULT_MOCK_RESULT } from '../../data/diagnosticData';
import { QuizInterface } from './QuizInterface';
import { DiagnosticReport } from './DiagnosticReport';
import type { DiagnosticResultData, Book, DomainCategory } from '../../types';
import { saveDiagnosticResultToDb, getLatestDiagnosticResultFromDb } from '../../services/supabaseService';
import { MOCK_BOOKS } from '../../data/mockData';

interface DiagnosisFlowProps {
  onCancel: () => void;
  onSelectBook: (book: Book) => void;
}

export const DiagnosisFlow: React.FC<DiagnosisFlowProps> = ({ onCancel, onSelectBook }) => {
  const [currentStep, setCurrentStep] = useState<'quiz' | 'report'>('quiz');
  const [reportData, setReportData] = useState<DiagnosticResultData>(DEFAULT_MOCK_RESULT);

  useEffect(() => {
    // Attempt to load latest saved report if available
    getLatestDiagnosticResultFromDb().then((savedResult) => {
      if (savedResult) {
        setReportData(savedResult);
      }
    });
  }, []);

  const handleQuizComplete = async (answers: Record<number, number>) => {
    console.log("제출된 답안 리스트 (수신):", answers);

    // 1. Domain-specific scoring calculation
    const domainCounts: Record<DomainCategory, { correct: number; total: number }> = {
      decoding: { correct: 0, total: 0 },
      vocabulary: { correct: 0, total: 0 },
      comprehension: { correct: 0, total: 0 },
      metacognition: { correct: 0, total: 0 },
    };

    let totalCorrectCount = 0;
    const totalQuestionsCount = DIAGNOSTIC_QUESTIONS.length;

    DIAGNOSTIC_QUESTIONS.forEach((q) => {
      const domain = q.domain || 'vocabulary';
      domainCounts[domain].total += 1;

      const userAnswer = answers[q.id];
      
      if (q.correctAnswer !== undefined) {
        // 1) 객관식 문항: String 변환으로 안전한 정답 비교 (Type casting)
        const isCorrect = userAnswer !== undefined && String(userAnswer) === String(q.correctAnswer);
        if (isCorrect) {
          domainCounts[domain].correct += 1;
          totalCorrectCount += 1;
        }
      } else if (q.questionType === 'likert' || q.domain === 'metacognition') {
        // 2) 메타인지 Likert 5점 척도 문항: 선택 인덱스(0~4) 기반 1점~5점 척도 점수 환산
        const val = userAnswer !== undefined ? Number(userAnswer) : 0;
        const scoreRatio = (val + 1) / 5; // 0: 0.2, 1: 0.4, 2: 0.6, 3: 0.8, 4: 1.0 (5점 만점)
        domainCounts[domain].correct += scoreRatio;
        totalCorrectCount += scoreRatio;
      }
    });

    // Exact score percentages (0 to 100)
    const domainScores: Record<DomainCategory, number> = {
      decoding: domainCounts.decoding.total > 0 ? Math.round((domainCounts.decoding.correct / domainCounts.decoding.total) * 100) : 0,
      vocabulary: domainCounts.vocabulary.total > 0 ? Math.round((domainCounts.vocabulary.correct / domainCounts.vocabulary.total) * 100) : 0,
      comprehension: domainCounts.comprehension.total > 0 ? Math.round((domainCounts.comprehension.correct / domainCounts.comprehension.total) * 100) : 0,
      metacognition: domainCounts.metacognition.total > 0 ? Math.round((domainCounts.metacognition.correct / domainCounts.metacognition.total) * 100) : 0,
    };

    // Overall total score (100점 만점 명확한 계산)
    const totalScore = totalQuestionsCount > 0 ? Math.round((totalCorrectCount / totalQuestionsCount) * 100) : 0;

    console.log(`[채점 완료] 총 정답 환산 수: ${totalCorrectCount}/${totalQuestionsCount}, 계산된 최종 점수: ${totalScore}점`, domainScores);

    // 2. Dynamic level & prescription mapping based on totalScore
    let gradeLevelName = '어휘 기초 보완 클리닉 트랙';
    let percentileTop = 95;
    let strengths = ['독서에 대한 흥미 유발 잠재력', '기초 표현 어휘 습득 능력'];
    let weaknesses = ['기초 어휘 수집 및 독해 유창성 집중 보완 필요', '문맥 추론 및 메타인지 전략 부족'];
    let actionAdvice = [
      '하루 10분 소리 내어 동화책 읽기(음독)를 진행하세요.',
      '짧은 감정 어휘나 상황별 낱말 카드 놀이로 어휘력을 채워주세요.',
      '부모님이 직접 질문을 던지고 아이가 편하게 말할 수 있도록 격려하세요.'
    ];

    if (totalScore >= 95) {
      gradeLevelName = '최우수 고차 추론 & 마스터 문해 트랙 (상위 1%)';
      percentileTop = 1;
      strengths = [
        '전 영역(기초 해독, 어휘/구문, 고차 추론, 메타인지) 100점 마스터 달성',
        '풍부한 고급 교과 어휘력 및 완벽한 비판적 문맥 추론 능력',
        '자기 주도적 독서 전략 수립 및 메타인지 인지 능력 탁월'
      ];
      weaknesses = ['고난도 비문학(과학/철학/역사) 전문 서적 확장 권장'];
      actionAdvice = [
        '다양한 비문학 토론 도서를 읽고 자녀와 논리적 대화를 나눠보세요.',
        '문학 5: 비문학 5 비율을 유지하며 독서 깊이를 심화시켜 주세요.'
      ];
    } else if (totalScore >= 80) {
      gradeLevelName = '고차 추론 & 비판적 독서 트랙';
      percentileTop = Math.max(2, Math.round(30 - (totalScore - 80) * 1.3));
      strengths = ['풍부한 어휘 구사력 및 문맥 추론 능력', '논리적 딜레마 문제해결력 및 메타인지 독서 전략'];
      weaknesses = ['고난도 비문학(과학/사회) 전문 용어 정밀 파악'];
      actionAdvice = [
        '비판적 토론 도서를 읽고 자녀와 논리적 대화를 나눠보세요.',
        '문학과 비문학 6:4 비율을 유지하여 장르 균형감을 키워주세요.'
      ];
    } else if (totalScore >= 60) {
      gradeLevelName = '어휘 심화 및 독립 독서 트랙';
      percentileTop = Math.round(55 - (totalScore - 60) * 1.2);
      strengths = ['주요 줄거리 흐름 파악 및 문맥 이해력', '기초 한자어 및 관용구 이해'];
      weaknesses = ['추상적 어휘 및 비판적 논거 평가 능력 보완'];
      actionAdvice = [
        '자녀가 직접 서평을 작성하거나 한 줄 독후감을 남기도록 권장하세요.',
        '새롭게 배운 어휘로 나만의 단어장을 만드는 활동을 해보세요.'
      ];
    } else if (totalScore >= 40) {
      gradeLevelName = '기초 문해력 확장 트랙';
      percentileTop = Math.round(85 - (totalScore - 40) * 1.5);
      strengths = ['기초 단어 해독 및 문장 유창성', '기본적 서사 흥미 보유'];
      weaknesses = ['감정 어휘 표현력 및 복합 문장 구조 이해 보완'];
      actionAdvice = [
        '북핏 Step 1 적정 도서 위주로 완독 성공 경험을 쌓아주세요.',
        '읽기 중간중간 아이의 생각을 묻는 간단한 질문을 던져주세요.'
      ];
    }

    const updatedResult: DiagnosticResultData = {
      ...DEFAULT_MOCK_RESULT,
      totalScore,
      percentileTop,
      gradeLevelName,
      domainScores,
      strengths,
      weaknesses,
      actionAdvice,
      prescribedBooks: MOCK_BOOKS,
    };

    // Update Report Data
    setReportData(updatedResult);

    // Save exact result to Supabase diagnostic_results table
    await saveDiagnosticResultToDb(updatedResult);

    setCurrentStep('report');
  };

  const handleRestart = () => {
    setCurrentStep('quiz');
  };

  return (
    <div className="min-h-screen bg-cream py-6">
      {currentStep === 'quiz' ? (
        <QuizInterface
          questions={DIAGNOSTIC_QUESTIONS}
          onComplete={handleQuizComplete}
          onCancel={onCancel}
        />
      ) : (
        <DiagnosticReport
          data={reportData}
          onRestart={handleRestart}
          onSelectBook={onSelectBook}
        />
      )}
    </div>
  );
};
