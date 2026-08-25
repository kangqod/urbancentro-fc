<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-08-25 | Updated: 2026-08-25 -->

# tesseract/lib

## Key Files

| File                | Description                                                                                                                                                                                                                                                                                                                                                                                |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `useTesseract.ts`   | `OcrPhase='prepare'\|'language'\|'recognize'`, `useTesseract()`: `beforeUpload`가 `runOCR` 후 `false` 반환(실제 업로드 없음). worker 생성 → recognize → `extractMatchedPlayersUnified` → 0명이면 에러 토스트, 아니면 `checkTesseractPlayers` + "N 명 반영" 토스트. finally에서 worker terminate·objectURL revoke. 진행률은 `STAGES` 가중 누적(1/1/3/1/6)으로 단조 증가, 미매핑 status 무시 |
| `extract-player.ts` | `extractMatchedPlayersUnified(text)`: `불참` 이전만, 1차 `YY/이름` 패턴, 2차 한글 이름(앞 2글자 프리픽스 폴백), `usedNames` 중복 제거. `handlePlayerException`이 `NAME_ALIASES`(오인식/약칭→정식 이름)로 로스터 행을 이름 매칭. 로스터는 `getRosterRows()`                                                                                                                                 |
| `use-store.ts`      | `useSetPlayerState()` → `usePlayerStore.checkTesseractPlayers`                                                                                                                                                                                                                                                                                                                             |
| `index.ts`          | `./useTesseract` 만 export                                                                                                                                                                                                                                                                                                                                                                 |

## For AI Agents

### Working In This Directory

- tesseract v7 logger status 는 `startsWith`로 매칭(`(from cache)` 접미사 대응). "100% 후 되감기" 버그 방지를 위해 `initialized api` 같은 완료 이벤트는 무시한다.

<!-- MANUAL: -->
