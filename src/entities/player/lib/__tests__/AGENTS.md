<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-08-25 | Updated: 2026-08-25 -->

# player/lib/**tests**

## Key Files

| File                  | Description                                                                                                                                                                                   |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `roster-csv.test.ts`  | 시트 CSV → RosterRow 변환, 헤더 순서 섞기, 2자리 연도·빈 등번호·이름 없는 행, 티어 오타 폴백+warn, 연도 오류 행 스킵, 헤더 누락/빈 입력/유효 행 0 throw                                       |
| `load-roster.test.ts` | CSV 성공 → remote + 지원 슬롯 선두 + 캐시 저장, 성공마다 캐시 덮어쓰기, reject → 캐시 있으면 cached(savedAt) 없으면 error, 빈 시트·타임아웃·빈 URL → 동일 복구, 손상 캐시 무시, 동시 호출 1회 |

## For AI Agents

### Working In This Directory

- `beforeEach`에서 `resetRosterLoader()` + `clearRosterCache()` 필수 — 메모이즈·localStorage가 테스트 간 새는 것을 막는다.
- `console.warn`은 `vi.spyOn`으로 잠재운다.

<!-- MANUAL: -->
