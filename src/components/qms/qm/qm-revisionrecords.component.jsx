import { useEffect, useState } from "react";
import { getQmVersionRecordDtoList } from "../../../services/qms.service";
import Datatable from "../../datatable/Datatable";

const QmRevisionRecordsComponent = () => {

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [versionRecordList, setVersionRecordList] = useState([]);
    const [versionRecordPrintList, setVersionRecordPrintList] = useState([]);


    // const { navigate, location } = router;

    useEffect(() => {
        const fetchData = async () => {
          try {
            const VersionRecorList = await getQmVersionRecordDtoList();
            console.log('response--', VersionRecorList)
          //   const mappedData = VersionRecorList.map((item, index) => ({
          //     sn: index + 1,
          //     docType: item.docType || '-',
          //     particulars: item.particulars || '-',
          //     // from: 'V' + item[5] + '-R' + item[6] || '-',
          //     from: index+1 < VersionRecorList.length ? 'V'+VersionRecorList[index+1].versionNo+'-R'+VersionRecorList[index+1].releaseNo : '--',
          //     to: 'V' + item.versionNo + '-R' + item.releaseNo || '-',
          //     issueDate: format(new Date(item.issueDate), 'dd-MM-yyyy') || '-',
          //     status: item.statusCode || '--',
          //     action: (
          //         <div>
          //             {!["APR", "APR-GDDQA", "APR-DGAQA"].includes(item.statusCode) && (
          //                 <>
          //                     <IconButton className="edit-icon" onClick={() => redirecttoQmDocument(item)} title="Edit"> <i className="material-icons"  >edit_note</i></IconButton>
          //                     {/* <IconButton className="edit-icon" onClick={()=>openQaqtDocsAddIssueDialog(item)} title="Amend"> <i className="material-icons"  >note_alt</i></IconButton> */}
          //                     <IconButton style={{ color: '#9683EC' }} onClick={() => {
          //                         setOpenDialog2(true);
          //                         setSingleDoc(item);
          //                     }} title="Document Summary"> <i className="material-icons" >summarize</i></IconButton>
          //                 </>
          //             )}
          //         </div>
          //     ),
          // }));

          setVersionRecordList(VersionRecorList);

          } catch (error) {
            console.error("Error fetching data:", error);
          }
        };
      
        fetchData();
      }, []);

    //   const getDocPDF = (action, versionElements) => {

    //   }

    //   const redirecttoQmDocument = useCallback((element) => {
    //     // navigate('/QAQTAddDocContent', { state: { versionElements: element } })
    // }, [navigate]);


      const columns = [
        { name: 'SN', selector: (row) => row.sn, sortable: true, grow: 1, align: 'text-center' },
        { name: 'Doc-Type', selector: (row) => row.docType, sortable: true, grow: 2, align: 'text-center' },
        { name: 'Particulars', selector: (row) => row.particulars, sortable: true, grow: 2 },
        { name: 'From', selector: (row) => row.from, sortable: true, grow: 2, align: 'text-center' },
        { name: 'To', selector: (row) => row.to, sortable: true, grow: 2, align: 'text-center' },
        { name: 'Issue Date', selector: (row) => row.issueDate, sortable: true, grow: 2, align: 'text-center' },
        { name: 'Status', selector: (row) => row.status, sortable: false, grow: 2, align: 'text-center' },
        { name: 'Action', selector: (row) => row.action, sortable: false, grow: 2, align: 'text-center' },
    ];

    return (

        <div className="card">
            <div className="card-body text-center">
              <h1>Table</h1>
            {/* <div id="card-body customized-card">
                        {isLoading ? (
                            <h3>Loading...</h3>
                        ) : error ? (
                            <h3 color="error">{error}</h3>
                        ) : (
                            <Datatable columns={columns} data={DocVersionListByProject} />
                        )}
                    </div> */}
            </div>
        </div>

    )

}

export default QmRevisionRecordsComponent;