import type { DetailedQuestion, DiagnosticResultData } from '../types';
import { MOCK_BOOKS } from './mockData';

export const DIAGNOSTIC_QUESTIONS: DetailedQuestion[] = [
  // [영역 1] 기초 해독 & 유창성 (타임어택형 퀴즈)
  {
    id: 1,
    domain: 'decoding',
    domainName: '기초 해독 & 유창성',
    questionType: 'timeattack',
    timeLimitSeconds: 15,
    question: '[타임어택] 다음 중 빗소리를 나타내는 의태어/의성어로 맞춤법과 소리가 올바르게 짝지어진 것은?',
    options: [
      '주룩주룩 (빗물이 끊이지 않고 계속 떨어지는 소리)',
      '줄룩줄룩 (빗물이 잘 흘러내리지 않는 모양)',
      '주록주록 (작은 소리로 사각거리는 소리)',
      '줄록줄록 (바람에 나뭇잎이 흔들리는 소리)'
    ],
    correctAnswer: 0,
    explanation: "'주룩주룩'은 비나 눈물이 연달아 가볍게 떨어지는 소리나 모양을 나타내는 올바른 의성어입니다."
  },
  {
    id: 2,
    domain: 'decoding',
    domainName: '기초 해독 & 유창성',
    questionType: 'timeattack',
    timeLimitSeconds: 15,
    question: '[타임어택] 다음 괄호 안에 들어갈 소리의 변별이 올바른 단어는? "새가 하늘을 (  ) 날아오릅니다."',
    options: [
      '훨훨',
      '헐헐',
      '훠얼훠얼',
      '활활'
    ],
    correctAnswer: 0,
    explanation: "새가 날개를 크게 저으며 가볍게 나는 모양은 '훨훨'입니다."
  },

  // [영역 2] 어휘 & 문장구조 (문맥 한자어 유추, 다의어, 이중부정)
  {
    id: 3,
    domain: 'vocabulary',
    domainName: '어휘 & 문장구조',
    questionType: 'choice',
    question: '다음 문장에서 밑줄 친 한자어 "절약(節約)"의 문맥적 의미로 가장 알맞은 것은?\n\n"지호는 용돈을 함부로 쓰지 않고 절약하여 필요한 책을 샀다."',
    options: [
      '아껴서 쓰거나 줄임',
      '물건을 남에게 거저 줌',
      '필요한 물건을 한꺼번에 많이 사둠',
      '돈이나 물건의 가치를 제대로 알아봄'
    ],
    correctAnswer: 0,
    explanation: "'절약(節約)'은 節(마디 절), 約(약속할 약)으로 낭비하지 않고 아껴 쓰는 것을 뜻합니다."
  },
  {
    id: 4,
    domain: 'vocabulary',
    domainName: '어휘 & 문장구조',
    questionType: 'choice',
    question: '밑줄 친 "다리"가 다음 문장의 "다리"와 같은 의미로 쓰인 것은?\n\n"안경 다리가 부러져서 수리를 맡겼다."',
    options: [
      '책상 다리가 흔들려서 괴어 놓았다.',
      '강을 건너기 위해 긴 다리를 지었다.',
      '오랜만에 달리기 운동을 해서 다리가 아프다.',
      '친구와 나 사이에 다리를 놓아 오해를 풀었다.'
    ],
    correctAnswer: 0,
    explanation: "문장의 '안경 다리'와 보기 1번의 '책상 다리'는 모두 물체를 받치는 아랫부분을 뜻하는 다의어 표현입니다."
  },
  {
    id: 5,
    domain: 'vocabulary',
    domainName: '어휘 & 문장구조',
    questionType: 'choice',
    question: '이중부정 문장의 의미를 바르게 이해한 것은?\n\n"열심히 노력한 결과 성공하지 못했다고 할 수는 없다."',
    options: [
      '결국 성공했다는 뜻이다.',
      '결국 실패했다는 뜻이다.',
      '성공했는지 전혀 알 수 없다는 뜻이다.',
      '성공할 가능성이 아예 없다는 뜻이다.'
    ],
    correctAnswer: 0,
    explanation: "'~못했다고 할 수는 없다'는 이중 부정 구문으로 긍정(결국 성공함)을 강하게 뜻합니다."
  },

  // [영역 3] 고차 독해 & 사고력 (지문 읽기 후 사실적/추론적 이해)
  {
    id: 6,
    domain: 'comprehension',
    domainName: '고차 독해 & 사고력',
    questionType: 'passage',
    passageTitle: '해님과 바람의 이야기',
    passageContent: '바람은 자신이 해님보다 강하다고 자신했다. 지나가던 나그네의 외투를 먼저 벗기는 내기를 제안한 바람은 강한 찬바람을 쌩쌩 불었다. 그러나 나그네는 외투가 날아가지 않도록 옷깃을 더욱 바짝 여몄다. 이어 해님이 온화하고 따뜻한 햇살을 내리쬐자, 나그네는 더위를 느껴 스스로 외투를 벗어 던졌다.',
    question: '위 지문을 통해 얻을 수 있는 가장 중요한 교훈(추론적 이해)은 무엇인가요?',
    options: [
      '강압적인 힘보다 따뜻한 설득과 미소가 사람의 마음을 움직인다.',
      '찬바람이 불 때는 외투를 단단히 입어야 안전하다.',
      '해님은 항상 바람보다 날씨 조절 능력이 뛰어나다.',
      '나그네는 햇볕을 쬐는 것보다 바람을 맞는 것을 싫어한다.'
    ],
    correctAnswer: 0,
    explanation: "바람의 강한 부림(강압)보다 해님의 따뜻한 온기(설득)가 나그네의 외투를 벗겼듯이, 따뜻함이 사람의 마음과 행동을 움직인다는 추론이 핵심 교훈입니다."
  },
  {
    id: 7,
    domain: 'comprehension',
    domainName: '고차 독해 & 사고력',
    questionType: 'passage',
    passageTitle: '조선의 시계, 자격루',
    passageContent: '세종대왕 때 장영실이 만든 자격루는 물이 내려오는 힘을 이용해 구슬을 굴리고, 그 구슬이 종과 북을 울려 시간을 자동으로 알려주는 과학적 수시계였다. 밤낮이나 날씨와 관계없이 시간을 정확히 알 수 있어서 농사 일정 관리에 큰 도움이 되었다.',
    question: '지문의 내용과 일치하지 않는 (사실적 이해) 항목은 무엇인가요?',
    options: [
      '자격루는 햇빛의 그림자 이동만을 이용해 시각을 알렸다.',
      '물이 떨어지는 힘으로 구슬을 굴려 종과 북을 울렸다.',
      '장영실과 세종대왕의 협력으로 만들어진 과학 시계이다.',
      '날씨가 어둡거나 밤이 되어도 시각을 알 수 있었다.'
    ],
    correctAnswer: 0,
    explanation: "자격루는 햇빛 그림자가 아닌 '물이 떨어지는 힘(물시계)'을 이용했습니다."
  },

  // [영역 4] 메타인지 (독서 전략 자기보고식 5점 척도)
  {
    id: 8,
    domain: 'metacognition',
    domainName: '메타인지 독서 파악',
    questionType: 'likert',
    question: '글을 읽다가 내용이 이해되지 않는 부분을 만났을 때, 나는 스스로 앞 문장을 다시 읽거나 멈추어 생각하는 습관이 있다.',
    options: [
      '1점: 전혀 그렇지 않다',
      '2점: 별로 그렇지 않다',
      '3점: 보통이다',
      '4점: 대체로 그렇다',
      '5점: 매우 그렇다'
    ]
  },
  {
    id: 9,
    domain: 'metacognition',
    domainName: '메타인지 독서 파악',
    questionType: 'likert',
    question: '책의 제목이나 표지 그림을 보고, 읽기 전에 어떤 이야기가 펼쳐질지 미리 예측해본 적이 있다.',
    options: [
      '1점: 전혀 그렇지 않다',
      '2점: 별로 그렇지 않다',
      '3점: 보통이다',
      '4점: 대체로 그렇다',
      '5점: 매우 그렇다'
    ]
  }
];

