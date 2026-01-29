'use client';

import { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { fetchSajuProfile, upsertSajuProfile } from '@/entities/saju';
import { fetchTodayFortune } from '@/entities/fortune';
import { fetchDiaryEntry, upsertDiaryEntry } from '@/entities/diary';
import { Textarea } from '@/components/ui/textarea';
import { FileUpload } from '@/components/ui/file-upload';
import { uploadPhoto } from '@/shared/api/storage';

type ChatMessage = {
  id: string;
  role: 'assistant' | 'user';
  content: string;
};

function getTodayKey() {
  const now = new Date();
  return now.toISOString().slice(0, 10);
}

function generateMessageId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export function TodayChatScreen() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [fortuneText, setFortuneText] = useState<string | null>(null);
  const [emotion, setEmotion] = useState<number | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [note, setNote] = useState('');

  const todayKey = useMemo(() => getTodayKey(), []);
  const todayLabel = useMemo(
    () => format(new Date(todayKey), 'yyyy년 MM월 dd일 (EEE)'),
    [todayKey],
  );

  useEffect(() => {
    const bootstrap = async () => {
      setLoading(true);
      try {
        const profile = await fetchSajuProfile();
        if (!profile) {
          setHasProfile(false);
          setMessages([
            {
              id: generateMessageId('welcome'),
              role: 'assistant',
              content:
                '처음 만나서 반가워요. 먼저 당신의 생년월일과 출생 시간을 알려주면, 그걸 바탕으로 매일의 사주 운세를 만들어 줄게요.',
            },
          ]);
        } else {
          setHasProfile(true);
          setMessages([
            {
              id: generateMessageId('welcome_existing'),
              role: 'assistant',
              content: `${todayLabel}의 운세를 불러와 볼게요.`,
            },
          ]);
          const existingFortune = await fetchTodayFortune(todayKey);
          if (existingFortune) {
            setFortuneText(
              `재물운: ${existingFortune.fortune_content.재물운}\n\n연애운: ${existingFortune.fortune_content.연애운}\n\n건강운: ${existingFortune.fortune_content.건강운}\n\n행운의 색: ${existingFortune.lucky_color ?? '-'} / 행운의 숫자: ${
                existingFortune.lucky_number ?? '-'
              }\n\n오늘의 팁: ${existingFortune.daily_tip ?? '-'}`,
            );
            setMessages((prev) => [
              ...prev,
              {
                id: generateMessageId('fortune_existing'),
                role: 'assistant',
                content: '오늘의 운세를 이미 만들어 두었어요. 아래 내용을 확인해 볼까요?',
              },
            ]);
          } else {
            setMessages((prev) => [
              ...prev,
              {
                id: generateMessageId('fortune_new'),
                role: 'assistant',
                content: '아직 오늘 운세가 없네요. 아래 버튼을 눌러 오늘 운세를 만들어 볼까요?',
              },
            ]);
          }
          const diary = await fetchDiaryEntry(todayKey);
          if (diary) {
            setEmotion(diary.emotion);
            setPhotoUrl(diary.photo_url);
          }
        }
      } catch (error) {
        toast({
          variant: 'destructive',
          description: '초기 데이터를 불러오는 중 오류가 발생했어요.',
        });
      } finally {
        setLoading(false);
      }
    };

    void bootstrap();
  }, [toast, todayKey, todayLabel]);

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
      setHasProfile(true);
      setMessages((prev) => [
        ...prev,
        {
          id: generateMessageId('profile_saved'),
          role: 'assistant',
          content: '고마워요. 이제 오늘의 운세를 만들어 볼게요.',
        },
      ]);
    } catch (error) {
      toast({
        variant: 'destructive',
        description: '프로필 저장 중 오류가 발생했어요.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateFortune = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/fortune/today', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: todayKey }),
      });

      const responseText = await res.text();
      // eslint-disable-next-line no-console
      console.log('[TodayChatScreen] API 응답 원문:', responseText);

      if (!res.ok) {
        let errorData: any = {};
        try {
          errorData = JSON.parse(responseText);
        } catch {
          errorData = { message: responseText || '운세 생성 실패' };
        }
        // eslint-disable-next-line no-console
        console.error('[TodayChatScreen] API 에러:', errorData);
        throw new Error(errorData.message || errorData.detail || '운세 생성 실패');
      }

      let data: any;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        // eslint-disable-next-line no-console
        console.error('[TodayChatScreen] 응답 파싱 실패:', parseError, responseText);
        throw new Error('응답 파싱에 실패했습니다.');
      }

      // eslint-disable-next-line no-console
      console.log('[TodayChatScreen] 파싱된 데이터:', data);
      const text = `재물운: ${data.fortune_content.재물운}\n\n연애운: ${data.fortune_content.연애운}\n\n건강운: ${data.fortune_content.건강운}\n\n행운의 색: ${
        data.lucky_color ?? '-'
      } / 행운의 숫자: ${data.lucky_number ?? '-'}\n\n오늘의 팁: ${data.daily_tip ?? '-'}`;

      setFortuneText(text);
      setMessages((prev) => [
        ...prev,
        {
          id: generateMessageId('fortune_generated'),
          role: 'assistant',
          content: '오늘의 운세를 만들어 봤어요. 한 번 읽어볼까요?',
        },
      ]);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : '운세를 생성하는 중 오류가 발생했어요.';
      // eslint-disable-next-line no-console
      console.error('[TodayChatScreen] 운세 생성 에러:', error);
      toast({
        variant: 'destructive',
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (file: File) => {
    setUploadingPhoto(true);
    try {
      const url = await uploadPhoto(file, todayKey);
      setPhotoUrl(url);
      toast({ description: '사진이 업로드되었어요.' });
    } catch (error) {
      toast({
        variant: 'destructive',
        description: '사진 업로드 중 오류가 발생했어요.',
      });
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSaveDiary = async () => {
    if (!emotion && !photoUrl) {
      toast({
        variant: 'destructive',
        description: '감정 또는 사진 중 하나는 선택해 주세요.',
      });
      return;
    }

    setLoading(true);
    try {
      // eslint-disable-next-line no-console
      console.log('[TodayChatScreen] 일기 저장 시작:', { dateKey: todayKey, emotion, photoUrl });
      
      await upsertDiaryEntry({
        dateKey: todayKey,
        emotion,
        photoUrl,
      });

      // eslint-disable-next-line no-console
      console.log('[TodayChatScreen] 일기 저장 완료');

      setMessages((prev) => [
        ...prev,
        {
          id: generateMessageId('diary_saved'),
          role: 'assistant',
          content: '오늘의 기록을 잘 남겨 두었어요. 수고 많았어요.',
        },
      ]);
      toast({ description: '오늘의 기록을 저장했어요.' });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : '일기를 저장하는 중 오류가 발생했어요.';
      // eslint-disable-next-line no-console
      console.error('[TodayChatScreen] 일기 저장 에러:', error);
      toast({
        variant: 'destructive',
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 pb-20">
      <Card className="p-6">
        <p className="text-xs text-neutral-400">{todayLabel}</p>
        <p className="mt-2 text-lg font-semibold tracking-tight text-neutral-50">오늘의 챗봇</p>
      </Card>

      <div className="flex flex-col gap-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className={
              m.role === 'assistant'
                ? 'self-start max-w-[80%]'
                : 'self-end max-w-[80%]'
            }
          >
            <div
              className={
                m.role === 'assistant'
                  ? 'rounded-2xl rounded-tl-sm bg-white/5 border border-white/10 px-4 py-3 text-sm text-neutral-200'
                  : 'rounded-2xl rounded-tr-sm bg-accent-500 px-4 py-3 text-sm text-primary-950 font-medium'
              }
            >
              {m.content}
            </div>
          </div>
        ))}
      </div>

      {!hasProfile && hasProfile !== null && (
        <Card className="p-6 space-y-4">
          <p className="text-sm text-neutral-200">먼저 사주 프로필을 설정할게요.</p>
          <div className="space-y-3">
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
          </div>
          <Button
            className="w-full"
            disabled={loading}
            onClick={handleSaveProfile}
          >
            프로필 저장하기
          </Button>
        </Card>
      )}

      {hasProfile && !fortuneText && (
        <Card className="p-6 space-y-4">
          <p className="text-sm text-neutral-200 leading-6">
            오늘 운세를 아직 만들지 않았어요. 아래 버튼을 눌러 사주 기반 운세를 생성해 볼까요?
          </p>
          <Button
            className="w-full"
            disabled={loading}
            onClick={handleGenerateFortune}
          >
            오늘 운세 생성하기
          </Button>
        </Card>
      )}

      {fortuneText && (
        <Card className="p-6 space-y-4">
          <div>
            <p className="text-xs text-neutral-400 mb-2">오늘의 요약</p>
            <p className="text-sm text-neutral-200 leading-6 whitespace-pre-line">
              {fortuneText}
            </p>
          </div>
        </Card>
      )}

      {fortuneText && (
        <Card className="p-6 space-y-4">
          <p className="text-sm text-neutral-200">오늘 하루는 어땠나요?</p>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setEmotion(v)}
                className={
                  v === emotion
                    ? 'flex-1 rounded-3xl border border-accent-700/60 bg-white/5 px-3 py-3 text-center text-accent-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500'
                    : 'flex-1 rounded-3xl border border-white/10 bg-white/5 px-3 py-3 text-center text-neutral-200 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500'
                }
              >
                {v === 5 && '😄'}
                {v === 4 && '🙂'}
                {v === 3 && '😐'}
                {v === 2 && '😞'}
                {v === 1 && '😢'}
              </button>
            ))}
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-neutral-400 mb-2">오늘을 떠올리는 한 장면</label>
              {photoUrl ? (
                <div className="space-y-3">
                  <img
                    src={photoUrl}
                    alt="일기 사진"
                    className="h-44 w-full rounded-3xl object-cover border border-white/10"
                  />
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setPhotoUrl(null)}
                      className="flex-1"
                    >
                      변경
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setPhotoUrl(null)}
                      className="flex-1"
                    >
                      삭제
                    </Button>
                  </div>
                </div>
              ) : (
                <FileUpload
                  onFileChange={handlePhotoUpload}
                  accept="image/*"
                  className="rounded-[32px] border border-white/10 bg-white/5 p-8 text-center text-neutral-300 hover:bg-white/10"
                >
                  {uploadingPhoto ? (
                    <p className="text-sm">업로드 중...</p>
                  ) : (
                    <p className="text-sm">📷 사진 추가하기</p>
                  )}
                </FileUpload>
              )}
            </div>
            <div>
              <label className="block text-xs text-neutral-400 mb-2">메모 (선택)</label>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-primary-950/40 px-4 py-3 text-sm text-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
                placeholder="오늘 하루에 대한 짧은 메모를 남겨보세요"
              />
            </div>
          </div>
          <Button
            className="w-full"
            disabled={loading}
            onClick={handleSaveDiary}
          >
            오늘 기록 저장하기
          </Button>
        </Card>
      )}
    </div>
  );
}

