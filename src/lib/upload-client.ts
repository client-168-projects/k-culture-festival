type UploadResult<T> = { ok: true; data: T } | { ok: false; error?: string };

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
