import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { MediaPlaceholder } from "@/components/media-placeholder";
import { PageContainer, PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { assertLocale } from "@/i18n/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  assertLocale(locale);
  const t = await getTranslations({ locale, namespace: "pages.overview" });

  return { title: t("title"), description: t("description") };
}

export default async function OverviewPage({
  params,
}: PageProps<"/[locale]/about/overview">) {
  const { locale } = await params;
  assertLocale(locale);
  setRequestLocale(locale);

  const t = await getTranslations("pages.overview");

  const info = [
    { label: t("nameLabel"), value: t("name") },
    { label: t("periodLabel"), value: t("period") },
    { label: t("placeLabel"), value: t("place") },
  ];

  return (
    <PageContainer>
      <PageHeader title={t("title")} description={t("description")} />

      <div className="grid gap-6 sm:grid-cols-[minmax(0,220px)_1fr]">
        <MediaPlaceholder
          label={t("posterAlt")}
          className="aspect-3/4 w-full"
        />

        <div className="flex flex-col gap-6">
          <Card>
            <CardContent className="flex flex-col gap-3">
              <h2 className="text-lg font-semibold">{t("infoTitle")}</h2>
              <dl className="flex flex-col gap-2">
                {info.map((item) => (
                  <div key={item.label} className="flex gap-3 text-base">
                    <dt className="w-16 shrink-0 text-muted-foreground">
                      {item.label}
                    </dt>
                    <dd>{item.value}</dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold">{t("introTitle")}</h2>
            <p className="text-muted-foreground">{t("intro")}</p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
