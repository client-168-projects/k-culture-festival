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
  contentType: string,
): Promise<string> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, { contentType, upsert: false });

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

// 업로드 라우트가 만든 경로 형식만 허용한다. (images|attachments)/uuid.확장자
const STORAGE_PATH_PATTERN = /^(images|attachments)\/[0-9a-f-]{36}\.[a-z0-9]{2,5}$/;

export function storagePathFromPublicUrl(publicUrl: string): string | null {
  const base = process.env.SUPABASE_URL;
  if (!base) return null;
  const prefix = `${base}/storage/v1/object/public/${STORAGE_BUCKET}/`;
  if (!publicUrl.startsWith(prefix)) return null;
  const path = publicUrl.slice(prefix.length);
  return STORAGE_PATH_PATTERN.test(path) ? path : null;
}

export function isStorageUrl(url: string, folder: "images" | "attachments"): boolean {
  return storagePathFromPublicUrl(url)?.startsWith(`${folder}/`) ?? false;
}

export { STORAGE_BUCKET };
