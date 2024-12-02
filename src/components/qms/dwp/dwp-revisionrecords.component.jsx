import { useCallback, useEffect, useState } from "react";
import { getDwpVersionRecordDtoList, getQmVersionRecordDtoList } from "../../../services/qms.service";
import Datatable from "../../datatable/Datatable";
import withRouter from '../../../common/with-router';
import Navbar from "../../Navbar/Navbar";
import "./dwp-revisionrecords.component.css"
import { format } from "date-fns";
import DwpDocPrint from "components/prints/qms/dwp-doc-print";
import AddDocumentSummaryDialog from "./dwp-add-document-summary-dialog";
// import AddDocumentSummaryDialog from "./qm-add-document-summary-dialog";


const DwpRevisionRecordsComponent = ({ router }) => {

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [versionRecordList, setVersionRecordList] = useState([]);
  const [versionRecordPrintList, setVersionRecordPrintList] = useState([]);
  const [openDialog2, setOpenDialog2] = useState(false);
  const [singleDoc, setSingleDoc] = useState(null);


  const { navigate, location } = router;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const versionRecorList = await getDwpVersionRecordDtoList(0);
        const mappedData = versionRecorList.map((item, index) => ({
          sn: index + 1,
          description: item.description || '-' || '-',
          // from: 'V' + item[5] + '-R' + item[6] || '-',
          from: index + 1 < versionRecorList.length ? 'I' + versionRecorList[index + 1].issueNo + '-R' + versionRecorList[index + 1].revisionNo : '--',
          to: 'I' + item.issueNo + '-R' + item.revisionNo || '-',
          issueDate: item.dateOfRevision,
          issueDate: format(new Date(item.dateOfRevision), 'dd-MM-yyyy') || '-',
          status: item.statusCode || '--',
          action: (
            <div>
              {!["APR", "APR-GDDQA", "APR-DGAQA"].includes(item.statusCode) && (
                <>
                  <button className="icon-button edit-icon-button me-1" onClick={() => redirecttoQmDocument(item)} title="Edit"> <i className="material-icons"  >edit_note</i></button>
                  {/* <button className="btn summary-btn-outline btn-sm"  onClick={() => {
                                  // setOpenDialog2(true);
                                  setSingleDoc(item);
                              }} title="Document Summary"> <i className="material-icons" >summarize</i></button> */}
                  {getDocPDF('', item)}
                  <button className="icon-button me-1" style={{ color: '#439cfb' }} onClick={() => { setSingleDoc(item); setOpenDialog2(true); }} title="Document Summary"> <i className="material-icons"  >summarize</i></button>
                  {/* <button className="icon-button me-1" style={{color: '#ea5753'}} title="Mapping Of Clauses" onClick={()=>addMappingOfClasses(item)} > <i className="material-icons"  >table_chart</i></button> */}
                </>
              )}
            </div>
          ),
        }));

        setVersionRecordPrintList(mappedData);
        setVersionRecordList(versionRecorList);
        setIsLoading(false);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const getDocPDF = (action, revisionElements) => {
    return <DwpDocPrint action={action} revisionElements={revisionElements} />
  }

  const redirecttoQmDocument = useCallback((element) => {
    navigate('/dwp-add-content', { state: { revisionElements: element } })
  }, [navigate]);

  const handleCloseDocSummaryDialog = () => {
    setOpenDialog2(false)
    setSingleDoc(null);
  };




  const columns = [
    { name: 'SN', selector: (row) => row.sn, sortable: true, grow: 1, align: 'text-center' },
    { name: 'Description', selector: (row) => row.description, sortable: true, grow: 2, align: 'text-start' },
    { name: 'Issue From', selector: (row) => row.from, sortable: true, grow: 2, align: 'text-center' },
    { name: 'Issue To', selector: (row) => row.to, sortable: true, grow: 2, align: 'text-center' },
    { name: 'Date Of Revision', selector: (row) => row.issueDate, sortable: true, grow: 2, align: 'text-center' },
    { name: 'Status', selector: (row) => row.status, sortable: false, grow: 2, align: 'text-center' },
    { name: 'Action', selector: (row) => row.action, sortable: false, grow: 2, align: 'text-center' },
  ];

  return (

    <div className="card">
      <Navbar />
      <div className="card-body">
        <h3>DWP - Revision Record </h3>
        <div id="card-body customized-card">
          {isLoading ? (
            <h3>Loading...</h3>
          ) : error ? (
            <h3 color="error">{error}</h3>
          ) : (
            <Datatable columns={columns} data={versionRecordPrintList} />
          )}
        </div>
      </div>
      <AddDocumentSummaryDialog
        open={openDialog2}
        onClose={handleCloseDocSummaryDialog}
        revisionElements={singleDoc}
      />
      

    </div>

  )

}

export default withRouter(DwpRevisionRecordsComponent);