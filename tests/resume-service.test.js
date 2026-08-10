import { beforeEach, describe, expect, it, vi } from "vitest";

const databaseMocks = vi.hoisted(() => ({
  get: vi.fn(),
  ref: vi.fn((_database, path) => ({ path })),
  set: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
  push: vi.fn(),
  serverTimestamp: vi.fn(() => ({ ".sv": "timestamp" })),
  onValue: vi.fn(),
  off: vi.fn(),
}));

vi.mock("firebase/database", () => databaseMocks);
vi.mock("../src/firebaseConfig", () => ({ database: {} }));

import {
  publishResume,
  saveResume,
  unpublishResume,
} from "../src/services/resumeService";

describe("resume persistence and sharing service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("saves resume data and canonical presentation atomically", async () => {
    await saveResume("user-1", "resume-1", {
      resumeData: { personalInfo: { fullName: "Ada" } },
      title: "Engineer",
      createdAt: 123,
      presentation: { template: "classic", colorScheme: "blue" },
    });

    expect(databaseMocks.update).toHaveBeenCalledWith(
      { path: "users/user-1/resumes/resume-1" },
      expect.objectContaining({
        resumeData: { personalInfo: { fullName: "Ada" } },
        "metadata/title": "Engineer",
        "metadata/presentation": {
          template: "classic",
          colorScheme: "blue",
        },
      })
    );
  });

  it("publishes a separate snapshot and marks the private record shared", async () => {
    databaseMocks.get.mockResolvedValue({
      exists: () => true,
      val: () => ({
        resumeData: { personalInfo: { fullName: "Ada" } },
        metadata: { title: "Engineer" },
      }),
    });

    await publishResume("user-1", "resume-1");

    expect(databaseMocks.set).toHaveBeenCalledWith(
      { path: "publicResumes/user-1/resume-1" },
      expect.objectContaining({ title: "Engineer" })
    );
    expect(databaseMocks.update).toHaveBeenCalledWith(
      { path: "users/user-1/resumes/resume-1" },
      expect.objectContaining({ "metadata/shared": true })
    );
  });

  it("removes the public copy when unpublishing", async () => {
    await unpublishResume("user-1", "resume-1");
    expect(databaseMocks.remove).toHaveBeenCalledWith({
      path: "publicResumes/user-1/resume-1",
    });
  });
});
