import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// Workers와 Node.js(라즈베리파이) 양쪽에서 돌도록 Web Crypto만 사용한다.

// Workers Web Crypto의 PBKDF2 반복 횟수 상한
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

// 반환 형식: `salt:hash` (hex)
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await pbkdf2(password, salt);
  return `${toHex(salt)}:${toHex(hash)}`;
}

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

// 토큰 형식: `payload.signature` (base64url, HMAC-SHA256)
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

// 전역 미들웨어가 없으므로 보호된 페이지와 API에서 직접 호출한다.
export async function getAdminSession(): Promise<SessionPayload | null> {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) return null;

  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  return verifySessionToken(token, secret);
}

// API 라우트용. 세션이 없으면 그대로 반환할 401 응답을 돌려준다.
export async function requireAdmin(): Promise<SessionPayload | NextResponse> {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }
  return session;
}
 