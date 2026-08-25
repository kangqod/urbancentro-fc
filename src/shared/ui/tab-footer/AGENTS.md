<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-08-25 | Updated: 2026-08-25 -->

# tab-footer

## Key Files

| File              | Description                                                                                                                                                                                                                               |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tab-footer.tsx`  | `TabFooter({ children })` — `.tab-footer` 래퍼                                                                                                                                                                                            |
| `tab-footer.scss` | 하단 고정 바(max-width 1120px, `z-index: 10`, `--ant-color-bg-container`), `.button-group`, `.prev-button/.next-button/.shuffle-button/.go-home-button`(CTA는 `sport.sport-cta` + hover lift/glow, disabled 채도 저하), 모드별 box-shadow |

## For AI Agents

### Working In This Directory

- `z-index: 10`은 스크롤 콘텐츠의 최대 z(2: 티어 노치·셔플 카드) 위에 있어야 한다. 낮추지 말 것.

<!-- MANUAL: -->
