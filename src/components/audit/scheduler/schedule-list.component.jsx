import React, { useEffect, useState } from "react";
import { addSchedule, editScheduleSubmit,getScheduleList,getTeamList,reScheduleSubmit,getIqaDtoList,getIqaAuditeelist,forwardSchedule,scheduleMailSend,
         AuditRescheduleDto,getTotalTeamMembersList,rescheduleMailSend,getScheduleRemarks } from "../../../services/audit.service";
import Datatable from "../../datatable/Datatable";
import { Box, Typography, Button, TextField,Autocomplete, ListItemText } from '@mui/material';
import Navbar from "../../Navbar/Navbar";
import '../auditor-list.component.css';
import '../../datatable/Datatable.css'
import Swal from 'sweetalert2';
import { format } from "date-fns";
import dayjs from 'dayjs';
import { Field, Formik, Form  } from "formik";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import * as Yup from "yup";
import SelectPicker from "components/selectpicker/selectPicker";
import { CustomMenuItem } from "../../../services/auth.header";
import AlertConfirmation from "../../../common/AlertConfirmation.component";
import withRouter from "../../../common/with-router";
import auditCheckListPdf from "components/prints/qms/auditCheck-list-print";
import AuditSchedulePrint from "components/prints/qms/auditSchedule-print";


