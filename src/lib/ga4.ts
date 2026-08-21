const TOKEN_URL = "https://oauth2.googleapis.com/token";
const DATA_API_BASE = "https://analyticsdata.googleapis.com/v1beta";
const SCOPE = "https://www.googleapis.com/auth/analytics.readonly";
const REQUEST_TIMEOUT_MS = 10_000;

export type GA4Summary = {
  activeUsersToday: number;
  visitors7d: number;
  pageViews7d: number;
  dailyTrend: { date: string; visitors: number; pageViews: number }[];
  topPages: { path: string; views: number }[];
  noticePages: { path: string; views: number }[];
};

export type GA4Result =
  | { status: "unconfigured"; missing: string[] }
  | { status: "error"; message: string }
  | { status: "ok"; data: GA4Summary };

/**
 * GA4 리포트 API는 방문자가 0명인 날짜의 행을 아예 반환하지 않는다.
 * "최근 7일" 범위(6daysAgo~today, GA4 속성 시간대인 KST 기준)의 날짜 목록을
 * YYYYMMDD 형식으로 미리 만들어두고, 응답에 없는 날짜는 0으로 채워 넣는다.
 */
function getRecentKstDateStrings(days: number): string[] {
  const nowKst = new Date(Date.now() + 9 * 60 * 60 * 1000);
  const dates: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(nowKst.getTime() - i * 24 * 60 * 60 * 1000);
    const y = d.getUTCFullYear();
    const m = String(d.getUTCMonth() + 1).padStart(2, "0");
    const day = String(d.getUTCDate()).padStart(2, "0");
    dates.push(`${y}${m}${day}`);
  }
  return dates;
}

/**
 * `src/lib/auth.ts`와 동일하게 Web Crypto(`crypto.subtle`)만 사용한다 —
 * Cloudflare Workers와 Node.js(라즈베리파이) 양쪽에서 동일하게 동작해야 하기 때문이다.
 * 서비스 계정 JWT 서명(RS256)에 Node 전용 `crypto`/`jsonwebtoken` 라이브러리를 쓰지 않는다.
 */

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

function pemToArrayBuffer(pem: string): ArrayBuffer {
  const base64 = pem
    .replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\s+/g, "");
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

type GA4Config = { propertyId: string; clientEmail: string; privateKey: string };

function getMissingEnvKeys(): string[] {
  const missing: string[] = [];
  if (!process.env.GA4_PROPERTY_ID) missing.push("GA4_PROPERTY_ID");
  if (!process.env.GA4_SERVICE_ACCOUNT_EMAIL) missing.push("GA4_SERVICE_ACCOUNT_EMAIL");
  if (!process.env.GA4_SERVICE_ACCOUNT_PRIVATE_KEY) missing.push("GA4_SERVICE_ACCOUNT_PRIVATE_KEY");
  return missing;
}

function getConfig(): GA4Config | null {
  const propertyId = process.env.GA4_PROPERTY_ID;
  const clientEmail = process.env.GA4_SERVICE_ACCOUNT_EMAIL;
  const privateKeyRaw = process.env.GA4_SERVICE_ACCOUNT_PRIVATE_KEY;

  if (!propertyId || !clientEmail || !privateKeyRaw) return null;

  // 환경변수는 한 줄로 저장되므로 PEM 개행은 "\n" 리터럴로 이스케이프되어 들어온다.
  return { propertyId, clientEmail, privateKey: privateKeyRaw.replace(/\\n/g, "\n") };
}

async function getAccessToken(clientEmail: string, privateKeyPem: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = base64UrlEncode(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = base64UrlEncode(
    JSON.stringify({
      iss: clientEmail,
      scope: SCOPE,
      aud: TOKEN_URL,
      exp: now + 3600,
      iat: now,
    }),
  );
  const unsigned = `${header}.${claims}`;

  const key = await crypto.subtle.importKey(
    "pkcs8",
    pemToArrayBuffer(privateKeyPem),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    key,
    new TextEncoder().encode(unsigned),
  );
  const jwt = `${unsigned}.${base64UrlEncode(signature)}`;

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`GA4 액세스 토큰 발급 실패: ${res.status} ${body}`);
  }
  const json = (await res.json()) as { access_token: string };
  return json.access_token;
}

type ReportRow = { dimensionValues?: { value: string }[]; metricValues?: { value: string }[] };
type ReportResult = { rows?: ReportRow[] };

