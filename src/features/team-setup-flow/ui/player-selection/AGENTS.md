<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-08-25 | Updated: 2026-08-25 -->

# player-selection

## Purpose

2탭 "선수 선택". 로스터를 카드 그리드로 보여 참가자를 토글하고, 게스트 추가·OCR 업로드·상세 보기 모드를 제공한다. **로스터 스토어 → 선수 스토어 동기화 지점.**

## Key Files

| File                                        | Description                                                                                                                                                                                                                                                                                                                                                                                               |
| ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `player-selection.tsx`                      | `TabHeader` + `GuestButton` + `PlayerSection` + `TabFooter`(이전/다음, 다음은 인원 불일치 시 disabled) + `ToastMessage`                                                                                                                                                                                                                                                                                   |
| `player-selection.hook.ts`                  | `usePlayerSelection()`: `detailMode`, `isDisabled = available !== required`, 카드 클릭(토글 또는 상세 모달), 탭 이동. **effect: `useRosterStore.rows` → `PlayerClass[]` → `setPlayers`** (rows 변경 시 재실행)                                                                                                                                                                                            |
| `guest-button.tsx` / `.hooks.ts`            | 컨트롤 패널: 게스트 추가 버튼(모달), `<Tesseract/>`, "명단 관리" 버튼(→ `SheetModal`, 로컬 useState), "선수 정보 보기" 스위치(`<label htmlFor>` + `Switch onChange`, dashed 타일·활성 시 primary 보더; ≤767px는 `useMediaQuery`로 라벨 "선수 정보"·`size="small"`), 선택 상태 `Alert`. 데스크톱은 액션 한 줄 + 우측 Alert, ≤767px는 2×2 그리드 + 전폭 Alert. `Form.useForm()`을 여기서 만들어 모달에 전달 |
| `sheet-modal.tsx` / `.scss`                 | "명단 관리" 모달: 시트 관리 안내(5분 캐시·게스트 안내·권한) + `ROSTER_SHEET_EDIT_URL` 새 탭 CTA(클릭 시 모달 닫힘). URL 빈 문자열이면 버튼·모달 미렌더                                                                                                                                                                                                                                                    |
| `guest-modal.tsx` / `.hooks.ts`             | 게스트 폼(이름 ≤5자, 매칭 선수 Select, 실력 Select). 규칙: 선수당 게스트 ≤2, 지원 1/2·기존 게스트는 매칭 대상 제외. 게스트 id `guest-<Date.now()>`, `isGuest: true`, 매칭 선수의 `connectedPlayerIds`에 역링크                                                                                                                                                                                            |
| `player-section.tsx` / `.hooks.ts`          | `Row/Col(xs12 md8)` 카드 그리드. `selectMode = !detailMode && isActiveForMatch` → `.selected` + Checkbox. 정보 모드에선 체크박스 숨기고 자리에 lucide `Info` 아이콘                                                                                                                                                                                                                                       |
| `toast-message.tsx` / `.hooks.ts`           | 선택 상태 토스트(`key: TabMenu.PlayerSelection`), 탭을 벗어나면 destroy                                                                                                                                                                                                                                                                                                                                   |
| `player-selection.scss`, `guest-modal.scss` | 카드(보더 2px 고정 — 선택 시 reflow 방지), 스크롤 컨테이너, CTA 버튼, 모달 노트                                                                                                                                                                                                                                                                                                                           |
| `index.ts`                                  | 배럴                                                                                                                                                                                                                                                                                                                                                                                                      |

## Subdirectories

| Directory    | Purpose                                                         |
| ------------ | --------------------------------------------------------------- |
| `__tests__/` | `guest-modal.test.tsx` — 모달 마운트·게스트 추가 시 스토어 반영 |

## For AI Agents

### Working In This Directory

- `Form.Item` 자식은 단일 `Flex`로 감싸야 antd가 `value/onChange`를 주입한다(과거 회귀).
- 로스터 → 선수 동기화 effect는 `setPlayers`로 전체를 덮어쓴다. 시트 갱신 후 새로고침 시 선택 상태가 초기화되는 것은 의도된 동작.

## Dependencies

### Internal

- `@/entities`, `@/shared`, `@/features/tesseract`(크로스 피처), `../../lib`, `../../model`

<!-- MANUAL: -->
