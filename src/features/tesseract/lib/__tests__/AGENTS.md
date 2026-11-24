# `tesseract/lib/__tests__`

**Parent context:** `../AGENTS.md`
**Generated:** 2026-08-25 · **Updated:** 2026-11-24

## Key Files

| File                     | Description                                                                                                                                                                                                                    |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `extract-player.test.ts` | `YY/이름`·약칭(`NAME_ALIASES`) 매칭, `불참` 이후 무시, 시트 연도가 바뀌어도 별칭 매칭 유지(이름만으로 찾음), kind·raw 기록, prefix+alias 이중 기록, 미인식 필터(2~4자·불참 이전·dedupe·앞 2글자 겹침 제외·카톡 투표 문구 제외) |
| `use-tesseract.test.tsx` | `useTesseract` 훅(`tesseract.js` 모킹): 매칭 시 선택 반영·review·reviewId 증가, 매칭 0건+미인식만이면 선택 유지·review 설정, 전부 빔 → review null, `closeReview`                                                              |

## For AI Agents

### Working In This Directory

- 로스터는 `useRosterStore.setState({ rows: composeRoster(...) })`로 시드한다 — 지원 슬롯이 앞에 붙어도 2글자 프리픽스 폴백과 충돌하지 않는다.

## Manual Notes

이 제목 아래는 사람이 작성한 메모이며 재생성 시 보존된다.
