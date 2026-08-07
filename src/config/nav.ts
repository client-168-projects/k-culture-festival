export type NavItem = {
  key: string;
  title: string;
  href: string;
};

export type NavSection = {
  key: string;
  title: string;
  items: NavItem[];
};

export const navSections: NavSection[] = [
  {
    key: "about",
    title: "축제소개",
    items: [
      { key: "overview", title: "축제개요", href: "/about/overview" },
      { key: "schedule", title: "전체 일정표", href: "/about/schedule" },
    ],
  },
  {
    key: "program",
    title: "행사안내",
    items: [
      { key: "stage", title: "무대 프로그램", href: "/program/stage" },
      {
        key: "experience",
        title: "체험 프로그램",
        href: "/program/experience",
      },
      { key: "extra", title: "부대프로그램", href: "/program/extra" },
    ],
  },
  {
    key: "venue",
    title: "행사장 안내",
    items: [
      { key: "map", title: "행사장 지도", href: "/venue/map" },
      { key: "directions", title: "오시는 길", href: "/venue/directions" },
      { key: "shuttle", title: "셔틀버스", href: "/venue/shuttle" },
    ],
  },
  {
    key: "community",
    title: "커뮤니티",
    items: [{ key: "notice", title: "공지사항", href: "/community/notice" }],
  },
];
