<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-08-25 | Updated: 2026-08-25 -->

# team-setup-flow/lib/**tests**

## Key Files

| File                    | Description                                                                                                                                                                                                                                                                              |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `shared-player.test.ts` | 로컬 `serialize()`가 `footer.hooks.handleShareKakao`를 복제. 케이스: 로스터 선수 연도 유지·비게스트, `SUPPORT_SLOTS[0]`(지원 1) 비게스트 복원, 게스트 플래그·`DEFAULT_YEAR`, 레거시 문자열 미스 → 게스트, 신규 포맷 미스 → 연도/티어 유지, 영문 `ace` → 에이스, 4티어 `it.each` 매트릭스 |

## For AI Agents

### Working In This Directory

- 인코더(`footer.hooks.ts`)를 바꾸면 여기 `serialize()`도 동일하게 바꿔야 테스트가 의미가 있다.
- `buildSharedPlayer`가 런타임 로스터 스토어를 조회하므로 `beforeAll`에서 `useRosterStore.setState`로 테스트 로스터를 시드한다.

<!-- MANUAL: -->
