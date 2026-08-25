<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-08-25 | Updated: 2026-08-25 -->

# .github

## Purpose

GitHub Actions 구성. PR 검증(CI)과 `master` push 시 GitHub Pages 배포를 담당한다.

## Subdirectories

| Directory        | Purpose                                                                                                                                    |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `actions/setup/` | 복합 액션 "Setup": pnpm 10 + node 24 설치, `VITE_KAKAO_JS_KEY` 입력을 `.env`로 기록, `pnpm install`                                        |
| `workflows/`     | `deploy.yml`(master push → build → upload-pages-artifact → deploy-pages, 동시성 `deploy-<ref>`), `lint.yml`(PR → `pnpm lint` → `pnpm tsc`) |

## For AI Agents

### Working In This Directory

- 배포는 `deploy.yml`이 자동 처리. 로컬 `pnpm pages`(gh-pages 브랜치)와 병행 사용 중이므로 배포 방식 변경 시 둘을 함께 검토.
- Kakao 키는 `secrets.VITE_KAKAO_JS_KEY` → setup 액션이 `.env`에 쓴다. 워크플로에 값 하드코딩 금지.
- `lint.yml`의 `pnpm tsc`는 package.json에 정의된 스크립트가 아니다(정의된 것은 `typecheck`). 수정 시 `pnpm typecheck` 또는 `pnpm verify`로 정리 검토.

### Testing Requirements

- 워크플로 변경은 PR을 열어 CI가 실제로 통과하는지 확인.

## Dependencies

### External

- actions/checkout@v6, pnpm/action-setup@v5, actions/setup-node@v6, actions/upload-pages-artifact@v5, actions/deploy-pages@v5

<!-- MANUAL: -->
