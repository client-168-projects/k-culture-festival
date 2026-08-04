import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { PageContainer, PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { assertLocale } from "@/i18n/utils";

type NoticeItem = { date: string; title: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  assertLocale(locale);
  const t = await getTranslations({ locale, namespace: "pages.notice" });

  return { title: t("title"), description: t("description") };
}

export default async function NoticePage({
  params,
}: PageProps<"/[locale]/community/notice">) {
  const { locale } = await params;
  assertLocale(locale);
  setRequestLocale(locale);

  const t = await getTranslations("pages.notice");
  const items = t.raw("items") as NoticeItem[];

  return (
    <PageContainer>
      <PageHeader title={t("title")} description={t("description")} />

      <Card>
        <CardContent>
          <ul className="flex flex-col divide-y divide-border">
            {items.map((item) => (
              <li
                key={item.title}
                className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
              >
                <span className="text-base">{item.title}</span>
                <span className="shrink-0 font-mono text-sm text-muted-foreground">
                  {item.date}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
