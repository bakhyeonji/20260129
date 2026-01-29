'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { fetchSajuProfile, upsertSajuProfile, type SajuProfile } from '@/entities/saju';
import { supabase } from '@/shared/api/supabaseClient';

export function SettingsScreen() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<SajuProfile | null>(null);
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const p = await fetchSajuProfile();
        if (p) {
          setProfile(p);
          setBirthDate(p.birth_date);
          setBirthTime(p.birth_time);
        }
      } catch (error) {
        toast({
          variant: 'destructive',
          description: '프로필을 불러오는 중 오류가 발생했어요.',
        });
      }
    };

    void loadProfile();
  }, [toast]);

  const handleSaveProfile = async () => {
    if (!birthDate || !birthTime) {
      toast({
        variant: 'destructive',
        description: '생년월일과 출생 시간을 모두 입력해 주세요.',
      });
      return;
    }

    setLoading(true);
    try {
      await upsertSajuProfile({
        birthDate,
        birthTime,
        sajuData: { birthDate, birthTime },
      });
      toast({ description: '프로필이 저장되었어요.' });
      const updated = await fetchSajuProfile();
      if (updated) {
        setProfile(updated);
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        description: '프로필 저장 중 오류가 발생했어요.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetAll = async () => {
    if (!showResetConfirm) {
      setShowResetConfirm(true);
      return;
    }

    setLoading(true);
    try {
      await Promise.all([
        supabase.from('daily_fortunes').delete().neq('fortune_date', '1900-01-01'),
        supabase.from('diary_entries').delete().neq('entry_date', '1900-01-01'),
        supabase.from('saju_profile').delete().eq('id', 1),
      ]);

      toast({ description: '모든 데이터가 삭제되었어요.' });
      setProfile(null);
      setBirthDate('');
      setBirthTime('');
      setShowResetConfirm(false);
    } catch (error) {
      toast({
        variant: 'destructive',
        description: '데이터 삭제 중 오류가 발생했어요.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 pb-20">
      <Card className="p-6 space-y-4">
        <h2 className="text-sm font-semibold tracking-tight text-neutral-50">사주 프로필</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-neutral-400 mb-2">생년월일</label>
            <Input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-primary-950/40 px-4 py-3 text-sm text-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
            />
          </div>
          <div>
            <label className="block text-xs text-neutral-400 mb-2">출생 시간</label>
            <Input
              type="time"
              value={birthTime}
              onChange={(e) => setBirthTime(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-primary-950/40 px-4 py-3 text-sm text-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
            />
          </div>
          <Button
            className="w-full"
            disabled={loading}
            onClick={handleSaveProfile}
          >
            프로필 저장하기
          </Button>
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <h2 className="text-sm font-semibold tracking-tight text-neutral-50">데이터 관리</h2>
        <p className="text-xs text-neutral-400 leading-6">
          모든 기록(운세, 일기, 프로필)을 삭제합니다. 되돌릴 수 없습니다.
        </p>
        <Button
          variant="destructive"
          className="w-full"
          disabled={loading}
          onClick={handleResetAll}
        >
          {showResetConfirm ? '정말로 삭제하시겠습니까? (다시 클릭하면 삭제됩니다)' : '전체 데이터 초기화'}
        </Button>
      </Card>
    </div>
  );
}
