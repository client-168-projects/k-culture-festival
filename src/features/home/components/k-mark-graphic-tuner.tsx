"use client";

import type { CSSProperties } from "react";
import { useMemo, useState } from "react";
import Image from "next/image";

import { ArchPanel } from "@/components/arch-panel";
import { cn } from "@/lib/utils";

import { ASSETS, PANEL_SIZE, PANEL_SIZE_RIGHT } from "./k-mark-graphic";

type FieldKey = "x" | "y" | "height" | "width" | "scale";

type Vals = Record<FieldKey, number>;

const FIELD_LABEL: Record<FieldKey, string> = {
  x: "left",
  y: "top",
  height: "height",
  width: "width",
  scale: "확대 배율",
};

const POS_RANGE = { min: -150, max: 250 };
const SIZE_RANGE = { min: 4, max: 400 };
const SCALE_RANGE = { min: 0.2, max: 6 };

type WaveFieldKey =
  | "x"
  | "y"
  | "height"
  | "width"
  | "rotate"
  | "viewW"
  | "viewH"
  | "baseline"
  | "radius"
  | "bleed";

type WaveVals = Record<WaveFieldKey, number>;

const WAVE_FIELD_LABEL: Record<WaveFieldKey, string> = {
  x: "left",
  y: "top",
  height: "height",
  width: "width",
  rotate: "기울기 보정",
  viewW: "viewBox 너비",
  viewH: "viewBox 높이",
  baseline: "기준선",
  radius: "곡선 반지름",
  bleed: "좌우 여백",
};

// 태극 문양 스타일 물결: 두 개의 반원 호(A)가 만나 S자를 이루는 형태.
// 기본값은 우상단 패널(가로:세로 ≈ 4:9)에 맞춘 값.
const WAVE_DEFAULTS: WaveVals = {
  x: -65,
  y: 42,
  height: 100,
  width: 168,
  rotate: 0,
  viewW: 400,
  viewH: 900,
  baseline: 150,
  radius: 125,
  bleed: 40,
};

const WAVE_RANGES: Record<WaveFieldKey, { min: number; max: number }> = {
  x: POS_RANGE,
  y: POS_RANGE,
  height: SIZE_RANGE,
  width: SIZE_RANGE,
  rotate: { min: -45, max: 45 },
  viewW: { min: 100, max: 800 },
  viewH: { min: 200, max: 1400 },
  baseline: { min: 0, max: 900 },
  radius: { min: 10, max: 300 },
  bleed: { min: 0, max: 150 },
};

function wavePath(v: WaveVals) {
  const half = v.viewW / 2;
  const b = v.baseline;
  const r = v.radius;
  const bleed = v.bleed;
  return `M ${-bleed},${b + 1} L 0,${b} A ${r},${r} 0 0,0 ${half},${b} A ${r},${r} 0 0,1 ${v.viewW},${b} L ${v.viewW + bleed},${b + 1} L ${v.viewW + bleed},${v.viewH} L ${-bleed},${v.viewH} Z`;
}

type AssetDef = {
  key: string;
  label: string;
  panel: "좌상단" | "우상단" | "좌하단" | "우하단";
  src: string;
  imgClassName?: string;
  extraClassName?: string;
  defaults: Vals;
};

