import { describe, expect, it } from "vitest";
import { getViewportCookieScript, parseViewportCookie } from "./script";

describe("parseViewportCookie", () => {
  it("parses mobile and desktop values", () => {
    expect(parseViewportCookie("mobile")).toBe(true);
    expect(parseViewportCookie("desktop")).toBe(false);
    expect(parseViewportCookie("unknown")).toBeUndefined();
    expect(parseViewportCookie(undefined)).toBeUndefined();
  });
});

describe("getViewportCookieScript", () => {
  it("emits a matchMedia cookie script", () => {
    const script = getViewportCookieScript({
      cookieName: "viewport",
      breakpoint: 768,
      maxAgeSeconds: 60,
    });

    expect(script).toContain('max-width: 767px');
    expect(script).toContain('document.cookie="viewport="');
    expect(script).toContain("max-age=60");
  });

  it("rejects unsafe cookie names", () => {
    expect(() =>
      getViewportCookieScript({ cookieName: "viewport;evil" }),
    ).toThrow(/Invalid cookieName/);
  });
});
