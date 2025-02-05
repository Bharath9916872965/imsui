import pdfMake from 'pdfmake/build/pdfmake';
import dayjs from 'dayjs';
import htmlToPdfmake from 'html-to-pdfmake';
import { getDrdoLogo, getLabDetails, getLogoImage,getDocTemplateAttributes } from 'services/qms.service';
import { getAttachPdfList } from 'services/audit.service';

const AuditClosure = async (iqaNo, iqaFromDate, iqaToDate, closureDate, element) => {

    const labDetails = await getLabDetails();
    const logoImg = await getLogoImage();
    const drdoLogo = await getDrdoLogo();
    const DocTemplateAttributes = await  getDocTemplateAttributes();
    const formattedFromDate = dayjs(iqaFromDate).format('DD-MMM YYYY'); // Converts to 17-Mar 2024
    const formattedToDate = dayjs(iqaToDate).format('DD-MMM YYYY');
    const formattedClosureDate = dayjs(closureDate).format('DD-MM YYYY');
    const  attachmentList = await getAttachPdfList(element.iqaId,iqaNo); 
    const setImagesWidth = (htmlString, width) => {
      const container = document.createElement('div');
      container.innerHTML = htmlString;
      const images = container.querySelectorAll('img');
      images.forEach(img => {
        img.style.width = `${width}px`;
        img.style.textAlign = 'center';
      });
    
      const textElements = container.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div, td, th, table, v, figure, hr, ul, li');
      textElements.forEach(element => {
        if (element.style) {
         
          element.style.fontFamily = '';
          element.style.margin = '';
          element.style.marginTop = '';
          element.style.marginRight = '';
          element.style.marginBottom = '';
          element.style.marginLeft = '';
          element.style.lineHeight = '';
          element.style.height = '';
          element.style.width = '';
          element.style.padding = '';
          element.style.paddingTop = '';
          element.style.paddingRight = '';
          element.style.paddingBottom = '';
          element.style.paddingLeft = '';
          element.style.fontSize = '';
          element.style.cssText='';
          element.id='';
         
          const elementColor = element.style.color;
          if (elementColor && elementColor.startsWith("var")) {
              element.style.color = 'black';
          }
  
          const elementbackgroundColor = element.style.backgroundColor;
          if (elementbackgroundColor && elementbackgroundColor.startsWith("var")) {
              element.style.backgroundColor = 'white';
          }
  
          const elementFontWeight = element.style.fontWeight; 
          if (elementFontWeight && elementFontWeight.startsWith("var")) {
              element.style.fontWeight = '';  
          }
        }
  
        
      });
    
      const tables = container.querySelectorAll('table');
      tables.forEach(table => {
        if (table.style) {
          table.style="";
          table.style.borderCollapse = 'collapse';
          table.style.width = '100%';
        }
    
        const cells = table.querySelectorAll('tr ,th, td');
        cells.forEach(cell => {
          if (cell.style) {
            cell.style="";
            cell.style.border = '1px solid black';
            if (cell.tagName.toLowerCase() === 'th') {
              cell.style.textAlign = 'center';
            }
          }
        });
      });
    
      return container.innerHTML.replace(/<v:[^>]*>[\s\S]*?<\/v:[^>]*>/gi, '');
    };
  
  

    const ClosureDatevalues = {
      style: 'tableExample',
      table: {  widths: [250, 250],
        body: [
          [
            { stack: [{ text: 'Closure Date ' + formattedClosureDate, style: 'superheader' }],
            },{},
          ],
        ],
      },
      layout: 'noBorders',
      margin: [10, 30, 20, 15], // Reduced vertical margin for closer spacing
    };
    const allValues = [];
    var chaptercontent = element.remarks;
    
    if (element.remarks !== null && element.remarks !== 'null') {
        
      allValues.push({
        stack: [ (chaptercontent && chaptercontent !== 'null')  ? htmlToPdfmake(setImagesWidth(chaptercontent, 600))
            : '' 
        ],
        style: 'firstLvlContent',
      });
      
    } else {
      allValues.push(''); // or whatever fallback content you want
    }
    
   
    
    const MyContent = [];
    MyContent.push(ClosureDatevalues);
    MyContent.push(allValues);
    // Define the document structure and styles
    const docDefinition = {
      info: {
        title: `Audit Closure Print`,
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
                  image: logoImg
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
                      text: `Audit Closure`,
                      style: 'superheader',
                      fontSize: 14,
                      alignment: 'center',
                      margin: [0, 0, 0, 6],
                    },
                    {
                      text: `${iqaNo}${'\u00A0'.repeat(2)}:${'\u00A0'.repeat(2)}Audit Closure  (${formattedFromDate} - ${formattedToDate})`,
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
    //    footer: (currentPage, pageCount) => {
    //     const currentDate = getFormattedDate();

    //     return [
    //       {
    //         columns: [
    //         { text: 'Printed By VEDTS-IMS', alignment: 'left', fontSize: 10 },
    //         {
    //           text: `Printed On: ${currentDate}   ${"\u00A0".repeat(12)} Page: ${currentPage} of ${pageCount}`,
    //           alignment: 'right',
    //           fontSize: 10,
    //           margin: [0, 0, 2, 0],
    //         },
    //       ],
    //       margin: [40, 0, 40, 40],
    //     },
    //   ],
    // },
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
      firstLvlContent: {
        fontSize: DocTemplateAttributes.paraFontSize,
        margin: [15, 10, 0, 10],
        alignment: 'justify',
    },
    },
  };

  var base64pdfmakedata='';
  const pdfDocGenerator = pdfMake.createPdf(docDefinition);
     pdfDocGenerator.getBase64((data) => {
      base64pdfmakedata=data;
    var pdfdata="<iframe width='100%' height='100%' src='data:application/pdf;base64, " + encodeURI(data) + "'></iframe> <br>";
  let pdfWindow = window.open("")
  
   for(let i=0;i<attachmentList.length;i++){
     var fileExt = attachmentList[i][1].split('.').pop();
     if(fileExt==='pdf' || fileExt==='PDF'){
         var pdfResult = attachmentList[i][2];
         pdfdata=pdfdata+ "<iframe width='100%' height='100%' src='data:application/pdf;base64, " + encodeURI(pdfResult) + "'></iframe> <br>"
     }
   }
     pdfWindow.document.write(pdfdata);
   });

}

export default AuditClosure;
