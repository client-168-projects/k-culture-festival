import { createClient } from "@supabase/supabase-js";

const STORAGE_BUCKET = "notice-media";

function getConfig() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "환경변수 누락: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY",
    );
  }

  return { url, serviceRoleKey };
}

function getSupabaseAdmin() {
  const { url, serviceRoleKey } = getConfig();
  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
}

export async function uploadToStorage(
  path: string,
  file: File,
): Promise<string> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) {
    throw new Error(`파일 업로드 실패: ${error.message}`);
  }

  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function deleteFromStorage(path: string): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.storage.from(STORAGE_BUCKET).remove([path]);

  if (error) {
    throw new Error(`파일 삭제 실패: ${error.message}`);
  }
}

/** Storage public URL에서 버킷 내부 경로만 추출한다 (삭제 시 사용). */
export function storagePathFromPublicUrl(publicUrl: string): string | null {
  const marker = `/storage/v1/object/public/${STORAGE_BUCKET}/`;
  const index = publicUrl.indexOf(marker);
  if (index === -1) return null;
  return decodeURIComponent(publicUrl.slice(index + marker.length));
}

export { STORAGE_BUCKET };
