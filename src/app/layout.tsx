import type { Metadata, Viewport } from "next";
import { Black_Han_Sans, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";

import { JsonLd } from "@/components/json-ld";
import { SITE_THEME_COLOR } from "@/constants/site";
import { rootMetadata } from "@/lib/metadata";
import { buildOrganizationJsonLd, buildWebSiteJsonLd } from "@/lib/structured-data";

import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const blackHanSans = Black_Han_Sans({
  variable: "--font-black-han-sans",
  subsets: ["latin"],
  weight: "400",
});

const pretendard = localFont({
  src: "../../public/fonts/pretendard/PretendardVariable.woff2",
  variable: "--font-pretendard",
  weight: "45 920",
  display: "swap",
});

export const metadata: Metadata = rootMetadata;

export const viewport: Viewport = {
  themeColor: SITE_THEME_COLOR,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      className={`${geistMono.variable} ${blackHanSans.variable} ${pretendard.variable} h-full antialiased`}
    >
      <head>
        <JsonLd data={[buildWebSiteJsonLd(), buildOrganizationJsonLd()]} />
      </head>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
