import { NextResponse } from "next/server";

import { MAX_IMAGE_SIZE_BYTES } from "@/constants/media";
import { requireAdmin } from "@/lib/auth";
import { uploadToStorage } from "@/lib/supabase";
import { detectImageType } from "@/lib/file-signature";
import { formatFileSize } from "@/lib/utils";

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (session instanceof NextResponse) return session;

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "파일이 없습니다." }, { status: 400 });
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return NextResponse.json(
      { error: `이미지는 ${formatFileSize(MAX_IMAGE_SIZE_BYTES)} 이하만 업로드할 수 있습니다.` },
      { status: 400 },
    );
  }

  // 브라우저가 보낸 file.type 대신 파일 앞부분을 읽어 실제 형식을 확인한다.
  const type = await detectImageType(file);
  if (!type) {
    return NextResponse.json(
      { error: "PNG, JPEG, WEBP, GIF 이미지만 업로드할 수 있습니다." },
      { status: 400 },
    );
  }

  const path = `images/${crypto.randomUUID()}.${type.ext}`;

  try {
    const url = await uploadToStorage(path, file, type.mime);
    return NextResponse.json({ url });
  } catch (error) {
    console.error("이미지 업로드 실패:", error);
    return NextResponse.json(
      { error: "이미지 업로드에 실패했습니다." },
      { status: 500 },
    );
  }
}
