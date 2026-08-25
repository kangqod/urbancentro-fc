<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-08-25 | Updated: 2026-08-25 -->

# pages

## Purpose

FSD pages 레이어. 단일 페이지 앱이라 `main` 하나만 있고, 레이아웃 셸과 앱 수준 초기화(로스터 로딩·공유링크 복원·새 버전 감지)를 담당한다.

## Key Files

| File       | Description       |
| ---------- | ----------------- |
| `index.ts` | `./main` 재export |

## Subdirectories

| Directory | Purpose                                                  |
| --------- | -------------------------------------------------------- |
| `main/`   | 메인 페이지 셸·컨테이너·초기화 훅 (see `main/AGENTS.md`) |

## For AI Agents

### Working In This Directory

- widgets/features/entities/shared 를 import 할 수 있고, app 은 import 하지 않는다.

<!-- MANUAL: -->
