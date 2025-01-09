import React, { useEffect, useState,useRef } from "react";
import { getIqaAuditeelist,getCarList,updateCorrectiveAction,uploadCarAttachment,givePreview,downloadCarFile,forwardCar,carApproveEmpData,returnCarReport } from "services/audit.service";
import { getIqaDtoList } from "services/audit.service";
import { Box, TextField,Grid,Card,CardContent,Tooltip,Button} from '@mui/material';
import Navbar from "components/Navbar/Navbar";
import './corrective-action-list.css'
import AlertConfirmation from "common/AlertConfirmation.component";
import withRouter from "common/with-router";
import SelectPicker from "components/selectpicker/selectPicker";
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { format } from "date-fns";
import * as Yup from "yup";
import { Field, Formik, Form  } from "formik";
import CarReportPrint from "components/prints/qms/carReport-Print";
import ReturnDialog from "components/Login/returnDialog.component";

  const scheduleValidation = Yup.object().shape({
    completionDate: Yup.date().required('Completion Date is required'),
    rootCause      : Yup.string().required('Root Cause is Required').min(2,'Root Cause must be at least 2 characters').max(990,'Root Cause must not exceed 990 characters')
    .matches( /^[a-zA-Z0-9_ ,.\n]*$/,"Root Cause can only contain letters, numbers, and underscores")
    .test("no-trailing-space", "Root Cause cannot end with a space", (value) => !/\s$/.test(value))
    .test( "no-leading-space","Root Cause cannot start with a space",(value) => !/^\s/.test(value)),

    correctiveActionTaken  : Yup.string().required('Corrective Action Taken is Required').min(2,'Corrective Action Taken must be at least 2 characters').max(990,'Corrective Action Taken must not exceed 990 characters')
    .matches( /^[a-zA-Z0-9_ ,.\n]*$/,"Corrective Action Taken can only contain letters, numbers, and underscores")
    .test("no-trailing-space", "Corrective Action Taken cannot end with a space", (value) => !/\s$/.test(value))
    .test( "no-leading-space","Corrective Action Taken cannot start with a space",(value) => !/^\s/.test(value)),
  });


