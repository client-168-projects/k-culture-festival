import type { Metadata } from "next";

import { NoticesManager } from "@/components/admin/notices-manager";
import { getNotices } from "@/lib/notices";

export const metadata: Metadata = {
  title: "공지사항 관리",
};

export default async function AdminNoticesPage() {
  const notices = await getNotices();

  return <NoticesManager notices={notices} />;
}
