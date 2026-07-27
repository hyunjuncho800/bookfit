import React, { useState, useEffect } from 'react';
import { DIAGNOSTIC_QUESTIONS, DEFAULT_MOCK_RESULT, LITERACY_TEST_QUESTIONS, calculateFinalResults } from '../../data/diagnosticData';
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

    // 1. 학술 계산 로직 (calculateFinalResults) 실행
    const calculated = calculateFinalResults(answers);
    const totalScore = calculated.totalScore;
    const gradeLevelName = calculated.level;

    // 2. Domain-specific scoring calculation (4대 학술 영역)
    const domainCounts: Record<DomainCategory, { correct: number; total: number }> = {
      decoding: { correct: 0, total: 0 },
      vocabulary: { correct: 0, total: 0 },
      comprehension: { correct: 0, total: 0 },
      metacognition: { correct: 0, total: 0 },
    };

    LITERACY_TEST_QUESTIONS.forEach((q) => {
      const domain = q.domain || 'vocabulary';
      domainCounts[domain].total += 1;

      const val = answers[q.id] !== undefined ? answers[q.id] : (answers as any)[q.id - 1];
      const isCorrect = val !== undefined && String(val) === String(q.correctAnswer);

      if (isCorrect) {
        domainCounts[domain].correct += 1;
      }
    });

    const domainScores: Record<DomainCategory, number> = {
      decoding: domainCounts.decoding.total > 0 ? Math.round((domainCounts.decoding.correct / domainCounts.decoding.total) * 100) : 0,
      vocabulary: domainCounts.vocabulary.total > 0 ? Math.round((domainCounts.vocabulary.correct / domainCounts.vocabulary.total) * 100) : 0,
      comprehension: domainCounts.comprehension.total > 0 ? Math.round((domainCounts.comprehension.correct / domainCounts.comprehension.total) * 100) : 0,
      metacognition: domainCounts.metacognition.total > 0 ? Math.round((domainCounts.metacognition.correct / domainCounts.metacognition.total) * 100) : 0,
    };

    console.log(`[12문항 학술 진단 채점 완료] 맞은 개수: ${calculated.correctCount}/${calculated.totalQuestions}, 계산된 최종 점수: ${totalScore}점, 레벨: ${gradeLevelName}`, domainScores);

    // 3. Dynamic level & prescription mapping
    let percentileTop = 95;
    let strengths = ['기초 독서 가능성 보유'];
    let weaknesses = ['해독, 어휘력, 독해추론 및 메타인지 단계별 보완 추천'];
    let actionAdvice = [
      '북핏 Step 1 적정 도서부터 소리 내어 읽기(음독)를 진행하세요.',
      '어휘 낱말 카드와 가벼운 독후 질문으로 어휘력을 넓혀주세요.'
    ];

    if (totalScore >= 90) {
      percentileTop = 1;
      strengths = [
        '5대 국제 프레임워크 기준 12문항 최우수 마스터 달성 (L5 숙련된 독자)',
        '음운 해독, 어휘의미론, 사실/추론/비판 독해 및 메타인지 모니터링 능력 완벽 보유'
      ];
      weaknesses = ['고난도 비문학(과학/역사/철학) 전문 학술 용어 확장을 위한 훈련 권장'];
      actionAdvice = [
        '비판적 서평 작성과 인문학 토론 모임을 통해 생각의 폭을 더욱 확장하세요.',
        '문학 50%, 비문학 50% 균형 잡힌 심화 큐레이션 독서를 진행하세요.'
      ];
    } else if (totalScore >= 75) {
      percentileTop = Math.max(2, Math.round(25 - (totalScore - 75) * 1.2));
      strengths = ['유창한 독해 및 추론 사고력 (L4 유창한 독자)', '문맥 이해 및 비판적 시각 우수'];
      weaknesses = ['추상적 어휘 및 논리 구조의 세밀한 대조 분석 보완'];
      actionAdvice = ['비판적 독후 질문으로 생각을 논리적으로 다듬어주세요.'];
    } else if (totalScore >= 50) {
      percentileTop = Math.round(60 - (totalScore - 50) * 1.4);
      strengths = ['기초 서사 이해 및 문학적 흥미 보유 (L3 보통 - 발전 중인 독자)'];
      weaknesses = ['고차 추론 및 메타인지 독서 전략 집중 보완 필요'];
      actionAdvice = ['북핏 Step 2 도서로 완독 경험을 쌓아주세요.'];
    } else if (totalScore >= 30) {
      percentileTop = Math.round(85 - (totalScore - 30) * 1.5);
      strengths = ['기초 단어 해독 능력 보유 (L2 기초 - 추론/메타인지 보완 필요)'];
      weaknesses = ['어휘의 의미 깊이 및 행간 읽기 연습 집중 수반'];
      actionAdvice = ['북핏 Step 1 추천 도서 위주로 어휘력을 채워주세요.'];
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

    setReportData(updatedResult);
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
