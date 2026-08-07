import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { d1Query } from "@/lib/d1";
import { sanitizeNoticeContent } from "@/lib/sanitize";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const title = typeof body?.title === "string" ? body.title.trim() : "";
  const content = typeof body?.content === "string" ? body.content : "";

  if (!title || !content) {
    return NextResponse.json(
      { error: "제목과 내용을 모두 입력해주세요." },
      { status: 400 },
    );
  }

  let rows: { id: number }[];
  try {
    rows = await d1Query<{ id: number }>(
      `INSERT INTO notices (title, content)
       VALUES (?, ?)
       RETURNING id`,
      [title, sanitizeNoticeContent(content)],
      { noStore: true },
    );
  } catch (error) {
    console.error("공지사항 생성 실패:", error);
    return NextResponse.json(
      { error: "공지사항 생성에 실패했습니다." },
      { status: 500 },
    );
  }

  revalidatePath("/community/notice");
  revalidatePath("/admin/notices");

  return NextResponse.json({ id: rows[0]?.id }, { status: 201 });
}
