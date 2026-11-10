export async function register() {
  // D1 REST API 요청이 멈추지 않도록 IPv4를 우선 사용
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const dns = await import("node:dns");
    dns.setDefaultResultOrder("ipv4first");
  }
}
