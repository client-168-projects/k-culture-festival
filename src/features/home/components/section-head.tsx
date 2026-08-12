import { cn } from "@/lib/utils";

export function SectionHead({
  eyebrow,
  title,
  description,
  invert = false,
}: {
  eyebrow: string;
  title: string;
  description: string;
  /** 어두운 배경(체험 프로그램 섹션 등) 위에 놓일 때 */
  invert?: boolean;
}) {
  return (
    <div className="mb-10 sm:mb-11">
      <span
        className={cn(
          "inline-flex items-center gap-2 text-xs font-bold tracking-[0.14em] uppercase before:block before:h-0.5 before:w-4",
          invert
            ? "text-brand-gold before:bg-brand-gold"
            : "text-brand-vermillion before:bg-brand-vermillion",
        )}
      >
        {eyebrow}
      </span>
      <h2 className="mt-3 mb-3.5 font-heading text-[clamp(1.875rem,4vw,2.625rem)]">
        {title}
      </h2>
      <p
        className={cn(
          "text-base sm:text-lg",
          invert ? "text-brand-indigo-mist" : "text-brand-ink-soft",
        )}
      >
        {description}
      </p>
    </div>
  );
}
