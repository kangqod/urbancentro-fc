#!/usr/bin/env bash
# Stop 훅 러너: pnpm verify(lint→format:check→typecheck→test:run, SSOT)를 얇게 강제한다.
# 변경 감지: 관련 소스/설정 파일의 내용 해시가 지난 통과 때와 같으면(코드 변경 없음) verify를 스킵한다.
#   - 순수 Q&A 턴처럼 코드가 안 바뀐 종료에선 full verify를 돌리지 않아 오버헤드 0.
#   - 해시는 verify 통과 시에만 갱신 → 실패 상태는 고쳐질 때까지 매번 재검사된다.
# 주의: 이 Claude Code 버전 공식 문서(code.claude.com/docs/en/hooks)엔 stop_hook_active 필드가 없다.
#   대신 실패 카운트 파일로 무한 재시도를 3회에서 강제 종료(exit 0)해 루프를 막는다.
set -u
cd "$(dirname "$0")/../.." || exit 0

STATE_DIR="node_modules/.cache"
FAIL_COUNT_FILE="$STATE_DIR/verify-gate-fail-count"
SRC_HASH_FILE="$STATE_DIR/verify-gate-srchash"
MAX_RETRIES=3
mkdir -p "$STATE_DIR"

# verify가 검사하는 대상(코드/설정)의 내용 해시. 추적 + 미추적(신규) 소스 모두 포함.
current_hash=$(
  {
    git ls-files -z -- src package.json vite.config.ts 'tsconfig*.json' eslint.config.js .prettierrc.json .prettierignore 2>/dev/null
    git ls-files -z --others --exclude-standard -- src 2>/dev/null
  } | sort -z | xargs -0 shasum 2>/dev/null | shasum | awk '{print $1}'
)

# 코드 변경이 없으면(지난 통과 해시와 동일) verify 스킵.
if [ -n "$current_hash" ] && [ -f "$SRC_HASH_FILE" ] && [ "$current_hash" = "$(cat "$SRC_HASH_FILE" 2>/dev/null)" ]; then
  exit 0
fi

fail_count=0
[ -f "$FAIL_COUNT_FILE" ] && fail_count=$(cat "$FAIL_COUNT_FILE" 2>/dev/null || echo 0)

log=$(pnpm verify 2>&1)
status=$?

if [ "$status" -eq 0 ]; then
  rm -f "$FAIL_COUNT_FILE"
  [ -n "$current_hash" ] && echo "$current_hash" > "$SRC_HASH_FILE"
  exit 0
fi

fail_count=$((fail_count + 1))
echo "$fail_count" > "$FAIL_COUNT_FILE"

if [ "$fail_count" -ge "$MAX_RETRIES" ]; then
  # 동일 실패가 반복돼 무한 루프로 보임 — 카운트 리셋하고 정지를 허용(사람 개입 필요)
  rm -f "$FAIL_COUNT_FILE"
  echo "pnpm verify가 ${MAX_RETRIES}회 연속 실패해 재시도를 멈춥니다. 수동 확인이 필요합니다." >&2
  echo "$log" | tail -40 >&2
  exit 0
fi

echo "pnpm verify 실패(재시도 ${fail_count}/${MAX_RETRIES}) — 아래 로그를 보고 수정하세요." >&2
echo "$log" | tail -60 >&2
exit 2
