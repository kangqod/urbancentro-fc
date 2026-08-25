<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-08-25 | Updated: 2026-08-25 -->

# team-distribution

## Purpose

3탭 "팀 분배". 탭 진입 시 자동으로 `balanceTeams` 실행(1.1초 셔플 연출), 팀 카드·탑독/언더독·밸런스 정보 모달·공유(Web Share/카카오/클립보드)·다시 섞기. 공유링크로 진입하면 `SharedView`(홈 버튼만).

## Key Files

| File                                   | Description                                                                                                                                                                                                                                               |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `team-distribution.tsx`                | `isSharedView`에 따라 `SharedView`/`DefaultView` + message contextHolder                                                                                                                                                                                  |
| `team-distribution.hooks.ts`           | `distributeTeamsFromSharedLink()`(`TEAMS_PARAMS` 파싱 → `setTeams`), `distributeTeamsLocally()`(mode `"6:6:6"` 조립, 인원 불일치 throw, `setTimeout 1100` 후 `balanceTeams`), 밸런서 에러 → 한국어 메시지 매핑, 탭 진입 1회 자동 분배(`isFirstRenderRef`) |
| `container.tsx`                        | `Spin fullscreen`(셔플 카드 애니메이션) + `TeamBalanceLog` + 팀 카드 Row(`columnSpan` 팀 수 짝수 12/홀수 8). 선수 항목 `premium`(`player.isPremium`, 시트 '프리미엄' 열)·`high` 클래스, 클릭 시 상세 모달. 티어 범례/노치 코드는 주석 처리(SCSS는 유지)   |
| `default-view.tsx` / `shared-view.tsx` | `Container` + `Footer` / `Container` + `FooterHome`                                                                                                                                                                                                       |
| `footer.tsx` / `footer.hooks.ts`       | 공유 아이콘 3개 + 이전/다시 섞기. `handleShareKakao`가 `SharedTeam[]` 직렬화(`[YY\|'99', name, HIGH\|'', tier, isGuest]`) → `shareKakao`. `navigator.share` 없으면 클립보드                                                                               |
| `footer-home.tsx`                      | 홈으로 이동(`window.location.href='/urbancentro-fc'`)                                                                                                                                                                                                     |
| `player-card.tsx`                      | `special`이면 `.fx-shine` + `.fx-spark`×4 장식 후 `PlayerSmallCard`                                                                                                                                                                                       |
| `team-balance-log.tsx` / `.scss`       | 밸런스 정보 모달: 팀별 티어 분포 바·`calculateTeamStrength`(밸런서와 동일 함수)·gap 판정(≤2 good/≤4 warn). `teams.length===0`이면 null                                                                                                                    |
| `team-distribution.scss`               | 595줄. 팀 색 `.team-row .ant-col:nth-child(n)` CSS-only, 셔플 스핀 백드롭, premium/high 이펙트(transform/opacity만), 공유 버튼, ≤767/576/375px 반응형, reduced-motion                                                                                     |
| `index.ts`                             | 배럴                                                                                                                                                                                                                                                      |

## Subdirectories

| Directory    | Purpose                                           |
| ------------ | ------------------------------------------------- |
| `__tests__/` | `container.test.tsx`, `team-balance-log.test.tsx` |

## For AI Agents

### Working In This Directory

- 탑독/언더독 배지는 `powerScore`(strength+컨디션+프리미엄), 표시 숫자는 순수 `strength` — 다른 것이 의도.
- `ShareKakaoContent.teams`는 `Team[]` 타입이지만 실제로는 튜플이라 `as unknown as Team[]` 캐스팅(FSD 레이어 유지 목적).
- fullscreen `Spin`은 body 포털로 렌더되지만 `--fc-*`가 `body.dark-mode/.light-mode`에 정의돼 있어 계단식 상속이 된다.
- 셔플 로딩은 언마운트 대신 `spinning` 오버레이 — 스크롤 위치 보존.

## Dependencies

### Internal

- `@/entities`(`balanceTeams`, `calculateTeamStrength`, `getTopDogTeamNames`, `shareKakao`), `@/shared`, `@/features/player-modal/lib`(`getTierColor`)

<!-- MANUAL: -->
