// Update the handleGenerateReport function in results.js
const handleGenerateReport = async () => {
  try {
    setIsGeneratingPDF(true);
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    const reportData = {
      moduleScores,
      avgScore,
      assessment
    };

    const filePath = await PDFGenerationService.generatePDF(reportData);
    
    if (filePath) {
      await PDFGenerationService.sharePDF(filePath);
    }
  } catch (error) {
    console.error('Error generating report:', error);
    // Show error message to user
    Alert.alert(
      'Error',
      'Failed to generate report. Please try again.',
      [{ text: 'OK' }]
    );
  } finally {
    setIsGeneratingPDF(false);
  }
};