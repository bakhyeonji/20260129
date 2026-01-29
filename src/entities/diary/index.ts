import { supabase } from '@/shared/api/supabaseClient';

export type DiaryEntry = {
  entry_date: string;
  emotion: number | null;
  photo_url: string | null;
  created_at: string;
  updated_at: string;
};

export async function fetchDiaryEntry(dateKey: string): Promise<DiaryEntry | null> {
  const { data, error } = await supabase
    .from('diary_entries')
    .select('*')
    .eq('entry_date', dateKey)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return (data as DiaryEntry | null) ?? null;
}

export async function upsertDiaryEntry(input: {
  dateKey: string;
  emotion: number | null;
  photoUrl: string | null;
}): Promise<DiaryEntry> {
  const { data, error } = await supabase
    .from('diary_entries')
    .upsert(
      {
        entry_date: input.dateKey,
        emotion: input.emotion,
        photo_url: input.photoUrl,
      },
      { onConflict: 'entry_date' },
    )
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as DiaryEntry;
}

export async function listMonthlyDiaryEntries(
  startDate: string,
  endDate: string,
): Promise<DiaryEntry[]> {
  const { data, error } = await supabase
    .from('diary_entries')
    .select('*')
    .gte('entry_date', startDate)
    .lte('entry_date', endDate)
    .order('entry_date', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data as DiaryEntry[]) ?? [];
}
