import { MapPin, Phone } from "lucide-react";
import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";

import { navSections } from "@/config/nav";
import { Link } from "@/i18n/navigation";

type CategoryMessages = Record<
  string,
  { title: string; items: Record<string, string> }
>;

export async function SiteFooter() {
  const t = await getTranslations();
  const locale = await getLocale();
  const messages = (await import(`../../messages/${locale}.json`)).default;
  const categories = messages.nav.categories as CategoryMessages;
  const phoneHref = t("footer.phone").replace(/[^+\d]/g, "");

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex w-full max-w-300 flex-col gap-8 px-4 py-10 sm:px-6 sm:py-12 lg:flex-row lg:justify-between lg:gap-16">
        <div className="flex flex-col gap-4 border-b border-border pb-8 lg:max-w-xs lg:border-b-0 lg:pb-0">
          <div className="flex flex-col gap-2">
            <span className="text-lg font-bold">{t("footer.brand")}</span>
            <p className="text-sm text-muted-foreground">
              {t("footer.description")}
            </p>
            <span className="text-sm font-semibold text-primary">
              {t("footer.period")}
            </span>
          </div>

          <div className="flex items-center justify-center gap-3 lg:justify-start">
            <span className="text-sm text-muted-foreground">
              {t("footer.organizerLabel")}
            </span>
            <a
              href="https://www.gill.or.kr"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center rounded-lg bg-white px-3 py-2 transition-opacity hover:opacity-80"
            >
              <Image
                src="/assets/logo/gyungi-institute-lifelong-learning-logo.png"
                alt={t("footer.organizerLogoAlt")}
                width={288}
                height={80}
                className="h-9 w-auto sm:h-10"
              />
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-b border-border pb-8 lg:border-b-0 lg:pb-0">
          <span className="flex items-center gap-1.5 text-lg font-bold">
            <MapPin className="size-4 text-primary" />
            {t("footer.infoTitle")}
          </span>
          <dl className="flex flex-col gap-2 text-sm text-muted-foreground">
            <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
              <dt className="shrink-0 sm:w-10">{t("footer.venueLabel")}</dt>
              <dd>{t("footer.venue")}</dd>
            </div>
            <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
              <dt className="shrink-0 sm:w-10">{t("footer.addressLabel")}</dt>
              <dd>{t("footer.address")}</dd>
            </div>
          </dl>

          <a
            href={`tel:${phoneHref}`}
            className="hidden items-center gap-1.5 text-sm font-semibold text-primary hover:underline sm:flex"
          >
            <Phone className="size-3.5" />
            {t("footer.phone")}
          </a>
          <a
            href={`tel:${phoneHref}`}
            className="flex items-center justify-center gap-2 rounded-md border border-border py-2.5 text-sm font-semibold text-primary sm:hidden"
          >
            <Phone className="size-4" />
            {t("footer.callCta")}
          </a>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-lg font-bold">{t("footer.linksTitle")}</span>
          <nav className="grid grid-cols-2 gap-x-6 gap-y-2 sm:flex sm:flex-col sm:gap-1.5">
            {navSections.map((section) => (
              <Link
                key={section.key}
                href={`/${section.key}/${section.items[0]}`}
                className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
              >
                {categories[section.key].title}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="border-t border-border px-4 py-4 sm:px-6">
        <p className="mx-auto max-w-300 text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} {t("footer.rights")}
        </p>
      </div>
    </footer>
  );
}
