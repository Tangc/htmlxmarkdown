import { describe, expect, it } from "vitest";
import template from "../../.github/ISSUE_TEMPLATE/feedback.yml?raw";
import { feedbackIssueFieldId } from "./feedbackIssue";

describe("feedback issue template", () => {
  it("keeps feedback lightweight with one free-form textarea", () => {
    expect(template.match(/type: textarea/g)).toHaveLength(1);
    expect(template).toContain(`id: ${feedbackIssueFieldId}`);
    expect(template).toContain("Write anything");
    expect(template).toContain("想写什么都可以");
  });
});
