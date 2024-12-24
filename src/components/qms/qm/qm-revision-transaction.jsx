import React, { useEffect, useState } from "react";
import { Box} from '@mui/material';
import Navbar from "../../Navbar/Navbar";
import '../../audit/auditor-list.component.css';
import '../../audit/scheduler/schedule-tran.css'
import { format } from "date-fns";
import { revisionTran } from "services/qms.service";

const RevisionTransactionComponent = () => {

  const [data,setData]= useState(undefined);
  const [transaction,setTransaction] = useState([])


  const fetchData = async () => {
    try {
      const data = JSON.parse(localStorage.getItem('revisionData'));
      if(data){
        setData(data)
       const trans = await revisionTran(data.revisionRecordId)
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
    'INI': ' QM Inititated By',
    'FWD': ' QM Forwarded By',
    'RWD': ' QM Reviewed by ',
    'APD': ' QM Approved by ',
    'RVM': ' QM Revoked by ',
    'RTD': ' QM Returned by ',
    'RTM': ' QM Returned by ',  
    'RFD': ' QM ReForwarded By',
  };

  const back = ()=>{
    window.close();
  }


  return (
    <div>
      <Navbar />
      <div className="card">
         <Box display="flex" alignItems="center" gap="10px" >
          <Box flex="87%" className='text-center'><h3> QM Revision Transaction</h3></Box>
          <Box flex="13%"><button className="btn backClass" onClick={() => back()}>Back</button></Box>
         </Box>
          <Box className="col-md-11 card l-bg-blue-dark text-left-center-card mg-top-10"  >
            <Box display="flex" alignItems="center" gap="10px">
              <Box flex="50%"><span className="fw-bolder">Description</span> - {data && data.description !=='' ? data.description:""}</Box>
              <Box flex="25%"><span className="fw-bolder">Issue </span> - {data?.issueNo ? `I${data.issueNo}-R${data.revisionNo}` : ""}</Box>
              <Box flex="25%"><span className="fw-bolder">Date Of Revision</span> - {data && data.dateOfRevision && format(new Date(data.dateOfRevision),'dd-MM-yyyy')}</Box>
            </Box>
          </Box><br />
          <div id="card-body customized-card">
          <Box className="col-md-11  text-left-center-card mg-top-10"  >
            {transaction && transaction.length >0 && transaction.map(item =>{
                    console.log('item.statusCode',item.statusCode);
                    let statusColor = `${item.statusCode.trim() === 'INI'?'initiated-bg' : (item.statusCode.trim() === 'FWD' ? 'forwarde-bg' : ['RWD'].includes(item.statusCode) ? 'reviewed-bg' :['RTD','RTM'].includes(item.statusCode)?'returned-bg':item.statusCode.trim()=== 'APD'?'approved-bg':item.statusCode.trim() === 'RVM'?'revoked-bg':'reforwarde-bg')}`;
                    console.log('statusColor',statusColor);
                    return(
                <>
                  <div className="timeline-row">
                   <div class="timeline-content" >
						        <h6 className={statusColor}> {revisionSta[item.statusCode]}&nbsp;/&nbsp;<span >{item.empName}</span></h6> 
						       </div>
                   <div class="timeline-dot fb-bg mid-line"></div>
                   <div class="timeline-time">
                     <div class="form-inline margin-half-top"><span className="date-styles">{format(new Date(item.transactionDate),'MMM dd, yyyy, HH:MM a')}</span></div>
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
export default RevisionTransactionComponent;