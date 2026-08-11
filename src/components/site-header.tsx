import { HeaderBar } from "@/components/header-bar";
import { navSections } from "@/config/nav";

export function SiteHeader() {
  return (
    <HeaderBar
      title="K-Culture Festival"
      sections={navSections}
      menuLabel="메뉴"
    />
  );
}
