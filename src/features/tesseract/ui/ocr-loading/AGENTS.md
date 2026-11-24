# ocr-loading

**Parent context:** `../AGENTS.md`
**Generated:** 2026-08-25 · **Updated:** 2026-11-24

## Key Files

| File               | Description                                                                                                                                                               |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ocr-loading.tsx`  | `OcrLoading({ visible, phase, progress })` — `@/shared` `LoadingOverlay`(딤·카드·⚽·제목) 안에 3단계(준비/언어/인식, `is-done/is-active`)와 `role="progressbar"` + 퍼센트 |
| `ocr-loading.scss` | 단계 연결선·점·라벨, 진행바. 오버레이/카드/공 스타일은 `shared/ui/loading-overlay`                                                                                        |
| `index.ts`         | 배럴                                                                                                                                                                      |

## For AI Agents

### Working In This Directory

- 오버레이 껍데기는 `LoadingOverlay`가 담당(인라인 렌더라 antd CSS 변수 정상 해석). fullscreen `Spin`으로 바꾸지 말 것.

## Manual Notes

이 제목 아래는 사람이 작성한 메모이며 재생성 시 보존된다.
