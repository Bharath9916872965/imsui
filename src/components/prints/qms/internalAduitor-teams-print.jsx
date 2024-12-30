import pdfMake from 'pdfmake/build/pdfmake';
import React from 'react';
import { getDrdoLogo, getLabDetails, getLogoImage } from 'services/qms.service';
const InternalAuditorTeamsPrint = async (filAuditTeamDtoList, teamMembersGrouped, iqaNo) => {
  try {
     const labDetails = await getLabDetails();
        const logoImg = await getLogoImage();
        const drdoLogo = await getDrdoLogo();
      
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

    // Determine the maximum number of auditors
    const maxAuditors = Math.max(
      ...filAuditTeamDtoList.map(
        (team) => (teamMembersGrouped[team.teamId] || []).length
      )
    );

    // Adjust headers based on the number of auditors
    const tableHeaders = [
      { text: 'SN', bold: true, alignment: 'center', style: 'superheader' },
      { text: 'Team Name', bold: true, alignment: 'center', style: 'superheader' },
    ];

    for (let i = 1; i <= maxAuditors; i++) {
      tableHeaders.push({
        text: `Auditor ${i}`,
        bold: true,
        alignment: 'center',
        style: 'superheader',
      });
    }

    // Table body with headers
    let tableBody = [tableHeaders];

    // Add rows to the table body based on data
    filAuditTeamDtoList.forEach((team, index) => {
      const teamMembers = teamMembersGrouped[team.teamId] || [];
      const auditors = teamMembers.map((member) => member.name);

      const row = [
        { text: index + 1, style: 'normal', alignment: 'center' },
        { text: team.teamCode || '-', style: 'normal', alignment: 'text-left',margin: [5, 2, 5, 2] },
      ];

      for (let i = 0; i < maxAuditors; i++) {
        row.push({
          text: auditors[i] || '-',
          style: 'normal',
          alignment: 'text-left',margin: [2, 2, 5, 2]
        });
      }

      tableBody.push(row);
    });
//console.log('tableBodyinside',tableBody);
    // Define the PDF content
    let MyContent = [
      {
        style: 'tableExample',
        table: {
          widths: [30, 70, ...Array(maxAuditors).fill(150)],
          body: tableBody,
        },
        margin: [10, 10, 0, 10],
      },
    ];

    // Define the document structure and styles
    const docDefinition = {
      info: {
        title: 'Internal Auditor Teams Print',
      },
      pageSize: 'A4',
      pageOrientation: 'landscape',
      pageMargins: [50, 120, 40, 25],
  
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
                                  margin: [0, 0, 0, 4],
                                },
                                {
                                  text: iqaNo + '\u00A0(INTERNAL AUDITOR TEAMS)',
                                  style: 'superheader',
                                  fontSize: 15,
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
              { text: 'Printed By VEDTS-IMS', alignment: 'left', fontSize: 12 },
              {
                text: `Printed On: ${currentDate}   ${"\u00A0".repeat(12)} Page: ${currentPage} of ${pageCount}`,
                alignment: 'right',
                fontSize: 12,
                margin: [0, 0, 40, 0],
              },
            ],
            margin: [40, 0, 40, 60],
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
          fontSize: 12,
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

export default InternalAuditorTeamsPrint;