const CorrectiveActionReport = ({router}) => {

  const {navigate,location} = router;

  const [isReady, setIsReady] = useState(false);
  const [isAddMode,setIsAddMode] = useState(true);
  const [auditeeOptions,setAuditeeOptions] = useState([]);
  const [auditeeId,setAuditeeId] = useState('');
  const [auditeeName,setAuditeeName] = useState('');
  const [headName,setHeadName] = useState('');
  const [headId,setHeadId] = useState(0);
  const [iqaOptions,setIqaOptions] = useState([])
  const [iqaId,setIqaId] = useState('');
  const [iqaNo,setIqaNo] = useState('');
  const [iqaList,setIqaList] = useState([]);
  const [iqaAuditeeList,setIqaAuditeeList] = useState([])
  const [carList,setCarList] = useState([])
  const [filCarList,setFilCarList] = useState([])
  const [schFromDate,setSchFromDate] = useState(new Date())
  const [schToDate,setSchToDate] = useState(new Date());
  const [carId,setCarId] = useState(0);
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [completionDate,setCompletionDate] = useState(dayjs(new Date()));
  const [element,setElement] = useState('')
  const [loginRoleName,setLoginRoleName] = useState('')
  const [loginEmpId,setLoginEmpId] = useState(0);
  const [isAdmin,setIsAdmin] = useState(false)
  const [initEmpData,setInitEmpData] = useState([])
  const [recEmpData,setRecEmpData] = useState([])
  const [approvedEmpData,setApprovedEmpData] = useState([])
  const [heading,setHeading] = useState('')
  const [showModal, setShowModal] = useState(false);
  const [flag,setFlag] = useState('')
  const [initialValues,setInitialValues] = useState({
      carRefNo              : '',
      correctiveActionId    : '',
      attachmentName        : '',
      rootCause             : '',
      correctiveActionTaken : '',
      completionDate        : completionDate.$d,
  });

  const statusColors = {
    'INI' : 'initiated',
    'FWD' : 'forwarde',
    'CRH' : 'returned',
    'CMR' : 'returned',
    'CRM' : 'lead-auditee',
    'CAP' : 'acknowledge',
  }


    useEffect(() => {
      fetchData();
    }, [isReady]);

  const fetchData = async () => {
    try {
      const iqaList       = await getIqaDtoList();
      const auditee       = await getIqaAuditeelist();
      const totalCarList  = await getCarList();

      const role = localStorage.getItem('roleName')
      const empId = Number(localStorage.getItem('empId'))

      setLoginRoleName(role)
      setLoginEmpId(empId)

      setCarList(totalCarList)
      setIqaAuditeeList(auditee)

      const iqaData = iqaList.map(data => ({
        value : data.iqaId,
        label : data.iqaNo
      }));
      setIqaList(iqaList)
      setIqaOptions(iqaData)
      let fiCarList = [];
      let iqa = null;
      if(iqaList.length >0){
         iqa = iqaList[0];
        setIqaId(iqa.iqaId);
        setIqaNo(iqa.iqaNo);
        setSchFromDate(new Date(iqa.fromDate))
        setSchToDate(new Date(iqa.toDate))
        const filAuditee =  auditee.filter(data => data.iqaId === iqa.iqaId)

        const revisionData = filAuditee.map(data => ({
          value : data.auditeeId,
          label : data.projectShortName !== ''?data.projectShortName:data.divisionName !== ''?data.divisionName:data.groupName,
        }));
        setAuditeeOptions(revisionData)
        if(filAuditee.length > 0){
          const audit =  filAuditee[0];
          setAuditeeId(filAuditee[0].auditeeId)
          setAuditeeName(audit.projectShortName !== ''?audit.projectShortName:audit.divisionName !== ''?audit.divisionName:audit.groupName)
          setHeadName(audit.projectShortName !== ''?audit.projectDirectorName:audit.divisionName !== ''?audit.divisionHeadName:audit.groupHeadName)
          setHeadId(audit.projectShortName !== ''?audit.projectDirectorId:audit.divisionName !== ''?audit.divisionHeadId:audit.groupHeadId)

          fiCarList = totalCarList.filter(data => data.iqaId === iqa.iqaId && data.auditeeId === filAuditee[0].auditeeId && data.actionPlan !== '')
          setFilCarList(fiCarList);
          //setInitiValues(fiCarList,emp,new Date(iqa.fromDate));
        }
      }
      if(['Admin','Director','MR','MR Rep'].includes(String(role))){
        setIsAdmin(true);
        setFilCarList(fiCarList);
       }else{
        const filList = fiCarList.filter(({auditeeEmpId,responsibility}) => Number(auditeeEmpId) === empId || Number(responsibility) === empId);
        setFilCarList(filList);
        setIsAdmin(false);
       }

      setIsReady(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };



  const afterSubmit = async()=>{
    const totalCarList  = await getCarList();
    setCarList(totalCarList)
    const fiCarList = totalCarList.filter(data => data.iqaId === iqaId && data.auditeeId === auditeeId && data.actionPlan !== '')
    if(isAdmin){
      setFilCarList(fiCarList)
    }else{
      const filList = fiCarList.filter(({auditeeEmpId,responsibility}) => Number(auditeeEmpId) === loginEmpId || Number(responsibility) === loginEmpId);
      setFilCarList(filList);
    }
   
    const empData = await carApproveEmpData(element.correctiveActionId);
    setApproveData(empData)
    const eleData = fiCarList.filter(data => data.correctiveActionId === element.correctiveActionId)?.[0]
    setElement(eleData)
    setIsAddMode(false);
    setShowModal(false);
  }

  const onAuditeeChange = (value)=>{
    setAuditeeId(value)
    const fiCarList = carList.filter(data => data.iqaId === iqaId && data.auditeeId === value && data.actionPlan !== '');
    if(isAdmin){
      setFilCarList(fiCarList)
    }else{
      const filList = fiCarList.filter(({auditeeEmpId,responsibility}) => Number(auditeeEmpId) === loginEmpId || Number(responsibility) === loginEmpId);
      setFilCarList(filList);
    }
    const audit = iqaAuditeeList.filter(data => data.auditeeId === Number(value));
    if(audit && audit.length > 0){
      setAuditeeName(audit[0].projectShortName !== ''?audit[0].projectShortName:audit[0].divisionName !== ''?audit[0].divisionName:audit[0].groupName)
      setHeadName(audit[0].projectShortName !== ''?audit[0].projectDirectorName:audit[0].divisionName !== ''?audit[0].divisionHeadName:audit[0].groupHeadName)
      setHeadId(audit[0].projectShortName !== ''?audit[0].projectDirectorId:audit[0].divisionName !== ''?audit[0].divisionHeadId:audit[0].groupHeadId)
    }

  }

  const onIqaChange = (value)=>{
    setIqaId(value);
    const filAuditee =  iqaAuditeeList.filter(data => data.iqaId === value)
    

    const revisionData = filAuditee.map(data => ({
      value : data.auditeeId,
      label : data.projectShortName !== ''?data.projectShortName:data.divisionName !== ''?data.divisionName:data.groupName,
    }));
    setAuditeeOptions(revisionData)

    const iqa = iqaList.filter(data => Number(data.iqaId) === Number(value));
    if(iqa && iqa.length > 0){
      setIqaNo(iqa[0].iqaNo)
      setSchFromDate(new Date(iqa[0].fromDate))
      setSchToDate(new Date(iqa[0].toDate))
      const fiCarList = carList.filter(data => data.iqaId === value && data.auditeeId === auditeeId && data.actionPlan !== '')
      if(isAdmin){
        setFilCarList(fiCarList)
      }else{
        const filList = fiCarList.filter(({auditeeEmpId,responsibility}) => Number(auditeeEmpId) === loginEmpId || Number(responsibility) === loginEmpId);
        setFilCarList(filList);
      }
    }


  }

  const handleSubmitClick = async (values) => {
      if(!selectedFile && element.carAttachment === ""){
        Swal.fire({
          icon: "error",
          title: 'Please Add Attachment',
          showConfirmButton: false,
          timer: 2500
        });
      }else{
        values.correctiveActionId = carId;
        values.carRefNo = element.carRefNo;
        await AlertConfirmation({
          title: isAddMode?'Are you sure Add Corrective Action ?':'Are you sure Edit Corrective Action?' ,
          message: '',
          }).then(async (result) => {
          if (result) {
            try {
                    let result = null;
                    if(selectedFile){
                      values.attachmentName = selectedFile.name;
                      result = await uploadCarAttachment(values,selectedFile);
                    }else{
                      result = await updateCorrectiveAction(values);
                    }
                  if (result.status === 'S') {
                    afterSubmit();
                    fileInputRef.current.value = ''
                    setSelectedFile(null);
                    Swal.fire({
                      icon: "success",
                      title: isAddMode?'Corrective Actions Added Successfully':'Corrective Actions Updated Successfully' ,
                      showConfirmButton: false,
                      timer: 1500
                    });
                  } else {
                    Swal.fire({
                      icon: "error",
                      title: isAddMode?'Corrective Actions Add Unsuccessful':'Corrective Actions Update Unsuccessful' ,
                      showConfirmButton: false,
                      timer: 1500
                    });
                  }
      
            } catch (error) {
              Swal.fire('Error!', 'There was an issue adding the CAR.', 'error');
            }
          }
        });
      }

  };

  const getCarReport = async (item)=>{
    const empData = await carApproveEmpData(item.correctiveActionId);
    setApproveData(empData)
    setElement(item)
    if(item.carAttachment !== ""){
      setIsAddMode(false)
      setCompletionDate(dayjs(new Date(item.carCompletionDate)))
      setInitialValues(prev => ({
        ...prev,
        rootCause             : item.rootCause,
        correctiveActionTaken : item.correctiveActionTaken,
        completionDate        : completionDate.$d,
      }));
    }else{
      setCompletionDate(dayjs(new Date()))
      setInitialValues(prev => ({
        ...prev,
        rootCause             : '',
        correctiveActionTaken : '',
        completionDate        : completionDate.$d,
      }));
      setIsAddMode(true)
    }
    setCarId(prevId => prevId === item.correctiveActionId?null:item.correctiveActionId);

  }

  const setApproveData = (list)=>{
    const iniData = list.filter(({auditStatus}) => auditStatus === 'FWD')
    const recData = list.filter(({auditStatus}) => auditStatus === 'CRM')
    const apvData = list.filter(({auditStatus}) => auditStatus === 'CAP')
    if(iniData.length > 0){
      setInitEmpData([iniData[0].empName,iniData[0].transactionDate,iniData[0].remarks])
    }else{
      setInitEmpData([])
    }

    if(recData.length > 0){
      setRecEmpData([recData[0].empName,recData[0].transactionDate,recData[0].remarks])
    }else{
      setRecEmpData([])
    }

    if(apvData.length > 0){
      setApprovedEmpData([apvData[0].empName,apvData[0].transactionDate,apvData[0].remarks])
    }else{
      setApprovedEmpData([])
    }
  }

  const onSelectFile = (event) => {
    if(event.target.files){
      const file = event.target.files[0];
      if(file.size>200485760){
        setSelectedFile(null)
        Swal.fire({
          icon: "error",
          title: 'Maximum file upload size is 200Mb !!!',
          showConfirmButton: false,
          timer: 2500
        });
      }else{
          setSelectedFile(file);
      } 
    }else{
      setSelectedFile(null)
    } 
};

  const downloadAtachment = async (item)=>{
    if(item.carAttachment !== ''){
      const EXT= item.carAttachment.slice(item.carAttachment.lastIndexOf('.')+1);
      const response =   await downloadCarFile(item.carAttachment,item.carRefNo);
      givePreview(EXT,response,item.carAttachment);
    }else{
      Swal.fire({
        icon: "warning",
        title: 'Please Attach Document' ,
        showConfirmButton: false,
        timer: 1500
      });
    }
  }

  const scheduleReturn = (flag)=>{
    if(flag === 'F'){
      if(element.auditStatus === 'FWD'){
        setHeading('Please, Add Your Recommend Message Here.')
      }else if(element.auditStatus === 'CRM'){
        setHeading('Please, Add Your Approve Message Here.')
      }
    }else{
        setHeading('Please, Add Your Return Message Here.')
    }
    setFlag(flag)
    setShowModal(true);
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
      if(flag === 'F'){
        element.message = message;
        forwardCarReport();
      }else{
        await AlertConfirmation({
          title: 'Are you sure Return CAR Report ?',
          message: '',
          }).then(async (result) => {
          if (result) {
            try {
             element.message = message
             const response = await returnCarReport(element);
             if(response.status === 'S'){
              afterSubmit(element);
              setShowModal(false);
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
                Swal.fire('Error!', 'There was an issue Returning the CAR Report.', 'error');
              }
          }
        })
      }

    }
   }

  const handleReturnDialogClose = ()=>{
    setShowModal(false);
  }

  const forwardCarReport = async ()=>{
    element.headId = Number(headId);
      await AlertConfirmation({
        title: element.auditStatus === 'FWD'?'Are you sure Recommend CAR Report ?':element.auditStatus === 'CRM'?'Are you sure Approve CAR Report ?':'Are you sure Forward CAR Report ?' ,
        message: '',
        }).then(async (result) => {
          if(result){
            try {
            const response = await forwardCar(element);
            if(response.status === 'S'){
              afterSubmit();
              Swal.fire({
                icon: "success",
                title: element.auditStatus === 'FWD'?'CAR Report Recommended Successfully!':element.auditStatus === 'CRM'?'CAR Report Approved Successfully!':'CAR Report Forwarded Successfully!',
                showConfirmButton: false,
                timer: 1500
              });
            } else {
              Swal.fire({
                icon: "error",
                title: element.auditStatus === 'FWD'?'CAR Report Recommend Unsuccessful!':element.auditStatus === 'CRM'?'CAR Report Approve Unsuccessful!':'CAR Report Forward Unsuccessful!',
                showConfirmButton: false,
                timer: 1500
              });
            }
          } catch (error) {
            Swal.fire('Error!', 'There was an issue Forwarding the CAR Report.', 'error');
          }
          }
        })
    }

    const openTran = (item)=>{
      item.iqaNo = iqaNo;
      item.divisionGroupCode = auditeeName;
      localStorage.setItem('scheduleData', JSON.stringify(item));
      window.open('/car-report-tran', '_blank');
    }
  
  return (
    <div>
      <Navbar />
      <div className="card">
        <div className="card-body text-center">
         <Box display="flex" alignItems="center" gap="10px" className='mg-down-10'>
          <Box flex="73%" className='text-center'><h3>{'CAR Report - '+iqaNo+' - '+auditeeName+' - '+format(new Date(schFromDate),'dd-MM-yyyy')+' - '+format(new Date(schToDate),'dd-MM-yyyy')}</h3></Box>
          <Box flex="12%">
            <SelectPicker options={iqaOptions} label="IQA No"
            value={iqaOptions && iqaOptions.length >0 && iqaOptions.find(option => option.value === iqaId) || null}
             handleChange={(newValue) => {onIqaChange( newValue?.value) }}/>
          </Box>
          <Box flex="15%">
            <SelectPicker options={auditeeOptions} label="Division/Group" 
            value={auditeeOptions && auditeeOptions.length >0 && auditeeOptions.find(option => option.value === auditeeId) || null}
             handleChange={(newValue) => {onAuditeeChange( newValue?.value) }}/>
          </Box>
         </Box>
          <div id="card-body customized-card">
          <Grid container spacing={2}>
            <Grid item xs={12} md={12}>
             <Card>
              <CardContent className="card-content mg-b-10 " >
               <table className="table table-responsive">
                <thead className="table-light">
                  <tr>
                    <th scope="col" className="text-center width15">CAR Ref No</th>
                    <th scope="col" className="text-center width22">Description</th>
                    <th scope="col" className="text-center width25">Action Plan</th>
                    <th scope="col" className="text-center width15">Responsibility</th>
                    <th scope="col" className="text-center width10">Status</th>
                    <th scope="col" className="text-left width13">&emsp;Target Date</th>
                  </tr>
                </thead>
               <tbody >
                {filCarList && filCarList !== null && filCarList.length > 0? filCarList.map((obj, i) => {
                  return(  
                    <>              
                    <tr  className="table-active box-border">
                      <td  className="text-left  box-border"><span className="fn-bold">{obj.carRefNo}</span></td>
                      <td  className="text-left  box-border"><span className="fn-bold">{obj.carDescription}</span></td>
                      <td  className="text-left box-border"><span className="fn-bold">{obj.actionPlan}</span></td>
                      <td className="text-left box-border"><span className="fn-bold">{obj.executiveName}</span></td>
                      <td className="text-center box-border">{obj.auditStatusName === ''?'-':<Box  className={statusColors[obj.auditStatus]} onClick = {()=>openTran(obj)}><Box class='status'>{obj.auditStatusName}<i class="material-icons float-right font-med">open_in_new</i></Box></Box>}</td>

                      <td className="text-left box-border"><span className="fn-bold">&emsp;{obj.targetDate?format(new Date(obj.targetDate),'dd-MM-yyyy'):'-'}</span>
                        <Tooltip title={carId === obj.correctiveActionId ? 'Expand less' : 'Expand more'} className="float-right">
                          <Button className="btn-styles expand-less" onClick={() => getCarReport(obj)}>{carId === obj.correctiveActionId ? 
                          (<i className="material-icons ex-less font-30" >expand_less</i>) : (<i className="material-icons ex-more font-30" >expand_more</i>
                          )}</Button>
                        </Tooltip>
                      </td>
                    </tr>
                    {carId === obj.correctiveActionId && 
                    <tr  ><td colSpan={6}>
                    <Formik initialValues={initialValues} validationSchema={scheduleValidation} enableReinitialize  onSubmit={async (values) => { await handleSubmitClick(values);}}>
                    {({setFieldValue,isValid,isSubmitting,dirty ,errors,touched, }) =>(
                     <Form>
                     <Box display="flex" alignItems="center" gap="10px" className='mg-down-10'>
                      <Box flex="2%"></Box>
                      <Box flex="96%">
                       <table className="table table-responsive">
                        <tbody >
                          <tr>
                          <td  className="text-left  box-border width13"><span className="fn-bold">CAR Ref No </span></td>
                          <td   className="text-left  box-border width21"><span className="fw-500">{obj.carRefNo}</span></td>
                          <td   className="text-left box-border width13"><span className="fn-bold">CAR SL No </span></td>
                          <td   className="text-left box-border width21"><span className="fw-500"></span></td>
                          <td  className="text-left  box-border width13"><span className="fn-bold">CAR Date </span></td>
                          <td   className="text-left  box-border width21"><span className="fw-500">{obj.carDate && format(new Date(obj.carDate),'dd-MM-yyyy')}</span></td>
                        </tr>
                        <tr>
                          <td   className="text-left box-border width13"><span className="fn-bold">Group/Division/project </span></td>
                          <td   className="text-left box-border width21"><span className="fw-500">{auditeeName}</span></td>
                          <td  className="text-left  box-border width13"><span className="fn-bold">Group/Division/project Director Name</span></td>
                          <td   className="text-left  box-border width21"><span className="fw-500">{headName}</span></td>
                          <td   className="text-left box-border width13"><span className="fn-bold">Primary Executive</span></td>
                          <td   className="text-left box-border width21"><span className="fw-500">{obj.executiveName}</span></td>
                        </tr>
                        <tr>
                          <td  className="text-left  box-border width13"><span className="fn-bold">Description </span></td>
                          <td  className="text-left  box-border width21"><span className="fw-500">{obj.carDescription}</span></td>
                          <td  className="text-left  box-border width13"><span className="fn-bold">Action </span></td>
                          <td  className="text-left  box-border width21"><span className="fw-500">{obj.actionPlan}</span></td>
                          <td  className="text-left  box-border width13"><span className="fn-bold">Target Date </span></td>
                          <td  className="text-left  box-border width21"><span className="fw-500">{obj.targetDate && format(new Date(obj.targetDate),'dd-MM-yyyy')}</span></td>
                        </tr>
                        </tbody>
                       </table>
                       <span className="fw-500 float-left">Primary Executive :</span>
                       <table className="table table-responsive">
                        <tbody >
                          <tr>
                          <td  className="text-left  box-border width14"><span className="fn-bold">Attachment{obj.carAttachment !== '' && <button type="button" className=" btn btn-outline-success btn-sm me-1 float-right" onClick={() => downloadAtachment(obj)}  title= {obj.carAttachment === ''?'Attach Document':obj.carAttachment}> <i className="material-icons"  >download</i></button>}</span></td>
                          {/* <td  className="text-left  box-border width14"><span className="fn-bold">Attachment : <Box  className="float-right attachment" onClick={() => downloadAtachment(obj)}  title= {obj.carAttachment === ''?'Attach Document':obj.carAttachment}>{obj.carAttachment !== '' && obj.carAttachment}</Box></span></td> */}
                          <td  className="text-left  box-border width14"><span className="fn-bold">Completion Date </span></td>
                          <td   className="text-left box-border width13 " ><span className="fn-bold ">Root Cause </span></td>
                          <td   className="text-left box-border width59" >
                            <Field name="rootCause" id="standard-basic" as={TextField} label="Root Cause" variant="outlined" fullWidth size="small" margin="normal" 
                            multiline minRows={1} maxRows={5} error={Boolean(touched.rootCause && errors.rootCause)} helperText={touched.rootCause && errors.rootCause}></Field>
                          </td>
                        </tr>
                        <tr>
                          <td   className="text-left  box-border ">
                              <input type="file" ref={fileInputRef}  onChange={(event) => onSelectFile(event)} /> 
                          </td>
                          <td  className="text-left  box-border ">
                          <Field name="completionDate">
                            {({ field, form }) => (
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <div className="completionDate">
                                <DatePicker format='DD-MM-YYYY' value={completionDate} label="Completion Date" views={['year', 'month', 'day']}
                                    onChange={(newValue) => {setFieldValue("completionDate", newValue ? newValue.$d : '');  }}
                                     slotProps={{ textField: { size: 'small' } }}/></div>
                                </LocalizationProvider>
                            )}
                            </Field>
                          </td>
                          <td className="text-left box-border width13" ><span className="fn-bold ">Corrective Action Taken </span></td>
                          <td className="text-left box-border width59" >
                            <Field name="correctiveActionTaken" id="standard-basic" as={TextField} label="Corrective Action Taken" variant="outlined" fullWidth size="small" margin="normal" 
                            multiline minRows={1} maxRows={5} error={Boolean(touched.correctiveActionTaken && errors.correctiveActionTaken)} helperText={touched.correctiveActionTaken && errors.correctiveActionTaken}></Field>
                          </td>
                        </tr>
                        </tbody>
                       </table>
                       <table className="table table-responsive">
                         <tbody >
                          <tr>
                            <td  className="text-center align-bottom  box-border width33 hi-80"><span className="fw-500">{initEmpData.length > 0 && <>{initEmpData[0]}<br /><span className="date-color">{format(initEmpData[1],'MMM dd, yyyy hh:mm a')}</span></>}</span></td>
                            <td   className="text-center align-bottom  box-border width33 hi-80"><span className="fw-500">{recEmpData.length > 0 && <>{recEmpData[0]}<br /><span className="date-color">{format(recEmpData[1],'MMM dd, yyyy hh:mm a')}</span></>}</span></td>
                            <td   className="text-center align-bottom box-border width33 hi-80"><span className="fw-500">{approvedEmpData.length > 0 && <>{approvedEmpData[0]}<br /><span className="date-color">{format(approvedEmpData[1],'MMM dd, yyyy hh:mm a')}</span></>}</span></td>
                          </tr>
                          <tr>
                            <td  className="text-center  box-border width33"><span className="fw-500">Signature of Primary Executive</span></td>
                            <td   className="text-center  box-border width33"><span className="fw-500">Signature of Project/Group Director</span></td>
                            <td   className="text-center box-border width33"><span className="fw-500">Signature of MR</span></td>
                          </tr>
                         </tbody>
                       </table>
                      </Box>
                      <Box flex="2%"></Box>
                     </Box>
                     { isAddMode? <Box className='text-center mg-top-10'><Button type="submit" variant="contained" className="submit" disabled = {!isValid || isSubmitting  }>Submit</Button></Box>:
                    <>{['INI','CRH','CMR'].includes(obj.auditStatus) && <Box className='text-center mg-top-10'><Button type="submit" variant="contained" className="btn edit bt-sty" disabled = {!isValid || isSubmitting  }>Update</Button>
                      <Button type="button" variant="contained" className="btn back mg-l-10" onClick={forwardCarReport}>Forward</Button></Box>}</>}
                      { obj.auditStatus === 'FWD' && Number(loginEmpId) === Number(headId) && <Box className='text-center mg-top-10'><Button type="submit" variant="contained" className="btn edit bt-sty" disabled = {!isValid || isSubmitting  }>Update</Button>
                      <Button type="button" variant="contained" className="btn bt-error-color mg-l-10" onClick={()=> scheduleReturn('R')}>Return</Button>
                      <Button type="button" variant="contained" className="btn back mg-l-10" onClick={()=> scheduleReturn('F')}>Recommend</Button></Box>}
                      { obj.auditStatus === 'CRM' && isAdmin && <Box className='text-center mg-top-10'><Button type="submit" variant="contained" className="btn edit bt-sty" disabled = {!isValid || isSubmitting  }>Update</Button>
                      <Button type="button" variant="contained" className="btn bt-error-color mg-l-10" onClick={()=> scheduleReturn('R')}>Return</Button>
                      <Button type="button" variant="contained" className="btn bt-success-color mg-l-10" onClick={()=> scheduleReturn('F')}>Approve</Button></Box>}
                      
                     </Form>
                    )}
                    </Formik>
                    <Box > 
                  <button className="btn btn-dark" onClick={() => CarReportPrint(filCarList,iqaNo,auditeeName,schFromDate,schToDate,carId,auditeeName,headName,initEmpData,recEmpData,approvedEmpData)} title="Print" aria-label="Print AuditSchedule" >
                  PRINT
                </button>
                      </Box>
                     </td>
                     </tr>
                    }
                    </> )
                 }):(<tr  className="table-active box-border"> <td colSpan={6}  className="text-center  box-border"><span className="fn-bold">There are no records to display</span></td></tr>)}
                </tbody>
               </table>
              </CardContent>
             </Card>
            </Grid>
          </Grid>
          </div>
          <div>
         </div>
        </div>
      </div>
      <ReturnDialog open={showModal} onClose={handleReturnDialogClose} onConfirm={handleReturnDialogConfirm} heading ={heading}/>
    </div>
  );

}
export default withRouter(CorrectiveActionReport);