import { test, expect } from "@playwright/test";

test("editing survives immediate section changes, undo and reload", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/resume/demo?step=experience");
  await page
    .getByRole("textbox", { name: "Company", exact: true })
    .fill("New Company");
  await page.getByRole("button", { name: "Next Section", exact: true }).click();
  await expect(page).toHaveURL(/step=skills/);
  await page.goBack();
  await expect(
    page.getByRole("textbox", { name: "Company", exact: true }),
  ).toHaveValue("New Company");
  await page.getByRole("button", { name: "Undo last edit" }).click();
  await expect(
    page.getByRole("textbox", { name: "Company", exact: true }),
  ).toHaveValue("Studio North");
  await page.getByRole("button", { name: "Redo last edit" }).click();
  await expect(
    page.getByRole("textbox", { name: "Company", exact: true }),
  ).toHaveValue("New Company");
  await page.reload();
  await expect(
    page.getByRole("textbox", { name: "Company", exact: true }),
  ).toHaveValue("New Company");
  expect(errors).toEqual([]);
});

test("mobile preview supports customization and has no page overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/resume/demo?view=preview");
  await page.getByRole("button", { name: "Customize your resume" }).click();
  await page.getByRole("combobox", { name: "Font", exact: true }).click();
  await page.getByRole("option", { name: "MONTSERRAT" }).click();
  await expect(
    page.getByRole("slider", { name: "Resume font size" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Customize your resume" }).click();
  await page.screenshot({
    path: "test-results/mobile-editor.png",
    fullPage: true,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth + 2,
    ),
  ).toBe(true);
});

test("publishing honors privacy and disabling removes the public copy", async ({
  page,
}) => {
  await page.goto("/resume/demo?view=preview");
  await page.getByRole("button", { name: "Export / Print" }).click();
  await page.getByRole("menuitem", { name: /Publish Public Link/ }).click();
  const dialog = page.getByRole("dialog", { name: "Share your resume" });
  await dialog
    .getByRole("button", { name: "Publish resume", exact: true })
    .click();
  await expect(dialog.getByLabel("Public resume link")).toBeVisible();
  await page.goto("/preview-only/test-user/demo");
  await expect(
    page.getByText("Published resume", { exact: true }),
  ).toBeVisible();
  await expect(page.getByText("+1 555 0100", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Jordan Lee", { exact: true })).toHaveCount(0);
  await page.goto("/resume/demo?view=preview");
  await page.getByRole("button", { name: "Export / Print" }).click();
  await page.getByRole("menuitem", { name: /Publish Public Link/ }).click();
  await page.getByRole("button", { name: "Disable link", exact: true }).click();
  await expect(page.getByLabel("Public resume link")).toHaveCount(0);
  await page.goto("/preview-only/test-user/demo");
  await expect(page.getByText(/This resume isn't public/)).toBeVisible();
});

test("AI import is reviewed before replacing data and can be undone", async ({
  page,
}) => {
  await page.route("**/.netlify/functions/openai", (route) =>
    route.fulfill({
      json: {
        success: true,
        content: JSON.stringify({
          personalInfo: { fullName: "Sam Rivera", email: "sam@example.com" },
          skills: [{ name: "Engineering", skills: ["React", "TypeScript"] }],
        }),
      },
    }),
  );
  await page.goto("/resume/demo?step=personalInfo");
  await page
    .getByRole("button", { name: "Import resume", exact: true })
    .click();
  await page
    .getByLabel("Your existing resume", { exact: true })
    .fill(
      "Sam Rivera\nsam@example.com\nEngineering skills: React and TypeScript",
    );
  await page.getByRole("button", { name: "Organize with AI" }).click();
  await expect(
    page.getByRole("dialog").getByText("Sam Rivera", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Use this resume" }).click();
  await expect(
    page.getByRole("textbox", { name: "Full Name", exact: true }),
  ).toHaveValue("Sam Rivera");
  await page.getByRole("button", { name: "Undo last edit" }).click();
  await expect(
    page.getByRole("textbox", { name: "Full Name", exact: true }),
  ).toHaveValue("Alex Morgan");
});

test("writing coach previews a summary before applying it", async ({
  page,
}) => {
  await page.route("**/.netlify/functions/openai", (route) =>
    route.fulfill({
      json: {
        success: true,
        content: JSON.stringify({
          text: "A reviewed, factual professional summary.",
        }),
      },
    }),
  );
  await page.goto("/resume/demo?step=personalInfo");
  await page.getByRole("button", { name: /Resume coach/ }).click();
  await page
    .getByLabel("Target job description")
    .fill(
      "Product designer with Figma, accessibility and prototyping experience.",
    );
  await page
    .getByRole("button", { name: "Draft a professional summary" })
    .click();
  await expect(
    page.getByLabel("Review and edit your suggested summary"),
  ).toHaveValue("A reviewed, factual professional summary.");
  await page.getByRole("button", { name: "Apply summary" }).click();
  await expect(page.locator("textarea[name=summary]")).toHaveValue(
    "A reviewed, factual professional summary.",
  );
  await page.screenshot({
    path: "test-results/desktop-editor.png",
    fullPage: true,
  });
});

test("all 24 templates render without runtime errors", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/resume/demo?view=preview");
  for (const label of [
    "Modern",
    "Modern Neo",
    "Modern Slate",
    "Modern Aurora",
    "Modern Metro",
    "Modern Zen",
    "Modern Nova",
    "Modern Edge",
    "Modern Prism",
    "Modern Summit",
    "Modern Flow",
    "Minimal",
    "Creative",
    "Professional",
    "Executive",
    "Classic",
    "Timeline",
    "Sidebar",
    "Canada",
    "Europass",
    "Europe",
    "Australia",
    "USA",
    "India",
  ]) {
    await page.getByLabel("Find a template").fill(label);
    await page
      .getByRole("button", { name: `Use ${label} template`, exact: true })
      .click();
    await expect(page.locator("#print-resume-root")).toContainText(
      /Alex\s*Morgan/i,
    );
    await expect(
      page
        .locator("#print-resume-root")
        .getByText(/alex/i)
        .filter({ visible: true })
        .first(),
    ).toBeVisible();
    await expect(
      page
        .locator("#print-resume-root")
        .getByText("Jordan Lee", { exact: true })
        .filter({ visible: true })
        .first(),
    ).toBeVisible();
    expect(errors, label).toEqual([]);
  }
});

test("Minimal reorders sections and hides them across preview and exports", async ({
  page,
}) => {
  await page.goto("/resume/demo?view=preview");
  await page.getByLabel("Find a template").fill("Minimal");
  await page
    .getByRole("button", { name: "Use Minimal template", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Move Experience up", exact: true })
    .click();
  const preview = page.locator("#print-resume-root");
  await expect
    .poll(async () => {
      const text = await preview.innerText();
      return text.indexOf("Experience") < text.indexOf("Education");
    })
    .toBe(true);
  await page
    .getByRole("checkbox", { name: "References", exact: true })
    .uncheck();
  await expect(preview).not.toContainText("Jordan Lee");
  await page.getByRole("button", { name: "Export / Print" }).click();
  const pdfDownload = page.waitForEvent("download");
  await page.getByRole("menuitem", { name: /Download Standard PDF/ }).click();
  const pdf = await pdfDownload;
  await pdf.saveAs("test-results/resume.pdf");
  expect(pdf.suggestedFilename()).toMatch(/\.pdf$/);
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Export / Print" }).click();
  const wordDownload = page.waitForEvent("download");
  await page.getByRole("menuitem", { name: /Download Editable DOCX/ }).click();
  const word = await wordDownload;
  await word.saveAs("test-results/resume.docx");
  expect(word.suggestedFilename()).toMatch(/\.docx$/);
});

test("browser Back protects unsaved edits when leaving the editor", async ({
  page,
}) => {
  await page.goto("/dashboard");
  await page.getByRole("button", { name: "Edit", exact: true }).click();
  await page
    .getByRole("textbox", { name: "Full Name", exact: true })
    .fill("Unsaved name");
  await page.goBack();
  const dialog = page.getByRole("dialog", {
    name: "Keep your latest changes?",
  });
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "Keep editing" }).click();
  await expect(
    page.getByRole("textbox", { name: "Full Name", exact: true }),
  ).toHaveValue("Unsaved name");
  await page.goBack();
  await page.getByRole("button", { name: "Discard and leave" }).click();
  await expect(page).toHaveURL(/dashboard/);
});

test("AI failure leaves existing resume text intact", async ({ page }) => {
  await page.route("**/.netlify/functions/openai", (route) =>
    route.fulfill({
      status: 503,
      json: {
        error: "The writing assistant is unavailable. Please try again.",
      },
    }),
  );
  await page.goto("/resume/demo?step=personalInfo");
  const original = await page.locator("textarea[name=summary]").inputValue();
  await page.getByRole("button", { name: /Resume coach/ }).click();
  await page
    .getByRole("button", { name: "Draft a professional summary" })
    .click();
  await expect(
    page.getByText("The writing assistant is unavailable. Please try again."),
  ).toBeVisible();
  await expect(page.locator("textarea[name=summary]")).toHaveValue(original);
});

test("offline editing resumes saving when the connection returns", async ({
  page,
  context,
}) => {
  await page.goto("/resume/demo?step=personalInfo");
  await expect(
    page.getByRole("textbox", { name: "Full Name", exact: true }),
  ).toBeVisible();
  await context.setOffline(true);
  await page
    .getByRole("textbox", { name: "Full Name", exact: true })
    .fill("Offline edits");
  await expect(
    page.getByText("Offline · edits kept in this tab"),
  ).toBeVisible();
  await context.setOffline(false);
  await expect(page.getByText("All changes saved")).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("textbox", { name: "Full Name", exact: true }),
  ).toHaveValue("Offline edits");
});

test("template print preserves generated Material UI styles", async ({
  page,
}) => {
  await page.goto("/resume/demo?view=preview");
  const heading = page
    .locator("#print-resume-root")
    .getByText("Alex Morgan", { exact: true })
    .first();
  const color = await heading.evaluate(
    (element) => getComputedStyle(element).color,
  );
  await page.getByRole("button", { name: "Export / Print" }).click();
  const opened = page.waitForEvent("popup");
  await page.getByRole("menuitem", { name: /Template-faithful PDF/ }).click();
  const print = await opened;
  await expect(print).toHaveTitle("Alex Morgan");
  const printedHeading = print
    .locator("#print-root")
    .getByText("Alex Morgan", { exact: true })
    .first();
  await expect(printedHeading).toBeVisible();
  expect(
    await printedHeading.evaluate((element) => getComputedStyle(element).color),
  ).toBe(color);
  await print.close();
});

test("contact delivery failure preserves the user's message", async ({ page }) => {
  await page.goto("/contact-us");
  await page.getByRole("textbox", { name: "Your Name", exact: true }).fill("Alex Morgan");
  await page.getByRole("textbox", { name: "Your Email", exact: true }).fill("alex@example.com");
  await page.getByRole("textbox", { name: "Subject", exact: true }).fill("Resume feedback");
  await page.getByRole("textbox", { name: "Your Message", exact: true }).fill("Please help me improve my resume template.");
  await page.locator('button[type="submit"]').click();
  await expect(page.getByRole("alert")).toContainText("Contact delivery isn't enabled here");
  await expect(page.getByRole("textbox", { name: "Your Message", exact: true })).toHaveValue("Please help me improve my resume template.");
});
