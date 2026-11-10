const TOKEN_URL = "https://oauth2.googleapis.com/token";
const DATA_API_BASE = "https://analyticsdata.googleapis.com/v1beta";
const SCOPE = "https://www.googleapis.com/auth/analytics.readonly";
const REQUEST_TIMEOUT_MS = 10_000;

/** GA4 기본 채널 그룹(sessionDefaultChannelGroup) 값의 한글 라벨/설명 */
const CHANNEL_META_KO: Record<string, { label: string; description: string }> = {
  Direct: {
    label: "직접 유입",
    description: "주소를 직접 입력했거나 출처를 알 수 없는 방문 (카톡 공유 링크 등 포함)",
  },
  "Organic Search": {
    label: "자연 검색",
    description: "네이버·구글 등에서 검색해서 들어옴",
  },
  "Paid Search": { label: "검색 광고", description: "검색 광고를 클릭해서 들어옴" },
  "Organic Social": {
    label: "소셜 미디어",
    description: "인스타그램·페이스북 등 SNS 링크로 들어옴",
  },
  "Paid Social": { label: "소셜 광고", description: "SNS 광고를 클릭해서 들어옴" },
  Referral: { label: "다른 웹사이트 링크", description: "다른 사이트에 걸린 링크를 타고 들어옴" },
  Email: { label: "이메일", description: "이메일에 포함된 링크로 들어옴" },
  "Organic Video": { label: "동영상", description: "유튜브 등 동영상 플랫폼을 통해 들어옴" },
  "Paid Video": { label: "동영상 광고", description: "동영상 광고를 클릭해서 들어옴" },
  Display: { label: "배너 광고", description: "배너(디스플레이) 광고를 클릭해서 들어옴" },
  Affiliates: { label: "제휴 사이트", description: "제휴 사이트를 통해 들어옴" },
  Audio: { label: "오디오", description: "오디오 광고를 통해 들어옴" },
  SMS: { label: "문자(SMS)", description: "문자 메시지 링크로 들어옴" },
  "Mobile Push Notifications": { label: "푸시 알림", description: "앱 푸시 알림을 통해 들어옴" },
  "Paid Other": { label: "기타 광고", description: "위 분류에 안 맞는 기타 광고를 통해 들어옴" },
  Unassigned: {
    label: "미분류",
    description: "구글이 출처를 특정하지 못한 방문 (직접 유입과 비슷하게 보면 됨)",
  },
};

export type GA4Summary = {
  activeUsersToday: number;
  visitors7d: number;
  mainPageViewsAllTime: number;
  dailyTrend: { date: string; visitors: number; pageViews: number }[];
  dailyTrendAllTime: { date: string; visitors: number; pageViews: number }[];
  topPages: { path: string; views: number }[];
  topPagesAllTime: { path: string; views: number }[];
  noticePages: { path: string; views: number }[];
  trafficSources: { channel: string; description: string; users: number }[];
};

export type GA4Result =
  | { status: "unconfigured"; missing: string[] }
  | { status: "error"; message: string }
  | { status: "ok"; data: GA4Summary };

const DAY_MS = 86_400_000;
const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

