import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-4 py-10 sm:px-6 sm:py-16">
      <section className="flex flex-col gap-3">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-5 w-full max-w-md" />
      </section>

      <section className="flex flex-col gap-3">
        <Skeleton className="h-4 w-16" />
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-20" />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </section>
    </main>
  );
}
