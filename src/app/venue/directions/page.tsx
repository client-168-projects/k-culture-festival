import type { Metadata } from "next";

import { MediaPlaceholder } from "@/components/media-placeholder";
import { PageContainer, PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "오시는 길",
  description: "행사장까지 오시는 다양한 교통 방법을 안내합니다.",
};

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

const carText = [
  "자유로를 타고 성동IC에서 나와 약 1.6km를 이정표를 따라 직진(성동사거리를 지남)한 후 헤이리사거리에서 좌회전하여 약 500m 지점에 위치합니다.",
  "서울외곽순환도로 이용 시 자유로분기점에서 '문산, 킨텍스' 방면으로 자유로를 따라 약 27km를 직진하시면 성동IC가 나옵니다.",
  "내비게이션에 '경기미래교육캠퍼스'로 검색하시면 쉽게 찾을 수 있습니다.",
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
    <PageContainer className="max-w-4xl">
      <PageHeader
        title="오시는 길"
        description="행사장까지 오시는 다양한 교통 방법을 안내합니다."
      />

      <MediaPlaceholder label="오시는 길 지도" className="aspect-video w-full" />

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

      <Card>
        <CardHeader>
          <CardTitle>자차 이용 시</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 text-sm text-muted-foreground">
          {carText.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </CardContent>
      </Card>
    </PageContainer>
  );
}
