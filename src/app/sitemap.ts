import type { MetadataRoute } from "next";

import { SITE_URL } from "@/constants/site";
import { getNotices } from "@/lib/notices";

const SITE_PATHS = [
  "/",
  "/about/overview",
  "/about/schedule",
  "/program/stage",
  "/program/experience",
  "/program/extra",
  "/venue/map",
  "/venue/directions",
  "/venue/shuttle",
  "/community/notice",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries = SITE_PATHS.map((path) => ({
    url: new URL(path, SITE_URL).toString(),
    lastModified: new Date(),
  }));

  const notices = await getNotices();
  const noticeEntries = notices.map((notice) => ({
    url: new URL(`/community/notice/${notice.id}`, SITE_URL).toString(),
    lastModified: new Date(notice.updated_at),
  }));

  return [...staticEntries, ...noticeEntries];
}
