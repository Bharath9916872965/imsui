import withRouter from "common/with-router";
import Datatable from "components/datatable/Datatable";
import Navbar from "components/Navbar/Navbar";
import React, { useState, useEffect, useCallback } from 'react';
import { qspDocumentList } from "services/qms.service";
import { format } from "date-fns";
import QspDocPrint from "components/prints/qms/qsp-doc-print";
import QspAddDocContentComponent from "./qsp-add-doc-content/qsp-add-doc-content.component";
import QspDocumentSummaryDialog from "./qsp-document-summary-dialog";



const QSPDocumentList = ({ router, docName }) => {
const docType = docName;
const { navigate, location } = router;
const [qspRecordPrintList, setQspRecordPrintList] = useState([]);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState(null);
const [documentName, setDocumentName] = useState('');
const [singleDoc, setSingleDoc] = useState(null);
const [openDialog2, setOpenDialog2] = useState(false);



useEffect(() => {
    if(docType === 'qsp1'){
      setDocumentName('QSP1 - Control of Documents and Records');
    }else if(docType === 'qsp2'){
      setDocumentName('QSP2 - Internal Quality Audit');
    }else if(docType === 'qsp3'){
      setDocumentName('QSP3 - Management Review');
    }else if(docType === 'qsp4'){
      setDocumentName('QSP4 - Non conformity & Corrective Action');
    }else if(docType === 'qsp5'){
      setDocumentName('QSP5 - Quality Objectives and Continual Improvement');
    }else if(docType === 'qsp6'){
      setDocumentName('QSP6 - Analysis of Data & Preventive Action');
    }else if(docType === 'qsp7'){
      setDocumentName('QSP7 - Customer Feedback Analysis');
    }else if(docType === 'qsp8'){
      setDocumentName('QSP8 - Risk management');
    }

    const fetchQspRevisionRecordList = async () => {
        try {
          const qspRevisionRecordDetails = await qspDocumentList();
          const filteredDetails = qspRevisionRecordDetails.filter(a => a.docName === docType);
          setQspRecordPrintList(filteredDetails);
        } catch (error) {
          setError('An error occurred');
        }
      };
      
      fetchQspRevisionRecordList();

}, [docType]);

  const redirecttoQspDocument = useCallback((element) => {
    navigate('/qsp-add-content', { state: { revisionElements: element } })
  }, [navigate]);

  const getDocPDF = (action, revisionElements) => {
    return <QspDocPrint action={action} revisionElements={revisionElements} />;
  }

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
  ]

  const getMappedData = () => {
    return qspRecordPrintList.map((item, index) => ({
    sn: index + 1,
    description: item.description || '-' ,
    from: index + 1 < qspRecordPrintList.length ? 'I' + qspRecordPrintList[index + 1].issueNo + '-R' + qspRecordPrintList[index + 1].revisionNo : '--',
    to: 'I' + item.issueNo + '-R' + item.revisionNo || '-',
    issueDate: format(new Date(item.dateOfRevision), 'dd-MM-yyyy') || '-',
    status: item.statusCode || '--',
    action: (
        <div>
        {!["APR", "APR-GDDQA", "APR-DGAQA"].includes(item.statusCode) && (
          <>
            <button className="icon-button edit-icon-button me-1" onClick={() => redirecttoQspDocument(item)} title="Edit"> <i className="material-icons"  >edit_note</i></button>
            {getDocPDF('', item)}
            <button className="icon-button me-1" style={{ color: '#439cfb' }} onClick={() => { setSingleDoc(item); setOpenDialog2(true); }} title="Document Summary"> <i className="material-icons"  >summarize</i></button>
          </>
        )}
      </div>
      ),
    }));
  };

    return(
        <div className="card">
            <Navbar></Navbar>
            <div className="card-body">
                <div className="row">
                    <div className="col-md-12 text-center">
                       <h3>{documentName} - Revision Record</h3>
                    </div>
                </div>
                <br />
                <div id="card-body customized-card">
                {isLoading ? (
                    <h3>Loading...</h3>
                ) : error ? (
                    <h3 color="error">{error}</h3>
                ) : (
                    <Datatable columns={columns}  data={getMappedData()}/>
                )}
                </div>

                <br />

            </div>
            <QspDocumentSummaryDialog
              open={openDialog2}
              onClose={handleCloseDocSummaryDialog}
              revisionElements={singleDoc}
            />
        </div>
    )
}
export default withRouter(QSPDocumentList);