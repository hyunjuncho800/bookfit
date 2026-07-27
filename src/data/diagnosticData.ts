import type { DetailedQuestion, DiagnosticResultData, DomainCategory } from '../types';
import { MOCK_BOOKS } from './mockData';

export interface LiteracyTestQuestion {
  id: number;
  category: string;
  domain: DomainCategory;
  domainName: string;
  questionType: 'choice' | 'passage' | 'timeattack' | 'likert';
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export const LITERACY_TEST_QUESTIONS = [
  // [영역 1: 해독 및 단어인식 - SVR / Scarborough (Gough & Tunmer, 1986)]
  {
    id: 1,
    category: "해독 및 단어인식",
    domain: "decoding" as DomainCategory,
    domainName: "해독 및 단어인식",
    questionType: "choice" as const,
    question: "다음 중 글자의 소리 규칙(파닉스)에 맞게 올바르게 읽은 것은 무엇인가요?",
    options: ["'국물' -> [궁물]", "'신라' -> [신나]", "'같이' -> [가티]", "'부엌' -> [부어ㄱ]"],
    correctAnswer: 0,
    explanation: "음운 규칙(비음화)을 이해하고 문자를 정확한 소리로 변환(Decoding)하는 능력입니다."
  },
  {
    id: 2,
    category: "해독 및 단어인식",
    domain: "decoding" as DomainCategory,
    domainName: "해독 및 단어인식",
    questionType: "choice" as const,
    question: "다음 의미 없는 가짜 단어(Non-word)를 자모 음소 대응 규칙대로 바르게 읽은 것을 고르세요. [ 단어: 븜린 ]",
    options: ["봄린", "븜닌", "븜린", "붐린"],
    correctAnswer: 2,
    explanation: "SVR 모형에 기초하여, 사전 지식(어휘력)의 개입 없이 순수하게 자모음을 조합하여 소리 내는 해독력을 평가합니다."
  },

  // [영역 2: 어휘력 및 의미론 - NRP / Scarborough (NRP, 2000)]
  {
    id: 3,
    category: "어휘력 및 의미론",
    domain: "vocabulary" as DomainCategory,
    domainName: "어휘력 및 의미론",
    questionType: "choice" as const,
    question: "다음 문장의 빈칸에 들어갈 가장 알맞은 단어는 무엇인가요?\n'비가 와서 강물이 불어나자, 건너편 마을로 가는 다리가 (  ) 되었다.'",
    options: ["단절", "연결", "지속", "확장"],
    correctAnswer: 0,
    explanation: "문맥 속에서 어휘의 의미학적 적합성(Semantics)을 파악하는 언어 이해력 평가입니다."
  },
  {
    id: 4,
    category: "어휘력 및 의미론",
    domain: "vocabulary" as DomainCategory,
    domainName: "어휘력 및 의미론",
    questionType: "choice" as const,
    question: "다음 밑줄 친 단어와 뜻이 반대인 것은 무엇인가요?\n'탐정은 범인의 흔적을 용의주도하게 살폈다.'",
    options: ["세심하게", "치밀하게", "소홀하게", "주의 깊게"],
    correctAnswer: 2,
    explanation: "단순 뜻 암기를 넘어 단어 간의 반의 관계 및 의미 깊이(Depth of Vocabulary)를 측정합니다."
  },

  // [영역 3: 사실적 이해력 - Barrett's Taxonomy Step 1 (Barrett, 1976)]
  {
    id: 5,
    category: "사실적 이해력",
    domain: "comprehension" as DomainCategory,
    domainName: "사실적 이해력",
    questionType: "passage" as const,
    question: "[지문] 민수는 어제 도서관에서 역사책을 두 권 빌렸다. 오늘 아침에는 축구를 하고 나서 점심으로 비빔밥을 먹었다.\n\n질문: 민수가 축구를 한 때는 언제인가요?",
    options: ["어제 아침", "어제 저녁", "오늘 아침", "오늘 점심 이후"],
    correctAnswer: 2,
    explanation: "지문에 직접 명시된 사건의 발생 시점과 정보의 순서를 정확히 파악하는 사실적 독해력(Literal Comprehension) 평가입니다."
  },
  {
    id: 6,
    category: "사실적 이해력",
    domain: "comprehension" as DomainCategory,
    domainName: "사실적 이해력",
    questionType: "passage" as const,
    question: "[지문] 꿀벌은 꽃의 꿀을 채집하여 벌통으로 가져온다. 이 과정에서 꿀벌의 몸에 묻은 꽃가루가 다른 꽃으로 옮겨지며 식물의 열매를 맺게 돕는다.\n\n질문: 지문의 내용과 일치하는 것은 무엇인가요?",
    options: ["꿀벌은 열매를 섭취하여 꽃가루를 만든다.", "꿀벌이 꿀을 옮길 때 꽃가루도 함께 이동한다.", "꽃은 꿀벌이 없어도 스스로 이동하여 열매를 맺는다.", "꿀벌은 벌통 속에서 꽃을 키운다."],
    correctAnswer: 1,
    explanation: "텍스트에 제시된 명시적 정보를 오류 없이 확인하고 대조하는 능력입니다."
  },

  // [영역 4: 추론적 이해력 - Barrett's Taxonomy Step 2 (Barrett, 1976)]
  {
    id: 7,
    category: "추론적 이해력",
    domain: "comprehension" as DomainCategory,
    domainName: "추론적 이해력",
    questionType: "passage" as const,
    question: "[지문] 창밖을 내다보던 지우는 한숨을 쉬며 현관문 옆에 뒀던 우산과 장화를 조용히 제자리에 넣었다. 그리고 소파에 앉아 책을 펴 들었다.\n\n질문: 지우가 우산과 장화를 제자리에 넣은 이유는 무엇일까요?",
    options: ["비가 멈추고 날씨가 맑아져서 나가려던 계획이 바뀌었거나, 비가 오지 않아서", "장화가 작아져서 새 장화를 사러 가기 위해", "도서관에 가려면 우산이 필요 없기 때문에", "소파 청소를 하기 위해서"],
    correctAnswer: 0,
    explanation: "글에 명시되지 않은 상황을 행동(우산/장화를 치움)과 감정(한숨)을 통해 배경지식과 연결하여 행간을 읽는 추론적 이해력(Inferential Comprehension) 평가입니다."
  },
  {
    id: 8,
    category: "추론적 이해력",
    domain: "comprehension" as DomainCategory,
    domainName: "추론적 이해력",
    questionType: "passage" as const,
    question: "[지문] 사막에 사는 선인장은 잎이 가시 모양으로 변형되어 있다. 이는 수분이 증발하는 것을 막고, 동물이 자신을 먹지 못하게 보호하는 역할을 한다.\n\n질문: 만약 선인장의 잎이 가시가 아니라 넙적하고 큰 일반 잎이었다면 사막에서 어떤 일이 벌어졌을까요?",
    options: ["수분 증발이 심해지고 동물들에게 먹혀 살아남기 힘들었을 것이다.", "물이 전혀 필요 없어 더 빠르게 자랐을 것이다.", "가시가 없어서 동물들과 더 친하게 지냈을 것이다.", "햇빛을 받지 못해 말라 죽었을 것이다."],
    correctAnswer: 0,
    explanation: "원인과 결과(인과관계)의 원리를 이해하고, 조건 변화에 따른 결과를 논리적으로 예측하는 추론 능력입니다."
  },

  // [영역 5: 비판적/평가적 이해력 - Barrett's Taxonomy Step 3 (Barrett, 1976)]
  {
    id: 9,
    category: "비판적/평가적 이해력",
    domain: "comprehension" as DomainCategory,
    domainName: "비판적/평가적 이해력",
    questionType: "passage" as const,
    question: "[지문] 스마트폰은 언제 어디서나 정보를 검색할 수 있게 해준다. 따라서 모든 학생들에게 수업 시간 중 자유로운 스마트폰 사용을 무제한 허용해야 한다.\n\n질문: 위 주장의 논리적 문제점(약점)으로 가장 적절한 것은 무엇인가요?",
    options: ["정보 검색의 장점만 언급했을 뿐, 수업 집중력 저하나 게임 중독 등의 부작용은 고려하지 않았다.", "스마트폰은 정보를 검색하는 기능이 아예 없기 때문이다.", "모든 학생이 스마트폰을 좋아하기 때문이다.", "수업 시간에는 오직 책만 읽어야 하기 때문이다."],
    correctAnswer: 0,
    explanation: "저자의 주장이나 논리의 타당성, 편향성, 빠진 근거를 비판적으로 평가하는 상위 수준 독해력(Evaluation) 평가입니다."
  },
  {
    id: 10,
    category: "비판적/평가적 이해력",
    domain: "comprehension" as DomainCategory,
    domainName: "비판적/평가적 이해력",
    questionType: "passage" as const,
    question: "[지문] '거짓말을 해서는 안 된다'는 도덕적 원칙이 있다. 그러나 의사가 중병에 걸린 환자가 충격을 받지 않도록 완치될 수 있다는 희망적인 말을 건넸다.\n\n질문: 의사의 행동을 비판적/도덕적 관점에서 평가한 것으로 가장 성숙한 시각은 무엇인가요?",
    options: ["어떤 상황에서도 거짓말은 나쁘므로 의사는 벌을 받아야 한다.", "원칙도 중요하지만, 상대방을 배려하고 생명을 살리기 위한 선의의 목적을 함께 고려해 평가해야 한다.", "의사는 거짓말을 해도 절대 아무런 문제가 되지 않는다.", "환자가 눈치채지 못했으니 도덕적으로 전혀 평가할 필요가 없다."],
    correctAnswer: 1,
    explanation: "글에 나타난 인물의 행동과 도덕적 가치를 다각도로 평가하고 자신의 가치관에 적용하는 비판/창의적 이해력입니다."
  },

  // [영역 6: 메타인지 독서전략 - Metacognition in Reading (Flavell, 1979; Garner, 1987)]
  {
    id: 11,
    category: "메타인지 독서전략",
    domain: "metacognition" as DomainCategory,
    domainName: "메타인지 독서전략",
    questionType: "choice" as const,
    question: "글을 읽다가 처음 보는 어려운 단어나 이해가 잘 되지 않는 문장을 만났을 때, Garner(1987)의 독서 메타인지 전략에 부합하는 가장 올바른 행동은 무엇인가요?",
    options: [
      "무조건 읽기를 멈추고 그 책을 포기하거나 아예 덮어버린다.",
      "앞 문장이나 뒤 문장을 다시 읽어보며(Look-back) 문맥을 통해 단어의 뜻을 스스로 추측해 보거나 사전을 찾는다.",
      "모르는 단어는 무시하고 그냥 글자만 빠르게 끝까지 읽는다.",
      "책을 읽는 척하며 페이지만 넘긴다."
    ],
    correctAnswer: 1,
    explanation: "독서 중 자신의 이해 상태를 스스로 모니터링(Comprehension Monitoring)하고, 이해 안 되는 지점에서 복구 전략(Look-back strategy)을 구사하는 자기조절 능력입니다."
  },
  {
    id: 12,
    category: "메타인지 독서전략",
    domain: "metacognition" as DomainCategory,
    domainName: "메타인지 독서전략",
    questionType: "passage" as const,
    question: "[지문] '펭귄은 날개가 있지만 하늘을 날 수 없는 새입니다. 그래서 펭귄은 하늘을 매우 높이 날아다니며 나무 위에 둥지를 짓습니다.'\n\n질문: 글을 읽으며 스스로 이해를 점검(Monitoring)하는 독자라면 위 지문에서 무엇을 발견해야 할까요?",
    options: [
      "앞 문장에서는 '날 수 없다'고 하고 뒤에서는 '높이 날아다닌다'고 하는 논리적 모순(오류)을 감지해야 한다.",
      "펭귄이 새라는 사실을 새롭게 알았다고 기뻐해야 한다.",
      "아무런 이상한 점 없이 문장이 아주 잘 작성되었다고 생각한다.",
      "나무 위에 둥지를 짓는 펭귄의 그림을 그려야 한다."
    ],
    correctAnswer: 0,
    explanation: "Garner(1987)의 연구에 기반하여, 텍스트 내의 정보가 서로 충돌하거나 모순될 때 이를 즉각 감지해 내는 인지적 감시(Error Monitoring) 능력을 평가합니다."
  }
];

export const DIAGNOSTIC_QUESTIONS: DetailedQuestion[] = LITERACY_TEST_QUESTIONS;

export const calculateFinalResults = (userAnswers: Record<number, number> | number[]) => {
  let correctCount = 0;
  const categoryScores: Record<string, number> = {};

  LITERACY_TEST_QUESTIONS.forEach((q, index) => {
    // 타입 오류 방지를 위한 문자열 변환 비교 (q.id 및 index 둘 다 호환)
    const val = (userAnswers as any)[q.id] !== undefined
      ? (userAnswers as any)[q.id]
      : (userAnswers as any)[index];

    const isCorrect = val !== undefined && String(val) === String(q.correctAnswer);
    if (isCorrect) {
      correctCount++;
      categoryScores[q.category] = (categoryScores[q.category] || 0) + 1;
    }
  });

  // 100점 만점 정확한 환산 (1문항당 약 8.33점 -> 반올림)
  const totalScore = Math.round((correctCount / LITERACY_TEST_QUESTIONS.length) * 100);

  // 점수별 학술 레벨 매핑
  const level = totalScore >= 90 ? "L5 (최우수 - 숙련된 독자)" :
                totalScore >= 75 ? "L4 (우수 - 유창한 독자)" :
                totalScore >= 50 ? "L3 (보통 - 발전 중인 독자)" :
                totalScore >= 30 ? "L2 (기초 - 추론 및 메타인지 보완 필요)" : "L1 (입문 - 해독 및 어휘 집중 지원 필요)";

  return {
    totalScore,
    correctCount,
    totalQuestions: LITERACY_TEST_QUESTIONS.length,
    categoryScores,
    level
  };
};

export const DEFAULT_MOCK_RESULT: DiagnosticResultData = {
  totalScore: 100,
  percentileTop: 1,
  gradeLevelName: 'L5 (최우수 - 숙련된 독자)',
  domainScores: {
    decoding: 100,
    vocabulary: 100,
    comprehension: 100,
    metacognition: 100,
  },
  strengths: [
    '5대 국제 프레임워크 기반 12개 문항 100점 완벽 달성',
    '음운 해독 및 의미론 파악 최상위 수준 (SVR / Scarborough Rope)',
    '비판적 맥락 파악 및 메타인지 자기 모니터링 능력 완벽 보유'
  ],
  weaknesses: [
    '고난도 비문학(전문 학술 용어) 심화 독서 훈련 권장'
  ],
  actionAdvice: [
    '비판적 서평 작성과 인문학 토론 모임을 통해 생각의 폭을 더욱 확장하세요.',
    '문학 50%, 비문학 50% 균형 잡힌 심화 큐레이션 독서를 진행하세요.'
  ],
  prescribedBooks: [
    MOCK_BOOKS[0],
    MOCK_BOOKS[1],
    MOCK_BOOKS[2],
  ],
  parentGuide: {
    beforeReading: [
      '책 표지와 제목을 보며 "무슨 내용일까?" 아이와 함께 3가지 예측 이야기 나누기',
      '목차에서 가장 흥미로워 보이는 단어 골라보기'
    ],
    duringReading: [
      '어려운 단어가 나와도 흐름을 깨지 않고 밑줄만 그어둔 뒤 계속 읽도록 독려하기',
      '주요 사건이 일어난 장면에서 "만약 너라면 어떻게 했을까?" 멈추어 물어보기'
    ],
    afterReading: [
      '줄거리를 요약하라고 강요하지 말고, "가장 기억에 남는 장면"을 한 문장으로 표현하게 하기',
      '책에 나온 어휘를 실생활 대화에서 부모님이 먼저 자연스럽게 사용해보기'
    ],
    discussionQuestions: [
      '주인공이 가장 큰 갈등을 느꼈을 때 어떤 마음이었을까?',
      '이야기의 결말이 만약 다르게 끝났다면 어떤 장면이 달라졌을까?',
      '오늘 읽은 책에서 가장 마음에 드는 새 단어 2개는 무엇이니?'
    ]
  }
};
