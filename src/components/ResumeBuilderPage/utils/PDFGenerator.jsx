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
  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.innerHTML = `
      @media print {
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        html, body {
          font-smoothing: antialiased;
          -webkit-font-smoothing: antialiased;
          overflow: visible !important;
        }

        .resume-container {
          width: 100% !important;
          max-width: 210mm !important;
          height: auto !important;
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }

        .resume-section {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }

        .page-break {
          page-break-before: always !important;
          break-before: page !important;
        }
      }
    `;
    styleElement.id = "pdf-print-styles";
    document.head.appendChild(styleElement);

    return () => {
      const element = document.getElementById("pdf-print-styles");
      if (element) {
        document.head.removeChild(element);
      }
    };
  }, []);

  const downloadPDF = async () => {
    if (!resumeRef.current) {
      onError("Resume reference not found. Please try again.");
      return;
    }

    setLoading(true);
    console.log("Starting PDF generation...");

    const element = resumeRef.current;
    const filename = `${personalInfo.fullName || "Resume"}.pdf`;

    try {
      await html2pdf()
        .set({
          margin: [0.5, 0.5],
          filename: filename,
          html2canvas: {
            scale: 2,
            useCORS: true,
          },
          jsPDF: {
            unit: "in",
            format: "letter",
            orientation: "portrait",
          },
          pagebreak: { mode: ["avoid-all", "css", "legacy"] },
        })
        .from(element)
        .save();

      setLoading(false);
      onSuccess("Resume downloaded successfully!");
    } catch (error) {
      console.error("PDF generation failed:", error);
      setLoading(false);
      onError("Could not generate PDF. Try using Print instead.");
      setTimeout(() => {
        if (
          window.confirm(
            "PDF generation failed. Would you like to try printing instead?"
          )
        ) {
          window.print();
        }
      }, 500);
    }
  };

  return {
    downloadPDF,
    loading,
  };
};

export default PDFGenerator;
