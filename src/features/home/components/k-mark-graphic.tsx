import Image from "next/image";

import { ArchPanel } from "./arch-panel";

const ASSETS = {
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
const PANEL_SIZE = "w-[40%] h-[47%]";
const PANEL_SIZE_RIGHT = "w-[40%] h-[75%]";

/** 4개 아치 패널을 동일한 크기로 맞춰 겹치지 않게 자유 배치한 히어로 시그니처 그래픽 */
export function KMarkGraphic() {
  return (
    <div
      aria-hidden="true"
      className="relative mr-auto -ml-2 aspect-3/4 w-full max-w-105 drop-shadow-[4px_6px_4px_rgba(33,27,18,0.4)] lg:-ml-6 lg:max-w-140 xl:max-w-160"
    >
      {/* 좌상단 — 비빔밥 + 노리개 */}
      <div className={`absolute top-[6%] left-0 ${PANEL_SIZE}`}>
        <ArchPanel
          tone="purple"
          flip
          flatCorner="top"
          className="h-full w-full"
        >
          <div className="absolute inset-x-[10%] top-[8%] h-[62%]">
            <Image
              src={ASSETS.bibimbap}
              alt=""
              fill
              sizes="200px"
              className="object-contain"
            />
          </div>
          <div className="absolute top-[24%] right-[5%] h-[72%] w-[18%]">
            <Image
              src={ASSETS.norigae}
              alt=""
              fill
              sizes="80px"
              className="object-contain object-top"
            />
          </div>
        </ArchPanel>
      </div>

      {/* 우상단 — 홍 물결: 가상의 수평 박스로 윗부분을 잘라냄 */}
      <div
        className={`absolute top-[-15.8%] -right-1.5 ${PANEL_SIZE_RIGHT}`}
        style={{
          clipPath:
            "polygon(-200% 30%, 300% 30%, 300% 300%, -200% 300%)",
        }}
      >
        <ArchPanel tone="vermillion" flip className="h-full w-full rotate-45">
          {/* 이미지 콘텐츠만 반대로 되돌려 회전 전 방향 유지 */}
          <div className="absolute inset-0 -rotate-45">
            <div className="absolute top-[16%] left-[26%] h-[24%] w-[24%] opacity-90">
              <Image
                src={ASSETS.patternKnot}
                alt=""
                fill
                sizes="60px"
                className="object-contain"
              />
            </div>
          </div>
        </ArchPanel>
      </div>

      {/* 좌하단 — 갓 + 구름 문양 */}
      <div className={`absolute bottom-0 left-0 ${PANEL_SIZE}`}>
        <ArchPanel tone="jade" flatCorner="bottom" className="h-full w-full">
          <Image
            src={ASSETS.patternedBg}
            alt=""
            fill
            sizes="200px"
            className="object-cover opacity-90"
          />
          <div className="absolute inset-x-[14%] bottom-[6%] h-[58%]">
            <Image
              src={ASSETS.hat}
              alt=""
              fill
              sizes="160px"
              className="object-contain object-bottom"
            />
          </div>
          <div className="absolute top-[8%] left-[8%] h-[16%] w-[30%] opacity-90">
            <Image
              src={ASSETS.cloud1}
              alt=""
              fill
              sizes="60px"
              className="object-contain"
            />
          </div>
          <div className="absolute top-[16%] right-[8%] h-[14%] w-[26%] opacity-90">
            <Image
              src={ASSETS.cloud2}
              alt=""
              fill
              sizes="60px"
              className="object-contain"
            />
          </div>
          <div className="absolute top-[4%] right-[6%] h-[10%] w-[10%] opacity-80">
            <Image
              src={ASSETS.patternSingle}
              alt=""
              fill
              sizes="30px"
              className="object-contain"
            />
          </div>
        </ArchPanel>
      </div>

      {/* 우하단 — 궁궐 + 산: 가상의 수평 박스로 아랫부분을 잘라냄 */}
      <div
        className={`absolute -right-1.5 bottom-[-21%] ${PANEL_SIZE_RIGHT}`}
        style={{
          clipPath:
            "polygon(-200% -200%, 300% -200%, 300% 70%, -200% 70%)",
        }}
      >
        <ArchPanel tone="indigo-deep" className="h-full w-full -rotate-45">
          {/* 이미지 콘텐츠만 반대로 되돌려 회전 전 방향 유지 */}
          <div className="absolute inset-0 rotate-45">
            <div className="absolute inset-x-0 bottom-0 h-[42%]">
              <Image
                src={ASSETS.mountain}
                alt=""
                fill
                sizes="200px"
                className="object-cover object-bottom"
              />
            </div>
            <div className="absolute inset-x-[24%] top-[28%] h-[40%]">
              <Image
                src={ASSETS.house}
                alt=""
                fill
                sizes="140px"
                className="object-contain"
              />
            </div>
            <div className="absolute top-[14%] left-[46%] h-[16%] w-[10%]">
              <Image
                src={ASSETS.bell}
                alt=""
                fill
                sizes="30px"
                className="object-contain"
              />
            </div>
          </div>
        </ArchPanel>
      </div>
    </div>
  );
}
