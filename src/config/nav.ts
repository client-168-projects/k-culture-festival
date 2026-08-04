export const navSections = [
  {
    key: "about",
    items: ["overview", "schedule"],
  },
  {
    key: "program",
    items: ["stage", "experience", "extra"],
  },
  {
    key: "venue",
    items: ["map", "directions", "shuttle"],
  },
  {
    key: "community",
    items: ["notice", "faq"],
  },
] as const;

export type NavSectionKey = (typeof navSections)[number]["key"];
