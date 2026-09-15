import { describe, expect, it } from "vitest";
import {
  createPublicResumeSnapshot,
  normalizePresentation,
  normalizeResumeData,
} from "../src/services/resumeModel";
import {
  hasSectionContent,
  getResumeInsights,
  matchJobDescription,
} from "../src/services/resumeInsights";
import {
  parseResumeBackup,
  createResumeBackup,
  sanitizeImportedResume,
} from "../src/services/resumeTransfer";
import {
  documentData,
  getDocumentSections,
  safeUrl,
} from "../src/services/resumeDocument";
import { createDocxDocument } from "../src/components/ResumeBuilderPage/utils/exportUtils";
import { Packer } from "docx";
import { unzipSync, strFromU8 } from "fflate";

const data = {
  personalInfo: {
    fullName: "Ada Lovelace",
    email: "ada@example.com",
    phone: "private phone",
    location: "London",
    portfolio: "example.com/ada",
  },
  experience: [
    {
      id: 1,
      company: "Analytical",
      position: "Engineer",
      responsibilities: ["Built a compiler"],
    },
  ],
  skills: [{ name: "Engineering", skills: ["React", "C++"] }],
  references: [{ name: "Private Reference", email: "private@example.com" }],
  projects: [
    {
      title: "Compiler",
      link: "example.com/compiler",
      description: "Open source project",
    },
  ],
};

describe("sharing and data normalization", () => {
  it("excludes private contact fields, references and hidden sections from a published snapshot", () => {
    const published = createPublicResumeSnapshot(
      {
        resumeData: { ...data, targetJob: "private application notes" },
        metadata: { presentation: { hiddenSections: ["projects"] } },
      },
      "one",
      { email: false },
    );
    expect(published.resumeData.personalInfo).not.toHaveProperty("phone");
    expect(published.resumeData.personalInfo).not.toHaveProperty("email");
    expect(published.resumeData.references).toEqual([]);
    expect(published.resumeData.projects).toEqual([]);
    expect(published.resumeData).not.toHaveProperty("targetJob");
    expect(data.personalInfo.phone).toBe("private phone");
  });
  it("includes contact details only when chosen", () => {
    const published = createPublicResumeSnapshot({ resumeData: data }, "one", {
      phone: true,
      references: true,
    });
    expect(published.resumeData.personalInfo.phone).toBe("private phone");
    expect(published.resumeData.references[0].name).toBe("Private Reference");
  });
  it("repairs missing arrays, legacy aliases and invalid presentation values", () => {
    expect(
      normalizeResumeData({
        skills: null,
        experience: [null, { description: "Legacy bullet" }],
      }).experience[0].responsibilities,
    ).toEqual(["Legacy bullet"]);
    const style = normalizePresentation({
      presentation: {
        fontSize: 500,
        sectionOrder: ["projects", "projects", "not-real"],
        hiddenSections: ["personalInfo", "skills"],
      },
    });
    expect(style.fontSize).toBe(16);
    expect(style.sectionOrder).toEqual([
      "projects",
      "education",
      "experience",
      "skills",
      "references",
    ]);
    expect(style.hiddenSections).toEqual(["skills"]);
  });
});

describe("resume writing and transfer", () => {
  it("does not reward blank entries or require references to satisfy the checklist", () => {
    expect(
      hasSectionContent([{ id: 1, current: true, responsibilities: [""] }]),
    ).toBe(false);
    expect(
      getResumeInsights({
        personalInfo: {},
        experience: [{ id: 1 }],
        skills: [],
      }).score,
    ).toBe(0);
    expect(
      getResumeInsights(data).checks.map((item) => item.section),
    ).not.toContain("references");
  });
  it("compares complete job terms instead of substrings", () => {
    const result = matchJobDescription(data, "React C++ Python required");
    expect(result.matched).toEqual(["react", "c++"]);
    expect(result.missing).toEqual(["python"]);
  });
  it("round-trips a portable backup and rejects malformed data", () => {
    const backup = createResumeBackup(
      data,
      { title: "Engineer" },
      { template: "minimal", hiddenSections: ["references"] },
    );
    expect(parseResumeBackup(backup)).toMatchObject({
      resumeData: { personalInfo: { fullName: "Ada Lovelace" } },
      metadata: {
        title: "Engineer",
        presentation: { template: "minimal", hiddenSections: ["references"] },
      },
    });
    expect(() => parseResumeBackup("not json")).toThrow();
    expect(() => sanitizeImportedResume({ personalInfo: [] })).toThrow();
    expect(() => parseResumeBackup(" ".repeat(1000001))).toThrow(/1 MB/);
  });
  it("removes unsafe links and preserves portfolio and project URLs", () => {
    expect(safeUrl("javascript:alert(1)")).toBe("");
    expect(documentData(data).personalInfo.website).toBe(
      "https://example.com/ada",
    );
    expect(
      getDocumentSections(data).find((section) => section.key === "projects")
        .items[0].link,
    ).toBe("https://example.com/compiler");
  });
  it("orders and hides the same sections in document exports", () => {
    const sections = getDocumentSections(data, {
      sectionOrder: ["projects", "experience"],
      hiddenSections: ["references"],
    });
    expect(sections.map((section) => section.key)).toEqual([
      "projects",
      "experience",
      "skills",
    ]);
  });
  it("writes references and hyperlinks into DOCX, and omits hidden sections", async () => {
    const buffer = await Packer.toBuffer(
      createDocxDocument(data, { sectionOrder: ["projects", "experience"] }),
    );
    const files = unzipSync(buffer);
    const xml = strFromU8(files["word/document.xml"]);
    expect(xml).toContain("Private Reference");
    expect(xml).toContain("Built a compiler");
    expect(xml.indexOf("Projects")).toBeLessThan(xml.indexOf("Experience"));
    expect(strFromU8(files["word/_rels/document.xml.rels"])).toContain(
      "https://example.com/ada",
    );
    const hidden = unzipSync(
      await Packer.toBuffer(
        createDocxDocument(data, { hiddenSections: ["references"] }),
      ),
    );
    expect(strFromU8(hidden["word/document.xml"])).not.toContain(
      "Private Reference",
    );
  });
});
