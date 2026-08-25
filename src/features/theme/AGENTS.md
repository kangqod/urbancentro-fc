<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-08-25 | Updated: 2026-08-25 -->

# theme

## Purpose

헤더 우측 다크/라이트 토글 버튼.

## Key Files

| File       | Description           |
| ---------- | --------------------- |
| `index.ts` | `./ui/theme` 재export |

## Subdirectories

| Directory | Purpose                                                                                               |
| --------- | ----------------------------------------------------------------------------------------------------- |
| `lib/`    | `useThemeState(): [isDarkMode, setTheme]`                                                             |
| `ui/`     | `Theme` 버튼(Moon/Sun), `useTheme`(`toggleTheme`), `theme.scss`(absolute right 2rem, ≤576px relative) |

## For AI Agents

### Working In This Directory

- `body` 클래스는 `app/Provider.tsx`가 붙인다. 여기서는 스토어만 토글.

<!-- MANUAL: -->
