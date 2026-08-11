import { ArchPanel } from "./arch-panel";
import { Container } from "./container";
import { FullscreenSection } from "./fullscreen-section";
import { SectionHead } from "./section-head";

const PROGRAMS = [
  {
    tone: "vermillion",
    title: "K-키캡 키링 만들기",
    description: "나만의 키캡 키링을 직접 조립해 가져가는 체험",
    icon: (
      <svg viewBox="0 0 64 64" width="34" height="34" fill="none">
        <rect
          x="16"
          y="16"
          width="32"
          height="32"
          rx="6"
          stroke="var(--brand-paper)"
          strokeWidth="2.5"
        />
        <circle
          cx="32"
          cy="32"
          r="7"
          stroke="var(--brand-paper)"
          strokeWidth="2.5"
        />
      </svg>
    ),
  },
  {
    tone: "indigo",
    title: "K-액막이 명태 만들기",
    description: "액운을 막는 전통 명태 장식을 직접 만들어보는 체험",
    icon: (
      <svg viewBox="0 0 64 64" width="34" height="34" fill="none">
        <path
          d="M20 44c6-18 18-18 24 0"
          stroke="var(--brand-paper)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle
          cx="32"
          cy="20"
          r="6"
          stroke="var(--brand-paper)"
          strokeWidth="2.5"
        />
      </svg>
    ),
  },
] as const;

export function ExperienceSection() {
  return (
    <FullscreenSection className="bg-brand-indigo-deep bg-[radial-gradient(circle_at_1px_1px,rgba(248,242,230,0.06)_1px,transparent_0)] bg-size-[22px_22px] text-brand-paper">
      <Container>
        <SectionHead
          eyebrow="Experience"
          title="체험 프로그램"
          description="누구나 무료로 즐기는 K-컬처 체험, 하루종일 즐길 거리가 가득합니다."
          invert
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PROGRAMS.map((program) => (
            <div
              key={program.title}
              className="group overflow-hidden rounded-b-[14px] border border-brand-paper/16 bg-brand-paper/6 transition-all duration-200 hover:-translate-y-1 hover:border-brand-paper/30 hover:bg-brand-paper/10"
            >
              <ArchPanel
                tone={program.tone}
                className="h-32 w-full transition-transform duration-200 group-hover:scale-[1.03] sm:h-36"
              >
                {program.icon}
              </ArchPanel>
              <div className="px-5.5 pt-5 pb-6.5">
                <h3 className="text-lg font-semibold">{program.title}</h3>
                <p className="mt-2 text-sm text-brand-indigo-mist">
                  {program.description}
                </p>
              </div>
            </div>
          ))}

          <div className="flex flex-col items-start justify-center rounded-[14px] border-[1.5px] border-dashed border-brand-paper/35 px-5.5 py-6.5 transition-colors duration-200 hover:border-brand-gold/60">
            <div className="font-display text-[30px] text-brand-gold">
              +26
            </div>
            <p className="mt-1.5 text-sm text-brand-indigo-mist">
              그 외 30여 가지 무료 체험 프로그램이 준비되어 있습니다
            </p>
          </div>
        </div>
      </Container>
    </FullscreenSection>
  );
}
