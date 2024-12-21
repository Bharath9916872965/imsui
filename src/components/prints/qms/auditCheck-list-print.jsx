import pdfMake from 'pdfmake/build/pdfmake';
import React, { useEffect, useState } from 'react';
import { getDrdoLogo, getLabDetails, getLogoImage } from 'services/qms.service';

const AuditCheckListPdf = async (iqaNo) => {
  

  


  
  try {
    // Fetch logo details
    const [labDetails, logoimage, drdoLogo] = await Promise.all([
      getLabDetails(),
      getLogoImage(),
      getDrdoLogo(),
    ]);

    // Fallback for missing logo images
    const logoImageSrc =
      !logoimage || logoimage === 'null'
        ? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAA1BMVEX///+nxBvIAAAASElEQVR4nO3BgQAAAADDoPlTX+AIVQEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwDcaiAAFXD1ujAAAAAElFTkSuQmCC'
        : `data:image/png;base64,${logoimage}`;
        const firstTable = {
          style: 'tableExample',
          table: {
            widths: [250, 250],
            body: [
              [
                { text: 'Clause 4: Context of the Organization', style: 'superheader', colSpan: 2 },
                {},
              ],
              [
                {
                  stack: [
                    { text: 'i. Any changes in the Context of the Division/ Group wrt. as documented in Work Procedure', style: 'superheader' },
                    { text: 'a. Changes in Org. Chart?', style: 'normal', alignment: 'left', margin: [22, 0, 0, 0] }, // Adjusted alignment and margin
                    { text: 'b. New Group Formed?', style: 'normal', alignment: 'left', margin: [22, 0, 0, 0] },
                    { text: 'c. New Teams Formed', style: 'normal', alignment: 'left', margin: [22, 0, 0, 0] },
                  ],
                },
                {},
              ],
              [
                {
                  stack: [
                    { text: 'ii. Any changes in Interested Parties ie. Internal & External Customers', style: 'superheader' },
                    { text: 'a. New Projects/Tasks', style: 'normal', alignment: 'left', margin: [22, 0, 0, 0] },
                    { text: 'b. New Review Boards', style: 'normal', alignment: 'left', margin: [22, 0, 0, 0] },
                    { text: 'c. New Vendors/Dev Contracts', style: 'normal', alignment: 'left', margin: [22, 0, 0, 0] },
                  ],
                },
                {},
              ],
              [
                {
                  stack: [
                    { text: 'iii. Any changes in Process flow diagram included in Work Procedure', style: 'superheader' },
                    { text: 'a. New Tasks', style: 'normal', alignment: 'left', margin: [22, 0, 0, 0] },
                    { text: 'b. New Activities', style: 'normal', alignment: 'left', margin: [22, 0, 0, 0] },
                  ],
                },
                {},
              ],
            ],
          },
          margin: [0, 20, 0, 15], // Reduced vertical margin for closer spacing
        };
        
  
      const secondTable = {
        style: 'tableExample',
        table: {
          widths: [250, 250],
          body: [
              [ { text: 'Clause 5.3 Requirement Role Responsibility ', style: 'superheader',colSpan: 2 },{}],
            [
              {
                stack: [
                  { text: 'Any changes in Role & Responsibilities wrt. New Projects/New Tasks / New activities', style: 'superheader' },
                  { text: 'a.  if so, Is the Organization structure/Chart up to date?', style: 'normal',alignment: 'left', margin: [22, 0, 0, 0] },
                  { text: 'b.  Are LRDE Quality Policy & Objectives displayed', style: 'normal',alignment: 'left', margin: [22, 0, 0, 0] },
                  { text: 'c.  Are Divsional/Group Quality Policy & Objectives dislpayed prominently', style: 'normal',alignment: 'left', margin: [22, 0, 0, 0] },
                ],
              },
              {},
            ],
          ],
        },
        margin: [0, 2, 0, 15], // Reduced vertical margin for closer spacing
      };
  
      const thirdTable = {
        style: 'tableExample',
        table: {
          widths: [250, 250],
          body: [
              [ { text: 'Clause 6.1 Risks & Opportunities for improvements', style: 'superheader' ,colSpan: 2},{}],
            [
              {
                stack: [
                  { text: 'i.Min.Of.Mtgs of reviews conducted by DOs/GHs', style: 'superheader' },
                  { text: 'a.  Date of latest Mtg:', style: 'normal' },
                  { text: 'b.  Number of CLOSED Action Points', style: 'normal' ,alignment: 'left', margin: [22, 0, 0, 0]},
                  { text: 'c.  Number of OPEN Action Points', style: 'normal' ,alignment: 'left', margin: [22, 0, 0, 0]},
                  { text: 'If NO REVIEW by DO in last six months Plz indicate' ,alignment: 'left', margin: [0, 0, 0, 0]},
                ],
              },
            {}
            ],
            [  { stack: [
                  { text: 'ii.Action points wrt weekly reviews conducted by Director-LRDE', style: 'superheader' },
                  { text: 'a)  Date of latest Mtg:', style: 'normal',alignment: 'left', margin: [22, 0, 0, 0] },
                  { text: 'b)  Number of CLOSED Action Points', style: 'normal',alignment: 'left', margin: [22, 0, 0, 0] },
                  { text: 'c)  Number of OPEN Action Points', style: 'normal',alignment: 'left', margin: [22, 0, 0, 0] },
                
                ],},{}],
            [
              {
                stack: [
                  { text: 'iii. Min.Of.Mtgs of reviews conducted by Proj.Director', style: 'superheader' },
                  { text: 'a)  New Projects/Tasks', style: 'normal',alignment: 'left', margin: [22, 0, 0, 0] },
                  { text: 'b)   Number of CLOSED Action Points', style: 'normal',alignment: 'left', margin: [22, 0, 0, 0] },
                  { text: 'c)   Number of OPEN Action Points', style: 'normal',alignment: 'left', margin: [22, 0, 0, 0] },
                ],
              },
              {},
            ],
           
          ],
        },
        margin: [0, 2, 0, 20], // Reduced vertical margin for closer spacing
      };
  
      const fourthtable = {
        style: 'tableExample',
        table: {
          widths: [250, 250],
          body: [
             
            [
              {
                stack: [
                  { text: 'Identify Three issues from above Minutes, Which are hindering the progress in the activities' ,alignment: 'left', margin: [0, 0, 0, 0]},
                  { },
                  {  },
                  { },
                  { },
                  
                ],
              },
            {}
            ],
            [  { stack: [
                  { text: 'i. Is the RISK REGISTER updated in the last 6 months, if NOT Updated then :', style: 'normal' },
                  { text: 'a)  Comment whether above Issues can be reflected in the rsik register', style: 'normal',alignment: 'left', margin: [22, 0, 0, 0] },
                  {  },
                  {  },
                
                ],},{}],
            [
              {
                stack: [
                  { text: 'ii. Does the RISK Register needs a review by DO?', style: 'normal' },
                  { },
                  {  },
                  { },
                ],
              },
              {},
            ],
            [
              {
                stack: [
                  { text: 'iii. Do the Key Performance Indicators needs to be updated', style: 'normal' },
                  { },
                  {  },
                  { },
                ],
              },
              {},
            ],
            [
              {
                stack: [
                  { text: 'iv. Are Key Performance Inidcators measureable (Y/N)', style: 'normal' },
                  { },
                  {  },
                  { },
                ],
              },
              {},
            ],
            [
              {
                stack: [
                  { text: 'v. Does the Key Performance Indicators needs a review by DO?', style: 'normal' },
                  { },
                  {  },
                  { },
                ],
              },
              {},
            ],
           
          ],
        },
        margin: [0, 2, 0, 2], // Reduced vertical margin for closer spacing
      };
  
      const fifthTable = {
        style: 'tableExample',
        table: {
          widths: [250, 250],
          body: [
              [ { text: 'Clause 7.1.3 -Infrastructure', style: 'superheader' ,colSpan: 2},{}],
            [
              {
                stack: [
                  { text: 'iv.Any changes in the important Infrastructure of Group/Division', style: 'normal' },
                  { text: '' },
                  { },
                  { },
                  { },
                ],
              },
            {}
            ],
            [  { stack: [
                  { text: 'v.  Is the Manpower/People structure defined in Work Procedure (Yes Or No)', style: 'normal' },
                  { },
                  {  },
                  {  },
                
                ],},{}],
            [
              {
                stack: [
                  { text: 'vi. How the communication Records of below interested parties are maintained:(Record the File Numbers)', style: 'normal' },
                  { text: 'a)  ISMs', style: 'normal',alignment: 'left', margin: [22, 0, 0, 0] },
                  { text: 'b)   Fax/letters Received', style: 'normal',alignment: 'left', margin: [22, 0, 0, 0] },
                  { text: 'c)   Fax/letters Sent', style: 'normal',alignment: 'left', margin: [22, 0, 0, 0] },
                ],
              },
              {},
            ],
            [
              {
                stack: [
                  { text: 'vii. How are Action Remarks of DO/GH in the ISMs /FAX/letters are tracked for closure', style: 'superheader' },
                  { },
                  {  },
                  {  },
                ],
              },
              {},
            ],
           
          ],
        },
        margin: [0, 2, 0, 20], // Reduced vertical margin for closer spacing
      };
        
      const sixthTable = {
        style: 'tableExample',
        table: {
          widths: [250, 250],
          body: [
              [ { text: 'Clause 8.1 -Operations', style: 'superheader' ,colSpan: 2},{}],
            [
              {
                stack: [
                  { text: 'i. List the major activities of the Auditee', style: 'normal' },
                  { text: '' },
                  { },
                  { },
                  { },
                ],
              },
            {}
            ],
            [  { stack: [
                  { text: 'ii. Are The Process flows diagrams for all the above processes of division document in DWP/GWP', style: 'normal' },
                  { },
                  {  },
                  {  },
                
                ],},{}],
            [
              {
                stack: [
                  { text: 'iii. Are Outputs/Documents of each Process are Listed', style: 'normal' },
                  { },
                  { },
                  { },
                ],
              },
              {},
            ],
  
           
          ],
        },
        margin: [0, 2, 0, 20], // Reduced vertical margin for closer spacing
      };
      const seventhTable = {
        style: 'tableExample',
        table: {
          widths: [250, 250],
          body: [
              [ { text: 'Clause 8.2 : Requirements for Products & Services', style: 'superheader' ,colSpan: 2},{}],
            [
              {
                stack: [
                  { text: 'i. Record of Reviews conducted with Customer', style: 'normal' },
                  { text: '' },
                  { },
                  { },
                  { },
                ],
              },
            {}
            ],
            [  { stack: [
                  { text: ' ii. Record of Reviews conducted by external Committees specified in project sanction letter', style: 'normal' },
                  { },
                  {  },
                  {  },
                
                ],},{}],

      
           
          ],
        },
        margin: [0, 2, 0, 80], // Reduced vertical margin for closer spacing
      };

      const eighthTable = {
        style: 'tableExample',
        table: {
          widths: [250, 250],
          body: [
              [ { text: 'Clause 8.3 -Design & Development (Applicable to Radar division & RAMD & RMED only)', style: 'superheader' ,colSpan: 2},{}],
           
         
            [
              {
                margin: [0, 2, 0, 300], // Adjust the margin for a smaller gap
                text: '', colSpan: 2, 
              },
              {
                margin: [0, 2, 0, 300], // Adjust the margin for a smaller gap
                text: '',
              },
            ],
  
           
          ],
        },
        margin: [0, 2, 0, 20], // Reduced vertical margin for closer spacing
      };
      const ninethTable = {
        style: 'tableExample',
        table: {
          widths: [250, 250],
          body: [
              [ { text: 'Clause 8.3.2 : Design & Development', style: 'superheader' ,colSpan: 2},{}],
            [
              {
                stack: [
                  { text: 'i. Design planning of products(Physical check for SE documents)', style: 'normal' },
                  { text: '' },
                  { },
                  { },
                  { },
                ],
              },
            {}
            ],
            [  { stack: [
                  { text: 'ii. Design input of products(Physical check for SE documents)', style: 'normal' },
                  { },
                  {  },
                  {  },
                
                ],},{}],
                [  { stack: [
                  { text: 'iii. Design and Development controls(Physical check for SE documents)', style: 'normal' },
                  { },
                  {  },
                  {  },
                
                ],},{}],
                [  { stack: [
                  { text: 'iv. Design and Development outputs(Physical check for SE documents)', style: 'normal' },
                  { },
                  {  },
                  {  },
                
                ],},{}],
           
      
           
          ],
        },
        margin: [0, 2, 0, 80], // Reduced vertical margin for closer spacing
      };

      const tenthTable = {
        style: 'tableExample',
        table: {
          widths: [250, 250],
          body: [
              [ { text: 'Clause 8.4 : Products & Services- Externally provided', style: 'superheader' ,colSpan: 2},{}],
            [
              {
                stack: [
                  { text: 'i. Procurement Process of Division', style: 'normal' },
                  { text: 'a. Number of Active Procurement Files', style: 'normal' ,margin: [22, 0, 0, 0]},
                  { text: 'b. How they Track the status of Procurement files', style: 'normal',margin: [22, 0, 0, 0] },
                  { text: 'c. How they Track the location of Procurement files', style: 'normal' ,margin: [22, 0, 0, 0]},
                  { text: 'd. Number of Supply order placed in 6 months', style: 'normal' ,margin: [22, 0, 0, 0]},
                  { text: 'e. Number of Items Received in 6 months', style: 'normal',margin: [22, 0, 0, 0] },
                ],
              },
            {}
            ],
            [  { stack: [
                  { text: '  ii. Min.Of.Mtg of Dev. Contracts (If applicable)', style: 'normal' },
                  { },
                  {  },
                  {  },
                
                ],},{}],
                [  { stack: [
                  { text: '   iii. Reviews conducted at Vendor premises (If applicable)', style: 'normal' },
                  { },
                  {  },
                  {  },
                
                ],},{}],

      
           
          ],
        },
        margin: [0, 2, 0, 3], // Reduced vertical margin for closer spacing
      };
      const elevenTable = {
        style: 'tableExample',
        table: {
          widths: [250, 250],
          body: [
              [ { text: 'Clause 8.5 : Production & Service Provision', style: 'superheader' ,colSpan: 2},{}],
            [
              {
                stack: [
                  { text: ' i. List of Documents prepaed and released in last one year wrt. clause 8.3', style: 'normal' },
                 
                ],
              },
            {}
            ],

          ],
        },
        margin: [0, 2, 0, 3], // Reduced vertical margin for closer spacing
      };

      const twelveTable = {
        style: 'tableExample',
        table: {
          widths: [250, 250],
          body: [
              [ { text: 'Clause 8.5.5 : Post Delivery activities', style: 'superheader' ,colSpan: 2},{}],
            [
              {
                stack: [
                  { text: '  i. (External Interested Parties)/ Customer Feedback records -who availed the services and Products', style: 'normal' },
                 
                ],
              },
            {}
            ],

          ],
        },
        margin: [0, 2, 0, 3], // Reduced vertical margin for closer spacing
      };
      const thirteenTable = {
        style: 'tableExample',
        table: {
          widths: [250, 250],
          body: [
              [ { text: 'Clause 8.5.6 : Control of Changes', style: 'superheader' ,colSpan: 2},{}],
            [
              {
                stack: [
                  { text: '  i. How Docuement Configuration Management and document change control process implemented (If applicable)', style: 'normal' },
                 
                ],
              },
            {}
            ],

          ],
        },
        margin: [0, 2, 0, 3], // Reduced vertical margin for closer spacing
      };
      const fourteenTable = {
        style: 'tableExample',
        table: {
          widths: [250, 250],
          body: [
              [ { text: 'Clause 8.7 : Control of Non-Conforming Products & Services', style: 'superheader' ,colSpan: 2},{}],
            [
              {
                stack: [
                  { text: ' i. Records of Non-conforming products/Service ie.', style: 'normal' },
                  { text: ' a. System /Subsystem Failures', style: 'normal',margin: [22, 0, 0, 0] },
                  { text: ' b. Major Issues', style: 'normal' ,margin: [22, 0, 0, 0]},
                  { text: ' c. Missed Goals/Targets/Delays', style: 'normal',margin: [22, 0, 0, 0] },
                  { text: ' d. Complaints Received', style: 'normal' ,margin: [22, 0, 0, 0]},
                  { text: ' e. Audit Observations of External audit agencies',margin: [22, 0, 0, 0] },
                 
                ],
              },
              { },
            ],
            [
              {text: 'ii. Record of Actions taken above Non-conformances'
               
              },
              {  },
            ],

          ],
        },
        margin: [0, 2, 0, 3], // Reduced vertical margin for closer spacing
      };
      const fifteenTable = {
        style: 'tableExample',
        table: {
          widths: [250, 250],
          body: [
              [ { text: ' Clause 9 : Performance Evaluation', style: 'superheader' ,colSpan: 2},{}],
            [
              {
                stack: [
                  { text: '  i. Records wrt KPIs Measurements', style: 'normal' },
               
                ],
              },
            {}
            ],

          ],
        },
        margin: [0, 2, 0, 3], // Reduced vertical margin for closer spacing
      };
      const sixteenTable = {
        style: 'tableExample',
        table: {
          widths: [250, 250],
          body: [
              [ { text: 'Clause 9.2 : Internal audit', style: 'superheader' ,colSpan: 2},{}],
            [
              {
                stack: [
                  { text: ' i.  Record of Previous 3 internal Audits and Closure action taken', style: 'normal'},
            
                ],
              },
            {}
            ],
            [
              {
                stack: [
               
                  { text: ' ii.  Record of Quarterly ISO review Mtg chaired by DO', style: 'normal' },
                  { },
                ],
              },
            {}
            ],

          ],
        },
        margin: [0, 2, 0, 3], // Reduced vertical margin for closer spacing
      };
      const seventeenTable = {
        style: 'tableExample',
        table: {
          widths: [250, 250],
          body: [
              [ { text: 'Clause 9.3 : Management Review', style: 'superheader' ,colSpan: 2},{}],
            [
              {
                stack: [
                  { text: ' Action points wrt. the Quality Mgt. Review Committee Mtg', style: 'normal' },
                 
                ],
              },
            {}
            ],

          ],
        },
        margin: [0, 2, 0, 3], // Reduced vertical margin for closer spacing
      };
      const eighteenTable = {
        style: 'tableExample',
        table: {
          widths: [250, 250],
          body: [
              [ { text: ' Clause 10 : Improvement / Continual Improvement', style: 'superheader' ,colSpan: 2},{}],
            [
              {
                stack: [
                  { text: ' Notable Continual Improvement in the Group/Division as illustrated by the Auditee', style: 'normal' },
                 
                ],
              },
            {}
            ],

          ],
        },
        margin: [0, 2, 0, ,0], // Reduced vertical margin for closer spacing
      };
      // Push all the table data into MyContent
      const MyContent = [];
      
  
      MyContent.push(firstTable);
      MyContent.push(secondTable);
      MyContent.push(thirdTable);
      MyContent.push(fourthtable);
      MyContent.push(fifthTable);
      MyContent.push(sixthTable);
      MyContent.push(seventhTable);
      MyContent.push(eighthTable);
      MyContent.push(ninethTable);
      MyContent.push(tenthTable);
      MyContent.push(elevenTable);
      MyContent.push(twelveTable);
      MyContent.push(thirteenTable);
      MyContent.push(fourteenTable);
      MyContent.push(fifteenTable);
      MyContent.push(sixteenTable);
      MyContent.push(seventeenTable);
      MyContent.push(eighteenTable);
      
     ;
     function generateRotatedTextImage(text) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Define dimensions of the canvas (adjust as necessary)
      const textFontSize = 20; // Text font size in px
      const canvasWidth = 80; // Width before rotation
      const canvasHeight = 150; // Height before rotation
  
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
  
      // Set font and styling
      ctx.font = `bold ${textFontSize}px Roboto`; 

      ctx.fillStyle = 'black'; // Text color
  
      // Translate and rotate canvas context
      ctx.translate(canvasWidth / 2, canvasHeight / 2); // Move to center
      ctx.rotate(-Math.PI / 2); // Rotate 90 degrees counterclockwise
  
      // Draw the text in the rotated context
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, 0, 0); // Draw at rotated position
  
      // Convert the canvas to a base64 image
      return canvas.toDataURL();
  }
  const rotatedImage = generateRotatedTextImage('ISO-9001:2015');
    // Define the document content
    const docDefinition = {
      info: {
        title: 'Audit Check List Print',
      },
      pageSize: 'A4',
      pageOrientation: 'portrait',
      pageMargins: [60, 170, 80, 150], // Increased top margin for header
      content: [
        {
          text: 'ISO-9001:2015- Audit Check List',
          style: 'heading',
          alignment: 'center',
          decoration: 'underline',  // Underline the heading
          bold: true,               // Make the heading bold
          fontSize: 15,             // Set the font size
          margin: [0, 20, 0, 1],    // Margin below the heading
        },
        firstTable,
        secondTable,
        thirdTable,
        fourthtable,
        fifthTable,
        sixthTable,
        seventhTable,
        eighthTable,
        ninethTable,
        tenthTable,
        elevenTable,
        twelveTable,
        thirteenTable,
        fourteenTable,
        fifteenTable,
        sixteenTable,
        seventeenTable,
        eighteenTable

      ],
      header: (currentPage, pageCount) => {
        return {
          style: 'headertable',
          table: {
            widths: ['12%', '54%', '16%', '16%', '5%'], // Column widths
            body: [
              // Row 1: First two cells with colspan
              [
                {
                  text: 'Electronics and Radar Development Establishment, CV Raman Nagar, Bangalore -560093',
                  style: 'superheader',
                  fontSize: 10,
                  alignment: 'center',
                  colSpan: 5,
                },
                {}, {}, {}, {}
              ],
              // Row 2
              [
                {
                  image: logoImageSrc,
                  width: 55,
                  height: 55,
                  rowSpan: 4, // Applying rowspan to this cell
                  margin: [0, 0, 0, 0],
                },
                {
                  stack: [
                    {
                      text: 'ISO-9001:2015 Internal Quality Audit ' + (iqaNo ? iqaNo.split('-')[1] : ''),
                      style: 'superheader',
                      fontSize: 14,
                      alignment: 'center',
                    }
                    ,
                    {
                      text: 'INTERNAL AUDIT REPORT (IAR)',
                      style: 'superheader',
                      alignment: 'center',
                      fontSize: 12,
                      margin: [5, 5, 5, 0],
                    },
                  ],
                  rowSpan: 4, // Applying rowspan to this cell as well
                  //margin: [0, 5, 0, 5],
                },
                { text: 'FROM NO', style: 'superheader', fontSize: 9, margin: [2, 0, 0, 0] },
                { text: '', style: 'superheader', fontSize: 9, margin: [2, 0, 0, 0] },
                {
                  image: rotatedImage, // Use the rotated image
                  width: 30,
                  height: 60,
                  margin: [-8, 0, 0, 0],
                  rowSpan: 4
                }
                
                ,
              ],
              // Row 3
              [
                {},
                {},
                { text: 'REFERENCE', style: 'superheader', fontSize: 9, margin: [0, 0, 0, 0] , fontWeight: 'bold'},
                { text: '', style: 'superheader', fontSize: 9, margin: [2, 0, 0, 0] },
                {},
              ],
              // Row 4
              [
                {},
                {},
                { text: 'REV NO', style: 'superheader', fontSize: 9, margin: [0, 0, 0, 0], fontWeight: 'bold' },
                { text: '', style: 'superheader', fontSize: 9, margin: [2, 0, 0, 0] },
                {},
              ],
              // Row 5
              [
                {},
                {},
                { text: 'PAGE NO', style: 'superheader', fontSize: 9, margin: [0, 0, 0, 0] },
                { text: `Page ${currentPage} of ${pageCount}`, style: 'superheader', fontSize: 9, margin: [2, 0, 0, 0] },
                {},
              ],
              // Additional table row
              [
                {
                  table: {
                    widths: ['25%', '25%', '25%', '25%'],
                    body: [
                      [
                        { text: '1.  Auditee Group:', style: 'headerNames', alignment: 'left', border: [false, false, false, false], fontSize: 9 },
                        { text: '', style: 'headerNames', alignment: 'left', border: [false, false, false, false], fontSize: 9 },
                        { text: '2.  Auditors Name:', style: 'superheader', alignment: 'left', border: [false, false, false, false], fontSize: 9 },
                        { text: '', style: 'superheader', alignment: 'left', border: [false, false, false, false], fontSize: 9 },
                      ],
                      [
                        { text: '3.  Auditee Name:', style: 'superheader', alignment: 'left', border: [false, false, false, false], fontSize: 9 },
                        { text: '', style: 'superheader', alignment: 'left', border: [false, false, false, false], fontSize: 9 },
                        { text: '4. IQA Report No:', style: 'superheader', alignment: 'left', border: [false, false, false, false], fontSize: 9 },
                        { text: iqaNo , style: 'superheader', alignment: 'left', border: [false, false, false, false], fontSize: 9 },
                      ],
                      [
                        { text: '5.  Audit scope', style: 'superheader', alignment: 'left', border: [false, false, false, false], fontSize: 9 },
                        { text: '', style: 'superheader', alignment: 'left', border: [false, false, false, false], fontSize: 9 },
                        { text: '6. Date', style: 'superheader', alignment: 'left', border: [false, false, false, false], fontSize: 9 },
                        { text: '', style: 'superheader', alignment: 'left', border: [false, false, false, false], fontSize: 9 },
                      ],
                    ],
                  },
                  colSpan: 5,
                },
                {}, {}, {}, {},
              ],
            ],
          },
         // margin: [60, 20, 60, 90], // Adjusted header margin
          margin: [60, 20, 30, 10], //[R,t,R,,B ]
        };
      },
      
      
      
      
      
      footer: (currentPage, pageCount) => {
        return [
          {
            style: 'tableExample',
            table: {
              widths: [250, 250],
              body: [
                [
                  { text: 'Non-Conformances:', style: 'superheader' },
                  { text: 'Observations:', style: 'superheader' },
                ],
                [
                  {
                    text: 'Name, Designation, Signature of Auditor',
                    style: 'superheader',
                    margin: [0, 10, 0, 10], // Top and bottom margin
                    border: [false, false, false, true],
                  },
          
                  {
                  stack: [
                    { text: 'Name, Designation, Signature of Auditee:', style: 'superheader' ,  margin: [50, 5, 0, 5], },
                    {text: `Page ${currentPage} of ${pageCount}`,margin: [200, 0, 0, 0], },
                   
                  ],border: [false, false, false, true],}
                ],
              ],
            },
            margin: [60, 40, 0, 10], // FOR FOOTER PADDING
          },
          {
           
          },
        ];
      },
      styles: {
        superheader: {
          fontSize: 10,
          bold: true,
        },
        footer: {
          fontSize: 8,
          italics: true,
        },
        tableExample: {
          margin: [0, 0, 0, 0],
          fontSize: 8,
        },
     
      },
    };

    // Generate and open the PDF
    pdfMake.createPdf(docDefinition).open();
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
};

export default AuditCheckListPdf;
