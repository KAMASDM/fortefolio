import { useEffect } from "react";
import { generateTemplatePDF } from './advancedPDFGenerator';

export const PDFGenerator = ({
  resumeRef,
  loading,
  setLoading,
  personalInfo,
  onSuccess,
  onError,
  templateType = 'MODERN'
}) => {
  const downloadPDF = async () => {
    if (!resumeRef.current) {
      onError("Resume reference not found. Please try again.");
      return;
    }

    setLoading(true);
    const element = resumeRef.current;

    try {
      // Use advanced PDF generator that preserves template design
      const result = await generateTemplatePDF(
        element, 
        personalInfo, 
        templateType,
        {
          scale: 3, // High quality
          quality: 0.98 // Near perfect quality
        }
      );
      
      if (result.success) {
        onSuccess(result.message);
      }
      
    } catch (error) {
      console.error("PDF generation failed:", error);
      onError("Could not generate PDF with template design. Please try again.");
      
      // Fallback to print dialog
      setTimeout(() => {
        if (window.confirm("PDF generation failed. Would you like to try printing instead?")) {
          window.print();
        }
      }, 500);
    } finally {
      setLoading(false);
    }
  };

  return {
    downloadPDF,
    loading,
  };
};

export default PDFGenerator;
