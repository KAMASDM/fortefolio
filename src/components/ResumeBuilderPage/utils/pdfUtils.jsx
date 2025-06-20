import html2pdf from "html2pdf.js";

/**
 * Enhanced PDF generation function for better output quality and proper rendering
 *
 * @param {HTMLElement} element - The DOM element to convert to PDF
 * @param {Object} options - Configuration options for filename, etc.
 * @returns {Promise} - Promise that resolves when PDF is generated
 */
export const generatePDF = (element, options = {}) => {
  return new Promise((resolve, reject) => {
    const filename = options.filename || "Resume.pdf";

    const clone = element.cloneNode(true);

    applyPDFOptimizationStyles(clone);

    const pdfOptions = {
      margin: [0, 0, 0, 0],
      filename: filename,
      image: { type: "jpeg", quality: 1.0 },
      html2canvas: {
        scale: 3,
        useCORS: true,
        logging: false,
        letterRendering: true,
        foreignObjectRendering: true,
      },
      jsPDF: {
        unit: "in",
        format: "letter",
        orientation: "portrait",
        compress: true,
      },
      pagebreak: { mode: ["avoid-all", "css", "legacy"] },
      ...options,
    };

    setTimeout(() => {
      html2pdf()
        .from(clone)
        .set(pdfOptions)
        .save()
        .then(() => {
          resolve();
        })
        .catch((error) => {
          console.error("PDF generation error:", error);
          reject(error);
        });
    }, 500);
  });
};

/**
 * Apply special styles to optimize elements for PDF rendering.
 * This is particularly important for preserving colors, borders, and backgrounds.
 * These styles are applied to a CLONED version of the element.
 *
 * @param {HTMLElement} element - The DOM element (clone) to style
 * @returns {HTMLElement} - The modified element
 */
export const applyPDFOptimizationStyles = (element) => {
  if (!element) return element;

  element.style.WebkitPrintColorAdjust = "exact";
  element.style.printColorAdjust = "exact";
  element.style.colorAdjust = "exact";

  processElementsForPDF(element);

  element.style.width = "8.5in";
  element.style.margin = "0";
  element.style.padding = "0.5in";
  element.style.boxSizing = "border-box";

  return element;
};

/**
 * Recursively process all elements in the DOM tree to optimize for PDF rendering.
 * This function directly manipulates the style of the elements in the CLONED tree.
 *
 * @param {HTMLElement} rootElement - The parent element (clone) to process
 */
const processElementsForPDF = (rootElement) => {
  const allElements = rootElement.querySelectorAll("*");

  allElements.forEach((el) => {
    el.style.WebkitPrintColorAdjust = "exact";
    el.style.printColorAdjust = "exact";
    el.style.colorAdjust = "exact";

    try {
      const computedStyle = window.getComputedStyle(el);

      if (
        el.classList.contains("MuiChip-root") ||
        el.classList.contains("MuiPaper-root") ||
        el.classList.contains("MuiAvatar-root") ||
        el.tagName === "BUTTON" ||
        el.classList.contains("MuiButton-root") ||
        el.classList.contains("MuiIconButton-root")
      ) {
        el.style.backgroundColor = computedStyle.backgroundColor;
        el.style.color = computedStyle.color;
        el.style.borderTopWidth = computedStyle.borderTopWidth;
        el.style.borderBottomWidth = computedStyle.borderBottomWidth;
        el.style.borderLeftWidth = computedStyle.borderLeftWidth;
        el.style.borderRightWidth = computedStyle.borderRightWidth;
        el.style.borderTopStyle = computedStyle.borderTopStyle;
        el.style.borderBottomStyle = computedStyle.borderBottomStyle;
        el.style.borderLeftStyle = computedStyle.borderLeftStyle;
        el.style.borderRightStyle = computedStyle.borderRightStyle;
        el.style.borderTopColor = computedStyle.borderTopColor;
        el.style.borderBottomColor = computedStyle.borderBottomColor;
        el.style.borderLeftColor = computedStyle.borderLeftColor;
        el.style.borderRightColor = computedStyle.borderRightColor;
        el.style.borderRadius = computedStyle.borderRadius;

        el.style.boxShadow = "none";
      }

      if (
        el.classList.contains("MuiDivider-root") ||
        computedStyle.borderBottomWidth !== "0px" ||
        computedStyle.borderTopWidth !== "0px" ||
        computedStyle.borderLeftWidth !== "0px" ||
        computedStyle.borderRightWidth !== "0px"
      ) {
        el.style.borderTopWidth = computedStyle.borderTopWidth;
        el.style.borderBottomWidth = computedStyle.borderBottomWidth;
        el.style.borderLeftWidth = computedStyle.borderLeftWidth;
        el.style.borderRightWidth = computedStyle.borderRightWidth;
        el.style.borderTopStyle = computedStyle.borderTopStyle;
        el.style.borderBottomStyle = computedStyle.borderBottomStyle;
        el.style.borderLeftStyle = computedStyle.borderLeftStyle;
        el.style.borderRightStyle = computedStyle.borderRightStyle;
        el.style.borderTopColor = computedStyle.borderTopColor;
        el.style.borderBottomColor = computedStyle.borderBottomColor;
        el.style.borderLeftColor = computedStyle.borderLeftColor;
        el.style.borderRightColor = computedStyle.borderRightColor;
      }

      if (el.tagName === "svg") {
        el.style.fill = computedStyle.fill;
        el.style.color = computedStyle.color;
        if (computedStyle.width === "auto" || computedStyle.width === "0px") {
          el.style.width = el.getBBox
            ? `${el.getBBox().width}px`
            : computedStyle.fontSize;
        }
        if (computedStyle.height === "auto" || computedStyle.height === "0px") {
          el.style.height = el.getBBox
            ? `${el.getBBox().height}px`
            : computedStyle.fontSize;
        }
      }

      if (
        computedStyle.position === "relative" ||
        computedStyle.position === "absolute"
      ) {
        // el.setAttribute("data-pdf-has-pseudo", "true");
      }
    } catch (e) {
      console.warn(
        "Error computing style for PDF processing on element:",
        el,
        e
      );
    }
  });
};

