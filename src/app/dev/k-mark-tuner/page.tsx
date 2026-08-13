import { KMarkGraphicTuner } from "@/features/home/components/k-mark-graphic-tuner";

export default function KMarkTunerPage() {
  return (
    <div className="min-h-screen bg-brand-paper/40">
      <div className="border-b border-brand-ink/10 bg-white px-6 py-4">
        <h1 className="font-bold">K 모형 에셋 조정 패널 (개발용)</h1>
        <p className="text-sm text-brand-ink-soft">
          슬라이더로 각 에셋의 위치/크기를 조정하고, 왼쪽 텍스트를 복사해서 전달하세요.
        </p>
      </div>
      <KMarkGraphicTuner />
    </div>
  );
}
