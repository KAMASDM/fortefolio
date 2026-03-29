import { downloadResumePdf } from './resumePdfExport';

export const PDFGenerator = ({
  resumeRef,
  loading,
  setLoading,
  personalInfo,
  resumeData,
  colorScheme,
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
    try {
      await downloadResumePdf({
        resumeData,
        colorScheme,
        fileName: `${personalInfo?.fullName || 'Resume'}.pdf`,
      });
      onSuccess("PDF downloaded successfully.");
    } catch (error) {
      console.error("PDF generation failed:", error);
      onError("Could not generate PDF. Please try again.");
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
