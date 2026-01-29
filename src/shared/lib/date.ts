import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from 'date-fns';
import { ko } from 'date-fns/locale';

export function getTodayKey(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export function getDateKey(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function getMonthRange(year: number, month: number) {
  const start = startOfMonth(new Date(year, month - 1, 1));
  const end = endOfMonth(new Date(year, month - 1, 1));
  return { start, end };
}

export function getCalendarDays(year: number, month: number) {
  const { start, end } = getMonthRange(year, month);
  const days = eachDayOfInterval({ start, end });
  
  const firstDayOfWeek = getDay(start);
  const paddingStart = Array.from({ length: firstDayOfWeek }, (_, i) => null);
  
  return [...paddingStart, ...days];
}

export function formatDateLabel(date: Date): string {
  return format(date, 'yyyy년 MM월 dd일 (EEE)', { locale: ko });
}

export function formatMonthLabel(year: number, month: number): string {
  return format(new Date(year, month - 1, 1), 'yyyy년 MM월', { locale: ko });
}
