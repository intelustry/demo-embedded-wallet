# AGENTS.md

This file defines specialized AI agent roles for the demo-embedded-wallet project. Use the appropriate agent based on the task at hand.

---

## Development Agent

**When to use**: Feature implementation, bug fixes, adding new auth methods, wallet operations, or UI components.

**Context**: This agent has full read/write access and should follow the patterns in `.cursor/rules/`. It should:
- Use server actions for any Turnkey or blockchain operations
- Follow the shadcn/ui component patterns for UI work
- Validate inputs with Zod schemas
- Access environment variables only through `src/env.mjs`
- Create sub-organizations per user with `DEFAULT_ETHEREUM_ACCOUNTS`

**Subagent type**: `generalPurpose`

---

## Code Review Agent

**When to use**: Reviewing pull requests, auditing diffs for correctness, security issues, or pattern violations.

**Context**: This agent operates in read-only mode and checks for:
- Secrets or API keys accidentally exposed in client code
- Server actions missing `"use server"` directive
- Direct `process.env` access instead of `env.mjs`
- Unsafe address handling (missing `getAddress()` normalization)
- OAuth token handling that could leak credentials
- Missing error handling in async operations
- Turnkey API key usage in client components (must be server-only)

**Subagent type**: `explore` (readonly)

**Review checklist**:
1. No secrets in client-side code
2. All addresses normalized with `getAddress()`
3. Error boundaries around async operations
4. Proper TypeScript types (no `any`)
5. Server/client boundary respected
6. Environment variables accessed via `env.mjs`

---

## Test Agent

**When to use**: Writing unit tests, integration tests, or updating test coverage.

**Context**: Tests use Vitest + @testing-library/react. The agent should:
- Place tests adjacent to source files as `*.test.ts` or `*.test.tsx`
- Mock Turnkey SDK calls and Alchemy responses
- Test server actions by mocking the `TurnkeyServerClient`
- Test components with `@testing-library/react` (user-centric queries)
- Use `vi.mock()` for module mocking
- Never make real network requests in tests

**Subagent type**: `generalPurpose`

**Test file naming**: `{filename}.test.{ts,tsx}`

---

## Architecture Agent

**When to use**: Validating structural decisions, reviewing dependency changes, planning refactors, or checking for pattern violations.

**Context**: This agent enforces:
- Provider hierarchy: `ThemeProvider > TurnkeyProvider > AuthProvider`
- Route groups: `(landing)` for unauth, `(dashboard)` for auth
- Server actions isolated in `src/actions/` with proper directives
- No circular dependencies between providers
- Client components don't import server-only modules
- Single responsibility: each action file covers one domain
- Wallet operations flow: create sub-org → create wallet → fund from warchest

**Subagent type**: `explore` (readonly)

**Architectural rules**:
1. `src/actions/` files are server-only (never imported in client components directly)
2. `src/config/` is shared but contains no secrets
3. `src/providers/` components are all `"use client"`
4. `src/lib/` contains pure utilities with no side effects
5. `src/components/ui/` contains unmodified shadcn primitives

---

## UI/UX Agent

**When to use**: Auditing components for accessibility, design consistency, responsive behavior, or user experience issues.

**Context**: This agent checks:
- Accessibility: keyboard navigation, ARIA attributes, color contrast, focus management
- Design consistency: uses theme tokens from `globals.css`, follows spacing scale
- Responsiveness: mobile-first, proper breakpoint usage, touch targets >= 44px
- Animation: uses `tailwindcss-animate`, respects reduced motion
- Component quality: proper loading states, error states, empty states
- Form UX: validation feedback, label associations, input masking

**Subagent type**: `explore` (readonly)

**Audit criteria**:
1. All interactive elements have visible focus indicators
2. Form inputs have associated `<Label>` components
3. Modals/dialogs use Radix primitives (not custom implementations)
4. Loading states use skeletons or spinners with `aria-busy`
5. Error messages are descriptive and actionable
6. Layout doesn't break between 320px and 1400px viewport widths
