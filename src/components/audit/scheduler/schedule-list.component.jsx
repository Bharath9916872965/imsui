import React, { useEffect, useState } from "react";
import { addSchedule, getEmployee, editScheduleSubmit,getScheduleList,getTeamList,reScheduleSubmit,getIqaDtoList } from "../../../services/audit.service";
import Datatable from "../../datatable/Datatable";
import { Box, Typography, Button, Switch, TextField, Tooltip, styled, ListItem,Autocomplete, ListItemText } from '@mui/material';
import Navbar from "../../Navbar/Navbar";
import '../auditor-list.component.css';
import Swal from 'sweetalert2';
import { format } from "date-fns";
import dayjs from 'dayjs';
import { Field, Formik, Form  } from "formik";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import * as Yup from "yup";
import SelectPicker from '../../selectpicker/selectPicker'

export const CustomMenuItem = styled(ListItem)(() => ({
  borderBottom: '1px solid #e0e0e0',
  '&:last-child': {
    borderBottom: 'none',
  },
}));


const ScheduleListComponent = () => {

  const [showModal, setShowModal] = useState(false);
  const [empdetails, setEmployeeList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [scheduleList,setScheduleList] = useState([]);
  const [teamList,setTeamList] = useState([]);
  const [scdDate,setScdDate] = useState(dayjs(new Date()));
  const [isAddMode,setIsAddMode] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [isReschedule,setIsReschedule] = useState(false);
  const [iqaFullList,setIqaFullList] = useState([]);
  const [iqaOptions,setIqaOptions] = useState([]);
  const [iqaNo,setIqaNo] = useState('')
  const [iqaId,setIqaId] = useState('')
  const [scheduleValidation,setScheduleValidation] = useState(Yup.object({
    scheduleDate: Yup.date().required('Schedule Date is required'),
    auditeeId   : Yup.date().required('Auditee is required'),
    teamId      : Yup.date().required('Team is required'),
  }));
  const [initialValues,setInitialValues] = useState({
    scheduleId   : '',
    scheduleDate : '',
    auditeeId    : '',
    teamId       : '',
    revision     : '',
    remarks      : 'NA',
  });


  const columns = [
    { name: 'SN', selector: (row) => row.sn, sortable: true, grow: 1, align: 'text-center', width: '3%'  },
    { name: 'Date & Time(Hrs)', selector: (row) => row.date, sortable: true, grow: 2, align: 'text-center', width: '12%'  },
    { name: 'Division/Group', selector: (row) => row.divisionCode, sortable: true, grow: 2, align: 'text-center', width: '15%'  },
    { name: 'Project', selector: (row) => row.project, sortable: true, grow: 2, align: 'text-center', width: '19%'  },
    { name: 'Auditee', selector: (row) => row.auditee, sortable: true, grow: 2, align: 'text-start', width: '20%'  },
    { name: 'Team', selector: (row) => row.team, sortable: true, grow: 2, align: 'text-center', width: '16%'  },
    { name: 'Revision', selector: (row) => row.revision, sortable: true, grow: 2, align: 'text-center', width: '5%'  },
    { name: 'Action', selector: (row) => row.action, sortable: true, grow: 2, align: 'text-center',  width: '10%' },
  ];



  const fetchData = async () => {
    try {
      const Emp = await getEmployee();
      const scdList = await getScheduleList();
      const team = await getTeamList();
      const iqaList = await getIqaDtoList();
      setIqaFullList(iqaList);
      console.log('iqaList-------- ',iqaList)
      const iqaData = iqaList.map(data => ({
                      value : data.iqaId,
                      label : 'IQA'+data.iqaNo
                  }));
      if(iqaList.length >0){
        setIqaNo('IQA'+iqaList[0].iqaNo)
        setIqaId(iqaList[0].iqaId)
      }
      console.log('iqaData------ ',iqaData)
      setIqaOptions(iqaData)
      setTeamList(team)
      setEmployeeList(Emp)
      if(scdList.length >0){
        setDataTable(scdList)
      }else{
        setScheduleList([])
      }

      setInitialValues(prevValues =>({
        ...prevValues,
        scheduleDate : scdDate.$d
      }));
      setIsReady(true)

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isReady]);

  const setDataTable = (list)=>{
    const mappedData = list.map((item,index)=>({
        sn           : index+1,
        date         : format(new Date(item.scheduleDate),'dd-MM-yyyy HH:mm') || '-',
        divisionCode : item.divisionName === '' && item.groupName === '' ? '-' : item.divisionName !== '' && item.groupName !== '' ? item.divisionName + '/' + item.groupName : item.divisionName !== '' ? item.divisionName : item.groupName !== '' ? item.groupName : '-',
        project      : item.projectName === ''?'-':item.projectName || '-',
        auditee      : item.auditeeEmpName || '-',
        team         : item.teamCode || '-',
        revision     : 'R'+item.revision || '-',
        action       : <> <button className=" btn btn-outline-warning btn-sm me-1" onClick={() => editSchedule(item)}  title="Edit"> <i className="material-icons"  >edit_note</i></button>
                          <button className=" btn btn-outline-info btn-sm me-1" onClick={() => reSchedule(item)}  title="ReShchedule"><i className="material-icons">update</i></button></>
              
    }));
    setScheduleList(mappedData);
}


  const hadleClose = () => {
      setModalVisible(false);
      setShowModal(false);
  }

  const scheduleAdd = ()=>{
    setScdDate(dayjs(new Date()))
    setIsReschedule(false)
    setModalVisible(true);
    setIsAddMode(true)
    setShowModal(true);
    setInitialValues({
      scheduleId   : '',
      scheduleDate : scdDate.$d,
      auditeeId    : '',
      teamId       : '',
      revision     : '',
      remarks      : 'NA',
  
    })
    setScheduleValidation(Yup.object({
      scheduleDate: Yup.date().required('Schedule Date is required'),
      auditeeId   : Yup.date().required('Auditee is required'),
      teamId      : Yup.date().required('Team is required'),
    }))
  }
  

  const editSchedule =(item) =>{
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
      revision     : item.revision,
      remarks      : 'NA',
  
    })
    setScheduleValidation(Yup.object({
      scheduleDate: Yup.date().required('Schedule Date is required'),
      auditeeId   : Yup.date().required('Auditee is required'),
      teamId      : Yup.date().required('Team is required'),
    }))

  }

  const reSchedule = (item)=>{
    setModalVisible(true);
    setIsReschedule(true)
    setShowModal(true);
    setScdDate(dayjs(new Date(item.scheduleDate)))
    setInitialValues({
      scheduleId   : item.scheduleId,
      scheduleDate : dayjs(new Date(item.scheduleDate)).$d,
      auditeeId    : item.auditeeId,
      teamId       : item.teamId,
      revision     : item.revision,
      remarks      : 'NA',
  
    });
    setScheduleValidation(Yup.object({
      scheduleDate: Yup.date().required('Schedule Date is required'),
      auditeeId   : Yup.date().required('Auditee is required'),
      teamId      : Yup.date().required('Team is required'),
      remarks : Yup.string().required('Remarks is Required').min(2,'Remarks must be at least 2 characters').max(999,'Remarks must not exceed 990 characters')
      .matches( /^[a-zA-Z0-9_ ]*$/,"Remarks can only contain letters, numbers, and underscores")
      .test("no-trailing-space", "Remarks cannot end with a space", (value) => !/\s$/.test(value))
      .test( "no-leading-space","Remarks cannot start with a space",(value) => !/^\s/.test(value)),
    }))
  }
  const handleSubmitClick = async (values) => {
    Swal.fire({
      title: isReschedule ? 'Are you sure To ReSchedule ?':isAddMode?'Are you sure Add Schedule ?':'Are you sure Edit Schedule ?' ,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'YES',
      cancelButtonText: 'NO',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          if(isReschedule){
            const result = await reScheduleSubmit(values);
            if (result === 'audit Rescheduled Successfully') {
              const scdList = await getScheduleList();
              if(scdList.length >0){
                setDataTable(scdList)
              }else{
                setScheduleList([])
              }
              setShowModal(false);
              Swal.fire({
                icon: "success",
                title: "Schedule Rescheduled Successfully!",
                showConfirmButton: false,
                timer: 1500
              });
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
              if (result === 'audit schedule Added Successfully') {
                const scdList = await getScheduleList();
                if(scdList.length >0){
                  setDataTable(scdList)
                }else{
                  setScheduleList([])
                }
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
              if (result === 'audit schedule Edited Successfully') {
                const scdList = await getScheduleList();
                if(scdList.length >0){
                  setDataTable(scdList)
                }else{
                  setScheduleList([])
                }
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
    const selectedIqa = iqaFullList.find(data => data.iqaId === value);
    setIqaNo('IQA'+selectedIqa.iqaNo)
    setIqaId(value)
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
            <Datatable columns={columns} data={scheduleList} />
          </div>
          <div>
            <button className="btn add" onClick={scheduleAdd}>
              Add
            </button>
          </div>

          {showModal && (
            <div className={`modal fade show ${modalVisible ? 'modal-visible' : ''}`} style={{ display: 'block' }} aria-modal="true" role="dialog">
              <div className="modal-dialog modal-lg modal-xl-custom">
                <div className="modal-content " >
                  <div className="modal-header d-flex justify-content-between bg-primary text-white">
                    <h5 className="modal-title">{isReschedule ? 'Reschedule':isAddMode?'Schedule Add':'Schedule Edit'} </h5>
                    <button type="button" className="btn btn-danger" onClick={hadleClose} aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>

                  <div className="modal-body">
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
                                          <DateTimePicker format='DD-MM-YYYY HH:mm' value={scdDate} label="Schedule Date & Time" views={['year', 'month', 'day', 'hours', 'minutes']}
                                            onChange={(newValue) => { setFieldValue("scheduleDate", newValue ? newValue.$d : ''); }}
                                            minDate={dayjs(new Date())} slotProps={{ textField: { size: 'small' } }} /></DemoContainer>
                                      </LocalizationProvider>
                                    )}
                                  </Field>
                                </Box>
                                <Box flex="40%">
                                <Field name="auditeeId">
                                        {({ field, form })=>(
                                            <Autocomplete options={empdetails} getOptionLabel={option => option.empName+', '+option.empDesigCode} 
                                            renderOption={(props, option) => {return (
                                                <CustomMenuItem {...props} key={option.empId}>
                                                  <ListItemText primary={`${option.empName}, ${option.empDesigCode}`} />
                                                </CustomMenuItem>
                                              );}}
                                            value = {empdetails.find(auditee =>auditee.empId === form.values.auditeeId) || null} 
                                             ListboxProps={{sx:{maxHeight :200,overflowY:'auto'}}}
                                            onChange={(event, newValue) => { setFieldValue("auditeeId", newValue ? newValue.empId : ''); }}
                                            renderInput={(params) => (<TextField {...params} label="Auditee Name"   size="small"  margin="normal" variant="outlined"
                                                    error={touched.auditeeId && Boolean(errors.auditeeId)}
                                                    helperText={touched.auditeeId && errors.auditeeId}/>)} />
                                        )}
                                </Field> 

                                </Box>
                                <Box flex="25%"> 
                                  <Field name="teamId">
                                    {({ field, form })=>(
                                        <Autocomplete options={teamList} getOptionLabel={option => option.teamCode} 
                                        renderOption={(props, option) => {return (
                                            <CustomMenuItem {...props} key={option.teamId}>
                                              <ListItemText primary={`${option.teamCode}`} />
                                            </CustomMenuItem>
                                          );}}
                                        value = {teamList.find(team =>team.teamId === form.values.teamId) || null} 
                                          ListboxProps={{sx:{maxHeight :200,overflowY:'auto'}}}
                                        onChange={(event, newValue) => { setFieldValue("teamId", newValue ? newValue.teamId : ''); }}
                                        renderInput={(params) => (<TextField {...params} label="team Name"   size="small"  margin="normal" variant="outlined"
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
                            <Box className='text-center mg-top-10'><Button type="submit" variant="contained" className="submit" disabled = {!isValid || isSubmitting }>Submit</Button></Box>
                            </Typography>
                          </Form>
                        )}
                   </Formik>
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
export default ScheduleListComponent;