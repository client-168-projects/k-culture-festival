import { Badge } from "@/components/ui/badge";
import { MediaPlaceholder } from "@/components/media-placeholder";
import type { StageProgram } from "@/data/stage-programs";
import { cn } from "@/lib/utils";

export function StageProgramList({
  programs,
}: {
  programs: StageProgram[];
}) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {programs.map((item, index) => (
        <div
          key={`${item.name}-${index}`}
          className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
        >
          <div className="relative">
            <MediaPlaceholder
              label={item.name}
              className="aspect-square w-full rounded-none border-0 border-b border-solid border-border transition-transform duration-200 group-hover:scale-[1.03]"
            />
            <Badge
              className={cn(
                "absolute top-3 left-3",
                item.special
                  ? "bg-primary text-primary-foreground"
                  : "bg-background/90 text-foreground",
              )}
            >
              {item.category}
            </Badge>
          </div>

          <div className="flex flex-col gap-1.5 px-4 py-4 sm:px-5 sm:py-5">
            <span className="font-heading text-sm font-bold tracking-wide text-primary">
              {item.genre}
            </span>
            <span className="font-sans text-xl font-black tracking-tight">
              {item.name}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
