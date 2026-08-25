<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-08-25 | Updated: 2026-08-25 -->

# player-detail-modal

## Purpose

선택된 선수(`usePlayerStore.selectedPlayer`)가 있으면 `features/player-modal`의 `PlayerModal`을 lazy 로드해 띄우는 위젯.

## Key Files

| File       | Description                         |
| ---------- | ----------------------------------- |
| `index.ts` | `./ui/player-detail-modal` 재export |

## Subdirectories

| Directory | Purpose                                               |
| --------- | ----------------------------------------------------- |
| `lib/`    | `useSelectedPlayerState` 셀렉터 (see `lib/AGENTS.md`) |
| `ui/`     | 모달 래퍼 컴포넌트·훅 (see `ui/AGENTS.md`)            |

## For AI Agents

### Working In This Directory

- 모달 내용(필드·레이아웃)은 `src/features/player-modal`에 있다. 여기는 열기/닫기 배선만.

<!-- MANUAL: -->
