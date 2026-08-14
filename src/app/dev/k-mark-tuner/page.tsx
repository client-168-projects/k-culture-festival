import { BellSwingTuner } from "@/features/home/components/bell-swing-tuner";

export default function KMarkTunerPage() {
  return (
    <div className="min-h-screen bg-brand-paper/40">
      <div className="border-b border-brand-ink/10 bg-white px-6 py-4">
        <h1 className="font-bold">종(Bell) 흔들림 애니메이션 테스트 패널 (개발용)</h1>
        <p className="text-sm text-brand-ink-soft">
          앵커 포인트/각도/감속을 조정해 흔들림을 확인하고, 왼쪽 CSS를 복사해서 전달하세요.
        </p>
      </div>
      <BellSwingTuner />
    </div>
  );
}
