type UploadResult<T> = { ok: true; data: T } | { ok: false; error?: string };

/** admin 업로드 라우트(/api/admin/upload/*)에 FormData로 파일을 전송하는 공용 헬퍼. */
export async function uploadFile<T = { url: string }>(
  url: string,
  file: File,
): Promise<UploadResult<T>> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(url, { method: "POST", body: formData });
  const body = await res.json().catch(() => null);

  if (!res.ok) {
    return { ok: false, error: body?.error };
  }
  return { ok: true, data: body as T };
}
