import type { Book, QuizQuestion } from '../types';

export const MOCK_BOOKS: Book[] = [
  {
    id: 'b1',
    title: '만복이네 떡집',
    author: '김리리 (지은이), 이승현 (그림)',
    publisher: '비룡소',
    coverImage: 'https://image.aladin.co.kr/product/572/93/cover500/8949161358_1.jpg',
    gradeTag: '초등 1~2학년',
    lexileLevel: '어휘 L2 (기초 몰입)',
    trackType: 'comfort',
    recommendReason: '말의 따뜻한 온기와 조화로운 대화 어휘의 가치를 느끼게 하는 적응형 도서',
    summary: '나쁜 말만 하던 만복이가 찹쌀떡을 먹고 착한 말을 하기 시작하며 펼쳐지는 가슴 따뜻한 클래식 동화.',
    vocabularyPoints: ['시치미', '용의주도', '마음씨'],
    parentQuestions: [
      '만복이가 착한 말을 했을 때 어떤 기분이 들었을까?',
      '우리 가족이 만든다면 어떤 떡을 만들고 싶니?'
    ],
    rating: 4.9
  },
  {
    id: 'b2',
    title: '자전거 도둑',
    author: '박완서 (지은이)',
    publisher: '다림',
    coverImage: 'https://image.aladin.co.kr/product/38/53/cover500/8937800262_1.jpg',
    gradeTag: '초등 5~6학년',
    lexileLevel: '어휘 L5 (깊이 탐구)',
    trackType: 'challenge',
    recommendReason: '양심과 도덕성에 관한 깊이 있는 비판적 사고 지평을 확장하는 탐구형 도서',
    summary: '청계천 상회에서 일하는 수남이의 갈등과 양심 고백을 통해 도덕적 성장을 다룬 소설.',
    vocabularyPoints: ['양심', '자괴감', '도덕성'],
    parentQuestions: [
      '수남이가 바람에 날린 자전거를 가져갔을 때 심정은 어땠을까?',
      '어려운 상황에서도 양심을 지키려면 어떤 용기가 필요할까?'
    ],
    rating: 4.8
  },
  {
    id: 'b3',
    title: '아홉 살 마음 사전',
    author: '박성우 (지은이), 김효은 (그림)',
    publisher: '창비',
    coverImage: 'https://image.aladin.co.kr/product/10425/89/cover500/k252530188_1.jpg',
    gradeTag: '초등 1~4학년',
    lexileLevel: '어휘 L3 (감정 표현 클리닉)',
    trackType: 'supplement',
    recommendReason: '감정 어휘와 섬세한 표현력이 약한 아이를 집중 보충하는 클리닉 도서',
    summary: '다양한 감정 상태를 쉬운 예시문으로 풀어내어 감정 표현 어휘를 풍부하게 확장시켜 줍니다.',
    vocabularyPoints: ['벅차다', '서운하다', '뿌듯하다', '쑥스럽다'],
    parentQuestions: [
      '오늘 하루 동안 든 생각 중 "뿌듯함"을 느낀 순간이 있었니?',
      '"서운하다"와 "화나다"의 차이는 무엇일까?'
    ],
    rating: 4.95
  },
  {
    id: 'b4',
    title: '푸른 사자 와니니',
    author: '이현 (지은이), 오윤화 (그림)',
    publisher: '창비',
    coverImage: 'https://image.aladin.co.kr/product/6429/43/cover500/8936442753_1.jpg',
    gradeTag: '초등 4~6학년',
    lexileLevel: '어휘 L4 (서사 성장)',
    trackType: 'comfort',
    recommendReason: '흥미진진한 모험 서사를 통한 독해 몰입도와 완독 성취감을 높여주는 적응형 도서',
    summary: '약하다는 이유로 무리에서 쫓겨난 어린 암사자 와니니가 초원에서 자신만의 강점을 찾아가는 여정.',
    vocabularyPoints: ['경계', '연대', '자존감'],
    parentQuestions: [
      '와니니가 자신의 단점을 장점으로 바꾼 계기는 무엇이었을까?',
      '친구들과 협동해서 문제를 해결한 경험이 있니?'
    ],
    rating: 4.9
  },
  {
    id: 'b5',
    title: '어린이를 위한 정의란 무엇인가',
    author: '마이클 샌델 원작, 이수영 글',
    publisher: '아이세움',
    coverImage: 'https://image.aladin.co.kr/product/4370/56/cover500/8934967964_1.jpg',
    gradeTag: '초등 5~6학년',
    lexileLevel: '어휘 L5 (논리 탐구)',
    trackType: 'challenge',
    recommendReason: '딜레마 상황의 다각도 분석 및 비판적 토론 역량을 키우는 고급 탐구형 도서',
    summary: '딜레마 상황을 통해 정당함과 사회적 가치에 대한 다각도 사고를 격려합니다.',
    vocabularyPoints: ['공리주의', '공정', '딜레마'],
    parentQuestions: [
      '다수의 행복을 위해 한 사람의 희생이 정당화될 수 있을까?',
      '공정하다는 것은 무엇을 의미할까?'
    ],
    rating: 4.75
  },
  {
    id: 'b6',
    title: '속담이 싹트는 나무',
    author: '유다정 (지은이)',
    publisher: '웅진주니어',
    coverImage: 'https://image.aladin.co.kr/product/2873/95/cover500/8953587621_1.jpg',
    gradeTag: '초등 3~4학년',
    lexileLevel: '어휘 L3 (관용어 클리닉)',
    trackType: 'supplement',
    recommendReason: '비유적 표현과 관용적 어휘 파악을 집중 처방하는 클리닉 도서',
    summary: '일상생활의 에피소드를 통해 속담과 관용 표현의 정확한 문맥적 의미를 습득하도록 돕습니다.',
    vocabularyPoints: ['등잔 밑이 어둡다', '가는 말이 고와야', '백지장도 맞들면'],
    parentQuestions: [
      '"등잔 밑이 어둡다"는 상황을 생활 속에서 본 적이 있니?',
      '속담을 써서 말하면 어떤 장점이 있을까?'
    ],
    rating: 4.85
  }
];

