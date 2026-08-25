<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-08-25 | Updated: 2026-08-25 -->

# src

## Purpose

앱 소스 루트. Feature-Sliced Design 레이어로 나뉘며 상위 레이어만 하위 레이어를 import 한다(app → pages → widgets → features → entities → shared).

## Key Files

| File            | Description                                              |
| --------------- | -------------------------------------------------------- |
| `vite-env.d.ts` | `vite/client` 타입 참조 + `__APP_BUILD_TIME__` 전역 선언 |

## Subdirectories

| Directory   | Purpose                                                                                         |
| ----------- | ----------------------------------------------------------------------------------------------- |
| `app/`      | 진입점, antd `ConfigProvider` 토큰(테마 단일 소스), 전역 SCSS (see `app/AGENTS.md`)             |
| `pages/`    | 메인 페이지 셸·초기화 훅 (see `pages/AGENTS.md`)                                                |
| `widgets/`  | 헤더, 선수 상세 모달 래퍼 (see `widgets/AGENTS.md`)                                             |
| `features/` | 팀 구성 플로우(3탭), 선수 모달, OCR, 카카오 초기화, 테마 토글 (see `features/AGENTS.md`)        |
| `entities/` | player/team/theme 도메인: 타입·스토어·밸런싱 알고리즘·로스터 로딩 (see `entities/AGENTS.md`)    |
| `shared/`   | 공용 lib(csv·build-version)·UI(TabHeader/Footer)·SCSS 자산·테스트 셋업 (see `shared/AGENTS.md`) |

## For AI Agents

### Working In This Directory

- 레이어 간 import는 `@/<layer>` 배럴만. 예외로 `@/features/player-modal/lib`, `@/features/tesseract`, `@/shared/assets/*`, `@/shared/test/render` 딥 import가 존재한다.
- 각 슬라이스는 `index.ts` 배럴 + `lib/`(로직·셀렉터) + `model/`(스토어·타입) + `ui/`(컴포넌트·co-located SCSS) 구조.
- `src/.omc/`가 보이면 도구 상태 디렉터리(gitignore)이며 앱 코드가 아니다.

### Testing Requirements

- 테스트는 각 디렉터리의 `__tests__/`에 두고 `pnpm test:run`으로 실행. jsdom + `shared/test/setup.ts`(fetch 차단, matchMedia 스텁).

<!-- MANUAL: -->
