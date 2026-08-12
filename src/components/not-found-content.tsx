import { Home } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { BackButton } from "@/components/back-button";
import { PageContainer } from "@/components/page-header";
import { Button } from "@/components/ui/button";

export function NotFoundContent() {
  return (
    <PageContainer className="max-w-5xl flex-col items-center gap-10 py-16 text-center sm:py-24 lg:flex-row lg:items-center lg:justify-between lg:gap-16 lg:text-left">
      <div className="flex flex-col items-center lg:items-start">
        <p className="text-shadow-poster font-heading text-[clamp(6rem,16vw,11rem)] leading-none text-brand-indigo">
          404
        </p>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          페이지를 찾을 수 없어요.
        </h1>
        <p className="mt-3 max-w-sm text-muted-foreground">
          요청하신 페이지가 사라졌거나, 잘못된 주소를 입력하셨어요. 메인
          페이지로 돌어가서 다양한 K-컬처 축제를 만나보세요!
        </p>
        <div className="mt-6 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Button
            asChild
            size="lg"
            className="bg-brand-vermillion text-brand-paper hover:bg-brand-vermillion-deep"
          >
            <Link href="/">
              <Home className="size-4" />
              메인 페이지로 이동
            </Link>
          </Button>
          <BackButton />
        </div>
      </div>

      <div className="w-64 shrink-0 sm:w-80 lg:w-md">
        <Image
          src="/assets/images/k-shape-main-image.png"
          alt=""
          width={512}
          height={512}
          priority
          className="h-auto w-full"
        />
      </div>
    </PageContainer>
  );
}
