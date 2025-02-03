import pdfMake from 'pdfmake/build/pdfmake';
import dayjs from 'dayjs';
import { getDrdoLogo, getLabDetails, getLogoImage } from 'services/qms.service';
import { format } from "date-fns";
const CarReportPrint = async (data, iqaNo, projDivgrp, schFromDate, schToDate,carId,auditeeName,headName,initEmpData,recEmpData,approvedEmpData) => {
  try {
     // Fetch necessary data asynchronously
    const labDetails = await getLabDetails();
    const logoImg = await getLogoImage();
    const drdoLogo = await getDrdoLogo();
  
    // Function to format date to DD-MM-YY
    function formatDateToDDMMYY(date) {
      if (!date) return '-';
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = String(d.getFullYear()).slice(-2);
      return `${day}-${month}-${year}`;
    }

    const formattedschFromDate = dayjs(schFromDate).format('DD-MMM YYYY');
    const formattedschToDate = dayjs(schToDate).format('DD-MMM YYYY');

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
const filCarList = data ? data.filter(item => carId === item.correctiveActionId) : [];
// Define first table with dynamic content
    const firstTable = {
      style: 'tableExample',
      table: {
        widths: [100, 130, 120, 140],
        body: [
          [
            { text: '1. CAR Ref No', style: 'superheader' },
            { text: filCarList[0]?.carRefNo || '-', style: 'normal' },
            { text: '2. CAR SL No', style: 'superheader' },
            { text: filCarList[0]?.carSLNo || '-', style: 'normal' }
          ],
          [
            { text: '3. CAR Date ', style: 'superheader' },
            { 
              text: filCarList[0]?.carDate ? format(new Date(filCarList[0]?.carDate), 'dd-MM-yyyy') : '-', 
              style: 'normal' 
            },
            
            { text: '4. Group/Division ', style: 'superheader' },
            { text: auditeeName || '-', style: 'normal' }
          ],
          [
            { text: '5. Project Name', style: 'superheader' },
            { text: filCarList[0]?.groupDivision || '-', style: 'normal' },
            { text: '6. Projector Director Name', style: 'superheader' },
            { text: headName || '-', style: 'normal' }
          ],
          [
            { text: 'Description', style: 'superheader' },
            { text: filCarList[0]?.carDescription || '-', style: 'normal', colSpan: 3 },
            {}, {}
          ],
          [
            { text: 'Assign Primary Executive By PD', style: 'superheader', colSpan: 2 },
            {},
            { text: filCarList[0]?.executiveName || '-', style: 'normal', colSpan: 2 },
            {}
          ]
        ]
      },
      margin: [0, 20, 0, 15],
    };
    
    const secondTable = {
        style: 'tableExample',
        table: {
          widths: [165, 165, 165],
          body: [
            [  {  stack: [
                { text: initEmpData.length > 0 ? `${initEmpData[0]}\n` : '',  style: 'normal',  },
                { text: initEmpData.length > 0 ? format(initEmpData[1], 'MMM dd, yyyy hh:mm a') : '', style: 'datefontsize', color: 'blue',margin: [0, 5, 0, 0], }, '\n', // Add spacing between elements
              ].filter(Boolean) 
            },
            {  stack: [
              { text: recEmpData.length > 0 ? `${recEmpData[0]}\n` : '',  style: 'normal',  },
              { text: recEmpData.length > 0 ? format(recEmpData[1], 'MMM dd, yyyy hh:mm a') : '', style: 'datefontsize', color: 'blue',margin: [0, 5, 0, 0], }, '\n', // Add spacing between elements
            ].filter(Boolean) 
          },
          {  stack: [
            { text: approvedEmpData.length > 0 ? `${approvedEmpData[0]}\n` : '',  style: 'normal',  },
            { text: approvedEmpData.length > 0 ? format(approvedEmpData[1], 'MMM dd, yyyy hh:mm a') : '', style: 'datefontsize', color: 'blue',margin: [0, 5, 0, 0], }, '\n', // Add spacing between elements
          ].filter(Boolean) 
        },
                         ],

              [   
                { text: 'Signature of Primary Executive', style: 'superheader' },
                { text: 'Signature of Project Director ', style: 'superheader' }, 
                { text: 'Signature of MR ', style: 'superheader' },
              ],
           ]
        },
        margin: [0, 20, 0, 15], // Reduced vertical margin for closer spacing
      };
      const thirdTable = {
        style: 'tableExample',
        table: {
          widths: [250, 250],
          body: [
            [    { text: 'Evidence/Attachment  ', style: 'superheader' }, 
                  { },
              
              ],
              [    { text: '7. Target date for completion of correction and corrective action ', style: 'superheader' }, 
                     {text: filCarList[0]?.textcorrectiveActionTaken || '-', style: 'normal'},
              
              ],
              [    { 
                stack: [
                  { text: ' Date', style: 'superheader' },
                 { text: filCarList[0]?.targetDate ? format(new Date(filCarList[0]?.targetDate), 'dd-MM-yyyy') : '-',} 
                 
                ],

              }, 
                    {
                    stack: [
                      { text: ' Project Director/Primary Executive:', style: 'superheader' },
                      {text: filCarList[0]?.executiveName || '-', style: 'normal' },
                     
                    ],
                  },
              
              ], 
              [   
                {
                    stack: [
                      { text: '8. Root Cause:  ', style: 'superheader' },
                      {text: filCarList[0]?.rootCause || '-', style: 'normal' },
                     
                    ],colSpan: 2 
                  },
              
              ],
             [  {
                stack: [
                  { text: '9. Proposed Corrective Actions by Primary Executive', style: 'superheader' },
                  {text: filCarList[0]?.correctiveActionTaken || '-', style: 'normal' },
                 
                ],colSpan: 2 
              }
              ],
              [  {
                stack: [
                  { text: '10. Corrective Action Taken: ', style: 'superheader' },
                  {text: filCarList[0]?.actionPlan || '-', style: 'normal' },
                 
                ],colSpan: 2 
              }
              ],
              [  {
                stack: [
                  { text: '11. Verification of Corrective Action ', style: 'superheader' },
                  {text: recEmpData.length > 0 ? `${recEmpData[2]}\n` : '',  style: 'normal',  },
                 
                ],colSpan: 2 
              }
              ],
              [  {
                stack: [
                  { text: '12. CAR for Closure ', style: 'superheader' },
                  {text: approvedEmpData.length > 0 ? `${approvedEmpData[2]}\n` : '',  style: 'normal',  },
                 
                ],colSpan: 2 
              }
              ],
           ]
        },
        margin: [0, 20, 0, 15], // Reduced vertical margin for closer spacing
      };

      
      const MyContent = [];
      MyContent.push(firstTable);
      MyContent.push(secondTable);
      MyContent.push(thirdTable);
     
    // Define document structure and styles
    const docDefinition = {
        info: {
          title: `Master List of CAR Print`,
        },
        pageSize: 'A4',
        pageOrientation: 'portrait',
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
                        text: ``,
                        style: 'superheader',
                        fontSize: 14,
                        alignment: 'center',
                        margin: [0, 0, 0, 6],
                      },
                      {
                          text: `CAR Report - ${iqaNo}  -${projDivgrp} - ${formattedschFromDate} - ${formattedschToDate}`,
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
                  margin: [0, 0, 5, 0],
                },
              ],
              margin: [40, 0, 5, 100],
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
          datefontsize: {
            fontSize: 10,
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

export default CarReportPrint;
