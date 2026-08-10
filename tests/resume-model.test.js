import { describe, expect, it } from "vitest";
import {
  createPublicResumeSnapshot,
  normalizePresentation,
  normalizeResumeRecord,
} from "../src/services/resumeModel";

describe("resume model compatibility", () => {
  it("migrates legacy template and color metadata into presentation", () => {
    expect(
      normalizePresentation({
        template: "creative",
        colorScheme: "purple",
      })
    ).toMatchObject({
      template: "creative",
      colorScheme: "lavender",
      fontSize: 10,
    });
  });

  it("fills missing resume sections without discarding stored data", () => {
    const normalized = normalizeResumeRecord(
      {
        resumeData: { personalInfo: { fullName: "Ada Lovelace" } },
        metadata: { title: "Engineering" },
      },
      "resume-1"
    );

    expect(normalized.id).toBe("resume-1");
    expect(normalized.resumeData.personalInfo.fullName).toBe("Ada Lovelace");
    expect(normalized.resumeData.experience).toEqual([]);
    expect(normalized.metadata.presentation.template).toBe("modern");
  });

  it("creates a bounded public snapshot without private metadata", () => {
    const snapshot = createPublicResumeSnapshot(
      {
        resumeData: {
          personalInfo: { fullName: "  Ada Lovelace  " },
          experience: [],
        },
        metadata: {
          title: "  Public Resume  ",
          internalNote: "must not publish",
          presentation: { template: "classic", colorScheme: "blue" },
        },
      },
      "resume-1"
    );

    expect(snapshot.title).toBe("Public Resume");
    expect(snapshot.resumeData.personalInfo.fullName).toBe("Ada Lovelace");
    expect(snapshot.presentation.template).toBe("classic");
    expect(snapshot).not.toHaveProperty("metadata");
    expect(snapshot).not.toHaveProperty("internalNote");
  });
});
