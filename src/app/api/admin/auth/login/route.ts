import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  createSessionToken,
  SESSION_COOKIE_MAX_AGE,
  SESSION_COOKIE_NAME,
  verifyPassword,
} from "@/lib/auth";
import { d1Query } from "@/lib/d1";
import {
  clearLoginFailures,
  getClientIp,
  isLoginBlocked,
  recordLoginFailure,
} from "@/lib/login-rate-limit";

type AdminRow = { id: number; username: string; password_hash: string };

// 없는 계정도 같은 시간만큼 해싱해서 응답 시간으로 계정 존재 여부를 알 수 없게 한다.
const DUMMY_HASH = `${"0".repeat(32)}:${"0".repeat(64)}`;

export async function POST(request: Request) {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    console.error("ADMIN_SESSION_SECRET이 설정되지 않았습니다.");
    return NextResponse.json(
      { error: "일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요." },
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

  const ip = getClientIp(request);
  const blocked = await isLoginBlocked(ip).catch((error) => {
    console.error("로그인 제한 조회 오류:", error);
    return false;
  });
  if (blocked) {
    return NextResponse.json(
      { error: "로그인 시도가 너무 많습니다. 15분 후 다시 시도해주세요." },
      { status: 429 },
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

  const valid = await verifyPassword(password, admin?.password_hash ?? DUMMY_HASH);

  if (!admin || !valid) {
    await recordLoginFailure(ip).catch((error) => console.error("로그인 실패 기록 오류:", error));
    return NextResponse.json(
      { error: "아이디 또는 비밀번호가 올바르지 않습니다." },
      { status: 401 },
    );
  }

  await clearLoginFailures(ip).catch((error) => console.error("로그인 기록 삭제 오류:", error));

  const token = await createSessionToken(
    { sub: admin.id, username: admin.username },
    secret,
  );

  const forwardedProto = request.headers.get("x-forwarded-proto");
  const isHttps = forwardedProto
    ? forwardedProto === "https"
    : new URL(request.url).protocol === "https:";

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isHttps,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_COOKIE_MAX_AGE,
  });

  return NextResponse.json({ success: true });
}
