# loading-overlay

**Parent context:** `../AGENTS.md`
**Generated:** 2026-11-24 · **Updated:** 2026-11-24

## Purpose

전체화면 로딩 오버레이 공용 컴포넌트. 로스터 로딩(`src/pages/main/ui/container.tsx`)과 OCR 진행(`src/features/tesseract/ui/ocr-loading`)이 함께 쓴다.

## Key Files

| File                   | Description                                                                                                                                                                                         |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `loading-overlay.tsx`  | `LoadingOverlay({ title, description?, children })`. `role="status"` + `aria-live="polite"` + `aria-busy`. 굴러가는 ⚽(`aria-hidden`), 제목, 선택 설명, `children`(OCR 진행 바 등)                  |
| `loading-overlay.scss` | `position: fixed; inset: 0; z-index: 1050` 딤(rgba 0.45)+blur, 카드는 `sport.surface-card` 믹스인. 설명은 `white-space: pre-line`(호출부의 `\n` 개행을 그대로 반영). ⚽는 transform 회전 애니메이션 |

## For AI Agents

### Working In This Directory

- antd `Spin fullscreen` 대신 쓰는 이유: Spin fullscreen은 body로 포털돼 `<AntdApp>` 밖에서 antd CSS 변수가 해석되지 않는다. 이 컴포넌트는 인라인 렌더라 `var(--ant-color-*)`가 그대로 동작하므로 포털로 바꾸지 말 것.
- 문장 단위 개행은 호출부 `description` 문자열의 `\n`으로 제어한다(모바일 어색한 자동 줄바꿈 방지). 여기서 `<br />`을 넣지 말 것.
- 회전 애니메이션은 transform만 사용. reduced-motion 처리는 `src/app/index.scss` 전역 가드가 담당.

### Testing Requirements

- 전용 테스트 없음. 로스터 로딩·OCR 업로드 흐름에서 라이트/다크·≤576px 육안 확인.

## Dependencies

### Internal

- `@/shared/assets/sport`(`surface-card` 믹스인)

## Manual Notes

이 제목 아래는 사람이 작성한 메모이며 재생성 시 보존된다.
