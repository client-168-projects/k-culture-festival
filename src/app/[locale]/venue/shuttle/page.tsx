import { Bus } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { PageContainer, PageHeader } from "@/components/page-header";
import { assertLocale } from "@/i18n/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  assertLocale(locale);
  const t = await getTranslations({ locale, namespace: "pages.shuttle" });

  return { title: t("title"), description: t("description") };
}

export default async function ShuttlePage({
  params,
}: PageProps<"/[locale]/venue/shuttle">) {
  const { locale } = await params;
  assertLocale(locale);
  setRequestLocale(locale);

  const t = await getTranslations("pages.shuttle");

  return (
    <PageContainer>
      <PageHeader title={t("title")} description={t("description")} />

      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-muted py-16 text-center">
        <Bus className="size-8 text-muted-foreground" />
        <p className="text-muted-foreground">{t("tbd")}</p>
      </div>
    </PageContainer>
  );
}
