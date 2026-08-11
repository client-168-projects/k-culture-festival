import { MediaPlaceholder } from "@/components/media-placeholder";
import { Badge } from "@/components/ui/badge";
import {
  formatExtraProgramSchedule,
  type ExtraProgram,
} from "@/data/extra-programs";

export function ExtraProgramList({ programs }: { programs: ExtraProgram[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {programs.map((item) => (
        <div key={item.title} className="flex flex-col gap-3">
          {item.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.imageUrl}
              alt={item.title}
              className="aspect-square w-full rounded-none border border-border object-cover"
            />
          ) : (
            <MediaPlaceholder
              label={item.title}
              className="aspect-square rounded-none"
            />
          )}
          <div className="flex items-center gap-2">
            <Badge variant={item.schedule.type === "event" ? "default" : "secondary"}>
              {formatExtraProgramSchedule(item.schedule)}
            </Badge>
            <p className="text-base">{item.title}</p>
          </div>
          {item.note ? (
            <p className="text-sm whitespace-pre-line text-muted-foreground">
              {item.note}
            </p>
          ) : null}
        </div>
      ))}
    </div>
  );
}
