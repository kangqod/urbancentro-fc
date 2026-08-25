<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-08-25 | Updated: 2026-08-25 -->

# tesseract

## Purpose

참가자 명단 이미지(카톡 캡처 등)를 tesseract.js(kor)로 인식해 로스터와 매칭, 선택 상태에 반영.

## Key Files

| File       | Description              |
| ---------- | ------------------------ |
| `index.ts` | `./ui/tesseract` 만 공개 |

## Subdirectories

| Directory | Purpose                                                                                                  |
| --------- | -------------------------------------------------------------------------------------------------------- |
| `lib/`    | `useTesseract`(OCR 실행·진행률), `extract-player`(텍스트 → 선수 매칭), `use-store` (see `lib/AGENTS.md`) |
| `ui/`     | `Tesseract` 업로드 버튼, `ocr-loading/` 오버레이 (see `ui/AGENTS.md`)                                    |

## For AI Agents

### Working In This Directory

- OCR 매칭 로직은 CLAUDE.md 동작 동결 대상. 별칭 테이블(`NAME_ALIASES`)은 이름만으로 매칭한다(시트 연도 변경에 무관).

## Dependencies

### External

- tesseract.js 7 (`createWorker('kor', 1, { logger })`)

<!-- MANUAL: -->