const ASSET_DEFS: AssetDef[] = [
  {
    key: "bibimbap",
    label: "비빔밥",
    panel: "좌상단",
    src: ASSETS.bibimbap,
    defaults: { x: -44, y: 14, height: 74, width: 136, scale: 1 },
  },
  {
    key: "norigae",
    label: "노리개",
    panel: "좌상단",
    src: ASSETS.norigae,
    imgClassName: "object-top",
    defaults: { x: 44, y: 6, height: 72, width: 76, scale: 1.2 },
  },
  {
    key: "patternLattice",
    label: "격자무늬 (pattern-2)",
    panel: "우상단",
    src: ASSETS.patternLattice,
    extraClassName: "opacity-30",
    defaults: { x: 4, y: 36, height: 18, width: 34, scale: 1 },
  },
  {
    key: "patternLattice2",
    label: "격자무늬 2 (pattern-2)",
    panel: "우상단",
    src: ASSETS.patternLattice,
    extraClassName: "opacity-30",
    defaults: { x: -40, y: 58, height: 40, width: 36, scale: 1 },
  },
  {
    key: "patternKnot",
    label: "매듭무늬 (pattern-1)",
    panel: "우상단",
    src: ASSETS.patternKnot,
    extraClassName: "opacity-30",
    defaults: { x: 72, y: 22, height: 30, width: 34, scale: 1 },
  },
  {
    key: "patternKnot2",
    label: "매듭무늬 2 (pattern-1)",
    panel: "우상단",
    src: ASSETS.patternKnot,
    extraClassName: "opacity-30",
    defaults: { x: 22, y: 58, height: 22, width: 30, scale: 1.1 },
  },
  {
    key: "hat",
    label: "갓",
    panel: "좌하단",
    src: ASSETS.hat,
    imgClassName: "object-bottom",
    defaults: { x: -12, y: 36, height: 58, width: 100, scale: 1.3 },
  },
  {
    key: "cloud1",
    label: "구름 1",
    panel: "좌하단",
    src: ASSETS.cloud1,
    extraClassName: "opacity-90",
    defaults: { x: 8, y: 8, height: 16, width: 36, scale: 1.5 },
  },
  {
    key: "cloud2",
    label: "구름 2",
    panel: "좌하단",
    src: ASSETS.cloud2,
    extraClassName: "opacity-90",
    defaults: { x: 76, y: 58, height: 14, width: 24, scale: 1.5 },
  },
  {
    key: "patternSingle",
    label: "단일 문양",
    panel: "좌하단",
    src: ASSETS.patternSingle,
    extraClassName: "opacity-80",
    defaults: { x: 84, y: 4, height: 10, width: 10, scale: 1 },
  },
  {
    key: "mountain",
    label: "파도/산 문양",
    panel: "우하단",
    src: ASSETS.mountain,
    defaults: { x: 10, y: 48, height: 48, width: 118, scale: 1.4 },
  },
  {
    key: "house",
    label: "궁궐",
    panel: "우하단",
    src: ASSETS.house,
    defaults: { x: -86, y: 14, height: 46, width: 124, scale: 1 },
  },
  {
    key: "bell",
    label: "종",
    panel: "우하단",
    src: ASSETS.bell,
    defaults: { x: 26, y: 27, height: 14, width: 9, scale: 1 },
  },
];

function toStyle(v: Vals): CSSProperties {
  return {
    position: "absolute",
    left: `${v.x}%`,
    top: `${v.y}%`,
    height: `${v.height}%`,
    width: `${v.width}%`,
    transform: v.scale !== 1 ? `scale(${v.scale})` : undefined,
    transformOrigin: "center",
  };
}

