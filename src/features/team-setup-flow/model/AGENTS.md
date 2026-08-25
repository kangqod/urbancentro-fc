<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-08-25 | Updated: 2026-08-25 -->

# team-setup-flow/model

## Key Files

| File       | Description                                                                                                                                                                                                                                                                     |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `store.ts` | `enum TabMenu { TeamSetup, PlayerSelection, TeamDistribution }`; `useTeamSetupFlowStore = create()(devtools(immer(slice), { name: 'urbancentro-fc-team-setup-flow-store', enabled: !PROD }))`: `activeTab`, `isSharedView`, `setActiveTab`, `setIsSharedView`, `resetFlowState` |
| `types.ts` | `TeamSetupFlowState`, `TeamSetupFlowStore`                                                                                                                                                                                                                                      |
| `index.ts` | `./store` + `export type * from './types'`                                                                                                                                                                                                                                      |

## For AI Agents

### Working In This Directory

- 유일하게 immer+devtools 미들웨어를 쓰는 스토어. 뮤테이터 튜플 타입 `[['zustand/devtools', never], ['zustand/immer', never]]` 순서 유지.

<!-- MANUAL: -->
