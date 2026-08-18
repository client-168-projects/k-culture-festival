import type { Metadata } from "next";

import { NoticePopupsManager } from "@/components/admin/notice-popups-manager";
import { getNoticePopups } from "@/lib/notice-popups";

export const metadata: Metadata = {
  title: "팝업 관리",
};

export default async function AdminNoticePopupsPage() {
  const popups = await getNoticePopups();

  return <NoticePopupsManager popups={popups} />;
}
