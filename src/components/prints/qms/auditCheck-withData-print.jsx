import pdfMake from 'pdfmake/build/pdfmake';
import { getDrdoLogo, getLabDetails, getLogoImage } from 'services/qms.service';
import { getMocTotalList,getObservation,getAuditCheckList,CheckListImgDto,getCheckListimg,
  } from "services/audit.service";
  import { format } from "date-fns";
const AuditCheckListWithDataPdf = async (data) => {

try {
        const chapters  = await getMocTotalList();
        const obsList   = await getObservation();
        const chList    = await getAuditCheckList(data.scheduleId);
        const imgSource = await getCheckListimg(data);
                let filChapters = [];
       if(chList.length === 0 ){
              filChapters = chapters.filter(data => data.isActive == 1 && data.isForCheckList == 'Y');
           }else{
            filChapters = chList;
           }
const auditObs =  obsList.map(item=>({
  auditObsId : item.auditObsId,
  label : item.observation
}));
const checkCont = (mocId, value) => {
  const row = filChapters.filter(data => data.mocParentId === mocId);
  if (row && row.length > 0) {
      const currentClause = row[0].clauseNo;
      const splitClause = currentClause.split('.');
      return value === Number(splitClause[splitClause.length - 2]);
  } else {
      return true;
  }
};
const filterMain =(list)=>{
  const result = [];
  //filter All Main Chapters
 // let setSections
  const sections = [...new Set(list.map(data =>data.sectionNo))];
 // setSections(sections)
 //console.log('sections pdf',sections);
  sections.forEach(section =>{
    const sectionItems = list.filter(item => item.sectionNo === section);
    let level1 = 0;
    let level2 = 0;
    let level3 = 0;
    let clause = '';
    let j = 0;
    let k = 0;
//loop each Main Chapter Content
    for(let i =0;i<sectionItems.length;i++){
//inserting Main Chapter
        if(i === 0){
          level1 = sectionItems[i].mocId
          result.push(sectionItems[i]);
        }
        //skip we are having conitinues sub Chapter
        if(i !== 0 && sectionItems[i].mocParentId === level1){
          level2 = sectionItems[i].mocId;
          j = 0;
          k = 0
        }else if(i !== 0 && sectionItems[i].mocParentId === level2){
          //in sub chapter continues miss adding like 8.5.1 after 8.5.5
          if(clause !== '' && j !== 0){
            const cn1 = clause.split('.');
            const cn2 = sectionItems[i].clauseNo.split('.');
            if(!((Number(cn1[cn1.length -1])+1) === Number(cn2[cn2.length -1]))){
             result.push(sectionItems[i]);
             k++;
            }else if(k > 0){
              //continueing adding subchapters after break
              result.push(sectionItems[i]);
            }
          }
          j++;
          clause = sectionItems[i].clauseNo;
          level3 = sectionItems[i].mocId
        }else if(i !== 0 && sectionItems[i].mocParentId !== level3){
          result.push(sectionItems[i]);
          level2 = sectionItems[i].mocId;
          j = 0;
          k = 0
        }
    }
  })
  return result;
}
filChapters.sort((a, b) => {
  const splitA = a.clauseNo.split('.').map(Number); 
  const splitB = b.clauseNo.split('.').map(Number);

  for (let i = 0; i < Math.max(splitA.length, splitB.length); i++) {
      const numA = splitA[i] || 0; 
      const numB = splitB[i] || 0;
      if (numA !== numB) {
          return numA - numB; 
      }
  }
   return 0; 
});
const mainChapter =  filterMain(filChapters)
//console.log('mainChapterpdf',mainChapter);
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
                      
        // Function to convert numbers to Roman numerals
// Function to convert numbers to Roman numerals
const toRoman = (num) => {
  const romanNumerals = [["M", 1000], ["CM", 900], ["D", 500], ["CD", 400], ["C", 100], ["XC", 90], ["L", 50], ["XL", 40], ["X", 10], ["IX", 9], ["V", 5], ["IV", 4], ["I", 1]];
  let result = "";
  for (const [roman, value] of romanNumerals) {
    while (num >= value) {
      result += roman;
      num -= value;
    }
  }
  return result;
};

// Function to convert index to a letter (a, b, c, ...)
const toLetter = (index) => {
  return String.fromCharCode(97 + index);  // 97 is ASCII for 'a'
};

// Process each chapter and its sub-chapters
const tables = mainChapter.map((chapter) => {
  let demo = []; // Initialize demo here to avoid retaining data across iterations
  let k = 0;
  let parentId = '';
  let alphabetCounter = 0; // Counter for alphabetical sub-sections
  // Loop through filChapters and apply Roman numerals and alphabets
  filChapters.forEach((chapter1) => {
    const filchmocParentId = Number(chapter1.mocParentId);  // mocParentId of the current chapter1
    const mainchmocId = Number(chapter.mocId);
    // Major section (Roman numerals)
    if (filchmocParentId === mainchmocId) {
      k++;
      alphabetCounter = 0; // Reset alphabet counter for each new Roman numeral section
      if (!demo.some(item => item.mocId === chapter1.mocId)) { // Avoid duplicate chapters
        // Push the first chapter with Roman numeral for clauseNo
        demo.push({
          ...chapter1,
          clauseNo: toRoman(k),  // Use Roman numeral for first chapter
        });
      }
      parentId = checkCont(chapter1.mocId, k) ? chapter1.mocId : '';
    }
    // Sub-sections (Alphabetical)
    if (Number(chapter1.mocParentId) === Number(parentId) && !demo.some(item => item.mocId === chapter1.mocId) && Number(chapter1.mocParentId) !== 0) {
      demo.push({
        ...chapter1,
        clauseNo: toLetter(alphabetCounter++) ,
            });
    }
  });

  // Map over demo to create subChapterRows with observations
  const subChapterRows = demo.map((lvl1, index) => {
    const observation = auditObs.find(obs => obs.auditObsId === lvl1.auditObsId)?.label || '';
    const isAlphabetic = /^[a-z]$/.test(lvl1.clauseNo) || /^[a-z]$/.test(lvl1.auditorRemarks) || /^[a-zA-Z]+$/.test(observation);
      // Check if it's the last row
    const isLastRow = index === demo.length - 1;
      // Define the border logic, ensuring the last row always gets a full border
    const border = isLastRow 
      ? [true, true, true, true]  // Full border for the last row, including the bottom
      : (isAlphabetic 
          ? [true, false, true, false]  // Alphabetic border for non-last rows
          : [true, true, true, false]);  // Default border for other rows
  
    return [
      { 
        text: `${lvl1.clauseNo}.   ${lvl1.description}`, 
        style: 'subheader',
        margin: isAlphabetic ? [22, 0, 0, 0] : [0, 0, 0, 0],
        border: border,  // Apply the computed border
        dontBreakRows: true,  // Prevent row from breaking across pages
      },
      {
        stack: [
          observation !== 'NA' && observation.trim() ? { text: ` ${observation}` } : null,
          lvl1.auditorRemarks !== 'NA' && lvl1.auditorRemarks.trim() ? { text: ` ${lvl1.auditorRemarks}` } : null,
        ].filter(Boolean),  // Filter out null values
        border: border,  // Apply the same border condition
        dontBreakRows: true,  // Prevent row from breaking across pages
      },
    ];
  });

  if (chapter.clauseNo === '8.3.1') {
    if (imgSource) {
          subChapterRows.push([
        {
          image: imgSource, // Replace with the actual image path or base64 data
          width: 380, // Adjust width as needed
          height: 350, // Adjust height as needed
          alignment: 'center', // Optional alignment
          colSpan: 2, // Span the image across both columns
        },
        {},
      ]);
    } else {
            subChapterRows.push([
        {
          text: 'Image Not Uploaded', // Placeholder text when the image is missing
          colSpan: 2, // Span the text across both columns
          alignment: 'center', // Optional alignment for the placeholder text
        },
        {},
      ]);
    }
  }
  
  const tableBody = [
    [
      { text: `Clause ${chapter.clauseNo}: ${chapter.description}`, style: 'superheader', colSpan: 2 },
      {},
    ],
    ...subChapterRows,
  ];
    // Table data to be returned
  const tableData = {
    style: 'tableExample',
    table: {
      widths: [250, 250],
      body: tableBody,
    },
    margin: [0, 10, 0, 15],
  };

  return tableData;
});
     const MyContent = [...tables];
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
          margin: [0, 0, 0, 1],    // Margin below the heading
        },
        ...MyContent, // Dynamically added tables here
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
                      text: 'ISO-9001:2015 Internal Quality Audit ' + (data.iqaNo ? data.iqaNo.split('-')[1] : ''),
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
                        {
                          text: 
                            (data.divisionName === '' ? '' : data.divisionName) +
                            (data.groupName === '' ? '' : ' ' + data.groupName) +
                            (data.projectName === '' ? '' : ' ' + data.projectName),
                          style: 'headerNames',
                          alignment: 'left',
                          border: [false, false, false, false],
                          fontSize: 9,
                          margin: [-50, 0, 0, 0],
                        },
                        
                        { text: '2.  Auditors Name:', style: 'headerNames', alignment: 'left', border: [false, false, false, false], fontSize: 9 },
                        { text: data.teamCode, style: 'headerNames', alignment: 'left', border: [false, false, false, false], fontSize: 9 ,margin: [-50, 0, 0, 0]},
                      ],
                      [
                        { text: '3.  Auditee Name:', style: 'headerNames', alignment: 'left', border: [false, false, false, false], fontSize: 9 },
                        { text: data.auditeeEmpName, style: 'headerNames', alignment: 'left', border: [false, false, false, false], fontSize: 9 ,margin: [-50, 0, 0, 0]},
                        { text: '4. IQA Report No:', style: 'headerNames', alignment: 'left', border: [false, false, false, false], fontSize: 9 },
                        { text: data.iqaNo  , style: 'superheader', alignment: 'left', border: [false, false, false, false], fontSize: 9 ,margin: [-50, 0, 0, 0]},
                      ],
                      [
                        { text: '5.  Audit scope:', style: 'headerNames', alignment: 'left', border: [false, false, false, false], fontSize: 9 },
                        {
                          text: data.scope.length > 50 
                            ? `${data.scope.substring(0, 40)}...`  // Show first 47 characters + ellipsis
                            : data.scope, // Show full text if length <= 50
                          style: 'headerNames',
                          alignment: 'left',
                          border: [false, false, false, false],
                          fontSize: 9,
                          margin: [-60, 0, 0, 0]
                        },
                        
                        { text: '6. Date:', style: 'headerNames', alignment: 'left', border: [false, false, false, false], fontSize: 9},
                        { text: format(new Date(data.scheduleDate),'dd-MM-yyyy HH:mm'), style: 'headerNames', alignment: 'left', border: [false, false, false, false], fontSize: 9,margin: [-90, 0, 0, 0] },
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
          margin: [60, 30, 30, 10], //[R,t,R,,B ]
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
            margin: [60, 60, 0, 10], // FOR FOOTER PADDING
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

export default AuditCheckListWithDataPdf;
