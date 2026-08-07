import sanitizeHtml from "sanitize-html";

// 브라우저가 인라인 style을 직렬화할 때 hex 값을 rgb()/rgba()로 정규화하므로 둘 다 허용해야 한다.
const COLOR_VALUE = [
  /^#[0-9a-f]{3,8}$/i,
  /^rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)$/,
  /^rgba\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*[\d.]+\s*\)$/,
  /^inherit$/,
];
const TEXT_ALIGN = [/^(left|center|right)$/];

const NOTICE_SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "p",
    "br",
    "span",
    "mark",
    "strong",
    "em",
    "u",
    "s",
    "a",
    "ul",
    "ol",
    "li",
    "h2",
    "h3",
    "blockquote",
  ],
  allowedAttributes: {
    a: ["href", "target", "rel"],
    span: ["style"],
    mark: ["style", "data-color"],
    p: ["style"],
    h2: ["style"],
    h3: ["style"],
  },
  allowedSchemes: ["http", "https", "mailto"],
  allowedStyles: {
    "*": {
      color: COLOR_VALUE,
      "background-color": COLOR_VALUE,
      "text-align": TEXT_ALIGN,
    },
  },
};

export function sanitizeNoticeContent(html: string): string {
  return sanitizeHtml(html, NOTICE_SANITIZE_OPTIONS);
}
