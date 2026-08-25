<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-08-25 | Updated: 2026-08-25 -->

# player

## Purpose

선수 도메인. 타입·기본값·`PlayerClass`, 선택 상태 스토어(`usePlayerStore`), 그리고 로스터(명단) 소스 — Google Sheets CSV 런타임 로딩, 실패 시 localStorage 마지막 성공분, 그것도 없으면 error.

## Key Files

| File       | Description                 |
| ---------- | --------------------------- |
| `index.ts` | `./lib`, `./model` 재export |

## Subdirectories

| Directory | Purpose                                                                                               |
| --------- | ----------------------------------------------------------------------------------------------------- |
| `model/`  | 타입, `PlayerClass`·상수, `usePlayerStore`, `useRosterStore`, `SUPPORT_SLOTS` (see `model/AGENTS.md`) |
| `lib/`    | `ROSTER_CSV_URL`, `parseRosterCsv`, `loadRoster`, `roster-cache` (see `lib/AGENTS.md`)                |

## For AI Agents

### Working In This Directory

- **`지원 1`/`지원 2`** 이름은 밸런싱 상수(`EXCLUDED_PAIRS`, `CONDITION_EXEMPT_NAMES`)·UI 배지·공유링크 복원의 키다. 개명·삭제 금지, 시트에 넣지 않고 `SUPPORT_SLOTS` 코드 상수로만 관리.
- `year === '3000'`(`DEFAULT_YEAR`)은 "연도 없음" 센티널(지원 슬롯·게스트). `isActiveForMatch` 기본값이 이 값에 의존한다.
- `PlayerClass.id = \`${year}-${name}-${number}\``(id 미지정 시). 공유링크는`shared-*`, 게스트는`guest-{ts}` id를 쓴다.
- 로스터 배열은 원격 성공·캐시 복원·error 모두 `composeRoster`를 거쳐야 한다(지원 슬롯 누락 방지).

## Dependencies

### Internal

- `@/shared/lib/csv`

<!-- MANUAL: -->