export const SAMPLE_QUIZZES: QuizQuestion[] = [
  {
    id: 1,
    category: 'vocabulary',
    categoryLabel: '어휘 유창성 정밀 진단',
    passage: '지민이는 친구가 서운해하지 않도록 마음에 없는 말을 하느라 "시치미"를 떼었다.',
    question: '위 문장에서 문맥상 "시치미를 떼다"의 뜻으로 가장 적절한 것은 무엇인가요?',
    options: [
      '자신이 한 일을 모르는 척 가치 있게 행동하다',
      '자기가 하고도 아니한 척하거나 모르는 척하다',
      '남의 물건을 몰래 가져와 숨기다',
      '화가 났지만 억지로 웃어 보이다'
    ],
    answer: 1,
    explanation: '"시치미를 떼다"는 자기가 하고도 안 한 척하거나 모르는 척하는 태도를 비유하는 표현입니다.'
  },
  {
    id: 2,
    category: 'comprehension',
    categoryLabel: '비판적 추론 독해',
    passage: '사자 와니니는 자신이 사냥을 잘 못한다고 생각했지만, 바람의 방향을 읽어 사냥감의 위치를 찾아내는 냄새 감각이 뛰어났다.',
    question: '지문을 읽고 추론할 수 있는 와니니의 특성은 무엇인가요?',
    options: [
      '남들보다 체구가 커서 당당하다.',
      '사냥 능력은 없지만 관찰력과 감각이 뛰어나다.',
      '다른 사자들과 항상 다투는 성격이다.',
      '동물들과 대화하는 능력이 있다.'
    ],
    answer: 1,
    explanation: '신체적 사냥 능력은 부족하지만 바람의 방향과 냄새를 감지하는 뛰어난 감각적 강점이 있음을 추론할 수 있습니다.'
  },
  {
    id: 3,
    category: 'metacognition',
    categoryLabel: '메타인지 독서 파악',
    passage: '글을 읽다가 모르는 어휘나 낯선 문장이 나왔을 때, 당신의 자녀는 어떤 행동을 보이나요?',
    question: '스스로의 읽기 상태를 점검하는 능력을 평가합니다.',
    options: [
      '그냥 넘어가고 전체 줄거리만 대략 파악하려 한다.',
      '문맥 앞뒤를 살펴 뜻을 가늠해보거나 사전/부모님께 물어본다.',
      '막히는 부분이 나오면 읽기를 즉시 중단한다.',
      '모르는 단어가 있어도 읽은 체한다.'
    ],
    answer: 1,
    explanation: '앞뒤 문맥을 파악하거나 사전/질문을 활용하는 것은 메타인지 수준이 높은 능동적 독서가의 특징입니다.'
  }
];
