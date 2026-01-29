import { supabase } from '@/shared/api/supabaseClient';

export type FortuneContent = {
  재물운: string;
  연애운: string;
  건강운: string;
};

export type DailyFortune = {
  fortune_date: string;
  fortune_content: FortuneContent;
  lucky_color: string | null;
  lucky_number: number | null;
  daily_tip: string | null;
  created_at: string;
};

export async function fetchTodayFortune(dateKey: string): Promise<DailyFortune | null> {
  const { data, error } = await supabase
    .from('daily_fortunes')
    .select('*')
    .eq('fortune_date', dateKey)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return (data as DailyFortune | null) ?? null;
}

export async function listMonthlyFortunes(
  startDate: string,
  endDate: string,
): Promise<DailyFortune[]> {
  const { data, error } = await supabase
    .from('daily_fortunes')
    .select('*')
    .gte('fortune_date', startDate)
    .lte('fortune_date', endDate)
    .order('fortune_date', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data as DailyFortune[]) ?? [];
}
