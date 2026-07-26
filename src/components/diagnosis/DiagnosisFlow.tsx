import React, { useState, useEffect } from 'react';
import { DIAGNOSTIC_QUESTIONS, DEFAULT_MOCK_RESULT } from '../../data/diagnosticData';
import { QuizInterface } from './QuizInterface';
import { DiagnosticReport } from './DiagnosticReport';
import type { DiagnosticResultData, Book } from '../../types';
import { saveDiagnosticResultToDb, getLatestDiagnosticResultFromDb } from '../../services/supabaseService';

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
    // Calculate dynamic scores based on answered questions
    let correctCount = 0;
    const totalQ = DIAGNOSTIC_QUESTIONS.length;

    DIAGNOSTIC_QUESTIONS.forEach((q) => {
      if (q.correctAnswer !== undefined && answers[q.id] === q.correctAnswer) {
        correctCount += 1;
      }
    });

    const scoreRatio = Math.round((correctCount / totalQ) * 100);
    const finalScore = Math.max(70, Math.min(98, scoreRatio > 0 ? scoreRatio : 88));

    const updatedResult: DiagnosticResultData = {
      ...DEFAULT_MOCK_RESULT,
      totalScore: finalScore,
      percentileTop: Math.max(5, 100 - finalScore + 4),
    };

    // Update Report Data Dynamically
    setReportData(updatedResult);

    // Save result to Supabase diagnostic_results table
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
