#!/bin/bash
input=$(cat)
file=$(echo "$input" | jq -r '.filePath // .path // empty')

if [ -z "$file" ]; then
  exit 0
fi

case "$file" in
  *.ts|*.tsx)
    pnpm eslint "$file" --fix --quiet 2>/dev/null
    ;;
esac

exit 0
