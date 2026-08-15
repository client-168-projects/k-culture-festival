"use client";

import type { CSSProperties, TransitionEvent } from "react";
import { useEffect, useState } from "react";
import Image from "next/image";

import { ArchPanel } from "@/components/arch-panel";

export const ASSETS = {
  bibimbap: "/assets/main/left-top/bibimbap.png",
  norigae: "/assets/main/left-top/norigae.png",
  hat: "/assets/main/left-bottom/assets.png",
  cloud1: "/assets/main/left-bottom/cloud-1.png",
  cloud2: "/assets/main/left-bottom/cloud-2.png",
  patternSingle: "/assets/main/left-bottom/pattern-single.png",
  patternedBg: "/assets/main/left-bottom/patterned-background.png",
  patternKnot: "/assets/main/right-top/pattern-1.png",
  patternLattice: "/assets/main/right-top/pattern-2.png",
  bell: "/assets/main/right-bottom/bell.png",
  house: "/assets/main/right-bottom/house.png",
  mountain: "/assets/main/right-bottom/mountain.png",
} as const;

// 좌/우 모두 너비는 동일. 우측 두 도형만 길이를 더 길게 키움(겹치지 않도록 바깥으로 밀어서 배치).
export const PANEL_SIZE = "w-[40%] h-[47%]";
export const PANEL_SIZE_RIGHT = "w-[40%] h-[75%]";

/** clip-path: inset(top right bottom left) 4개 값(%) — /dev/k-intro-tuner에서 조절 */
export type MaskInset = { top: number; right: number; bottom: number; left: number };

// 마스킹 박스 — /dev/k-intro-tuner에서 실측/조정한 값 (박스 너비 150%, 높이 106%, 위치 X 11%, Y 4%)
export const DEFAULT_MASK_INSET: MaskInset = {
  top: 1,
  right: -36,
  bottom: -7,
  left: -14,
};

// 페이지 로드 시 4개 도형이 날아와 K 모형으로 모이는 인트로. /dev/k-intro-tuner에서 값을 잡았다.
// 도착(최종) 위치·각도는 항상 "지금 코드의 실제 배치"(translate 0, rotate 0)이고,
// 아래는 거기서부터의 시작 오프셋 — dx/dy는 이 캔버스 너비/높이 대비 %(cqw/cqh), rotate는 deg.
// power=4, duration 1800ms — duration을 넉넉히 확보한 상태라 초반 속도(power)를
// 다시 올려도 도착 직전 감속 구간의 절대 시간이 충분해 감속이 잘 느껴진다.
const INTRO_DURATION_MS = 1800;
const INTRO_EASING =
  "linear(0.0000, 0.1193, 0.2275, 0.3255, 0.4138, 0.4932, 0.5642, 0.6275, 0.6836, 0.7331, 0.7766, 0.8145, 0.8474, 0.8757, 0.8999, 0.9203, 0.9375, 0.9517, 0.9634, 0.9728, 0.9802, 0.9860, 0.9905, 0.9937, 0.9961, 0.9977, 0.9988, 0.9994, 0.9998, 0.9999, 1.0000, 1.0000, 1.0000)";

const INTRO_PANELS = {
  topLeft: { dx: 2, dy: -60, rotate: -35, delay: 0 },
  topRight: { dx: 75, dy: -60, rotate: 35, delay: 90 },
  bottomLeft: { dx: 10, dy: 60, rotate: 35, delay: 180 },
  bottomRight: { dx: 75, dy: 60, rotate: -35, delay: 270 },
} as const;

// 호버 시 각 패널이 K 모형 중심에서 바깥쪽(자기 사분면 방향)으로만 살짝
// 밀려나도록 방향을 잡는다 — 서로 반대쪽으로 갈라지므로 다른 패널과
// 겹칠 일이 없다. 단위는 인트로와 동일하게 cqw/cqh, deg.
const HOVER_OFFSETS = {
  topLeft: { dx: -4, dy: -2.5, rotate: -4 },
  topRight: { dx: 4.5, dy: -2.5, rotate: 4 },
  bottomLeft: { dx: -4, dy: 2.5, rotate: -4 },
  bottomRight: { dx: 4.5, dy: 2.5, rotate: 4 },
} as const;
const HOVER_TRANSITION_MS = 450;
// 히어로 배경 슬라이드인(globals.css --animate-hero-slide-*)과 동일한 감속
// 곡선 — 빠르게 출발해 도착 직전 확실히 감속하는 모양이라 호버로 살짝
// 밀려났다 돌아오는 움직임에도 그대로 어울린다.
const HOVER_EASING = "cubic-bezier(0.16, 1, 0.3, 1)";

