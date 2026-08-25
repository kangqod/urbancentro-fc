<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-08-25 | Updated: 2026-08-25 -->

# player/lib

## Purpose

Google Sheets 게시 CSV → `RosterRow[]` 로딩 파이프라인 + localStorage 캐시.

## Key Files

| File              | Description                                                                                                                                                                                                                                                                                                                 |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `index.ts`        | `./constants`, `./load-roster`, `./roster-csv` 배럴                                                                                                                                                                                                                                                                         |
| `constants.ts`    | `ROSTER_CSV_URL`(코드 상수, 빈 문자열이면 fetch 생략), `ROSTER_FETCH_TIMEOUT_MS=5000`                                                                                                                                                                                                                                       |
| `roster-csv.ts`   | `parseRosterCsv(text)`: 한글 헤더(`이름/출생년도/등번호/티어/강점/특성`) 이름 매핑(순서 무관), 2자리 연도 → `>=30`이면 19xx 아니면 20xx, 잘못된 연도 행은 warn 후 스킵, 티어 불일치 → 중급+warn, 등번호 NaN → 0, 특성 `/` 분리, 선택 열 `프리미엄`(TRUE/O/Y/1/예 → true, 헤더 없으면 전원 false). 헤더 누락·빈 결과는 throw |
| `roster-cache.ts` | `ROSTER_CACHE_KEY='roster-cache-v1'`, `readRosterCache()`(형태 검증 → 손상 시 null, 행은 `tier`/`number`/`isPremium`을 CSV 파서와 같은 기본값으로 정규화), `writeRosterCache(rows)`(성공마다 덮어쓰기, savedAt=마지막 성공 시각), `clearRosterCache()`. localStorage 접근은 모두 try                                        |
| `load-roster.ts`  | `loadRoster({url, fetchText, timeoutMs})`: AbortController + `Promise.race` 타임아웃. 성공 → 캐시 저장 + `remote` / 실패·빈 URL·파싱 실패 → 캐시 있으면 `cached`(+`savedAt`) 없으면 `error`(지원 슬롯만). 모듈 메모이즈 `pending`(StrictMode·재마운트에도 fetch 1회), `resetRosterLoader()`                                 |

## Subdirectories

| Directory    | Purpose                                                                                                                                    |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `__tests__/` | `roster-csv.test.ts`(형식·순서·정규화·throw), `load-roster.test.ts`(성공+캐시 저장·덮어쓰기·실패→cached/error·타임아웃·손상 캐시·메모이즈) |

## For AI Agents

### Working In This Directory

- 현재 값은 "웹에 게시" `pub?gid=…&single=true&output=csv` URL — 명단 탭만 공개(다른 gid는 401), 문서 공유를 "제한됨"으로 잠가도 동작, 구글 게시 캐시 ~5분. `gviz` URL은 문서 링크 공개가 필요해 쓰지 않는다.
- `fetchText`는 DI 포인트 — 테스트는 네트워크 없이 이걸로 주입한다(setup.ts가 전역 fetch를 reject로 스텁). 캐시는 jsdom localStorage를 그대로 쓰고 `render.tsx`/테스트 `beforeEach`에서 `clearRosterCache()`.
- 시트 스키마를 바꾸면 `HEADERS` 맵·테스트·CLAUDE.md 로스터 항목을 함께 갱신.

## Dependencies

### Internal

- `@/shared/lib/csv`, `../model/roster-store`, `../model/player`

<!-- MANUAL: -->
