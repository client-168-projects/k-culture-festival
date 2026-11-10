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
 * Cloudflare D1 REST API로 SQL을 실행한다. (Workers 바인딩 대신 HTTP를 사용해 Node.js에서도 동작)
 *
 * 조회는 fetch 캐시 + 60초 재검증을 사용한다. 배포 인스턴스(Cloudflare, Node.js)가 서로 독립적이라
 * `revalidatePath`가 다른 인스턴스 캐시까지 비우지 못하기 때문이다.
 * 쓰기 쿼리나 캐시되면 안 되는 조회는 `noStore: true`로 호출한다.
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
