import type { Metadata } from "next";

import { NoticeList } from "@/components/notice-list";
import { PageContainer, PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { createPageMetadata } from "@/lib/metadata";
import { getNotices } from "@/lib/notices";

export const metadata: Metadata = createPageMetadata({
  title: "공지사항",
  description: "파주 K-컬처 페스티벌 관련 공지사항을 확인하세요.",
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
            <p className="py-8 text-center text-muted-foreground">
              등록된 공지사항이 없습니다.
            </p>
          ) : (
            <NoticeList notices={notices} />
          )}
        </CardContent>
      </Card>
    </PageContainer>
  );
}
