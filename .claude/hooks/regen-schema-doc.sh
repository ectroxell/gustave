#!/usr/bin/env bash
# Hook: regenerate DATABASE_SCHEMA.md when src/db/schema.ts is edited
set -euo pipefail

FILE_PATH=$(jq -r '.tool_input.file_path // empty' < /dev/stdin)

if [[ "$FILE_PATH" == *"src/db/schema.ts" ]]; then
  npm run db:schema-doc
fi
