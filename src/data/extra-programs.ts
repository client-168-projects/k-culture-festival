export type ExtraProgramSchedule =
  | { type: "always" }
  | { type: "time"; start: string; end: string };

export type ExtraProgram = {
  title: string;
  schedule: ExtraProgramSchedule;
  imageUrl?: string;
};

export function formatExtraProgramSchedule(schedule: ExtraProgramSchedule) {
  return schedule.type === "always"
    ? "상시운영"
    : `${schedule.start} ~ ${schedule.end}`;
}

export const extraPrograms: ExtraProgram[] = [
  { title: "양궁체험", schedule: { type: "always" } },
  { title: "전통놀이존", schedule: { type: "always" } },
  { title: "인생네컷", schedule: { type: "always" } },
  { title: "삐에로 풍선", schedule: { type: "always" } },
  { title: "플리마켓", schedule: { type: "always" } },
  { title: "K-푸드 간식", schedule: { type: "always" } },
  {
    title: "미니 콘서트",
    schedule: { type: "time", start: "14:00", end: "15:00" },
  },
  {
    title: "댄스 배틀",
    schedule: { type: "time", start: "16:00", end: "17:00" },
  },
];
