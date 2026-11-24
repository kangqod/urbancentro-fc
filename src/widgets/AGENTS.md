# widgets

**Parent context:** `../AGENTS.md`
**Generated:** 2026-08-25 · **Updated:** 2026-11-24

## Purpose

FSD widgets 레이어. 페이지를 구성하는 독립 블록: 상단 헤더, 선수 상세 모달 래퍼.

## Key Files

| File       | Description                                  |
| ---------- | -------------------------------------------- |
| `index.ts` | `./header`, `./player-detail-modal` 재export |

## Subdirectories

| Directory              | Purpose                                                                        |
| ---------------------- | ------------------------------------------------------------------------------ |
| `header/`              | 앱 타이틀 헤더(클릭 시 홈 이동) (see `header/AGENTS.md`)                       |
| `player-detail-modal/` | 선택 선수 상세 모달을 lazy 로드하는 래퍼 (see `player-detail-modal/AGENTS.md`) |

## For AI Agents

### Working In This Directory

- features/entities/shared 만 import. pages/app 참조 금지.

## Manual Notes

이 제목 아래는 사람이 작성한 메모이며 재생성 시 보존된다.
