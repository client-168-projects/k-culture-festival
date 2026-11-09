export async function register() {
  // IPv4 우선. 라즈베리파이에서 D1 API 호출이 멈추는 문제 대응
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const dns = await import("node:dns");
    dns.setDefaultResultOrder("ipv4first");
  }
}
