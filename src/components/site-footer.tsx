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
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-10 sm:px-6 sm:py-12 md:flex-row md:justify-between">
        <div className="flex flex-col gap-2">
          <span className="text-lg font-semibold">{t("nav.title")}</span>
          <p className="max-w-xs text-sm text-muted-foreground">
            {t("footer.description")}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold">{t("footer.linksTitle")}</span>
          <nav className="flex flex-col gap-1">
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

        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold">{t("footer.contactTitle")}</span>
          <div className="flex flex-col gap-1 text-sm text-muted-foreground">
            <span>{t("footer.address")}</span>
            <span>{t("footer.email")}</span>
            <span>{t("footer.phone")}</span>
          </div>
        </div>
      </div>

      <div className="border-t border-border px-4 py-4 sm:px-6">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} {t("footer.rights")}
        </p>
      </div>
    </footer>
  );
}
