import type { Book } from '../types';

export interface AladinItem {
  itemId: number;
  title: string;
  author: string;
  pubDate: string;
  description: string;
  isbn: string;
  isbn13: string;
  priceSales: number;
  priceStandard: number;
  cover: string;
  categoryName: string;
  publisher: string;
  customerReviewRank: number;
}

// Rich Mock Dataset for Aladin Children Books with High-Res Covers
export const ALADIN_CHILDREN_MOCK_BOOKS: Book[] = [
  {
    id: 'ala_1',
    title: '만복이네 떡집',
    author: '김리리 (지은이), 이승현 (그림)',
    publisher: '비룡소',
    coverImage: 'https://image.aladin.co.kr/product/572/93/cover500/8949161358_1.jpg',
    gradeTag: '초등 1~2학년',
    lexileLevel: '어휘 L2 (기초 몰입)',
    trackType: 'comfort',
    recommendReason: '말의 따뜻한 온기와 착한 언어 습관의 가치를 느끼게 하는 추천작',
    summary: '나쁜 말만 하던 만복이가 찹쌀떡을 먹고 착한 말을 하기 시작하며 펼쳐지는 가슴 따뜻한 동화.',
    vocabularyPoints: ['시치미', '용의주도', '마음씨'],
    parentQuestions: [
      '만복이가 착한 말을 했을 때 어떤 기분이 들었을까?',
      '우리 가족이 만든다면 어떤 떡을 만들고 싶니?'
    ],
    rating: 4.9
  },
  {
    id: 'ala_2',
    title: '아홉 살 마음 사전',
    author: '박성우 (지은이), 김효은 (그림)',
    publisher: '창비',
    coverImage: 'https://image.aladin.co.kr/product/10425/89/cover500/k252530188_1.jpg',
    gradeTag: '초등 1~4학년',
    lexileLevel: '어휘 L3 (감정 확장)',
    trackType: 'supplement',
    recommendReason: '섬세한 감정 어휘가 부족한 아이들의 표현력을 다채롭게 채워주는 도서',
    summary: '다양한 감정 상태를 쉬운 예시문으로 풀어내어 감정 표현 어휘를 풍부하게 확장시켜 줍니다.',
    vocabularyPoints: ['벅차다', '서운하다', '뿌듯하다', '쑥스럽다'],
    parentQuestions: [
      '오늘 하루 동안 든 생각 중 "뿌듯함"을 느낀 순간이 있었니?',
      '"서운하다"와 "화나다"의 차이는 무엇일까?'
    ],
    rating: 4.95
  },
  {
    id: 'ala_3',
    title: '푸른 사자 와니니',
    author: '이현 (지은이), 오윤화 (그림)',
    publisher: '창비',
    coverImage: 'https://image.aladin.co.kr/product/6429/43/cover500/8936442753_1.jpg',
    gradeTag: '초등 4~6학년',
    lexileLevel: '어휘 L4 (서사 발달)',
    trackType: 'comfort',
    recommendReason: '초원 모험 서사를 바탕으로 읽기 몰입도와 완독 성취감을 높여주는 책',
    summary: '약하다는 이유로 무리에서 쫓겨난 어린 암사자 와니니가 자신만의 강점을 찾아가는 여정.',
    vocabularyPoints: ['경계', '연대', '자존감'],
    parentQuestions: [
      '와니니가 자신의 단점을 장점으로 바꾼 계기는 무엇이었을까?',
      '친구들과 협동해서 문제를 해결한 경험이 있니?'
    ],
    rating: 4.9
  },
  {
    id: 'ala_4',
    title: '자전거 도둑',
    author: '박완서 (지은이)',
    publisher: '다림',
    coverImage: 'https://image.aladin.co.kr/product/38/53/cover500/8937800262_1.jpg',
    gradeTag: '초등 5~6학년',
    lexileLevel: '어휘 L5 (비판 사고)',
    trackType: 'challenge',
    recommendReason: '양심과 도덕성에 관한 깊이 있는 비판적 추론 지평을 확장하는 도서',
    summary: '청계천 상회에서 일하는 수남이의 갈등과 양심 고백을 통해 도덕적 성장을 다룬 단편 소설집.',
    vocabularyPoints: ['양심', '자괴감', '도덕성'],
    parentQuestions: [
      '수남이가 바람에 날린 자전거를 가져갔을 때 심정은 어땠을까?',
      '어려운 상황에서도 양심을 지키려면 어떤 용기가 필요할까?'
    ],
    rating: 4.8
  },
  {
    id: 'ala_5',
    title: '어린이를 위한 정의란 무엇인가',
    author: '마이클 샌델 원작, 이수영 글',
    publisher: '아이세움',
    coverImage: 'https://image.aladin.co.kr/product/4370/56/cover500/8934967964_1.jpg',
    gradeTag: '초등 5~6학년',
    lexileLevel: '어휘 L6 (심화 논리)',
    trackType: 'challenge',
    recommendReason: '딜레마 상황을 분석하고 논리적 비판 토론 능력을 키워주는 학술 탐구 도서',
    summary: '딜레마 상황을 통해 정당함과 사회적 가치에 대한 다각도 사고를 격려합니다.',
    vocabularyPoints: ['공리주의', '공정', '딜레마'],
    parentQuestions: [
      '다수의 행복을 위해 한 사람의 희생이 정당화될 수 있을까?',
      '공정하다는 것은 무엇을 의미할까?'
    ],
    rating: 4.75
  },
  {
    id: 'ala_6',
    title: '속담이 싹트는 나무',
    author: '유다정 (지은이)',
    publisher: '웅진주니어',
    coverImage: 'https://image.aladin.co.kr/product/2873/95/cover500/8953587621_1.jpg',
    gradeTag: '초등 3~4학년',
    lexileLevel: '어휘 L3 (관용어 클리닉)',
    trackType: 'supplement',
    recommendReason: '비유적 속담 및 관용적 어휘 파악을 집중 보완해주는 처방 도서',
    summary: '일상생활의 에피소드를 통해 속담과 관용 표현의 정확한 문맥적 의미를 습득하도록 돕습니다.',
    vocabularyPoints: ['등잔 밑이 어둡다', '가는 말이 고와야', '백지장도 맞들면'],
    parentQuestions: [
      '"등잔 밑이 어둡다"는 상황을 생활 속에서 본 적이 있니?',
      '속담을 써서 말하면 어떤 장점이 있을까?'
    ],
    rating: 4.85
  },
  {
    id: 'ala_7',
    title: '수상한 아파트',
    author: '박현숙 (지은이)',
    publisher: '북멘토',
    coverImage: 'https://image.aladin.co.kr/product/3697/75/cover500/8997148384_1.jpg',
    gradeTag: '초등 3~4학년',
    lexileLevel: '어휘 L3 (추론 강화)',
    trackType: 'comfort',
    recommendReason: '일상의 미스터리 추리를 통해 흥미진진하게 문맥 추론 능력을 키워주는 도서',
    summary: '아파트에서 벌어지는 수상한 사건들을 해결하며 이웃 간의 소통과 따뜻함을 다룬 이야기.',
    vocabularyPoints: ['추리', '이웃사촌', '의심'],
    parentQuestions: ['주인공이 사건의 범인을 찾아낸 결정적 단서는 무엇이었니?'],
    rating: 4.88
  },
  {
    id: 'ala_8',
    title: '어린이 한자어 확장 사전',
    author: '김승호 (지은이)',
    publisher: '길벗어린이',
    coverImage: 'https://image.aladin.co.kr/product/25695/92/cover500/k832735749_1.jpg',
    gradeTag: '초등 3-6학년',
    lexileLevel: '어휘 L4 (한자어 클리닉)',
    trackType: 'supplement',
    recommendReason: '교과서 주요 한자 어휘의 어원을 쉽게 파악하여 문해력을 급상승시키는 책',
    summary: '핵심 한자 100개로 1,000개 어어를 파생 학습할 수 있는 어린이 어휘력 처방집.',
    vocabularyPoints: ['수출', '수입', '상형문자'],
    parentQuestions: ['비슷한 한자어가 쓰인 다른 단어를 3가지 찾아볼까?'],
    rating: 4.92
  }
];

