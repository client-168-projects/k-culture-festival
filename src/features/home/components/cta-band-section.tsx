import { Container } from "./container";

export function CtaBandSection() {
  return (
    <section className="bg-brand-vermillion py-12 text-brand-paper sm:py-14">
      <Container className="flex flex-col items-center text-center">
        <h2 className="font-heading text-[clamp(1.625rem,4vw,2.125rem)] leading-snug">
          2026. 9. 12.(토), 파주에서 만나요
        </h2>
        <p className="mt-2 text-sm opacity-85">
          경기미래교육 파주캠퍼스 · 무료 체험 프로그램 사전 신청 가능
        </p>
      </Container>
    </section>
  );
}
