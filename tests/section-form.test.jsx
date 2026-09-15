// @vitest-environment jsdom
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useSectionForm } from "../src/hooks/useSectionForm";

describe("section editing", () => {
  it("commits an edit immediately without a timer or an unmount flush", () => {
    const update = vi.fn();
    const { result, unmount } = renderHook(() =>
      useSectionForm([{ id: 1, company: "Before" }], [], update),
    );
    act(() =>
      result.current[1]((entries) =>
        entries.map((row) => ({ ...row, company: "After" })),
      ),
    );
    unmount();
    expect(update).toHaveBeenCalledExactlyOnceWith([
      { id: 1, company: "After" },
    ]);
  });
  it("does not save a blank placeholder on mount", () => {
    const update = vi.fn();
    const { result } = renderHook(() =>
      useSectionForm([], [{ id: 1, name: "" }], update),
    );
    expect(result.current[0]).toHaveLength(1);
    expect(update).not.toHaveBeenCalled();
  });
});
