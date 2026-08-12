export type StageProgram = {
  category: string;
  genre: string;
  name: string;
  image: string;
  /** 이미지 원본 픽셀 크기 — 모달 확대에 사용 */
  imageWidth: number;
  imageHeight: number;
  /** 카드에 추가로 노출되는 한 줄 안내 (선택) */
  note?: string;
  /** 카드 하나에 여러 명이 묶여 있을 때(예: "릴재우 & 오투") 실제 인원 수. 기본값 1 */
  memberCount?: number;
};

const IMAGE_BASE = "/assets/images/features";

export const stagePrograms: StageProgram[] = [
  {
    category: "특별공연",
    genre: "K-발라드",
    name: "김태우",
    image: `${IMAGE_BASE}/김태우.jpg`,
    imageWidth: 979,
    imageHeight: 1469,
  },
  {
    category: "특별공연",
    genre: "K-POP",
    name: "CLASS:y",
    image: `${IMAGE_BASE}/클라씨.jpg`,
    imageWidth: 1600,
    imageHeight: 900,
  },
  {
    category: "특별공연",
    genre: "K-매직",
    name: "김민형 마술사",
    image: `${IMAGE_BASE}/김민형.jpg`,
    imageWidth: 714,
    imageHeight: 1024,
  },
  {
    category: "공연",
    genre: "다국적 걸그룹",
    name: "이리즈",
    image: `${IMAGE_BASE}/이리즈.jpg`,
    imageWidth: 1600,
    imageHeight: 900,
  },
  {
    category: "공연",
    genre: "신인 아이돌",
    name: "비보이즈",
    image: `${IMAGE_BASE}/비보이즈.jpg`,
    imageWidth: 984,
    imageHeight: 810,
  },
  {
    category: "공연",
    genre: "싱어송라이터",
    name: "주황규",
    image: `${IMAGE_BASE}/주황규.jpg`,
    imageWidth: 1003,
    imageHeight: 1512,
  },
  {
    category: "파주시청소년수련원",
    genre: "K-댄스",
    name: "뉴벤트",
    image: `${IMAGE_BASE}/뉴벤트.jpg`,
    imageWidth: 1153,
    imageHeight: 767,
  },
  {
    category: "파주시청소년수련원",
    genre: "가수",
    name: "릴재우 & 오투",
    image: `${IMAGE_BASE}/릴재우-오투.png`,
    imageWidth: 1600,
    imageHeight: 1000,
    memberCount: 2,
  },
  {
    category: "레크레이션",
    genre: "MC",
    name: "MC조권",
    image: `${IMAGE_BASE}/mc조권.jpg`,
    imageWidth: 1600,
    imageHeight: 1600,
    note: "공연 중간에 진행되는 레크레이션으로 다양한 경품을 팡팡!",
  },
];
