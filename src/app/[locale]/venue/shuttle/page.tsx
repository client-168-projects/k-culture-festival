import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { PagePlaceholder } from "@/components/page-placeholder";
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

  return <PagePlaceholder title={t("title")} description={t("description")} />;
}
