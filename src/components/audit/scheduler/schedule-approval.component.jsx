import React, { useEffect, useState } from "react";
import { getIqaDtoList,getScheduleApprovalList,approveSchedule,returnSchedule,auditorForward,getAuditTeamMemberList,getCheckListAddCount,
         auditeeSubmit } from "../../../services/audit.service";
import Datatable from "../../datatable/Datatable";
import { Box,Tabs, Tab,Badge} from '@mui/material';
import Navbar from "../../Navbar/Navbar";
import '../auditor-list.component.css';
import { format } from "date-fns";
import SelectPicker from '../../selectpicker/selectPicker';
import AlertConfirmation from "../../../common/AlertConfirmation.component";
import ReturnDialog from "../../Login/returnDialog.component";
import withRouter from "common/with-router";
import auditCheckListWithDataPdf from "components/prints/qms/auditCheck-withData-print"



const ScheduleApprovalComponent = ({router}) => {

  const {navigate,location} = router;
  const [scheduleList,setScheduleList] = useState([]);
  const [filScheduleList,setFilScheduleList] = useState([]);
  const [auditorList,setAuditorList] = useState([]);
  const [auditeeList,setAuditeeListt] = useState([]);
  const [iqaFullList,setIqaFullList] = useState([]);
  const [iqaOptions,setIqaOptions] = useState([]);
  const [iqaNo,setIqaNo] = useState('');
  const [iqaId,setIqaId] = useState('');
  const [scope,setscope] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [element,setElement] = useState('');
  const [isBoth,setIsBoth] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [roleId,setRoleId] = useState(0);
  const [heading,setHeading] = useState('');
  const [teamMembersList,setTeamMembersList] = useState([])
  const [isReady,setIsReady] = useState(false)
  const [isAdmin,setIsAdmin] = useState(false)
  const [loginEmpId,setLoginEmpId] = useState(0)

  const columns = [
    { name: 'SN', selector: (row) => row.sn, sortable: true, grow: 1, align: 'text-center', width: '3%'  },
    { name: 'Date & Time (Hrs)', selector: (row) => row.date, sortable: true, grow: 2, align: 'text-center', width: '9%'  },
    { name: 'Division/Group', selector: (row) => row.divisionCode, sortable: true, grow: 2, align: 'text-center', width: '15%'  },
    { name: 'Project', selector: (row) => row.project, sortable: true, grow: 2, align: 'text-center', width: '19%'  },
    { name: 'Auditee', selector: (row) => row.auditee, sortable: true, grow: 2, align: 'text-start', width: '15%'  },
    { name: 'Team', selector: (row) => row.team, sortable: true, grow: 2, align: 'text-center', width: '7%'  },
    { name: 'Status', selector: (row) => row.status, sortable: true, grow: 2, align: 'text-center', width: '14%'  },
    { name: 'Revision', selector: (row) => row.revision, sortable: true, grow: 2, align: 'text-center', width: '5%'  },
    { name: 'Action', selector: (row) => row.action, sortable: true, grow: 2, align: 'text-center',  width: '13%' },
  ];


  const fetchData = async () => {
    try {
      const scdList        = await getScheduleApprovalList();
      const iqaList        = await getIqaDtoList();
     const teamMembers     =  await getAuditTeamMemberList();
     setTeamMembersList(teamMembers)

      const iqaNum = router.location.state?.iqaNo;
      const role = localStorage.getItem('roleId')
      setRoleId(role)
      setIqaFullList(iqaList);
      setScheduleList(scdList)
      if(['1','2','3','4'].includes(String(role))){
        setIsAdmin(true)
       }else{
        setIsAdmin(false)
       }
    
      const iqaData = iqaList.map(data => ({
                      value : data.iqaId,
                      label : data.iqaNo
                  }));
      if(iqaList.length >0){
        const iqa = iqaNum?iqaList.filter(item => item.iqaNo === iqaNum)?.[0]:iqaList[0];
        setIqaNo(iqa.iqaNo)
        setIqaId(iqa.iqaId)
        setscope(iqa.scope)
        const scList = scdList.filter(data => data.iqaId === iqa.iqaId);
        if(scList.length >0){
          const auditee = scList.filter(data => data.auditeeFlag === 'A');
          const auditor = scList.filter(data => data.auditeeFlag === 'L');
          if(auditee.length >0 && auditor.length >0){
            setDataTable(auditee,'A',role,teamMembers)
            setDataTable(auditor,'L',role,teamMembers)
            setIsBoth(true)
          }else{
            setDataTable(scList,'F',role,teamMembers)
            setIsBoth(false)
          }
        }else{
          setFilScheduleList([]);
          setAuditeeListt([]);
          setAuditorList([]);
          setIsBoth(false);
       }
      }
      setIqaOptions(iqaData)
      setIsReady(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isReady]);

  const setDataTable = (list,flag,role,teamMembersList)=>{
    let checkListFlag = 'A';
    const empId = Number(localStorage.getItem('empId'))
    setLoginEmpId(empId)
    const mappedData = list.map((item,index)=>{
      let isAditor = 'N';
      let statusColor = `${item.scheduleStatus === 'INI'?'initiated' : (item.scheduleStatus === 'FWD' ? 'forwarde' : item.scheduleStatus === 'ARF'?'reschedule':['ASR','ARL','RBA','RAR'].includes(item.scheduleStatus)?'returned':['ASA','AAL'].includes(item.scheduleStatus)?'lead-auditee':['AES'].includes(item.scheduleStatus)?'aditee-sub-clr':['ARS'].includes(item.scheduleStatus)?'aditor-sub-clr':'acknowledge')}`; 
      let isMember = false;
      const team = teamMembersList.filter(data => data.teamId == item.teamId);
      if(team && team.length > 0){
        for (let i = 0; i < team.length; i++) {
          if (item.loginEmpId === team[i].empId) {
            isMember = true;
          }
          if(empId == team[i].empId){
            isAditor = 'Y';
            checkListFlag = 'L'
          }
        }
      }

      return{
        sn           : index+1,
        date         : format(new Date(item.scheduleDate),'dd-MM-yyyy HH:mm') || '-',
        divisionCode : item.divisionName === '' && item.groupName === '' ? '-' : item.divisionName !== '' && item.groupName !== '' ? item.divisionName + '/' + item.groupName : item.divisionName !== '' ? item.divisionName : item.groupName !== '' ? item.groupName : '-',
        project      : item.projectName === ''?'-':item.projectName || '-',
        auditee      : item.auditeeEmpName || '-',
        team         : item.teamCode || '-',
        status       : <Box  className={statusColor} onClick = {()=>openTran(item)}><Box class='status'>{item.statusName}<i class="material-icons float-right font-med">open_in_new</i></Box></Box>|| '-',
        revision     : 'R'+item.revision || '-',
        action       : <>{((['FWD','AAL','ARF'].includes(item.scheduleStatus) && (item.auditeeEmpId === item.loginEmpId || isAdmin))  || (['FWD','ASA','ARF'].includes(item.scheduleStatus) && (item.leadEmpId === item.loginEmpId || isMember || isAdmin))) && <button className=" btn btn-outline-success btn-sm me-1" onClick={() => scheduleApprove(item)}  title="Acknowledge"> <i className="material-icons"  >task_alt</i></button>}
                          {((['FWD','AAL','ARF'].includes(item.scheduleStatus) && (item.auditeeEmpId === item.loginEmpId || isAdmin))  || (['FWD','ASA','ARF'].includes(item.scheduleStatus) && (item.leadEmpId === item.loginEmpId || isMember || isAdmin)))  && <button className=" btn btn-outline-danger btn-sm me-1" onClick={() => scheduleReturn(item)}  title="Return"><i className="material-icons">assignment_return</i></button>}
                          {['AAA','AES','ARS','ABA','RBA','RAR'].includes(item.scheduleStatus) && <button title='Add CheckList' className={" btn btn-outline-primary btn-sm me-1"} onClick={() => addCheckList(item,checkListFlag)}  ><i className="material-icons">playlist_add_check</i></button>}

                          {item.fwdFlag === 1 && !['ARS','ABA','RAR','AAA'].includes(item.scheduleStatus) && flag !== 'A' && (['1','2','3','7','4'].includes(String(role)) || flag === 'L' || flag === 'F')  && <button className=" btn btn-outline-success btn-sm me-1" onClick={() => forwardByAuditor(item)}  title="Auditor Forward"> <i className="material-icons"  >double_arrow</i></button>}
                          {['AES'].includes(item.scheduleStatus) && (( isAditor === 'Y') || isAdmin) && <button className=" btn btn-outline-danger btn-sm me-1" onClick={() => scheduleReturn(item)}  title="Return By Auditor"><i className="material-icons">assignment_return</i></button>}

                          {['ARS'].includes(item.scheduleStatus) && (item.auditeeEmpId == empId || isAdmin) && <button className=" btn btn-outline-success btn-sm me-1" onClick={() => acceptByAuditee(item)}  title="Auditee Accept"> <i className="material-icons"  >task_alt</i></button>}
                          {['ARS'].includes(item.scheduleStatus) && (item.auditeeEmpId == empId || isAdmin) && <button className=" btn btn-outline-danger btn-sm me-1" onClick={() => scheduleReturn(item)}  title="Auditee Reject"><i className="material-icons">assignment_return</i></button>}

                          {['ARS','ABA','RBA'].includes(item.scheduleStatus) && <button className=" btn-primary"  onClick={() =>auditCheckListWithDataPdf(item)} title="Print" aria-label="Print checklist" > <i className="material-icons">print</i> </button>}
                          {['RAR'].includes(item.scheduleStatus) && (item.auditeeEmpId == empId || isAdmin) && <button className=" btn btn-outline-success btn-sm me-1" onClick={() => forwardByAuditor(item)}  title="Auditee Forward"> <i className="material-icons"  >double_arrow</i></button>}
                          {['AAA'].includes(item.scheduleStatus) && (item.auditeeEmpId == empId || isAdmin) && <button className=" btn btn-outline-success btn-sm me-1" onClick={() => forwardByAuditee(item)}  title="Auditee Submit"> <i className="material-icons"  >double_arrow</i></button>}
                          </>  
      }      
    });

    if(flag === 'F'){
      setFilScheduleList(mappedData);
    }else if(flag === 'A'){
      setAuditeeListt(mappedData);
    }else if(flag === 'L'){
      setAuditorList(mappedData);
    }
   }

   const addCheckList = (item,flag)=>{
    if(item.auditeeEmpId === Number(localStorage.getItem('empId'))){
      navigate('/audit-check-list',{state:{element:item,flag : 'A'}})
    }else{
      navigate('/audit-check-list',{state:{element:item,flag : flag}})
    }
   
   }

   const openTran = (item)=>{
    localStorage.setItem('scheduleData', JSON.stringify(item));
    window.open('/schedule-tran', '_blank');
   }

   const acceptByAuditee = async (item)=>{
    await AlertConfirmation({
      title: 'Are you sure Accept CheckList ?' ,
      message: '',
      }).then(async (result) => {
      if (result) {
        try {
         const response = await auditorForward(item);
         if(response.status === 'S'){
          afterSubmit(item);
          Swal.fire({
            icon: "success",
            title: 'CheckList Accepted Successfully',
            showConfirmButton: false,
            timer: 1500
          });
        } else {
          Swal.fire({
            icon: "error",
            title: 'CheckList Accept Unsuccessful',
            showConfirmButton: false,
            timer: 1500
          });
        }
        }catch (error) {
            Swal.fire('Error!', 'There was an issue auditorForward.', 'error');
          }
      }
    })
   }

   const forwardByAuditor = (item)=>{
    if(item.scheduleStatus === 'RBA'){
      scheduleReturn(item);
    }else{
      AuditorSubmit(item)
    }
   }

   const forwardByAuditee = async (item)=>{
      const response = await getCheckListAddCount(item.scheduleId);
      if(response && response.length > 1){
        const master = response[0].addCount
        const checkList = response[1].addCount
        if(master == (checkList+1) || (master == checkList)){
        await AlertConfirmation({
            title: 'Are you sure Submit CheckList ?' ,
            message: '',
        }).then(async (result) => {
            if (result) {
              try {
              const response = await auditeeSubmit(item.scheduleId);
              if(response.status === 'S'){
                afterSubmit(item);
                Swal.fire({
                  icon: "success",
                  title: 'CheckList Submitted Successfully',
                  showConfirmButton: false,
                  timer: 1500
                });
              } else {
                Swal.fire({
                  icon: "error",
                  title: 'CheckList Submitted Unsuccessful',
                  showConfirmButton: false,
                  timer: 1500
                });
              }
              }catch (error) {
                  Swal.fire('Error!', 'There was an issue auditeeForward.', 'error');
                }
            }
          })
        }else{
           await AlertConfirmation({
              title: `Master CheckList Count (${master}) does not match the Schedule CheckList Count (${checkList})` ,
              message: '',
           })
        }
      }
   }

   const AuditorSubmit = async (item)=>{
    await AlertConfirmation({
      title: 'Are you sure Forward CheckList ?' ,
      message: '',
      }).then(async (result) => {
      if (result) {
        try {
         const response = await auditorForward(item);
         if(response.status === 'S'){
          afterSubmit(item);
          Swal.fire({
            icon: "success",
            title: response.message,
            showConfirmButton: false,
            timer: 1500
          });
        } else {
          Swal.fire({
            icon: "error",
            title: response.message,
            showConfirmButton: false,
            timer: 1500
          });
        }
        }catch (error) {
            Swal.fire('Error!', 'There was an issue auditorForward.', 'error');
          }
      }
    })
    setShowModal(false);
   }

  const scheduleApprove = async (item)=>{
    await AlertConfirmation({
      title: 'Are you sure Acknowledge Schedule ?' ,
      message: '',
      }).then(async (result) => {
      if (result) {
        try {
         const response = await approveSchedule(item);
         if(response.status === 'S'){
          afterSubmit(item);
          Swal.fire({
            icon: "success",
            title: response.message,
            showConfirmButton: false,
            timer: 1500
          });
        } else {
          Swal.fire({
            icon: "error",
            title: response.message,
            showConfirmButton: false,
            timer: 1500
          });
        }
        }catch (error) {
            Swal.fire('Error!', 'There was an issue Accepting the Schdule.', 'error');
          }
      }
    })
  }

  const scheduleReturn = (item)=>{
    if(item.scheduleStatus === 'RBA'){
      setHeading('Please, Add Your Forward Message Here.')
    }else{
      setHeading('Please, Add Your Send Back Message Here.')
    }
    setShowModal(true);
    setElement(item)
  }

  const afterSubmit = async(item)=>{
    const scdList   = await getScheduleApprovalList();
    const scList = scdList.filter(data => data.iqaId === item.iqaId)
    if(scList.length >0){
      const auditee = scList.filter(data => data.auditeeFlag === 'A');
      const auditor = scList.filter(data => data.auditeeFlag === 'L');
      if(auditee.length >0 && auditor.length >0){
        setDataTable(auditee,'A',roleId,teamMembersList)
        setDataTable(auditor,'L',roleId,teamMembersList)
        setIsBoth(true)
      }else{
        setDataTable(scList,'F',roleId,teamMembersList)
        setIsBoth(false)
      }
    }else{
      setFilScheduleList([]);
      setAuditeeListt([]);
      setAuditorList([]);
      setIsBoth(false);
    }
  }

  const onIqaChange = (value)=>{
    const selectedIqa = iqaFullList.find(data => data.iqaId === value);
    if(selectedIqa){
      setIqaNo(selectedIqa.iqaNo)
    }
    setIqaId(value);
    const scList = scheduleList.filter(data => data.iqaId === value);
    if(scList.length >0){
      const auditee = scList.filter(data => data.auditeeFlag === 'A');
      const auditor = scList.filter(data => data.auditeeFlag === 'L');
      if(auditee.length >0 && auditor.length >0){
        setDataTable(auditee,'A',roleId,teamMembersList)
        setDataTable(auditor,'L',roleId,teamMembersList)
        setIsBoth(true)
      }else{
        setDataTable(scList,'F',roleId,teamMembersList)
        setIsBoth(false)
      }
    }else{
      setFilScheduleList([]);
      setAuditeeListt([]);
      setAuditorList([]);
      setIsBoth(false);
    }

  }

  
  const handleReturnDialogClose = ()=>{
    setShowModal(false);
  }

  const handleReturnDialogConfirm = async (message)=>{
    if(message.trim() === '' ){
      Swal.fire({
        icon: "error",
        title: 'Please Add Return Message.',
        showConfirmButton: false,
        timer: 1500
      });
    }else{
      if(element.scheduleStatus === 'RBA'){
          element.message = message
          AuditorSubmit(element);
      }else{
        await AlertConfirmation({
          title: element.scheduleStatus === 'AES'?'Are you sure Return Check List ?':element.scheduleStatus === 'ARS'?'Are you sure Reject CheckList ?.':'Are you sure Return Schedule ?',
          message: '',
          }).then(async (result) => {
          if (result) {
            try {
             element.message = message
             const response = await returnSchedule(element);
             if(response.status === 'S'){
              afterSubmit(element);
              setShowModal(false);
              Swal.fire({
                icon: "success",
                title: element.scheduleStatus === 'ARS'?'Check List Rejected Successfully':response.message,
                showConfirmButton: false,
                timer: 1500
              });
            } else {
              Swal.fire({
                icon: "error",
                title: element.scheduleStatus === 'ARS'?'Check List Reject Unsuccessful':response.message,
                showConfirmButton: false,
                timer: 1500
              });
            }
            }catch (error) {
                Swal.fire('Error!', 'There was an issue Returning the Schdule.', 'error');
              }
          }
        })
      }

    }
   }

   const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
   }

  return (
    <div>
      <Navbar />
      <div className="card">
        <div className="card-body text-center">
         <Box display="flex" alignItems="center" gap="10px" className='mg-down-10'>
          <Box flex="80%" className='text-center'><h3>{iqaNo} : Audit Schedule List</h3></Box>
          <Box flex="20%">
            <SelectPicker options={iqaOptions} label="IQA No"
            value={iqaOptions && iqaOptions.length >0 && iqaOptions.find(option => option.value === iqaId) || null}
             handleChange={(newValue) => {onIqaChange( newValue?.value) }}/>
          </Box>
         </Box>
          <div id="card-body customized-card">
          {isBoth?
            <>
            <Tabs className="max-h35" value={selectedTab} onChange={handleTabChange} aria-label="inspection tabs"  variant="fullWidth" >
              <Tab className='mgt8' icon={<i className="material-icons">sort</i>} iconPosition="start"  label={ <span style={{ display: 'flex', alignItems: 'center' }}>Auditee Schedule List<Badge showZero badgeContent = {Number(auditeeList.length)}  color="error" className="badge-position"/></span>}  />
              <Tab className='mgt8' icon={<i className="material-icons">sort</i>} iconPosition="start"  label={ <span style={{ display: 'flex', alignItems: 'center' }}>Auditor Schedule List<Badge showZero badgeContent = {Number(auditorList.length)}  color="error" className="badge-position"/></span>} />
            </Tabs>
            {selectedTab === 0 &&(<Datatable columns={columns} data={auditeeList} />)}
            {selectedTab === 1 &&(<Datatable columns={columns} data={auditorList} />)}</>
          :<Datatable columns={columns} data={filScheduleList} />}
            
          </div>
        </div>
      </div>
       <ReturnDialog open={showModal} onClose={handleReturnDialogClose} onConfirm={handleReturnDialogConfirm} heading ={heading}/>
    </div>
  );

}
export default withRouter(ScheduleApprovalComponent);