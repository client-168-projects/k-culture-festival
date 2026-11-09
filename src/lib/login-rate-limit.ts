import { d1Query } from "@/lib/d1";

// IP당 15분 안에 10번 실패하면 15분 동안 로그인을 막는다.
const MAX_FAILURES = 10;
const WINDOW_MS = 15 * 60 * 1000;

let tableReady = false;

async function ensureTable() {
  if (tableReady) return;
  await d1Query(
    `CREATE TABLE IF NOT EXISTS admin_login_attempts (
       ip TEXT PRIMARY KEY,
       failures INTEGER NOT NULL,
       first_failed_at INTEGER NOT NULL
     )`,
    [],
    { noStore: true },
  );
  tableReady = true;
}

export function getClientIp(request: Request): string {
  return (
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    "unknown"
  );
}

export async function isLoginBlocked(ip: string): Promise<boolean> {
  await ensureTable();
  const rows = await d1Query<{ failures: number; first_failed_at: number }>(
    "SELECT failures, first_failed_at FROM admin_login_attempts WHERE ip = ?",
    [ip],
    { noStore: true },
  );
  const row = rows[0];
  if (!row) return false;
  if (Date.now() - row.first_failed_at > WINDOW_MS) return false;
  return row.failures >= MAX_FAILURES;
}

export async function recordLoginFailure(ip: string): Promise<void> {
  await ensureTable();
  const now = Date.now();
  await d1Query(
    `INSERT INTO admin_login_attempts (ip, failures, first_failed_at) VALUES (?, 1, ?)
     ON CONFLICT(ip) DO UPDATE SET
       failures = CASE WHEN ? - first_failed_at > ? THEN 1 ELSE failures + 1 END,
       first_failed_at = CASE WHEN ? - first_failed_at > ? THEN ? ELSE first_failed_at END`,
    [ip, now, now, WINDOW_MS, now, WINDOW_MS, now],
    { noStore: true },
  );
}

export async function clearLoginFailures(ip: string): Promise<void> {
  await ensureTable();
  await d1Query("DELETE FROM admin_login_attempts WHERE ip = ?", [ip], { noStore: true });
}
