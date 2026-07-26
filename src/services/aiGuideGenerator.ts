import type { AIGeneratedGuide } from '../types';

export interface GenerateGuideRequest {
  title: string;
  description: string;
  targetAge?: string;
}

export async function generateBookGuideAI(req: GenerateGuideRequest): Promise<AIGeneratedGuide> {
  const apiKey =
    (import.meta.env &&
      (import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.NEXT_PUBLIC_OPENAI_API_KEY)) ||
    '';

  // System Prompt for 18-year veteran Speech-Language Pathologist / Literacy Expert
  const systemPrompt =
    '너는 18년 차 아동 언어재활사이자 문해력 전문가야. 주어진 책 정보를 바탕으로 아이의 독해력, 어휘력, 추론력을 확장할 수 있는 독후 질문과 어휘 퀴즈를 JSON 형식으로 응답해 줘.';

  const userPrompt = `
[책 정보]
- 제목: ${req.title}
- 줄거리 및 설명: ${req.description}
- 대상 연령/어휘 레벨: ${req.targetAge || '초등 3~4학년'}

아래 JSON 형식 규격에 맞추어 한국어로 답변해 줘. 반드시 순수 JSON만 반환해 줘:
{
  "beforeReading": ["읽기 전 질문 1", "읽기 전 질문 2"],
  "duringReading": ["읽는 중 질문 1", "읽는 중 질문 2", "읽는 중 질문 3", "읽는 중 질문 4"],
  "afterReading": ["읽은 후 질문 1", "읽은 후 질문 2", "읽은 후 질문 3", "읽은 후 질문 4"],
  "vocabularyQuiz": [
    { "word": "단어1", "meaning": "뜻 설명", "question": "단어 활용 퀴즈 질문" },
    { "word": "단어2", "meaning": "뜻 설명", "question": "단어 활용 퀴즈 질문" },
    { "word": "단어3", "meaning": "뜻 설명", "question": "단어 활용 퀴즈 질문" }
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
      console.warn('OpenAI API call failed, switching to BookFit AI Fallback Generator:', err);
    }
  }

  // AI Fallback Generator with Speech Therapist level prompts
  return generateFallbackGuide(req.title);
}

function generateFallbackGuide(title: string): AIGeneratedGuide {
  return {
    beforeReading: [
      `표지와 제목 "${title}"을 보았을 때, 어떤 인물이 나오고 어떤 사건이 펼쳐질지 상상해볼까?`,
      `이 책의 제목에서 가장 호기심이 생기는 단어는 무엇이니?`
    ],
    duringReading: [
      `주인공이 중요한 선택을 직면했을 때, 나라면 어떤 행동을 했을지 멈추어 생각해보자.`,
      `지문 속에 나오는 낯선 어휘의 문맥적 의미를 앞뒤 문장을 통해 가늠해보았니?`,
      `주인공의 감정(기쁨, 서운함, 억울함)이 급격히 변화한 계기는 무엇이었을까?`,
      `이야기의 배경이나 상황이 주는 분위기를 한 단어로 표현해볼까?`
    ],
    afterReading: [
      `이 책에서 가장 기억에 남는 명장면이나 대사는 무엇이었니?`,
      `주인공의 선택이 만약 달랐다면 결말은 어떻게 바뀌었을까?`,
      `오늘 읽은 책의 내용을 바탕으로 부모님이나 친구에게 추천하고 싶은 이유는 무엇이니?`,
      `이야기가 끝난 후 주인공의 삶은 어떻게 이어졌을지 다음 이야기를 지어볼까?`
    ],
    vocabularyQuiz: [
      {
        word: '경계하다',
        meaning: '뜻밖의 사고나 위험을 피하기 위하여 태도를 단단히 하고 모살피다.',
        question: '다음 중 "경계하다"가 올바르게 쓰인 문장은 무엇일까요?',
        options: ['사자가 낯선 소리를 듣고 경계했다', '친구와 반갑게 인사하며 경계했다', '맛있는 음식을 먹으며 경계했다'],
        answerIndex: 0,
      },
      {
        word: '용의주도',
        meaning: '핏줄이나 일이 지극히 주밀하고 세심하여 빈틈이 없다.',
        question: '빈칸에 들어갈 알맞은 단어는? "탐정은 사건을 들여다보며 (  )하게 단서를 수집했다."',
        options: ['용의주도', '주목', '방심'],
        answerIndex: 0,
      },
      {
        word: '연대감',
        meaning: '서로 깊이 연결되어 함께 책임을 지거나 돕는 마음.',
        question: '친구와 협동하여 문제를 해결했을 때 느끼는 마음은?',
        options: ['연대감', '자괴감', '소외감'],
        answerIndex: 0,
      }
    ]
  };
}
