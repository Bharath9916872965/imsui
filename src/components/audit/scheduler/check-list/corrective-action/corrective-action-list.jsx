import React, { useEffect, useState } from "react";
import { getIqaAuditeelist,getCarList,getEmployee,insertCorrectiveAction } from "services/audit.service";
import { getIqaDtoList } from "services/audit.service";
import { Box, TextField,Grid,Card,CardContent} from '@mui/material';
import Navbar from "components/Navbar/Navbar";
import './corrective-action-list.css'
import AlertConfirmation from "common/AlertConfirmation.component";
import withRouter from "common/with-router";
import SelectPicker from "components/selectpicker/selectPicker";
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { format } from "date-fns";
import CarMasterPrint from "components/prints/qms/carmaster-list-print";


const CorrectiveActionList = ({router}) => {

  const {navigate,location} = router;

  const [isReady, setIsReady] = useState(false);
  const [isAddMode,setIsAddMode] = useState(true);
  const [auditeeOptions,setAuditeeOptions] = useState([]);
  const [auditeeId,setAuditeeId] = useState('');
  const [auditeeName,setAuditeeName] = useState('');
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
  const [loginRoleName,setLoginRoleName] = useState('')
  const [loginEmpId,setLoginEmpId] = useState(0);
  const [isAdmin,setIsAdmin] = useState(false)

  useEffect(() => {
    fetchData();
  }, [isReady]);

  const fetchData = async () => {
    try {
      const iqaList       = await getIqaDtoList();
      const auditee       = await getIqaAuditeelist();
      const totalCarList  = await getCarList();
      const emp           = await getEmployee();

      const role = localStorage.getItem('roleName')
      const empId = localStorage.getItem('empId')

      setLoginRoleName(role)
      setLoginEmpId(empId)

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
      let fiCarList = null;
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
           fiCarList = totalCarList.filter(data => data.iqaId === iqa.iqaId && data.auditeeId === filAuditee[0].auditeeId)
        }
      }
      if(['Admin','Director','MR','MR Rep'].includes(String(role))){
        setIsAdmin(true);
        setFilCarList(fiCarList);
        setInitiValues(fiCarList,emp,new Date(iqa.fromDate));
       }else{
        const filList = fiCarList.filter(item => Number(item.auditeeEmpId) === Number(empId));
        setFilCarList(filList);
        setInitiValues(filList,emp,new Date(iqa.fromDate));
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
    const fiCarList = totalCarList.filter(data => data.iqaId === iqaId && data.auditeeId === auditeeId)
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
        setIsAddMode(true)
      }else{
        list.forEach(element => {
          initialAction.set(element.correctiveActionId,element.actionPlan)
          initialEmployee.set(element.correctiveActionId,element.responsibility)
          initialDates.set(element.correctiveActionId,dayjs(new Date(element.targetDate)))
        });
        setIsAddMode(false)
      }
    }


    setActionValue(initialAction)
    setEmployees(initialEmployee)
    setDateValue(initialDates);
  }

  const onAuditeeChange = (value)=>{
    setAuditeeId(value)
    const fiCarList = carList.filter(data => data.iqaId === iqaId && data.auditeeId === value)
    if(isAdmin){
      setFilCarList(fiCarList)
      setInitiValues(fiCarList,totalEmployees,schFromDate);
    }else{
      const filList = fiCarList.filter(item => Number(item.auditeeEmpId) === Number(loginEmpId));
      setFilCarList(filList);
      setInitiValues(filList,totalEmployees,schFromDate);
    }
    setIsValidationActive(false)
    const audit = auditeeOptions.filter(data => Number(data.value) === Number(value));
    if(audit && audit.length > 0){
      setAuditeeName(audit[0].label)
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
      const fiCarList = carList.filter(data => data.iqaId === value && data.auditeeId === auditeeId)
      if(isAdmin){
        setFilCarList(fiCarList)
        setInitiValues(fiCarList,totalEmployees,new Date(iqa[0].fromDate))
      }else{
        const filList = fiCarList.filter(item => Number(item.auditeeEmpId) === Number(loginEmpId));
        setFilCarList(filList);
        setInitiValues(filList,totalEmployees,new Date(iqa[0].fromDate));
      }

    }
    setIsValidationActive(false)
  }


  const onActionValueChange = (value, caId) => {
    
    setActionValue(prev => new Map(prev).set(caId,value));
    if(value.trim() === ''){
      setActionValueValidation(prev => [...new Set([...prev,String(caId)])])
    }else{
      setActionValueValidation(prev => prev.filter(id => Number(id) !== Number(caId)))
    }
  };

  const onTargetDateValueChange = (value, caId) => {
    setDateValue(prev => new Map(prev).set(caId,value));
  };

  const onEmployeeValueChange = (value, caId) => {
    setEmployees(prev => new Map(prev).set(caId,value));
  };

  const handleConfirm = async () => {

    const mergedMap = new Map();
    if(isAddMode){
      actionValue.forEach((value,key) => {
        mergedMap.set(key,{ 
          action     : value,
          targetDate : dateValue.get(key).$d || '',
          employee   : employees.get(key) || 0,
        })
      });
    }else{
      actionValue.forEach((value,key) => {
        mergedMap.set(key,{
          action     : value,
          targetDate : dateValue.get(key).$d || '',
          employee   : employees.get(key) || 0,
        })
      });
    }

    setIsValidationActive(true)
    if(actionValueValidation.length !== 0){
      Swal.fire({
        icon: "error",
        title: 'Please Add All CAR Actions',
        showConfirmButton: false,
        timer: 2500
      });
    }else{
      await AlertConfirmation({
        title: isAddMode?'Are you sure Add Corrective Action ?':'Are you sure Edit Corrective Action?' ,
        message: '',
        }).then(async (result) => {
        if (result) {
          try {
                const result = await insertCorrectiveAction(mergedMap);
                if (result.status === 'S') {
                  afterSubmit();
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
  
  return (
    <div>
      <Navbar />
      <div className="card">
        <div className="card-body text-center">
         <Box display="flex" alignItems="center" gap="10px" className='mg-down-10'>
          <Box flex="73%" className='text-center'><h3>{'Master List of CAR - '+iqaNo+' - '+auditeeName+' - '+format(new Date(schFromDate),'dd-MM-yyyy')+' - '+format(new Date(schToDate),'dd-MM-yyyy')}</h3></Box>
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
                    <th scope="col" className="text-center width13">Target Date</th>
                  </tr>
                </thead>
               <tbody >
                {filCarList.length > 0? filCarList.map((obj, i) => {
                  return(                 
                    <tr  className="table-active box-border">
                      <td  className="text-left  box-border"><span className="fn-bold">{obj.carRefNo}</span></td>
                      <td  className="text-left  box-border"><span className="fn-bold">{obj.carDescription}</span></td>
                      <td  className="text-center box-border">
                       <TextField className="form-control w-100" label="Action Plan" variant="outlined" size="small" value={actionValue.get(obj.correctiveActionId) || ''}
                         onChange={(e) => onActionValueChange(e.target.value, obj.correctiveActionId)} 
                         InputLabelProps={{ style: {color: isValidationActive && actionValueValidation.includes(String(obj.correctiveActionId)) ? 'red' : 'inherit',},}} 
                         sx={{
                             "& .MuiOutlinedInput-root": {
                             "&:hover .MuiOutlinedInput-notchedOutline": {borderColor: isValidationActive && actionValueValidation.includes(String(obj.correctiveActionId)) ? 'red' : 'inherit',},
                             "&.Mui-focused .MuiOutlinedInput-notchedOutline": {borderColor: isValidationActive && actionValueValidation.includes(String(obj.correctiveActionId))? 'red' : 'inherit',},
                           },
                           "& .MuiOutlinedInput-notchedOutline": {border: isValidationActive && actionValueValidation.includes(String(obj.correctiveActionId)) ? '1px solid red' : '1px solid inherit' },
                           "& .MuiInputLabel-root.Mui-focused": {color: isValidationActive && actionValueValidation.includes(String(obj.correctiveActionId)) ? 'red' : 'inherit',}}}/>
                      </td>
                      <td className="text-center box-border">
                        <SelectPicker options={employeeOptions} value={employeeOptions.find((option) => option.value === employees.get(obj.correctiveActionId)) || null}
                         label="Responsibility" handleChange={(newValue) => {onEmployeeValueChange( newValue?.value,obj.correctiveActionId) }}/>
                      </td>
                      <td className="text-center box-border">
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker format='DD-MM-YYYY' value={dateValue.get(obj.correctiveActionId) || dayjs(new Date())} label="Target Date" views={['year', 'month', 'day']}
                        minDate={dayjs(new Date(schFromDate))} onChange={(newValue) => {onTargetDateValueChange(newValue, obj.correctiveActionId)}}slotProps={{ textField: { size: 'small' } }}/>
                       </LocalizationProvider> 
                      </td>
                    </tr>)
                 }):(<tr  className="table-active box-border"> <td colSpan={5}  className="text-center  box-border"><span className="fn-bold">There are no records to display</span></td></tr>)}
                </tbody>
               </table>
               { (isAddMode ?<div className="text-center"><button onClick={() => handleConfirm()} className="btn btn-success bt-sty">Submit</button></div>:
                 <div className="text-center"><button onClick={() => handleConfirm()} className="btn btn-warning bt-sty update-bg">Update</button>
              <button onClick={() => CarMasterPrint(filCarList,iqaNo,auditeeName,schFromDate,schToDate)} title="Print" aria-label="Print AuditSchedule" style={{ marginLeft: '60px' }} >
      <i className="material-icons">print</i>
    </button>
                 
                 </div>)}


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
export default withRouter(CorrectiveActionList);