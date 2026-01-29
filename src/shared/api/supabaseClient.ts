import { createClient } from '@supabase/supabase-js';

// 클라이언트에서만 사용하는 Supabase 클라이언트
// (단일 사용자, public anon key 기준)

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.warn(
    '[supabaseClient] NEXT_PUBLIC_SUPABASE_URL 또는 NEXT_PUBLIC_SUPABASE_ANON_KEY가 설정되지 않았습니다.',
  );
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '');

