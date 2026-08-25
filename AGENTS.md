<!-- Generated: 2026-08-25 | Updated: 2026-08-25 -->

# urbancentro-fc

## Purpose

풋살(동네 축구) 팀 밸런싱 SPA. 선수 명단에서 참가자를 고르고 티어 가중치 기반으로 팀을 자동 분배하며, OCR로 참가자 텍스트를 인식하고 카카오톡/URL로 결과를 공유한다. GitHub Pages(`/urbancentro-fc`)에 정적 배포. 상세 작업 규칙은 `CLAUDE.md`가 단일 소스이며 이 문서는 구조 안내용이다.

## Key Files

| File                                                         | Description                                                                                                                                                                  |
| ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `package.json`                                               | pnpm 스크립트(`dev/build/lint/typecheck/test/verify/pages`)와 의존성. `verify`가 완료 게이트 SSOT                                                                            |
| `vite.config.ts`                                             | `base: '/urbancentro-fc'`, `@` alias, vitest(jsdom, `src/shared/test/setup.ts`), `__APP_BUILD_TIME__` define + `dist/build.json` 생성 플러그인, antd/lucide/vendor 수동 청크 |
| `tsconfig.json` / `tsconfig.app.json` / `tsconfig.node.json` | 솔루션 + 앱(ES2022, bundler, strict, vitest globals) + node(vite.config) 설정                                                                                                |
| `eslint.config.js`                                           | flat config: ts-eslint recommended + react-hooks + react-refresh, prettier 호환. `--max-warnings 0`                                                                          |
| `.prettierrc.json` / `.prettierignore`                       | printWidth 140, semi 없음, singleQuote. SCSS/CSS는 포맷 제외                                                                                                                 |
| `index.html`                                                 | Pretendard(jsDelivr) 프리로드, Kakao JS SDK 2.7.4(SRI), `#root`, 진입 `/src/app/index.tsx`                                                                                   |
| `CLAUDE.md`                                                  | 작업 규칙(스택·FSD·테마 토큰·SCSS 규칙·동작 동결·검증 게이트). 반드시 먼저 읽는다                                                                                            |
| `README.md`                                                  | 사용자용 소개(기능·알고리즘·배포). 일부 버전 표기가 구버전(antd 5/Vite 7)                                                                                                    |
| `mise.toml`                                                  | node 24.13.0 고정                                                                                                                                                            |
| `pnpm-workspace.yaml`                                        | `allowBuilds`: esbuild, tesseract.js, @parcel/watcher                                                                                                                        |

## Subdirectories

| Directory  | Purpose                                                                                           |
| ---------- | ------------------------------------------------------------------------------------------------- |
| `src/`     | 앱 소스, FSD 레이어(app/pages/widgets/features/entities/shared) (see `src/AGENTS.md`)             |
| `.github/` | CI(lint) + GitHub Pages 배포 워크플로 (see `.github/AGENTS.md`)                                   |
| `scripts/` | 빌드 후 `build.json` 정합성 게이트 (see `scripts/AGENTS.md`)                                      |
| `docs/`    | 과거 계획 문서 (see `docs/AGENTS.md`)                                                             |
| `public/`  | 정적 자산(파비콘) (see `public/AGENTS.md`)                                                        |
| `.claude/` | Claude Code Stop 훅 `verify-gate.sh`(`pnpm verify` 강제, 소스 해시로 스킵, 3회 실패 시 사람 개입) |
| `.vscode/` | 워크스페이스 TS SDK, 저장 시 ESLint fix + Prettier                                                |

## For AI Agents

### Working In This Directory

- 착수 시 `(범위 / 건드리지 말 것)` 1줄 선언, 종료 시 변경 요약 + `pnpm verify` 결과 보고(CLAUDE.md 프로토콜).
- 이벤트 핸들러·훅·상태 read/write·라우팅·밸런싱 로직·OCR·Kakao 연동은 리스타일 작업에서 변경 금지.
- 모든 응답·주석은 한국어. 장식성 주석 금지, 비자명한 제약만 한 줄.
- `.env`(Kakao 키)는 gitignore 대상. 커밋 금지. 로스터 CSV URL은 env가 아니라 `src/entities/player/lib/constants.ts` 상수.

### Testing Requirements

- `pnpm verify` exit 0 필수(lint → format:check → typecheck → test:run). `pnpm build`는 별도(느려서 훅 밖).
- 컴포넌트 테스트 커버리지가 제한적이라 렌더링·모션·반응형은 육안 QA 병행.

### Common Patterns

- 레이어 간 import는 `@/<layer>` 배럴(`index.ts`)만 사용. 같은 슬라이스 내부는 상대경로.
- 상태는 Zustand 싱글턴 스토어 + `useShallow` 셀렉터 훅(`lib/use-store.ts`).
- 스타일은 co-located 일반 SCSS(글로벌 클래스, `.dark-mode`/`.light-mode` 프리픽스), antd `var(--ant-color-*)` 소비, 브랜드 값은 `--fc-*`.

## Dependencies

### External

- React 19, antd 6, Zustand 5 (+immer), lucide-react, tesseract.js 7, Kakao JS SDK(CDN)
- Vite 8, TypeScript 6, Vitest 4 + Testing Library, ESLint 10, Prettier 3, sass, gh-pages

<!-- MANUAL: Any manually added notes below this line are preserved on regeneration -->