function panelStyle(
  panel: keyof typeof INTRO_PANELS,
  played: boolean,
  introDone: boolean,
  hovered: boolean,
  startDelayMs: number,
): CSSProperties {
  const p = INTRO_PANELS[panel];

  if (!introDone) {
    return {
      transform: played
        ? "translate(0%, 0%) rotate(0deg)"
        : `translate(${p.dx}cqw, ${p.dy}cqh) rotate(${p.rotate}deg)`,
      // 트랜지션 종료 시 컴포지팅 레이어가 승격→해제되면서 생기는 서브픽셀 스냅(도착
      // 직후 미세하게 크기가 변해 보이는 현상) 방지 — 레이어를 계속 유지시킨다.
      willChange: "transform",
      transitionProperty: "transform",
      transitionDuration: `${INTRO_DURATION_MS}ms`,
      transitionTimingFunction: INTRO_EASING,
      transitionDelay: `${startDelayMs + p.delay}ms`,
    };
  }

  const h = hovered ? HOVER_OFFSETS[panel] : { dx: 0, dy: 0, rotate: 0 };
  return {
    transform: `translate(${h.dx}cqw, ${h.dy}cqh) rotate(${h.rotate}deg)`,
    willChange: "transform",
    transitionProperty: "transform",
    transitionDuration: `${HOVER_TRANSITION_MS}ms`,
    transitionTimingFunction: HOVER_EASING,
  };
}

