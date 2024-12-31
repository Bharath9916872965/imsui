import pdfMake from 'pdfmake/build/pdfmake';
import React from 'react';
import dayjs from 'dayjs';
import { getDrdoLogo, getLabDetails, getLogoImage } from 'services/qms.service';
const GenerateCombinedPDF = async (
  auditData,
  iqaNo,
  iqaFromDate,
  iqaToDate,
  filAuditTeamDtoList,
  teamMembersGrouped
) => {
  try {
        const labDetails = await getLabDetails();
        const logoImg = await getLogoImage();
        const drdoLogo = await getDrdoLogo();
    const formattedFromDate = dayjs(iqaFromDate).format('DD-MMM-YYYY');
    const formattedToDate = dayjs(iqaToDate).format('DD-MMM-YYYY');

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

    // Generate Audit Schedule Content
    let auditTableBody = [
      [
        { text: 'SN', bold: true, alignment: 'center', style: 'superheader',margin: [5, 2, 5, 2] },
        { text: 'Date :Time (Hrs)', bold: true, alignment: 'center', style: 'superheader',margin: [5, 2, 5, 2] },
        { text: 'Division/Group', bold: true, alignment: 'center', style: 'superheader',margin: [5, 2, 5, 2] },
        { text: 'Project', bold: true, alignment: 'center', style: 'superheader' ,margin: [5, 2, 5, 2]},
        { text: 'Auditee', bold: true, alignment: 'center', style: 'superheader',margin: [5, 2, 5, 2] },
        { text: 'Team', bold: true, alignment: 'center', style: 'superheader' ,margin: [5, 2, 5, 2]},
      ],
    ];

    auditData.forEach((item, index) => {
      auditTableBody.push([
        { text: index + 1, style: 'normal', alignment: 'center',margin: [0, 0, 0, 0] },
        { text: item.date || '-', style: 'normal', alignment: 'center',margin: [0, 0, 0, 0] },
        { text: item.divisionCode || '-', style: 'normal', alignment: 'left',margin: [0, 5, 0, 0] },
        { text: item.project || '-', style: 'normal', alignment: 'left' ,margin: [0, 0, 0, 0]},
        { text: item.auditee || '-', style: 'normal', alignment: 'left',margin: [0, 5, 0, 0] },
        { text: item.team || '-', style: 'normal', alignment: 'left',margin:[0, 5, 0, 0] },
      ]);
    });

    const auditContent = {
      style: 'tableExample',
      table: {
        widths: [40, 120, 140, 170, 160, 80],
        body: auditTableBody,
      },
      margin: [10, 10, 0, 10],
    };

    // Generate Internal Auditor Teams Content
    const maxAuditors = Math.max(
      ...filAuditTeamDtoList.map(
        (team) => (teamMembersGrouped[team.teamId] || []).length
      )
    );

    const auditorTableHeaders = [
      { text: 'SN', bold: true, alignment: 'center', style: 'superheader' },
      { text: 'Team Name', bold: true, alignment: 'center', style: 'superheader' },
    ];

    for (let i = 1; i <= maxAuditors; i++) {
      auditorTableHeaders.push({
        text: `Auditor ${i}`,
        bold: true,
        alignment: 'center',
        style: 'superheader',
      });
    }

    let auditorTableBody = [auditorTableHeaders];

    filAuditTeamDtoList.forEach((team, index) => {
      const teamMembers = teamMembersGrouped[team.teamId] || [];
      const auditors = teamMembers.map((member) => member.name);

      const row = [
        { text: index + 1, style: 'normal', alignment: 'center',margin: [5, 2, 5, 2] },
        { text: team.teamCode || '-', style: 'normal', alignment: 'center',margin: [5, 2, 5, 2] },
      ];

      for (let i = 0; i < maxAuditors; i++) {
        row.push({
          text: auditors[i] || '-',
          style: 'normal',
          alignment: 'left',margin: [2, 2, 5, 2],
        });
      }

      auditorTableBody.push(row);
    });

    const auditorContent = {
      style: 'tableExample',
      table: {
        widths: [30, 70, ...Array(maxAuditors).fill(150)],
        body: auditorTableBody,
      },
      margin: [10, 10, 0, 10],
    };

    // Combine both contents into a single PDF with page breaks
    const docDefinition = {
      info: {
        title: 'Audit Summary Print',
      },
      pageSize: 'A4',
      pageOrientation: 'landscape',
      pageMargins: [40, 10, 40, 25],
      content: [
        // First Header: Audit Schedule Section (Part of page content)
        {
          stack: [
            {
              columns: [
                {
                  image: logoImg
                    ? `data:image/png;base64,${logoImg}`
                    : 'data:image/png;base64,...',
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
                      margin: [0, 0, 0, 6],
                    },
                    {
                      text: `Audit Summary`,
                      style: 'superheader',
                      fontSize: 14,
                      alignment: 'center',
                      margin: [0, 0, 0, 6],
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
                  image: drdoLogo
                    ? `data:image/png;base64,${drdoLogo}`
                    : 'data:image/png;base64,...',
                  width: 30,
                  height: 30,
                  alignment: 'right',
                  margin: [0, 15, 20, 10],
                },
              ],
            },
          ],
          margin: [0, 0, 0, 10], // Margin for the second header
        },
        auditorContent,
 // The content for the Audit Schedule
        { text: '', pageBreak: 'before' }, // Ensure a page break for the next section
        
        // Second Header: Internal Auditor Teams Section (Part of page content)
 // The content for the Internal Auditor Teams


        {
          stack: [
            {
              columns: [
                {
                  image: logoImg
                    ? `data:image/png;base64,${logoImg}`
                    : 'data:image/png;base64,...',
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
                      margin: [0, 0, 0, 6],
                    },
                    {
                      text: `Audit Summary`,
                      style: 'superheader',
                      fontSize: 14,
                      alignment: 'center',
                      margin: [0, 0, 0, 6],
                    },
                    {
                      text: `${iqaNo}${'\u00A0'.repeat(2)}:${'\u00A0'.repeat(2)}AUDIT SCHEDULE (${formattedFromDate} - ${formattedToDate})`,
                      style: 'superheader',
                      fontSize: 14,
                      alignment: 'center',
                    },
                  ],
                  margin: [0, 20, 20, 10],
                },
                {
                  image: drdoLogo
                    ? `data:image/png;base64,${drdoLogo}`
                    : 'data:image/png;base64,...',
                  width: 30,
                  height: 30,
                  alignment: 'right',
                  margin: [0, 15, 20, 10],
                },
              ],
            },
          ],
          margin: [0, 0, 0, 10], // Margin for the top section
        },
        auditContent,
      ],
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
    
    pdfMake.createPdf(docDefinition).open();
    
  } catch (error) {
    console.error('Error generating PDF: ', error);
  }
};

export default GenerateCombinedPDF;
