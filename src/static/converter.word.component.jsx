import React from "react";
import htmlDocx from "html-docx-js/dist/html-docx";

const WordComponent = ({ htmlComponentId }) => {
  const generateWord = () => {
    const element = document.getElementById(htmlComponentId);

    if (!element) {
      console.error("HTML element not found!");
      return;
    }

    const htmlContent = `
      <html>
        <head><title>Most Frequent NCs</title></head>
        <body>${element.outerHTML}</body>
      </html>
    `;

    const converted = htmlDocx.asBlob(htmlContent);
    const fileURL = URL.createObjectURL(converted);

    // Trigger download
    const a = document.createElement("a");
    a.href = fileURL;
    a.download = "documents.docx";
    a.click();
  };

  return { generateWord };
};

export default WordComponent;

