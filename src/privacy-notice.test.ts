import { describe, expect, it } from "vitest";
import {
  isNoticeDismissed,
  PRIVACY_NOTICE_KEY,
  rememberNoticeDismissed,
} from "./privacy-notice";

function memoryStorage(): Storage {
  const items = new Map<string, string>();
  return {
    get length() {
      return items.size;
    },
    clear: () => items.clear(),
    getItem: (key) => items.get(key) ?? null,
    key: (index) => [...items.keys()][index] ?? null,
    removeItem: (key) => void items.delete(key),
    setItem: (key, value) => void items.set(key, String(value)),
  };
}

function throwingStorage(): Storage {
  const fail = () => {
    throw new DOMException("denied", "SecurityError");
  };
  return {
    length: 0,
    clear: fail,
    getItem: fail,
    key: fail,
    removeItem: fail,
    setItem: fail,
  };
}

describe("privacy notice storage", () => {
  it("uses the versioned key", () => {
    expect(PRIVACY_NOTICE_KEY).toBe("privacy-notice-v1");
  });

  it("isn't dismissed on a first visit", () => {
    const storage = memoryStorage();
    expect(isNoticeDismissed(() => storage, PRIVACY_NOTICE_KEY)).toBe(false);
  });

  it("is dismissed after OK is remembered", () => {
    const storage = memoryStorage();
    rememberNoticeDismissed(() => storage, PRIVACY_NOTICE_KEY);
    expect(storage.getItem("privacy-notice-v1")).not.toBeNull();
    expect(isNoticeDismissed(() => storage, PRIVACY_NOTICE_KEY)).toBe(true);
  });

  it("ignores a dismissal stored under an older key", () => {
    const storage = memoryStorage();
    storage.setItem("privacy-notice-v0", "1");
    expect(isNoticeDismissed(() => storage, PRIVACY_NOTICE_KEY)).toBe(false);
  });

  it("shows the notice when storage throws", () => {
    expect(isNoticeDismissed(throwingStorage, PRIVACY_NOTICE_KEY)).toBe(false);
  });

  it("shows the notice when reaching storage itself throws", () => {
    const unavailable = (): Storage => {
      throw new DOMException("denied", "SecurityError");
    };
    expect(isNoticeDismissed(unavailable, PRIVACY_NOTICE_KEY)).toBe(false);
  });

  it("doesn't throw when remembering fails", () => {
    expect(() =>
      rememberNoticeDismissed(throwingStorage, PRIVACY_NOTICE_KEY),
    ).not.toThrow();
  });
});
