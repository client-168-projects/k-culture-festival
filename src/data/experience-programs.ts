export type ExperienceProgram = {
  title: string;
  capacity: string;
  sessions: string;
  /** 값이 있으면 카드에 "사전신청하러 가기" 버튼이 자동으로 표시된다. */
  applicationUrl?: string;
  /** 메인 페이지 체험 프로그램 하이라이트 카드에서만 사용 */
  imageUrl?: string;
  /** 메인 페이지 체험 프로그램 하이라이트 카드에서만 사용 */
  category?: string;
};

export const experiencePrograms: ExperienceProgram[] = [
  { title: "컬러 비즈 액막이 명태 만들기", capacity: "1회 8명", sessions: "상시 운영", applicationUrl: "www.google.com" },
  {
    title: "키캡키링 만들기",
    capacity: "1회 10명",
    sessions: "총 14회",
    imageUrl: "/assets/images/main/keyring.png",
    category: "공예·만들기",
  },
  {
    title: "전통 부채 꾸미기",
    capacity: "1회 10명",
    sessions: "총 14회",
    imageUrl: "/assets/images/main/korean-fan.png",
    category: "전통문화",
  },
  { title: "민화 엽서 컬러링", capacity: "1회 10명", sessions: "상시 운영" },
  {
    title: "자개 스티커 손거울 만들기",
    capacity: "1회 10명",
    sessions: "상시 운영",
    imageUrl: "/assets/images/main/sticker-hand-mirror.png",
    category: "전통문화",
  },
  { title: "탑로더 꾸미기", capacity: "1회 6명", sessions: "상시 운영" },
  { title: "매듭실 소원팔찌 만들기", capacity: "1회 10명", sessions: "총 7회", applicationUrl: "www.google.com" },
  { title: "자전거 발전기 솜사탕", capacity: "1회 2명", sessions: "상시 운영" },
  { title: "팝콘 즐기기", capacity: "1회 1명", sessions: "상시 운영" },
  { title: "K-POP 팬사인회 및 굿즈판매", capacity: "미정", sessions: "미정" },
  { title: "북마크 만들기", capacity: "1회 10명", sessions: "상시 운영", applicationUrl: "www.google.com" },
  { title: "십이지신 온도계 만들기", capacity: "1회 8명", sessions: "상시 운영", applicationUrl: "www.google.com" },
  { title: "민화 팬시우드 공예 체험", capacity: "1회 10명", sessions: "총 7회" },
  { title: "한복키링 만들기", capacity: "1회 10명", sessions: "총 7회" },
  { title: "전통 민화 대왕 딱지 만들기", capacity: "1회 10명", sessions: "상시 운영" },
  { title: "느린우체통 편지", capacity: "1회 6명", sessions: "상시 운영 (선착순 100통)" },
  { title: "타로카드", capacity: "1회 2명", sessions: "총 24회" },
  {
    title: "달고나 만들기",
    capacity: "1회 10명",
    sessions: "상시 운영",
    imageUrl: "/assets/images/main/dalgona.png",
    category: "음식·간식",
  },
  { title: "양말목 키링 만들기", capacity: "1회 10명", sessions: "총 14회" },
  { title: "전통의상 체험", capacity: "1회 15명", sessions: "총 17회" },
  {
    title: "나만의 LED-K응원봉 만들기",
    capacity: "1회 10명",
    sessions: "총 7회",
    imageUrl: "/assets/images/main/kpop-stick.png",
    category: "K-POP",
  },
  { title: "생명의 탄생", capacity: "1회 20명", sessions: "총 7회" },
  { title: "클레이뮤지엄과 함께하는 도예체험", capacity: "1회 6명", sessions: "총 6회" },
  { title: "K-프로필사진체험", capacity: "1회 6명", sessions: "총 6회" },
  { title: "꽃으로 만드는 소품", capacity: "1회 10명", sessions: "총 30회" },
  { title: "원어민과 함께하는 쿠킹클래스 Ⅰ", capacity: "1회 50명", sessions: "총 4회" },
  { title: "원어민과 함께하는 쿠킹클래스 Ⅱ", capacity: "1회 50명", sessions: "총 4회" },
  { title: "원어민과 함께하는 무궁화 스트링아트", capacity: "1회 90명", sessions: "총 6회" },
  { title: "전통무늬 친환경 샴푸바 만들기", capacity: "1회 6명", sessions: "총 24회" },
  { title: "업싸이클 바다유리 무드등 만들기", capacity: "1회 6명", sessions: "총 24회" },
  { title: "친환경 전통 키링 만들기", capacity: "1회 15명", sessions: "총 18회" },
  { title: "전통무늬 석고 방향제 만들기", capacity: "1회 10명", sessions: "총 2회" },
];
