import { afterEach, describe, expect, it } from "vitest"

import {
  getOtpIdFromStorage,
  getSessionFromStorage,
  OTP_ID_STORAGE_KEY,
  readLocalStorage,
  removeLocalStorage,
  removeOtpIdFromStorage,
  removeSessionFromStorage,
  SESSION_STORAGE_KEY,
  setOtpIdInStorage,
  setSessionInStorage,
  writeLocalStorage,
} from "./storage"

afterEach(() => {
  localStorage.clear()
})

describe("readLocalStorage / writeLocalStorage", () => {
  it("writes and reads a JSON value", () => {
    writeLocalStorage("test-key", { foo: "bar" })
    expect(readLocalStorage("test-key")).toEqual({ foo: "bar" })
  })

  it("returns null for a missing key", () => {
    expect(readLocalStorage("nonexistent")).toBeNull()
  })

  it("handles primitive values", () => {
    writeLocalStorage("num", 42)
    expect(readLocalStorage("num")).toBe(42)

    writeLocalStorage("str", "hello")
    expect(readLocalStorage("str")).toBe("hello")

    writeLocalStorage("bool", true)
    expect(readLocalStorage("bool")).toBe(true)
  })

  it("returns null when JSON parsing fails", () => {
    localStorage.setItem("bad-json", "{invalid")
    expect(readLocalStorage("bad-json")).toBeNull()
  })
})

describe("removeLocalStorage", () => {
  it("removes a key", () => {
    writeLocalStorage("to-remove", "value")
    removeLocalStorage("to-remove")
    expect(readLocalStorage("to-remove")).toBeNull()
  })

  it("does not throw for missing keys", () => {
    expect(() => removeLocalStorage("nope")).not.toThrow()
  })
})

describe("session helpers", () => {
  const mockSession = {
    userId: "user-123",
    organizationId: "org-456",
    expiry: Date.now() + 900_000,
  }

  it("stores and retrieves a session", () => {
    setSessionInStorage(mockSession as any)
    const stored = getSessionFromStorage()
    expect(stored).toEqual(mockSession)
  })

  it("returns null when no session exists", () => {
    expect(getSessionFromStorage()).toBeNull()
  })

  it("removes a session", () => {
    setSessionInStorage(mockSession as any)
    removeSessionFromStorage()
    expect(getSessionFromStorage()).toBeNull()
  })

  it("uses the correct storage key", () => {
    setSessionInStorage(mockSession as any)
    expect(localStorage.getItem(SESSION_STORAGE_KEY)).toBeTruthy()
  })
})

describe("OTP ID helpers", () => {
  it("stores and retrieves an OTP ID", () => {
    setOtpIdInStorage("otp-abc")
    expect(getOtpIdFromStorage()).toBe("otp-abc")
  })

  it("returns null when no OTP ID exists", () => {
    expect(getOtpIdFromStorage()).toBeNull()
  })

  it("removes an OTP ID", () => {
    setOtpIdInStorage("otp-abc")
    removeOtpIdFromStorage()
    expect(getOtpIdFromStorage()).toBeNull()
  })

  it("uses the correct storage key", () => {
    setOtpIdInStorage("otp-xyz")
    expect(localStorage.getItem(OTP_ID_STORAGE_KEY)).toBeTruthy()
  })
})
