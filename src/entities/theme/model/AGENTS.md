<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-08-25 | Updated: 2026-08-25 -->

# theme/model

## Key Files

| File       | Description                                                                                                                        |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `index.ts` | `./store` 배럴                                                                                                                     |
| `store.ts` | `KEY_DARK_MODE='darkMode'`, `useThemeStore`: `isDarkMode`(localStorage 없으면 `true`), `setTheme(value?)`(인자 없으면 토글) + 저장 |
| `types.ts` | `ThemeState { isDarkMode }`                                                                                                        |

## For AI Agents

### Working In This Directory

- `store.ts`에 `resetThemeState`가 정의돼 있지만 `ThemeStore` 타입에 없어 타입 훅으로는 접근 불가. 필요하면 타입에 추가.
- `body` 클래스 부착은 `src/app/Provider.tsx`가 담당한다(여기서 DOM 조작하지 않음).

<!-- MANUAL: -->
