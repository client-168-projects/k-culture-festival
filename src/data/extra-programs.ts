export type ExtraProgramSchedule =
  | { type: "always" }
  | { type: "time"; start: string; end: string }
  | { type: "event"; label: string };

export type ExtraProgram = {
  title: string;
  schedule: ExtraProgramSchedule;
  imageUrl?: string;
  /** 카드 안내 문구 */
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
  {
    title: "양궁체험",
    schedule: { type: "always" },
    imageUrl: "/assets/images/extra/양궁체험.png",
  },
  {
    title: "전통놀이존",
    schedule: { type: "always" },
    imageUrl: "/assets/images/extra/전통놀이존.png",
    note: "투호, 대형윷놀이, 제기차기, 공기놀이 등 다양한 전통놀이를 즐길 수 있어요",
  },
  {
    title: "삐에로 풍선",
    schedule: { type: "always" },
    imageUrl: "/assets/images/extra/풍선삐에로.png",
  },
  {
    title: "포토네컷",
    schedule: { type: "event", label: "이벤트" },
    note: "스탬프 체험, 만족도 조사 참여 후 이용 가능",
    imageUrl: "/assets/images/extra/인생네컷.png",
  },
  {
    title: "스탬프 체험",
    schedule: { type: "always" },
    imageUrl: "/assets/images/extra/스탬프-체험.png",
  },
];
