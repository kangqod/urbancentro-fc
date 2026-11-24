# .claude

**Parent context:** `../AGENTS.md`
**Generated:** 2026-11-24 · **Updated:** 2026-11-24

## Purpose

프로젝트 공용 Claude Code 설정(커밋 대상).

## Key Files

| File                   | Description                                                                                                                                                                                                                                                                                            |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `settings.json`        | Stop 훅 1개: `.claude/hooks/verify-gate.sh`(timeout 120초)                                                                                                                                                                                                                                             |
| `hooks/verify-gate.sh` | `pnpm verify`를 Stop 시점에 강제. `src`·`package.json`·`vite.config.ts`·`tsconfig*.json`·`eslint.config.js`·prettier 설정의 내용 해시가 지난 통과 때와 같으면 스킵. 실패 시 exit 2(에이전트에 로그 전달), 3회 연속 실패면 exit 0으로 멈추고 사람 개입 요청. 상태는 `node_modules/.cache/verify-gate-*` |

## For AI Agents

### Working In This Directory

- 해시 대상에 `.github/`, `*.md`, `pnpm-lock.yaml`, `mise.toml`은 없다. 이 파일들만 바꾸면 훅이 verify를 건너뛰므로 필요하면 `pnpm verify`를 직접 실행한다.
- 해시 대상을 바꾸면 `pnpm verify`가 실제로 검사하는 범위(lint/format/typecheck/test)와 일치하는지 확인한다.

## Manual Notes

이 제목 아래는 사람이 작성한 메모이며 재생성 시 보존된다.
