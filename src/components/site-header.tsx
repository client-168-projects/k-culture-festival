import { getLocale, getTranslations } from "next-intl/server";

import { HeaderBar, type NavSection } from "@/components/header-bar";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { navSections } from "@/config/nav";

type CategoryMessages = Record<
  string,
  { title: string; items: Record<string, string> }
>;

export async function SiteHeader() {
  const t = await getTranslations("nav");
  const locale = await getLocale();
  const messages = (await import(`../../messages/${locale}.json`)).default;
  const categories = messages.nav.categories as CategoryMessages;

  const sections: NavSection[] = navSections.map((section) => ({
    key: section.key,
    title: categories[section.key].title,
    items: section.items.map((item) => ({
      key: item,
      title: categories[section.key].items[item],
      href: `/${section.key}/${item}`,
    })),
  }));

  return (
    <HeaderBar title={t("title")} sections={sections} menuLabel={t("menu")}>
      <LocaleSwitcher />
      <ThemeToggle />
    </HeaderBar>
  );
}
