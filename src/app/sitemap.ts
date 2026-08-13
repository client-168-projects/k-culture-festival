import type { MetadataRoute } from "next";

import { SITE_URL } from "@/constants/site";

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

export default function sitemap(): MetadataRoute.Sitemap {
  return SITE_PATHS.map((path) => ({
    url: new URL(path, SITE_URL).toString(),
    lastModified: new Date(),
  }));
}
