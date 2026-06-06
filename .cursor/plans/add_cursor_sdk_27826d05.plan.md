---
name: Add Cursor SDK
overview: Install `@cursor/sdk` and create a local agent script that can run Cursor agents programmatically against this codebase, with proper auth, error handling, and disposal patterns.
todos:
  - id: install
    content: Install `@cursor/sdk` and `tsx` as dev dependencies
    status: completed
  - id: env
    content: Add `CURSOR_API_KEY` to `.env.example`
    status: completed
  - id: script
    content: Create `scripts/cursor-agent.ts` with durable agent pattern, streaming, and error handling
    status: completed
  - id: npm-script
    content: Add `agent` script to `package.json`
    status: completed
isProject: false
---

# Add Cursor SDK to Demo Embedded Wallet

## What changes

1. **Install the package** -- add `@cursor/sdk` as a dev dependency via `pnpm add -D @cursor/sdk`.

2. **Add a `CURSOR_API_KEY` env var** -- append it to [`.env.example`](.env.example) so contributors know it's needed. The key comes from [cursor.com/dashboard/cloud-agents](https://cursor.com/dashboard/cloud-agents).

3. **Create `scripts/cursor-agent.ts`** -- a standalone script that demonstrates the SDK's durable pattern (`Agent.create` + `agent.send` with streaming). It will:
   - Read `CURSOR_API_KEY` from `.env` (or the environment)
   - Accept a prompt from the command line (`tsx scripts/cursor-agent.ts "your prompt here"`)
   - Create a local agent pointed at the project root
   - Stream the agent's response to stdout
   - Handle both startup errors (`CursorAgentError`) and run errors (`result.status === "error"`)
   - Dispose the agent properly in a `finally` block

4. **Add an npm script** -- add `"agent": "npx tsx scripts/cursor-agent.ts"` to [`package.json`](package.json) so it can be invoked as `pnpm agent "Refactor the auth provider"`.

5. **Add `tsx` as a dev dependency** -- needed to run the TypeScript script directly.

## Key design decisions

- **Local runtime** -- the agent runs on the caller's machine against the working tree. No cloud setup, no repo URL, no PR automation. This can be changed later by swapping `local: { cwd }` for `cloud: { repos }`.
- **Dev dependency** -- the SDK is a development tool, not shipped to production.
- **Standalone script, not an API route** -- avoids coupling the SDK to the web app's runtime. The SDK spawns a local Cursor executor that isn't suitable for a serverless/edge environment anyway.
- **`composer-2` model** -- the current default for most SDK integrations.
