import { ExperienceSection } from "@/features/home/components/experience-section";
import { ExtraProgramSection } from "@/features/home/components/extra-program-section";
import { HeroSection } from "@/features/home/components/hero-section";
import { MainStageSection } from "@/features/home/components/main-stage-section";
import { SectionNav } from "@/features/home/components/section-nav";

export default function Home() {
  return (
    <main>
      <div className="flex min-h-[calc(100vh-5rem-3.375rem)] flex-col sm:min-h-[calc(100vh-6rem-3.375rem)]">
        <HeroSection />
      </div>
      <SectionNav />
      <MainStageSection />
      <ExperienceSection />
      <ExtraProgramSection />
    </main>
  );
}
