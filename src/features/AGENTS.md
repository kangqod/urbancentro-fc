<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-08-25 | Updated: 2026-08-25 -->

# features

## Purpose

사용자 시나리오 단위 기능. 핵심은 3탭 플로우(`team-setup-flow`: 팀 구성 → 선수 선택 → 팀 분배)이고, 선수 상세 모달·OCR 명단 인식·카카오 SDK 초기화·테마 토글이 보조한다.

## Key Files

| File       | Description           |
| ---------- | --------------------- |
| `index.ts` | 5개 슬라이스 재export |

## Subdirectories

| Directory          | Purpose                                                                                |
| ------------------ | -------------------------------------------------------------------------------------- |
| `team-setup-flow/` | 탭 플로우 스토어·공유링크 직렬화·3개 탭 UI (see `team-setup-flow/AGENTS.md`)           |
| `player-modal/`    | 선수 상세 모달 UI + `getTierColor` (see `player-modal/AGENTS.md`)                      |
| `tesseract/`       | 이미지 업로드 → tesseract.js OCR → 로스터 매칭 → 선택 반영 (see `tesseract/AGENTS.md`) |
| `kakao-loader/`    | `window.Kakao.init(VITE_KAKAO_JS_KEY)` 렌더리스 컴포넌트                               |
| `theme/`           | 다크/라이트 토글 버튼 (see `theme/AGENTS.md`)                                          |

## For AI Agents

### Working In This Directory

- entities/shared 만 import 가 원칙. 예외로 `player-selection/guest-button.tsx → @/features/tesseract`, `team-distribution/{container,team-balance-log}.tsx → @/features/player-modal/lib` 두 개의 크로스 피처 import 가 있다. 늘리지 말 것.
- 스토어 읽기는 슬라이스 `lib/use-store.ts`의 `use…Value`/`use…State` 훅으로만(`footer.hooks.ts`의 `useTeamSetupFlowStore()` 직접 구조분해가 유일한 예외).
- feature SCSS에는 `.dark-mode/.light-mode` 셀렉터를 쓰지 않는다. `--ant-*`와 `--fc-*`(인라인 다크 폴백 포함)만 소비.

### Testing Requirements

- RTL 테스트: `guest-modal.test.tsx`, `team-distribution/__tests__/*`. 단위: `lib/__tests__/shared-player.test.ts`. 그 외 화면은 육안 QA.

<!-- MANUAL: -->
