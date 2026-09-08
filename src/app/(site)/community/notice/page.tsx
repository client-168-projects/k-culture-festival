import type { Metadata } from "next";

import { NoticeList } from "@/components/notice-list";
import { PageContainer, PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { createPageMetadata } from "@/lib/metadata";
import { getNotices } from "@/lib/notices";

export const metadata: Metadata = createPageMetadata({
  title: "공지사항",
  description: "파주k-컬처페스티벌 관련 공지사항을 확인하세요.",
  path: "/community/notice",
});

export default async function NoticePage() {
  const notices = await getNotices();

  return (
    <PageContainer>
      <PageHeader title="공지사항" />

      <Card>
        <CardContent>
          {notices.length === 0 ? (
            <EmptyState message="등록된 공지사항이 없습니다." />
          ) : (
            <NoticeList notices={notices} />
          )}
        </CardContent>
      </Card>
    </PageContainer>
  );
}
