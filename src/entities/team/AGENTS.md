<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-08-25 | Updated: 2026-08-25 -->

# team

## Purpose

팀 도메인. 매치 포맷 정의, 팀 밸런싱 알고리즘과 점수 함수, 팀 상태 스토어, 탑독/언더독 계산, 카카오 공유 호출.

## Key Files

| File       | Description                 |
| ---------- | --------------------------- |
| `index.ts` | `./lib`, `./model` 재export |

## Subdirectories

| Directory | Purpose                                                                                         |
| --------- | ----------------------------------------------------------------------------------------------- |
| `lib/`    | `constants`, `balance-teams`, `balance-score`, `team-rank`, `share-kakao` (see `lib/AGENTS.md`) |
| `model/`  | `useTeamStore`, `Team`/`MatchFormatType`/`ShareKakaoContent` 타입 (see `model/AGENTS.md`)       |

## For AI Agents

### Working In This Directory

- 밸런싱 로직은 CLAUDE.md "동작 동결" 대상. 리스타일·리팩터 작업에서 변경 금지.

<!-- MANUAL: -->
