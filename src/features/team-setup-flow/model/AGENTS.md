# team-setup-flow/model

**Parent context:** `../AGENTS.md`
**Generated:** 2026-08-25 · **Updated:** 2026-11-24

## Key Files

| File       | Description                                                                                                                                                                                                                                                                     |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `store.ts` | `enum TabMenu { TeamSetup, PlayerSelection, TeamDistribution }`; `useTeamSetupFlowStore = create()(devtools(immer(slice), { name: 'urbancentro-fc-team-setup-flow-store', enabled: !PROD }))`: `activeTab`, `isSharedView`, `setActiveTab`, `setIsSharedView`, `resetFlowState` |
| `types.ts` | `TeamSetupFlowState`, `TeamSetupFlowStore`                                                                                                                                                                                                                                      |
| `index.ts` | `./store` + `export type * from './types'`                                                                                                                                                                                                                                      |

## For AI Agents

### Working In This Directory

- 유일하게 immer+devtools 미들웨어를 쓰는 스토어. 뮤테이터 튜플 타입 `[['zustand/devtools', never], ['zustand/immer', never]]` 순서 유지.

## Manual Notes

이 제목 아래는 사람이 작성한 메모이며 재생성 시 보존된다.
