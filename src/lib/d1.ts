const CF_API_BASE = "https://api.cloudflare.com/client/v4";
const REQUEST_TIMEOUT_MS = 10_000;

type D1QueryResult<T> = {
  results: T[];
  success: boolean;
  meta: {
    changes: number;
    last_row_id: number;
    rows_written: number;
    rows_read: number;
  };
};

type D1ApiResponse<T> = {
  success: boolean;
  errors: { code: number; message: string }[];
  result: D1QueryResult<T>[];
};

function getConfig() {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const databaseId = process.env.CLOUDFLARE_D1_DATABASE_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !databaseId || !apiToken) {
    throw new Error(
      "D1 환경변수가 설정되지 않았습니다: CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_D1_DATABASE_ID, CLOUDFLARE_API_TOKEN",
    );
  }

  return { accountId, databaseId, apiToken };
}

const READ_REVALIDATE_SECONDS = 60;

/**
 * Cloudflare D1 REST API로 SQL을 실행한다.
 * 네이티브 Workers 바인딩이 아니라 HTTP 호출이라 Node.js 환경(라즈베리파이 포함) 어디서든 동작한다.
 * INSERT/UPDATE는 `RETURNING`을 붙이면 결과 행을 그대로 받을 수 있다.
 *
 * 조회(SELECT)는 Next.js의 fetch 캐시를 타되 `next.revalidate`로 60초마다 자동 재검증한다.
 * Cloudflare Pages와 라즈베리파이는 완전히 독립된 두 개의 실행 인스턴스라서, 관련 API 라우트가 호출하는
 * `revalidatePath`는 그 요청을 처리한 인스턴스의 캐시만 지운다 — 다른 인스턴스는 그 신호를 받지 못한다.
 * 시간 기반 재검증이 없으면 한쪽 인스턴스가 초기 캐시(예: 공지사항이 없던 시점)를 영구히 서빙하게 된다.
 * INSERT/UPDATE/DELETE 같은 쓰기 쿼리, 그리고 로그인처럼 캐시되면 안 되는 조회는
 * `noStore: true`로 호출해 항상 최신 상태로 실행되게 한다.
 */
export async function d1Query<T = Record<string, unknown>>(
  sql: string,
  params: unknown[] = [],
  options: { noStore?: boolean } = {},
): Promise<T[]> {
  const { accountId, databaseId, apiToken } = getConfig();

  let res: Response;
  try {
    res = await fetch(
      `${CF_API_BASE}/accounts/${accountId}/d1/database/${databaseId}/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sql, params }),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        ...(options.noStore
          ? { cache: "no-store" as const }
          : { next: { revalidate: READ_REVALIDATE_SECONDS } }),
      },
    );
  } catch (error) {
    if (error instanceof Error && error.name === "TimeoutError") {
      throw new Error(
        `D1 요청이 ${REQUEST_TIMEOUT_MS / 1000}초 안에 응답하지 않았습니다 (네트워크 확인 필요).`,
      );
    }
    throw error;
  }

  const json = (await res.json()) as D1ApiResponse<T>;

  if (!res.ok || !json.success) {
    const message =
      json.errors?.map((e) => e.message).join(", ") ?? res.statusText;
    throw new Error(`D1 쿼리 실패: ${message}`);
  }

  return json.result[0]?.results ?? [];
}
