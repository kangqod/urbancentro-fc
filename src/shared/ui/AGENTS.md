<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-08-25 | Updated: 2026-08-25 -->

# shared/ui

## Purpose

탭 화면 공통 프레임 컴포넌트.

## Key Files

| File       | Description                                                            |
| ---------- | ---------------------------------------------------------------------- |
| `index.ts` | `loading-overlay`, `release-date`, `tab-header`, `tab-footer` 재export |

## Subdirectories

| Directory          | Purpose                                                                                                    |
| ------------------ | ---------------------------------------------------------------------------------------------------------- |
| `loading-overlay/` | `LoadingOverlay({ title, children })` — 전체화면 딤+blur, 카드, 굴러가는 ⚽. 로스터 로딩·OCR 오버레이 공용 |
| `release-date/`    | "최근 업데이트 : YYYY년 MM월 DD일" (`__APP_BUILD_TIME__` 기반, 로컬 타임존)                                |
| `tab-header/`      | 탭 제목+설명+`ReleaseDate`                                                                                 |
| `tab-footer/`      | 하단 고정 버튼 바(`z-index: 10`, CTA 스타일)                                                               |

## For AI Agents

### Working In This Directory

- `tab-footer.scss`의 `.dark-mode/.light-mode` 그림자 분기는 방향·대비가 모드별로 달라 단일 토큰으로 합치지 않는다.
- `release-date`는 ISO 앞 10자를 그대로 쓰지 않고 `Date`로 파싱해 로컬 날짜로 표기(UTC 저녁 빌드가 KST에서 하루 밀리는 문제).

<!-- MANUAL: -->
