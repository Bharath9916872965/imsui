import pdfMake from 'pdfmake/build/pdfmake';
import dayjs from 'dayjs';
import { getDrdoLogo, getLabDetails, getLogoImage } from 'services/qms.service';
const RiskRegisterReport = async (riskregmitmergeList) => {

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
    function generateRotatedTextImage(text) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      // Define dimensions of the canvas (adjust as necessary)
      const textFontSize = 24; // Text font size in px
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
  const rotatedTIME = generateRotatedTextImage('TIME');
  const rotatedTP  = generateRotatedTextImage('TP');
  const rotatedCost  = generateRotatedTextImage('Cost');
  const rotatedAvg  = generateRotatedTextImage('Avg.(I) ');
  const rotatedPxI   = generateRotatedTextImage('(PxI)');
  const rotatedP   = generateRotatedTextImage('(P)');
  const rotatedI   = generateRotatedTextImage('(I)');
  const rotateResidualRisk    = generateRotatedTextImage('Residual\nRisk ');
  const OverallImpact   = generateRotatedTextImage('Overall Impact');
  const getBackgroundColorForRiskNo = (riskNo) => {
    if (riskNo >= 1 && riskNo <= 4) {
        return 'green'; // Green for riskNo 1-4
    } else if (riskNo > 4 && riskNo <= 10) {
        return 'yellow'; // Yellow for riskNo 5-10
    } else if (riskNo > 10 && riskNo <= 25) {
        return 'red'; // Red for riskNo 11-20
    }else if (riskNo===0){
      return 'lightgrey';
    }
    return 'inherit'; // Default background color if not in the ranges
};
const header = [
  {
    style: 'tableExample',
    table: {
      widths: Array(15).fill(41.6), // Each column gets an equal width of 41.6
      body: [
        [
          {text: 'Appendix – A (Risk Register)', colSpan: 15,fontSize: 20,alignment: 'left', bold: true,
          },
        ],
      ],
    },
    layout: 'noBorders', // Ensures no border is displayed
  },
];



  const firstTable = [
    {
      style: 'tableExample',
      table: {
        widths: [18,180,60,18, 18, 18, 38,35,18,18,18,18,38,25,110],
        body: [
          [{text: 'RISK REGISTER - Project, Engineering & Support Division and its Groups / Sub Groups', style: 'superheader',colSpan: 15,fillColor: '#FDAF7B' },
            { },
            { }, { },{ },{ },{ },{ },{ }, { },{ },{ },{ },{ },{ },
           ],
          [{text: 'Risk Assessment, Mitigation & Risk Based Thinking(RBT)', style: 'superheader',colSpan: 15 ,fillColor: '#FDAF7B'},
            { },
            {}, { }, { },{ },{ },{ },{ }, { },{ },{ },{ },{ },{ },
           ],
           [{text: 'Documented Reference : ISO 9001:2015- 6.1 clause & QSP - Risk Mgmt', style: 'superheader',colSpan: 15 ,fillColor: '#FDAF7B'},
            { },
            {}, { }, { },{ },{ },{ },{ }, { },{ },{ },{ },{ },{ },
           ],
          [{text:'',border: [true, true, true, false]},
            { text:'',border: [true, true, true, false]},
            { text:'',border: [true, true, true, false],},
            { text:'',border: [false, false, false, false], colSpan: 3,fillColor:'#D3D3D3'},
            { text:'',border: [false, false, true, false],},
            { text:'',border: [false, false, true, false],},
            {text:'',border: [false, false, false, true],fillColor:'#D3D3D3'},
             {text: 'Risk Rating ', style: 'superheader',colSpan: 7, border: [false, true, true, true],fillColor:'#D3D3D3'},
             {text: ' ',background: 'lightblue',},{ },{ },{ },{ },{ },
            {  text:'', style:'superheader',border: [true, true, true, false]}
          ],
          [{text: '  ', style: 'superheader',border: [true, false, true, false]},
            {text: '  ', style: 'superheader',border: [true, false, true, false] },
            {text: '  ', style: 'superheader',border: [true, false, true, false]},
            { text: 'Original Risk', style: 'superheader',colSpan: 3, fillColor:'#B3C8CF'},
            { text: ' ', style: 'superheader',colSpan:5,border: [true, true, true, false], fillColor:'#B3C8CF'},
            { },
            {text: '  ', style: 'superheader',border: [true, false, true, false],fillColor:'#B3C8CF' }, 
            { text:'', style:'superheader',border: [true, false, true, false] ,fillColor:'#B3C8CF'},
            {  text:'', style:'superheader',border: [true, false, false, false],fillColor:'#FFF2C2'},
            {  text:'', style:'superheader',border: [false, false, false, false],fillColor:'#FFF2C2'},
            {  text:'', style:'superheader',border: [false, false, false, false],fillColor:'#FFF2C2'},
            {  text:'', style:'superheader',border: [false, false, false, false],fillColor:'#FFF2C2'},
            { text:'', style:'superheader',border: [true, false, false, false] ,fillColor:'#FFF2C2'},
            { text:'', style:'superheader',border: [true, false, false, false] ,fillColor:'#FFF2C2'},
            {  text:'Mitigation Plan', style:'superheader',border: [true, false, true, false]}
          ],
          [{text: 'SN', style: 'superheader',border: [true, false, false, false] },
            { text: 'Risk Description', style: 'superheader',border: [true, false, false, false] },
            {text: 'Probability of Occurrence (P)\n(Scale 1 to 5)', style: 'superheader',border: [true, false, true, false] },
            { text:'impact on (Scale 1 to 5)',style:'superheader',colSpan: 3,fillColor:'#B3C8CF' },
            {},{},
            { text:'Overall Impact',style:'superheader' ,border: [true, false, true, true],fillColor:'#B3C8CF'}, 
            // {    image: OverallImpact, width: 30, height: 60,fillColor:'#B3C8CF',fillColor:'#B3C8CF'}, 
         { text:'Risk No',style:'superheader',border: [true, false, true, true] ,fillColor:'#B3C8CF'},
            { text:'Mitigated Risk ', style:'superheader', colSpan: 4,border: [true, false, true, true],fillColor:'#FFF2C2'},
            { },
            { },
            { },
            { text:'Overall Impact',style:'superheader' ,border: [true, false, true, true],fillColor:'#FFF2C2'},
            {text:'Risk No', style:'superheader',border: [true, false, true, true],fillColor:'#FFF2C2' },
            { text:' ', style:'superheader',border: [true, false, true, true],}

          ],
          [{text:'', style: 'superheader',border: [true, false, true, true]},
            { text:'', style: 'superheader',border: [true, false, true, true]},
            {  text:'', style: 'superheader',border: [true, false, true, true]},
            { image: rotatedTP, width: 30, height: 60,fillColor:'#B3C8CF'},
            {image: rotatedTIME, width: 30, height: 60,fillColor:'#B3C8CF' },
            {image:rotatedCost,width: 30,height: 60 ,fillColor:'#B3C8CF'},
            {image:rotatedAvg,width: 30,height: 60,fillColor:'#B3C8CF'},
            {image:rotatedPxI,width: 30,height: 60,fillColor:'#B3C8CF'},
            {image:rotatedP,width: 30,height: 60,fillColor:'#FFF2C2'},
            {image: rotatedTP, width: 30, height: 60,fillColor:'#FFF2C2'},
            {image:rotatedTIME,width: 30,height: 60,fillColor:'#FFF2C2'},
            {image:rotatedCost,width: 30,height: 60,fillColor:'#FFF2C2' },
            {image:rotatedAvg,width: 30,height: 60,fillColor:'#FFF2C2' },
            {image:rotateResidualRisk,width: 30,height: 60,fillColor:'#FFF2C2'  } ,
            { text: 'Mitigation Approach  ', style: 'superheader'},
            ],
]
       
      },
      margin: [0, 20, 0, 15],
    }];

    
    riskregmitmergeList.forEach((item, index) => {
      if (item && Object.keys(item).length > 0) {
        firstTable[0].table.body.push([
          { text: index + 1, style: 'normal', alignment: 'left' },
          { text: item.riskDescription || '-', style: 'normal', alignment: 'left' },
          { text: item.probability || '-', style: 'normal', alignment: 'center' },
          { text: item.technicalPerformance || '-', style: 'normal', alignment: 'center',fillColor:'#B3C8CF' },
          { text: item.time || '-', style: 'normal', alignment: 'center',fillColor:'#B3C8CF' },
          { text: item.cost || '-', style: 'normal', alignment: 'center',fillColor:'#B3C8CF' },
          { text: item.average || '-', style: 'normal', alignment: 'center',fillColor:'#B3C8CF' },
          {text: item.riskNo || '-', style: 'normal', alignment: 'center',fillColor: getBackgroundColorForRiskNo(Number(item.riskNo)), },
          {text: item.mitigationProbability || '-', style: 'normal', alignment: 'center',fillColor:'#FFF2C2' },
          {text: item.mitigationTp || '-', style: 'normal', alignment: 'center',fillColor:'#FFF2C2'}, 
          {text: item.mitigationTime || '-', style: 'normal', alignment: 'center',fillColor:'#FFF2C2'}, 
          {text: item.mitigationCost || '-', style: 'normal', alignment: 'center',fillColor:'#FFF2C2'},
          {text: item.mitigationAverage || '-', style: 'normal', alignment: 'center',fillColor:'#FFF2C2'},
          {text: item.mitigationRiskNo || '-', style: 'normal', alignment: 'center',   fillColor: getBackgroundColorForRiskNo(Number(item.mitigationRiskNo)),},
          {text: item.mitigationApproach || '-', style: 'normal', alignment: 'left',}
        ]);
      }
    });
    let MyContent = []; 
    MyContent = firstTable; 
    MyContent = [...header, ...MyContent]; 
    // Define the PDF content
    const docDefinition = {
      info: {
        title: `Risk Register Print`,
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
                      text: ``,
                      style: 'superheader',
                      fontSize: 14,
                      alignment: 'center',
                      margin: [0, 0, 0, 6],
                    },
                    {
                      text: `Risk Management`,
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

export default RiskRegisterReport;