export const DEFAULT_MOCK_RESULT: DiagnosticResultData = {
  totalScore: 88,
  percentileTop: 12,
  gradeLevelName: '초등 3~4학년 레벨 L3.8 (발달기)',
  domainScores: {
    decoding: 92,
    vocabulary: 75,
    comprehension: 95,
    metacognition: 85,
  },
  strengths: [
    '추론적 독해 및 문맥 흐름 파악 능력 상위 5% 수준 (매우 우수)',
    '음운 변별 및 타임어택 유창성 검사 완벽 통과 (기초 해독 충실)',
    '읽기 전 내용 예측 및 점검 등 메타인지 자율성 우수'
  ],
  weaknesses: [
    '교과 한자어 어휘 및 다의어 활용 문맥 유추 정확도 일부 보완 필요',
    '관용적 비유 표현(속담, 이중부정 구문) 해석 시 집중력 소요'
  ],
  actionAdvice: [
    '어휘력을 보완할 수 있는 한자어 기반 감정/개념 어휘 도서 20% 배치 추천',
    '글 읽기 중 모르는 어휘가 나왔을 때 맥락 추론 후 사전 확인 습관 격려',
    '부모님과의 독후 대화를 통해 책 속 인물의 동기에 대해 깊이 토론하는 시간 갖기'
  ],
  prescribedBooks: [
    MOCK_BOOKS[0], // 적정
    MOCK_BOOKS[1], // 도전
    MOCK_BOOKS[2], // 보완
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
      '줄거리를 요약하라고 강요하지 말고, "가장 기억에 남는 장면"을 그림이나 한 문장으로 표현하게 하기',
      '책에 나온 어휘를 실생활 대화에서 부모님이 먼저 자연스럽게 사용해보기'
    ],
    discussionQuestions: [
      '주인공이 가장 큰 갈등을 느꼈을 때 어떤 마음이었을까?',
      '이야기의 결말이 만약 다르게 끝났다면 어떤 장면이 달라졌을까?',
      '오늘 읽은 책에서 가장 마음에 드는 새 단어 2개는 무엇이니?'
    ]
  }
};
