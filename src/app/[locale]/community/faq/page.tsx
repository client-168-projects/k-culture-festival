import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PageContainer, PageHeader } from "@/components/page-header";
import { assertLocale } from "@/i18n/utils";

type FaqItem = { q: string; a: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  assertLocale(locale);
  const t = await getTranslations({ locale, namespace: "pages.faq" });

  return { title: t("title"), description: t("description") };
}

export default async function FaqPage({
  params,
}: PageProps<"/[locale]/community/faq">) {
  const { locale } = await params;
  assertLocale(locale);
  setRequestLocale(locale);

  const t = await getTranslations("pages.faq");
  const items = t.raw("items") as FaqItem[];

  return (
    <PageContainer>
      <PageHeader title={t("title")} description={t("description")} />

      <Accordion type="single" collapsible>
        {items.map((item) => (
          <AccordionItem key={item.q} value={item.q}>
            <AccordionTrigger>{item.q}</AccordionTrigger>
            <AccordionContent>{item.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </PageContainer>
  );
}
