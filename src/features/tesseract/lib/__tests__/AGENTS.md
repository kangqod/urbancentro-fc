<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-08-25 | Updated: 2026-08-25 -->

# tesseract/lib/**tests**

## Key Files

| File                     | Description                                                                                                 |
| ------------------------ | ----------------------------------------------------------------------------------------------------------- |
| `extract-player.test.ts` | `YY/이름`·약칭(`NAME_ALIASES`) 매칭, `불참` 이후 무시, 시트 연도가 바뀌어도 별칭 매칭 유지(이름만으로 찾음) |

## For AI Agents

### Working In This Directory

- 로스터는 `useRosterStore.setState({ rows: composeRoster(...) })`로 시드한다 — 지원 슬롯이 앞에 붙어도 2글자 프리픽스 폴백과 충돌하지 않는다.

<!-- MANUAL: -->
