"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

import { ArchPanel } from "@/components/arch-panel";
import { cn } from "@/lib/utils";

import { ASSETS } from "./k-mark-graphic";

type BellParams = {
  anchorX: number;
  anchorY: number;
  maxAngle: number;
  frequency: number;
  damping: number;
  activeDuration: number;
  loopPause: number;
  smoothness: number;
};

const DEFAULTS: BellParams = {
  anchorX: 50,
  anchorY: 8,
  maxAngle: 16,
  frequency: 3.2,
  damping: 3.5,
  activeDuration: 1.1,
  loopPause: 2.4,
  smoothness: 36,
};

const RANGES: Record<
  keyof BellParams,
  { min: number; max: number; step: number; unit: string; label: string }
> = {
  anchorX: { min: 0, max: 100, step: 1, unit: "%", label: "앵커 X (좌우)" },
  anchorY: { min: 0, max: 100, step: 1, unit: "%", label: "앵커 Y (상하)" },
  maxAngle: { min: 1, max: 60, step: 1, unit: "deg", label: "최대 각도" },
  frequency: { min: 0.5, max: 8, step: 0.1, unit: "회/초", label: "진동 속도" },
  damping: { min: 0, max: 10, step: 0.1, unit: "", label: "감쇠(감속) 강도" },
  activeDuration: {
    min: 0.2,
    max: 4,
    step: 0.1,
    unit: "초",
    label: "흔들리는 시간",
  },
  loopPause: { min: 0, max: 6, step: 0.1, unit: "초", label: "정지 후 반복 간격" },
  smoothness: { min: 8, max: 80, step: 1, unit: "step", label: "부드러움(샘플 수)" },
};

function fmt(n: number, digits = 1) {
  return Number.isInteger(n) ? String(n) : n.toFixed(digits);
}

/** 감쇠 사인파(taps → 진폭이 점점 줄어드는 종 흔들림)를 샘플링해 % 키프레임으로 변환 */
function buildKeyframes(p: BellParams) {
  const total = p.activeDuration + p.loopPause;
  if (total <= 0) return { css: "", total: 0 };

  const stops: { pct: number; angle: number }[] = [];
  for (let i = 0; i <= p.smoothness; i++) {
    const t = (p.activeDuration * i) / p.smoothness;
    const isLast = i === p.smoothness;
    const decay = Math.exp(-p.damping * t);
    const angle = isLast
      ? 0
      : p.maxAngle * Math.cos(2 * Math.PI * p.frequency * t) * decay;
    const pct = (t / total) * 100;
    stops.push({ pct, angle });
  }
  if (p.loopPause > 0) {
    stops.push({ pct: 100, angle: 0 });
  }

  const css = stops
    .map((s) => `  ${fmt(s.pct, 2)}% { transform: rotate(${fmt(s.angle, 2)}deg); }`)
    .join("\n");

  return { css, total };
}

