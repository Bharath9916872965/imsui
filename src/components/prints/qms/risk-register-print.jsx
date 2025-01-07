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
  const firstTable = [
    {
      style: 'tableExample',
      table: {
        widths: [28, 20, 20, 120,81,18, 18, 18, 38,25,18,18,18,18,38,25,90],
        body: [
          [
            { text: 'RISK REGISTER - Project, Engineering & Support Division and its Groups / Sub Groups', style: 'superheader',colSpan: 17,fillColor: '#FDAF7B' },
            { }, { },{ },{ },{ },{ },{ }, { },{ },{ },{ },{ },{ },{ },{ } ,{ },
           ],
          [
            { text: 'Risk Assessment, Mitigation & Risk Based Thinking(RBT)', style: 'superheader',colSpan: 17 ,fillColor: '#FDAF7B'},
            {}, { }, { },{ },{ },{ },{ }, { },{ },{ },{ },{ },{ },{ },{ }  ,{ },
           ],
          [
            { text:'',border: [true, true, true, false]},
            { text:'',border: [true, true, true, false],},
            { text:'',border: [true, true, true, false],},
            { text:'',border: [true, true, true, false]},
            { text:'',border: [true, true, true, false],},
            { text:'',border: [false, false, false, false], colSpan: 3,fillColor:'#D3D3D3'},
            { text:'',border: [false, false, true, false],},
            { text:'',border: [false, false, true, false],},
            {text: 'Risk rating ', style: 'superheader',colSpan: 8, border: [false, true, true, true],fillColor:'#D3D3D3'}, {text: '' ,background: 'lightblue',},{text: ' ',background: 'lightblue',},{ },{ },{ },{ },{ },
            {  text:'', style:'superheader',border: [true, true, true, false]}
          ],
          [
            { text: '  ', style: 'superheader',border: [true, false, true, false] },
            {text: '  ', style: 'superheader',border: [true, false, true, false] },
             {text: '  ', style: 'superheader',border: [true, false, true, false] },
            {text: '  ', style: 'superheader',border: [true, false, true, false] },
            {text: '  ', style: 'superheader',border: [true, false, true, false]},
            { text: 'Original Risk', style: 'superheader',colSpan: 3, fillColor:'#D3D3D3'},
            { text: ' ', style: 'superheader',colSpan:5,border: [true, true, true, false], fillColor:'#D3D3D3'},
            { },
            {text: '  ', style: 'superheader',border: [true, false, true, false],fillColor:'#D3D3D3' }, 
            { text:'', style:'superheader',border: [true, false, true, false] ,fillColor:'#D3D3D3'},
            {  text:'', style:'superheader',border: [true, false, false, false],fillColor:'#D3D3D3'},
            {  text:'', style:'superheader',border: [false, false, false, false],fillColor:'#D3D3D3'},
            {  text:'', style:'superheader',border: [false, false, false, false],fillColor:'#D3D3D3'},
            {  text:'', style:'superheader',border: [false, false, false, false],fillColor:'#D3D3D3'},
            { text:'', style:'superheader',border: [true, false, false, false] ,fillColor:'#D3D3D3'},
            { text:'', style:'superheader',border: [true, false, false, false] ,fillColor:'#D3D3D3'},
            {  text:'Mitigation Plan', style:'superheader',border: [true, false, true, false]}
          ],
          [
            {text:'Risk #', style: 'superheader',border: [true, false, true, false]   },
            {text:'', style: 'superheader' ,border: [true, false, true, false] }, 
            {text:' ', style: 'superheader',border: [true, false, true, false] },
            { text: 'Risk Description', style: 'superheader',border: [true, false, false, false] },
            {text: 'Probability of Occurrence (P)\n(Scale 1 to 5)', style: 'superheader',border: [true, false, true, false] },
            { text:'impact on (Scale 1 to 5)',style:'superheader',colSpan: 3,fillColor:'#D3D3D3' },
            {},{},
            { text:'Overall Impact',style:'superheader' ,border: [true, false, true, true],fillColor:'#D3D3D3'}, 
            { text:'Risk No',style:'superheader',border: [true, false, true, true] ,fillColor:'#D3D3D3'},
            { text:'Mitigated Risk ', style:'superheader', colSpan: 4,border: [true, false, true, true],fillColor:'#D3D3D3'},
            { },
            { },
            { },
            { text:'Overall Impact',style:'superheader' ,border: [true, false, true, true],fillColor:'#D3D3D3'},
            {text:'Risk No', style:'superheader',border: [true, false, true, true],fillColor:'#D3D3D3' },
            { text:' ', style:'superheader',border: [true, false, true, true],fillColor:'#D3D3D3'}

          ],
          [
            {text:'', style: 'superheader',border: [true, false, true, true] },
            { text:'', style: 'superheader',border: [true, false, true, true] }, 
            { text:'', style: 'superheader',border: [true, false, true, true] },
            { text:'', style: 'superheader',border: [true, false, true, true]},
            {  text:'', style: 'superheader',border: [true, false, true, true]},
            { image: rotatedTP, width: 30, height: 60,fillColor:'#D3D3D3'},
            {image: rotatedTIME,  width: 30, height: 60,fillColor:'#D3D3D3' },
            {image:rotatedCost,width: 30,height: 60 ,fillColor:'#D3D3D3'},
            {image:rotatedAvg,width: 30,height: 60,fillColor:'#D3D3D3'},
            {image:rotatedPxI,width: 30,height: 60,fillColor:'#D3D3D3'},
            {image:rotatedP,width: 30,height: 60,fillColor:'#D3D3D3'},
            { image: rotatedTP, width: 30, height: 60,fillColor:'#D3D3D3'},
            { image:rotatedTIME,width: 30,height: 60,fillColor:'#D3D3D3'},
            {image:rotatedCost,width: 30,height: 60,fillColor:'#D3D3D3' },
            {image:rotatedAvg,width: 30,height: 60},
            {image:rotateResidualRisk,width: 30,height: 60 } ,
            { text: 'Mitigation Approach  ', style: 'superheader'},
            ],
]
       
      },
      margin: [0, 20, 0, 15],
    }];
    riskregmitmergeList.forEach((item, index) => {
      if (item && Object.keys(item).length > 0) {
        firstTable[0].table.body.push([
          { text: (index + 1).toString(), style: 'normal', alignment: 'center' }, 
          { },
          { },
          { text: item.riskDescription || '-', style: 'normal', alignment: 'left' },
          { text: item.probability || '-', style: 'normal', alignment: 'center' },
          { text: item.technicalPerformance || '-', style: 'normal', alignment: 'center',fillColor:'#D3D3D3' },
          { text: item.time || '-', style: 'normal', alignment: 'center',fillColor:'#D3D3D3' },
          { text: item.cost || '-', style: 'normal', alignment: 'center',fillColor:'#D3D3D3' },
          { text: item.average || '-', style: 'normal', alignment: 'center',fillColor:'#D3D3D3' },
          {text: item.riskNo || '-', style: 'normal', alignment: 'center',fillColor: '#FFFF00' },
          {text: item.mitigationProbability || '-', style: 'normal', alignment: 'center',fillColor:'#D3D3D3' },
          {text: item.mitigationTp || '-', style: 'normal', alignment: 'center',fillColor:'#D3D3D3'}, 
          {text: item.mitigationTime || '-', style: 'normal', alignment: 'center',fillColor:'#D3D3D3'}, 
          {text: item.mitigationCost || '-', style: 'normal', alignment: 'center',fillColor:'#D3D3D3'},
          {text: item.mitigationAverage || '-', style: 'normal', alignment: 'center',fillColor:'#D3D3D3'},
          {text: item.mitigationRiskNo || '-', style: 'normal', alignment: 'center',   fillColor: '#90EE90'},
           {text: item.mitigationApproach || '-', style: 'normal', alignment: 'left'}
        ]);
      }
    });


    //const MyContent = [];
    const MyContent = firstTable;

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
                      text: `Risk management`,
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
