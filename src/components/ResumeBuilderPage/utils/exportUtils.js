import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Tab, TabStopType, TabStopPosition } from "docx";
import { saveAs } from "file-saver";

// Helper function to format dates
const formatDate = (dateString) => {
    if (!dateString) return "Present";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    } catch (e) {
      return dateString;
    }
};

export const exportToDocx = async (resumeData, fileName = "resume.docx") => {
  const { personalInfo, experience, education, skills, projects } = resumeData;

  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        // --- HEADER ---
        new Paragraph({
          children: [new TextRun({ text: personalInfo.fullName || "Your Name", bold: true, size: 48 })],
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
          children: [new TextRun({ text: personalInfo.jobTitle || "Professional Title", size: 28, color: "555555" })],
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
          text: `${personalInfo.email || ''} | ${personalInfo.phone || ''} | ${personalInfo.location || ''}`,
          alignment: AlignmentType.CENTER,
          style: "WellSpaced",
        }),
        new Paragraph({ text: "", spacing: { after: 200 } }), // Spacer

        // --- SUMMARY ---
        new Paragraph({
          children: [new TextRun({ text: "Professional Summary", bold: true, size: 24 })],
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 100 },
          border: { bottom: { color: "auto", space: 1, value: "single", size: 6 } },
        }),
        new Paragraph({
          children: [new TextRun({ text: personalInfo.summary || "", size: 20 })],
        }),
        new Paragraph({ text: "", spacing: { after: 300 } }),

        // --- EXPERIENCE ---
        new Paragraph({
          children: [new TextRun({ text: "Work Experience", bold: true, size: 24 })],
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 100 },
          border: { bottom: { color: "auto", space: 1, value: "single", size: 6 } },
        }),
        ...experience.flatMap(exp => [
          new Paragraph({
            children: [
              new TextRun({ text: exp.position || "Position", bold: true, size: 22 }),
              new TextRun({ text: `\t${formatDate(exp.startDate)} - ${exp.current ? 'Present' : formatDate(exp.endDate)}`, size: 20 }),
            ],
            tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }]
          }),
          new Paragraph({
            children: [new TextRun({ text: `${exp.company || "Company"}, ${exp.location || "Location"}`, italics: true, size: 20 })],
          }),
          ...(exp.responsibilities || []).map(resp => new Paragraph({ text: resp, bullet: { level: 0 }, style: "WellSpaced" })),
          new Paragraph({ text: "", spacing: { after: 200 } }),
        ]),

        // --- EDUCATION ---
        new Paragraph({
          children: [new TextRun({ text: "Education", bold: true, size: 24 })],
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 100 },
          border: { bottom: { color: "auto", space: 1, value: "single", size: 6 } },
        }),
        ...education.flatMap(edu => [
          new Paragraph({
            children: [
              new TextRun({ text: `${edu.degree || "Degree"} in ${edu.field || "Field"}`, bold: true, size: 22 }),
              new TextRun({ text: `\t${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}`, size: 20 }),
            ],
            tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }]
          }),
          new Paragraph({
            children: [new TextRun({ text: `${edu.institution || "Institution"}, ${edu.location || "Location"}`, italics: true, size: 20 })],
          }),
          new Paragraph({ text: "", spacing: { after: 200 } }),
        ]),

        // --- SKILLS ---
        new Paragraph({
          children: [new TextRun({ text: "Skills", bold: true, size: 24 })],
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 100 },
          border: { bottom: { color: "auto", space: 1, value: "single", size: 6 } },
        }),
        ...skills.map(skillCategory => new Paragraph({
          children: [
            new TextRun({ text: `${skillCategory.name}: `, bold: true, size: 20 }),
            new TextRun({ text: (skillCategory.skills || []).join(', '), size: 20 }),
          ]
        })),
         new Paragraph({ text: "", spacing: { after: 300 } }),
        
        // --- PROJECTS ---
        new Paragraph({
            children: [new TextRun({ text: "Projects", bold: true, size: 24 })],
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 100 },
            border: { bottom: { color: "auto", space: 1, value: "single", size: 6 } },
          }),
          ...projects.flatMap(proj => [
            new Paragraph({
              children: [
                new TextRun({ text: proj.title || "Project Title", bold: true, size: 22 }),
                new TextRun({ text: `\t${formatDate(proj.startDate)} - ${proj.current ? 'Present' : formatDate(proj.endDate)}`, size: 20 }),
              ],
              tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }]
            }),
            new Paragraph({
              children: [new TextRun({ text: `Technologies: ${proj.technologies || ""}`, italics: true, size: 20 })],
            }),
            new Paragraph({ text: proj.description || "", style: "WellSpaced" }),
            new Paragraph({ text: "", spacing: { after: 200 } }),
          ]),
      ],
    }],
  });

  try {
    const buffer = await Packer.toBlob(doc);
    saveAs(buffer, fileName);
    return true;
  } catch (error) {
    console.error("Error creating DOCX:", error);
    return false;
  }
};