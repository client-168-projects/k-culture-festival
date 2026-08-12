import type { Metadata } from "next";
import Image from "next/image";

import { PageContainer, PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createPageMetadata } from "@/lib/metadata";

const VENUE_NAME = "경기미래교육 파주캠퍼스";
const VENUE_LAT = 37.784985;
const VENUE_LNG = 126.703487;
const MAP_EMBED_SRC = `https://www.google.com/maps?q=${encodeURIComponent(VENUE_NAME)}&ll=${VENUE_LAT},${VENUE_LNG}&z=14&output=embed`;
const MAP_LINK_HREF =
  "https://www.google.com/maps/place/%EA%B2%BD%EA%B8%B0%EB%AF%B8%EB%9E%98%EA%B5%90%EC%9C%A1+%ED%8C%8C%EC%A3%BC%EC%BA%A0%ED%8D%BC%EC%8A%A4/@37.784985,126.703487,17z/data=!4m6!3m5!1s0x357c8d8c9c187319:0xbf4eb151274bf7d5!8m2!3d37.784985!4d126.703487!16s%2Fg%2F11j5jnrvk9";
const NAVER_MAP_HREF = `https://map.naver.com/p/search/${encodeURIComponent(VENUE_NAME)}`;
const KAKAO_MAP_HREF = `https://map.kakao.com/link/search/${encodeURIComponent(VENUE_NAME)}`;

export const metadata: Metadata = createPageMetadata({
  title: "오시는 길",
  description: "파주 K-컬처 페스티벌 행사장까지 오시는 대중교통, 주차, 셔틀버스 등 다양한 교통 방법을 안내합니다.",
  path: "/venue/directions",
});

type Route = { no: string; route: string };

const busRoutes: Route[] = [
  {
    no: "2200 (좌석버스)",
    route: "합정역(60분) - 출판단지(20분) - 경기미래교육캠퍼스",
  },
  {
    no: "900 (시내버스)",
    route:
      "일산현대백화점(80분) - 대화역(80분) - 금촌역(20분) - 경기미래교육캠퍼스",
  },
  {
    no: "033 (마을버스)",
    route: "금촌역(20분) - 문산제일고 - 경기미래교육캠퍼스 - 헤이리 - 탄현산업단지",
  },
  {
    no: "035 (마을버스)",
    route:
      "금촌역(20분) - 금촌로터리 - 성동사거리 - 경기미래교육캠퍼스 - 통일초교",
  },
  {
    no: "075 (마을버스)",
    route: "맥금동 - 경기미래교육캠퍼스 - 파주프리미엄아울렛 - 교하동우리은행",
  },
];

const subwayRoutes: Route[] = [
  {
    no: "금촌역 (파주, 경의중앙선)",
    route: "900, 033, 035 - 금촌역 1번출구 정류장",
  },
  { no: "대화역 (고양, 3호선)", route: "900 - 대화역 5번출구 정류장 승차" },
  { no: "합정역 (서울, 2·6호선)", route: "2200 - 합정역 1번출구 정류장 승차" },
];

const parkingText = [
  "파주 K-컬처 페스티벌 행사장 주차장이 협소하여 주차가 어려울 수 있습니다.",
  "방문객께서는 인근 통일동산 주차장을 이용해 주시기 바랍니다.",
  "내비게이션에서 '통일동산 주차장'을 검색하시면 보다 쉽게 찾아오실 수 있습니다.",
  "축제 기간 동안 통일동산 주차장 ↔ 파주 K-컬처 페스티벌 행사장(경기미래교육 파주캠퍼스)을 오가는 셔틀버스를 상시 운행합니다.",
];

function RouteList({ routes }: { routes: Route[] }) {
  return (
    <ul className="flex flex-col divide-y divide-border">
      {routes.map((route) => (
        <li
          key={route.no}
          className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0"
        >
          <span className="font-medium">{route.no}</span>
          <span className="text-sm text-muted-foreground">{route.route}</span>
        </li>
      ))}
    </ul>
  );
}

export default function DirectionsPage() {
  return (
    <PageContainer className="max-w-6xl">
      <PageHeader title="오시는 길" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start">
        <div className="flex flex-col gap-2">
          <div className="h-100 w-full overflow-hidden rounded-xl border border-border sm:h-120 lg:h-140">
            <iframe
              src={MAP_EMBED_SRC}
              title="경기미래교육 파주캠퍼스 위치 지도"
              className="size-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <Button variant="outline" size="sm" className="w-full sm:w-auto" asChild>
              <a href={MAP_LINK_HREF} target="_blank" rel="noopener noreferrer">
                <Image
                  src="/assets/logo/maps/google-maps.png"
                  alt=""
                  width={16}
                  height={16}
                  className="shrink-0"
                />
                <span className="truncate">Google 지도에서 크게 보기</span>
              </a>
            </Button>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button variant="outline" size="sm" className="w-full sm:w-auto" asChild>
                <a
                  href={NAVER_MAP_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src="/assets/logo/maps/naver-map.png"
                    alt=""
                    width={16}
                    height={16}
                    className="shrink-0"
                  />
                  <span className="truncate">네이버 지도에서 찾기</span>
                </a>
              </Button>
              <Button variant="outline" size="sm" className="w-full sm:w-auto" asChild>
                <a
                  href={KAKAO_MAP_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src="/assets/logo/maps/kakao-map.png"
                    alt=""
                    width={16}
                    height={16}
                    className="shrink-0 rounded-xs"
                  />
                  <span className="truncate">다음 지도에서 찾기</span>
                </a>
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>대중교통(버스) 이용 시</CardTitle>
            </CardHeader>
            <CardContent>
              <RouteList routes={busRoutes} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>대중교통(지하철) 이용 시</CardTitle>
            </CardHeader>
            <CardContent>
              <RouteList routes={subwayRoutes} />
            </CardContent>
          </Card>

          <Card className="border-brand-cobalt/25">
            <CardHeader>
              <CardTitle className="text-brand-cobalt">
                주차 및 셔틀버스 안내
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 text-sm text-muted-foreground">
              {parkingText.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
