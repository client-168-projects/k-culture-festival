export default {
  async fetch(request) {
    return new Response("서비스 준비 중입니다.", {
      status: 503,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Retry-After": "3600",
      },
    });
  },
};
