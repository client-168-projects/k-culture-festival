import { KMarkIntroTuner } from "@/features/home/components/k-mark-intro-tuner";

export default function KMarkIntroTunerPage() {
  return (
    <div className="min-h-screen bg-brand-paper/40">
      <div className="border-b border-brand-ink/10 bg-white px-6 py-4">
        <h1 className="font-bold">K 모양 조립 인트로 — 마스킹 박스 설정 패널 (개발용)</h1>
        <p className="text-sm text-brand-ink-soft">
          날아오는 도형을 가리는 마스킹 박스의 너비/높이/위치를 조절하고, 왼쪽 값을 복사해서 전달하세요.
        </p>
      </div>
      <KMarkIntroTuner />
    </div>
  );
}
