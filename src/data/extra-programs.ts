export type ExtraProgramSchedule =
  | { type: "always" }
  | { type: "time"; start: string; end: string }
  | { type: "event"; label: string };

export type ExtraProgram = {
  title: string;
  schedule: ExtraProgramSchedule;
  imageUrl?: string;
  /** 카드에 추가로 노출되는 한 줄 안내 (선택) */
  note?: string;
};

export function formatExtraProgramSchedule(schedule: ExtraProgramSchedule) {
  switch (schedule.type) {
    case "always":
      return "상시운영";
    case "event":
      return schedule.label;
    case "time":
      return `${schedule.start} ~ ${schedule.end}`;
  }
}

export const extraPrograms: ExtraProgram[] = [
  { title: "양궁체험", schedule: { type: "always" } },
  { title: "전통놀이존", schedule: { type: "always" } },
  { title: "삐에로 풍선", schedule: { type: "always" } },
  { title: "플리마켓", schedule: { type: "always" } },
  { title: "K-푸드 간식", schedule: { type: "always" } },
  {
    title: "인생네컷",
    schedule: { type: "event", label: "이벤트" },
    note: "만족도 조사 참여 후 이용 가능\n(선착순 소진 시 조기 마감)",
  },
];
