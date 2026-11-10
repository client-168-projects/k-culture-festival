# 파주K-컬처페스티벌

파주K-컬처페스티벌 공식 웹사이트와 공지사항/팝업 관리용 어드민입니다.

## 기술 스택

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS 4, Radix UI
- Cloudflare D1 (REST API), Supabase Storage
- Tiptap (공지 에디터), Recharts (방문 통계)
- 배포: Cloudflare Workers (OpenNext), Node.js

## 시작하기

```bash
npm install
npm run dev
```

## 스크립트

| 명령 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버 |
| `npm run build` / `npm start` | Node.js 빌드 및 실행 |
| `npm run lint` | ESLint |
| `npm run cf:preview` | Cloudflare 빌드 후 로컬 미리보기 |
| `npm run cf:deploy` | Cloudflare 빌드 및 배포 |

## 환경 변수

`.env.local`에 설정합니다.

| 변수 | 용도 |
| --- | --- |
| `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_D1_DATABASE_ID`, `CLOUDFLARE_API_TOKEN` | D1 접근 |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | 이미지/첨부파일 업로드 |
| `ADMIN_SESSION_SECRET` | 어드민 세션 서명 키 |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | GA4 수집 |
| `GA4_PROPERTY_ID`, `GA4_SERVICE_ACCOUNT_EMAIL`, `GA4_SERVICE_ACCOUNT_PRIVATE_KEY` | 어드민 통계 조회 |

## 디렉터리 구조

```
src/
  app/(site)/      공개 사이트 페이지
  app/admin/       어드민 페이지
  app/api/         라우트 핸들러
  components/      공용 컴포넌트 (ui/: 기본 UI, admin/: 어드민 전용)
  features/        기능 단위 모듈 (home, notice-popup)
  lib/             D1, 인증, 스토리지, GA4 등 서버/공용 로직
  constants/ data/ types/ stores/ config/
```
