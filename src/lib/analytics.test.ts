import { describe, expect, it, vi } from "vitest";
import { trackEvent } from "./analytics";

describe("trackEvent", () => {
  it("sends GA events when gtag is available", () => {
    const gtag = vi.fn();
    window.gtag = gtag;

    trackEvent("demo_opened", { source: "button" });

    expect(gtag).toHaveBeenCalledWith("event", "demo_opened", { source: "button" });
    delete window.gtag;
  });

  it("does nothing when gtag is unavailable", () => {
    delete window.gtag;

    expect(() => trackEvent("demo_opened")).not.toThrow();
  });
});
