import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

// 서버 사이드에서는 환경 변수를 직접 사용
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const openaiApiKey = process.env.OPENAI_API_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase 환경 변수가 설정되지 않았습니다.');
}

if (!openaiApiKey) {
  throw new Error('OpenAI API 키가 설정되지 않았습니다.');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);
const openai = new OpenAI({ apiKey: openaiApiKey });

type FortuneContent = {
  재물운: string;
  연애운: string;
  건강운: string;
};

type FortunePayload = {
  fortune_content: FortuneContent;
  lucky_color: string;
  lucky_number: number;
  daily_tip: string;
};

function getTodayKey(date?: string) {
  if (date) return date;
  const today = new Date();
  return today.toISOString().slice(0, 10);
}

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as { date?: string };
  const dateKey = getTodayKey(body.date);

  // 1) 이미 생성된 운세가 있으면 Supabase에서 바로 반환
  const { data: existing, error: selectError } = await supabase
    .from('daily_fortunes')
    .select('*')
    .eq('fortune_date', dateKey)
    .maybeSingle();

  if (selectError) {
    return NextResponse.json(
      { error: 'failed_to_fetch_fortune', detail: selectError.message },
      { status: 500 },
    );
  }

  if (existing) {
    return NextResponse.json(existing);
  }

  // 2) 사주 프로필 조회 (id=1 고정)
  const { data: profile, error: profileError } = await supabase
    .from('saju_profile')
    .select('*')
    .eq('id', 1)
    .maybeSingle();

  if (profileError) {
    return NextResponse.json(
      { error: 'failed_to_fetch_profile', detail: profileError.message },
      { status: 500 },
    );
  }

  if (!profile) {
    return NextResponse.json(
      { error: 'profile_not_found', message: '사주 프로필이 아직 설정되지 않았습니다.' },
      { status: 400 },
    );
  }

  // 3) OpenAI를 사용해 오늘 운세 생성
  try {
    // eslint-disable-next-line no-console
    console.log('[fortune/today] OpenAI API 호출 시작...', { dateKey, hasProfile: !!profile });

    const response = await openai.responses.create({
      model: 'gpt-5.2',
      instructions:
        '너는 한국어로만 대답하는 사주 운세 챗봇이야. 친근하지만 과장되게 불안감을 조장하지 말고, 현실적인 조언을 짧게 해줘.',
      input: [
        {
          role: 'developer',
          content:
            '아래 입력을 바탕으로 JSON 하나만 생성해. 키는 재물운, 연애운, 건강운, lucky_color, lucky_number, daily_tip 이고, 각 운세는 2문장 이내의 한국어 문장으로 작성해. lucky_number는 1~99 사이의 정수 하나만, lucky_color는 한국어 색상 이름 한 단어로. 반드시 유효한 JSON 형식으로만 응답해.',
        },
        {
          role: 'user',
          content: JSON.stringify({
            date: dateKey,
            saju: profile.saju_data,
          }),
        },
      ],
    });

    // eslint-disable-next-line no-console
    console.log('[fortune/today] OpenAI 응답 수신:', { response });

    // output_text 속성 확인
    const rawText = (response as any).output_text as string | undefined;

    if (!rawText) {
      // eslint-disable-next-line no-console
      console.error('[fortune/today] output_text가 없음:', { response });
      return NextResponse.json(
        {
          error: 'llm_empty_output',
          message: '운세 생성 결과가 비어 있습니다.',
          debug: JSON.stringify(response),
        },
        { status: 500 },
      );
    }

    // eslint-disable-next-line no-console
    console.log('[fortune/today] 파싱할 텍스트:', rawText);

    let parsed: any;

    try {
      // JSON 파싱 시도 (코드 블록이나 마크다운 제거)
      const cleanedText = rawText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      parsed = JSON.parse(cleanedText);
    } catch (parseError) {
      // eslint-disable-next-line no-console
      console.error('[fortune/today] JSON 파싱 실패:', { rawText, parseError });
      return NextResponse.json(
        {
          error: 'llm_invalid_json',
          message: '운세 결과 JSON 파싱에 실패했습니다.',
          rawText: rawText.substring(0, 500),
          parseError: parseError instanceof Error ? parseError.message : String(parseError),
        },
        { status: 500 },
      );
    }

    // eslint-disable-next-line no-console
    console.log('[fortune/today] 파싱된 객체:', parsed);

    // 파싱된 JSON을 DB 스키마에 맞게 변환
    const fortuneContent: FortuneContent = {
      재물운: parsed.재물운 || parsed['재물운'] || '',
      연애운: parsed.연애운 || parsed['연애운'] || '',
      건강운: parsed.건강운 || parsed['건강운'] || '',
    };

    // 데이터 검증
    if (!fortuneContent.재물운 || !fortuneContent.연애운 || !fortuneContent.건강운) {
      // eslint-disable-next-line no-console
      console.error('[fortune/today] 필수 필드 누락:', { parsed, fortuneContent });
      return NextResponse.json(
        {
          error: 'invalid_fortune_data',
          message: '운세 데이터에 필수 필드가 누락되었습니다.',
          parsed,
        },
        { status: 500 },
      );
    }

    const insertData = {
      fortune_date: dateKey,
      fortune_content: fortuneContent,
      lucky_color: parsed.lucky_color || parsed['lucky_color'] || null,
      lucky_number: parsed.lucky_number || parsed['lucky_number'] || null,
      daily_tip: parsed.daily_tip || parsed['daily_tip'] || null,
    };

    // eslint-disable-next-line no-console
    console.log('[fortune/today] DB 저장할 데이터:', insertData);

    const { error: insertError, data: inserted } = await supabase
      .from('daily_fortunes')
      .insert(insertData)
      .select('*')
      .single();

    if (insertError) {
      return NextResponse.json(
        { error: 'failed_to_save_fortune', detail: insertError.message },
        { status: 500 },
      );
    }

    // eslint-disable-next-line no-console
    console.log('[fortune/today] 운세 저장 완료:', inserted);

    return NextResponse.json(inserted);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[fortune/today] 에러 발생:', error);

    const errorMessage =
      error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
    const errorStack = error instanceof Error ? error.stack : undefined;

    return NextResponse.json(
      {
        error: 'llm_request_failed',
        message: '운세 생성 중 오류가 발생했습니다.',
        detail: errorMessage,
        stack: process.env.NODE_ENV === 'development' ? errorStack : undefined,
      },
      { status: 500 },
    );
  }
}

