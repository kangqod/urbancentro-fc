<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-08-25 | Updated: 2026-08-25 -->

# player-modal

## Purpose

선수 상세 모달(티어·등번호·컨디션·강점·특징). `widgets/player-detail-modal`이 lazy 로드해 사용.

## Key Files

| File       | Description                                                         |
| ---------- | ------------------------------------------------------------------- |
| `index.ts` | `./ui` 만 재export(`lib`은 `@/features/player-modal/lib` 딥 import) |

## Subdirectories

| Directory | Purpose                                                       |
| --------- | ------------------------------------------------------------- |
| `lib/`    | `getTierColor(tier)` (see `lib/AGENTS.md`)                    |
| `ui/`     | `PlayerModal`, `Title`, `Contents`, SCSS (see `ui/AGENTS.md`) |

<!-- MANUAL: -->
