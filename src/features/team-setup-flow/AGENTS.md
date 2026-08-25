<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-08-25 | Updated: 2026-08-25 -->

# team-setup-flow

## Purpose

앱의 메인 플로우. `TabMenu`(팀 구성 → 선수 선택 → 팀 분배) 상태, 공유링크 직렬화/복원, 세 탭의 UI.

## Key Files

| File       | Description                         |
| ---------- | ----------------------------------- |
| `index.ts` | `./lib`, `./model`, `./ui` 재export |

## Subdirectories

| Directory | Purpose                                                                                             |
| --------- | --------------------------------------------------------------------------------------------------- |
| `model/`  | `TabMenu` enum, `useTeamSetupFlowStore`(devtools+immer) (see `model/AGENTS.md`)                     |
| `lib/`    | `TEAMS_PARAMS`, 공유링크 파서 `buildSharedPlayer/parseSharedTeams`, 셀렉터 훅 (see `lib/AGENTS.md`) |
| `ui/`     | `TeamSetupFlow` Tabs, `PlayerSmallCard`, 탭별 하위 디렉터리 (see `ui/AGENTS.md`)                    |

## For AI Agents

### Working In This Directory

- 탭 이동은 **푸터 버튼 → `setActiveTab`** 으로만 한다. antd Tabs에 `onChange`가 없고 비활성 탭은 CSS로 disabled 처리돼 있다.
- 공유링크 포맷은 인코더(`ui/team-distribution/footer.hooks.ts`)·디코더(`lib/utils.ts`)·테스트(`lib/__tests__`)·`pages/main/lib/initialize.ts` 네 곳이 한 세트.

<!-- MANUAL: -->
