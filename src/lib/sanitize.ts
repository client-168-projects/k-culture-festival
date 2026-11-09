import sanitizeHtml from "sanitize-html";

import { STORAGE_BUCKET } from "@/lib/supabase";

// 브라우저가 hex 색상을 rgb()로 바꿔 저장하므로 둘 다 허용
const COLOR_VALUE = [
  /^#[0-9a-f]{3,8}$/i,
  /^rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)$/,
  /^rgba\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*[\d.]+\s*\)$/,
  /^inherit$/,
];
const TEXT_ALIGN = [/^(left|center|right)$/];
const FONT_SIZE = [/^\d{1,3}px$/];
// 에디터 폰트 목록에 있는 값만 허용
const FONT_FAMILY = [
  /^serif$/,
  /^var\(--font-geist-mono\),\s*monospace$/,
];

// 본문 이미지는 자체 Storage 버킷 주소만 허용
function isAllowedImageSrc(src: string): boolean {
  const supabaseUrl = process.env.SUPABASE_URL;
  if (!supabaseUrl) return false;
  return src.startsWith(`${supabaseUrl}/storage/v1/object/public/${STORAGE_BUCKET}/images/`);
}

function buildSanitizeOptions(): sanitizeHtml.IOptions {
  return {
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
      "img",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      span: ["style"],
      mark: ["style", "data-color"],
      p: ["style"],
      h2: ["style"],
      h3: ["style"],
      img: ["src", "alt", "width", "height"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    allowedStyles: {
      "*": {
        color: COLOR_VALUE,
        "background-color": COLOR_VALUE,
        "text-align": TEXT_ALIGN,
        "font-size": FONT_SIZE,
        "font-family": FONT_FAMILY,
      },
    },
    // 새 창 링크에 rel을 붙여 열린 페이지가 window.opener에 접근하지 못하게 한다.
    transformTags: {
      a: (tagName, attribs) => {
        const next = { ...attribs };
        if (next.target) {
          next.target = "_blank";
          next.rel = "noopener noreferrer";
        } else {
          delete next.rel;
        }
        return { tagName, attribs: next };
      },
    },
    exclusiveFilter: (frame) =>
      frame.tag === "img" && !isAllowedImageSrc(frame.attribs.src ?? ""),
  };
}

export function sanitizeNoticeContent(html: string): string {
  return sanitizeHtml(html, buildSanitizeOptions());
}
