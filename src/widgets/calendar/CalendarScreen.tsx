'use client';

import { useState, useEffect, useMemo } from 'react';
import { format, getYear, getMonth, addMonths, subMonths } from 'date-fns';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getCalendarDays, formatMonthLabel, getDateKey, formatDateLabel } from '@/shared/lib/date';
import { listMonthlyFortunes, type DailyFortune } from '@/entities/fortune';
import { listMonthlyDiaryEntries, type DiaryEntry } from '@/entities/diary';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const EMOTION_EMOJI: Record<number, string> = {
  5: '😄',
  4: '🙂',
  3: '😐',
  2: '😞',
  1: '😢',
};

type DayDetailModalProps = {
  date: Date | null;
  fortune: DailyFortune | null;
  diary: DiaryEntry | null;
  onClose: () => void;
};

function DayDetailModal({ date, fortune, diary, onClose }: DayDetailModalProps) {
  if (!date) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <Card
        className="w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold tracking-tight text-neutral-50">
            {formatDateLabel(date)}
          </h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            닫기
          </Button>
        </div>

        {fortune && (
          <div className="mb-4 space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-neutral-400">오늘의 운세</p>
            <div className="space-y-2 text-sm text-neutral-200 leading-6">
              <p>재물운: {fortune.fortune_content.재물운}</p>
              <p>연애운: {fortune.fortune_content.연애운}</p>
              <p>건강운: {fortune.fortune_content.건강운}</p>
              {fortune.lucky_color && (
                <div className="mt-3 flex items-center justify-between rounded-2xl border border-accent-700/40 bg-white/5 px-4 py-3">
                  <span className="text-xs text-neutral-400">행운</span>
                  <span className="text-sm text-accent-500">
                    색: {fortune.lucky_color} · 숫자: {fortune.lucky_number}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {diary && (
          <div className="space-y-3 rounded-[32px] border border-white/10 bg-white/5 p-6">
            <p className="text-xs text-neutral-400">오늘의 기록</p>
            {diary.photo_url && (
              <img
                src={diary.photo_url}
                alt="일기 사진"
                className="h-44 w-full rounded-3xl object-cover border border-white/10"
              />
            )}
            {diary.emotion && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-200">감정</span>
                <span className="text-2xl">{EMOTION_EMOJI[diary.emotion]}</span>
              </div>
            )}
            {!diary.emotion && !diary.photo_url && (
              <p className="text-sm text-neutral-400">기록이 없습니다.</p>
            )}
          </div>
        )}

        {!fortune && !diary && (
          <p className="text-sm text-neutral-400">이 날짜에는 데이터가 없습니다.</p>
        )}
      </Card>
    </div>
  );
}

export function CalendarScreen() {
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [fortunes, setFortunes] = useState<Map<string, DailyFortune>>(new Map());
  const [diaries, setDiaries] = useState<Map<string, DiaryEntry>>(new Map());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);

  const year = getYear(currentDate);
  const month = getMonth(currentDate) + 1;
  const calendarDays = useMemo(() => getCalendarDays(year, month), [year, month]);

  useEffect(() => {
    const loadMonthData = async () => {
      setLoading(true);
      try {
        const startDate = format(new Date(year, month - 1, 1), 'yyyy-MM-dd');
        const endDate = format(new Date(year, month, 0), 'yyyy-MM-dd');

        const [fortuneList, diaryList] = await Promise.all([
          listMonthlyFortunes(startDate, endDate),
          listMonthlyDiaryEntries(startDate, endDate),
        ]);

        const fortuneMap = new Map<string, DailyFortune>();
        fortuneList.forEach((f) => {
          fortuneMap.set(f.fortune_date, f);
        });

        const diaryMap = new Map<string, DiaryEntry>();
        diaryList.forEach((d) => {
          diaryMap.set(d.entry_date, d);
        });

        setFortunes(fortuneMap);
        setDiaries(diaryMap);
      } catch (error) {
        toast({
          variant: 'destructive',
          description: '데이터를 불러오는 중 오류가 발생했어요.',
        });
      } finally {
        setLoading(false);
      }
    };

    void loadMonthData();
  }, [year, month, toast]);

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleDateClick = (date: Date | null) => {
    if (!date) return;
    setSelectedDate(date);
  };

  const selectedFortune = selectedDate
    ? fortunes.get(getDateKey(selectedDate)) ?? null
    : null;
  const selectedDiary = selectedDate
    ? diaries.get(getDateKey(selectedDate)) ?? null
    : null;

  return (
    <div className="space-y-4 pb-20">
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrevMonth}
            disabled={loading}
            className="h-11 w-11 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <p className="text-sm font-semibold tracking-tight text-neutral-50">
            {formatMonthLabel(year, month)}
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNextMonth}
            disabled={loading}
            className="h-11 w-11 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <div className="grid grid-cols-7 gap-2">
          {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
            <div
              key={day}
              className="p-2 text-center text-xs font-semibold text-neutral-400"
            >
              {day}
            </div>
          ))}
          {calendarDays.map((day, idx) => {
            if (!day) {
              return <div key={`empty-${idx}`} className="aspect-square" />;
            }

            const dateKey = getDateKey(day);
            const fortune = fortunes.get(dateKey);
            const diary = diaries.get(dateKey);
            const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

            return (
              <button
                key={dateKey}
                type="button"
                onClick={() => handleDateClick(day)}
                className={cn(
                  'relative aspect-square rounded-3xl border border-white/10 bg-white/5 p-3 text-left transition-colors',
                  'hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500',
                  isToday && 'border-accent-700/60 ring-1 ring-accent-500/20',
                )}
              >
                <span className="text-xs text-neutral-200">{format(day, 'd')}</span>
                <div className="absolute bottom-3 left-3 flex gap-1">
                  {fortune && (
                    <span className="h-1.5 w-1.5 rounded-full bg-neutral-400/70"></span>
                  )}
                  {diary?.emotion && (
                    <span className="h-1.5 w-1.5 rounded-full bg-accent-500"></span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      <DayDetailModal
        date={selectedDate}
        fortune={selectedFortune}
        diary={selectedDiary}
        onClose={() => setSelectedDate(null)}
      />
    </div>
  );
}
