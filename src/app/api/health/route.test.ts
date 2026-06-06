import { describe, expect, it } from "vitest"

import { GET } from "./route"

describe("GET /api/health", () => {
  it("returns status ok", async () => {
    const response = await GET()
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.status).toBe("ok")
  })

  it("returns a valid ISO timestamp", async () => {
    const response = await GET()
    const body = await response.json()

    expect(body.timestamp).toBeDefined()
    const parsed = new Date(body.timestamp)
    expect(parsed.toISOString()).toBe(body.timestamp)
  })
})
