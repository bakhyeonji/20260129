import { supabase } from './supabaseClient';

const BUCKET_NAME = 'diary-photos';

export async function uploadPhoto(
  file: File,
  dateKey: string,
): Promise<string> {
  const timestamp = Date.now();
  const ext = file.name.split('.').pop() ?? 'jpg';
  const fileName = `${dateKey}/${timestamp}.${ext}`;

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    throw new Error(`사진 업로드 실패: ${error.message}`);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET_NAME).getPublicUrl(data.path);

  return publicUrl;
}

export async function deletePhoto(photoUrl: string): Promise<void> {
  const urlParts = photoUrl.split('/');
  const fileName = urlParts[urlParts.length - 1];
  const dateKey = urlParts[urlParts.length - 2];
  const path = `${dateKey}/${fileName}`;

  const { error } = await supabase.storage.from(BUCKET_NAME).remove([path]);

  if (error) {
    throw new Error(`사진 삭제 실패: ${error.message}`);
  }
}
