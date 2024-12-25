import React, { useEffect, useState } from 'react';
import pdfMake from 'pdfmake/build/pdfmake';
import { getQmAllChapters, getDocSummarybyId, getDocTemplateAttributes, getLabDetails, getLogoImage, getAbbreviationsByIdNotReq, getQmRevistionRecordById, getDrdoLogo, getMocListById, getQmVersionRecordDtoList, revisionTran } from '../../../services/qms.service';
import htmlToPdfmake from 'html-to-pdfmake';
import { getEmployeesList } from 'services/header.service';
import { format } from 'date-fns';

const QmDocPrint = ({ action, revisionElements, buttonType }) => {
  const [error, setError] = useState(null);
  const [triggerEffect, setTriggerEffect] = useState(false);
  const [today, setToday] = useState(new Date());
  const [DocTemplateAttributes, setDocTemplateAttributes] = useState([]);
  const [labDetails, setLabDetails] = useState([]);
  const [logoimage, setLogoimage] = useState(null);
  const [drdoLogo, setDrdoLogo] = useState(null);
  const [AllChaptersList, setAllChaptersList] = useState([]);
  const [DocumentSummaryDto, setDocumentSummaryDto] = useState(null);
  const [docAbbreviationsResponse, setDocAbbreviationsResponse] = useState([]);
  const [docMoc, setDocMoc] = useState([]);
  const [ApprovedVersionReleaseList, setApprovedVersionReleaseList] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const [revisionRecordData, setRevisionRecordData] = useState([]);
  const [employeeDetails, setEmployeeDetails] = useState([]);
  const [qmRevisionRecordList, setQmRevisionRecordList] = useState([]);
  const [qmTransactionList, setQmTransactionList] = useState([]);



  useEffect(() => {

    const fetchData = async () => {
      try {
        const revision = await getQmRevistionRecordById(revisionElements.revisionRecordId);
        setRevisionRecordData(revision);
        Promise.all([getLabDetails(), getLogoImage(), getDrdoLogo(), getAbbreviationsByIdNotReq(revision.abbreviationIdNotReq), getMocListById(revisionElements.revisionRecordId), getQmAllChapters(), getDocSummarybyId(revisionElements.revisionRecordId), getDocTemplateAttributes(), getEmployeesList(), getQmVersionRecordDtoList(), revisionTran(revisionElements.revisionRecordId)]).then(([labDetails, logoimage, drdoLogo, docAbbreviationsResponse, docMoc, allChaptersLists, DocumentSummaryDto, DocTemplateAttributes, employeeData, qmRevisionData, qmTransactionData]) => {
          setLabDetails(labDetails);
          setLogoimage(logoimage);
          setDrdoLogo(drdoLogo);
          setDocAbbreviationsResponse(docAbbreviationsResponse);
          setDocMoc(docMoc);
          setAllChaptersList(allChaptersLists);
          setDocumentSummaryDto(DocumentSummaryDto);
          setDocTemplateAttributes(DocTemplateAttributes);
          setEmployeeDetails(employeeData);
          setQmRevisionRecordList(qmRevisionData);
          setQmTransactionList(qmTransactionData);
          setIsReady(true);
        });
      } catch (error) {
        console.error('Error in useEffect : ' , error);
      }
      
      
    }
    fetchData();
    // if (isReady && triggerEffect) {
    //   setTriggerEffect(false);
    //   setIsReady(false);
    //   handlePdfGeneration();
    // }
  }, [triggerEffect]);



  const changeTriggerEffect = () => {
    setTriggerEffect(true);
    setIsReady(false);
  }

  useEffect(() => {
    if (isReady && triggerEffect) {
      setTriggerEffect(false);
      setIsReady(false);
      handlePdfGeneration();
    }
  }, [isReady]);




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
        element.id = '';

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

  function splitTextIntoLines(text, maxLength) {
    const lines = [];
      let currentLine = '';

    for (const word of text.split(' ')) {
        if ((currentLine + word).length > maxLength) {
            lines.push(currentLine.trim());
            currentLine = word + ' ';
        } else {
          currentLine += word + ' ';
        }
    }
      lines.push(currentLine.trim());
      return lines;
}

// Generate rotated text image with line-wrapped text
function generateRotatedTextImage(text) {
    const maxLength = 260;
    const lines = splitTextIntoLines(text, maxLength);
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions based on anticipated text size and rotation
    canvas.width = 200;
    canvas.height = 1560;
    
    // Set text styling
    ctx.font = '14px Roboto';
    ctx.fillStyle = 'rgba(128, 128, 128, 1)'; // Gray color for watermark
    
    // Position and rotate canvas
    ctx.translate(80, 1480); // Adjust position as needed
    ctx.rotate(-Math.PI / 2); // Rotate 270 degrees
    
    // Draw each line with a fixed vertical gap
    const lineHeight = 20; // Adjust line height if needed
    lines.forEach((line, index) => {
      ctx.fillText(line, 0, index * lineHeight); // Position each line below the previous
    });
    
    return canvas.toDataURL();
}
  


  const handlePdfGeneration = () => {
    // setRefresh(true);
    const todayMonth = today.toLocaleString('en-US', { month: 'short' }).substring(0, 3);
    var allValues = [];


    let mainList = AllChaptersList.filter(chapter => {
      return chapter.chapterParentId === 0
    });

    for (let i = 0; i < mainList.length; i++) {
      var copyArray = { ...mainList[i] };
      // copyArray.unshift((i + 1) + '.');
      copyArray = { ...copyArray, chapterNumber: (i + 1) + '.' };
      // copyArray.chapterContent = setImagesWidth(copyArray.chapterContent, 450);
      allValues.push({ text: [copyArray.chapterNumber, ' ', copyArray.chapterName], style: 'mainChaper', tocItem: true, pageBreak: 'before', pageOrientation: 'portrait' }, { stack: [(copyArray.chapterContent !== null && copyArray.chapterContent !== 'null') ? htmlToPdfmake(setImagesWidth(copyArray.chapterContent, 600)) : ''], style: 'chaperContent' });

      let firstLvlList = AllChaptersList.filter(chapter => {
        return chapter.chapterParentId === mainList[i].chapterId
      })

      for (let j = 0; j < firstLvlList.length; j++) {
        var copyArray = {...firstLvlList[j]};
        // copyArray.unshift((i + 1) + '.' + (j + 1) + '.');
        copyArray = { ...copyArray, chapterNumber: (i + 1) + '.' + (j + 1) + '.' };

        var chaptercontent = copyArray.chapterContent != null ? copyArray.chapterContent : '';


        allValues.push({ text: [copyArray.chapterNumber, ' ', copyArray.chapterName], style: 'firstLvlChapers', tocItem: true, tocMargin: [15, 0, 0, 0], }, { stack: [(copyArray.chapterContent !== null && copyArray.chapterContent !== 'null') ? htmlToPdfmake(setImagesWidth(chaptercontent, 600)) : ''], style: 'firstLvlContent' });
        // }


        // ---adiing page break
        if(copyArray.isPagebreakAfter+'' === 'Y'){
          if((j==0) || (j>0) && firstLvlList[j-1].isLandscape+'' === 'N') {
            const val = allValues[allValues.length-2]={ text: [copyArray.chapterNumber, ' ', copyArray.chapterName], style: 'firstLvlChapers', tocItem: true, tocMargin: [15, 0, 0, 0], pageBreak: 'before' };
          }

          if((j+1<firstLvlList.length) && firstLvlList[j+1].isPagebreakAfter+'' === 'N') {
            const val2 = allValues[allValues.length-1]={ stack: [(copyArray.chapterContent !== null && copyArray.chapterContent !== 'null') ? htmlToPdfmake(setImagesWidth(chaptercontent, 600)) : ''], style: 'firstLvlContent', pageBreak: 'after' };
          }
        }

        // ---adding landscape page
        if(copyArray.isLandscape +'' === 'Y' ){
          const val = allValues[allValues.length-2]={ text: [copyArray.chapterNumber, ' ', copyArray.chapterName], style: 'firstLvlChapers', tocItem: true, tocMargin: [15, 0, 0, 0], pageOrientation: 'landscape', pageBreak: 'before' };
          if((j+1<firstLvlList.length) && firstLvlList[j+1].isLandscape+'' === 'N') {
            const val2 = allValues[allValues.length-1]={ stack: [(copyArray.chapterContent !== null && copyArray.chapterContent !== 'null') ? htmlToPdfmake(setImagesWidth(chaptercontent, 600)) : ''], style: 'firstLvlContent', pageOrientation: 'portrait', pageBreak: 'after' };
          } else {
            const val2 = allValues[allValues.length-1]={ stack: [(copyArray.chapterContent !== null && copyArray.chapterContent !== 'null') ? htmlToPdfmake(setImagesWidth(chaptercontent, 600)) : ''], style: 'firstLvlContent', pageOrientation: 'portrait',  };
          }
        } else if (allValues.length>3 && allValues[allValues.length-4].pageOrientation === 'landscape') {
          const val = allValues[allValues.length-2]={ text: [copyArray.chapterNumber, ' ', copyArray.chapterName], style: 'firstLvlChapers', tocItem: true, tocMargin: [15, 0, 0, 0], pageOrientation: 'portrait', pageBreak: 'before' };
        }


        let secondLvlList = AllChaptersList.filter(chapter => {
          return chapter.chapterParentId === firstLvlList[j].chapterId
        })

        for (let k = 0; k < secondLvlList.length; k++) {
          var copyArray = {...secondLvlList[k]};
          // copyArray.unshift((i + 1) + '.' + (j + 1) + '.' + (k + 1) + '.');
          copyArray = { ...copyArray, chapterNumber: (i + 1) + '.' + (j + 1) + '.' + (k + 1) + '.' };
          allValues.push({ text: [copyArray.chapterNumber, ' ', copyArray.chapterName], style: 'secondLvlChapers', tocItem: true, tocMargin: [30, 0, 0, 0], }, { stack: [(copyArray.chapterContent !== null && copyArray.chapterContent !== 'null') ? htmlToPdfmake(setImagesWidth(copyArray.chapterContent, 600)) : ''], style: 'secondLvlContent' });


          // ---adiing page break
          if(copyArray.isPagebreakAfter+'' === 'Y'){
            if((k==0) || (k>0) && secondLvlList[k-1].isLandscape+'' === 'N') {
              const val = allValues[allValues.length-2]={ text: [copyArray.chapterNumber, ' ', copyArray.chapterName], style: 'secondLvlChapers', tocItem: true, tocMargin: [30, 0, 0, 0], pageBreak: 'before' };
            }

            if((k+1<secondLvlList.length) && secondLvlList[k+1].isPagebreakAfter+'' === 'N') {
              const val2 = allValues[allValues.length-1]={ stack: [(copyArray.chapterContent !== null && copyArray.chapterContent !== 'null') ? htmlToPdfmake(setImagesWidth(copyArray.chapterContent, 600)) : ''], style: 'secondLvlContent', pageBreak: 'after' };
            }
          }

          // ---adding landscape page
          if(copyArray.isLandscape +'' === 'Y'){
            const val = allValues[allValues.length-2]={ text: [copyArray.chapterNumber, ' ', copyArray.chapterName], style: 'secondLvlChapers', tocItem: true, tocMargin: [30, 0, 0, 0] , pageOrientation: 'landscape', pageBreak: 'before' };
            if((k+1<secondLvlList.length) && secondLvlList[k+1].isLandscape+'' === 'N') {
              const val2 = allValues[allValues.length-1]={ stack: [(copyArray.chapterContent !== null && copyArray.chapterContent !== 'null') ? htmlToPdfmake(setImagesWidth(copyArray.chapterContent, 600)) : ''], style: 'secondLvlContent', pageOrientation: 'portrait', pageBreak: 'after' };
            } else {
              const val2 = allValues[allValues.length-1]={ stack: [(copyArray.chapterContent !== null && copyArray.chapterContent !== 'null') ? htmlToPdfmake(setImagesWidth(copyArray.chapterContent, 600)) : ''], style: 'secondLvlContent', pageOrientation: 'portrait',  };
            }
          }

        }

      }
    }


    // ----------revision table start----------------
    var header1 = [
      { rowSpan: 2, text: 'Version', style: 'tableLabel' },
      { rowSpan: 2, text: 'Nature/Details of Revision', style: 'tableLabel' },
      { colSpan: 2, text: 'Issue/Revision Number', style: 'tableLabel' }, {},
      { rowSpan: 2, text: 'Issue date', style: 'tableLabel' },
      { rowSpan: 2, text: 'Reference No. Approval', style: 'tableLabel' }
    ];

    var header2 = [
      {},
      {},
      { text: 'From', style: 'tableLabel' },
      { text: 'To', style: 'tableLabel' },
      {},
      {}
    ];

    var DocVersionRelease = [];
    DocVersionRelease.push(header1);
    DocVersionRelease.push(header2);

    const latestRevisionData = [...qmRevisionRecordList].sort(
      (a, b) => a.revisionRecordId - b.revisionRecordId
    );
    console.log("latestRevisionData", latestRevisionData);
    for (let i = 0; i < latestRevisionData.length; i++) {
    var value = [
      { text: latestRevisionData[i].revisionNo, style: 'tdData', alignment: 'center' },
      { text: latestRevisionData[i].description, style: 'tdData' },
      { text: i > 0 ? 'I' + latestRevisionData[i - 1].issueNo + '-R' + latestRevisionData[i - 1].revisionNo : '--', style: 'tdData', alignment: 'center', },
      { text: 'I' + latestRevisionData[i].issueNo + '-R' + latestRevisionData[i].revisionNo, style: 'tdData', alignment: 'center', },
      { text: format(new Date(latestRevisionData[i].dateOfRevision), 'dd-MM-yyyy') || '-', alignment: 'center', style: 'tdData' },
      { text: 'I' + latestRevisionData[i].issueNo + '-R' + latestRevisionData[i].revisionNo, style: 'tdData', alignment: 'center', },
    ];

      DocVersionRelease.push(value);
    }

    // ----------revision table start----------------

    // ----------Document summary table start----------------
    let dateTimeString1 = revisionElements.dateOfRevision.toString();


    // let parts1 = dateTimeString1.split(' ');

    // let datePart1 = parts1[0] + ' ' + ' ' + parts1[2];
    const date = new Date(dateTimeString1);

    const monthName = date.toLocaleString('default', { month: 'long' }); // "May"
    const year = date.getFullYear();
    let datePart1 = monthName + ' ' + ' ' + year;

    let approvedBy = '';
    let reviewedBy = '';
    let initiatedBy = '';
    let approvedDate = '';
    let reviewedDate = '';
    let initiatedDate = '';
    
    function getEmployeeDetails(empId) {
        const data = employeeDetails.find(e => e.empId === empId);
        if (data) {
            const titleOrSalutation = data.title ?? data.salutation ?? '';
            return `${titleOrSalutation}${data.empName}, ${data.empDesigName}`;
        }
        return '';
    }

    function getQmTransaction(empId,status) {
      const data = qmTransactionList.find(e => e.empId === empId && e.statusCode === status);
      if (data) {
          return `${data.transactionDate}`;
      }
      return '';
   }

   const qmFormatDate = (date) => {
    if (!date || isNaN(new Date(date).getTime())) {
      return '';
    }
    const options = {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };
    return new Intl.DateTimeFormat('en-GB', options).format(new Date(date));
  };
    
    if (revisionRecordData.approvedBy) {
        approvedBy = getEmployeeDetails(revisionRecordData.approvedBy);
        approvedDate = getQmTransaction(revisionRecordData.approvedBy,'APD');
    }
    if (revisionRecordData.reviewedBy) {
        reviewedBy = getEmployeeDetails(revisionRecordData.reviewedBy);
        reviewedDate = getQmTransaction(revisionRecordData.reviewedBy,'RWD');
    }
    if (revisionRecordData.initiatedBy) {
        initiatedBy = getEmployeeDetails(revisionRecordData.initiatedBy);
        initiatedDate = getQmTransaction(revisionRecordData.initiatedBy,'FWD');
    }

    var docSummary = [];

    docSummary.push([{stack :[{text: [{text  : ' 1. Title : ' , style  : ' tableLabel'}, {text  : ' ISO 9001 :2001, Quality Manual of '+labDetails.labCode}]}], colSpan :2}, {}])
    docSummary.push([{stack :[{text: [{text  : ' 2. Type of report : ' , style  : ' tableLabel'}, {text  : ' QMS'}]}]}, {stack :[{text: [{text  : ' 3. Classification : ' , style  : ' tableLabel'}, {text  : ' RESTRICTED'}]}]}])
    docSummary.push([{stack :[{text: [{text  : ' 4. '+labDetails.labCode+' Document Number : ' , style  : ' tableLabel'}, {text : labDetails.labCode+'/QMS/QM/'+'I' + revisionElements.issueNo + '-R' + revisionElements.revisionNo}]}]}, {stack :[{text: [{text  : ' 5. Project Document Number: ', style  : ' tableLabel'}, {text  : ' NA'}]}]}])
    docSummary.push([{stack :[{text: [{text  : ' 6. Month and Year : ' , style  : ' tableLabel'}, {text : datePart1}]}], colSpan :2}, {}])
    docSummary.push([{stack :[{text: [{text  : ' 8. Additional Information : ' , style  : ' tableLabel'}, {text : DocumentSummaryDto !== null && DocumentSummaryDto !== undefined && DocumentSummaryDto.additionalInfo !== null && DocumentSummaryDto.additionalInfo !== undefined ? DocumentSummaryDto.additionalInfo: ''}]}], colSpan :2}, {}])
    docSummary.push([{stack :[{text: [{text  : ' 9. Project  Number & Project Name: ', style  : ' tableLabel'}, {text : 'Quality Management System of '+labDetails.labCode}]}], colSpan :2}, {}])
    docSummary.push([{stack :[{text: [{text  : ' 10. Abstract : ' , style  : ' tableLabel'}, {text :  DocumentSummaryDto !== null && DocumentSummaryDto !== undefined && DocumentSummaryDto.abstract !== null && DocumentSummaryDto.abstract !== undefined ? DocumentSummaryDto.abstract: ''}]}], colSpan :2}, {}])
    docSummary.push([{stack :[{text: [{text  : ' 11. Keywords : ' , style  : ' tableLabel'}, {text : DocumentSummaryDto !== null && DocumentSummaryDto !== undefined && DocumentSummaryDto.keywords !== null && DocumentSummaryDto.keywords !== undefined ? DocumentSummaryDto.keywords: ''}]}], colSpan :2}, {}])
    docSummary.push([{stack :[{text: [{text  : ' 12. Organization and address : ' , style  : ' tableLabel'}, {text : labDetails.labName + ' (' + labDetails.labCode + '), '+'Government of India, Ministry of Defence ' + 'Defence Research Development Organization '+labDetails[4] + ', ' + labDetails[5] + ' PIN-' + labDetails[6]}]}], colSpan :2}, {}])
    docSummary.push([{stack :[{text: [{text  : ' 13. Distribution : ' , style  : ' tableLabel'}, {text : DocumentSummaryDto !== null && DocumentSummaryDto !== undefined && DocumentSummaryDto.distribution !== null && DocumentSummaryDto.distribution !== undefined ? DocumentSummaryDto.distribution: ''}]}], colSpan :2}, {}])
    docSummary.push([{stack :[{text: [{text  : ' 14. Revision : ' , style  : ' tableLabel'}, {text : 'Issue ' + revisionElements.issueNo + '-Rev ' + revisionElements.revisionNo}]}], colSpan :2}, {}])
    docSummary.push([{stack: [{ text: '15. Prepared by: ', style: 'tableLabel', alignment: 'left' },{text: initiatedBy, style: 'tableName', alignment: 'center', margin: [0, 5, 0, 0]},{text: qmFormatDate(initiatedDate), color: 'blue', alignment: 'center'}], colSpan: 2}, {}]);
    docSummary.push([{stack: [{ text: '16. Reviewed by: ', style: 'tableLabel', alignment: 'left' },{text: reviewedBy, style: 'tableName', alignment: 'center', margin: [0, 5, 0, 0]},{ text: qmFormatDate(reviewedDate), color: 'blue', alignment: 'center' }],colSpan: 2},{}]);
    docSummary.push([{stack: [{ text: '17. Approved by: ', style: 'tableLabel', alignment: 'left' },{text: approvedBy, style: 'tableName', alignment: 'center', margin: [0, 5, 0, 0]},{text: qmFormatDate(approvedDate), color: 'blue', alignment: 'center'}], colSpan: 2},{}]);
     

    // ----------Document summary table end----------------



    // ----------Document Abbreviation table start----------------
    let docAbbreviations = [];
    docAbbreviations.push([{ text: 'SN', style: 'tableLabel', alignment: 'center' }, { text: 'Abbreviation ', style: 'tableLabel', alignment: 'center' }, { text: 'Expansion', style: 'tableLabel', alignment: 'center' }])
    for (let i = 0; i < docAbbreviationsResponse.length; i++) {
      docAbbreviations.push([{ text: (i + 1), style: 'tdData', alignment: 'center' }, { text: docAbbreviationsResponse[i].abbreviation, style: 'tdData', alignment: 'center' }, { text: docAbbreviationsResponse[i].meaning, style: 'tdData' }])
    }

    // ----------Document Abbreviation table end----------------


    let docMappingOfClasses = [];
    docMappingOfClasses.push([{ text: 'QM Section No. ', style: 'tableLabel', alignment: 'center' }, { text: 'ISO 9001:2015 Clause. No.', style: 'tableLabel', alignment: 'center' }, { text: 'Description', style: 'tableLabel', alignment: 'center' }])
    for (let i = 0; i < docMoc.length; i++) {
      docMappingOfClasses.push([{ text: docMoc[i][0] }, { text: docMoc[i][1] }, { text: docMoc[i][2] }])
    }


    let docDefinition = {
      info: {
        title: "Quality Manual Print",
      },
      pageSize: 'A4',
      pageOrientation: 'portrait',
      pageMargins: [50, 50, 40, 40],
      header: function (currentPage) {
        return {
            stack: [
                
                {
                    columns: [
                        {
                            // Left: Lab logo
                            image: JSON.stringify(logoimage) == 'null' ? "data:image/png;base64," + 'iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAA1BMVEX///+nxBvIAAAASElEQVR4nO3BgQAAAADDoPlTX+AIVQEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwDcaiAAFXD1ujAAAAAElFTkSuQmCC'
                                        : "data:image/png;base64," + JSON.stringify(logoimage),
                            width: 30,
                            height: 30,
                            alignment: 'left',
                            margin: [35, 10, 0, 10]
                        },
                        { text: 'RESTRICTED', style: 'headerrNote', margin: [0, 10, 0, 0] },
                        {
                            // Right: DRDO logo
                            image: JSON.stringify(drdoLogo) == 'null' ? "data:image/png;base64," + 'iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAA1BMVEX///+nxBvIAAAASElEQVR4nO3BgQAAAADDoPlTX+AIVQEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwDcaiAAFXD1ujAAAAAElFTkSuQmCC'
                            : "data:image/png;base64," + JSON.stringify(drdoLogo),
                            width: 30,
                            height: 30,
                            alignment: 'right',
                            margin: [0, 10, 20, 10]
                        }
                    ]
                },
                
            ]
        };
    },
      footer: function (currentPage, pageCount) {
        if (currentPage >= 2) {
          return {
            // style: [alignment : ' '],
            alignment: 'center',
            margin: [0, 15, 0, 10],
            stack: [{
              columns: [

                { text: labDetails.labCode+'/QMS/QM/'+'I' + revisionElements.issueNo + '-R' + revisionElements.revisionNo, fontSize : 9 },
                { text: 'RESTRICTED', style: 'footerNote', },
                {
                  text: "Page " + currentPage.toString() + ' of ' + pageCount, margin: [45, 0, 0, 0], fontSize : 9
                },
              ]
            },
            // { text: 'The information given in this document is not to be published or communicated, either directly or indirectly, to the press or to any personnel not authorized to receive it.', style: 'footertext' },
            ]

          }
        } else {
          return {

            alignment: 'center',
            margin: [0, 15, 0, 10],
            stack: [{
              columns: [
                // { text: today.getFullYear() + '/' + labDetails.labCode + '/MQAP/', fontSize : 9 },
                {},
                { text: 'RESTRICTED', style: 'footerNote', },
                {
                },
              ]
            },
            // { text: 'The information given in this document is not to be published or communicated, either directly or indirectly, to the press or to any personnel not authorized to receive it.', style: 'footertext' },
            ]

          };
        }
      },

      watermark: { text: revisionRecordData.statusCode === 'APD' ? '' : 'DRAFT', opacity: 0.1, bold: true, italics: false, fontSize: 150,  },

      background: function (currentPage) {
        return [
          {
            image: generateRotatedTextImage((DocTemplateAttributes?.restrictionOnUse ?? '')),
            width: 100, // Adjust as necessary for your content
            absolutePosition: { x: -10, y: 50 }, // Position as needed
          }
        ];
      },

      // defaultStyle,

      content: [
        // {

        //   text: 'RESTRICTED', style: 'firstRestricted', alignment: 'center',
        // },
        {
          columns: [
            {
              style: 'tableExample',
              table: {
                widths: [255],
                body: [
                  [
                    {
                      stack: [
                        { text: 'RESTRICTED', style: 'superheader', },
                        { text: 'The information given in this document is not to be published or communicated, either directly or indirectly, to the press or to any personnel not authorized to receive it.', style: 'normal' },
                      ]
                    }

                  ],]
              },

            },
            {
              text: labDetails.labCode + ' : ....................', margin: [30, 0, 0, 0], bold: true,
            },
          ]
        },
        {
          text: 'Quality Manual (QM)', style: 'DocumentName', alignment: 'center',
        },
        // {
        //   text: '(Quality Assurance, Qualification & Acceptance Test Conditions/Plan, Reliability and Test Report Formats)', style: 'DocumentSubName', alignment: 'center',
        // },
        {
          image: JSON.stringify(logoimage) == 'null' ? "data:image/png;base64," + 'iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAA1BMVEX///+nxBvIAAAASElEQVR4nO3BgQAAAADDoPlTX+AIVQEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwDcaiAAFXD1ujAAAAAElFTkSuQmCC'
            : "data:image/png;base64," + JSON.stringify(logoimage),
          width: 95, height: 95,
          alignment: 'center'
        },
        {
          text: labDetails.labName + ' (' + labDetails.labCode + ') ', style: 'LabAdress', margin: [0, 75, 0, 5], alignment: 'center', fontSize: 15
        },
        {
          text: 'Government of India, Ministry of Defence \n' + 'Defence Research & Development Organization', alignment: 'center', bold: true, fontSize: 12
        },
        {
          text: labDetails.labAddress + ', ' + labDetails.labCity + ' - ' + labDetails.labPin, style: 'LabAdressPin', alignment: 'center',
        },
        {
          text: todayMonth + '-' + today.getFullYear(), style: 'LabAdress', alignment: 'right', margin: [0, 200, 0, 0], pageBreak: 'after'
        },
        {
          text: 'RECORD OF AMENDMENTS', bold: true, alignment: 'center', fontSize: 14, margin: [0, 10, 0, 10]
        },
        {
          table: {
            headerRows: 2,
            widths: ['auto', 'auto', 30, 30, 'auto', 'auto'],
            body: DocVersionRelease
          },
          pageBreak: 'after'
        },
        {
          text: 'DOCUMENT SUMMARY', bold: true, alignment: 'center', fontSize: 14, margin: [0, 10, 0, 10]
        },
        {
          table: {
            widths: [ 260, 250],
            heights: [40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40],
            body: docSummary
          },
          pageBreak: 'after'
        },
        // {
        //   text: 'APPROVAL PAGE', bold: true, alignment: 'center', fontSize: 14, margin: [0, 10, 0, 10], pageBreak: 'after'
        // },
        // {
        //   table: {
        //     widths: [100, 'auto', 120, 130],
        //     heights: [40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 30, 50, 50],
        //     body: approvalpage
        //   },
        //   pageBreak: 'after'
        // },
        {
          text: 'MAPPING OF CLAUSES', bold: true, alignment: 'center', fontSize: 14, margin: [0, 10, 0, 10]
        },
        {
          table: {
            widths: [100,100,290],
            body: docMappingOfClasses
          },
          pageBreak: 'after'
        },
        {
          text: 'LIST OF ABBREVIATIONS', bold: true, alignment: 'center', fontSize: 14, margin: [0, 10, 0, 10]
        },
        {
          table: {
            widths: [30, 120, 320],
            body: docAbbreviations
          },
          pageBreak: 'after'
        },
        {
          toc: {
            title: { text: 'TABLE OF CONTENTS', style: 'header', bold: true, alignment: 'center', fontSize: 14, margin: [0, 10, 0, 10] },
            numberStyle: { bold: true },
          },
          // pageBreak: 'after'

        },
        allValues,
      ],

      layouts: {
        noBorders: {
          defaultBorder: false
        }
      },


      styles: {
        tableExample: {
            margin: [35, 5, 0, 70],
            // alignment: 'center',
        },
        superheader: {
            fontSize: 11, bold: true,
            decoration: 'underline',
        },

        firstRestricted: {
            fontSize: 8,
            decoration: 'underline',
            margin: [0, 0, 0, 30]

        },
        DocumentName: {
            fontSize: 18,
            margin: [0, 30, 0, 35],
            bold: true,
            color: '#1660B2'
        },
        DocumentSubName: {
            fontSize: 17,
            margin: [0, 0, 0, 50],
            bold: true,
            color: '#CA6951'
        },
        DocumentName2Page: {
            fontSize: 25,
            margin: [0, 30, 0, 50],
            bold: true,
            color: '#1660B2'
        },
        LabAdress: {
            margin: [0, 30, 0, 0],
            width: [150],
            fontSize: 12,
            bold: true,
        },
        LabAdressPin: {
            width: [150],
            fontSize: 12,
            bold: true,
        },
        mainChaper: {
            fontSize: DocTemplateAttributes.headerFontSize,
            bold: true,
        },
        chaperContent: {
            fontSize: DocTemplateAttributes.paraFontSize,
            margin: [0, 10, 0, 10],
            alignment: 'justify',
        },
        firstLvlChapers: {
            fontSize: DocTemplateAttributes.subHeaderFontsize,
            bold: true,
            margin: [15, 10, 10, 0]
        },
        firstLvlContent: {
            fontSize: DocTemplateAttributes.paraFontSize,
            margin: [15, 10, 0, 10],
            alignment: 'justify',
        },
        firstLvlMoreColumContent: {
            fontSize: 5.5,
            margin: [0, 0, 0, 0],
            alignment: 'justify',
        },
        firstLv2MoreColumContent: {
            fontSize: 10,
            margin: [0, 0, 0, 0],
            alignment: 'justify',
        },

        secondLvlChapers: {
            fontSize: DocTemplateAttributes.superHeaderFontsize,
            bold: true,
            margin: [30, 10, 10, 0]
        },
        secondLvlContent: {
            fontSize: DocTemplateAttributes.paraFontSize,
            margin: [30, 10, 0, 10],
            alignment: 'justify',
        },
        tableLabel: {
            // color: '#0D509B',
            fontSize: 12,
            bold: true,
        },
        tdData: {
            fontSize: 12,
        },
        headerrNote: {
            fontSize: 7, bold: true,
            decoration: 'underline',
            alignment: 'center'
        },
        footerNote: {
            fontSize: 7, bold: true,
            decoration: 'underline',
            alignment: 'center'
        },
        footertext: {
            fontSize: 7,
        },
    },


    }

    if (action === 'download') {
      pdfMake.createPdf(docDefinition).download('Print.pdf');
    } else if (action === 'print') {
      pdfMake.createPdf(docDefinition).print();
    } else {
      pdfMake.createPdf(docDefinition).open();

    }
    //  };

  }

  if (buttonType==='Button') {
    return <button className='print' onClick={changeTriggerEffect}  >Print <i className="material-icons" style={{fontSize : "1.2em"}}  >print</i></button> ;
  }

  return (
    <button  className="icon-button print-icon-button" onClick={changeTriggerEffect} title="View"> <i className="material-icons"  >print</i></button>
  );
  
}

export default QmDocPrint;
