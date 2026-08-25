<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-08-25 | Updated: 2026-08-25 -->

# header/ui

## Purpose

헤더 렌더링과 스포츠 타이포 스타일.

## Key Files

| File          | Description                                                                                                                                                                                                                                                                                                |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `header.tsx`  | `Header`: antd `Layout.Header.team-header`, 클릭 시 `window.location.href='/urbancentro-fc'`(Vite base 때문에 하드코딩), lucide `Users` 아이콘 + `Typography.Title level={3}`                                                                                                                              |
| `header.scss` | `@use variables/sport`. `.team-header` 80px 투명 배경, 타이틀에 `sport.sport-headline` 믹스인(`text-transform: none; font-weight: 800` 재선언), `.icon-users` hover scale/rotate(`--fc-motion-fast/-ease`). ≤375px 타이틀 폰트 축소는 동일 명시도 소스 순서로 이김. `body.dark-mode/.light-mode` FOUC 폴백 |

## For AI Agents

### Working In This Directory

- `!important` 금지 — 명시도·소스 순서로 해결(파일 내 주석 참고).
- 홈 이동 경로는 Vite `base`와 묶여 있다. base 변경 시 함께 수정.

## Dependencies

### External

- antd, lucide-react

<!-- MANUAL: -->
