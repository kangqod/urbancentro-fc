# tesseract/lib

**Parent context:** `../AGENTS.md`
**Generated:** 2026-08-25 · **Updated:** 2026-11-24

## Key Files

| File                | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `useTesseract.ts`   | `OcrPhase='prepare'\|'language'\|'recognize'`, `useTesseract()`: `beforeUpload`가 `runOCR` 후 `false` 반환(실제 업로드 없음). worker 생성 → recognize → `extractOcrCandidates` → 매칭·미인식 모두 0이면 에러 토스트, 아니면 매치를 즉시 `checkTesseractPlayers`로 반영(매치 0건이면 반영 생략 — 첫 OCR 빈 배열은 전원 해제) + `review` 상태·`reviewId` 증가로 결과 알림 모달. `closeReview`는 review만 비움. finally에서 worker terminate·objectURL revoke. 진행률은 `STAGES` 가중 누적(1/1/3/1/6)으로 단조 증가, 미매핑 status 무시                                                                  |
| `extract-player.ts` | `extractOcrCandidates(text): OcrExtraction` — `{ matches: { player, kind: 'exact'\|'alias'\|'prefix', raw }[], unmatched: string[] }`. `불참` 이전만, 1차 `YY/이름` 패턴, 2차 한글 이름(앞 2글자 프리픽스 폴백), `usedNames` 중복 제거. `handlePlayerException`이 `NAME_ALIASES`(오인식/약칭→정식 이름)로 로스터 행을 이름 매칭(2차에선 무조건 호출 → 한 토큰이 prefix+alias로 두 번 기록될 수 있음). `unmatched` = 2차 토큰 중 어떤 경로로도 로스터 행에 닿지 않은 2~4자, 등장 순서 dedupe, 카톡 투표 UI 문구(`VOTE_UI_WORDS`: 투표·투표가·현황·항목별·멤버별·참석) 제외. 로스터는 `getRosterRows()` |
| `use-store.ts`      | `useSetPlayerState()` → `usePlayerStore.checkTesseractPlayers`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `index.ts`          | `./useTesseract` 만 export                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |

## Subdirectories

| Directory    | Purpose                                              |
| ------------ | ---------------------------------------------------- |
| `__tests__/` | `extract-player.test.ts` (see `__tests__/AGENTS.md`) |

## For AI Agents

### Working In This Directory

- tesseract v7 logger status 는 `startsWith`로 매칭(`(from cache)` 접미사 대응). "100% 후 되감기" 버그 방지를 위해 `initialized api` 같은 완료 이벤트는 무시한다.

## Manual Notes

이 제목 아래는 사람이 작성한 메모이며 재생성 시 보존된다.