function fmt(n: number) {
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

export function KMarkGraphicTuner() {
  const [state, setState] = useState<Record<string, Vals>>(() =>
    Object.fromEntries(ASSET_DEFS.map((a) => [a.key, { ...a.defaults }])),
  );
  const [wave, setWave] = useState<WaveVals>({ ...WAVE_DEFAULTS });
  const [counterRotate, setCounterRotate] = useState(true);

  const setField = (key: string, field: FieldKey, value: number) => {
    setState((prev) => ({ ...prev, [key]: { ...prev[key], [field]: value } }));
  };

  const setWaveField = (field: WaveFieldKey, value: number) => {
    setWave((prev) => ({ ...prev, [field]: value }));
  };

  const reset = () => {
    setState(
      Object.fromEntries(ASSET_DEFS.map((a) => [a.key, { ...a.defaults }])),
    );
    setWave({ ...WAVE_DEFAULTS });
    setCounterRotate(true);
  };

  const output = useMemo(() => {
    const assetLines = ASSET_DEFS.map((a) => {
      const v = state[a.key];
      return `${a.label}: 위치(top ${fmt(v.y)}%, left ${fmt(v.x)}%) 크기(height ${fmt(v.height)}%, width ${fmt(v.width)}%) 배율(${fmt(v.scale)}x)`;
    });
    const waveLine = `파도 레이어: 위치(top ${fmt(wave.y)}%, left ${fmt(wave.x)}%) 크기(height ${fmt(wave.height)}%, width ${fmt(wave.width)}%) viewBox(${fmt(wave.viewW)} x ${fmt(wave.viewH)}) 곡선(기준선 ${fmt(wave.baseline)}, 반지름 ${fmt(wave.radius)}, 여백 ${fmt(wave.bleed)}) 기울기(${fmt(wave.rotate)}deg) 반대회전(${counterRotate ? "ON" : "OFF"})`;
    return [...assetLines, waveLine].join("\n");
  }, [state, wave, counterRotate]);

  const get = (key: string) => state[key];

  return (
    <div className="grid grid-cols-1 gap-8 p-6 text-brand-ink lg:grid-cols-[1.8fr_1fr]">
      {/* 미리보기 */}
      <div className="flex flex-col items-center gap-4">
        <div className="sticky top-6 flex w-full flex-col items-center gap-4">
          <div
            aria-hidden="true"
            className="relative aspect-3/4 w-full max-w-260 overflow-hidden rounded-lg bg-brand-paper bg-[radial-gradient(circle_at_1px_1px,rgba(33,27,18,0.07)_1px,transparent_0)] bg-size-[22px_22px] p-4 shadow-inner"
          >
            {/* 좌상단 */}
            <div className={`absolute top-[6%] left-0 ${PANEL_SIZE}`}>
              <ArchPanel tone="purple" flip flatCorner="top" className="h-full w-full">
                <div style={toStyle(get("bibimbap"))}>
                  <Image src={ASSETS.bibimbap} alt="" fill sizes="600px" className="object-contain" />
                </div>
                <div style={toStyle(get("norigae"))}>
                  <Image src={ASSETS.norigae} alt="" fill sizes="600px" className="object-contain object-top" />
                </div>
              </ArchPanel>
            </div>

            {/* 우상단 */}
            <div
              className={`absolute top-[-15.8%] -right-1.5 ${PANEL_SIZE_RIGHT}`}
              style={{ clipPath: "polygon(-200% 30%, 300% 30%, 300% 300%, -200% 300%)" }}
            >
              <ArchPanel tone="vermillion" flip className="h-full w-full rotate-45">
                <div
                  style={{
                    position: "absolute",
                    left: `${wave.x}%`,
                    top: `${wave.y}%`,
                    width: `${wave.width}%`,
                    height: `${wave.height}%`,
                    transform: `rotate(${(counterRotate ? -45 : 0) + wave.rotate}deg)`,
                    transformOrigin: "center",
                  }}
                >
                  <svg
                    viewBox={`0 0 ${wave.viewW} ${wave.viewH}`}
                    preserveAspectRatio="none"
                    className="h-full w-full fill-brand-indigo-deep"
                  >
                    <path d={wavePath(wave)} />
                  </svg>
                </div>
                <div className="absolute inset-0 -rotate-45">
                  <div style={{ ...toStyle(get("patternLattice")), opacity: 0.3 }}>
                    <Image src={ASSETS.patternLattice} alt="" fill sizes="600px" className="object-contain" />
                  </div>
                  <div style={{ ...toStyle(get("patternLattice2")), opacity: 0.3 }}>
                    <Image src={ASSETS.patternLattice} alt="" fill sizes="600px" className="object-contain" />
                  </div>
                  <div style={{ ...toStyle(get("patternKnot")), opacity: 0.3 }}>
                    <Image src={ASSETS.patternKnot} alt="" fill sizes="600px" className="object-contain" />
                  </div>
                  <div style={{ ...toStyle(get("patternKnot2")), opacity: 0.3 }}>
                    <Image src={ASSETS.patternKnot} alt="" fill sizes="600px" className="object-contain" />
                  </div>
                </div>
              </ArchPanel>
            </div>

            {/* 좌하단 */}
            <div className={`absolute bottom-0 left-0 ${PANEL_SIZE}`}>
              <ArchPanel tone="jade" flatCorner="bottom" className="h-full w-full">
                <Image
                  src={ASSETS.patternedBg}
                  alt=""
                  fill
                  sizes="600px"
                  className="object-cover opacity-90"
                />
                <div style={toStyle(get("hat"))}>
                  <Image src={ASSETS.hat} alt="" fill sizes="600px" className="object-contain object-bottom" />
                </div>
                <div style={{ ...toStyle(get("cloud1")), opacity: 0.9 }}>
                  <Image src={ASSETS.cloud1} alt="" fill sizes="600px" className="object-contain" />
                </div>
                <div style={{ ...toStyle(get("cloud2")), opacity: 0.9 }}>
                  <Image src={ASSETS.cloud2} alt="" fill sizes="600px" className="object-contain" />
                </div>
                <div style={{ ...toStyle(get("patternSingle")), opacity: 0.8 }}>
                  <Image src={ASSETS.patternSingle} alt="" fill sizes="600px" className="object-contain" />
                </div>
              </ArchPanel>
            </div>

            {/* 우하단 */}
            <div
              className={`absolute -right-1.5 bottom-[-21%] ${PANEL_SIZE_RIGHT}`}
              style={{ clipPath: "polygon(-200% -200%, 300% -200%, 300% 70%, -200% 70%)" }}
            >
              <ArchPanel tone="indigo-deep" className="h-full w-full -rotate-45">
                <div className="absolute inset-0 rotate-45">
                  <div style={toStyle(get("mountain"))}>
                    <Image src={ASSETS.mountain} alt="" fill sizes="600px" className="object-cover object-bottom" />
                  </div>
                  <div style={toStyle(get("house"))}>
                    <Image src={ASSETS.house} alt="" fill sizes="600px" className="object-contain" />
                  </div>
                  <div style={toStyle(get("bell"))}>
                    <Image src={ASSETS.bell} alt="" fill sizes="600px" className="object-contain" />
                  </div>
                </div>
              </ArchPanel>
            </div>
          </div>
          <button
            type="button"
            onClick={reset}
            className="rounded-full border border-brand-ink/20 px-4 py-2 text-sm font-semibold hover:bg-brand-ink/5"
          >
            기본값으로 초기화
          </button>
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

        {(["좌상단", "우상단", "좌하단", "우하단"] as const).map((panel) => (
          <div key={panel} className="flex flex-col gap-5">
            <h3 className="text-lg font-bold text-brand-indigo">{panel}</h3>
            {ASSET_DEFS.filter((a) => a.panel === panel).map((a) => (
              <div key={a.key} className="rounded-lg border border-brand-ink/15 bg-white p-4">
                <p className="mb-3 text-sm font-bold">{a.label}</p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {(["x", "y", "height", "width", "scale"] as FieldKey[]).map((field) => {
                    const value = get(a.key)[field];
                    const isScale = field === "scale";
                    const range = isScale
                      ? SCALE_RANGE
                      : field === "height" || field === "width"
                        ? SIZE_RANGE
                        : POS_RANGE;
                    const step = isScale ? 0.1 : 2;
                    const unit = isScale ? "x" : "%";
                    return (
                      <label
                        key={field}
                        className={cn(
                          "flex flex-col gap-1 text-xs text-brand-ink-soft",
                          isScale && "sm:col-span-2",
                        )}
                      >
                        <span className="flex justify-between">
                          <span>{FIELD_LABEL[field]}</span>
                          <span className="font-mono">
                            {fmt(value)}
                            {unit}
                          </span>
                        </span>
                        <input
                          type="range"
                          min={range.min}
                          max={range.max}
                          step={step}
                          value={value}
                          onChange={(e) => setField(a.key, field, Number(e.target.value))}
                        />
                        <input
                          type="number"
                          step={step}
                          value={value}
                          onChange={(e) => setField(a.key, field, Number(e.target.value))}
                          className={cn("rounded border border-brand-ink/20 px-2 py-1 text-xs")}
                        />
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
            {panel === "우상단" && (
              <div className="rounded-lg border border-brand-ink/15 bg-white p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-bold">파도 레이어 (인디고 딥)</p>
                  <label className="flex items-center gap-1.5 text-xs text-brand-ink-soft">
                    <input
                      type="checkbox"
                      checked={counterRotate}
                      onChange={(e) => setCounterRotate(e.target.checked)}
                    />
                    반대 회전(무늬처럼 똑바로 세우기)
                  </label>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {(
                    [
                      "x",
                      "y",
                      "height",
                      "width",
                      "rotate",
                      "viewW",
                      "viewH",
                      "baseline",
                      "radius",
                      "bleed",
                    ] as WaveFieldKey[]
                  ).map((field) => {
                    const value = wave[field];
                    const range = WAVE_RANGES[field];
                    const isPercent = field === "x" || field === "y" || field === "height" || field === "width";
                    const unit = isPercent ? "%" : field === "rotate" ? "deg" : "";
                    const step = isPercent ? 2 : field === "rotate" ? 1 : 5;
                    return (
                      <label key={field} className="flex flex-col gap-1 text-xs text-brand-ink-soft">
                        <span className="flex justify-between">
                          <span>{WAVE_FIELD_LABEL[field]}</span>
                          <span className="font-mono">
                            {fmt(value)}
                            {unit}
                          </span>
                        </span>
                        <input
                          type="range"
                          min={range.min}
                          max={range.max}
                          step={step}
                          value={value}
                          onChange={(e) => setWaveField(field, Number(e.target.value))}
                        />
                        <input
                          type="number"
                          step={step}
                          value={value}
                          onChange={(e) => setWaveField(field, Number(e.target.value))}
                          className={cn("rounded border border-brand-ink/20 px-2 py-1 text-xs")}
                        />
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
