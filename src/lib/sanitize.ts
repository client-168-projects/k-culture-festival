import sanitizeHtml from "sanitize-html";

import { STORAGE_BUCKET } from "@/lib/supabase";

// 브라우저가 인라인 style을 직렬화할 때 hex 값을 rgb()/rgba()로 정규화하므로 둘 다 허용해야 한다.
const COLOR_VALUE = [
  /^#[0-9a-f]{3,8}$/i,
  /^rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)$/,
  /^rgba\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*[\d.]+\s*\)$/,
  /^inherit$/,
];
const TEXT_ALIGN = [/^(left|center|right)$/];
const FONT_SIZE = [/^\d{1,3}px$/];
// 에디터 폰트 목록(기본/명조체/고정폭)에서 나오는 값만 허용한다.
const FONT_FAMILY = [
  /^serif$/,
  /^var\(--font-geist-mono\),\s*monospace$/,
];

/** 에디터에 삽입되는 이미지는 우리 Supabase Storage 버킷에서 온 것만 허용한다 (임의 URL 임베드/추적픽셀 방지). */
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
    exclusiveFilter: (frame) =>
      frame.tag === "img" && !isAllowedImageSrc(frame.attribs.src ?? ""),
  };
}

export function sanitizeNoticeContent(html: string): string {
  return sanitizeHtml(html, buildSanitizeOptions());
}
