

export const PDFGenerator = ({
  resumeRef,
  loading,
  setLoading,
  personalInfo,
  resumeData,
  colorScheme,
  presentation,
  onSuccess,
  onError,
}) => {
  const downloadPDF = async () => {
    if (!resumeRef.current) {
      onError("Resume reference not found. Please try again.");
      return;
    }

    setLoading(true);
    try {
      const { downloadResumePdf } = await import("./resumePdfExport");
      await downloadResumePdf({
        resumeData,
        colorScheme,
        presentation,
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
