import type { DetailedQuestion, DiagnosticResultData, DomainCategory, AgeGroup } from '../types';
import { MOCK_BOOKS } from './mockData';

export interface LiteracyTestQuestion {
  id: number;
  category: string;
  domain: DomainCategory;
  domainName: string;
  questionType?: 'choice' | 'passage' | 'timeattack' | 'likert';
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

// 1. 학령전 (5~7세 유아) 12문항 세트 (기초 파닉스, 음성 상징어, 낱말 감각, 직관적 독해)
export const LITERACY_TEST_PRESCHOOL: LiteracyTestQuestion[] = [
  {
    id: 1,
    category: "해독 및 단어인식",
    domain: "decoding",
    domainName: "해독 및 단어인식",
    questionType: "choice",
    question: "다음 중 멍멍 소리를 내는 강아지의 그림 낱말을 올바르게 고르세요.",
    options: ["강아지", "고양이", "송아지", "망아지"],
    correctAnswer: 0,
    explanation: "소리와 낱말(문자)의 1:1 대응 음운 해독 능력입니다."
  },
  {
    id: 2,
    category: "해독 및 단어인식",
    domain: "decoding",
    domainName: "해독 및 단어인식",
    questionType: "choice",
    question: "다음 중 글자 모양과 소리가 서로 똑같은 단어는 무엇인가요?",
    options: ["나비 - 나비", "바나나 - 사과", "가방 - 시계", "구름 - 바람"],
    correctAnswer: 0,
    explanation: "글자의 시각적 변별 및 정밀 문자 인식 능력 평가입니다."
  },
  {
    id: 3,
    category: "어휘력 및 의미론",
    domain: "vocabulary",
    domainName: "어휘력 및 의미론",
    questionType: "choice",
    question: "'햇살이 쨍쨍 내리쬐는 더운 여름날에 먹으면 가장 시원하고 달콤한 과일'은 무엇일까요?",
    options: ["수박", "군고구마", "호빵", "따뜻한 국물"],
    correctAnswer: 0,
    explanation: "일상 문맥 상황에 알맞은 구체어 어휘 연상 능력입니다."
  },
  {
    id: 4,
    category: "어휘력 및 의미론",
    domain: "vocabulary",
    domainName: "어휘력 및 의미론",
    questionType: "choice",
    question: "다음 중 '키가 크다'와 반대되는 뜻의 단어는 무엇인가요?",
    options: ["키가 작다", "키가 뚱뚱하다", "키가 길다", "키가 무겁다"],
    correctAnswer: 0,
    explanation: "기초 반의어 관계 파악을 통한 공간 어휘 개념 평가입니다."
  },
  {
    id: 5,
    category: "사실적 이해력",
    domain: "comprehension",
    domainName: "사실적 이해력",
    question: "[지문] 토끼는 당근을 좋아합니다. 아침에 숲속 밭에서 주황색 당근 2개를 맛있게 먹었습니다.\n\n질문: 토끼가 먹은 당근의 색깔은 무슨 색인가요?",
    options: ["주황색", "파란색", "검은색", "보라색"],
    correctAnswer: 0,
    explanation: "짧은 듣기/읽기 지문 속 명시적 정보(색깔) 회상 능력 평가입니다."
  },
  {
    id: 6,
    category: "사실적 이해력",
    domain: "comprehension",
    domainName: "사실적 이해력",
    question: "[지문] 곰돌이는 노란 장화를 신고 밖으로 나갔습니다. 비가 그치자 웅덩이에 발을 퐁당 구르며 놀았습니다.\n\n질문: 곰돌이가 신은 장화의 색깔은 무엇인가요?",
    options: ["노란 장화", "빨간 장화", "초록 장화", "파란 장화"],
    correctAnswer: 0,
    explanation: "지문에 제시된 세부 정보(소지품 특징) 정확도 파악입니다."
  },
  {
    id: 7,
    category: "추론적 이해력",
    domain: "comprehension",
    domainName: "추론적 이해력",
    question: "[지문] 야옹이가 방 안에서 하품을 하면서 눈을 끔벅끔벅 감았습니다. 푹신한 방석 위에 누워 꼬리를 조용히 감았습니다.\n\n질문: 야옹이는 지금 무엇을 하려고 할까요?",
    options: ["잠을 자려고 한다", "축구를 하려고 한다", "밥을 먹으려고 한다", "목욕을 하려고 한다"],
    correctAnswer: 0,
    explanation: "인물의 신체 행동(하품, 눈감음)을 통해 다음 상황을 추측하는 직관적 추론 능력입니다."
  },
  {
    id: 8,
    category: "추론적 이해력",
    domain: "comprehension",
    domainName: "추론적 이해력",
    question: "[지문] 다람쥐가 가을 동안 모아둔 도토리를 나뭇구멍 속에 쏙쏙 넣었습니다. 바람이 차가워지고 나뭇잎이 떨어지기 시작했습니다.\n\n질문: 다람쥐가 도토리를 모으는 이유는 무엇일까요?",
    options: ["추운 겨울 동안 먹을 음식을 준비하기 위해", "친구들에게 수영을 가르쳐주기 위해", "여름에 꽃을 피우기 위해", "노래를 부르기 위해"],
    correctAnswer: 0,
    explanation: "자연 현상(계절 변화)과 동물의 행동 동기 간의 원인 추론 능력 평가입니다."
  },
  {
    id: 9,
    category: "비판적/평가적 이해력",
    domain: "comprehension",
    domainName: "비판적/평가적 이해력",
    question: "[지문] 꿀벌이 꽃들에게 '내가 너희의 꽃가루를 옮겨줄게!' 하자, 꽃들은 예쁜 미소를 지었습니다. 하지만 나쁜 악당 몬스터가 나타나 꽃을 밟으려고 했습니다.\n\n질문: 만약 내가 이야기 속 착한 영웅이라면 어떻게 행동하는 것이 가장 바른 행동일까요?",
    options: ["악당을 막아서고 예쁜 꽃밭을 안전하게 지켜준다", "모르는 척 혼자 멀리 도망친다", "꽃을 꺾어서 찢어버린다", "악당과 함께 꽃밭을 부순다"],
    correctAnswer: 0,
    explanation: "동화 속 상황에서 옳고 그름에 대한 가치 판단과 성숙한 태도 평가입니다."
  },
  {
    id: 10,
    category: "비판적/평가적 이해력",
    domain: "comprehension",
    domainName: "비판적/평가적 이해력",
    question: "[지문] 토끼와 거북이가 달리기 경주를 했습니다. 토끼는 거북이가 늦다고 놀리며 길에서 자버렸습니다.\n\n질문: 친구의 걸음이 느리다고 놀린 토끼의 행동은 어떠한가요?",
    options: ["친구의 노력을 놀리는 바람직하지 못한 행동이다", "아주 착하고 훌륭한 행동이다", "상관없이 칭찬해 주어야 한다", "재미있으므로 계속 놀려야 한다"],
    correctAnswer: 0,
    explanation: "인물의 인성 및 태도에 대한 비판적 기초 평가 능력입니다."
  },
  {
    id: 11,
    category: "메타인지 독서전략",
    domain: "metacognition",
    domainName: "메타인지 독서전략",
    question: "그림책을 읽다가 글자를 잘 몰라 내용이 이해되지 않을 때 어떻게 하는 것이 가장 좋은가요?",
    options: ["부모님이나 선생님께 여쭤보거나 그림을 보며 다정한 목소리로 다시 천천히 읽는다", "책을 바닥에 던진다", "아무렇게나 책을 찢는다", "그냥 자버린다"],
    correctAnswer: 0,
    explanation: "유아기 읽기 장애 극복을 위한 조력 요청 및 그림 점검 자기조절 전략입니다."
  },
  {
    id: 12,
    category: "메타인지 독서전략",
    domain: "metacognition",
    domainName: "메타인지 독서전략",
    question: "책 표지에 커다란 공룡 그림이 있을 때, 책을 펼치기 전에 우리는 어떤 생각을 해볼 수 있을까요?",
    options: ["'이 책에는 멋진 공룡들이 나오는 이야기겠구나!' 하고 미리 상상해 본다", "아무 생각도 하지 않는다", "공룡은 무조건 빵만 먹는다고 믿어버린다", "책을 덮어버린다"],
    correctAnswer: 0,
    explanation: "독서 시작 전 표지 힌트를 바탕으로 내용을 미리 예측해보는 활성화 인지 전략입니다."
  }
];

// 2. 초등 저학년 (1~2학년) 12문항 세트 (기초 문법, 다의어, 문학 서사 지문, 기초 자기점검)
export const LITERACY_TEST_ELEMENTARY_LOW: LiteracyTestQuestion[] = [
  {
    id: 1,
    category: "해독 및 단어인식",
    domain: "decoding",
    domainName: "해독 및 단어인식",
    questionType: "choice",
    question: "다음 밑줄 친 글자의 연철(소리 나는 대로 적기)과 표음 규칙이 올바르게 짝지어진 것은?\n'하늘에 떠 있는 **구름이** 바람에 날아갑니다.'",
    options: ["소리: [구르미] / 표기: 구름이", "소리: [구름이] / 표기: 구르미", "소리: [굴미] / 표기: 구름이", "소리: [구림이] / 표기: 구림이"],
    correctAnswer: 0,
    explanation: "받침 연음 법칙([구르미])과 형태소 원형 표기 구분 능력 평가입니다."
  },
  {
    id: 2,
    category: "해독 및 단어인식",
    domain: "decoding",
    domainName: "해독 및 단어인식",
    questionType: "choice",
    question: "다음 괄호 안에 들어갈 의태어로 소리와 모양이 자연스러운 단어는 무엇인가요?\n'아기 오리가 엄마 오리를 따라 (  ) 걸어갑니다.'",
    options: ["아장아장", "우당탕탕", "싱글벙글", "쿨쿨"],
    correctAnswer: 0,
    explanation: "상황에 적절한 시각적/동작적 모양을 표현하는 어휘 해독 평가입니다."
  },
  {
    id: 3,
    category: "어휘력 및 의미론",
    domain: "vocabulary",
    domainName: "어휘력 및 의미론",
    questionType: "choice",
    question: "다음 문장에서 밑줄 친 '손'과 같은 의미로 쓰인 문장은 무엇인가요?\n'일손이 부족하여 할머니의 농사일을 도와드렸다.'",
    options: ["손이 모자라서 작업을 다 마치지 못했다 (일할 사람/일손)", "시계를 차기 위해 손을 씻었다 (신체 기관)", "손가락으로 가리켰다", "손에 장갑을 끼었다"],
    correctAnswer: 0,
    explanation: "다의어 '손'이 신체 일부분이 아닌 '일하는 사람의 노동력'으로 확장 쓰임을 아는지 평가합니다."
  },
  {
    id: 4,
    category: "어휘력 및 의미론",
    domain: "vocabulary",
    domainName: "어휘력 및 의미론",
    questionType: "choice",
    question: "다음 밑줄 친 낱말의 뜻과 가장 가까운 유의어(유사한 단어)는 무엇인가요?\n'지우는 매일 아침 일찍 일어나는 **부지런한** 어린이입니다.'",
    options: ["근면한", "게으른", "산만한", "소란스러운"],
    correctAnswer: 0,
    explanation: "어휘력 확장을 위한 동의 관계(부지런하다 - 근면하다) 파악 능력입니다."
  },
  {
    id: 5,
    category: "사실적 이해력",
    domain: "comprehension",
    domainName: "사실적 이해력",
    questionType: "passage",
    question: "[지문] 준우는 일요일 오후 2시에 동네 공원에서 친구들과 농구를 했습니다. 경기가 끝난 후 시원한 이온음료를 마시고 4시에 집으로 돌아왔습니다.\n\n질문: 준우가 공원에서 집으로 돌아온 시각은 몇 시인가요?",
    options: ["오후 4시", "오후 2시", "오전 10시", "오후 6시"],
    correctAnswer: 0,
    explanation: "지문의 사실 정보 중 수치와 시점 정보를 오차 없이 확인하는 사실적 독해력입니다."
  },
  {
    id: 6,
    category: "사실적 이해력",
    domain: "comprehension",
    domainName: "사실적 이해력",
    questionType: "passage",
    question: "[지문] 매미는 애벌레 상태로 땅속에서 수년 동안 자란 뒤 나무 위로 올라와 껍질을 벗고 성충이 됩니다. 울음소리를 내는 매미는 오직 수컷 매미뿐입니다.\n\n질문: 위 글의 내용으로 사실인 것은 무엇인가요?",
    options: ["울음소리를 내어 노래하는 매미는 수컷 매미이다.", "암컷 매미가 수컷보다 훨씬 크게 울부짖는다.", "매미는 알에서 깨어나자마자 하늘을 날아다닌다.", "매미 애벌레는 물속에서 10년을 산다."],
    correctAnswer: 0,
    explanation: "명시된 일치/불일치 지문 내용을 대조하는 능력입니다."
  },
  {
    id: 7,
    category: "추론적 이해력",
    domain: "comprehension",
    domainName: "추론적 이해력",
    questionType: "passage",
    question: "[지문] 은지는 빨갛게 달아오른 얼굴로 씩씩거리며 씩 옷을 터털 털어냈습니다. 찢어진 숙제 공책 조각을 바닥에서 주워 담으며 입술을 꽉 깨물었습니다.\n\n질문: 은지의 행동을 보고 추측할 수 있는 현재 심정은 어떠한가요?",
    options: ["몹시 화가 나고 속상한 상태이다", "너무 신나서 춤추고 싶은 상태이다", "졸려서 당장 자고 싶은 상태이다", "배가 고파서 신이 난 상태이다"],
    correctAnswer: 0,
    explanation: "인물의 표정, 행동, 상황 묘사를 근거로 감정 상태를 행간 추론하는 능력입니다."
  },
  {
    id: 8,
    category: "추론적 이해력",
    domain: "comprehension",
    domainName: "추론적 이해력",
    questionType: "passage",
    question: "[지문] 식물은 햇빛과 물, 이산화탄소를 이용해 광합성을 하여 스스로 영양분을 만듭니다. 만약 화분을 햇빛이 전혀 들지 않는 어두운 장롱 속에 일주일 동안 넣어둔다면 어떻게 될까요?",
    options: ["잎이 시들고 노랗게 변하며 결국 말라 죽게 된다", "햇빛이 없어서 더 크게 키가 자란다", "열매가 더 달콤하게 맺힌다", "아무런 변화 없이 건강하다"],
    correctAnswer: 0,
    explanation: "원인(햇빛 차단)과 결과(시듦)의 인과관계를 논리적으로 연관 짓는 추론 능력입니다."
  },
  {
    id: 9,
    category: "비판적/평가적 이해력",
    domain: "comprehension",
    domainName: "비판적/평가적 이해력",
    questionType: "passage",
    question: "[지문] '학급 회장 선거에 나온 A 후보는 자기를 뽑아주면 매일 학급 친구들에게 맛있는 아이스크림을 공짜로 사주겠다고 약속했습니다.'\n\n질문: A 후보의 공약에 대한 비판적 평가로 가장 알맞은 것은 무엇인가요?",
    options: ["음식으로 표를 얻으려는 불공정하고 실현 불가능한 공약이다", "무조건 훌륭하므로 100% 뽑아주어야 한다", "공약이 너무 완벽하므로 문제점이 전혀 없다", "학급 회장은 아이스크림만 잘 사주면 된다"],
    correctAnswer: 0,
    explanation: "타당하지 않은 주장의 문제점을 비판적으로 파악하는 평가 판단력입니다."
  },
  {
    id: 10,
    category: "비판적/평가적 이해력",
    domain: "comprehension",
    domainName: "비판적/평가적 이해력",
    questionType: "passage",
    question: "[지문] 친구가 실수로 내 필통을 떨어뜨려 연필이 부러졌습니다. 친구가 미안하다고 바로 사과했을 때 가장 바람직한 나의 태도는 무엇인가요?",
    options: ["실수임을 이해하고 사과를 받아들여 용서해 준다", "화가 나므로 친구의 필통도 똑같이 집어던진다", "절대 용서하지 않고 소리를 지른다", "선생님께 거짓말로 더 크게 일러바친다"],
    correctAnswer: 0,
    explanation: "갈등 상황에서 도덕적 가치관에 입각해 인물의 올바른 대응 행동을 평가하는 능력입니다."
  },
  {
    id: 11,
    category: "메타인지 독서전략",
    domain: "metacognition",
    domainName: "메타인지 독서전략",
    question: "글을 읽는 도중 방금 읽은 문장의 뜻이 머릿속에 잘 들어오지 않을 때 가장 좋은 대처 방법은 무엇인가요?",
    options: ["방금 읽은 단락으로 돌아가 천천히 다시 읽어보며 맥락을 파악한다", "모르는 부분을 그냥 건너뛰고 딴생각을 한다", "책 읽기를 즉시 그만둔다", "글자를 무조건 빨리 넘긴다"],
    correctAnswer: 0,
    explanation: "자신의 독해 모니터링(Comprehension Monitoring) 및 다시 읽기 전략 구사 능력입니다."
  },
  {
    id: 12,
    category: "메타인지 독서전략",
    domain: "metacognition",
    domainName: "메타인지 독서전략",
    question: "동화책을 다 읽은 후 자신의 이해도를 확인하기 위해 스스로 해볼 수 있는 가장 좋은 활동은 무엇인가요?",
    options: ["이야기의 중심 사건과 인물의 기분을 나만의 언어로 간단히 요약해보거나 한 줄 평을 적어본다", "책을 들고 그냥 가방에 넣는다", "책의 쪽수만 센다", "제목만 외우고 잊어버린다"],
    correctAnswer: 0,
    explanation: "독후 인지 구성 점검 및 자기 요약 메타인지 전략입니다."
  }
];

// 3. 초등 중학년 (3~4학년) 12문항 세트 (기존 학술 12문항 세트)
export const LITERACY_TEST_ELEMENTARY_MID: LiteracyTestQuestion[] = [
  {
    id: 1,
    category: "해독 및 단어인식",
    domain: "decoding",
    domainName: "해독 및 단어인식",
    questionType: "choice",
    question: "다음 중 글자의 소리 규칙(파닉스)에 맞게 올바르게 읽은 것은 무엇인가요?",
    options: ["'국물' -> [궁물]", "'신라' -> [신나]", "'같이' -> [가티]", "'부엌' -> [부어ㄱ]"],
    correctAnswer: 0,
    explanation: "음운 규칙(비음화)을 이해하고 문자를 정확한 소리로 변환(Decoding)하는 능력입니다."
  },
  {
    id: 2,
    category: "해독 및 단어인식",
    domain: "decoding",
    domainName: "해독 및 단어인식",
    questionType: "choice",
    question: "다음 의미 없는 가짜 단어(Non-word)를 자모 음소 대응 규칙대로 바르게 읽은 것을 고르세요. [ 단어: 븜린 ]",
    options: ["봄린", "븜닌", "븜린", "붐린"],
    correctAnswer: 2,
    explanation: "SVR 모형에 기초하여, 사전 지식의 개입 없이 순수하게 자모음을 조합하여 소리 내는 해독력을 평가합니다."
  },
  {
    id: 3,
    category: "어휘력 및 의미론",
    domain: "vocabulary",
    domainName: "어휘력 및 의미론",
    questionType: "choice",
    question: "다음 문장의 빈칸에 들어갈 가장 알맞은 단어는 무엇인가요?\n'비가 와서 강물이 불어나자, 건너편 마을로 가는 다리가 (  ) 되었다.'",
    options: ["단절", "연결", "지속", "확장"],
    correctAnswer: 0,
    explanation: "문맥 속에서 어휘의 의미학적 적합성(Semantics)을 파악하는 언어 이해력 평가입니다."
  },
  {
    id: 4,
    category: "어휘력 및 의미론",
    domain: "vocabulary",
    domainName: "어휘력 및 의미론",
    questionType: "choice",
    question: "다음 밑줄 친 단어와 뜻이 반대인 것은 무엇인가요?\n'탐정은 범인의 흔적을 용의주도하게 살폈다.'",
    options: ["세심하게", "치밀하게", "소홀하게", "주의 깊게"],
    correctAnswer: 2,
    explanation: "단순 뜻 암기를 넘어 단어 간의 반의 관계 및 의미 깊이를 측정합니다."
  },
  {
    id: 5,
    category: "사실적 이해력",
    domain: "comprehension",
    domainName: "사실적 이해력",
    questionType: "passage",
    question: "[지문] 민수는 어제 도서관에서 역사책을 두 권 빌렸다. 오늘 아침에는 축구를 하고 나서 점심으로 비빔밥을 먹었다.\n\n질문: 민수가 축구를 한 때는 언제인가요?",
    options: ["어제 아침", "어제 저녁", "오늘 아침", "오늘 점심 이후"],
    correctAnswer: 2,
    explanation: "지문에 직접 명시된 사건의 발생 시점과 정보의 순서를 정확히 파악하는 사실적 독해력 평가입니다."
  },
  {
    id: 6,
    category: "사실적 이해력",
    domain: "comprehension",
    domainName: "사실적 이해력",
    questionType: "passage",
    question: "[지문] 꿀벌은 꽃의 꿀을 채집하여 벌통으로 가져온다. 이 과정에서 꿀벌의 몸에 묻은 꽃가루가 다른 꽃으로 옮겨지며 식물의 열매를 맺게 돕는다.\n\n질문: 지문의 내용과 일치하는 것은 무엇인가요?",
    options: ["꿀벌은 열매를 섭취하여 꽃가루를 만든다.", "꿀벌이 꿀을 옮길 때 꽃가루도 함께 이동한다.", "꽃은 꿀벌이 없어도 스스로 이동하여 열매를 맺는다.", "꿀벌은 벌통 속에서 꽃을 키운다."],
    correctAnswer: 1,
    explanation: "텍스트에 제시된 명시적 정보를 오류 없이 확인하고 대조하는 능력입니다."
  },
  {
    id: 7,
    category: "추론적 이해력",
    domain: "comprehension",
    domainName: "추론적 이해력",
    questionType: "passage",
    question: "[지문] 창밖을 내다보던 지우는 한숨을 쉬며 현관문 옆에 뒀던 우산과 장화를 조용히 제자리에 넣었다. 그리고 소파에 앉아 책을 펴 들었다.\n\n질문: 지우가 우산과 장화를 제자리에 넣은 이유는 무엇일까요?",
    options: ["비가 멈추고 날씨가 맑아져서 나가려던 계획이 바뀌었거나, 비가 오지 않아서", "장화가 작아져서 새 장화를 사러 가기 위해", "도서관에 가려면 우산이 필요 없기 때문에", "소파 청소를 하기 위해서"],
    correctAnswer: 0,
    explanation: "글에 명시되지 않은 상황을 행동(우산/장화를 치움)과 감정(한숨)을 통해 배경지식과 연결하는 추론적 이해력입니다."
  },
  {
    id: 8,
    category: "추론적 이해력",
    domain: "comprehension",
    domainName: "추론적 이해력",
    questionType: "passage",
    question: "[지문] 사막에 사는 선인장은 잎이 가시 모양으로 변형되어 있다. 이는 수분이 증발하는 것을 막고, 동물이 자신을 먹지 못하게 보호하는 역할을 한다.\n\n질문: 만약 선인장의 잎이 가시가 아니라 넙적하고 큰 일반 잎이었다면 사막에서 어떤 일이 벌어졌을까요?",
    options: ["수분 증발이 심해지고 동물들에게 먹혀 살아남기 힘들었을 것이다.", "물이 전혀 필요 없어 더 빠르게 자랐을 것이다.", "가시가 없어서 동물들과 더 친하게 지냈을 것이다.", "햇빛을 받지 못해 말라 죽었을 것이다."],
    correctAnswer: 0,
    explanation: "원인과 결과(인과관계)의 원리를 이해하고 조건 변화에 따른 결과를 논리적으로 예측하는 능력입니다."
  },
  {
    id: 9,
    category: "비판적/평가적 이해력",
    domain: "comprehension",
    domainName: "비판적/평가적 이해력",
    questionType: "passage",
    question: "[지문] 스마트폰은 언제 어디서나 정보를 검색할 수 있게 해준다. 따라서 모든 학생들에게 수업 시간 중 자유로운 스마트폰 사용을 무제한 허용해야 한다.\n\n질문: 위 주장의 논리적 문제점(약점)으로 가장 적절한 것은 무엇인가요?",
    options: ["정보 검색의 장점만 언급했을 뿐, 수업 집중력 저하나 게임 중독 등의 부작용은 고려하지 않았다.", "스마트폰은 정보를 검색하는 기능이 아예 없기 때문이다.", "모든 학생이 스마트폰을 좋아하기 때문이다.", "수업 시간에는 오직 책만 읽어야 하기 때문이다."],
    correctAnswer: 0,
    explanation: "저자의 주장이나 논리의 타당성, 편향성을 비판적으로 평가하는 상위 독해력 평가입니다."
  },
  {
    id: 10,
    category: "비판적/평가적 이해력",
    domain: "comprehension",
    domainName: "비판적/평가적 이해력",
    questionType: "passage",
    question: "[지문] '거짓말을 해서는 안 된다'는 도덕적 원칙이 있다. 그러나 의사가 중병에 걸린 환자가 충격을 받지 않도록 완치될 수 있다는 희망적인 말을 건넸다.\n\n질문: 의사의 행동을 비판적/도덕적 관점에서 평가한 것으로 가장 성숙한 시각은 무엇인가요?",
    options: ["어떤 상황에서도 거짓말은 나쁘므로 의사는 벌을 받아야 한다.", "원칙도 중요하지만, 상대방을 배려하고 생명을 살리기 위한 선의의 목적을 함께 고려해 평가해야 한다.", "의사는 거짓말을 해도 절대 아무런 문제가 되지 않는다.", "환자가 눈치채지 못했으니 도덕적으로 전혀 평가할 필요가 없다."],
    correctAnswer: 1,
    explanation: "글에 나타난 인물의 행동과 도덕적 가치를 다각도로 평가하는 비판/창의적 이해력입니다."
  },
  {
    id: 11,
    category: "메타인지 독서전략",
    domain: "metacognition",
    domainName: "메타인지 독서전략",
    questionType: "choice",
    question: "글을 읽다가 처음 보는 어려운 단어나 이해가 잘 되지 않는 문장을 만났을 때, Garner(1987)의 독서 메타인지 전략에 부합하는 가장 올바른 행동은 무엇인가요?",
    options: [
      "무조건 읽기를 멈추고 그 책을 포기하거나 아예 덮어버린다.",
      "앞 문장이나 뒤 문장을 다시 읽어보며(Look-back) 문맥을 통해 단어의 뜻을 스스로 추측해 보거나 사전을 찾는다.",
      "모르는 단어는 무시하고 그냥 글자만 빠르게 끝까지 읽는다.",
      "책을 읽는 척하며 페이지만 넘긴다."
    ],
    correctAnswer: 1,
    explanation: "독서 중 이해 상태를 모니터링하고 복구 전략(Look-back strategy)을 구사하는 자기조절 능력입니다."
  },
  {
    id: 12,
    category: "메타인지 독서전략",
    domain: "metacognition",
    domainName: "메타인지 독서전략",
    questionType: "passage",
    question: "[지문] '펭귄은 날개가 있지만 하늘을 날 수 없는 새입니다. 그래서 펭귄은 하늘을 매우 높이 날아다니며 나무 위에 둥지를 짓습니다.'\n\n질문: 글을 읽으며 스스로 이해를 점검(Monitoring)하는 독자라면 위 지문에서 무엇을 발견해야 할까요?",
    options: [
      "앞 문장에서는 '날 수 없다'고 하고 뒤에서는 '높이 날아다닌다'고 하는 논리적 모순(오류)을 감지해야 한다.",
      "펭귄이 새라는 사실을 새롭게 알았다고 기뻐해야 한다.",
      "아무런 이상한 점 없이 문장이 아주 잘 작성되었다고 생각한다.",
      "나무 위에 둥지를 짓는 펭귄의 그림을 그려야 한다."
    ],
    correctAnswer: 0,
    explanation: "텍스트 내 정보의 충돌이나 모순을 즉각 감지해 내는 인지적 감시(Error Monitoring) 능력 평가입니다."
  }
];

// 4. 초등 고학년 (5~6학년) 12문항 세트 (고급 한자어, 비판적 논거 검증, 심화 인과 및 이중 딜레마)
export const LITERACY_TEST_ELEMENTARY_HIGH: LiteracyTestQuestion[] = [
  {
    id: 1,
    category: "해독 및 단어인식",
    domain: "decoding",
    domainName: "해독 및 단어인식",
    questionType: "choice",
    question: "다음 한자어 및 외래어의 받침 규정과 표준 음운 변동(구음화/첨가)이 올바르게 일어난 어휘는 무엇인가요?",
    options: ["'핥다' -> [할따]", "'알약' -> [알약]", "'꽃밭' -> [꽃받]", "'독립' -> [독립]"],
    correctAnswer: 0,
    explanation: "겹받침 자음군 단순화와 된소리끄기 법칙([할따])의 정밀 음운 해독 유창성입니다."
  },
  {
    id: 2,
    category: "해독 및 단어인식",
    domain: "decoding",
    domainName: "해독 및 단어인식",
    questionType: "choice",
    question: "다음 중 어휘의 형태학적 결합 방식(접사 + 어근)이 잘못 분석된 단어는 무엇인가요?",
    options: ["풋사과 = 풋(접두사: 미숙한) + 사과(어근)", "알짜배기 = 알짜(어근) + 배기(접미사)", "맨손 = 맨(접두사: 다른 것이 없는) + 손(어근)", "돌다리 = 돌(접두사) + 다리(접미사)"],
    correctAnswer: 3,
    explanation: "어휘 구조 분석에서 '돌다리'는 실질 형태소인 어근(돌)과 어근(다리)의 합성어임을 구분하는 능력입니다."
  },
  {
    id: 3,
    category: "어휘력 및 의미론",
    domain: "vocabulary",
    domainName: "어휘력 및 의미론",
    questionType: "choice",
    question: "다음 문장의 밑줄 친 교과 한자어 **'상쇄(相殺)'**의 문맥적 의미로 가장 타당한 것은?\n'긍정적인 성과가 이전의 손실을 어느 정도 **상쇄**해 주었다.'",
    options: ["상반되는 영향력이 서로 상쇄되어 없어지거나 감소함", "상대방을 물리적으로 공격함", "서로의 주장을 더 크게 증폭시킴", "정보를 일방적으로 삭제함"],
    correctAnswer: 0,
    explanation: "초등 고학년 교과 비문학 어휘 '상쇄'의 고차원 의미 파악 능력입니다."
  },
  {
    id: 4,
    category: "어휘력 및 의미론",
    domain: "vocabulary",
    domainName: "어휘력 및 의미론",
    questionType: "choice",
    question: "다음 관용적 표현과 한자 성어의 의미 짝지음이 올바르지 않은 것은 무엇인가요?",
    options: ["'발 벗고 나서다' = 적극적으로 돕다 (주도적)", "'배보다 배꼽이 더 크다' = 본체보다 부수적인 것이 더 큼", "'눈가리고 아웅하다' = 솔직하게 모든 사실을 고백함", "'어불성설' = 말이 이치에 맞지 아니함"],
    correctAnswer: 2,
    explanation: "비유적 속담 및 관용어의 깊이 있는 은유 구조 이해입니다."
  },
  {
    id: 5,
    category: "사실적 이해력",
    domain: "comprehension",
    domainName: "사실적 이해력",
    questionType: "passage",
    question: "[지문] 인공지능(AI)은 크게 두 가지로 분류된다. 특정 분야의 데이터만을 학습하여 제한된 영역에서만 동작하는 '약한 인공지능(Weak AI)'과, 인간처럼 자의식과 범용적 사고 능력을 갖춘 '강한 인공지능(Strong AI)'이다. 현재 우리가 사용하는 자율주행이나 번역 서비스는 모두 약한 인공지능에 해당한다.\n\n질문: 위 기술 설명 지문의 정보와 정확히 일치하는 것은 무엇인가요?",
    options: ["현재 상용화된 자율주행 기술은 '약한 인공지능'의 사례에 속한다.", "강한 인공지능은 자의식이 없으며 단 하나의 명령만 수행할 수 있다.", "약한 인공지능과 강한 인공지능은 구분하는 기준이 아예 존재하지 않는다.", "현재 모든 번역 앱은 강한 인공지능으로 이미 구현되어 있다."],
    correctAnswer: 0,
    explanation: "설명적 설명문(비문학) 지문의 엄밀한 사실 정보 추출 능력입니다."
  },
  {
    id: 6,
    category: "사실적 이해력",
    domain: "comprehension",
    domainName: "사실적 이해력",
    questionType: "passage",
    question: "[지문] 조선 시대의 대동법(大同法)은 특산물로 바치던 공납을 쌀(대동미)로 통일하여 징수하게 한 제도이다. 토지 소유 면적에 따라 세금을 차등 부과했기 때문에 대지주의 반발이 심해 전국적으로 실시되기까지 약 100년의 시간이 걸렸다.\n\n질문: 대동법 시행이 전국으로 확산되는 데 장기간이 걸린 직접적 원인은 무엇인가요?",
    options: ["토지를 많이 가진 대지주들의 강력한 반발과 저항이 있었기 때문이다.", "조선 시대에 쌀이 아예 산출되지 않았기 때문이다.", "왕이 대동법 시행을 원치 않았기 때문이다.", "농민들이 특산물 바치는 것을 더 선호했기 때문이다."],
    correctAnswer: 0,
    explanation: "역사적 설명문 텍스트의 인과적 사실 관계(대지주 반발 ➔ 100년 소요) 파악입니다."
  },
  {
    id: 7,
    category: "추론적 이해력",
    domain: "comprehension",
    domainName: "추론적 이해력",
    questionType: "passage",
    question: "[지문] 박물관 관장은 어두운 표정으로 전시실의 텅 빈 유리관을 바라보았다. 바닥에는 잔 경보음선 조각과 먼지 자국만 남아있었고, 방범 카메라 장비의 전원 선은 예리하게 단선되어 있었다.\n\n질문: 위 지문의 상황으로 미루어 볼 때 전시실에서 일어난 사건은 무엇일까요?",
    options: ["경보 장치를 해제한 전문가에 의한 정밀 도난 사건이 발생했다.", "관장이 박물관 청소를 완료하고 퇴근을 준비하고 있다.", "새로운 유물이 도탁하여 전시 준비를 시작했다.", "방범 카메라를 새로 구매하여 설치하고 있다."],
    correctAnswer: 0,
    explanation: "암시적 정황(단선된 전원선, 텅 빈 유리관, 어두운 표정)을 융합하여 미지의 사건을 고차 추론하는 능력입니다."
  },
  {
    id: 8,
    category: "추론적 이해력",
    domain: "comprehension",
    domainName: "추론적 이해력",
    questionType: "passage",
    question: "[지문] 인플레이션(물가 상승)이 가파르게 지속되면 화폐의 실질 가치가 하락한다. 이에 따라 중앙은행은 시중의 통화량을 줄이기 위해 기준 금리를 인상하는 정책을 펴게 된다.\n\n질문: 만약 중앙은행이 물가 폭등에도 불구하고 금리를 계속 낮게 유지한다면 시중 경제에 어떤 결과가 초래될까요?",
    options: ["화폐 가치가 더 하락하여 물가 상승이 억제되지 않고 심화될 것이다.", "물가가 즉시 안정되고 돈의 가치가 급상승할 것이다.", "모든 인플레이션이 하루 만에 종식될 것이다.", "시중의 통화량이 완전히 0으로 줄어들 것이다."],
    correctAnswer: 0,
    explanation: "사회/경제적 인과 메커니즘을 바탕으로 조건 반전 시의 결과를 논리적으로 추론하는 사고력입니다."
  },
  {
    id: 9,
    category: "비판적/평가적 이해력",
    domain: "comprehension",
    domainName: "비판적/평가적 이해력",
    questionType: "passage",
    question: "[지문] '전자책은 종이 냄새가 나지 않으며 눈의 피로를 유발한다. 따라서 모든 종이책을 전면 폐기하고 전자책만을 100% 의무화해야 한다.'\n\n질문: 위 주장에 포함된 논리적 오류(모순)는 무엇인가요?",
    options: ["제시한 근거(단점)와 결론(전면 의무화)이 서로 모순되며 논리적 타당성이 결여되어 있다.", "전자책의 장점만 지나치게 나열했기 때문이다.", "종이책이 전자책보다 항상 가볍기 때문이다.", "아무런 결론을 내리지 않았기 때문이다."],
    correctAnswer: 0,
    explanation: "글쓴이 주장의 전제와 결론 간의 논리적 모순과 타당성을 비판적으로 검증하는 고차원 독해력입니다."
  },
  {
    id: 10,
    category: "비판적/평가적 이해력",
    domain: "comprehension",
    domainName: "비판적/평가적 이해력",
    questionType: "passage",
    question: "[지문] 희귀병 치료제를 개발한 제약회사가 해당 약품의 특허권을 독점하여 매우 높은 가격을 책정했다. 이로 인해 돈이 없는 환자들은 치료를 받지 못하고 있다.\n\n질문: 제약회사의 행동을 기술 혁신과 도덕적 인권 관점에서 다각도로 평가한 시각 중 가장 비판적으로 성숙한 분석은 무엇인가요?",
    options: ["신약 개발의 경제적 유인도 필요하지만, 인간의 생명권과 인권을 고려하여 특허 독점 완화나 가격 지원책이 함께 검토되어야 한다.", "자유시장 경제이므로 환자의 생명과 상관없이 가격을 무한정 올려야만 한다.", "특허권을 인정해주면 절대 안 되므로 모든 신약 개발을 금지해야 한다.", "돈이 없는 환자의 잘못이므로 제약회사는 아무런 책임이 없다."],
    correctAnswer: 0,
    explanation: "사회적 딜레마 문제에서 복수의 가치를 비교 판단하는 입체적 비판 사고입니다."
  },
  {
    id: 11,
    category: "메타인지 독서전략",
    domain: "metacognition",
    domainName: "메타인지 독서전략",
    questionType: "choice",
    question: "전문적인 학술 비문학 글을 읽을 때, 독해 효과를 극대화하기 위해 구사하는 인지 전략(SQ3R) 중 'Review(복습/점검)' 단계에 해당하는 행동은 무엇인가요?",
    options: [
      "글을 다 읽은 후 핵심 개념 간의 관계를 구조화(마인드맵/요약)하고 이해되지 않은 부분을 찾아 재검토한다.",
      "글의 제목만 보고 내용을 다 안다고 생각하며 책을 덮어버린다.",
      "첫 페이지만 읽고 나머지 100페이지를 한꺼번에 건너뛴다.",
      "모르는 한자어가 나올 때마다 사전을 보지 않고 무조건 넘긴다."
    ],
    correctAnswer: 0,
    explanation: "고난도 비문학 읽기 시 SQ3R 구조화 및 점검 메타인지 전략 구사 능력입니다."
  },
  {
    id: 12,
    category: "메타인지 독서전략",
    domain: "metacognition",
    domainName: "메타인지 독서전략",
    questionType: "passage",
    question: "[지문] '지구 온난화로 인해 북극의 빙하가 빠르게 녹고 있습니다. 따라서 북극곰의 서식지가 확대되어 북극곰의 개체 수가 급격히 증가하고 있습니다.'\n\n질문: 정밀한 인지 모니터링(Comprehension Monitoring)을 수행하는 비판적 독자라면 위 지문에서 무엇을 감지해야 할까요?",
    options: [
      "'서식지 파괴'라는 상식적 원인과 '개체 수 증가'라는 텍스트 내부의 인과적 모순 오류를 감지하고 수정을 의구심을 품는다.",
      "북극곰의 수가 늘어났다니 다행이라고 생각하고 그냥 넘어간다.",
      "북극에 빙하가 늘어나고 있다는 내용으로 오인한다.",
      "지구 온난화가 좋은 현상이라고 결론짓는다."
    ],
    correctAnswer: 0,
    explanation: "텍스트 읽기 중 실시간 오류 모니터링(Error Monitoring) 및 정보 타당성 검증 메타인지 능력입니다."
  }
];

// 5. 연령대별 문항 데이터 매핑 맵
export const LITERACY_TEST_BY_AGE: Record<AgeGroup, LiteracyTestQuestion[]> = {
  preschool: LITERACY_TEST_PRESCHOOL,
  elementary_low: LITERACY_TEST_ELEMENTARY_LOW,
  elementary_mid: LITERACY_TEST_ELEMENTARY_MID,
  elementary_high: LITERACY_TEST_ELEMENTARY_HIGH,
};

export const LITERACY_TEST_QUESTIONS: LiteracyTestQuestion[] = LITERACY_TEST_ELEMENTARY_MID;
export const DIAGNOSTIC_QUESTIONS: DetailedQuestion[] = LITERACY_TEST_ELEMENTARY_MID;

export const calculateFinalResults = (
  userAnswers: Record<number, number> | number[],
  ageGroup: AgeGroup = 'elementary_mid'
) => {
  const questions = LITERACY_TEST_BY_AGE[ageGroup] || LITERACY_TEST_ELEMENTARY_MID;
  let correctCount = 0;
  const categoryScores: Record<string, number> = {};

  questions.forEach((q, index) => {
    const val = (userAnswers as any)[q.id] !== undefined
      ? (userAnswers as any)[q.id]
      : (userAnswers as any)[index];

    const isCorrect = val !== undefined && String(val) === String(q.correctAnswer);
    if (isCorrect) {
      correctCount++;
      categoryScores[q.category] = (categoryScores[q.category] || 0) + 1;
    }
  });

  const totalScore = Math.round((correctCount / questions.length) * 100);

  const level = totalScore >= 90 ? "L5 (최우수 - 숙련된 독자)" :
                totalScore >= 75 ? "L4 (우수 - 유창한 독자)" :
                totalScore >= 50 ? "L3 (보통 - 발전 중인 독자)" :
                totalScore >= 30 ? "L2 (기초 - 추론 및 메타인지 보완 필요)" : "L1 (입문 - 해독 및 어휘 집중 지원 필요)";

  return {
    totalScore,
    correctCount,
    totalQuestions: questions.length,
    categoryScores,
    level,
    ageGroup
  };
};

export const DEFAULT_MOCK_RESULT: DiagnosticResultData = {
  ageGroup: 'elementary_mid',
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
    '5대 국제 프레임워크 기반 12개 진단 문항 100점 완벽 달성',
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
