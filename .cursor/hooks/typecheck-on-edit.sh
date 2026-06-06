#!/bin/bash
input=$(cat)
file=$(echo "$input" | jq -r '.filePath // .path // empty')

if [ -z "$file" ]; then
  exit 0
fi

case "$file" in
  *.ts|*.tsx)
    result=$(pnpm tsc --noEmit 2>&1 | head -20)
    if [ $? -ne 0 ]; then
      echo "{\"additional_context\": \"TypeScript errors detected after edit:\\n${result}\"}"
      exit 0
    fi
    ;;
esac

exit 0