// High quality cover URL transformer (covers sum/mid to cover500)
export function getHighResCoverUrl(coverUrl: string): string {
  if (!coverUrl) return '';
  return coverUrl.replace('/coversum/', '/cover500/').replace('/cover200/', '/cover500/').replace('/cover/', '/cover500/');
}

// Utility: Auto map Aladin item data to BookFit vocabulary level & 3-Step classification
export function mapAladinToBookFit(aladinItem: AladinItem): Book {
  const text = (aladinItem.title + ' ' + aladinItem.description).toLowerCase();
  
  // Lexile level determination
  let lexileLevel = '어휘 L3 (중급)';
  let gradeTag = '초등 3~4학년';
  let trackType: 'comfort' | 'challenge' | 'supplement' = 'comfort';

  if (text.includes('그림책') || text.includes('1학년') || text.includes('2학년') || text.includes('유아')) {
    lexileLevel = '어휘 L1 (기초 탐색)';
    gradeTag = '초등 1~2학년';
    trackType = 'comfort';
  } else if (text.includes('한자') || text.includes('사전') || text.includes('속담') || text.includes('어휘')) {
    lexileLevel = '어휘 L4 (어휘 클리닉)';
    gradeTag = '초등 3~4학년';
    trackType = 'supplement';
  } else if (text.includes('과학') || text.includes('철학') || text.includes('사회') || text.includes('5학년') || text.includes('6학년')) {
    lexileLevel = '어휘 L5 (비판 탐구)';
    gradeTag = '초등 5~6학년';
    trackType = 'challenge';
  }

  const rawCover = aladinItem.cover || '';
  const highResCover = getHighResCoverUrl(rawCover) || 'https://image.aladin.co.kr/product/572/93/cover500/8949161358_1.jpg';

  return {
    id: `aladin_${aladinItem.itemId || Math.random()}`,
    title: aladinItem.title.replace(/<[^>]+>/g, ''),
    author: aladinItem.author || '북핏 추천 저자',
    publisher: aladinItem.publisher || '어린이 도서관',
    coverImage: highResCover,
    gradeTag,
    lexileLevel,
    trackType,
    recommendReason: `알라딘 아동 우수 도서 랭킹 기반 북핏 ${lexileLevel} 정밀 추천작`,
    summary: aladinItem.description ? aladinItem.description.replace(/<[^>]+>/g, '') : '어린이 문해력 성장을 돕는 알라딘 엄선 우수 도서입니다.',
    vocabularyPoints: ['문맥이해', '어휘확장', '사고력'],
    parentQuestions: [
      '이 책에서 주인공이 한 가장 인상 깊은 행동은 무엇이니?',
      '이야기를 읽으며 새롭게 알게 된 사실이나 단어가 있니?'
    ],
    rating: Number(((aladinItem.customerReviewRank || 9) / 2).toFixed(1)) || 4.8
  };
}

