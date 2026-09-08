import { Download } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";

import { ImageModal } from "@/components/image-modal";
import { PageContainer, PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createPageMetadata } from "@/lib/metadata";

const POSTER_SRC = "/assets/poster/파주-k-컬처-페스티벌-포스터jpg.jpg";

const LEAFLET_DOWNLOADS = [
  { href: "/assets/images/main/leaflet-1.jpg", label: "리플렛 다운로드(축제정보)" },
  { href: "/assets/images/main/leaflet-2.jpg", label: "리플렛 다운로드(행사장 안내)" },
];

export const metadata: Metadata = createPageMetadata({
  title: "축제개요",
  description:
    "파주K-컬처페스티벌의 취지와 주요 특징을 소개합니다. 일시, 장소 등 축제 정보를 확인하세요.",
  path: "/about/overview",
});

const info = [
  { label: "명칭", value: "파주K-컬처페스티벌" },
  { label: "기간", value: "2026년 9월 12일(토)" },
  { label: "장소", value: "경기미래교육파주캠퍼스" },
];

export default function OverviewPage() {
  return (
    <PageContainer>
      <PageHeader title="축제개요" />

      <div className="grid gap-6 sm:grid-cols-[minmax(0,360px)_1fr]">
        <ImageModal
          src={POSTER_SRC}
          alt="파주K-컬처페스티벌 포스터"
          width={485}
          height={843}
        >
          <button
            type="button"
            className="relative mx-auto aspect-485/843 w-full max-w-xs cursor-zoom-in overflow-hidden border border-border bg-muted p-3 sm:mx-0 sm:max-w-none"
          >
            <Image
              src={POSTER_SRC}
              alt="파주k-컬처페스티벌 포스터"
              fill
              priority
              className="object-contain"
              sizes="(min-width: 640px) 360px, 100vw"
            />
          </button>
        </ImageModal>

        <div className="flex h-full flex-col gap-8">
          <Card variant="borderless">
            <CardContent className="flex flex-col gap-4">
              <h2 className="text-lg font-semibold">축제 정보</h2>
              <dl className="flex flex-col gap-3">
                {info.map((item) => (
                  <div key={item.label} className="flex gap-3 text-base">
                    <dt className="w-16 shrink-0 text-muted-foreground">
                      {item.label}
                    </dt>
                    <dd>{item.value}</dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>

          <Card variant="borderless" className="flex-1">
            <CardContent className="flex h-full flex-col justify-center gap-5">
              <h2 className="text-lg font-semibold">축제 소개</h2>
              <p className="leading-loose text-muted-foreground">
                &apos;파주k-컬처페스티벌&apos;은 다양한 K-콘텐츠 촬영명소로
                알려진 경기미래교육파주캠퍼스(구 파주 영어마을)에서 진행하는
                K-컬처 종합문화예술축제입니다.
              </p>
              <p className="leading-loose text-muted-foreground">
                K-팝 가수의 공연, K-문화를 경험할 수 있는 다채로운 체험
                프로그램과 먹거리를 한번에 즐길 수 있습니다.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        {LEAFLET_DOWNLOADS.map(({ href, label }) => (
          <Button key={href} asChild variant="outline">
            <a href={href} download>
              <Download className="size-4" />
              {label}
            </a>
          </Button>
        ))}
      </div>
    </PageContainer>
  );
}
