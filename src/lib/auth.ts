import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// 비밀번호/세션 처리는 Web Crypto(crypto.subtle)만 사용한다. Node.js(라즈베리파이)와
// Cloudflare Workers에서 동일하게 동작시키기 위함이며, Node 전용 `crypto` 모듈이나
// bcrypt 네이티브 바인딩은 쓰지 않는다.

/** Cloudflare Workers의 Web Crypto PBKDF2 반복 횟수 상한이 100,000이라 그대로 쓴다. */
const PBKDF2_ITERATIONS = 100_000;
const SESSION_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7일

export type SessionPayload = {
  sub: number;
  username: string;
  exp: number;
};

function toHex(bytes: ArrayBuffer | Uint8Array): string {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  return Array.from(arr)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function fromHex(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

function base64UrlEncode(data: string | ArrayBuffer): string {
  let base64: string;
  if (typeof data === "string") {
    base64 = btoa(unescape(encodeURIComponent(data)));
  } else {
    let binary = "";
    for (const byte of new Uint8Array(data)) binary += String.fromCharCode(byte);
    base64 = btoa(binary);
  }
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function padBase64(input: string): string {
  const pad = (4 - (input.length % 4)) % 4;
  return input.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat(pad);
}

function base64UrlDecode(str: string): string {
  return decodeURIComponent(escape(atob(padBase64(str))));
}

function base64UrlDecodeToBuffer(str: string): ArrayBuffer {
  const binary = atob(padBase64(str));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

async function pbkdf2(password: string, salt: Uint8Array): Promise<ArrayBuffer> {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );

  return crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: salt as BufferSource,
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-256",
    },
    keyMaterial,
    256,
  );
}

/**
 * 비밀번호를 PBKDF2-SHA256으로 해싱한다.
 * @param password 평문 비밀번호
 * @returns `salt:hash` hex 문자열 (D1 `admins.password_hash`에 그대로 저장)
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await pbkdf2(password, salt);
  return `${toHex(salt)}:${toHex(hash)}`;
}

/**
 * 평문 비밀번호가 저장된 해시와 일치하는지 timing-safe 비교한다.
 * @param password 평문 비밀번호
 * @param stored `hashPassword`가 만든 `salt:hash` hex 문자열
 */
export async function verifyPassword(
  password: string,
  stored: string,
): Promise<boolean> {
  const [saltHex, hashHex] = stored.split(":");
  if (!saltHex || !hashHex) return false;

  const hash = await pbkdf2(password, fromHex(saltHex));
  return timingSafeEqual(toHex(hash), hashHex);
}

async function hmacKey(secret: string) {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

/**
 * HMAC-SHA256으로 서명한 세션 토큰을 만든다.
 * @param payload 세션에 담을 사용자 정보 (`exp`는 자동 계산)
 * @param secret 서명 키 (`ADMIN_SESSION_SECRET`)
 * @param maxAgeSeconds 만료까지 남은 시간(초), 기본 7일
 * @returns `payloadBase64Url.signatureBase64Url` 형태의 토큰
 */
export async function createSessionToken(
  payload: Omit<SessionPayload, "exp">,
  secret: string,
  maxAgeSeconds: number = SESSION_COOKIE_MAX_AGE,
): Promise<string> {
  const full: SessionPayload = {
    ...payload,
    exp: Date.now() + maxAgeSeconds * 1000,
  };
  const payloadB64 = base64UrlEncode(JSON.stringify(full));
  const key = await hmacKey(secret);
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payloadB64),
  );
  return `${payloadB64}.${base64UrlEncode(signature)}`;
}

/**
 * 세션 토큰의 서명과 만료 시각을 검증한다.
 * @param token `createSessionToken`이 만든 토큰
 * @param secret 서명 키 (`ADMIN_SESSION_SECRET`)
 * @returns 유효하면 payload, 아니면 `null`
 */
export async function verifySessionToken(
  token: string,
  secret: string,
): Promise<SessionPayload | null> {
  const [payloadB64, sigB64] = token.split(".");
  if (!payloadB64 || !sigB64) return null;

  const key = await hmacKey(secret);
  const valid = await crypto.subtle.verify(
    "HMAC",
    key,
    base64UrlDecodeToBuffer(sigB64),
    new TextEncoder().encode(payloadB64),
  );
  if (!valid) return null;

  try {
    const payload = JSON.parse(base64UrlDecode(payloadB64)) as SessionPayload;
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export const SESSION_COOKIE_NAME = "admin_session";
export { SESSION_COOKIE_MAX_AGE };

/**
 * 현재 요청 쿠키에서 admin 세션을 읽어 검증한다.
 * 전역 미들웨어 게이트가 없으므로 보호된 페이지/라우트에서 직접 호출한다.
 * @returns 유효한 세션, 아니면 `null`
 */
export async function getAdminSession(): Promise<SessionPayload | null> {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) return null;

  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  return verifySessionToken(token, secret);
}

/**
 * `/api/admin/*` 라우트 핸들러용 세션 가드.
 * @returns 유효한 세션, 또는 그대로 반환하면 되는 401 `NextResponse`
 */
export async function requireAdmin(): Promise<SessionPayload | NextResponse> {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }
  return session;
}
 