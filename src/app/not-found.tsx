import { NotFoundContent } from "@/components/not-found-content";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function NotFound() {
  return (
    <div className="flex min-h-full flex-1 flex-col pt-16 sm:pt-24">
      <SiteHeader />
      <NotFoundContent />
      <SiteFooter />
    </div>
  );
}
