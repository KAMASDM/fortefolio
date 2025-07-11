import { useEffect } from "react";
import html2pdf from "html2pdf.js";

export const PDFGenerator = ({
  resumeRef,
  loading,
  setLoading,
  personalInfo,
  onSuccess,
  onError,
}) => {
  const downloadPDF = async () => {
    if (!resumeRef.current) {
      onError("Resume reference not found. Please try again.");
      return;
    }

    setLoading(true);
    const element = resumeRef.current;
    const filename = `${personalInfo.fullName || "Resume"}.pdf`;

    const borderedPages = element.querySelectorAll(".page.with-border");
    const pageContainer = element.querySelector(".page-container");

    const prevScale = pageContainer.style.transform;

    try {
      borderedPages.forEach((page) => {
        page.style.border = "none";
        page.style.boxShadow = "none";
        page.style.minWidth = "794px";
        page.style.minHeight = "1122px";
      });
      if (pageContainer) {
        pageContainer.style.gap = "0px";
        pageContainer.style.minWidth = "794px !important";
        pageContainer.style.transform = "scale(1)";
      }

      await new Promise((resolve) => setTimeout(resolve, 100));

      await html2pdf()
        .set({
          margin: [0, 0],
          filename,
          html2canvas: {
            scale: 2,
            useCORS: true,
          },
          jsPDF: {
            unit: "mm",
            format: "a4",
            orientation: "portrait",
          },
        })
        .from(element)
        .save();

      onSuccess("Resume downloaded successfully!");
    } catch (error) {
      console.error("PDF generation failed:", error);
      onError("Could not generate PDF. Try using Print instead.");
      setTimeout(() => {
        if (window.confirm("PDF failed. Try printing instead?")) {
          window.print();
        }
      }, 500);
    } finally {
      setTimeout(() => {
        borderedPages.forEach((page) => {
          page.style.border = "";
          page.style.boxShadow = "";
        });
        if (pageContainer) {
          pageContainer.style.gap = "";
          pageContainer.style.minWidth = "100%";
          pageContainer.style.transform = prevScale;
        }
        setLoading(false);
      }, 200);
    }
  };

  return {
    downloadPDF,
    loading,
  };
};

export default PDFGenerator;
