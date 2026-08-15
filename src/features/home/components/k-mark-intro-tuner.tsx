"use client";

import { useMemo, useState } from "react";

import { cn } from "@/lib/utils";

import { KMarkGraphic, type MaskInset, DEFAULT_MASK_INSET } from "./k-mark-graphic";

/** 마스킹 박스를 "너비/높이/위치" 감각으로 다루기 위한 표현. 실제로는 clip-path inset()으로 변환해서 적용한다. */
type Box = { width: number; height: number; offsetX: number; offsetY: number };

const RANGE = {
  width: { min: 50, max: 220, step: 1, unit: "%", label: "박스 너비" },
  height: { min: 50, max: 220, step: 1, unit: "%", label: "박스 높이" },
  offsetX: { min: -60, max: 60, step: 1, unit: "%", label: "위치 X (좌우)" },
  offsetY: { min: -60, max: 60, step: 1, unit: "%", label: "위치 Y (상하)" },
} as const;

function insetToBox(inset: MaskInset): Box {
  const left = inset.left;
  const right = 100 - inset.right;
  const top = inset.top;
  const bottom = 100 - inset.bottom;
  return {
    width: right - left,
    height: bottom - top,
    offsetX: (left + right) / 2 - 50,
    offsetY: (top + bottom) / 2 - 50,
  };
}

function boxToInset(box: Box): MaskInset {
  const left = 50 - box.width / 2 + box.offsetX;
  const right = 50 + box.width / 2 + box.offsetX;
  const top = 50 - box.height / 2 + box.offsetY;
  const bottom = 50 + box.height / 2 + box.offsetY;
  return {
    top,
    right: 100 - right,
    bottom: 100 - bottom,
    left,
  };
}

function fmt(n: number) {
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

const DEFAULT_BOX = insetToBox(DEFAULT_MASK_INSET);

export function KMarkIntroTuner() {
  const [box, setBox] = useState<Box>({ ...DEFAULT_BOX });
  const [showGuide, setShowGuide] = useState(true);
  const [replayKey, setReplayKey] = useState(0);

  const setField = (field: keyof Box, value: number) => {
    setBox((prev) => ({ ...prev, [field]: value }));
  };

  const reset = () => {
    setBox({ ...DEFAULT_BOX });
    setReplayKey((k) => k + 1);
  };

  const replay = () => setReplayKey((k) => k + 1);

  const inset = useMemo(() => boxToInset(box), [box]);

  const output = useMemo(() => {
    return [
      `// k-mark-graphic.tsx의 DEFAULT_MASK_INSET에 붙여넣기`,
      `export const DEFAULT_MASK_INSET: MaskInset = {`,
      `  top: ${fmt(inset.top)},`,
      `  right: ${fmt(inset.right)},`,
      `  bottom: ${fmt(inset.bottom)},`,
      `  left: ${fmt(inset.left)},`,
      `};`,
      ``,
      `/* 참고용: clip-path: inset(${fmt(inset.top)}% ${fmt(inset.right)}% ${fmt(inset.bottom)}% ${fmt(inset.left)}%) */`,
      `/* 박스 너비 ${fmt(box.width)}%, 높이 ${fmt(box.height)}%, 위치 X ${fmt(box.offsetX)}%, Y ${fmt(box.offsetY)}% (K 캔버스 기준) */`,
    ].join("\n");
  }, [inset, box]);

  // 가이드 박스 오버레이용 사각형의 top/left/width/height(%) — 박스 좌상단 기준
  const guideRect = {
    left: 50 - box.width / 2 + box.offsetX,
    top: 50 - box.height / 2 + box.offsetY,
    width: box.width,
    height: box.height,
  };

  return (
    <div className="grid grid-cols-1 gap-8 p-6 text-brand-ink lg:grid-cols-[1.4fr_1fr]">
      {/* 미리보기 */}
      <div className="flex flex-col items-center gap-4">
        <div className="sticky top-6 flex w-full flex-col items-center gap-4">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setShowGuide((v) => !v)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold",
                showGuide
                  ? "bg-brand-indigo text-white"
                  : "border border-brand-ink/20 text-brand-ink-soft hover:bg-brand-ink/5",
              )}
            >
              가이드 박스 {showGuide ? "숨기기" : "보이기"}
            </button>
            <button
              type="button"
              onClick={replay}
              className="rounded-full border border-brand-ink/20 px-4 py-2 text-sm font-semibold hover:bg-brand-ink/5"
            >
              인트로 다시 재생
            </button>
            <button
              type="button"
              onClick={reset}
              className="rounded-full border border-brand-ink/20 px-4 py-2 text-sm font-semibold hover:bg-brand-ink/5"
            >
              기본값으로 초기화
            </button>
          </div>
          <p className="text-center text-xs text-brand-ink-soft">
            실제 KMarkGraphic 컴포넌트 그대로 렌더링 — 마운트될 때마다(재생 버튼 포함)
            도형들이 날아와 모이는 실제 인트로가 재생됩니다.
          </p>

          <div
            key={replayKey}
            className="relative w-full max-w-140 overflow-visible rounded-lg bg-brand-paper bg-[radial-gradient(circle_at_1px_1px,rgba(33,27,18,0.07)_1px,transparent_0)] bg-size-[22px_22px] p-10 shadow-inner"
          >
            <div className="relative">
              <KMarkGraphic maskInset={inset} />
              {showGuide && (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute border-2 border-dashed border-brand-vermillion bg-brand-vermillion/10"
                  style={{
                    left: `${guideRect.left}%`,
                    top: `${guideRect.top}%`,
                    width: `${guideRect.width}%`,
                    height: `${guideRect.height}%`,
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 컨트롤 + 출력 */}
      <div className="flex flex-col gap-8">
        <div>
          <h2 className="mb-2 font-bold">생성된 값 (복사해서 전달)</h2>
          <textarea
            readOnly
            value={output}
            onFocus={(e) => e.currentTarget.select()}
            className="h-64 w-full rounded-md border border-brand-ink/20 bg-white p-3 font-mono text-xs leading-relaxed"
          />
        </div>

        <div className="rounded-lg border border-brand-ink/15 bg-white p-4">
          <p className="mb-3 text-sm font-bold">마스킹 박스</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {(["width", "height", "offsetX", "offsetY"] as const).map((field) => {
              const range = RANGE[field];
              return (
                <label key={field} className="flex flex-col gap-1 text-xs text-brand-ink-soft">
                  <span className="flex justify-between">
                    <span>{range.label}</span>
                    <span className="font-mono">
                      {fmt(box[field])}
                      {range.unit}
                    </span>
                  </span>
                  <input
                    type="range"
                    min={range.min}
                    max={range.max}
                    step={range.step}
                    value={box[field]}
                    onChange={(e) => setField(field, Number(e.target.value))}
                  />
                  <input
                    type="number"
                    step={range.step}
                    value={box[field]}
                    onChange={(e) => setField(field, Number(e.target.value))}
                    className="rounded border border-brand-ink/20 px-2 py-1 text-xs"
                  />
                </label>
              );
            })}
          </div>
          <p className="mt-3 text-xs text-brand-ink-soft">
            박스 100%/0%는 K 캔버스 자체 크기·위치와 동일. 너비/높이를 키우거나 위치를
            옮기면 클리핑 영역(밖에서 날아오는 도형이 가려지는 경계)이 함께 움직입니다.
          </p>
        </div>
      </div>
    </div>
  );
}
