export type ExperienceProgram = {
  title: string;
  capacity: string;
  sessions: string;
  /** 값이 있으면 카드에 "사전신청하러 가기" 버튼이 자동으로 표시된다. */
  applicationUrl?: string;
  /** 지정 시 그 시각(KST) 전까지는 버튼이 비활성화되고, 도달하면 자동으로 활성화된다. ISO datetime, 오프셋 명시 (예: "2026-08-31T10:00:00+09:00"). */
  applicationOpensAt?: string;
  /** true면 오픈 시각과 무관하게 버튼이 "사전신청 마감" 상태로 비활성화된다. */
  applicationClosed?: boolean;
  /** 메인 페이지 체험 프로그램 하이라이트 카드에서만 사용 */
  imageUrl?: string;
  /** K-전통 / K-문화 / K-공예 / K-간식 */
  category?: string;
  /** 체험 프로그램 페이지 카드 우측 하단에 작게 노출되는 안내 문구 (선택) */
  note?: string;
};

export const experiencePrograms: ExperienceProgram[] = [
  {
    title: "컬러 비즈 액막이 명태 만들기",
    capacity: "1회 8명",
    sessions: "상시 운영",
    imageUrl: "/assets/images/main/color-biz.png",
    category: "K-전통",
  },
  {
    title: "전통 부채 꾸미기",
    capacity: "1회 10명",
    sessions: "총 12회",
    category: "K-전통",
  },
  {
    title: "민화 엽서 컬러링",
    capacity: "1회 10명",
    sessions: "상시 운영",
    category: "K-전통",
  },
  {
    title: "자개 스티커 사각함 만들기",
    capacity: "1회 10명",
    sessions: "상시 운영",
    imageUrl: "/assets/images/main/sticker-box.png",
    category: "K-전통",
  },
  {
    title: "민화 팬시우드 공예 체험",
    capacity: "1회 10명",
    sessions: "총 6회",
    category: "K-전통",
  },
  {
    title: "한복키링 만들기",
    capacity: "1회 10명",
    sessions: "총 6회",
    category: "K-전통",
  },
  {
    title: "전통 민화 대왕 딱지 만들기",
    capacity: "1회 10명",
    sessions: "상시 운영",
    category: "K-전통",
  },
  {
    title: "전통의상 체험",
    capacity: "1회 15명",
    sessions: "총 6회",
    category: "K-전통",
  },
  {
    title: "친환경 전통 키링 만들기",
    capacity: "1회 15명",
    sessions: "총 18회",
    category: "K-전통",
  },
  {
    title: "십이지신 온도계 만들기",
    capacity: "1회 8명",
    sessions: "상시 운영",
    category: "K-전통",
  },
  {
    title: "탑로더 꾸미기",
    capacity: "1회 6명",
    sessions: "상시 운영",
    category: "K-문화",
  },
  {
    title: "북마크 만들기",
    capacity: "1회 10명",
    sessions: "상시 운영",
    category: "K-문화",
  },
  {
    title: "느린우체통 편지",
    capacity: "1회 6명",
    sessions: "상시 운영 (선착순 100통)",
    category: "K-문화",
  },
  {
    title: "타로카드",
    capacity: "1회 2명",
    sessions: "총 24회",
    category: "K-문화",
  },
  {
    title: "캐릭터 모자 만들기",
    capacity: "1회 8명",
    sessions: "상시 운영",
    category: "K-문화",
  },
  {
    title: "나만의 LED-K응원봉 만들기",
    capacity: "1회 10명",
    sessions: "총 7회",
    imageUrl: "/assets/images/main/kpop-stick.png",
    category: "K-문화",
  },
  {
    title: "생명의 탄생",
    capacity: "1회 20명",
    sessions: "총 7회",
    category: "K-문화",
  },
  {
    title: "K-프로필사진체험",
    capacity: "1회 6명",
    sessions: "총 6회",
    category: "K-문화",
  },
  {
    title: "원어민과 함께하는 쿠킹클래스 Ⅰ",
    capacity: "1회 5명",
    sessions: "총 3회",
    category: "K-문화",
    applicationUrl:
      "https://docs.google.com/forms/d/1MBhqYC2fsP9fBaQdIja0BuDH-j6YLUeOKSTHfBeZBAY/viewform?edit_requested=true",
    applicationOpensAt: "2026-08-31T10:00:00+09:00",
    applicationClosed: true,
  },
  {
    title: "원어민과 함께하는 쿠킹클래스 Ⅱ",
    capacity: "1회 50명",
    sessions: "총 2회",
    category: "K-문화",
    applicationUrl:
      "https://docs.google.com/forms/d/1Iw3M5U2JRTSR8iRpSLS_fDeqVRtteHDHA_h56G_kd3s/viewform?edit_requested=true",
    applicationOpensAt: "2026-08-31T10:00:00+09:00",
  },
  {
    title: "키캡키링 만들기",
    capacity: "1회 10명",
    sessions: "총 14회",
    imageUrl: "/assets/images/main/keyring.png",
    category: "K-공예",
  },
  {
    title: "매듭실 소원팔찌 만들기",
    capacity: "1회 10명",
    sessions: "총 6회",
    category: "K-공예",
  },
  {
    title: "양말목 키링 만들기",
    capacity: "1회 10명",
    sessions: "총 14회",
    category: "K-공예",
  },
  {
    title: "클레이뮤지엄과 함께하는 도예체험",
    capacity: "1회 6명",
    sessions: "총 6회",
    category: "K-공예",
  },
  {
    title: "꽃으로 만드는 소품",
    capacity: "1회 10명",
    sessions: "총 30회",
    category: "K-공예",
  },
  {
    title: "원어민과 함께하는 무궁화 스트링아트",
    capacity: "1회 120명",
    sessions: "총 6회",
    category: "K-공예",

  },
  {
    title: "전통무늬 친환경 샴푸바 만들기",
    capacity: "1회 6명",
    sessions: "총 24회",
    category: "K-공예",
  },
  {
    title: "업싸이클 바다유리 무드등 만들기",
    capacity: "1회 6명",
    sessions: "총 24회",
    category: "K-공예",
  },
  {
    title: "전통무늬 석고 방향제 만들기",
    capacity: "1회 10명",
    sessions: "총 2회",
    category: "K-공예",
  },
  {
    title: "테라리움 만들기",
    capacity: "1회 5명",
    sessions: "총 6회",
    category: "K-공예",
  },
  {
    title: "자전거 발전기 솜사탕",
    capacity: "1회 2명",
    sessions: "상시 운영",
    category: "K-간식",
  },
  {
    title: "달고나 체험",
    capacity: "1회 10명",
    sessions: "상시 운영",
    imageUrl: "/assets/images/main/dalgona.png",
    category: "K-간식",
  },
];
