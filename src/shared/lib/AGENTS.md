<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-08-25 | Updated: 2026-08-25 -->

# shared/lib

## Key Files

| File               | Description                                                                                                                                                                                                                                                                                      |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `index.ts`         | `./build-version`, `./constants`, `./csv`, `./date`, `./string` 배럴                                                                                                                                                                                                                             |
| `constants.ts`     | `PRIMARY_COLOR = '#ff681f'`                                                                                                                                                                                                                                                                      |
| `build-version.ts` | `buildManifestUrl(base)`(트레일링 슬래시 정규화), `fetchBuildTime()`(`build.json?t=`, no-store), `decideUpdate(latest, current, notified)`(서버가 엄격히 최신이고 미통지일 때만 notify — 롤백 루프 방지), `runBuildVersionCheck({onUpdate, current?, fetchLatest?})`, `resetBuildVersionState()` |
| `csv.ts`           | `parseCsv(text)` RFC4180 최소 파서(따옴표·`""`·따옴표 내 쉼표/줄바꿈·CRLF·BOM)                                                                                                                                                                                                                   |
| `date.ts`          | `formatDateToYYYYMMDD`, `formatDateToKorean`(`2026년 08월 25일` — ReleaseDate·캐시 토스트 공용)                                                                                                                                                                                                  |
| `string.ts`        | `teamNameToNumber('팀 A')→1`, `alphaToNumber`, `numberToAlpha`                                                                                                                                                                                                                                   |

## Subdirectories

| Directory    | Purpose                                |
| ------------ | -------------------------------------- |
| `__tests__/` | `build-version.test.ts`, `csv.test.ts` |

## For AI Agents

### Working In This Directory

- `__APP_BUILD_TIME__`은 vite define — 미주입 환경 대비 `typeof` 가드가 있다.
- `notifiedBuildTime`은 모듈 전역 → 테스트 `beforeEach`에서 `resetBuildVersionState()`.
- fetch 로직은 DI(`fetchLatest`, 로스터의 `fetchText`)로 테스트한다. msw 없음.

<!-- MANUAL: -->
