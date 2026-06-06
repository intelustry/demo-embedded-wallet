import { describe, expect, it } from "vitest"

import { cn, getRpId, truncateAddress } from "./utils"

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("px-2", "py-1")).toBe("px-2 py-1")
  })

  it("deduplicates conflicting tailwind classes", () => {
    expect(cn("px-2", "px-4")).toBe("px-4")
  })

  it("handles conditional classes", () => {
    expect(cn("base", false && "hidden", "visible")).toBe("base visible")
  })

  it("returns empty string for no input", () => {
    expect(cn()).toBe("")
  })
})

describe("truncateAddress", () => {
  const addr = "0x1234567890abcdef1234567890abcdef12345678"

  it("truncates with default prefix=8 and suffix=4", () => {
    const result = truncateAddress(addr)
    expect(result).toBe("0x123456•••5678")
  })

  it("respects custom prefix and suffix", () => {
    const result = truncateAddress(addr, { prefix: 6, suffix: 6 })
    expect(result).toBe("0x1234•••345678")
  })

  it("handles short addresses gracefully", () => {
    const result = truncateAddress("0xABCD", { prefix: 4, suffix: 2 })
    expect(result).toBe("0xAB•••CD")
  })
})

describe("getRpId", () => {
  it("extracts hostname from a valid URL", () => {
    expect(getRpId("https://example.com/path")).toBe("example.com")
  })

  it("extracts hostname from localhost URL", () => {
    expect(getRpId("http://localhost:3000")).toBe("localhost")
  })

  it("returns null for an invalid URL", () => {
    expect(getRpId("not-a-url")).toBeNull()
  })

  it("handles URLs with subdomains", () => {
    expect(getRpId("https://app.wallet.example.com")).toBe(
      "app.wallet.example.com"
    )
  })
})
