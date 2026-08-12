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
  {
    title: "양궁체험",
    schedule: { type: "always" },
    imageUrl: "/assets/images/extra/양궁체험.png",
  },
  {
    title: "전통놀이존",
    schedule: { type: "always" },
    imageUrl: "/assets/images/extra/전통놀이존.png",
  },
  {
    title: "삐에로 풍선",
    schedule: { type: "always" },
    imageUrl: "/assets/images/extra/풍선삐에로.png",
  },
  {
    title: "K-푸드 간식",
    schedule: { type: "always" },
    imageUrl: "/assets/images/extra/K푸드간식.png",
  },
  {
    title: "인생네컷",
    schedule: { type: "event", label: "이벤트" },
    note: "스탬프 투어, 만족도 조사 참여 후 이용 가능",
    imageUrl: "/assets/images/extra/인생네컷.png",
  },
];
