"use client";

import type { CSSProperties, PointerEvent as ReactPointerEvent, ReactNode } from "react";
import { useMemo, useRef, useState } from "react";
import Image from "next/image";

import { ArchPanel } from "@/components/arch-panel";
import { cn } from "@/lib/utils";

import { ASSETS, PANEL_SIZE, PANEL_SIZE_RIGHT } from "./k-mark-graphic";

type PanelKey = "topLeft" | "topRight" | "bottomLeft" | "bottomRight";

/** 최종(조립된) 위치로부터의 시작 오프셋 — 캔버스 너비/높이 대비 %(cqw/cqh) */
type Offset = { dx: number; dy: number };

const PANEL_LABELS: Record<PanelKey, string> = {
  topLeft: "좌상단 (비빔밥·노리개 / purple)",
  topRight: "우상단 (파도무늬 / vermillion)",
  bottomLeft: "좌하단 (갓·구름 / jade)",
  bottomRight: "우하단 (궁궐·종·산 / indigo-deep)",
};

const PANEL_ORDER: PanelKey[] = ["topLeft", "topRight", "bottomLeft", "bottomRight"];

const DEFAULT_OFFSETS: Record<PanelKey, Offset> = {
  topLeft: { dx: -75, dy: -60 },
  topRight: { dx: 75, dy: -60 },
  bottomLeft: { dx: -75, dy: 60 },
  bottomRight: { dx: 75, dy: 60 },
};

const OFFSET_SLIDER_RANGE = { min: -200, max: 200 };
const OFFSET_CLAMP = { min: -400, max: 400 };

