import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const rules = JSON.parse(
  readFileSync(`${process.cwd()}/database.rules.json`, "utf8")
).rules;

describe("database rule contract", () => {
  it("keeps private resumes owner-only", () => {
    const privateRules = rules.users.$uid.resumes.$resumeId;
    expect(privateRules[".read"]).toContain("auth.uid === $uid");
    expect(privateRules[".write"]).toContain("auth.uid === $uid");
  });

  it("allows public reads but only owner publication", () => {
    const publicRules = rules.publicResumes.$uid.$resumeId;
    expect(publicRules[".read"]).toBe(true);
    expect(publicRules[".write"]).toContain("auth.uid === $uid");
    expect(publicRules[".validate"]).toContain("presentation");
  });

  it("prevents clients from reading or writing AI counters", () => {
    expect(rules.aiRateLimits.$uid[".read"]).toBe(false);
    expect(rules.aiRateLimits.$uid[".write"]).toBe(false);
  });
});
