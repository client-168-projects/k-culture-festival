import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { PageContainer, PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { assertLocale } from "@/i18n/utils";

type ScheduleItem = { time: string; title: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  assertLocale(locale);
  const t = await getTranslations({ locale, namespace: "pages.schedule" });

  return { title: t("title"), description: t("description") };
}

export default async function SchedulePage({
  params,
}: PageProps<"/[locale]/about/schedule">) {
  const { locale } = await params;
  assertLocale(locale);
  setRequestLocale(locale);

  const t = await getTranslations("pages.schedule");
  const items = t.raw("items") as ScheduleItem[];

  return (
    <PageContainer>
      <PageHeader title={t("title")} description={t("description")} />

      <Card>
        <CardContent>
          <ol className="flex flex-col divide-y divide-border">
            {items.map((item) => (
              <li
                key={item.time}
                className="flex items-baseline gap-4 py-3 first:pt-0 last:pb-0"
              >
                <span className="w-16 shrink-0 font-mono text-sm text-muted-foreground">
                  {item.time}
                </span>
                <span className="text-base">{item.title}</span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <Button variant="outline" className="self-start">
        {t("downloadLeaflet")}
      </Button>
    </PageContainer>
  );
}
