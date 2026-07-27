export interface Book {
  id: string;
  title: string;
  author: string;
  publisher: string;
  coverImage: string;
  gradeTag: string; // e.g., "초등 3~4학년"
  lexileLevel: string; // e.g., "어휘 Level 3"
  trackType: 'comfort' | 'challenge' | 'supplement'; // 70% 적응, 10% 탐구, 20% 클리닉
  recommendReason: string;
  summary: string;
  vocabularyPoints: string[];
  parentQuestions: string[];
  rating: number;
}

export interface QuizQuestion {
  id: number;
  category: 'vocabulary' | 'comprehension' | 'metacognition';
  categoryLabel: string;
  question: string;
  passage?: string;
  options: string[];
  answer: number;
  explanation: string;
}

export type DomainCategory = 'decoding' | 'vocabulary' | 'comprehension' | 'metacognition';

export interface DomainInfo {
  id: DomainCategory;
  name: string;
  description: string;
  score: number;
  maxScore: number;
  percentile: number;
}

export interface DetailedQuestion {
  id: number;
  domain: DomainCategory;
  domainName: string;
  questionType: 'timeattack' | 'choice' | 'passage' | 'likert';
  timeLimitSeconds?: number;
  passageTitle?: string;
  passageContent?: string;
  question: string;
  options: string[];
  correctAnswer?: number;
  explanation?: string;
}

export interface DiagnosticResultData {
  totalScore: number;
  percentileTop: number;
  gradeLevelName: string;
  domainScores: Record<DomainCategory, number>;
  strengths: string[];
  weaknesses: string[];
  actionAdvice: string[];
  prescribedBooks: Book[];
  parentGuide: {
    beforeReading: string[];
    duringReading: string[];
    afterReading: string[];
    discussionQuestions: string[];
  };
}

export type ReadingStatus = 'wantToRead' | 'reading' | 'completed' | 'TO_READ' | 'READING' | 'COMPLETED';

export interface MyBookItem {
  id: string;
  book: Book;
  status: ReadingStatus;
  progressPercent: number;
  userRating?: number;
  newWordsLearned?: string[];
  oneLineReview?: string;
  completedAt?: string;
}

export interface UserGamificationProfile {
  childName: string;
  levelBadgeTitle: string;
  currentExp: number;
  nextLevelExp: number;
  completedCountThisMonth: number;
  earnedBadges: {
    id: string;
    icon: string;
    name: string;
    description: string;
  }[];
}

export interface VocabularyQuizItem {
  word: string;
  meaning: string;
  question: string;
  options?: string[];
  answerIndex?: number;
}

export interface AIGeneratedGuide {
  beforeReading: string[];
  duringReading: string[];
  afterReading: string[];
  vocabularyQuiz: VocabularyQuizItem[];
}
