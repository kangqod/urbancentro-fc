# workflows

**Parent context:** `../AGENTS.md`
**Generated:** 2026-08-25 · **Updated:** 2026-11-24

## Key Files

| File         | Description                                                                                                                                                                                                 |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `deploy.yml` | "Deploy to GitHub Pages": `master` push → checkout → `./.github/actions/setup`(Kakao 키 secret) → `pnpm build` → `upload-pages-artifact(./dist)` → `deploy-pages`. 동시성 `deploy-<ref>` cancel-in-progress |
| `lint.yml`   | "CI": PR → `pnpm lint` → `pnpm tsc`. 동시성 `ci-<head_ref>`                                                                                                                                                 |

## Manual Notes

이 제목 아래는 사람이 작성한 메모이며 재생성 시 보존된다.
