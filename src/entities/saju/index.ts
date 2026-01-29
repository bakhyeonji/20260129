import { supabase } from '@/shared/api/supabaseClient';

export type SajuProfile = {
  id: number;
  birth_date: string;
  birth_time: string;
  saju_data: unknown;
  updated_at: string;
};

export async function fetchSajuProfile(): Promise<SajuProfile | null> {
  const { data, error } = await supabase
    .from('saju_profile')
    .select('*')
    .eq('id', 1)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return (data as SajuProfile | null) ?? null;
}

export async function upsertSajuProfile(input: {
  birthDate: string;
  birthTime: string;
  sajuData: unknown;
}): Promise<SajuProfile> {
  const { data, error } = await supabase
    .from('saju_profile')
    .upsert(
      {
        id: 1,
        birth_date: input.birthDate,
        birth_time: input.birthTime,
        saju_data: input.sajuData,
      },
      { onConflict: 'id' },
    )
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as SajuProfile;
}

