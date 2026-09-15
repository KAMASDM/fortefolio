import { escapeHtml } from "./printText";
const RENDER_WIDTH_PX = 794;

const PRINT_HIDE_SELECTORS = [
  ".MuiSpeedDial-root",
  ".MuiBackdrop-root",
  ".MuiPopover-root",
  ".MuiTooltip-popper",
  "button",
  "[role=tooltip]",
].join(", ");

export const openTemplatePrintPreview = async (element, personalInfo) => {
  if (!element) {
    throw new Error("Element not found");
  }

  const filename = `${personalInfo?.fullName || "Resume"}`;
  const styles = Array.from(
    document.querySelectorAll("style, link[rel='stylesheet']"),
  )
    .map((node) => {
      // Emotion inserts rules through CSSOM; style.outerHTML can be empty.
      if (node.tagName === "STYLE") {
        try {
          return `<style>${Array.from(node.sheet?.cssRules || [])
            .map((rule) => rule.cssText)
            .join("\n")}</style>`;
        } catch {
          return node.outerHTML;
        }
      }
      return node.outerHTML;
    })
    .join("\n");

  const clone = element.cloneNode(true);
  const sourceNodes = Array.from(element.querySelectorAll("*"));
  const clonedNodes = Array.from(clone.querySelectorAll("*"));
  sourceNodes.forEach((node, index) => {
    const style = window.getComputedStyle(node);
    if (style.visibility === "hidden" || style.display === "none")
      clonedNodes[index]?.remove();
  });
  clone.querySelectorAll(PRINT_HIDE_SELECTORS).forEach((node) => node.remove());
  clone.style.display = "block";
  clone.style.visibility = "visible";
  clone.style.width = `${RENDER_WIDTH_PX}px`;
  clone.style.minWidth = `${RENDER_WIDTH_PX}px`;
  clone.style.maxWidth = `${RENDER_WIDTH_PX}px`;
  clone.style.margin = "0 auto";
  clone.style.transform = "none";
  clone.style.zoom = "1";
  clone
    .querySelectorAll("[contenteditable]")
    .forEach((node) => node.removeAttribute("contenteditable"));

  const printWindow = window.open("", "_blank", "width=1200,height=800");
  if (!printWindow) {
    throw new Error("Pop-up blocked. Please allow pop-ups for this site.");
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${escapeHtml(filename)}</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        ${styles}
        <style>
          * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          html, body {
            margin: 0;
            padding: 0;
            background: white;
          }

          @page {
            size: A4;
            margin: 0;
          }

          #print-root {
            width: 210mm;
            margin: 0 auto;
          }

          #print-root .page-container {
            transform: none !important;
            transform-origin: top left !important;
            width: ${RENDER_WIDTH_PX}px !important;
            min-width: ${RENDER_WIDTH_PX}px !important;
          }

          #print-root .MuiPaper-root {
            box-shadow: none !important;
          }
        </style>
      </head>
      <body>
        <div id="print-root">${clone.outerHTML}</div>
        <script>
          window.onload = function () {
            setTimeout(function () {
              window.focus();
              window.print();
            }, 1000);
          };
        </script>
      </body>
    </html>
  `);

  printWindow.document.close();

  return {
    success: true,
    message: "Print dialog opened.",
  };
};
