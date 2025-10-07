import html2canvas from 'html2canvas';

/**
 * Production-ready PDF generator that preserves template design
 * Creates a high-quality print dialog with proper page handling
 */
export const generateTemplatePDF = async (element, personalInfo, templateType, options = {}) => {
  if (!element) {
    throw new Error('Element not found');
  }

  const filename = `${personalInfo?.fullName || 'Resume'}.pdf`;
  const { scale = 3 } = options; // Higher scale for better quality

  try {
    // Hide overlay elements
    const overlayElements = element.querySelectorAll(
      '.MuiSpeedDial-root, .MuiBackdrop-root, .MuiPopover-root, .MuiDrawer-root, .MuiTooltip-popper, button'
    );
    
    const hiddenElements = [];
    overlayElements.forEach(el => {
      if (el.style.display !== 'none') {
        hiddenElements.push({ element: el, originalDisplay: el.style.display });
        el.style.display = 'none';
      }
    });

    // Clean up page styling for PDF
    const pages = element.querySelectorAll('.page, [class*="page"]');
    const pageStyles = [];
    pages.forEach(page => {
      pageStyles.push({
        element: page,
        border: page.style.border,
        boxShadow: page.style.boxShadow,
        margin: page.style.margin,
        padding: page.style.padding
      });
      page.style.border = 'none';
      page.style.boxShadow = 'none';
      page.style.margin = '0';
      page.style.padding = '20px';
    });

    // Wait for layout to settle
    await new Promise(resolve => setTimeout(resolve, 400));

    // Capture with maximum quality
    const canvas = await html2canvas(element, {
      scale: scale,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      width: element.scrollWidth,
      height: element.scrollHeight,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
      imageTimeout: 0,
      onclone: (clonedDoc) => {
        const style = clonedDoc.createElement('style');
        style.textContent = `
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
          * { 
            -webkit-print-color-adjust: exact !important; 
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          button, .MuiSpeedDial-root, .MuiBackdrop-root { display: none !important; }
        `;
        clonedDoc.head.appendChild(style);
      }
    });

    // Convert to high-quality image
    const imgData = canvas.toDataURL('image/png', 1.0);
    
    // Calculate A4 dimensions (at 96 DPI)
    const A4_WIDTH = 794;
    const A4_HEIGHT = 1123;
    
    // Calculate scaled dimensions
    const imgAspectRatio = canvas.width / canvas.height;
    let displayWidth = A4_WIDTH;
    let displayHeight = A4_WIDTH / imgAspectRatio;
    
    // Create an optimized print window
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${filename.replace('.pdf', '')}</title>
          <meta charset="UTF-8">
          <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
          <style>
            @page {
              size: A4;
              margin: 0;
            }
            
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            
            html, body {
              width: 100%;
              height: 100%;
              margin: 0;
              padding: 0;
              background: white;
            }
            
            .print-container {
              width: 100%;
              background: white;
              display: flex;
              flex-direction: column;
              align-items: center;
            }
            
            .resume-image {
              width: 100%;
              max-width: 210mm;
              height: auto;
              display: block;
              page-break-inside: auto;
            }
            
            @media print {
              html, body {
                width: 210mm;
                height: 297mm;
              }
              
              .print-container {
                width: 210mm !important;
              }
              
              .resume-image {
                width: 210mm !important;
                max-width: 210mm !important;
                height: auto !important;
              }
            }
            
            @media screen {
              body {
                padding: 20px;
                background: #f5f5f5;
              }
              
              .print-container {
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
                max-width: 210mm;
                margin: 0 auto;
              }
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            <img src="${imgData}" alt="Resume" class="resume-image" />
          </div>
          <script>
            window.onload = function() {
              // Wait a bit for image to fully render
              setTimeout(function() {
                window.print();
              }, 1000);
            };
            
            // Close window after print dialog is dismissed
            window.onafterprint = function() {
              setTimeout(function() {
                window.close();
              }, 500);
            };
          </script>
        </body>
      </html>
    `);
    
    printWindow.document.close();

    // Restore original styles
    setTimeout(() => {
      pageStyles.forEach(({ element, border, boxShadow, margin, padding }) => {
        element.style.border = border;
        element.style.boxShadow = boxShadow;
        element.style.margin = margin;
        element.style.padding = padding;
      });

      hiddenElements.forEach(({ element, originalDisplay }) => {
        element.style.display = originalDisplay;
      });
    }, 2000);

    return { 
      success: true, 
      message: 'High-quality PDF print dialog opened with template design preserved! Use "Save as PDF" in print options.' 
    };

  } catch (error) {
    console.error('PDF generation error:', error);
    throw new Error(`Failed to generate PDF: ${error.message}`);
  }
};