import { describe, expect, it } from "vitest";
import { detectLanguage } from "./i18n";

describe("detectLanguage", () => {
  it("uses Simplified Chinese for Chinese system languages", () => {
    expect(detectLanguage(["zh-CN"])).toBe("zh-CN");
    expect(detectLanguage(["zh-Hans-CN"])).toBe("zh-CN");
    expect(detectLanguage(["zh"])).toBe("zh-CN");
  });

  it("uses English for English, unknown, or missing system languages", () => {
    expect(detectLanguage(["en-US"])).toBe("en");
    expect(detectLanguage(["fr-FR"])).toBe("en");
    expect(detectLanguage([])).toBe("en");
    expect(detectLanguage(undefined)).toBe("en");
  });
});
