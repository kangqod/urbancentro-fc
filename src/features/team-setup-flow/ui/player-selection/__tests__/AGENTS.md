<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-08-25 | Updated: 2026-08-25 -->

# player-selection/**tests**

## Key Files

| File                   | Description                                                                                                                                          |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `guest-modal.test.tsx` | 실제 부모와 같은 `Wrapper`(`Form.useForm()` + open 상태)로 `GuestModal` 렌더. 이름 입력 표시, 이름 입력 후 추가하기 → `usePlayerStore`에 게스트 추가 |

## For AI Agents

### Working In This Directory

- `renderWithProviders`(`@/shared/test/render`)를 쓰고 스토어는 afterEach 자동 리셋에 맡긴다.

<!-- MANUAL: -->
