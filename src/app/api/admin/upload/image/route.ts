import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";

import { ALLOWED_IMAGE_MIME_TYPES, MAX_IMAGE_SIZE_BYTES } from "@/constants/media";
import { uploadToStorage } from "@/lib/supabase";

export async function POST(request: Request) {
  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "파일이 없습니다." }, { status: 400 });
  }

  if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "PNG, JPEG, WEBP, GIF 이미지만 업로드할 수 있습니다." },
      { status: 400 },
    );
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return NextResponse.json(
      { error: `이미지는 ${MAX_IMAGE_SIZE_BYTES / 1024 / 1024}MB 이하만 업로드할 수 있습니다.` },
      { status: 400 },
    );
  }

  const ext = file.type.split("/")[1];
  const path = `images/${randomUUID()}.${ext}`;

  try {
    const url = await uploadToStorage(path, file);
    return NextResponse.json({ url });
  } catch (error) {
    console.error("이미지 업로드 실패:", error);
    return NextResponse.json(
      { error: "이미지 업로드에 실패했습니다." },
      { status: 500 },
    );
  }
}
