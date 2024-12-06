import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; 
import Navbar from "../Navbar/Navbar";
import "./dashboard.css";
import SelectPicker from 'components/selectpicker/selectPicker';
import { Autocomplete, TextField, Box, ListItemText } from '@mui/material';
import { CustomMenuItem } from 'services/auth.header';
import {getIqaDtoList,getIqaAuditeeList,getAuditeeTeamDtoList,getScheduleList} from "services/audit.service";
import {getQmDashboardDetailedList,getActiveAuditorsCount,getActiveAuditeeCount,getActiveTeams,getActiveSchedules} from "services/dashboard.service";
import QmDocPrint from 'components/prints/qms/qm-doc-print';

import { RiShieldUserFill } from "react-icons/ri";
import { FaUserCog } from "react-icons/fa";
import { BiLogoMicrosoftTeams } from "react-icons/bi";
import { MdScheduleSend } from "react-icons/md";

import { format } from "date-fns";
import dayjs from 'dayjs';
import { Field, Formik, Form  } from "formik";

const Dashboard = () => {

    const [iqaOptions,setIqaOptions] = useState([]);
    const [iqaNo,setIqaNo] = useState('');
    const [iqaId,setIqaId] = useState('');
    const [iqaFromDate,setIqaFromDate] = useState(dayjs(new Date()));
    const [iqaToDate,setIqaToDate] = useState(dayjs(new Date()));

  const [iqaFullList,setIqaFullList] = useState([]);
  const [iqaAuditeeFullList, setIqaAuditeeFullList] = useState([]);
  const [auditTeamFullList, setAuditTeamFullList] = useState([]);
  const [scheduleFullList,setScheduleFullList] = useState([]);


    const [qmNo, setQMNo] = useState(""); 
    const [qmDetailedData, setqmDetailedData] = useState({});
    const [showQSPModal, setQSPShowModal] = useState(false);
    const [activeAuditorsCount,setActiveAuditorsCount] = useState(0);
    const [activeAuditeesCount,setActiveAuditeesCount] = useState(0);
    const [activeTeamsCount,setActiveTeamsCount] = useState(0);
    const [activeSchedulesCount,setActiveSchedulesCount] = useState(0);
    
    const [auditeeCountBasedOnIqaSel,setAuditeeCountBasedOnIqaSel] = useState(0);
    const [teamsCountBasedOnIqaSel,setTeamsCountBasedOnIqaSel] = useState(0);
    const [schedulesCountBasedOnIqaSel,setSchedulesCountBasedOnIqaSel] = useState(0);

    const fetchData = async () => {
      try {
        const qmDetails = await getQmDashboardDetailedList();
  
        // qmDetails 
        if (qmDetails && qmDetails.length > 0) {
          setqmDetailedData(qmDetails[0]); // Store just the first item
          setQMNo('I' + qmDetails[0].issueNo + '-R' + qmDetails[0].revisionNo); // Update QMNo
        }

         // activeAuditorsCount 
         const activeAuditorsCount = await getActiveAuditorsCount();
         setActiveAuditorsCount(activeAuditorsCount);
         // activeAuditeesCount 
         const activeAuditeesCount = await getActiveAuditeeCount();
         setActiveAuditeesCount(activeAuditeesCount);
         //activeTeams
         const activeTeamsCount = await getActiveTeams();
         setActiveTeamsCount(activeTeamsCount);
         //activeSchedules
         const activeSchedules = await getActiveSchedules();
         setActiveSchedulesCount(activeSchedules);

        // Iqa dropdown and default iqa selection 
        const [IqaList, AuditTeamDtoList, ScheduleDtoList] = await Promise.all([ getIqaDtoList(), getAuditeeTeamDtoList(), getScheduleList()]);

          setIqaFullList(IqaList);
          const iqaData = IqaList.map(data => ({
                          value : data.iqaId,
                          label : data.iqaNo
                      }));
          if(IqaList.length >0){
            const iqa = IqaList[0];
            setIqaNo(iqa.iqaNo)
            setIqaId(iqa.iqaId)
       
            const IqaAuditeeDtoList = await getIqaAuditeeList(iqa.iqaId);

            if (IqaAuditeeDtoList && IqaAuditeeDtoList.length > 0) {
              setIqaAuditeeFullList(IqaAuditeeDtoList);
              setAuditeeCountBasedOnIqaSel(IqaAuditeeDtoList.length);
            } else {
              setAuditeeCountBasedOnIqaSel(0);
            }


           
            if (AuditTeamDtoList && AuditTeamDtoList.length > 0) {
              setAuditTeamFullList(AuditTeamDtoList);
              const filteredTeams = AuditTeamDtoList.filter(data => data.iqaId === iqa.iqaId);
              setTeamsCountBasedOnIqaSel(filteredTeams.length);
            } else {
              setTeamsCountBasedOnIqaSel(0);
            }

            if (ScheduleDtoList && ScheduleDtoList.length > 0) {
              setScheduleFullList(ScheduleDtoList);
              const filteredSchedules = ScheduleDtoList.filter(data => data.iqaId === iqa.iqaId);
              setSchedulesCountBasedOnIqaSel(filteredSchedules.length);
            } else {
              setSchedulesCountBasedOnIqaSel(0);
            }


          }
          setIqaOptions(iqaData)

    


    
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
    
      useEffect(() => {
        fetchData();
      }, []);
  // Now, print the qmDetailedData object properly in the console


  const onIqaChange = async (selectedIqaId) => {
    // Find the selected IQA from the list
    const selectedIqa = iqaFullList.find(iqa => iqa.iqaId === selectedIqaId);
  
    if (selectedIqa) {
      setIqaNo(selectedIqa.iqaNo);
      setIqaId(selectedIqa.iqaId);
  
      // Filter the iqa Auditee data based on the new IQA ID
      const IqaAuditeeDtoList = await getIqaAuditeeList(selectedIqa.iqaId);
      if (IqaAuditeeDtoList && IqaAuditeeDtoList.length > 0) {
        setIqaAuditeeFullList(IqaAuditeeDtoList);
        setAuditeeCountBasedOnIqaSel(IqaAuditeeDtoList.length);
      } 

      // Filter the audit team data based on the new IQA ID
      const filteredTeams = auditTeamFullList.filter(data => data.iqaId === selectedIqa.iqaId);
      setTeamsCountBasedOnIqaSel(filteredTeams.length);

     // Filter the schedules data based on the new IQA ID
     const filteredSchedules = scheduleFullList.filter(data => data.iqaId === selectedIqa.iqaId);
     setSchedulesCountBasedOnIqaSel(filteredSchedules.length);

    } else {
      // Handle null or invalid IQA selection
      setIqaNo("");
      setIqaId("");
      setIqaAuditeeFullList([]);
      setAuditeeCountBasedOnIqaSel(0);
      setTeamsCountBasedOnIqaSel(0);
      setSchedulesCountBasedOnIqaSel(0);
    }
  };
  

    
      const openQSPPopUpModal = ()=>{
        setQSPShowModal(true);
      }

      
  const hadleClose = () => {
    setQSPShowModal(false);
}

  return (
    <div>
   <Navbar/>
      {/* <HeaderComponent /> */}

      {/* Main Content Below Header */}
      
      <div className="container-fluid page-body-wrapper dashboard-container" style={{ overflow: "hidden" }}>
        <div className="main-panel">
          <div className="content-wrapper dashboard-wrapper pb-0" style={{ display: 'none' }}>

{/************************************ HEADER START ***************************************/}
<div className="page-header row mb-2">
  {/* Column for the heading like welcome something*/}
  <div className="col-md-9 d-flex align-items-center">
    <h5 className="mb-0">
      <span className="ps-0 h6 ps-sm-2 text-muted d-inline-block"></span>
    </h5>
  </div>

    {/* Column for the label */}
    <div className="col-md-1 d-flex justify-content-end" style={{ paddingRight: '0px'}}>
    <label htmlFor="iqa-select" style={{ color: 'black', fontWeight: 400,marginTop: '2px'}}>
      IQA No:
    </label>
  </div>

  {/* Column for the SelectPicker */}
  <div className="col-md-2 d-flex justify-content-start">
    <div style={{ flexGrow: 1, maxWidth: '70%' }}>
    <Autocomplete
        options={iqaOptions}
        getOptionLabel={(option) => option.label}
        value={
          iqaOptions &&
          iqaOptions.length > 0 &&
          iqaOptions.find((option) => option.value === iqaId) || null
        }
        onChange={(event, newValue) => onIqaChange(newValue?.value)}  
        isOptionEqualToValue={(option, value) => option.value === value.value}
        renderOption={(props, option) => {
          const { key, ...restProps } = props;
          return (
            <CustomMenuItem {...restProps} key={key}>
              <ListItemText primary={option.label} />
            </CustomMenuItem>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            // label="IQA No"
            variant="standard"
            size="small"
            sx={{
              input: {
                color: '#2b2f32', // Set text color inside input field (selected value)
                padding: '5px 12px', // Adjust input padding if needed
                fontWeight: '600',
              },
              root: {
                '& .MuiOutlinedInput-root': {
                  border: 'none',
                  boxShadow: 'none',
                  color: 'black', // Ensure input text is black
                },
                '& .MuiInputLabel-root': {
                  color: 'darkblue', // Label color
                },
              },
            }}
            
          />
        )}
        disableClearable // Disable the clear button
      />
    </div>
  </div>
</div>


{/************************************ HEADER END ***************************************/}   

{/************************************ ROW START ***************************************/}
<div className="row">

{/*******************************GRID LEFT********************************************* */}
<div className="col-xl-2 col-lg-12 stretch-card grid-margin divider-div" >
      <div className="row" >
                
          
             <div className="col-xl-12 col-md-4 stretch-card grid-margin grid-margin-sm-0 pb-sm-1">
       
               <div className="col-service-card"    >

                 <div className="service-card">
                   <h3>Quality Manual</h3>
                    <p>
                    <span className="doc-details" style={{ position: 'relative', top: '-7px' }}>{qmNo}</span>
                  <>
                  <QmDocPrint action="" revisionElements={qmDetailedData}  />
                   </>
                    </p>
                    <figcaption></figcaption>
                </div>
              </div>
         </div>
                
                
     <div className="col-xl-12 col-md-4 stretch-card grid-margin grid-margin-sm-0 pb-sm-1">

      <div className="col-service-card"  onClick={() => openQSPPopUpModal()} >
        <div className="service-card">
          <h3>QSP</h3>
          <p>
          </p>
          <figcaption></figcaption>
        </div>
      </div>

      {showQSPModal && (
            <div className={`modal fade show modal-visible`} style={{ display: 'block' }} aria-modal="true" role="dialog">
              <div className="modal-dialog modal-lg modal-xl-custom">
                <div className="modal-content" >
                  <div className="modal-header bg-secondary d-flex justify-content-between bg-primary text-white">
                    <h5 className="modal-title">QSP </h5>
                    <button type="button" className="btn btn-danger" onClick={hadleClose} aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>

                  <div className="modal-body model-max-height">
                 
                  <table className="table table-bordered table-hover">
                      <thead>
                       <tr>
                          <th className='width25'>QSP</th>
                          <th className='width10'>Issue From</th>
                          <th className='width10'>Issue To</th>
                          <th className='width10'>DOR</th>
                          <th className='width10'>Print</th>
                       </tr>
                       </thead> 
                       <tbody>
                          <tr>
                              <td className='width25'></td>
                              <td className='width10 text-start'></td>
                              <td className='width10 text-start'></td>
                              <td className='width10'></td>
                              <td className='width10'></td>
                          </tr>
                        </tbody>
                    </table>


                  </div>
                </div>
              </div>
            </div>

          )}



     </div>
                 
     <div className="col-xl-12 col-md-4 stretch-card grid-margin grid-margin-sm-0 pb-sm-1">

     <div className="col-service-card">
        <div className="service-card">
   
          <h3>DWP</h3>
          <p>
           
          </p>
          <figcaption></figcaption>
        </div>
      </div>
        </div>


       <div className="col-xl-12 col-md-4 stretch-card grid-margin grid-margin-sm-0 pb-sm-1">
       <div className="col-service-card">
        <div className="service-card">
   
          <h3>GWP</h3>
          <p>
           
          </p>
          <figcaption></figcaption>
        </div>
      </div>
      </div>
                </div>
  </div>
  {/**************************************************GRID RIGHT***************************************************************** */}
  <div className="col-xl-10 col-lg-12 stretch-card grid-margin divider-div">
              
                <div className="card audit-graphs-card">
                   <div className="row">


     <div className="col-md-2 col-sm-6">
     <a className="dashboard-links" href="/auditor-list">
            <div className="counter auditor">
                <div className="counter-icon">
                    <span><RiShieldUserFill  color="White" className="counter-icons"  /></span>
                </div>
                <h3>Active Auditors</h3>
                <span className="counter-value">{activeAuditorsCount}</span>
            </div>
            </a>
        </div>

        <div className="col-md-2 col-sm-6">
        <a 
    className="dashboard-links" 
    href={`/iqa-auditee-list?iqaIdFromDashboard=${encodeURIComponent(iqaId)}&iqaNoFromDashboard=${encodeURIComponent(iqaNo)}`}
  >
            <div className="counter auditee">
                <div className="counter-icon">
                    <span> <FaUserCog  color="White" className="counter-icons"  /></span>
                </div>
                <h3>{iqaNo} Auditees</h3>
                <span className="counter-value">{auditeeCountBasedOnIqaSel}</span>
            </div>
            </a>
        </div>


        
       <div className="col-md-2 col-sm-6">
        <a className="dashboard-links" 
        href={`/audit-team-list?iqaIdFromDashboard=${encodeURIComponent(iqaId)}&iqaNoFromDashboard=${encodeURIComponent(iqaNo)}`}
        >
            <div className="counter team">
                <div className="counter-icon">
                    <span> <BiLogoMicrosoftTeams  color="White" className="counter-icons"  /></span>
                </div>
                <h3>{iqaNo} Teams</h3>
                <span className="counter-value">{teamsCountBasedOnIqaSel}</span>
            </div>
            </a>
        </div>

        <div className="col-md-2 col-sm-6">
        <a className="dashboard-links" href="/schedule-list">
            <div className="counter schedule">
                <div className="counter-icon">
                    <span> <MdScheduleSend  color="White" className="counter-icons"  /></span>
                </div>
                <h3>{iqaNo} Schedules</h3>
                <span className="counter-value">{schedulesCountBasedOnIqaSel}</span>
            </div>
            </a>
        </div>


     </div>
   </div>




                <div className="card iqa-graphs-card">
                  <div className="card-body">
                    <div className="row">
                        <div className="col-sm-10">
                        </div>
                        <div className="col-sm-2 text-md-end">
         
                       </div>





                    </div>
                  
<br></br>
<br></br>
<br></br>
<br></br>


                  </div>
                </div>


              </div>

</div>
{/************************************ ROW END ***************************************/}




          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
