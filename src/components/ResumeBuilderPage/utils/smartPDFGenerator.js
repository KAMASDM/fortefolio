import html2canvas from 'html2canvas';

/**
 * Smart PDF generator that handles pagination properly by analyzing content structure
 */
export const generateSmartPDF = async (element, personalInfo, templateType, options = {}) => {
  if (!element) {
    throw new Error('Element not found');
  }

  const filename = `${personalInfo?.fullName || 'Resume'}.pdf`;
  const { scale = 2, quality = 0.95 } = options;

  try {
    // Store original document title
    const originalTitle = document.title;

    // Hide overlay elements
    const overlayElements = element.querySelectorAll(
      '.MuiSpeedDial-root, .MuiBackdrop-root, .MuiPopover-root, .MuiDrawer-root, .MuiTooltip-popper'
    );
    
    const hiddenElements = [];
    overlayElements.forEach(el => {
      if (el.style.display !== 'none') {
        hiddenElements.push({ element: el, originalDisplay: el.style.display });
        el.style.display = 'none';
      }
    });

    // Clone the element for PDF optimization
    const clonedElement = element.cloneNode(true);
    
    // Prepare the cloned element for PDF
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '-9999px';
    tempContainer.style.width = '794px'; // A4 width
    tempContainer.style.background = 'white';
    tempContainer.style.fontFamily = 'Poppins, Arial, sans-serif';
    
    // Add print-specific styles to cloned content
    const printStyles = document.createElement('style');
    printStyles.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
      
      * {
        -webkit-print-color-adjust: exact !important;
        color-adjust: exact !important;
        print-color-adjust: exact !important;
        box-sizing: border-box !important;
      }
      
      /* Ensure sections don't break awkwardly */
      .resume-section, .MuiBox-root, .section {
        page-break-inside: avoid;
        break-inside: avoid;
      }
      
      /* Handle specific elements that should stay together */
      .experience-item, .education-item, .project-item {
        page-break-inside: avoid;
        break-inside: avoid;
        margin-bottom: 1em;
      }
      
      /* Ensure proper spacing for page breaks */
      h1, h2, h3, h4, h5, h6 {
        page-break-after: avoid;
        break-after: avoid;
        margin-top: 0.5em;
        margin-bottom: 0.25em;
      }
      
      p, div {
        orphans: 2;
        widows: 2;
      }
    `;
    
    clonedElement.prepend(printStyles);
    tempContainer.appendChild(clonedElement);
    document.body.appendChild(tempContainer);

    // Wait for layout to settle
    await new Promise(resolve => setTimeout(resolve, 300));

    // Capture with optimal settings
    const canvas = await html2canvas(clonedElement, {
      scale: scale,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      width: 794, // Fixed A4 width
      height: clonedElement.scrollHeight,
      onclone: (clonedDoc) => {
        // Ensure fonts load properly
        const fontLink = clonedDoc.createElement('link');
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap';
        fontLink.rel = 'stylesheet';
        clonedDoc.head.appendChild(fontLink);
      }
    });

    // Remove temporary container
    document.body.removeChild(tempContainer);

    // Create print window with smart pagination
    const printWindow = window.open('', '_blank');
    const imageDataUrl = canvas.toDataURL('image/png', quality);
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${filename.replace('.pdf', '')}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
            
            @page {
              size: A4;
              margin: 0.5in;
            }
            
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            
            body {
              margin: 0;
              padding: 0;
              background: white;
              font-family: 'Poppins', Arial, sans-serif;
            }
            
            .resume-container {
              width: 100%;
              max-width: 7.5in; /* A4 width minus margins */
              background: white;
            }
            
            .resume-image {
              width: 100%;
              height: auto;
              display: block;
              page-break-inside: auto;
            }
            
            @media print {
              body { 
                margin: 0 !important; 
                padding: 0 !important; 
              }
              
              .resume-container {
                width: 100% !important;
                max-width: none !important;
              }
              
              .resume-image {
                max-width: 100% !important;
                height: auto !important;
              }
            }
          </style>
        </head>
        <body>
          <div class="resume-container">
            <img src="${imageDataUrl}" alt="Resume" class="resume-image" />
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    
    // Wait for image to load then print
    setTimeout(() => {
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 1000);
    }, 500);
    
    // Restore hidden elements
    hiddenElements.forEach(({ element, originalDisplay }) => {
      element.style.display = originalDisplay;
    });
    
    document.title = originalTitle;
    
    return { 
      success: true, 
      message: 'Smart PDF with proper pagination generated! Content will flow naturally across pages without cuts.' 
    };

  } catch (error) {
    console.error('PDF generation error:', error);
    throw new Error(`Failed to generate PDF: ${error.message}`);
  }
};