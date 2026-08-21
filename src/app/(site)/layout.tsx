import { GoogleAnalytics } from "@/components/google-analytics";
import { ScrollToTopButton } from "@/components/scroll-to-top-button";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { NoticePopupManager } from "@/features/notice-popup/components/notice-popup-manager";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-full flex-1 flex-col pt-16 sm:pt-24">
      <GoogleAnalytics />
      <SiteHeader />
      {children}
      <SiteFooter />
      <ScrollToTopButton />
      <NoticePopupManager />
    </div>
  );
}
