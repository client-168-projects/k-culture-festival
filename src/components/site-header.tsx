import { HeaderBar } from "@/components/header-bar";
import { ThemeToggle } from "@/components/theme-toggle";
import { navSections } from "@/config/nav";

export function SiteHeader() {
  return (
    <HeaderBar
      title="K-Culture Festival"
      sections={navSections}
      menuLabel="메뉴"
    >
      <ThemeToggle />
    </HeaderBar>
  );
}
