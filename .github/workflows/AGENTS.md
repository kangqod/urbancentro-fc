<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-08-25 | Updated: 2026-08-25 -->

# workflows

## Key Files

| File         | Description                                                                                                                                                                                                 |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `deploy.yml` | "Deploy to GitHub Pages": `master` push → checkout → `./.github/actions/setup`(Kakao 키 secret) → `pnpm build` → `upload-pages-artifact(./dist)` → `deploy-pages`. 동시성 `deploy-<ref>` cancel-in-progress |
| `lint.yml`   | "CI": PR → `pnpm lint` → `pnpm tsc`. 동시성 `ci-<head_ref>`                                                                                                                                                 |

<!-- MANUAL: -->
