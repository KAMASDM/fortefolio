// @vitest-environment jsdom

import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const serviceMocks = vi.hoisted(() => ({
  saveResume: vi.fn(() => Promise.resolve()),
  subscribeToResume: vi.fn((_uid, _resumeId, onData) => {
    onData({
      id: "resume-1",
      resumeData: {
        personalInfo: {},
        education: [],
        experience: [],
        skills: [],
        projects: [],
        references: [],
      },
      metadata: {
        title: "Resume",
        createdAt: 1,
        lastModified: 1,
        shared: false,
        presentation: {
          template: "modern",
          colorScheme: "blue",
          fontFamily: "Poppins",
          fontSize: 10,
          sectionOrder: [],
          starredSections: [],
        },
      },
    });
    return vi.fn();
  }),
}));

vi.mock("../src/services/resumeService", () => serviceMocks);

import { useResumeEditor } from "../src/hooks/useResumeEditor";

describe("resume editor saving and navigation", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    window.sessionStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const setup = () => {
    const navigate = vi.fn();
    const currentUser = { uid: "user-1" };
    const { result } = renderHook(() =>
      useResumeEditor({
        currentUser,
        resumeId: "resume-1",
        navigate,
      }),
    );
    return { result, navigate };
  };

  it("marks form edits dirty and autosaves after five seconds", async () => {
    const { result } = setup();

    act(() => {
      result.current.updateResumeData("personalInfo", { fullName: "Ada" });
    });
    expect(result.current.unsavedChanges).toBe(true);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(4999);
    });
    expect(serviceMocks.saveResume).not.toHaveBeenCalled();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1);
    });
    expect(serviceMocks.saveResume).toHaveBeenCalledTimes(1);
    expect(result.current.unsavedChanges).toBe(false);
  });

  it("blocks in-app navigation while dirty and honors discard", async () => {
    const { result, navigate } = setup();
    act(() => {
      result.current.updateResumeData("personalInfo", { fullName: "Ada" });
      result.current.navigateWithConfirmation("/dashboard");
    });

    expect(result.current.showLeaveConfirmation).toBe(true);
    expect(navigate).not.toHaveBeenCalledWith("/dashboard");

    await act(async () => {
      await result.current.handleConfirmedNavigation(false);
    });
    expect(navigate).toHaveBeenCalledWith("/dashboard");
  });

  it("persists presentation changes through the same save path", async () => {
    const { result } = setup();
    act(() => {
      result.current.updatePresentation({
        template: "creative",
        fontSize: 12,
      });
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(5000);
    });

    expect(serviceMocks.saveResume).toHaveBeenCalledWith(
      "user-1",
      "resume-1",
      expect.objectContaining({
        presentation: expect.objectContaining({
          template: "creative",
          fontSize: 12,
        }),
      }),
    );
  });

  it("does not clear edits made while an earlier save is in flight", async () => {
    let finishFirstSave;
    serviceMocks.saveResume.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          finishFirstSave = resolve;
        }),
    );
    const { result } = setup();

    act(() => {
      result.current.updateResumeData("personalInfo", { fullName: "Ada" });
    });
    let firstSave;
    await act(async () => {
      firstSave = result.current.saveResumeData(false);
      await Promise.resolve();
    });
    act(() => {
      result.current.updateResumeData("personalInfo", {
        fullName: "Ada Lovelace",
      });
    });
    await act(async () => {
      finishFirstSave();
      await firstSave;
    });

    expect(result.current.unsavedChanges).toBe(true);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(5000);
    });
    expect(serviceMocks.saveResume).toHaveBeenCalledTimes(2);
    expect(result.current.unsavedChanges).toBe(false);
  });
  it("saves the latest keystroke even when Save runs in the same event", async () => {
    const { result } = setup();
    await act(async () => {
      result.current.updateResumeData("personalInfo", {
        fullName: "Latest name",
      });
      await result.current.saveResumeData(false);
    });
    expect(serviceMocks.saveResume).toHaveBeenLastCalledWith(
      "user-1",
      "resume-1",
      expect.objectContaining({
        resumeData: expect.objectContaining({
          personalInfo: { fullName: "Latest name" },
        }),
      }),
    );
  });

  it("keeps a recovery draft after a save failure and allows retry", async () => {
    serviceMocks.saveResume.mockImplementationOnce(() => {
      throw new Error("sync validation failure");
    });
    const { result } = setup();
    await act(async () => {
      result.current.updateResumeData("personalInfo", {
        fullName: "Recover me",
      });
      expect(await result.current.saveResumeData(false)).toBe(false);
    });
    expect(result.current.unsavedChanges).toBe(true);
    expect(
      window.sessionStorage.getItem("fortefolio:draft:user-1:resume-1"),
    ).toContain("Recover me");
    await act(async () => {
      expect(await result.current.saveResumeData(false)).toBe(true);
    });
    expect(result.current.unsavedChanges).toBe(false);
    expect(
      window.sessionStorage.getItem("fortefolio:draft:user-1:resume-1"),
    ).toBeNull();
  });

  it("undoes a replacement as one change and redoes it", () => {
    const { result } = setup();
    act(() =>
      result.current.replaceResume({
        personalInfo: { fullName: "Imported" },
        education: [],
        experience: [],
        skills: [],
        projects: [],
        references: [],
      }),
    );
    expect(result.current.canUndo).toBe(true);
    act(() => result.current.undo());
    expect(result.current.resumeData.personalInfo.fullName).toBeUndefined();
    act(() => result.current.redo());
    expect(result.current.resumeData.personalInfo.fullName).toBe("Imported");
  });
});
