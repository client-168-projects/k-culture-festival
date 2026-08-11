export type StageProgram = {
  /** 특별공연 여부 — true면 카드 배지가 강조 색상으로 표시된다. */
  special: boolean;
  category: string;
  genre: string;
  name: string;
};

export const stagePrograms: StageProgram[] = [
  { special: true, category: "특별공연", genre: "K-발라드", name: "김태우" },
  { special: true, category: "특별공연", genre: "K-POP", name: "CLASSy" },
  {
    special: true,
    category: "특별공연",
    genre: "K-매직",
    name: "김민형 마술사",
  },
  {
    special: false,
    category: "청소년 무대",
    genre: "K-댄스",
    name: "파주 청소년수련관",
  },
  {
    special: false,
    category: "청소년 무대",
    genre: "K-보컬",
    name: "파주 청소년수련관",
  },
  {
    special: false,
    category: "공연",
    genre: "다국적 걸그룹",
    name: "이리즈",
  },
  { special: false, category: "공연", genre: "싱어송라이터", name: "주황규" },
  { special: false, category: "공연", genre: "신인 아이돌", name: "비보이즈" },
  { special: false, category: "레크레이션", genre: "MC", name: "조권" },
];
