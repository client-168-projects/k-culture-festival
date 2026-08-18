import { ScrollToTopButton } from "@/components/scroll-to-top-button";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { NoticePopupManager } from "@/features/notice-popup/components/notice-popup-manager";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-full flex-1 flex-col pt-16 sm:pt-24">
      <SiteHeader />
      {children}
      <SiteFooter />
      <ScrollToTopButton />
      <NoticePopupManager />
    </div>
  );
}
