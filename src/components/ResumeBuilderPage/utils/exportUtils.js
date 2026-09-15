import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  ExternalHyperlink,
} from "docx";
import { saveAs } from "file-saver";
import {
  documentData,
  getDocumentSections,
} from "../../../services/resumeDocument";

export const createDocxDocument = (resumeData, presentation = {}) => {
  const info = documentData(resumeData, presentation).personalInfo;
  const paragraph = (text) =>
    new Paragraph({
      children: [new TextRun(String(text || ""))],
      spacing: { after: 100 },
    });
  const children = [
    new Paragraph({
      text: info.fullName || "Resume",
      heading: HeadingLevel.TITLE,
    }),
  ];
  if (info.jobTitle) children.push(paragraph(info.jobTitle));
  children.push(
    paragraph(
      [info.email, info.phone, info.location].filter(Boolean).join(" · "),
    ),
  );
  for (const url of [info.linkedin, info.github, info.website].filter(Boolean))
    children.push(
      new Paragraph({
        children: [
          new ExternalHyperlink({
            link: url,
            children: [new TextRun({ text: url, style: "Hyperlink" })],
          }),
        ],
      }),
    );
  if (info.summary)
    children.push(
      new Paragraph({ text: "Profile", heading: HeadingLevel.HEADING_1 }),
      paragraph(info.summary),
    );
  for (const section of getDocumentSections(resumeData, presentation)) {
    children.push(
      new Paragraph({
        text: section.title,
        heading: HeadingLevel.HEADING_1,
        keepNext: true,
      }),
    );
    for (const item of section.items) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: item.title || "", bold: true }),
            new TextRun({
              text: item.meta ? `  |  ${item.meta}` : "",
              color: "555555",
            }),
          ],
          keepNext: true,
        }),
      );
      if (item.subtitle) children.push(paragraph(item.subtitle));
      for (const line of item.lines)
        children.push(
          section.key === "experience"
            ? new Paragraph({
                text: line,
                bullet: { level: 0 },
                spacing: { after: 80 },
              })
            : paragraph(line),
        );
      if (item.link)
        children.push(
          new Paragraph({
            children: [
              new ExternalHyperlink({
                link: item.link,
                children: [
                  new TextRun({ text: item.link, style: "Hyperlink" }),
                ],
              }),
            ],
          }),
        );
    }
  }
  return new Document({
    creator: "ForteFolio",
    title: info.fullName || "Resume",
    styles: { default: { document: { run: { font: "Calibri", size: 22 } } } },
    sections: [{ children }],
  });
};
export const exportToDocx = async (
  resumeData,
  fileName = "resume.docx",
  presentation = {},
) => {
  try {
    saveAs(
      await Packer.toBlob(createDocxDocument(resumeData, presentation)),
      fileName,
    );
    return true;
  } catch (error) {
    console.error("DOCX export failed", error);
    return false;
  }
};
