import type { AIGeneratedGuide } from '../types';

export interface GenerateGuideRequest {
  title: string;
  description?: string;
  targetAge?: string;
}

export async function generateBookGuideAI(req: GenerateGuideRequest): Promise<AIGeneratedGuide> {
  const geminiApiKey =
    (import.meta.env &&
      (import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.NEXT_PUBLIC_GEMINI_API_KEY)) ||
    '';

  const title = req.title || '추천 도서';
  const description = req.description || `${title}은(는) 아동의 어휘력과 독해력 향상을 돕는 맞춤 추천 도서입니다.`;

  const prompt = `
너는 18년 차 아동 언어재활사이자 문해력 최고 전문가야.
아래 [도서 정보]를 분석하여 초등 문해력 관점의 맞춤형 독후 대화 가이드, 핵심 어휘 퀴즈 3개, 그리고 2줄 큐레이션 추천 사유를 생성해 줘.

[도서 정보]
- 도서 제목: ${title}
- 줄거리 및 설명: ${description}
- 대상 연령/어휘 레벨: ${req.targetAge || '초등 3~4학년'}

반드시 아래 JSON 형식 규격에 맞추어 순수 JSON 문자열만 반환해 줘 (마크다운 포맷이나 백틱 기호 없이 pure JSON):
{
  "beforeReading": ["읽기 전 발문 질문 1", "읽기 전 발문 질문 2", "읽기 전 발문 질문 3"],
  "duringReading": ["읽는 중 발문 질문 1", "읽는 중 발문 질문 2", "읽는 중 발문 질문 3"],
  "afterReading": ["읽은 후 발문 질문 1", "읽은 후 발문 질문 2", "읽은 후 발문 질문 3"],
  "vocabularyQuiz": [
    {
      "word": "핵심어휘1",
      "meaning": "어휘의 정확한 뜻 풀이",
      "question": "어휘를 활용한 퀴즈 질문 문항",
      "options": ["보기1", "보기2", "보기3"],
      "answerIndex": 0
    },
    {
      "word": "핵심어휘2",
      "meaning": "어휘의 정확한 뜻 풀이",
      "question": "어휘를 활용한 퀴즈 질문 문항",
      "options": ["보기1", "보기2", "보기3"],
      "answerIndex": 0
    },
    {
      "word": "핵심어휘3",
      "meaning": "어휘의 정확한 뜻 풀이",
      "question": "어휘를 활용한 퀴즈 질문 문항",
      "options": ["보기1", "보기2", "보기3"],
      "answerIndex": 0
    }
  ],
  "recommendReason": "초등 문해력 관점에서 이 책이 아이의 어휘력과 사고력에 도움을 주는 이유 2줄 큐레이션 요약 문장"
}
`;

  if (geminiApiKey) {
    try {
      // 1. Google Gemini API Call (gemini-1.5-flash)
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`;

      const response = await fetch(geminiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.7,
          },
        }),
      });

      if (response.ok) {
        const resultData = await response.json();
        const rawText = resultData.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          const cleanJsonText = rawText.replace(/```json|```/g, '').trim();
          const parsed = JSON.parse(cleanJsonText) as AIGeneratedGuide;
          return parsed;
        }
      } else {
        console.warn('Gemini 1.5 Flash API call response not ok, trying gemini-2.0-flash endpoint...');
        const gemini2Url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`;
        const res2 = await fetch(gemini2Url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: 'application/json' },
          }),
        });

        if (res2.ok) {
          const res2Data = await res2.json();
          const txt2 = res2Data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (txt2) {
            const cleanTxt2 = txt2.replace(/```json|```/g, '').trim();
            return JSON.parse(cleanTxt2) as AIGeneratedGuide;
          }
        }
      }
    } catch (err) {
      console.warn('Gemini API call failed, falling back to title-based generator:', err);
    }
  }

  return generateFallbackGuide(title, description);
}

function generateFallbackGuide(title: string, _description: string): AIGeneratedGuide {
  const vocabPool = [
    {
      word: '통찰력(洞察力)',
      meaning: '사물이나 현상을 예리하게 관찰하여 그 본질을 꿰뚫어 보는 능력.',
      question: `"${title}"에서 주인공이 문제의 본질을 꿰뚫어 볼 때 발휘한 능력은 무엇일까요?`,
      options: ['통찰력', '무관심', '성급함'],
      answerIndex: 0,
    },
    {
      word: '용의주도(周到)',
      meaning: '준비가 지극히 세밀하고 철저하여 빈틈이 없음.',
      question: `빈칸에 들어갈 알맞은 단어는? "${title}의 인물들은 사건을 해결하기 위해 (  )하게 단서를 살폈다."`,
      options: ['용의주도', '방심', '주목'],
      answerIndex: 0,
    },
    {
      word: '맥락(脈絡)',
      meaning: '사물이나 사건이 서로 연결되어 이루어지는 줄기나 범위.',
      question: `이야기의 앞뒤 상황을 파악하여 의미를 해석하는 것을 무엇이라고 할까요?`,
      options: ['맥락 파악', '단어 암기', '무작정 읽기'],
      answerIndex: 0,
    },
  ];

  return {
    beforeReading: [
      `표지와 제목 "${title}"을 보았을 때, 어떤 인물이 나오고 어떤 사건이 펼쳐질지 상상해볼까?`,
      `이 책의 제목 "${title}"에서 가장 기대되거나 눈길을 끄는 단어는 무엇이니?`,
      `이 책을 읽기 전 알고 있는 배경지식이나 비슷한 나의 경험은 무엇이 있니?`,
    ],
    duringReading: [
      `"${title}"에서 주인공이 중요한 선택의 기로에 섰을 때, 나라면 어떻게 행동했을지 말해보자.`,
      `이야기의 배경과 분위기, 또는 결정적인 사건의 원인은 무엇이었을까?`,
      `주인공의 기분(기쁨, 서운함, 용기)이 변하게 된 가장 큰 계기는 무엇이었니?`,
    ],
    afterReading: [
      `"${title}"을 읽고 가장 기억에 남는 명장면이나 대사는 무엇이었니?`,
      `"${title}"의 주인공에게 해주고 싶은 따뜻한 격려나 질문은 무엇이니?`,
      `이 책을 친구나 부모님에게 추천한다면 어떤 이유를 말해주고 싶니?`,
    ],
    vocabularyQuiz: vocabPool,
    recommendReason: `"${title}"은(는) 아동의 필수 교과 어휘력과 깊이 있는 문맥 추론 능력을 동시에 키워주는 우수 큐레이션 추천 도서입니다.`,
  };
}
