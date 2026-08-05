import { Phone } from "lucide-react";
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

  return (
    <footer className="border-t border-border">
      <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-10 px-4 py-10 sm:px-6 sm:py-12 md:grid-cols-3">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-lg font-semibold">{t("footer.brand")}</span>
            <p className="max-w-xs text-sm text-muted-foreground">
              {t("footer.description")}
            </p>
          </div>

          <div className="flex items-center gap-3">
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

        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold">
            {t("footer.infoTitle")}
          </span>
          <dl className="flex flex-col gap-1 text-sm text-muted-foreground">
            <div className="flex gap-2">
              <dt className="shrink-0">{t("footer.venueLabel")}</dt>
              <dd>{t("footer.venue")}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="shrink-0">{t("footer.addressLabel")}</dt>
              <dd>{t("footer.address")}</dd>
            </div>
          </dl>
          <a
            href={`tel:${t("footer.phone")}`}
            className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <Phone className="size-3.5" />
            {t("footer.phone")}
          </a>
        </div>

        <div className="flex flex-col gap-2 md:items-end md:text-right">
          <span className="text-sm font-semibold">
            {t("footer.linksTitle")}
          </span>
          <nav className="flex flex-col gap-1 md:items-end">
            {navSections.map((section) => (
              <Link
                key={section.key}
                href={`/${section.key}/${section.items[0]}`}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {categories[section.key].title}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="border-t border-border px-4 py-4 sm:px-6">
        <p className="mx-auto max-w-5xl text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} {t("footer.rights")}
        </p>
      </div>
    </footer>
  );
}
