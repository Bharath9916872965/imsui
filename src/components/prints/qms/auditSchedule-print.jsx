import pdfMake from 'pdfmake/build/pdfmake';
import React from 'react';

const AuditSchedulePrint = async (data,iqaNo) => {

  try {
    const getFormattedDate = () => {
      const date = new Date();
      const weekday = date.toLocaleString('en-IN', { weekday: 'short' });
      const month = date.toLocaleString('en-IN', { month: 'short' });
      const day = date.getDate();
      const hour = date.getHours().toString().padStart(2, '0');
      const minute = date.getMinutes().toString().padStart(2, '0');
      const second = date.getSeconds().toString().padStart(2, '0');
      const timeZone = 'IST';

      return `${weekday} ${month} ${day} ${hour}:${minute}:${second} ${timeZone}`;
    };

    // Table body with headers
    let tableBody = [
      [
        { text: 'SN', bold: true, alignment: 'center', style: 'superheader' },
        { text: 'Date :Time (Hrs)', bold: true, alignment: 'center', style: 'superheader' },
        { text: 'Division/Group', bold: true, alignment: 'center', style: 'superheader' },
        { text: 'Project', bold: true, alignment: 'center', style: 'superheader' },
        { text: 'Auditee', bold: true, alignment: 'center', style: 'superheader' },
        { text: 'Team', bold: true, alignment: 'center', style: 'superheader' },
       ],
    ];

    // Add rows to the table body based on data
    function parseDate(dateString) {
      if (!dateString) return null; // Handle null or undefined dates
      const [datePart, timePart] = dateString.split(' ');
      const [day, month, year] = datePart.split('-');
      return new Date(`${year}-${month}-${day}T${timePart}`);
    }
    
    data.forEach((item, index) => {
      let formattedDate = '-';
      if (item.date) {
        const parsedDate = parseDate(item.date);
        if (!isNaN(parsedDate)) {
          formattedDate = new Intl.DateTimeFormat('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }).format(parsedDate);
        }
      }
    
      tableBody.push([
        { text: index + 1, style: 'normal', alignment: 'center' },
        { text: formattedDate, style: 'normal', alignment: 'center' },
        { text: item.divisionCode || '-', style: 'normal', alignment: 'left' },
        { text: item.project || '-', style: 'normal', alignment: 'left' },
        { text: item.auditee || '-', style: 'normal', alignment: 'left' },
        { text: item.team || '-', style: 'normal', alignment: 'center' },
      ]);
    });
    
    

    // Define the PDF content
    let MyContent = [
      {
        style: 'tableExample',
        table: {
          widths: [40, 120, 140, 170, 160, 80],
          body: tableBody,
        },
        margin: [10, 10, 0, 10],
      },
    ];

    // Define the document structure and styles
    const docDefinition = {
      info: {
        title: 'Audit Schedule Print',
      },
      pageSize: 'A4',
      pageOrientation: 'landscape',
      pageMargins: [40, 80, 40, 60],
      header: () => [
        {
          style: 'headertable',
          table: {
            widths: ['100%'],
            body: [
              [
                {
                  stack: [
                    { 
                      text: `${iqaNo}${'\u00A0'.repeat(2)}:${'\u00A0'.repeat(2)}AUDIT SCHEDULE`, 
                      style: 'superheader', 
                      fontSize: 15, 
                      alignment: 'center' 
                    },
                  ],
                  
                },
              ],
            ],
          },
          layout: 'noBorders',
          margin: [40, 20, 20, 10],
        },
      ],
      content: MyContent,
      footer: (currentPage, pageCount) => {
        const currentDate = getFormattedDate();

        return [
          {
            columns: [
              { text: 'Printed By VEDTS-IMS', alignment: 'left', fontSize: 10 },
              {
                text: `Printed On: ${currentDate}   ${"\u00A0".repeat(12)} Page: ${currentPage} of ${pageCount}`,
                alignment: 'right',
                fontSize: 10,
                margin: [0, 0, 40, 0],
              },
            ],
            margin: [40, 0, 40, 200],
          },
        ];
      },
      styles: {
        headertable: {
          margin: [30, 20, 0, 30],
        },
        tableExample: {
          margin: [60, 2, 0, 5],
        },
        superheader: {
          fontSize: 12,
          bold: true,
        },
        normal: {
          fontSize: 12,
        },
        footer: {
          fontSize: 10,
          bold: true,
          border: [0, 0, 0, 0],
        },
      },
    };

    // Create and open the PDF document
    pdfMake.createPdf(docDefinition).open();
  } catch (error) {
    console.error('Error generating PDF: ', error);
  }
};

export default AuditSchedulePrint;
