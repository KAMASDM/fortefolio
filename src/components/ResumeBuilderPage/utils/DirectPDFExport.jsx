// utils/DirectPDFExport.js
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export const generateResumePDF = async (resumeElement, filename) => {
  if (!resumeElement) {
    throw new Error("Resume element not found");
  }

  console.log("Starting direct PDF export process...");

  const clone = resumeElement.cloneNode(true);
  document.body.appendChild(clone);

  Object.assign(clone.style, {
    position: "absolute",
    top: "0",
    left: "-9999px",
    width: "210mm", // A4 width
    height: "auto",
    backgroundColor: "#ffffff",
    margin: "0",
    padding: "0",
    transform: "none",
    boxSizing: "border-box",
    overflow: "visible",
  });

  applyExplicitStyles(clone);

  try {
    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      logging: true,
      backgroundColor: "#ffffff",
      allowTaint: true,
      removeContainer: false,
    });

    console.log(
      "Canvas created successfully:",
      canvas.width,
      "x",
      canvas.height
    );

    const imgData = canvas.toDataURL("image/jpeg", 1.0);
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const aspectRatio = canvas.width / canvas.height;
    const imgWidth = pdfWidth;
    const imgHeight = imgWidth / aspectRatio;

    if (imgHeight > pdfHeight) {
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }
    } else {
      pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);
    }

    pdf.save(filename);
    console.log("PDF saved successfully");

    document.body.removeChild(clone);

    return true;
  } catch (error) {
    console.error("Error generating PDF:", error);

    if (document.body.contains(clone)) {
      document.body.removeChild(clone);
    }

    throw error;
  }
};

const applyExplicitStyles = (element) => {
  const allElements = element.querySelectorAll("*");
  allElements.forEach((el) => {
    if (!el.style) return;

    el.style.WebkitPrintColorAdjust = "exact";
    el.style.printColorAdjust = "exact";

    try {
      const computedStyle = window.getComputedStyle(el);

      if (
        computedStyle.backgroundColor &&
        computedStyle.backgroundColor !== "rgba(0, 0, 0, 0)" &&
        computedStyle.backgroundColor !== "transparent"
      ) {
        el.style.backgroundColor = computedStyle.backgroundColor;
      }

      if (computedStyle.color) {
        el.style.color = computedStyle.color;
      }

      if (computedStyle.borderWidth !== "0px") {
        el.style.borderColor = computedStyle.borderColor;
        el.style.borderWidth = computedStyle.borderWidth;
        el.style.borderStyle = computedStyle.borderStyle;
      }

      if (el.tagName === "svg") {
        el.style.color = computedStyle.color;

        const paths = el.querySelectorAll("path");
        paths.forEach((path) => {
          if (
            !path.getAttribute("fill") ||
            path.getAttribute("fill") === "currentColor"
          ) {
            path.setAttribute("fill", computedStyle.color);
          }
        });
      }

      el.style.transition = "none";
      el.style.animation = "none";

      if (
        el.classList.contains("MuiPaper-root") ||
        el.classList.contains("MuiChip-root") ||
        el.classList.contains("MuiAvatar-root")
      ) {
        el.style.boxShadow = "none";
      }
    } catch (e) {
      console.warn("Style computation error for element:", e);
    }
  });

  return element;
};

export const generateSimplePDF = async (resumeElement, filename) => {
  if (!resumeElement) {
    throw new Error("Resume element not found");
  }

  try {
    console.log("Using simplified PDF generation...");

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    doc.setFontSize(16);
    doc.text("Your Resume", 105, 20, { align: "center" });

    doc.setFontSize(12);
    doc.text(
      "For better results, please use the Print option instead",
      105,
      30,
      { align: "center" }
    );

    doc.save(filename);

    return true;
  } catch (error) {
    console.error("Error generating simplified PDF:", error);
    throw error;
  }
};
