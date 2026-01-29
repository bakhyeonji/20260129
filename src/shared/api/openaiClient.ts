import OpenAI from 'openai';

// 서버 전용 OpenAI 클라이언트
// Route Handler / 서버 컴포넌트에서만 사용해야 합니다.

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  // eslint-disable-next-line no-console
  console.warn('[openaiClient] OPENAI_API_KEY가 설정되지 않았습니다.');
}

export const openai = new OpenAI({
  apiKey: apiKey ?? '',
});

