import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { MediaPlaceholder } from "@/components/media-placeholder";
import { PageContainer, PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { assertLocale } from "@/i18n/utils";

type ExperienceItem = {
  title: string;
  duration: string;
  capacity: string;
  reservable: boolean;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  assertLocale(locale);
  const t = await getTranslations({ locale, namespace: "pages.experience" });

  return { title: t("title"), description: t("description") };
}

export default async function ExperiencePage({
  params,
}: PageProps<"/[locale]/program/experience">) {
  const { locale } = await params;
  assertLocale(locale);
  setRequestLocale(locale);

  const t = await getTranslations("pages.experience");
  const items = t.raw("items") as ExperienceItem[];

  return (
    <PageContainer className="max-w-5xl">
      <PageHeader title={t("title")} description={t("description")} />

      <div className="grid gap-6 sm:grid-cols-[minmax(0,280px)_1fr] sm:items-center">
        <MediaPlaceholder label={t("zoneTitle")} className="aspect-video w-full" />
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">{t("zoneTitle")}</h2>
          <p className="text-muted-foreground">{t("zoneDescription")}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Card key={item.title}>
            <CardHeader>
              <CardTitle className="text-base">{item.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-1 text-sm text-muted-foreground">
              <span>
                {t("durationLabel")} {item.duration}
              </span>
              <span>
                {t("capacityLabel")} {item.capacity}
              </span>
            </CardContent>
            {item.reservable ? (
              <CardFooter>
                <Button size="sm" variant="outline">
                  {t("reserveCta")}
                </Button>
              </CardFooter>
            ) : null}
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
