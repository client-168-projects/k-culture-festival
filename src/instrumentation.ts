export async function register() {
  // IPv4를 우선하도록 강제해서
  // D1 REST API(api.cloudflare.com) 호출이 멈추지 않게 한다.
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const dns = await import("node:dns");
    dns.setDefaultResultOrder("ipv4first");
  }
}
