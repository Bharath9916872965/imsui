import React from "react";
import pdfMake from "pdfmake/build/pdfmake";
import htmlToPdfmake from "html-to-pdfmake";

const PdfComponent = ({ htmlComponentId }) => {
  const generatePDF = () => {
    const element = document.getElementById(htmlComponentId);

    if (!element) {
      console.error("HTML element not found!");
      return;
    }

    // Extract HTML content
    const content = element.outerHTML;

    // Convert HTML to pdfMake format
    const pdfContent = htmlToPdfmake(content);

    

    // Define common styles for headers, tables, etc.
    const docDefinition = {
        content: pdfContent,
        styles: {
          header: {
            fontSize: 18,
            bold: true,
            alignment: "center",
            margin: [0, 0, 0, 10], // top, left, bottom, right
          },
          tableHeader: {
            bold: true,
            background: "#f0f0f0",
            alignment: "center",
            fontSize: 12,
            padding: 5,
          },
          tableContent: {
            fontSize: 10,
            padding: 5,
          },
          // Add more common styles here for other elements
        },

      };
   
    // Generate PDF
    pdfMake.createPdf(docDefinition).open();
  };

  return { generatePDF };
};

export default PdfComponent;
