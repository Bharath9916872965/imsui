import pdfMake from 'pdfmake/build/pdfmake';
import React from 'react';
import dayjs from 'dayjs';
import { getDrdoLogo, getLabDetails, getLogoImage } from 'services/qms.service';
const OFIPrint = async (data,iqaNo,iqaFromDate,iqaToDate) => {

  try {

    const labDetails = await getLabDetails();
    const logoImg = await getLogoImage();
    const drdoLogo = await getDrdoLogo();



    const formattedFromDate = dayjs(iqaFromDate).format('DD-MMM YYYY'); // Converts to 17-Mar 2024
    const formattedToDate = dayjs(iqaToDate).format('DD-MMM YYYY'); 
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
        { text: 'NC No', bold: true, alignment: 'center', style: 'superheader' },
        { text: 'Clause No', bold: true, alignment: 'center', style: 'superheader' },
        { text: 'Description', bold: true, alignment: 'center', style: 'superheader' },
        { text: 'Auditor Remarks', bold: true, alignment: 'center', style: 'superheader' },
       
       ],
    ];

    
    
    data.forEach((item, index) => {
        if (item && Object.keys(item).length > 0) {
          tableBody.push([
            { text: index + 1, style: 'normal', alignment: 'center' },
            { text: item.carRefNo || '-', style: 'normal', alignment: 'center' },
            { text: item.clauseNo || '-', style: 'normal', alignment: 'left' },
            { text: item.description || '-', style: 'normal', alignment: 'left' },
            { text: item.auditorRemarks || '-', style: 'normal', alignment: 'left' },
          ]);
        }
      });
    
    
    

    // Define the PDF content
    let MyContent = [
      {
        style: 'tableExample',
        table: {
          widths: [20, 120, 100, 250, 150],
          body: tableBody,
        },
        margin: [10, 10, 0, 10],
      },
    ];

    // Define the document structure and styles
    const docDefinition = {
      info: {
        title: `OFI Print`,
      },
      pageSize: 'A4',
      pageOrientation: 'landscape',
      pageMargins: [40, 120, 40, 25],
 header: (currentPage) => {
        return {
          stack: [
            {
              columns: [
                {
                  image:
                    logoImg
                      ? `data:image/png;base64,${logoImg}`
                      : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAA1BMVEX///+nxBvIAAAASElEQVR4nO3BgQAAAADDoPlTX+AIVQEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwDcaiAAFXD1ujAAAAAElFTkSuQmCC',
                  width: 30,
                  height: 30,
                  alignment: 'left',
                  margin: [35, 15, 0, 10],
                },
                {
                  stack: [
                    {
                      text: `Electronics and Radar Development Establishment, CV Raman Nagar, Bangalore-560093`,
                      style: 'superheader',
                      fontSize: 14,
                      alignment: 'center',
                      margin: [0, 0, 0, 4],
                    },
                    {
                      text: `Audit Summary`,
                      style: 'superheader',
                      fontSize: 14,
                      alignment: 'center',
                      margin: [0, 0, 0, 6],
                    },
                    {
                      text: `${iqaNo}${'\u00A0'.repeat(2)}:${'\u00A0'.repeat(2)}OFI - Opportunity for Improvement  (${formattedFromDate} - ${formattedToDate})`,
                      style: 'superheader',
                      fontSize: 14,
                      alignment: 'center',
                    },
                  ],
                  margin: [0, 20, 20, 10],
                },
                {
                  image:
                    drdoLogo
                      ? `data:image/png;base64,${drdoLogo}`
                      : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAA1BMVEX///+nxBvIAAAASElEQVR4nO3BgQAAAADDoPlTX+AIVQEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwDcaiAAFXD1ujAAAAAElFTkSuQmCC',
                  width: 30,
                  height: 30,
                  alignment: 'right',
                  margin: [0, 15, 20, 10],
                },
              ],
            },
          ],
        };
      },
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
            margin: [40, 0, 40, 100],
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

export default OFIPrint;
