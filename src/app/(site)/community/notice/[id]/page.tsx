import { ArrowLeft, Download, FileText } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { NoticeShareButton } from "@/components/notice-share-button";
import { PageContainer } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createPageMetadata } from "@/lib/metadata";
import { getNoticeById } from "@/lib/notices";
import { formatFileSize } from "@/lib/utils";

type NoticeDetailPageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({
  params,
}: NoticeDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const notice = await getNoticeById(Number(id));

  if (!notice) {
    return createPageMetadata({
      title: "공지사항",
      description: "파주 K-컬처 페스티벌 관련 공지사항을 확인하세요.",
      path: `/community/notice/${id}`,
    });
  }

  return createPageMetadata({
    title: notice.title,
    description: `파주 K-컬처 페스티벌 공지사항: ${notice.title}`,
    path: `/community/notice/${notice.id}`,
  });
}

export default async function NoticeDetailPage({
  params,
}: NoticeDetailPageProps) {
  const { id } = await params;
  const notice = await getNoticeById(Number(id));

  if (!notice) {
    notFound();
  }

  return (
    <PageContainer>
      <Link
        href="/community/notice"
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        목록으로
      </Link>

      <Card>
        <CardContent className="flex flex-col gap-6">
          <div className="flex flex-col gap-2 border-b border-border pb-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h1 className="font-heading text-xl font-bold tracking-tight sm:text-2xl">
                {notice.title}
              </h1>
              <NoticeShareButton title={notice.title} />
            </div>
            <span className="font-mono text-sm text-muted-foreground">
              {notice.created_at.slice(0, 10)}
            </span>
          </div>

          <div
            className="tiptap-content text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: notice.content }}
          />

          {notice.attachments.length > 0 ? (
            <ul className="flex flex-col gap-1 border-t border-border pt-4">
              {notice.attachments.map((attachment) => (
                <li
                  key={attachment.id}
                  className="flex items-center justify-between gap-3 rounded-md bg-muted px-2.5 py-1 text-xs"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <FileText className="size-3.5 shrink-0 text-muted-foreground" />
                    <span className="truncate">{attachment.file_name}</span>
                    <span className="shrink-0 text-muted-foreground">
                      ({formatFileSize(attachment.file_size)})
                    </span>
                  </span>
                  <Button
                    asChild
                    variant="subtle"
                    size="sm"
                    className="h-6 shrink-0 gap-1 px-2"
                  >
                    <a
                      href={`${attachment.file_url}?download=${encodeURIComponent(attachment.file_name)}`}
                    >
                      <Download className="size-3.5" />
                      다운로드
                    </a>
                  </Button>
                </li>
              ))}
            </ul>
          ) : null}
        </CardContent>
      </Card>
    </PageContainer>
  );
}
