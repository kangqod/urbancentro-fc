# setup

**Parent context:** `../AGENTS.md`
**Generated:** 2026-08-25 · **Updated:** 2026-11-24

## Key Files

| File         | Description                                                                                                                                                                  |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `action.yml` | 복합 액션. 입력 `VITE_KAKAO_JS_KEY`(필수). `pnpm/action-setup@v6`(버전은 package.json `packageManager`) → `setup-node@v6`(24, pnpm 캐시) → `.env`에 키 기록 → `pnpm install` |

## For AI Agents

### Working In This Directory

- Vite는 빌드 시 `.env`의 `VITE_*`만 읽으므로 새 빌드타임 비밀이 생기면 여기 `.env` 기록 단계에 추가.

## Manual Notes

이 제목 아래는 사람이 작성한 메모이며 재생성 시 보존된다.
