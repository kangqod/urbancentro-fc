<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-08-25 | Updated: 2026-08-25 -->

# player-modal/ui

## Key Files

| File                | Description                                                                                                                              |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `player-modal.tsx`  | `PlayerModal({ player, onClose })` — antd `Modal`(`footer={null}`, centered, xs 90% / 600px)                                             |
| `title.tsx`         | "YY 이름" 헤더. `year`가 `DEFAULT_YEAR`(게스트·지원)면 연도 숨김. 클릭 시 닫힘                                                           |
| `contents.tsx`      | `Descriptions`(xs 1열/3열): 티어 Tag(`getTierColor`), 등번호(`DEFAULT_NUMBER`→'없음'), 컨디션 화살표, 강점, 특징 목록. 본문 클릭 시 닫힘 |
| `player-modal.scss` | 타이틀 `sport-headline`, Descriptions 정렬, 아이콘 색(`--fc-team-b`, `--ant-color-primary/warning/success`)                              |
| `index.ts`          | 배럴                                                                                                                                     |

## Dependencies

### External

- antd(Modal, Descriptions, Tag, Grid), lucide-react

<!-- MANUAL: -->
