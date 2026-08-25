<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-08-25 | Updated: 2026-08-25 -->

# team-setup-flow/ui

## Key Files

| File                     | Description                                                                                                                                                   |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `team-setup-flow.tsx`    | `TeamSetupFlow()` — antd `Tabs`(centered, large, `activeKey`만, `onChange` 없음) 3개 항목: 팀 구성/선수 선택/팀 분배                                          |
| `team-setup-flow.scss`   | `.tab-menu`(`sport-headline`), 활성 탭 `--ant-color-primary`, ink bar `--fc-gradient-cta`, 비활성 탭 disabled 표현(`not-allowed`, opacity .45), nav 높이 78px |
| `player-small-card.tsx`  | `PlayerSmallCard({ player })`: 게스트 → `게` 칩, `SUPPORT_NAMES`(지원 1/2) → 🔄, 일반 → `YY 이름`. `is-len4/is-len5` 클래스로 긴 이름 축소(지원 슬롯 제외)    |
| `player-small-card.scss` | `.pl-line` nowrap, `.pl-year/.pl-name` line-height 1 정렬, 길이별 폰트, `.pl-mark-guest/.pl-mark-support`                                                     |
| `index.ts`               | 배럴                                                                                                                                                          |

## Subdirectories

| Directory             | Purpose                                                                         |
| --------------------- | ------------------------------------------------------------------------------- |
| `team-size-selector/` | 1탭: 매치 포맷 카드 선택 (see `team-size-selector/AGENTS.md`)                   |
| `player-selection/`   | 2탭: 선수 체크·게스트 추가·OCR·상세 보기 (see `player-selection/AGENTS.md`)     |
| `team-distribution/`  | 3탭: 밸런싱 실행·결과 카드·밸런스 로그·공유 (see `team-distribution/AGENTS.md`) |

## For AI Agents

### Working In This Directory

- `PlayerSmallCard`는 선택 카드와 분배 결과 카드 양쪽에서 쓰인다. 마크업 변경 시 두 화면과 375px 폭을 함께 확인.

<!-- MANUAL: -->
