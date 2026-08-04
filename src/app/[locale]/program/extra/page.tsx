import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { MediaPlaceholder } from "@/components/media-placeholder";
import { PageContainer, PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { assertLocale } from "@/i18n/utils";

type ExtraItem = { title: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  assertLocale(locale);
  const t = await getTranslations({ locale, namespace: "pages.extra" });

  return { title: t("title"), description: t("description") };
}

export default async function ExtraPage({
  params,
}: PageProps<"/[locale]/program/extra">) {
  const { locale } = await params;
  assertLocale(locale);
  setRequestLocale(locale);

  const t = await getTranslations("pages.extra");
  const items = t.raw("items") as ExtraItem[];

  return (
    <PageContainer className="max-w-5xl">
      <PageHeader title={t("title")} description={t("description")} />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div key={item.title} className="flex flex-col gap-3">
            <MediaPlaceholder label={item.title} className="aspect-square" />
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{t("alwaysOn")}</Badge>
              <p className="text-base">{item.title}</p>
            </div>
          </div>
        ))}
      </div>
    </PageContainer>
  );
}
