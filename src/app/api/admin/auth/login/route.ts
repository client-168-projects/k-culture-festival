import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  createSessionToken,
  SESSION_COOKIE_MAX_AGE,
  SESSION_COOKIE_NAME,
  verifyPassword,
} from "@/lib/auth";
import { d1Query } from "@/lib/d1";

type AdminRow = { id: number; username: string; password_hash: string };

export async function POST(request: Request) {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "서버에 ADMIN_SESSION_SECRET이 설정되지 않았습니다." },
      { status: 500 },
    );
  }

  const body = await request.json().catch(() => null);
  const username = typeof body?.username === "string" ? body.username : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!username || !password) {
    return NextResponse.json(
      { error: "아이디와 비밀번호를 입력해주세요." },
      { status: 400 },
    );
  }

  let admins: AdminRow[];
  try {
    admins = await d1Query<AdminRow>(
      "SELECT id, username, password_hash FROM admins WHERE username = ?",
      [username],
      { noStore: true },
    );
  } catch (error) {
    console.error("로그인 중 D1 조회 실패:", error);
    return NextResponse.json(
      { error: "일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요." },
      { status: 500 },
    );
  }
  const admin = admins[0];

  const valid = admin
    ? await verifyPassword(password, admin.password_hash)
    : false;

  if (!admin || !valid) {
    return NextResponse.json(
      { error: "아이디 또는 비밀번호가 올바르지 않습니다." },
      { status: 401 },
    );
  }

  const token = await createSessionToken(
    { sub: admin.id, username: admin.username },
    secret,
  );

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_COOKIE_MAX_AGE,
  });

  return NextResponse.json({ success: true });
}