export function BellSwingTuner() {
  const [params, setParams] = useState<BellParams>({ ...DEFAULTS });
  const [playing, setPlaying] = useState(true);
  const [showContext, setShowContext] = useState(true);
  const [replayKey, setReplayKey] = useState(0);

  const setField = (field: keyof BellParams, value: number) => {
    setParams((prev) => ({ ...prev, [field]: value }));
  };

  const reset = () => {
    setParams({ ...DEFAULTS });
    setReplayKey((k) => k + 1);
  };

  const replay = () => setReplayKey((k) => k + 1);

  const { css: keyframesCss, total } = useMemo(
    () => buildKeyframes(params),
    [params],
  );

  const transformOrigin = `${params.anchorX}% ${params.anchorY}%`;

  const animationStyle = useMemo(
    () => ({
      transformOrigin,
      animationName: "bell-swing-preview",
      animationDuration: `${fmt(total, 2)}s`,
      animationTimingFunction: "linear",
      animationIterationCount: "infinite",
      animationPlayState: playing ? "running" : "paused",
    }),
    [transformOrigin, total, playing],
  );

  const output = useMemo(() => {
    return [
      `/* 앵커: transform-origin ${transformOrigin} */`,
      `.bell-icon {`,
      `  transform-origin: ${transformOrigin};`,
      `}`,
      ``,
      `@keyframes bell-swing {`,
      keyframesCss,
      `}`,
      ``,
      `.bell-icon--ringing {`,
      `  animation: bell-swing ${fmt(total, 2)}s linear infinite;`,
      `}`,
      ``,
      `/* 최대 각도 ${fmt(params.maxAngle)}deg, 진동 ${fmt(params.frequency)}회/초, 감쇠 ${fmt(params.damping)}, 흔들림 ${fmt(params.activeDuration)}초 + 정지 ${fmt(params.loopPause)}초 = 총 ${fmt(total, 2)}초 반복 */`,
    ].join("\n");
  }, [transformOrigin, keyframesCss, total, params]);

  const bell = (
    <div
      key={replayKey}
      className="relative h-full w-full"
      style={animationStyle}
    >
      <Image
        src={ASSETS.bell}
        alt=""
        fill
        sizes="300px"
        className="object-contain"
      />
      {/* 앵커 포인트 마커 */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute z-10 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-brand-vermillion bg-white/90 shadow"
        style={{ left: `${params.anchorX}%`, top: `${params.anchorY}%` }}
      />
    </div>
  );

  return (
    <div className="grid grid-cols-1 gap-8 p-6 text-brand-ink lg:grid-cols-[1.4fr_1fr]">
      <style>{`@keyframes bell-swing-preview {\n${keyframesCss}\n}`}</style>

      {/* 미리보기 */}
      <div className="flex flex-col items-center gap-4">
        <div className="sticky top-6 flex w-full flex-col items-center gap-4">
          <div className="flex items-center gap-2 self-start rounded-full border border-brand-ink/15 bg-white p-1 text-sm">
            <button
              type="button"
              onClick={() => setShowContext(false)}
              className={cn(
                "rounded-full px-3 py-1.5 font-semibold",
                !showContext ? "bg-brand-ink text-white" : "text-brand-ink-soft",
              )}
            >
              단독 보기
            </button>
            <button
              type="button"
              onClick={() => setShowContext(true)}
              className={cn(
                "rounded-full px-3 py-1.5 font-semibold",
                showContext ? "bg-brand-ink text-white" : "text-brand-ink-soft",
              )}
            >
              실제 배치에서 보기
            </button>
          </div>

          {showContext ? (
            <div
              aria-hidden="true"
              className="relative aspect-3/4 w-full max-w-140 overflow-hidden rounded-lg bg-brand-paper bg-[radial-gradient(circle_at_1px_1px,rgba(33,27,18,0.07)_1px,transparent_0)] bg-size-[22px_22px] p-4 shadow-inner"
            >
              <div
                className="absolute -right-1.5 bottom-[-21%] h-[75%] w-[40%]"
                style={{
                  clipPath: "polygon(-200% -200%, 300% -200%, 300% 70%, -200% 70%)",
                }}
              >
                <ArchPanel tone="indigo-deep" className="h-full w-full -rotate-45">
                  <div className="absolute inset-0 rotate-45">
                    <div className="absolute top-[14%] left-[-86%] h-[46%] w-[124%]">
                      <Image
                        src={ASSETS.house}
                        alt=""
                        fill
                        sizes="400px"
                        className="object-contain"
                      />
                    </div>
                    <div className="absolute top-[27%] left-[26%] h-[14%] w-[9%]">
                      {bell}
                    </div>
                    <div className="absolute top-[48%] left-[10%] h-[48%] w-[118%] scale-[1.4]">
                      <Image
                        src={ASSETS.mountain}
                        alt=""
                        fill
                        sizes="400px"
                        className="object-cover object-bottom"
                      />
                    </div>
                  </div>
                </ArchPanel>
              </div>
            </div>
          ) : (
            <div
              aria-hidden="true"
              className="relative aspect-square w-full max-w-80 overflow-hidden rounded-lg bg-brand-paper bg-[radial-gradient(circle_at_1px_1px,rgba(33,27,18,0.07)_1px,transparent_0)] bg-size-[22px_22px] p-4 shadow-inner"
            >
              <div className="absolute top-[20%] left-[35%] h-[60%] w-[30%]">
                {bell}
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setPlaying((v) => !v)}
              className="rounded-full border border-brand-ink/20 px-4 py-2 text-sm font-semibold hover:bg-brand-ink/5"
            >
              {playing ? "일시정지" : "재생"}
            </button>
            <button
              type="button"
              onClick={replay}
              className="rounded-full border border-brand-ink/20 px-4 py-2 text-sm font-semibold hover:bg-brand-ink/5"
            >
              처음부터 다시보기
            </button>
            <button
              type="button"
              onClick={reset}
              className="rounded-full border border-brand-ink/20 px-4 py-2 text-sm font-semibold hover:bg-brand-ink/5"
            >
              기본값으로 초기화
            </button>
          </div>
        </div>
      </div>

      {/* 컨트롤 + 출력 */}
      <div className="flex flex-col gap-8">
        <div>
          <h2 className="mb-2 font-bold">생성된 CSS (복사해서 전달)</h2>
          <textarea
            readOnly
            value={output}
            onFocus={(e) => e.currentTarget.select()}
            className="h-72 w-full rounded-md border border-brand-ink/20 bg-white p-3 font-mono text-xs leading-relaxed"
          />
        </div>

        <div className="rounded-lg border border-brand-ink/15 bg-white p-4">
          <p className="mb-3 text-sm font-bold">앵커 포인트</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {(["anchorX", "anchorY"] as const).map((field) => (
              <ParamSlider
                key={field}
                field={field}
                value={params[field]}
                onChange={(v) => setField(field, v)}
              />
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-brand-ink/15 bg-white p-4">
          <p className="mb-3 text-sm font-bold">흔들림 각도 / 속도</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {(["maxAngle", "frequency"] as const).map((field) => (
              <ParamSlider
                key={field}
                field={field}
                value={params[field]}
                onChange={(v) => setField(field, v)}
              />
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-brand-ink/15 bg-white p-4">
          <p className="mb-3 text-sm font-bold">감속(감쇠)</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {(["damping", "smoothness"] as const).map((field) => (
              <ParamSlider
                key={field}
                field={field}
                value={params[field]}
                onChange={(v) => setField(field, v)}
              />
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-brand-ink/15 bg-white p-4">
          <p className="mb-3 text-sm font-bold">루프</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {(["activeDuration", "loopPause"] as const).map((field) => (
              <ParamSlider
                key={field}
                field={field}
                value={params[field]}
                onChange={(v) => setField(field, v)}
              />
            ))}
          </div>
          <p className="mt-3 text-xs text-brand-ink-soft">
            총 반복 주기: {fmt(total, 2)}초 (흔들림 {fmt(params.activeDuration)}초 + 정지{" "}
            {fmt(params.loopPause)}초)
          </p>
        </div>
      </div>
    </div>
  );
}

function ParamSlider({
  field,
  value,
  onChange,
}: {
  field: keyof BellParams;
  value: number;
  onChange: (value: number) => void;
}) {
  const range = RANGES[field];
  return (
    <label className="flex flex-col gap-1 text-xs text-brand-ink-soft">
      <span className="flex justify-between">
        <span>{range.label}</span>
        <span className="font-mono">
          {fmt(value)}
          {range.unit}
        </span>
      </span>
      <input
        type="range"
        min={range.min}
        max={range.max}
        step={range.step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <input
        type="number"
        step={range.step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="rounded border border-brand-ink/20 px-2 py-1 text-xs"
      />
    </label>
  );
}