const ScheduleListComponent = ({router}) => {

  const {navigate,location} = router;

  const [showModal, setShowModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [scheduleList,setScheduleList] = useState([]);
  const [filScheduleList,setFilScheduleList] = useState([]);
  const [filFullScheduleList,setFilFullScheduleList] = useState([]);
  const [teamList,setTeamList] = useState([]);
  const [filTeamList,setFilTeamList] = useState([]);
  const [scdDate,setScdDate] = useState(dayjs(new Date()).hour(9).minute(30));
  const [isAddMode,setIsAddMode] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [isReschedule,setIsReschedule] = useState(false);
  const [iqaFullList,setIqaFullList] = useState([]);
  const [iqaOptions,setIqaOptions] = useState([]);
  const [iqaNo,setIqaNo] = useState('');
  const [iqaId,setIqaId] = useState('');
  const [iqaFromDate,setIqaFromDate] = useState(dayjs(new Date()));
  const [iqaToDate,setIqaToDate] = useState(dayjs(new Date()));
  const [fullAuditeeList,setFullAuditeeList] = useState([]);
  const [auditeeList,setAuditeeList] = useState([]);
  const [filauditeeList,setFilAuditeeList] = useState([]);
  const [forwardFlag,setForwardFlag] = useState(false);
  const [element,setElement] = useState('');
  const [teamMemberDetails,setTeamMemberDetails] = useState([]);
  const [filTeamMemberDetails,setFilTeamMemberDetails] = useState([]);
  const [filMembersTotalData,setFilMembersTotalData] = useState([]);
  const [totalAuditeeCount,setTotalAuditeeCount] = useState(0);
  const [assignedAuditeeCount,setAssignedAuditeeCount] = useState(0);
  const [pendingAuditeeCount,setPendingAuditeeCount] = useState(0);
  const [schRemarks,setSchRemarks] = useState([]);
  const [filSchRemarks,setFilSchRemarks] = useState([]);
  const [isSubmit,setIsSubmit] = useState(false)

  const scheduleValidation = Yup.object().shape({
    scheduleDate: Yup.date().required('Schedule Date is required'),
    auditeeId   : Yup.string().required('Auditee is required'),
    teamId      : Yup.string().required('Team is required'),
});

  const [initialValues,setInitialValues] = useState({
    scheduleId   : '',
    scheduleDate : '',
    auditeeId    : '',
    teamId       : '',
    iqaId        : '',
    revision     : '',
    remarks      : 'NA',
  });


  const columns = [
    { name: 'SN', selector: (row) => row.sn, sortable: true, grow: 1, align: 'text-center', width: '3%'  },
    { name: 'Date & Time (Hrs)', selector: (row) => row.date, sortable: true, grow: 2, align: 'text-center', width: '11%'  },
    { name: 'Division/Group', selector: (row) => row.divisionCode, sortable: true, grow: 2, align: 'text-center', width: '15%'  },
    { name: 'Project', selector: (row) => row.project, sortable: true, grow: 2, align: 'text-center', width: '19%'  },
    { name: 'Auditee', selector: (row) => row.auditee, sortable: true, grow: 2, align: 'text-start', width: '17%'  },
    { name: 'Team', selector: (row) => row.team, sortable: true, grow: 2, align: 'text-center', width: '7%'  },
    { name: 'Status', selector: (row) => row.status, sortable: true, grow: 2, align: 'text-center', width: '15%'  },
    { name: 'Revision', selector: (row) => row.revision, sortable: true, grow: 2, align: 'text-center', width: '5%'  },
    { name: 'Action', selector: (row) => row.action, sortable: true, grow: 2, align: 'text-center',  width: '8%' },
  ];

  const membercolumns = [
    { name: 'SN', selector: (row) => row.sn, sortable: true, grow: 1, align: 'text-center', width: '3%'  },
    { name: 'Auditor', selector: (row) => row.auditor, sortable: true, grow: 2, align: 'text-start', width: '22%'  },
    { name: 'Group', selector: (row) => row.group, sortable: true, grow: 2, align: 'text-start', width: '25%'  },
    { name: 'Division', selector: (row) => row.divisionCode, sortable: true, grow: 2, align: 'text-start', width: '25%'  },
    { name: 'Project', selector: (row) => row.project, sortable: true, grow: 2, align: 'text-start', width: '25%'  },
  ];



  const fetchData = async () => {
    try {
      const scdList        = await getScheduleList();
      const team           = await getTeamList();
      const iqaList        = await getIqaDtoList();
      const auditList      = await getIqaAuditeelist();
      const teamMemDetails = await getTotalTeamMembersList();
      const remarksSch     = await getScheduleRemarks();
      
      setSchRemarks(remarksSch);
      setTeamMemberDetails(teamMemDetails)
      setFullAuditeeList(auditList)
      setIqaFullList(iqaList);
      setScheduleList(scdList)
      const iqaData = iqaList.map(data => ({
                      value : data.iqaId,
                      label : data.iqaNo
                  }));
      if(iqaList.length >0){
        const iqa = iqaList[0];
        setIqaNo(iqa.iqaNo)
        setIqaId(iqa.iqaId)
        const filList = auditList.filter(data => data.iqaId === iqa.iqaId);
        setAuditeeList(filList)
        setTotalAuditeeCount(filList.length)
        setIqaFromDate(dayjs(new Date(iqa.fromDate)))
        setIqaToDate(dayjs(new Date(iqa.toDate)))
        setFilTeamList(team.filter(data => data.iqaId === iqa.iqaId));
        const scList = scdList.filter(data => data.iqaId === iqa.iqaId)
        const auditees = scList.map(data => data.auditeeId);
        setFilAuditeeList(auditList.filter(data => !auditees.includes(data.auditeeId)))
        setPendingAuditeeCount(filList.length - scList.length)
        setDataTable(scList);
      }
      setIqaOptions(iqaData)
      setTeamList(team)

      setInitialValues(prevValues =>({
        ...prevValues,
        scheduleDate : scdDate.$d
      }));
      setIsReady(true);

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isReady]);

  const setDataTable = (list)=>{
    setFilFullScheduleList(list)
    if(list.length >0 && list[0].scheduleStatus === 'INI' && (Number(totalAuditeeCount)-Number(list.length)) === 0){
      setForwardFlag(true)
    }else{
      setForwardFlag(false)
    }
    setAssignedAuditeeCount(list.length)
    //setPendingAuditeeCount(Number(totalAuditeeCount)-Number(list.length))
    const mappedData = list.map((item,index)=>{
      let statusColor = `${item.scheduleStatus === 'INI'?'initiated' : (item.scheduleStatus === 'FWD' ? 'forwarde' : item.scheduleStatus === 'ARF'?'reschedule':['ASR','ARL'].includes(item.scheduleStatus)?'returned':['ASA','AAL'].includes(item.scheduleStatus)?'lead-auditee':'acknowledge')}`;
      return{
        sn           : index+1,
        date         : format(new Date(item.scheduleDate),'dd-MM-yyyy HH:mm') || '-',
        divisionCode : item.divisionName === '' && item.groupName === '' ? '-' : item.divisionName !== '' && item.groupName !== '' ? item.divisionName + '/' + item.groupName : item.divisionName !== '' ? item.divisionName : item.groupName !== '' ? item.groupName : '-',
        project      : item.projectName === ''?'-':item.projectName || '-',
        auditee      : item.auditeeEmpName || '-',
        team         : item.teamCode || '-',
        status       : <Box className={statusColor} onClick = {()=>openTran(item)}><Box class='status'>{item.statusName}<i class="material-icons float-right font-med">open_in_new</i></Box></Box>|| '-',
        revision     : 'R'+item.revision || '-',
        action       : <> {item.scheduleStatus === 'INI' && <button className=" btn btn-outline-warning btn-sm me-1" onClick={() => editSchedule(item)}  title="Edit"> <i className="material-icons"  >edit_note</i></button>}
                          {item.scheduleStatus !== 'INI' && <button className=" btn btn-outline-info btn-sm me-1" onClick={() => reSchedule(item)}  title="ReSchedule"><i className="material-icons">update</i></button>}
                          
</>

      }      
    });

    setFilScheduleList(mappedData);
   }
  

   const openTran = (item)=>{
    localStorage.setItem('scheduleData', JSON.stringify(item));
    window.open('/schedule-tran', '_blank');
   }

   

  const setMemberTable = (list,emp) => {
        const renderListWithBreaks = (items) => items.length > 0 ? items.map((item, index) => (
                                    <React.Fragment key={index}>
                                      {item}{index < items.length - 1 && (<>, </>)}
                                    </React.Fragment>)): '-';

        const renderField = (value, isLead, isList = false,data) => {
                            const content = isList ? renderListWithBreaks(value) : value || '-';
                            const className = data.empId === emp ?'trash-btn text-bold':isLead ? 'text-color-green text-bold': 'text-bold';
                            if(data.empId === emp){
                              setIsSubmit(true)
                            }
                            return <span className={className}>{content}</span>;
                            };

        const mappedData = list.map((item, index) => ({
                            sn           : renderField(index + 1, item.isLead,false,item),
                            auditor      : renderField(item.empName, item.isLead,false,item),
                            group        : renderField(item.groups, item.isLead, true,item),
                            divisionCode : renderField(item.divisions, item.isLead, true,item),
                            project      : renderField(item.projects, item.isLead, true,item),
        }));

        setFilTeamMemberDetails(mappedData);
  };


  const hadleClose = () => {
      setModalVisible(false);
      setShowModal(false);
  }

  const scheduleAdd = ()=>{
    setIsSubmit(false)
    setFilSchRemarks([])
    const auditees = scheduleList.filter(data => data.iqaId === iqaId).map(data => data.auditeeId);
    const filList = auditeeList.filter(data => !auditees.includes(data.auditeeId));
    setFilAuditeeList(filList)
    setScdDate(dayjs(new Date(iqaFromDate.$d)).hour(9).minute(30))
    setIsReschedule(false)
    setModalVisible(true);
    setIsAddMode(true)
    setShowModal(true);
    setInitialValues({
      scheduleId   : '',
      scheduleDate : dayjs(new Date(iqaFromDate.$d)).hour(9).minute(30).$d,
      auditeeId    : filList.length >0?filList[0].auditeeId:'',
      teamId       : filTeamList.length >0?filTeamList[0].teamId:'',
      iqaId        : iqaId,
      revision     : '',
      remarks      : 'NA',
  
    })
    if(filTeamList.length >0){
      setTeamMembers(filTeamList[0].teamId,filList.length >0?filList[0].empId:0)
    }
  }

  const filAuditee =(iqaId)=>{
    const auditees = scheduleList.filter(data => data.iqaId === iqaId).map(data => data.auditeeId);
    setFilAuditeeList(auditeeList.filter(data => !auditees.includes(data.auditeeId)))
  }
  

  const editSchedule =(item) =>{
    setIsSubmit(false)
    setFilSchRemarks([])
    const auditees = scheduleList.filter(data => data.iqaId === iqaId && data.auditeeId !== item.auditeeId).map(data => data.auditeeId);
    setFilAuditeeList(auditeeList.filter(data => !auditees.includes(data.auditeeId)))
    setTeamMembers(item.teamId)
    setElement(item)
    setIsReschedule(false)
    setModalVisible(true);
    setIsAddMode(false)
    setShowModal(true);
    setScdDate(dayjs(new Date(item.scheduleDate)))
    setInitialValues({
      scheduleId   : item.scheduleId,
      scheduleDate : dayjs(new Date(item.scheduleDate)).$d,
      auditeeId    : item.auditeeId,
      teamId       : item.teamId,
      iqaId        : iqaId,
      revision     : item.revision,
      remarks      : item.remarks,
  
    })
    if(filTeamList.length >0){
      setmemberAuditee(item.teamId,item.auditeeId)
    }

  }

  const setmemberAuditee = (teamId,auditeeId)=>{
    const editAuditee = auditeeList.filter(data => data.auditeeId === auditeeId);
    setTeamMembers(teamId,editAuditee.length >0?editAuditee[0].empId:0)

  }

  const reSchedule = (item)=>{
    setIsSubmit(false)
    setFilSchRemarks([])
    setFilSchRemarks(schRemarks.filter(data =>data.scheduleId === item.scheduleId))
    const auditees = scheduleList.filter(data => data.iqaId === iqaId && data.auditeeId !== item.auditeeId).map(data => data.auditeeId);
    setFilAuditeeList(auditeeList.filter(data => !auditees.includes(data.auditeeId)))
    setTeamMembers(item.teamId)
    setElement(item)
    setModalVisible(true);
    setIsReschedule(true)
    setShowModal(true);
    setScdDate(dayjs(new Date(item.scheduleDate)))
    setInitialValues({
      scheduleId   : item.scheduleId,
      scheduleDate : dayjs(new Date(item.scheduleDate)).$d,
      auditeeId    : item.auditeeId,
      teamId       : item.teamId,
      iqaId        : iqaId,
      revision     : item.revision,
      remarks      : item.remarks,
    });
    setmemberAuditee(item.teamId,item.auditeeId)
  }

  const afterSubmit = async()=>{
    const scdList   = await getScheduleList();
    const auditList = await getIqaAuditeelist();
    const scList = scdList.filter(data => data.iqaId === iqaId)
    setDataTable(scList)
    setScheduleList(scdList)
    setFullAuditeeList(auditList)
    const filList = auditList.filter(data => data.iqaId === iqaId);
    setAuditeeList(filList)
    setTotalAuditeeCount(filList.length)
    const auditees = scdList.filter(data => data.iqaId === iqaId).map(data => data.auditeeId);
    setFilAuditeeList(auditList.filter(data => !auditees.includes(data.auditeeId)))
    setPendingAuditeeCount(filList.length - scList.length)
  }
  const handleSubmitClick = async (values) => {

      await AlertConfirmation({
      title: isReschedule ? 'Are you sure To ReSchedule and Forward ?':isAddMode?'Are you sure Add Schedule ?':'Are you sure Edit Schedule ?' ,
      message: '',
      }).then(async (result) => {
      if (result) {
        try {
          if(isReschedule){
            const result = await reScheduleSubmit(new AuditRescheduleDto(values,element));
            if (result === 'Audit Rescheduled Successfully') {
              afterSubmit();
              setShowModal(false);
              Swal.fire({
                icon: "success",
                title: "Schedule Rescheduled Successfully!",
                showConfirmButton: false,
                timer: 1500
              });
              await rescheduleMailSend(new AuditRescheduleDto(values,element));
            } else {
              Swal.fire({
                icon: "error",
                title: "Rescheduled Unsuccessful!",
                showConfirmButton: false,
                timer: 1500
              });
            }
          }else{
            if(isAddMode){
              const result = await addSchedule(values);
              if (result === 'Audit schedule Added Successfully') {
                afterSubmit();
                setShowModal(false);
                Swal.fire({
                  icon: "success",
                  title: "Schedule Added Successfully!",
                  showConfirmButton: false,
                  timer: 1500
                });
              } else {
                Swal.fire({
                  icon: "error",
                  title: "Schedule Add Unsuccessful!",
                  showConfirmButton: false,
                  timer: 1500
                });
              }
            }else{
              const result = await editScheduleSubmit(values);
              if (result === 'Audit schedule Edited Successfully') {
                afterSubmit();
                setShowModal(false);
                Swal.fire({
                  icon: "success",
                  title: "Schedule Edited Successfully!",
                  showConfirmButton: false,
                  timer: 1500
                });
              } else {
                Swal.fire({
                  icon: "error",
                  title: "Schedule Add Unsuccessful!",
                  showConfirmButton: false,
                  timer: 1500
                });
              }
            }
          }

        } catch (error) {
          Swal.fire('Error!', 'There was an issue adding the Schdule.', 'error');
        }
      }
    });
  };

  const onIqaChange = (value)=>{
    setIsSubmit(false)
    const selectedIqa = iqaFullList.find(data => data.iqaId === value);
    if(selectedIqa){
      setIqaNo(selectedIqa.iqaNo)
      setIqaFromDate(dayjs(new Date(selectedIqa.fromDate)))
      setIqaToDate(dayjs(new Date(selectedIqa.toDate)))
      filAuditee(selectedIqa.iqaId);
    }
    setIqaId(value);
    setFilTeamList(teamList.filter(data => data.iqaId === value))
    const scList = scheduleList.filter(data => data.iqaId === value)
    setDataTable(scList)
    const filList = fullAuditeeList.filter(data => data.iqaId === value);
    setAuditeeList(filList)
    setTotalAuditeeCount(filList.length)
    setPendingAuditeeCount(filList.length - scList.length)
    setFilSchRemarks([])

  }

  const scheduleForward = async ()=>{
    if(filScheduleList.length >0){
      await AlertConfirmation({
        title: 'Are you sure Forward Schedule ?' ,
        message: '',
        }).then(async (result) => {
          if(result){
            try {
            const created = filFullScheduleList.filter(data => data.scheduleStatus === 'INI')
            const response = await forwardSchedule(created.map(data => data.scheduleId));
            if(response.status === 'S'){
              afterSubmit();
              setShowModal(false);
              Swal.fire({
                icon: "success",
                title: "Schedule Forwarded Successfully!",
                showConfirmButton: false,
                timer: 1500
              });
              setForwardFlag(false)
              await scheduleMailSend(created);
            } else {
              Swal.fire({
                icon: "error",
                title: "Schedule Forward Unsuccessful!",
                showConfirmButton: false,
                timer: 1500
              });
            }
          } catch (error) {
            Swal.fire('Error!', 'There was an issue Forwarding the Schdule.', 'error');
          }
          }
        })
    }else{
       AlertConfirmation({
        title: 'Plaese Add Audit Schedule ?',
        message: '',
        })
    }
  }

  const changeAuditee = (auditee)=>{
    setIsSubmit(false)
    const audit = auditeeList.filter(data => data.auditeeId === auditee);
    setMemberTable(filMembersTotalData,audit.length >0?audit[0].empId:0)
  }

  const setTeamMembers = (teamId,auditee)=>{
    const filTeamMembers = teamMemberDetails.filter(data => data.teamId === teamId);
    setFilMembersTotalData(filTeamMembers);
    setMemberTable(filTeamMembers,auditee);
    
 }

 const changeTeam = (teamId,auditee)=>{
  setIsSubmit(false)
  const audit = auditeeList.filter(data => data.auditeeId === auditee);
  setTeamMembers(teamId,(audit.length >0?audit[0].empId:0))
 }

  return (
    <div>
      <Navbar />
      <div className="card">
        <div className="card-body text-center">
         <Box display="flex" alignItems="center" gap="10px" className='mg-down-10'>
          <Box flex="45%" className='text-center'><h3>{iqaNo} : Audit Schedule</h3></Box>
          <Box flex="45%">
            <span className="text-heading">Auditees : </span><button className="button-count total-auditee-count">{totalAuditeeCount}</button>
            <span className="text-heading">&nbsp;  Auditee Assigned : </span><button className="button-count assigned-count">{assignedAuditeeCount}</button>
            <span className="text-heading">&nbsp;  Auditee Pending : </span><button className="button-count pending-count">{pendingAuditeeCount}</button>
            <span className="text-heading">&nbsp;  Check List Print : </span>
        <button className=" btn-primary"  onClick={() =>auditCheckListPdf(iqaNo)} title="Print" aria-label="Print checklist" > <i className="material-icons">print</i> </button>
            <span className="text-heading">&nbsp; Print : </span>
            <button className=" btn-primary"  onClick={() =>AuditSchedulePrint(filScheduleList,iqaNo)} title="Print" aria-label="Print AuditSchedule" > <i className="material-icons">print</i> </button>
          </Box>
          <Box flex="10%">
            <SelectPicker options={iqaOptions} label="IQA No"
            value={iqaOptions && iqaOptions.length >0 && iqaOptions.find(option => option.value === iqaId) || null}
             handleChange={(newValue) => {onIqaChange( newValue?.value) }}/>
          </Box>
         </Box>
          <div id="card-body customized-card">
            <Datatable columns={columns} data={filScheduleList} />
          </div>
          <div>
            {!forwardFlag && pendingAuditeeCount !== 0 &&  <button className="btn add btn-name" onClick={scheduleAdd}> Add </button>}
            {forwardFlag && <button className="btn back" onClick={() => scheduleForward()}>Forward</button>}
          </div>

          {showModal && (
            <div className={`modal fade show ${modalVisible ? 'modal-visible' : ''}`} style={{ display: 'block' }} aria-modal="true" role="dialog">
              <div className="modal-dialog modal-lg modal-xl-custom">
                <div className="modal-content" >
                  <div className="modal-header bg-secondary d-flex justify-content-between bg-primary text-white">
                    <h5 className="modal-title">{isReschedule ? iqaNo +' : Audit Reschedule ('+format(new Date(iqaFromDate.$d),'dd-MM-yyyy')+' - '+format(new Date(iqaToDate.$d),'dd-MM-yyyy')+')':isAddMode?iqaNo +' : Audit Schedule Add ('+format(new Date(iqaFromDate.$d),'dd-MM-yyyy')+' - '+format(new Date(iqaToDate.$d),'dd-MM-yyyy')+')':iqaNo +' : Audit Schedule Edit ('+format(new Date(iqaFromDate.$d),'dd-MM-yyyy')+' - '+format(new Date(iqaToDate.$d),'dd-MM-yyyy')+')'} </h5>
                    <button type="button" className="btn btn-danger" onClick={hadleClose} aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>

                  <div className="modal-body model-max-height">
                  {(filSchRemarks || []).length>0?(
                    <>
                     <table className="table table-bordered table-hover">
                      <thead>
                       <tr>
                          <th className='width5'>SN</th>
                          <th className='width35'>Employee</th>
                          <th className='width60'>Remarks</th>
                       </tr>
                      </thead> 
                      {filSchRemarks.map((item,index) =>(
                        <tbody>
                          <tr key={index}>
                              <td className='width5'>{index + 1 }</td>
                              <td className='width35 text-start'>{item.empName}</td>
                              {/* <td className='width35 text-start'>{item.empName}<Box className='date-color'>{format(new Date(item.transactionDate),'MMM d, y h:mm a')}</Box></td> */}
                              <td className='width60 text-start'>{item.remarks}</td>
                          </tr>
                        </tbody>
                      ))}
                     </table>
                    </>
                       ) : ('')}<br/>
                   <Formik initialValues={initialValues} validationSchema={scheduleValidation} enableReinitialize  onSubmit={async (values) => { await handleSubmitClick(values);}}>
                        {({setFieldValue,isValid,isSubmitting,dirty ,errors,touched, }) =>(
                          <Form>
                            <Typography variant="h6" component="h4" className="panel-title" >
                            <Box display="flex" alignItems="center" gap="10px">
                                <Box flex="5%"></Box>
                                <Box flex="20%">
                                  <Field name="scheduleDate">
                                    {({ field, form }) => (
                                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DemoContainer components={['DateTimePicker']}>
                                          <DateTimePicker format='DD-MM-YYYY HH:mm' value={scdDate} label="Schedule Date & Time" views={['year', 'month', 'day', 'hours', 'minutes']} ampm={false}
                                            onChange={(newValue) => { setFieldValue("scheduleDate", newValue ? newValue.$d : ''); }}
                                            minDate={dayjs(new Date(iqaFromDate.$d))} maxDate={dayjs(new Date(iqaToDate.$d))} slotProps={{ textField: { size: 'small' } }} /></DemoContainer>
                                      </LocalizationProvider>
                                    )}
                                  </Field>
                                </Box>
                                <Box flex="40%">
                                <Field name="auditeeId">
                                        {({ field, form })=>(
                                            <Autocomplete options={filauditeeList} getOptionLabel={option => option.divisionName !== ""?option.auditee+' - '+option.divisionName:option.projectCode !== ""?option.auditee+' - '+option.projectCode:option.auditee+' - '+option.groupName} 
                                            renderOption={(props, option) => {return (
                                                <CustomMenuItem {...props} key={option.auditeeId}>
                                                  <ListItemText primary={option.divisionName !== ""?option.auditee+' - '+option.divisionName:option.projectCode !== ""?option.auditee+' - '+option.projectCode:option.auditee+' - '+option.groupName} />
                                                </CustomMenuItem>
                                              );}}
                                            value = {filauditeeList.find(auditee =>auditee.auditeeId === form.values.auditeeId) || null} 
                                             ListboxProps={{sx:{maxHeight :200,overflowY:'auto'}}}
                                            onChange={(event, newValue) => { setFieldValue("auditeeId", newValue ? newValue.auditeeId : '');changeAuditee(newValue ? newValue.auditeeId : ''); }}
                                            renderInput={(params) => (<TextField {...params} label="Auditee-Group-Division-Project"   size="small"  margin="normal" variant="outlined"
                                                    error={touched.auditeeId && Boolean(errors.auditeeId)}
                                                    helperText={touched.auditeeId && errors.auditeeId}/>)} />
                                        )}
                                </Field> 

                                </Box>
                                <Box flex="25%"> 
                                  <Field name="teamId">
                                    {({ field, form })=>(
                                        <Autocomplete options={filTeamList} getOptionLabel={option => option.teamCode} 
                                        renderOption={(props, option) => {return (
                                            <CustomMenuItem {...props} key={option.teamId}>
                                              <ListItemText primary={`${option.teamCode}`} />
                                            </CustomMenuItem>
                                          );}}
                                        value = {filTeamList.find(team =>team.teamId === form.values.teamId) || null} 
                                          ListboxProps={{sx:{maxHeight :200,overflowY:'auto'}}}
                                        onChange={(event, newValue) => { setFieldValue("teamId", newValue ? newValue.teamId : ''); changeTeam(newValue ? newValue.teamId : 0,form.values.auditeeId);}}
                                        renderInput={(params) => (<TextField {...params} label="Team"   size="small"  margin="normal" variant="outlined"
                                                error={touched.teamId && Boolean(errors.teamId)}
                                                helperText={touched.teamId && errors.teamId}/>)} />
                                    )}
                                  </Field> 
                                </Box>
                                <Box flex="5%"> </Box>
                            </Box>
           {isReschedule && <Box display="flex" alignItems="center" gap="10px">
                              <Box flex="5%"> </Box>
                              <Box flex="90%"> 
                               <Field name="remarks" id="standard-basic" as={TextField} label="Remarks" variant="outlined" fullWidth size="small" margin="normal" multiline minRows={3} maxRows={5}
                                error={Boolean(touched.remarks && errors.remarks)} helperText={touched.remarks && errors.remarks}></Field>
                              </Box>
                              <Box flex="5%"> </Box>
                            </Box>}
                            <Box className='text-center mg-top-10'><Button type="submit" variant="contained" className="submit" disabled = {!isValid || isSubmitting || isSubmit }>Submit</Button></Box>
                            </Typography>
                          </Form>
                        )}
                   </Formik><br />
                       <Datatable columns={membercolumns} data={filTeamMemberDetails} />
                  </div>
                </div>
              </div>
            </div>

          )}
        </div>
      </div>
    </div>
  );

}
export default withRouter(ScheduleListComponent);