async function batchRunReports(
  accessToken: string,
  propertyId: string,
  requests: Record<string, unknown>[],
): Promise<ReportResult[]> {
  const res = await fetch(`${DATA_API_BASE}/properties/${propertyId}:batchRunReports`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ requests }),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`GA4 리포트 조회 실패: ${res.status} ${body}`);
  }
  const json = (await res.json()) as { reports?: ReportResult[] };
  return json.reports ?? [];
}

/**
 * 관리자 통계 페이지용 GA4 요약 데이터.
 * 환경변수 미설정과 API 호출 실패를 구분해서 반환한다 — 관리자만 보는 화면이라
 * 실패 원인을 그대로 보여줘도 되고, 그래야 설정 문제인지 다른 문제인지 바로 알 수 있다.
 */
export async function getGA4Summary(): Promise<GA4Result> {
  const config = getConfig();
  if (!config) return { status: "unconfigured", missing: getMissingEnvKeys() };

  try {
    const accessToken = await getAccessToken(config.clientEmail, config.privateKey);

    const [todayReport, weekTotalReport, trendReport, topPagesReport, noticePagesReport] =
      await batchRunReports(accessToken, config.propertyId, [
        {
          dateRanges: [{ startDate: "today", endDate: "today" }],
          metrics: [{ name: "activeUsers" }],
        },
        {
          dateRanges: [{ startDate: "6daysAgo", endDate: "today" }],
          metrics: [{ name: "activeUsers" }, { name: "screenPageViews" }],
        },
        {
          dateRanges: [{ startDate: "6daysAgo", endDate: "today" }],
          dimensions: [{ name: "date" }],
          metrics: [{ name: "activeUsers" }, { name: "screenPageViews" }],
          orderBys: [{ dimension: { dimensionName: "date" } }],
        },
        {
          dateRanges: [{ startDate: "6daysAgo", endDate: "today" }],
          dimensions: [{ name: "pagePath" }],
          metrics: [{ name: "screenPageViews" }],
          orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
          limit: 10,
        },
        {
          // GA4는 "전체 기간"을 직접 지정하는 옵션이 없어, 속성 생성 시점보다 훨씬
          // 이른 고정 날짜를 시작일로 써서 사실상 전체 누적 데이터를 가져온다.
          dateRanges: [{ startDate: "2020-01-01", endDate: "today" }],
          dimensions: [{ name: "pagePath" }],
          metrics: [{ name: "screenPageViews" }],
          dimensionFilter: {
            filter: {
              fieldName: "pagePath",
              stringFilter: { matchType: "BEGINS_WITH", value: "/community/notice/" },
            },
          },
          orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
          limit: 50,
        },
      ]);

    const trendByDate = new Map(
      (trendReport?.rows ?? []).map((row) => [
        row.dimensionValues?.[0]?.value ?? "",
        {
          visitors: Number(row.metricValues?.[0]?.value ?? 0),
          pageViews: Number(row.metricValues?.[1]?.value ?? 0),
        },
      ]),
    );
    const dailyTrend = getRecentKstDateStrings(7).map((date) => ({
      date,
      visitors: trendByDate.get(date)?.visitors ?? 0,
      pageViews: trendByDate.get(date)?.pageViews ?? 0,
    }));

    const topPages = (topPagesReport?.rows ?? []).map((row) => ({
      path: row.dimensionValues?.[0]?.value ?? "",
      views: Number(row.metricValues?.[0]?.value ?? 0),
    }));

    const noticePages = (noticePagesReport?.rows ?? []).map((row) => ({
      path: row.dimensionValues?.[0]?.value ?? "",
      views: Number(row.metricValues?.[0]?.value ?? 0),
    }));

    return {
      status: "ok",
      data: {
        activeUsersToday: Number(todayReport?.rows?.[0]?.metricValues?.[0]?.value ?? 0),
        visitors7d: Number(weekTotalReport?.rows?.[0]?.metricValues?.[0]?.value ?? 0),
        pageViews7d: Number(weekTotalReport?.rows?.[0]?.metricValues?.[1]?.value ?? 0),
        dailyTrend,
        topPages,
        noticePages,
      },
    };
  } catch (error) {
    console.error("GA4 통계 조회 실패:", error);
    const message = error instanceof Error ? error.message : String(error);
    return { status: "error", message };
  }
}
