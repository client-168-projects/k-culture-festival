import { MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { navSections } from "@/config/nav";

const PHONE = "031-956-2497";
const PHONE_HREF = PHONE.replace(/[^+\d]/g, "");

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex w-full max-w-300 flex-col gap-8 px-4 py-10 sm:px-6 sm:py-12 lg:flex-row lg:justify-between lg:gap-16">
        <div className="flex flex-col gap-4 border-b border-border pb-8 lg:max-w-xs lg:border-b-0 lg:pb-0">
          <div className="flex flex-col gap-2">
            <span className="text-lg font-bold">파주 K-컬처 페스티벌</span>
          </div>

          <div className="flex flex-nowrap items-center justify-center gap-3 lg:justify-start">
            <span className="text-xs font-medium text-muted-foreground">
              주최·주관
            </span>
            <span className="flex items-center rounded-lg border border-border bg-white px-3 py-2">
              <Image
                src="/assets/logo/gyungi-logo.png"
                alt="경기도 로고"
                width={172}
                height={106}
                className="h-8 w-auto sm:h-9"
              />
            </span>
            <a
              href="https://www.gill.or.kr"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center rounded-lg border border-border bg-white px-3 py-2 transition-opacity hover:opacity-80"
            >
              <Image
                src="/assets/logo/gyungi-institute-lifelong-learning-logo.png"
                alt="경기도평생교육진흥원 로고"
                width={288}
                height={80}
                className="h-8 w-auto sm:h-9"
              />
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-b border-border pb-8 lg:border-b-0 lg:pb-0">
          <span className="flex items-center gap-1.5 text-lg font-bold">
            <MapPin className="size-4 text-primary" />
            오시는 곳
          </span>
          <dl className="flex flex-col gap-2 text-sm text-muted-foreground">
            <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
              <dt className="shrink-0 sm:w-10">장소</dt>
              <dd>경기미래교육 파주캠퍼스</dd>
            </div>
            <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
              <dt className="shrink-0 sm:w-10">주소</dt>
              <dd>경기도 파주시 탄현면 얼음실로 40 경기미래교육 파주캠퍼스</dd>
            </div>
          </dl>

          <a
            href={`tel:${PHONE_HREF}`}
            className="hidden items-center gap-1.5 text-sm font-semibold text-primary hover:underline sm:flex"
          >
            <Phone className="size-3.5" />
            {PHONE}
          </a>
          <a
            href={`tel:${PHONE_HREF}`}
            className="flex items-center justify-center gap-2 rounded-md border border-border py-2.5 text-sm font-semibold text-primary sm:hidden"
          >
            <Phone className="size-4" />
            전화하기
          </a>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-lg font-bold">바로가기</span>
          <nav className="grid grid-cols-2 gap-x-6 gap-y-2 sm:flex sm:flex-col sm:gap-1.5">
            {navSections.map((section) => (
              <Link
                key={section.key}
                href={section.items[0].href}
                className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
              >
                {section.title}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="border-t border-border px-4 py-4 sm:px-6">
        <p className="mx-auto max-w-300 text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} K-Culture Festival. ALL RIGHTS
          RESERVED
        </p>
      </div>
    </footer>
  );
}
