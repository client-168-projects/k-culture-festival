import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { MediaPlaceholder } from "@/components/media-placeholder";
import { PageContainer, PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { assertLocale } from "@/i18n/utils";

type Route = { no: string; route: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  assertLocale(locale);
  const t = await getTranslations({ locale, namespace: "pages.directions" });

  return { title: t("title"), description: t("description") };
}

function RouteList({ routes }: { routes: Route[] }) {
  return (
    <ul className="flex flex-col divide-y divide-border">
      {routes.map((route) => (
        <li key={route.no} className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0">
          <span className="font-medium">{route.no}</span>
          <span className="text-sm text-muted-foreground">{route.route}</span>
        </li>
      ))}
    </ul>
  );
}

export default async function DirectionsPage({
  params,
}: PageProps<"/[locale]/venue/directions">) {
  const { locale } = await params;
  assertLocale(locale);
  setRequestLocale(locale);

  const t = await getTranslations("pages.directions");
  const busRoutes = t.raw("busRoutes") as Route[];
  const subwayRoutes = t.raw("subwayRoutes") as Route[];
  const carText = t.raw("carText") as string[];

  return (
    <PageContainer className="max-w-4xl">
      <PageHeader title={t("title")} description={t("description")} />

      <MediaPlaceholder label={t("mapAlt")} className="aspect-video w-full" />

      <Card>
        <CardHeader>
          <CardTitle>{t("busTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <RouteList routes={busRoutes} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("subwayTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <RouteList routes={subwayRoutes} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("carTitle")}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 text-sm text-muted-foreground">
          {carText.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </CardContent>
      </Card>
    </PageContainer>
  );
}
