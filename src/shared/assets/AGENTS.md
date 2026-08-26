<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-08-25 | Updated: 2026-08-25 -->

# shared/assets

## Purpose

SCSS 파셜.

## Key Files

| File              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `_sport.scss`     | 믹스인 `sport-headline`(이탤릭·letter-spacing, 헤드라인/CTA 라벨 전용), `sport-cta`(주황 그라디언트+글로우+transform hover 리프트 — CTA 모션은 이 믹스인이 소유, 확장은 tab-footer처럼 transition 전체 재선언), `surface-card`(elevated 카드 셸: flex column·gap·radius·bg·shadow, padding/폭은 소비 측). `--fc-*` 커스텀 프로퍼티를 `body.dark-mode`와 `body.light-mode` **양쪽**에 정의: `--fc-team-a..d`, `--fc-gradient-cta`, `--fc-glow`, `--fc-accent-advanced`, `--fc-gradient-premium`, `--fc-premium-sheen[-strong]`, `--fc-premium-spark-glyph`(다크 ✨/라이트 👍), `--fc-motion-fast/mid/ease` |
| `_variables.scss` | `$primary-color`, 다크 헤더/라이트 레이아웃 배경 등 — `body`용 FOUC 폴백 전용(`header.scss`만 사용). 색의 진짜 소스는 antd 토큰                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |

## For AI Agents

### Working In This Directory

- `--fc-*`를 추가하면 다크·라이트 둘 다 정의하고, 소비처에서는 항상 `var(--fc-x, <다크값>)` 인라인 폴백을 쓴다(body 클래스는 post-mount에 붙음).
- 브랜드 hex는 `--fc-*:` 정의부와 `var(…, #hex)` 폴백 위치에만 허용(CLAUDE.md grep 게이트).
- 선수 명단은 여기 두지 않는다(시트 런타임 로딩 + localStorage 캐시).
- `sport-headline`은 본문·입력·선수 이름에 적용하지 않는다(한글 가독성).

<!-- MANUAL: -->
