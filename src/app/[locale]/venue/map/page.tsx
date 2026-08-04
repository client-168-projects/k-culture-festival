import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { MediaPlaceholder } from "@/components/media-placeholder";
import { PageContainer, PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { assertLocale } from "@/i18n/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  assertLocale(locale);
  const t = await getTranslations({ locale, namespace: "pages.map" });

  return { title: t("title"), description: t("description") };
}

export default async function MapPage({
  params,
}: PageProps<"/[locale]/venue/map">) {
  const { locale } = await params;
  assertLocale(locale);
  setRequestLocale(locale);

  const t = await getTranslations("pages.map");

  return (
    <PageContainer className="max-w-4xl">
      <PageHeader title={t("title")} description={t("description")} />

      <MediaPlaceholder label={t("mapAlt")} className="aspect-video w-full" />

      <Button variant="outline" className="self-start">
        {t("download")}
      </Button>
    </PageContainer>
  );
}