function toYmd(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

function getKstTodayUtcMs(): number {
  const nowKst = new Date(Date.now() + KST_OFFSET_MS);
  return Date.UTC(nowKst.getUTCFullYear(), nowKst.getUTCMonth(), nowKst.getUTCDate());
}

/**
 * GA4는 방문자가 0명인 날짜의 행을 반환하지 않으므로,
 * 기간 내 전체 날짜(YYYYMMDD, KST)를 미리 만들어 빈 날짜를 0으로 채우는 데 사용한다.
 */
function getRecentKstDateStrings(days: number): string[] {
  const todayMs = getKstTodayUtcMs();
  return Array.from({ length: days }, (_, i) =>
    toYmd(new Date(todayMs - (days - 1 - i) * DAY_MS)),
  );
}

/** 시작일(YYYY-MM-DD)부터 오늘(KST)까지의 날짜 목록 */
function getKstDateStringsFrom(startDateISO: string): string[] {
  const [y, m, d] = startDateISO.split("-").map(Number);
  const startMs = Date.UTC(y, m - 1, d);
  const dayCount = Math.max(0, Math.round((getKstTodayUtcMs() - startMs) / DAY_MS)) + 1;
  return Array.from({ length: dayCount }, (_, i) => toYmd(new Date(startMs + i * DAY_MS)));
}

// 서비스 계정 JWT(RS256) 서명은 auth.ts와 같이 Web Crypto만 사용한다 (Workers/Node.js 공용).

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

  // 환경변수에는 PEM 개행이 "\n" 리터럴로 저장된다.
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

/** 관리자 통계 페이지용 GA4 요약. 환경변수 미설정과 API 오류를 구분해 반환한다. */
export async function getGA4Summary(): Promise<GA4Result> {
  const config = getConfig();
  if (!config) return { status: "unconfigured", missing: getMissingEnvKeys() };

  try {
    const accessToken = await getAccessToken(config.clientEmail, config.privateKey);

    const ALL_TIME_START_DATE = "2026-08-14"; // 사이트 오픈일
    const EXCLUDE_ADMIN_FILTER = {
      notExpression: {
        filter: {
          fieldName: "pagePath",
          stringFilter: { matchType: "BEGINS_WITH" as const, value: "/admin" },
        },
      },
    };

    // batchRunReports는 요청당 최대 5개 리포트까지 허용
    const [
      [weekTotalReport, trendReport, topPagesReport, noticePagesReport, trafficSourcesReport],
      [topPagesAllTimeReport, trendAllTimeReport, mainPageAllTimeReport],
    ] = await Promise.all([
      batchRunReports(accessToken, config.propertyId, [
        {
          dateRanges: [{ startDate: "6daysAgo", endDate: "today" }],
          metrics: [{ name: "activeUsers" }],
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
          dimensionFilter: EXCLUDE_ADMIN_FILTER,
          orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
          limit: 10,
        },
        {
          dateRanges: [{ startDate: ALL_TIME_START_DATE, endDate: "today" }],
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
        {
          dateRanges: [{ startDate: "6daysAgo", endDate: "today" }],
          dimensions: [{ name: "sessionDefaultChannelGroup" }],
          metrics: [{ name: "activeUsers" }],
          orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
          limit: 10,
        },
      ]),
      batchRunReports(accessToken, config.propertyId, [
        {
          dateRanges: [{ startDate: ALL_TIME_START_DATE, endDate: "today" }],
          dimensions: [{ name: "pagePath" }],
          metrics: [{ name: "screenPageViews" }],
          dimensionFilter: EXCLUDE_ADMIN_FILTER,
          orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
          limit: 10,
        },
        {
          dateRanges: [{ startDate: ALL_TIME_START_DATE, endDate: "today" }],
          dimensions: [{ name: "date" }],
          metrics: [{ name: "activeUsers" }, { name: "screenPageViews" }],
          orderBys: [{ dimension: { dimensionName: "date" } }],
        },
        {
          dateRanges: [{ startDate: ALL_TIME_START_DATE, endDate: "today" }],
          dimensions: [{ name: "pagePath" }],
          metrics: [{ name: "screenPageViews" }],
          dimensionFilter: {
            filter: { fieldName: "pagePath", stringFilter: { matchType: "EXACT", value: "/" } },
          },
        },
      ]),
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

    const trendAllTimeByDate = new Map(
      (trendAllTimeReport?.rows ?? []).map((row) => [
        row.dimensionValues?.[0]?.value ?? "",
        {
          visitors: Number(row.metricValues?.[0]?.value ?? 0),
          pageViews: Number(row.metricValues?.[1]?.value ?? 0),
        },
      ]),
    );
    const dailyTrendAllTime = getKstDateStringsFrom(ALL_TIME_START_DATE).map((date) => ({
      date,
      visitors: trendAllTimeByDate.get(date)?.visitors ?? 0,
      pageViews: trendAllTimeByDate.get(date)?.pageViews ?? 0,
    }));

    const topPages = (topPagesReport?.rows ?? []).map((row) => ({
      path: row.dimensionValues?.[0]?.value ?? "",
      views: Number(row.metricValues?.[0]?.value ?? 0),
    }));

    const topPagesAllTime = (topPagesAllTimeReport?.rows ?? []).map((row) => ({
      path: row.dimensionValues?.[0]?.value ?? "",
      views: Number(row.metricValues?.[0]?.value ?? 0),
    }));

    const noticePages = (noticePagesReport?.rows ?? []).map((row) => ({
      path: row.dimensionValues?.[0]?.value ?? "",
      views: Number(row.metricValues?.[0]?.value ?? 0),
    }));

    const trafficSources = (trafficSourcesReport?.rows ?? []).map((row) => {
      const raw = row.dimensionValues?.[0]?.value ?? "";
      return {
        channel: CHANNEL_META_KO[raw]?.label ?? raw,
        description: CHANNEL_META_KO[raw]?.description ?? "",
        users: Number(row.metricValues?.[0]?.value ?? 0),
      };
    });

    return {
      status: "ok",
      data: {
        activeUsersToday: dailyTrend[dailyTrend.length - 1]?.visitors ?? 0,
        visitors7d: Number(weekTotalReport?.rows?.[0]?.metricValues?.[0]?.value ?? 0),
        mainPageViewsAllTime: Number(
          mainPageAllTimeReport?.rows?.[0]?.metricValues?.[0]?.value ?? 0,
        ),
        dailyTrend,
        dailyTrendAllTime,
        topPages,
        topPagesAllTime,
        noticePages,
        trafficSources,
      },
    };
  } catch (error) {
    console.error("GA4 통계 조회 실패:", error);
    const message = error instanceof Error ? error.message : String(error);
    return { status: "error", message };
  }
}