/** 4개 아치 패널을 동일한 크기로 맞춰 겹치지 않게 자유 배치한 히어로 시그니처 그래픽 */
export function KMarkGraphic({
  maskInset = DEFAULT_MASK_INSET,
  startDelayMs = 0,
}: {
  /** 마스킹 박스 조절용(/dev/k-intro-tuner). 프로덕션에서는 생략 — 기본값 사용 */
  maskInset?: MaskInset;
  /** 히어로 섹션의 다른 요소(배경/타이틀/버튼)가 먼저 등장한 뒤에 조립이 시작되도록 미루는 시간 */
  startDelayMs?: number;
} = {}) {
  const [played, setPlayed] = useState(false);
  // 인트로 트랜지션이 실제로 끝난 뒤에만 호버 인터랙션을 켠다 — 그 전에 켜두면
  // 인트로용(1800ms) 트랜지션 타이밍과 호버용(220ms) 타이밍이 같은 렌더에서
  // 뒤섞여 도착 애니메이션이 순간이동하듯 끊겨 보인다.
  const [introDone, setIntroDone] = useState(false);
  const [hoveredPanel, setHoveredPanel] = useState<
    keyof typeof INTRO_PANELS | null
  >(null);

  useEffect(() => {
    // 시작 위치가 먼저 페인트된 뒤에 전환이 걸리도록 rAF를 두 번 거친다.
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setPlayed(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, []);

  const onIntroTransitionEnd = (event: TransitionEvent) => {
    if (event.propertyName === "transform") setIntroDone(true);
  };

  return (
    <div
      aria-hidden="true"
      className="relative mr-auto -ml-2 aspect-3/4 w-full max-w-120 drop-shadow-[4px_6px_4px_rgba(33,27,18,0.4)] lg:-ml-6 lg:max-w-165 xl:max-w-190 @container-size"
      style={{
        // 마스킹 박스: 밖에서 날아 들어오는 도형이 이 영역 밖에서는 보이지 않도록
        // 가린다. 값은 DEFAULT_MASK_INSET 참고(/dev/k-intro-tuner에서 조절).
        clipPath: `inset(${maskInset.top}% ${maskInset.right}% ${maskInset.bottom}% ${maskInset.left}%)`,
      }}
    >
      {/* 좌상단 — 비빔밥 + 노리개 */}
      <div
        className={`absolute top-[6%] left-0 ${PANEL_SIZE}`}
        style={panelStyle("topLeft", played, introDone, hoveredPanel === "topLeft", startDelayMs)}
        onTransitionEnd={onIntroTransitionEnd}
        onMouseEnter={() => setHoveredPanel("topLeft")}
        onMouseLeave={() => setHoveredPanel(null)}
      >
        <ArchPanel
          tone="purple"
          flip
          flatCorner="top"
          className="h-full w-full"
        >
          <div className="absolute top-[14%] left-[-44%] h-[74%] w-[136%]">
            <Image
              src={ASSETS.bibimbap}
              alt=""
              fill
              priority
              sizes="400px"
              className="object-contain"
            />
          </div>
          <div className="absolute top-[6%] left-[44%] h-[72%] w-[76%] scale-[1.2]">
            <Image
              src={ASSETS.norigae}
              alt=""
              fill
              priority
              sizes="400px"
              className="object-contain object-top"
            />
          </div>
        </ArchPanel>
      </div>

      {/* 우상단 — 홍 물결: 가상의 수평 박스로 윗부분을 잘라냄 */}
      <div
        className={`absolute top-[-15.8%] -right-1.5 ${PANEL_SIZE_RIGHT}`}
        style={{
          clipPath: "polygon(-200% 30%, 300% 30%, 300% 300%, -200% 300%)",
          ...panelStyle("topRight", played, introDone, hoveredPanel === "topRight", startDelayMs),
        }}
        onTransitionEnd={onIntroTransitionEnd}
        onMouseEnter={() => setHoveredPanel("topRight")}
        onMouseLeave={() => setHoveredPanel(null)}
      >
        <ArchPanel tone="vermillion" flip className="h-full w-full rotate-45">
          {/* 이미지 콘텐츠만 반대로 되돌려 회전 전 방향 유지 */}
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
            <div className="absolute top-[36%] left-[4%] h-[18%] w-[34%] opacity-30">
              <Image
                src={ASSETS.patternLattice}
                alt=""
                fill
                priority
                sizes="400px"
                className="object-contain"
              />
            </div>
            <div className="absolute top-[58%] left-[-40%] h-[40%] w-[36%] opacity-30">
              <Image
                src={ASSETS.patternLattice}
                alt=""
                fill
                priority
                sizes="400px"
                className="object-contain"
              />
            </div>
            <div className="absolute top-[22%] left-[72%] h-[30%] w-[34%] opacity-30">
              <Image
                src={ASSETS.patternKnot}
                alt=""
                fill
                priority
                sizes="400px"
                className="object-contain"
              />
            </div>
            <div className="absolute top-[58%] left-[22%] h-[22%] w-[30%] scale-[1.1] opacity-30">
              <Image
                src={ASSETS.patternKnot}
                alt=""
                fill
                priority
                sizes="400px"
                className="object-contain"
              />
            </div>
          </div>
        </ArchPanel>
      </div>

      {/* 좌하단 — 갓 + 구름 문양 */}
      <div
        className={`absolute bottom-0 left-0 ${PANEL_SIZE}`}
        style={panelStyle("bottomLeft", played, introDone, hoveredPanel === "bottomLeft", startDelayMs)}
        onTransitionEnd={onIntroTransitionEnd}
        onMouseEnter={() => setHoveredPanel("bottomLeft")}
        onMouseLeave={() => setHoveredPanel(null)}
      >
        <ArchPanel
          tone="jade"
          flatCorner="bottom"
          className="h-full w-full [container-type:inline-size]"
        >
          <Image
            src={ASSETS.patternedBg}
            alt=""
            fill
            priority
            sizes="400px"
            className="object-cover opacity-90"
          />
          <div className="absolute top-[36%] left-[-12%] h-[58%] w-full scale-[1.3]">
            <Image
              src={ASSETS.hat}
              alt=""
              fill
              priority
              sizes="400px"
              className="object-contain object-bottom"
            />
          </div>
          <div className="absolute top-[4%] left-[84%] h-[10%] w-[10%] opacity-80">
            <Image
              src={ASSETS.patternSingle}
              alt=""
              fill
              priority
              sizes="400px"
              className="object-contain"
            />
          </div>
          <div className="absolute top-[8%] left-[8%] h-[16%] w-[36%] scale-[1.5] opacity-90 animate-cloud-drift-1">
            <Image
              src={ASSETS.cloud1}
              alt=""
              fill
              priority
              sizes="400px"
              className="object-contain"
            />
          </div>
          <div
            className="absolute top-[58%] left-[76%] h-[14%] w-[24%] scale-[1.5] opacity-90 animate-cloud-drift-2"
            style={{ animationDuration: "9s", animationDelay: "-3s" }}
          >
            <Image
              src={ASSETS.cloud2}
              alt=""
              fill
              priority
              sizes="400px"
              className="object-contain"
            />
          </div>
        </ArchPanel>
      </div>

      {/* 우하단 — 궁궐 + 산: 가상의 수평 박스로 아랫부분을 잘라냄 */}
      <div
        className={`absolute -right-1.5 bottom-[-21%] ${PANEL_SIZE_RIGHT}`}
        style={{
          clipPath: "polygon(-200% -200%, 300% -200%, 300% 70%, -200% 70%)",
          ...panelStyle("bottomRight", played, introDone, hoveredPanel === "bottomRight", startDelayMs),
        }}
        onTransitionEnd={onIntroTransitionEnd}
        onMouseEnter={() => setHoveredPanel("bottomRight")}
        onMouseLeave={() => setHoveredPanel(null)}
      >
        <ArchPanel tone="indigo-deep" className="h-full w-full -rotate-45">
          {/* 이미지 콘텐츠만 반대로 되돌려 회전 전 방향 유지 */}
          <div className="absolute inset-0 rotate-45">
            <div className="absolute top-[14%] left-[-86%] h-[46%] w-[124%]">
              <Image
                src={ASSETS.house}
                alt=""
                fill
                priority
                sizes="400px"
                className="object-contain"
              />
            </div>
            <div
              className="absolute top-[27%] left-[26%] h-[14%] w-[9%] origin-[50%_8%] animate-bell-sway"
            >
              <Image
                src={ASSETS.bell}
                alt=""
                fill
                priority
                sizes="400px"
                className="object-contain"
              />
            </div>
            <div className="absolute top-[48%] left-[20%] h-[48%] w-[140%] scale-[1.4]">
              <Image
                src={ASSETS.mountain}
                alt=""
                fill
                priority
                sizes="400px"
                className="object-cover object-bottom"
              />
            </div>
          </div>
        </ArchPanel>
      </div>
    </div>
  );
}
