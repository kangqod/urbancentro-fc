<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-08-25 | Updated: 2026-08-25 -->

# player-detail-modal/ui

## Key Files

| File                           | Description                                                                                                                                               |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `player-detail-modal.tsx`      | `PlayerDetailModal`: `React.lazy(() => import('@/features').then(m => ({ default: m.PlayerModal })))` + `Suspense`(빈 fallback). `player`, `onClose` 전달 |
| `player-detail-modal.hooks.ts` | `usePlayerDetailModal`(default export) → `{ selectedPlayer, handleModalClose }`. 닫기 = `updateSelectedPlayer()` 인자 없이 호출                           |

## For AI Agents

### Working In This Directory

- lazy import 는 무거운 모달을 초기 번들에서 분리하기 위한 것. 정적 import 로 바꾸지 말 것.

<!-- MANUAL: -->
