import sanitizeHtml from "sanitize-html";

const NOTICE_SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "p",
    "br",
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
  },
  allowedSchemes: ["http", "https", "mailto"],
};

export function sanitizeNoticeContent(html: string): string {
  return sanitizeHtml(html, NOTICE_SANITIZE_OPTIONS);
}