function fmt(n: number) {
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function KMarkIntroTuner() {
  const [offsets, setOffsets] = useState<Record<PanelKey, Offset>>(() => ({
    ...DEFAULT_OFFSETS,
  }));
  const [atFinal, setAtFinal] = useState(false);
  const [duration, setDuration] = useState(800);
  const [stagger, setStagger] = useState(120);

  const dragState = useRef<{
    panel: PanelKey;
    startClientX: number;
    startClientY: number;
    startDx: number;
    startDy: number;
  } | null>(null);

  const setOffset = (panel: PanelKey, offset: Offset) => {
    setOffsets((prev) => ({ ...prev, [panel]: offset }));
  };

  const setOffsetField = (panel: PanelKey, field: keyof Offset, value: number) => {
    setOffsets((prev) => ({ ...prev, [panel]: { ...prev[panel], [field]: value } }));
  };

  const reset = () => {
    setOffsets({ ...DEFAULT_OFFSETS });
    setAtFinal(false);
  };

  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (atFinal) return;
    const panel = e.currentTarget.dataset.panel as PanelKey | undefined;
    if (!panel) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragState.current = {
      panel,
      startClientX: e.clientX,
      startClientY: e.clientY,
      startDx: offsets[panel].dx,
      startDy: offsets[panel].dy,
    };
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragState.current;
    if (!drag) return;
    const canvas = e.currentTarget.closest<HTMLElement>("[data-k-intro-canvas]");
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const deltaXPct = ((e.clientX - drag.startClientX) / rect.width) * 100;
    const deltaYPct = ((e.clientY - drag.startClientY) / rect.height) * 100;
    setOffset(drag.panel, {
      dx: clamp(drag.startDx + deltaXPct, OFFSET_CLAMP.min, OFFSET_CLAMP.max),
      dy: clamp(drag.startDy + deltaYPct, OFFSET_CLAMP.min, OFFSET_CLAMP.max),
    });
  };

  const handlePointerUp = () => {
    dragState.current = null;
  };

  const output = useMemo(() => {
    const lines = PANEL_ORDER.map((panel, index) => {
      const { dx, dy } = offsets[panel];
      return `${PANEL_LABELS[panel]}\n  시작: translate(${fmt(dx)}%, ${fmt(dy)}%)  →  도착: translate(0%, 0%)\n  transition-delay: ${index * stagger}ms`;
    });
    return [
      ...lines,
      ``,
      `/* 공통: duration ${duration}ms, stagger ${stagger}ms, easing ease-out(권장) */`,
      `/* %는 K 모형 캔버스(각 도형 wrapper 기준) 너비/높이 대비 상대값(cqw/cqh) */`,
    ].join("\n\n");
  }, [offsets, duration, stagger]);

  return (
    <div className="grid grid-cols-1 gap-8 p-6 text-brand-ink lg:grid-cols-[1.5fr_1fr]">
      {/* 미리보기 */}
      <div className="flex flex-col items-center gap-4">
        <div className="sticky top-6 flex w-full flex-col items-center gap-4">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setAtFinal((v) => !v)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold text-white",
                atFinal ? "bg-brand-jade" : "bg-brand-indigo",
              )}
            >
              {atFinal ? "조립 완료 (시작 위치로 되돌리기)" : "조립 애니메이션 재생"}
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
            {atFinal
              ? "조립된 최종 위치입니다. 위 버튼을 눌러 시작 위치 편집으로 돌아가세요."
              : "각 도형을 마우스로 드래그해서 시작 위치를 지정하세요. 캔버스 밖으로도 옮길 수 있습니다."}
          </p>

          <div
            data-k-intro-canvas
            style={{ containerType: "size" }}
            className="relative aspect-3/4 w-full max-w-140 overflow-visible rounded-lg bg-brand-paper bg-[radial-gradient(circle_at_1px_1px,rgba(33,27,18,0.07)_1px,transparent_0)] bg-size-[22px_22px] p-4 shadow-inner"
          >
            {/* 좌상단 */}
            <IntroPanel
              index={0}
              panel="topLeft"
              atFinal={atFinal}
              offset={offsets.topLeft}
              duration={duration}
              stagger={stagger}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              className={`absolute top-[6%] left-0 ${PANEL_SIZE}`}
            >
              <ArchPanel tone="purple" flip flatCorner="top" className="h-full w-full">
                <div className="absolute top-[14%] left-[-44%] h-[74%] w-[136%]">
                  <Image
                    src={ASSETS.bibimbap}
                    alt=""
                    fill
                    sizes="300px"
                    className="object-contain"
                  />
                </div>
                <div className="absolute top-[6%] left-[44%] h-[72%] w-[76%] scale-[1.2]">
                  <Image
                    src={ASSETS.norigae}
                    alt=""
                    fill
                    sizes="300px"
                    className="object-contain object-top"
                  />
                </div>
              </ArchPanel>
            </IntroPanel>

            {/* 우상단 */}
            <IntroPanel
              index={1}
              panel="topRight"
              atFinal={atFinal}
              offset={offsets.topRight}
              duration={duration}
              stagger={stagger}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              className={`absolute top-[-15.8%] -right-1.5 ${PANEL_SIZE_RIGHT}`}
              style={{
                clipPath: "polygon(-200% 30%, 300% 30%, 300% 300%, -200% 300%)",
              }}
            >
              <ArchPanel tone="vermillion" flip className="h-full w-full rotate-45">
                <div className="absolute inset-0 -rotate-45">
                  <div className="absolute top-[42%] left-[-65%] h-full w-[168%]">
                    <svg
                      viewBox="0 0 400 900"
                      preserveAspectRatio="none"
                      className="h-full w-full fill-brand-indigo-deep"
                    >
                      <path d="M -40,151 L 0,150 A 125.00,125.00 0 0,0 200.0,150 A 125.00,125.00 0 0,1 400.0,150 L 440.0,151 L 440.0,900 L -40,900 Z" />
                    </svg>
                  </div>
                </div>
              </ArchPanel>
            </IntroPanel>

            {/* 좌하단 */}
            <IntroPanel
              index={2}
              panel="bottomLeft"
              atFinal={atFinal}
              offset={offsets.bottomLeft}
              duration={duration}
              stagger={stagger}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              className={`absolute bottom-0 left-0 ${PANEL_SIZE}`}
            >
              <ArchPanel tone="jade" flatCorner="bottom" className="h-full w-full">
                <Image
                  src={ASSETS.patternedBg}
                  alt=""
                  fill
                  sizes="300px"
                  className="object-cover opacity-90"
                />
                <div className="absolute top-[36%] left-[-12%] h-[58%] w-full scale-[1.3]">
                  <Image
                    src={ASSETS.hat}
                    alt=""
                    fill
                    sizes="300px"
                    className="object-contain object-bottom"
                  />
                </div>
              </ArchPanel>
            </IntroPanel>

            {/* 우하단 */}
            <IntroPanel
              index={3}
              panel="bottomRight"
              atFinal={atFinal}
              offset={offsets.bottomRight}
              duration={duration}
              stagger={stagger}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              className={`absolute -right-1.5 bottom-[-21%] ${PANEL_SIZE_RIGHT}`}
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
                      sizes="300px"
                      className="object-contain"
                    />
                  </div>
                  <div className="absolute top-[27%] left-[26%] h-[14%] w-[9%]">
                    <Image
                      src={ASSETS.bell}
                      alt=""
                      fill
                      sizes="300px"
                      className="object-contain"
                    />
                  </div>
                  <div className="absolute top-[48%] left-[10%] h-[48%] w-[118%] scale-[1.4]">
                    <Image
                      src={ASSETS.mountain}
                      alt=""
                      fill
                      sizes="300px"
                      className="object-cover object-bottom"
                    />
                  </div>
                </div>
              </ArchPanel>
            </IntroPanel>
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
            className="h-80 w-full rounded-md border border-brand-ink/20 bg-white p-3 font-mono text-xs leading-relaxed"
          />
        </div>

        <div className="rounded-lg border border-brand-ink/15 bg-white p-4">
          <p className="mb-3 text-sm font-bold">타이밍</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-xs text-brand-ink-soft">
              <span className="flex justify-between">
                <span>전체 재생 시간</span>
                <span className="font-mono">{duration}ms</span>
              </span>
              <input
                type="range"
                min={200}
                max={2500}
                step={50}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
              />
            </label>
            <label className="flex flex-col gap-1 text-xs text-brand-ink-soft">
              <span className="flex justify-between">
                <span>도형 간 지연(스태거)</span>
                <span className="font-mono">{stagger}ms</span>
              </span>
              <input
                type="range"
                min={0}
                max={400}
                step={10}
                value={stagger}
                onChange={(e) => setStagger(Number(e.target.value))}
              />
            </label>
          </div>
        </div>

        {PANEL_ORDER.map((panel) => (
          <div key={panel} className="rounded-lg border border-brand-ink/15 bg-white p-4">
            <p className="mb-3 text-sm font-bold">{PANEL_LABELS[panel]}</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {(["dx", "dy"] as const).map((field) => (
                <label
                  key={field}
                  className="flex flex-col gap-1 text-xs text-brand-ink-soft"
                >
                  <span className="flex justify-between">
                    <span>{field === "dx" ? "좌우 오프셋" : "상하 오프셋"}</span>
                    <span className="font-mono">{fmt(offsets[panel][field])}%</span>
                  </span>
                  <input
                    type="range"
                    min={OFFSET_SLIDER_RANGE.min}
                    max={OFFSET_SLIDER_RANGE.max}
                    step={1}
                    value={offsets[panel][field]}
                    onChange={(e) => setOffsetField(panel, field, Number(e.target.value))}
                  />
                  <input
                    type="number"
                    step={1}
                    value={offsets[panel][field]}
                    onChange={(e) => setOffsetField(panel, field, Number(e.target.value))}
                    className="rounded border border-brand-ink/20 px-2 py-1 text-xs"
                  />
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function IntroPanel({
  index,
  panel,
  atFinal,
  offset,
  duration,
  stagger,
  className,
  style,
  children,
  onPointerDown,
  onPointerMove,
  onPointerUp,
}: {
  index: number;
  panel: PanelKey;
  atFinal: boolean;
  offset: Offset;
  duration: number;
  stagger: number;
  className: string;
  style?: CSSProperties;
  children: ReactNode;
  onPointerDown: (e: ReactPointerEvent<HTMLDivElement>) => void;
  onPointerMove: (e: ReactPointerEvent<HTMLDivElement>) => void;
  onPointerUp: (e: ReactPointerEvent<HTMLDivElement>) => void;
}) {
  const translate = atFinal
    ? "translate(0%, 0%)"
    : `translate(${offset.dx}cqw, ${offset.dy}cqh)`;

  return (
    <div
      data-panel={panel}
      className={className}
      style={{
        ...style,
        transform: translate,
        transition: `transform ${duration}ms ease-out`,
        transitionDelay: `${index * stagger}ms`,
        touchAction: "none",
        cursor: atFinal ? "default" : "grab",
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {children}
    </div>
  );
}
