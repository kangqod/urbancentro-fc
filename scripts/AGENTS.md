<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-08-25 | Updated: 2026-08-25 -->

# scripts

## Purpose

빌드 산출물 검증 스크립트. `pnpm build`의 마지막 단계로 실행된다.

## Key Files

| File                       | Description                                                                                                                                              |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `check-build-manifest.mjs` | `dist/build.json`이 존재·유효 JSON·`buildTime`(ISO) 보유인지, `dist/assets/*.js` 중 하나에 동일 `buildTime` 문자열이 번들돼 있는지 검사. 불일치면 exit 1 |

## For AI Agents

### Working In This Directory

- 번들 `__APP_BUILD_TIME__`(vite define)과 `build.json`이 어긋나면 모든 사용자가 첫 로드에 "새 버전" 모달을 보게 되므로 이 게이트를 우회하지 말 것.
- 관련 로직: `vite.config.ts`의 `buildTimeJson` 플러그인, `src/shared/lib/build-version.ts`, `src/pages/main/lib/use-build-version-check.tsx`.

### Testing Requirements

- `pnpm build` 또는 `pnpm check:build`(빌드 후)로 실행.

## Dependencies

### External

- Node 내장 `fs`/`path`만 사용.

<!-- MANUAL: -->