/**
 * Generate inline CSS for @media print to be injected into the document.
 * This helps ensure proper rendering when using the browser's native print function.
 * For printing the "visual preview", this CSS should support the scaled element.
 *
 * @returns {string} CSS string for print media
 */
export const generatePrintCss = () => {
  return `
    @media print {
      /* Global print adjustments to prepare the page */
      body, html {
        background-color: #ffffff !important; /* Ensure white background */
        margin: 0 !important; /* Remove browser default margins */
        padding: 0 !important;
        overflow: visible !important; /* Allow content to expand */
        width: auto !important; /* Let content dictate size */
        height: auto !important; /* Let content dictate size */
        min-height: 0 !important; /* Remove min-height */
      }

      /* Prevent blank first page */
      html, body {
        size: auto;
        page-break-before: avoid !important;
        page-break-after: avoid !important;
      }

      /* Fix for first page blank issue */
      .print-mode {
        page-break-before: avoid !important;
        page-break-after: avoid !important;
        display: block !important;
        float: none !important;
        position: static !important;
        overflow: visible !important;
      }

      /* Attempt to control printer margins and page size.
         Support varies by browser. */
      @page {
        margin: 0mm !important; /* Try to remove all printer margins */
        size: auto !important; /* Instructs browser to use page size of the content */
        padding: 0 !important;
      }

      /* General rules for all elements during print */
      * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        color-adjust: exact !important;
        box-shadow: none !important; /* Remove all shadows for print */
        transition: none !important;
      }
      
      /* Styles for the main resume container (.resume-container is on resumeRef Box) */
      .resume-container {
        /* CRUCIAL: No fixed width or scale transformation for print */
        width: 830px !important;
        transform: none !important;
        
        transform-origin: top left !important; /* Ensures scaling happens from top-left for print */
        margin: 0 auto !important; /* Center the content */
        padding: 0.5in !important; /* Keep necessary internal padding */
        border: none !important; /* No border for the container itself */
        overflow: visible !important; /* Ensure all content is visible */
        
        /* Make sure the content starts from the first page */
        page-break-before: avoid !important;
        page-break-after: auto !important;
        page-break-inside: auto !important;
      }
      
      /* Hide elements not intended for printing */
      .no-print {
        display: none !important;
      }
      
      /* Application-specific containers should be visible */
      #root, [data-pdf-container="true"] {
        display: block !important;
        overflow: visible !important;
        height: auto !important;
        transform: none !important;
        width: auto !important;
        max-width: none !important;
        position: static !important;
        margin: 0 !important;
        padding: 0 !important;
        page-break-before: avoid !important;
      }

      /* Make sure fonts render smoothly */
      body {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        font-smoothing: antialiased;
      }

      /* Ensure SVGs use current text color in print */
      .MuiSvgIcon-root {
        fill: currentColor !important;
      }
      
      /* Ensure grid layouts are preserved (often flex is better for print capture) */
      .MuiGrid-container {
        display: flex !important;
        flex-wrap: wrap !important;
      }
      
      /* Page break control classes */
      .no-break, [data-pdf-avoid-break="true"] {
        page-break-inside: avoid !important;
      }
      .break-before, [data-pdf-break-before="true"] {
        page-break-before: always !important;
      }
      .break-after, [data-pdf-break-after="true"] {
        page-break-after: always !important;
      }

      /* Style links for print */
      a, a:visited {
        text-decoration: none !important; /* Remove underlines for cleaner print */
        color: inherit !important; /* Use surrounding text color */
      }
    }
  `;
};

export const injectPrintStyles = () => {
  const styleId = "pdf-print-styles";
  const existingStyleElement = document.getElementById(styleId);
  if (existingStyleElement) {
    existingStyleElement.remove();
  }

  const styleElement = document.createElement("style");
  styleElement.innerHTML = generatePrintCss();
  styleElement.id = styleId;
  document.head.appendChild(styleElement);

  return () => {
    const element = document.getElementById(styleId);
    if (element && element.parentNode) {
      element.parentNode.removeChild(element);
    }
  };
};
