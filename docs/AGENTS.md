<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-08-25 | Updated: 2026-08-25 -->

# docs

## Purpose

설계·계획 문서 보관. 현재 문서는 이미 실행 완료된 과거 계획이라 참고용이다.

## Key Files

| File                           | Description                                                                                                                                                                    |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `vitest-team-refactor-plan.md` | Vitest 도입 + `balance-teams.ts` 리팩터 계획(Phase 1 설정, Phase 2 헬퍼 분리·`TIER_WEIGHTS` 추출·`distributeGuests` reduce 버그, Phase 3 테스트 케이스). 대부분 구현 완료 상태 |
| `roster-template.csv`          | 시트 명단 템플릿(UTF-8 BOM, Excel 호환). 헤더 7열 + 규칙을 보여주는 가상 선수 4행. 새 팀(테넌트) 시트를 만들 때 이 파일을 Google Sheets로 가져오기 → 내용 교체 → 웹에 게시 CSV |
| `roster-template.md`           | 시트 사용설명서(비개발자용): 만들기·열 규칙(이름 1~~6자·동명이인 접미사, 연도 1950~~2100, 등번호 0, 티어, 특성 `/`, 프리미엄 1)·데이터 확인 규칙·게시·장애 동작                |

## For AI Agents

### Working In This Directory

- 현재 코드 상태와 다를 수 있으니 여기 내용을 근거로 코드를 판단하지 말고 `src/entities/team/lib`를 직접 읽는다.

<!-- MANUAL: -->
