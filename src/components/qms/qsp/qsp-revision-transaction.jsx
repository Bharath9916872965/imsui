import React, { useEffect, useState } from "react";
import { Box } from '@mui/material';
import Navbar from "../../Navbar/Navbar";
import '../../audit/auditor-list.component.css';
import '../../audit/scheduler/schedule-tran.css'
import { format } from "date-fns";
import { qspRevisionTran, revisionTran } from "services/qms.service";

const QSPRevisionTransactionComponent = () => {

  const [data, setData] = useState(undefined);
  const [transaction, setTransaction] = useState([])


  const fetchData = async () => {
    try {
      const data = JSON.parse(localStorage.getItem('revisionData'));
      if (data) {
        setData(data)
        const trans = await qspRevisionTran(data.revisionRecordId)
        setTransaction(trans)
      }

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const revisionSta = {
    'INI': ' QSP Inititated By',
    'FWD': ' QSP Forwarded By',
    'RWD': ' QSP Reviewed by ',
    'APD': ' QSP Approved by ',
    'RVM': ' QSP Revoked by ',
    'RTD': ' QSP Returned by ',
    'RTM': ' QSP Returned by ',
    'RFD': ' QSP ReForwarded By',
  };

  const back = () => {
    window.close();
  }


  return (
    <div>
      <Navbar />
      <div className="card">
        <Box display="flex" alignItems="center" gap="10px" >
          <Box flex="87%" className='text-center'><h3> QSP Revision Transaction</h3></Box>
          <Box flex="13%"><button className="btn backClass" onClick={() => back()}>Back</button></Box>
        </Box>
        <Box className="col-md-11 card l-bg-blue-dark text-left-center-card mg-top-10"  >
          <Box display="flex" alignItems="center" gap="10px">
            <Box flex="50%"><span className="fw-bolder">Description</span> - {data && data.description !== '' ? data.description : ""}</Box>
            <Box flex="25%"><span className="fw-bolder">Issue </span> - {data?.issueNo ? `I${data.issueNo}-R${data.revisionNo}` : ""}</Box>
            <Box flex="25%"><span className="fw-bolder">Date Of Revision</span> - {data && data.dateOfRevision && format(new Date(data.dateOfRevision), 'dd-MM-yyyy')}</Box>
          </Box>
        </Box><br />
        <div id="card-body customized-card">
          <Box className="col-md-11  text-left-center-card mg-top-10"  >
            {transaction && transaction.length > 0 && transaction.map(item => {
              let statusColor = `${item.statusCode.trim() === 'INI' ? 'initiated-bg' : (item.statusCode.trim() === 'FWD' ? 'forwarde-bg' : ['RWD'].includes(item.statusCode) ? 'reviewed-bg' : ['RTD', 'RTM'].includes(item.statusCode) ? 'returned-bg' : item.statusCode.trim() === 'APD' ? 'approved-bg' : item.statusCode.trim() === 'RVM' ? 'revoked-bg' : 'reforwarde-bg')}`;
              return (
                <>
                  <div className="timeline-row">
                    <div class="timeline-content" >
                      <h6 className={statusColor}> {revisionSta[item.statusCode]}&nbsp;/&nbsp;<span >{item.empName}</span></h6>
                      <p style={{ backgroundColor: "#f0f2f5", padding: "10px", borderRadius: "5px" }}>
                        {item.remarks ? (
                          <>
                            <span className="remarks_title" style={{ fontWeight: "bold" }}>Remarks : </span>
                            {item.remarks}
                          </>
                        ) : (
                          <span className="remarks_title" style={{ fontWeight: "bold" }}>No Remarks</span>
                        )}
                      </p>
                    </div>
                    <div class="timeline-dot fb-bg mid-line"></div>
                    <div class="timeline-time">
                      <div class="form-inline margin-half-top"><span className="date-styles">{format(new Date(item.transactionDate), 'MMM dd, yyyy, HH:mm a')}</span></div>
                    </div>
                  </div>
                </>
              )
            })}
          </Box>
        </div>
      </div>
    </div>
  );

}
export default QSPRevisionTransactionComponent;