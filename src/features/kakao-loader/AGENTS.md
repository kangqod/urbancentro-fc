<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-08-25 | Updated: 2026-08-25 -->

# kakao-loader

## Key Files

| File               | Description                                                                                                                    |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| `kakao-loader.tsx` | `KakaoLoader()` — `return null`. mount 시 `window.Kakao`가 있고 `!isInitialized()`면 `init(import.meta.env.VITE_KAKAO_JS_KEY)` |
| `index.ts`         | 배럴                                                                                                                           |

## For AI Agents

### Working In This Directory

- SDK는 `index.html` script 태그(SRI)로 로드된다. 없으면 조용히 no-op(재시도 없음). 키는 CI가 `.env`로 주입.
- Kakao 연동은 CLAUDE.md 동작 동결 대상.

<!-- MANUAL: -->
