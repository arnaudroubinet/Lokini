#!/bin/bash
# Pre-git hook: runs format:check, build and test before git commit/push.
# Exit code 2 blocks the tool call and feeds stderr to Claude.

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

# Only intercept git commit and git push commands
if ! echo "$COMMAND" | grep -qE 'git (commit|push)'; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR" || exit 0

echo "Running format check..." >&2
if ! pnpm format:check 2>&1; then
  echo "Format check failed. Run 'pnpm format' to fix." >&2
  exit 2
fi

echo "Running build..." >&2
if ! pnpm build 2>&1; then
  echo "Build failed. Fix errors before committing." >&2
  exit 2
fi

echo "Running tests..." >&2
if ! pnpm test 2>&1; then
  echo "Tests failed. Fix failures before committing." >&2
  exit 2
fi

exit 0
