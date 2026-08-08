import { NextResponse } from "next/server";

import { ALLOWED_ATTACHMENT_EXTENSIONS, MAX_ATTACHMENT_SIZE_BYTES } from "@/constants/media";
import { getAdminSession } from "@/lib/auth";
import { deleteFromStorage, storagePathFromPublicUrl, uploadToStorage } from "@/lib/supabase";

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "파일이 없습니다." }, { status: 400 });
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!ALLOWED_ATTACHMENT_EXTENSIONS.includes(ext)) {
    return NextResponse.json(
      {
        error: `${ALLOWED_ATTACHMENT_EXTENSIONS.join(", ")} 형식의 파일만 업로드할 수 있습니다.`,
      },
      { status: 400 },
    );
  }

  if (file.size > MAX_ATTACHMENT_SIZE_BYTES) {
    return NextResponse.json(
      { error: `첨부파일은 ${MAX_ATTACHMENT_SIZE_BYTES / 1024 / 1024}MB 이하만 업로드할 수 있습니다.` },
      { status: 400 },
    );
  }

  const path = `attachments/${crypto.randomUUID()}.${ext}`;

  try {
    const url = await uploadToStorage(path, file);
    return NextResponse.json({ url, name: file.name, size: file.size });
  } catch (error) {
    console.error("첨부파일 업로드 실패:", error);
    return NextResponse.json(
      { error: "첨부파일 업로드에 실패했습니다." },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const url = typeof body?.url === "string" ? body.url : "";
  const path = url ? storagePathFromPublicUrl(url) : null;

  if (!path) {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  try {
    await deleteFromStorage(path);
  } catch (error) {
    console.error("첨부파일 삭제 실패:", error);
    return NextResponse.json(
      { error: "첨부파일 삭제에 실패했습니다." },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
