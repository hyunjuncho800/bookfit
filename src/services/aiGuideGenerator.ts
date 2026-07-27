import type { AIGeneratedGuide } from '../types';

export interface GenerateGuideRequest {
  title: string;
  description?: string;
  targetAge?: string;
}

export async function generateBookGuideAI(req: GenerateGuideRequest): Promise<AIGeneratedGuide> {
  const apiKey =
    (import.meta.env &&
      (import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.NEXT_PUBLIC_OPENAI_API_KEY)) ||
    '';

  const title = req.title || '추천 도서';
  const description = req.description || `${title}은(는) 문해력 향상을 돕는 맞춤 추천 도서입니다.`;

  // System Prompt for 18-year veteran Speech-Language Pathologist / Literacy Expert
  const systemPrompt =
    '너는 18년 차 아동 언어재활사이자 문해력 전문가야. 주어진 책 정보를 바탕으로 아이의 독해력, 어휘력, 추론력을 확장할 수 있는 독후 질문과 어휘 퀴즈를 JSON 형식으로 응답해 줘.';

  const userPrompt = `
[책 정보]
- 제목: ${title}
- 줄거리 및 설명: ${description}
- 대상 연령/어휘 레벨: ${req.targetAge || '초등 3~4학년'}

아래 JSON 형식 규격에 맞추어 한국어로 답변해 줘. 반드시 순수 JSON만 반환해 줘:
{
  "beforeReading": ["읽기 전 질문 1", "읽기 전 질문 2"],
  "duringReading": ["읽는 중 질문 1", "읽는 중 질문 2", "읽는 중 질문 3", "읽는 중 질문 4"],
  "afterReading": ["읽은 후 질문 1", "읽은 후 질문 2", "읽은 후 질문 3", "읽은 후 질문 4"],
  "vocabularyQuiz": [
    { "word": "단어1", "meaning": "뜻 설명", "question": "단어 활용 퀴즈 질문", "options": ["보기1", "보기2", "보기3"], "answerIndex": 0 },
    { "word": "단어2", "meaning": "뜻 설명", "question": "단어 활용 퀴즈 질문", "options": ["보기1", "보기2", "보기3"], "answerIndex": 0 },
    { "word": "단어3", "meaning": "뜻 설명", "question": "단어 활용 퀴즈 질문", "options": ["보기1", "보기2", "보기3"], "answerIndex": 0 }
  ]
}
`;

  if (apiKey) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.7,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices[0]?.message?.content;
        if (content) {
          const parsed = JSON.parse(content) as AIGeneratedGuide;
          return parsed;
        }
      }
    } catch (err) {
      console.warn('OpenAI API call failed, switching to BookFit Dynamic Fallback Generator:', err);
    }
  }

  // AI Fallback Generator with Dynamic Prompts based on Title & Description
  return generateFallbackGuide(title, description);
}

function generateFallbackGuide(title: string, description: string): AIGeneratedGuide {
  // Title & Description keyword matching pool
  const isScience = description.includes('과학') || description.includes('우주') || description.includes('자연') || title.includes('과학') || title.includes('세상');
  const isHistory = description.includes('역사') || description.includes('옛날') || description.includes('조선') || title.includes('역사');

  // Dynamic Vocabulary Quiz Pool
  const vocabPool = [
    {
      word: '통찰력(洞察力)',
      meaning: '사물이나 현상을 예리하게 관찰하여 그 본질을 꿰뚫어 보는 능력.',
      question: `"${title}"에서 주인공이 문제의 원인을 꿰뚫어 볼 때 발휘한 능력은 무엇일까요?`,
      options: ['통찰력', '무관심', '성급함'],
      answerIndex: 0,
    },
    {
      word: '용의주도(周到)',
      meaning: '준비가 지극히 세밀하고 철저하여 빈틈이 없음.',
      question: `빈칸에 들어갈 알맞은 단어는? "${title}의 등장인물은 사건을 해결하기 위해 (  )하게 준비했다."`,
      options: ['용의주도', '방심', '주목'],
      answerIndex: 0,
    },
    {
      word: '맥락(脈絡)',
      meaning: '사물이나 사건이 서로 연결되어 이루어지는 줄기나 범위.',
      question: `이야기의 앞뒤 상황과 분위기를 고려하여 의미를 파악하는 것을 무엇이라고 할까요?`,
      options: ['맥락 파악', '단어 암기', '무작정 읽기'],
      answerIndex: 0,
    },
    {
      word: isScience ? '탐구심(探求心)' : isHistory ? '시대상(時代相)' : '공감(共感)',
      meaning: isScience ? '어떤 사물의 이치나 사실을 깊이 파고들어 연구하려는 마음.' : isHistory ? '그 시대의 사회적 상황이나 문화적 모습.' : '남의 감정, 의견, 주장 따위에 자기도 그렇다고 느끼는 마음.',
      question: `"${title}"을 읽으며 등장인물의 기분과 생각에 깊이 빠져드는 마음은 무엇일까요?`,
      options: [isScience ? '탐구심' : isHistory ? '시대상' : '공감력', '시기심', '무관심'],
      answerIndex: 0,
    },
  ];

  return {
    beforeReading: [
      `표지와 제목 "${title}"을 보았을 때, 어떤 인물이 나오고 어떤 사건이 펼쳐질지 상상해볼까?`,
      `이 책의 제목 "${title}"에서 가장 기대되거나 눈길을 끄는 단어는 무엇이니?`,
    ],
    duringReading: [
      `"${title}"에서 주인공이 중요한 선택의 기로에 섰을 때, 나라면 어떻게 행동했을지 말해보자.`,
      `이야기의 배경과 분위기, 또는 결정적인 사건의 원인은 무엇이었을까?`,
      `주인공의 기분(기쁨, 서운함, 용기)이 변하게 된 가장 큰 계기는 무엇이었니?`,
      `지문 속 나오는 낯선 어휘의 뜻을 앞뒤 문장의 맥락을 통해 유추해 보았니?`,
    ],
    afterReading: [
      `"${title}"을 읽고 가장 기억에 남는 명장면이나 대사는 무엇이었니?`,
      `"${title}"의 주인공에게 해주고 싶은 따뜻한 격려나 질문은 무엇이니?`,
      `이 책의 결말이 만약 달랐다면 다음 이야기를 어떻게 새롭게 지어볼 수 있을까?`,
      `이 책을 친구나 부모님에게 추천한다면 어떤 이유를 말해주고 싶니?`,
    ],
    vocabularyQuiz: vocabPool.slice(0, 3),
  };
}
