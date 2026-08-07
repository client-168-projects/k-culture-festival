import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-full flex-1 flex-col pt-20 sm:pt-24">
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  );
}
