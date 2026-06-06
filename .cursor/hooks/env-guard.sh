#!/bin/bash
input=$(cat)
file=$(echo "$input" | jq -r '.filePath // .path // .updated_input.path // empty')

if [ -z "$file" ]; then
  echo '{ "permission": "allow" }'
  exit 0
fi

case "$file" in
  .env|.env.*|.env.local|.env.production|.env.development)
    echo '{
      "permission": "deny",
      "user_message": "Blocked: writing to environment files (.env*) is not allowed to prevent accidental secret exposure.",
      "agent_message": "Hook denied write to env file. Use .env.example for templates instead."
    }'
    exit 0
    ;;
esac

echo '{ "permission": "allow" }'
exit 0
