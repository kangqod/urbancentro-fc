<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-08-25 | Updated: 2026-08-25 -->

# entities

## Purpose

도메인 레이어. 선수(player)·팀(team)·테마(theme)의 타입, Zustand 스토어, 순수 로직(밸런싱·로스터 로딩·카카오 공유 호출)을 담는다. UI 없음.

## Key Files

| File       | Description                              |
| ---------- | ---------------------------------------- |
| `index.ts` | `./player`, `./team`, `./theme` 재export |

## Subdirectories

| Directory | Purpose                                                                                                     |
| --------- | ----------------------------------------------------------------------------------------------------------- |
| `player/` | `Player`/`PlayerClass`, 티어·컨디션 상수, `usePlayerStore`, 로스터 스토어·CSV 로더 (see `player/AGENTS.md`) |
| `team/`   | `MATCH_FORMAT_CONFIG`, 밸런싱 알고리즘·점수, `useTeamStore`, 탑독 계산, 카카오 공유 (see `team/AGENTS.md`)  |
| `theme/`  | `useThemeStore`(다크 기본, localStorage) (see `theme/AGENTS.md`)                                            |

## For AI Agents

### Working In This Directory

- shared 만 import. features/widgets/pages 참조 금지.
- 밸런싱 로직(`team/lib`)·로스터 매칭 키(`name + year`)는 공유링크·OCR·테스트와 엮여 있어 변경 시 영향 범위를 먼저 확인.

### Testing Requirements

- `team/lib/__tests__`(통계적 불변식 포함), `player/lib/__tests__`가 있다. 알고리즘 변경은 반드시 테스트와 함께.

<!-- MANUAL: -->
