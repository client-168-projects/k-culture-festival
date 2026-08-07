import type { Metadata } from "next";

import { MediaPlaceholder } from "@/components/media-placeholder";
import { PageContainer, PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "체험 프로그램",
  description: "직접 참여할 수 있는 체험 프로그램을 안내합니다.",
};

const items = [
  {
    title: "K-공예 체험",
    duration: "30분",
    capacity: "1회 10명, 총 8회",
    reservable: false,
  },
  {
    title: "한복 포토존",
    duration: "상시운영",
    capacity: "제한 없음",
    reservable: false,
  },
  {
    title: "부채 만들기",
    duration: "20분",
    capacity: "1회 10명, 총 10회",
    reservable: false,
  },
  {
    title: "떡메치기 체험",
    duration: "15분",
    capacity: "1회 8명, 총 12회",
    reservable: false,
  },
  {
    title: "전통 다도 체험",
    duration: "20분",
    capacity: "1회 10명, 총 8회",
    reservable: false,
  },
  {
    title: "LED 슬라임 만들기",
    duration: "30분",
    capacity: "1회 10명, 총 8회",
    reservable: false,
  },
  {
    title: "캘리그라피 체험",
    duration: "20분",
    capacity: "1회 10명, 총 8회",
    reservable: false,
  },
  {
    title: "미니 화분 만들기",
    duration: "20분",
    capacity: "1회 10명, 총 8회",
    reservable: false,
  },
  {
    title: "냅킨아트 체험",
    duration: "20분",
    capacity: "1회 10명, 총 8회",
    reservable: false,
  },
  {
    title: "헤어 스타일링 체험",
    duration: "20분",
    capacity: "1회 6명, 총 10회",
    reservable: false,
  },
  {
    title: "K-분식 쿠킹클래스",
    duration: "40분",
    capacity: "1회 10명, 총 6회",
    reservable: true,
  },
  {
    title: "디저트 쿠킹클래스",
    duration: "40분",
    capacity: "1회 10명, 총 6회",
    reservable: true,
  },
];

export default function ExperiencePage() {
  return (
    <PageContainer className="max-w-5xl">
      <PageHeader
        title="체험 프로그램"
        description="직접 참여할 수 있는 체험 프로그램을 안내합니다."
      />

      <div className="grid gap-6 sm:grid-cols-[minmax(0,280px)_1fr] sm:items-center">
        <MediaPlaceholder label="체험존 안내" className="aspect-video w-full" />
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">체험존 안내</h2>
          <p className="text-muted-foreground">
            행사장 곳곳에 마련된 체험존에서 다양한 K-컬처 콘텐츠를
            즐겨보세요.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Card key={item.title}>
            <CardHeader>
              <CardTitle className="text-base">{item.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-1 text-sm text-muted-foreground">
              <span>소요시간 {item.duration}</span>
              <span>수용인원 {item.capacity}</span>
            </CardContent>
            {item.reservable ? (
              <CardFooter>
                <Button size="sm" variant="outline">
                  사전신청하러 가기
                </Button>
              </CardFooter>
            ) : null}
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
