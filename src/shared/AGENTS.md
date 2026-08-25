<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-08-25 | Updated: 2026-08-25 -->

# shared

## Purpose

도메인 무관 공용 코드: 유틸(lib), 재사용 UI(TabHeader/TabFooter/ReleaseDate), SCSS 자산(`--fc-*`·믹스인·데이터), 테스트 셋업.

## Key Files

| File       | Description                                                               |
| ---------- | ------------------------------------------------------------------------- |
| `index.ts` | `./lib`, `./ui` 재export (`assets`, `test`는 미포함 — 직접 경로로 import) |

## Subdirectories

| Directory | Purpose                                                                                      |
| --------- | -------------------------------------------------------------------------------------------- |
| `lib/`    | `build-version`, `csv`, `date`, `string`, `PRIMARY_COLOR` (see `lib/AGENTS.md`)              |
| `ui/`     | `ReleaseDate`, `TabHeader`, `TabFooter` (see `ui/AGENTS.md`)                                 |
| `assets/` | `_sport.scss`(`--fc-*`·스포츠 믹스인), `_variables.scss`(FOUC 폴백) (see `assets/AGENTS.md`) |
| `test/`   | vitest `setup.ts`, `renderWithProviders` (see `test/AGENTS.md`)                              |

## For AI Agents

### Working In This Directory

- 다른 레이어를 import 하지 않는다(`test/render.tsx`가 스토어 리셋을 위해 `@/entities/*` 를 참조하는 것이 유일한 예외 — 테스트 전용).

<!-- MANUAL: -->
