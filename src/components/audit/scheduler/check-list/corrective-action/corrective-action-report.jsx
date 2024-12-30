import React, { useEffect, useState,useRef } from "react";
import { getIqaAuditeelist,getCarList,getEmployee,updateCorrectiveAction,uploadCarAttachment } from "services/audit.service";
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

  const scheduleValidation = Yup.object().shape({
    completionDate: Yup.date().required('Completion Date is required'),
    rootCause      : Yup.string().required('Root Cause is required'),
  });


const CorrectiveActionReport = ({router}) => {

  const {navigate,location} = router;

  const [isReady, setIsReady] = useState(false);
  const [isAddMode,setIsAddMode] = useState(true);
  const [auditeeOptions,setAuditeeOptions] = useState([]);
  const [auditeeId,setAuditeeId] = useState('');
  const [auditeeName,setAuditeeName] = useState('');
  const [headName,setHeadName] = useState('');
  const [iqaOptions,setIqaOptions] = useState([])
  const [iqaId,setIqaId] = useState('');
  const [iqaNo,setIqaNo] = useState('');
  const [iqaList,setIqaList] = useState([]);
  const [actionValue, setActionValue] = useState(new Map());
  const [dateValue, setDateValue] = useState(new Map());
  const [employees, setEmployees] = useState(new Map());
  const [actionValueValidation,setActionValueValidation] = useState([]); 
  const [isValidationActive, setIsValidationActive] = useState(false);
  const [iqaAuditeeList,setIqaAuditeeList] = useState([])
  const [carList,setCarList] = useState([])
  const [filCarList,setFilCarList] = useState([])
  const [employeeOptions,setEmployeeOptions] = useState([])
  const [totalEmployees,setTotalEmployees] = useState([])
  const [schFromDate,setSchFromDate] = useState(new Date())
  const [schToDate,setSchToDate] = useState(new Date());
  const [carId,setCarId] = useState(0);
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [completionDate,setCompletionDate] = useState(dayjs(new Date()));
  const [element,setElement] = useState('')
  const [initialValues,setInitialValues] = useState({
      carRefNo           : '',
      correctiveActionId : '',
      attachmentName     : '',
      rootCause          : '',
      completionDate     : completionDate.$d,
  });


  useEffect(() => {
    fetchData();
  }, [isReady]);

  const fetchData = async () => {
    try {
      const iqaList       = await getIqaDtoList();
      const auditee       = await getIqaAuditeelist();
      const totalCarList  = await getCarList();
      const emp           = await getEmployee();

      setCarList(totalCarList)
      setIqaAuditeeList(auditee)
      setTotalEmployees(emp)
     const empdata = emp.map(data => ({
                       value : data.empId,
                       label : data.empName+', '+data.empDesigName
                     }));
      setEmployeeOptions(empdata)  

      const iqaData = iqaList.map(data => ({
        value : data.iqaId,
        label : data.iqaNo
      }));
      setIqaList(iqaList)
      setIqaOptions(iqaData)
      if(iqaList.length >0){
        const iqa = iqaList[0];
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
          const fiCarList = totalCarList.filter(data => data.iqaId === iqa.iqaId && data.auditeeId === filAuditee[0].auditeeId && data.actionPlan !== '')
          setFilCarList(fiCarList);
          setInitiValues(fiCarList,emp,new Date(iqa.fromDate));
        }
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
    setFilCarList(fiCarList)
    setInitiValues(fiCarList,totalEmployees,schFromDate)
  }

  const setInitiValues = (list,emp,fromDate) =>{
    const initialAction = new Map();
    const initialEmployee = new Map();
    const initialDates = new Map();
    if(list.length > 0){
      if(list[0].actionPlan === ''){
        list.forEach(element => {
          setActionValueValidation(prev => [...new Set([...prev,String(element.correctiveActionId)])])
          initialEmployee.set(element.correctiveActionId,emp[0].empId)
          initialDates.set(element.correctiveActionId,dayjs(new Date(fromDate)))
        });
      }else{
        list.forEach(element => {
          initialAction.set(element.correctiveActionId,element.actionPlan)
          initialEmployee.set(element.correctiveActionId,element.responsibility)
          initialDates.set(element.correctiveActionId,dayjs(new Date(element.targetDate)))
        });
      }
    }


    setActionValue(initialAction)
    setEmployees(initialEmployee)
    setDateValue(initialDates);
  }

  const onAuditeeChange = (value)=>{
    setAuditeeId(value)
    const fiCarList = carList.filter(data => data.iqaId === iqaId && data.auditeeId === value && data.actionPlan !== '')
    setFilCarList(fiCarList)
    setInitiValues(fiCarList,totalEmployees,schFromDate)
    setIsValidationActive(false)
    //const audit = auditeeOptions.filter(data => Number(data.value) === Number(value));
    const audit = iqaAuditeeList.filter(data => data.auditeeId === Number(value));
    setAuditeeName(audit[0].projectShortName !== ''?audit[0].projectShortName:audit[0].divisionName !== ''?audit[0].divisionName:audit[0].groupName)
    setHeadName(audit[0].projectShortName !== ''?audit[0].projectDirectorName:audit[0].divisionName !== ''?audit[0].divisionHeadName:audit[0].groupHeadName)

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
    setIqaNo(iqa[0].iqaNo)
    setSchFromDate(new Date(iqa[0].fromDate))
    setSchToDate(new Date(iqa[0].toDate))
    const fiCarList = carList.filter(data => data.iqaId === value && data.auditeeId === auditeeId && data.actionPlan !== '')
    setFilCarList(fiCarList)
    setInitiValues(fiCarList,totalEmployees,new Date(iqa[0].fromDate))
    setIsValidationActive(false)


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
              Swal.fire('Error!', 'There was an issue adding the KPI.', 'error');
            }
          }
        });
      }

  };

  const getCarReport = (item)=>{
    setElement(item)
    if(item.carAttachment !== ""){
      setIsAddMode(false)
      setCompletionDate(dayjs(new Date(item.carCompletionDate)))
      setInitialValues(prev => ({
        ...prev,
        rootCause          : item.rootCause,
        completionDate     : completionDate.$d,
      }));
    }else{
      setIsAddMode(true)
    }
    setCarId(prevId => prevId === item.correctiveActionId?null:item.correctiveActionId);

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
                    <th scope="col" className="text-center width30">Action Plan</th>
                    <th scope="col" className="text-center width20">Responsibility</th>
                    <th scope="col" className="text-left width13">&emsp;Target Date</th>
                  </tr>
                </thead>
               <tbody >
                {filCarList.length > 0? filCarList.map((obj, i) => {
                  return(  
                    <>              
                    <tr  className="table-active box-border">
                      <td  className="text-left  box-border"><span className="fn-bold">{obj.carRefNo}</span></td>
                      <td  className="text-left  box-border"><span className="fn-bold">{obj.carDescription}</span></td>
                      <td  className="text-left box-border"><span className="fn-bold">{obj.actionPlan}</span>
                      </td>
                      <td className="text-left box-border"><span className="fn-bold">{obj.executiveName}</span>
                      </td>
                      <td className="text-left box-border"><span className="fn-bold">&emsp;{obj.targetDate?format(new Date(obj.targetDate),'dd-MM-yyyy'):'-'}</span>
                        <Tooltip title={carId === obj.correctiveActionId ? 'Expand less' : 'Expand more'} className="float-right">
                          <Button className="btn-styles expand-less" onClick={() => getCarReport(obj)}>{carId === obj.correctiveActionId ? 
                          (<i className="material-icons ex-less font-30" >expand_less</i>) : (<i className="material-icons ex-more font-30" >expand_more</i>
                          )}</Button>
                        </Tooltip>
                      </td>
                    </tr>
                    {carId === obj.correctiveActionId && 
                    <tr  ><td colSpan={5}>
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
                          <td  className="text-left  box-border width13"><span className="fn-bold">Evidence/Attachment </span></td>
                          <td   className="text-left  box-border width21">
                              <input type="file" ref={fileInputRef}  onChange={(event) => onSelectFile(event)} /> 
                          </td>
                          <td   className="text-left box-border width13"><span className="fn-bold">Root Cause : </span></td>
                          <td   className="text-left box-border width21">
                            <Field name="rootCause" id="standard-basic" as={TextField} label="Root Cause" variant="outlined" fullWidth size="small" margin="normal"
                            error={Boolean(touched.rootCause && errors.rootCause)} helperText={touched.rootCause && errors.rootCause}></Field>
                          </td>
                          <td  className="text-left  box-border width13"><span className="fn-bold">Completion Date </span></td>
                          <td  className="text-left  box-border width21">
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
                        </tr>
                        </tbody>
                       </table>
                       {/* <table className="table table-responsive">
                         <tbody >
                          <tr>
                            <td  className="text-left  box-border width20"><span className="fn-bold">Evidence/Attachment</span></td>
                            <td   className="text-left  box-border width30"><span className="fw-500"></span></td>
                            <td  className="text-left  box-border width20"><span className="fn-bold">Target date for completion of correction and corrective action</span></td>
                            <td   className="text-left  box-border width30"><span className="fw-500">{obj.targetDate && format(new Date(obj.targetDate),'dd-MM-yyyy')}</span></td>
                          </tr>
                          <tr>
                          <td  className="text-left  box-border width20"><span className="fn-bold">Root Cause : </span></td>
                          <td   className="text-left  box-border width30"><span className="fw-500"></span></td>
                          <td  className="text-left  box-border width20"><span className="fn-bold">Proposed Corrective Actions by Primary Executive</span></td>
                          <td   className="text-left  box-border width30"><span className="fw-500">{obj.actionPlan}</span></td>
                          </tr>
                         </tbody>
                       </table>
                       <span className="fw-500 float-left">Corrective Action Taken :</span>
                       <table className="table table-responsive">
                         <tbody >
                          <tr>
                            <td  className="text-center  box-border width35"><span className="fn-bold">Action</span></td>
                            <td   className="text-center  box-border width35"><span className="fn-bold">Responsibility </span></td>
                            <td  className="text-center  box-border width15"><span className="fn-bold">Target Date</span></td>
                            <td   className="text-center  box-border width15"><span className="fn-bold">Completion Date</span></td>
                          </tr>
                          <tr>
                          <td  className="text-left  box-border width35"><span className="fw-500">{obj.actionPlan}</span></td>
                          <td   className="text-left  box-border width35"><span className="fw-500">{obj.executiveName}</span></td>
                          <td  className="text-center  box-border width15"><span className="fw-500">{obj.targetDate && format(new Date(obj.targetDate),'dd-MM-yyyy')}</span></td>
                          <td   className="text-center  box-border width15"><span className="fw-500"></span></td>
                          </tr>
                         </tbody>
                       </table> */}
                       <table className="table table-responsive">
                         <tbody >
                          <tr>
                            <td  className="text-left  box-border width33 hi-60"><span className="fw-500"></span></td>
                            <td   className="text-left  box-border width33 hi-60"><span className="fw-500"></span></td>
                            <td   className="text-left box-border width33 hi-60"><span className="fw-500"></span></td>
                          </tr>
                          <tr>
                            <td  className="text-center  box-border width33"><span className="fw-500">Signature of Primary Executive</span></td>
                            <td   className="text-center  box-border width33"><span className="fw-500">Signature of Project Director</span></td>
                            <td   className="text-center box-border width33"><span className="fw-500">Signature of MR</span></td>
                          </tr>
                         </tbody>
                       </table>
                      </Box>
                      <Box flex="2%"></Box>
                     </Box>
                     { isAddMode? <Box className='text-center mg-top-10'><Button type="submit" variant="contained" className="submit" disabled = {!isValid || isSubmitting  }>Submit</Button></Box>:
                     <Box className='text-center mg-top-10'><Button type="submit" variant="contained" className="btn edit bt-sty" disabled = {!isValid || isSubmitting  }>Update</Button></Box>}
                     </Form>
                    )}
                    </Formik>
                     </td>
                     </tr>
                    }
                    </> )
                 }):(<tr  className="table-active box-border"> <td colSpan={5}  className="text-center  box-border"><span className="fn-bold">There are no records to display</span></td></tr>)}
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
    </div>
  );

}
export default withRouter(CorrectiveActionReport);