import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-4 py-10 sm:px-6 sm:py-16">
      <section className="flex flex-col gap-3">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          공용 컴포넌트
        </h1>
        <p className="text-muted-foreground">
          variant / size props로 확장 가능한 재사용 UI 컴포넌트 모음입니다
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-muted-foreground">Button</h2>
        <div className="flex flex-wrap gap-2">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-muted-foreground">Badge</h2>
        <div className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
        </div>
      </section>

      <Separator />

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-muted-foreground">Card</h2>
        <Card>
          <CardHeader>
            <CardTitle>축제 신청</CardTitle>
            <CardDescription>참가 정보를 입력해주세요.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">이름</Label>
              <Input id="name" placeholder="홍길동" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">이메일</Label>
              <Input id="email" type="email" placeholder="you@example.com" />
            </div>
          </CardContent>
          <CardFooter className="justify-end gap-2">
            <Button variant="outline">취소</Button>
            <Button>제출</Button>
          </CardFooter>
        </Card>
      </section>
    </main>
  );
}