// Fetch helper with API Key & CORS Proxy fallback
export async function searchAladinBooks(query: string): Promise<Book[]> {
  if (query.trim() === '') {
    return ALADIN_CHILDREN_MOCK_BOOKS;
  }

  // 1st attempt: Call internal Serverless / Proxy API Route /api/aladdin
  const serverApiUrl = `/api/aladdin?query=${encodeURIComponent(query)}&maxResults=12`;

  try {
    const res = await fetch(serverApiUrl);
    if (res.ok) {
      const data = await res.json();
      if (data && data.item && Array.isArray(data.item)) {
        return data.item.map((item: AladinItem) => mapAladinToBookFit(item));
      }
    }
  } catch (err) {
    console.error('Single search via /api/aladdin failed:', err);
  }

  // Fallback to direct CORS proxies
  const ttbKey =
    (import.meta.env &&
      (import.meta.env.VITE_ALADIN_TTB_KEY || import.meta.env.NEXT_PUBLIC_ALADIN_TTB_KEY)) ||
    'ttbhyunjuncho8001648001';

  const rawUrl = `https://www.aladin.co.kr/ttb/api/ItemSearch.aspx?ttbkey=${ttbKey}&Query=${encodeURIComponent(
    query
  )}&QueryType=Keyword&MaxResults=12&start=1&SearchTarget=Book&SubSearchTarget=Children&output=js&Version=20131101`;

  const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(rawUrl)}`;

  try {
    let res = await fetch(rawUrl).catch(() => null);
    if (!res || !res.ok) {
      res = await fetch(proxyUrl);
    }

    if (res && res.ok) {
      const data = await res.json();
      if (data && data.item && Array.isArray(data.item)) {
        return data.item.map((item: AladinItem) => mapAladinToBookFit(item));
      }
    }
  } catch (err) {
    console.error('Aladin direct API fetch failed:', err);
  }

  return [];
}

/**
 * Fetch 30 Books at once by Grade / Category from Aladin Open API via Server API Route /api/aladdin
 */
export async function fetchAladinCategoryBooks(
  category: 'low' | 'mid' | 'high' | 'bestseller' = 'low'
): Promise<Book[]> {
  let categoryId = '51100';
  let queryType = 'ItemNewAll';
  let gradeLabel = '초등 1~2학년';
  let lexileTag = '어휘 L2 (기초 몰입)';

  if (category === 'low') {
    categoryId = '51100';
    queryType = 'ItemNewAll';
    gradeLabel = '초등 1~2학년';
    lexileTag = '어휘 L2 (기초 몰입)';
  } else if (category === 'mid') {
    categoryId = '51101';
    queryType = 'ItemNewAll';
    gradeLabel = '초등 3~4학년';
    lexileTag = '어휘 L3 (감정 확장)';
  } else if (category === 'high') {
    categoryId = '51102';
    queryType = 'ItemNewAll';
    gradeLabel = '초등 5~6학년';
    lexileTag = '어휘 L5 (비판 사고)';
  } else if (category === 'bestseller') {
    categoryId = '1108';
    queryType = 'Bestseller';
    gradeLabel = '초등 전학년';
    lexileTag = '어휘 L4 (서사 몰입)';
  }

  // Primary Endpoint: Internal Serverless / Proxy Route /api/aladdin
  const serverApiUrl = `/api/aladdin?categoryId=${categoryId}&queryType=${queryType}&maxResults=30`;

  try {
    const res = await fetch(serverApiUrl);
    if (res.ok) {
      const data = await res.json();
      if (data && data.item && Array.isArray(data.item) && data.item.length > 0) {
        return data.item.map((item: AladinItem) => {
          const mapped = mapAladinToBookFit(item);
          return {
            ...mapped,
            gradeTag: gradeLabel,
            lexileLevel: lexileTag,
          };
        });
      }
    }
  } catch (err) {
    console.error('Fetch via /api/aladdin failed, attempting proxy fallbacks:', err);
  }

  // Backup Endpoints via CORS proxies
  const ttbKey =
    (import.meta.env &&
      (import.meta.env.VITE_ALADIN_TTB_KEY || import.meta.env.NEXT_PUBLIC_ALADIN_TTB_KEY)) ||
    'ttbhyunjuncho8001648001';

  const rawUrl = `https://www.aladin.co.kr/ttb/api/ItemList.aspx?ttbkey=${ttbKey}&QueryType=${queryType}&CategoryId=${categoryId}&MaxResults=30&start=1&SearchTarget=Book&SubSearchTarget=Children&output=js&Version=20131101`;

  const proxies = [
    (u: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
    (u: string) => `https://corsproxy.io/?${encodeURIComponent(u)}`,
  ];

  for (const proxyFn of proxies) {
    try {
      const proxyUrl = proxyFn(rawUrl);
      const res = await fetch(proxyUrl);
      if (res.ok) {
        const data = await res.json();
        if (data && data.item && Array.isArray(data.item) && data.item.length > 0) {
          return data.item.map((item: AladinItem) => {
            const mapped = mapAladinToBookFit(item);
            return {
              ...mapped,
              gradeTag: gradeLabel,
              lexileLevel: lexileTag,
            };
          });
        }
      }
    } catch (err) {
      console.error('Aladin Proxy Fetch Error:', err);
    }
  }

  console.error('All Aladin API fetch endpoints failed. Returning empty list.');
  return [];
}
