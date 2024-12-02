import React, { useEffect, useState } from "react";
import { getIqaDtoList,getScheduleApprovalList,approveSchedule,returnSchedule } from "../../../services/audit.service";
import Datatable from "../../datatable/Datatable";
import { Box} from '@mui/material';
import Navbar from "../../Navbar/Navbar";
import '../auditor-list.component.css';
import { format } from "date-fns";
import SelectPicker from '../../selectpicker/selectPicker';
import AlertConfirmation from "../../../common/AlertConfirmation.component";
import ReturnDialog from "../../Login/returnDialog.component";



const ScheduleApprovalComponent = () => {

  const [scheduleList,setScheduleList] = useState([]);
  const [filScheduleList,setFilScheduleList] = useState([]);
  const [iqaFullList,setIqaFullList] = useState([]);
  const [iqaOptions,setIqaOptions] = useState([]);
  const [iqaNo,setIqaNo] = useState('');
  const [iqaId,setIqaId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [element,setElement] = useState('')


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


  const fetchData = async () => {
    try {
      const scdList        = await getScheduleApprovalList();
      const iqaList        = await getIqaDtoList();
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
        const scList = scdList.filter(data => data.iqaId === iqa.iqaId)
        setDataTable(scList);
      }
      setIqaOptions(iqaData)

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const setDataTable = (list)=>{
    const mappedData = list.map((item,index)=>{
      let statusColor = `${item.scheduleStatus === 'INI'?'initiated' : (item.scheduleStatus === 'FWD' ? 'forwarde' : item.scheduleStatus === 'ARF'?'reschedule':['ASR','ARL'].includes(item.scheduleStatus)?'returned':['ASA','AAL'].includes(item.scheduleStatus)?'lead-auditee':'acknowledge')}`;
      return{
        sn           : index+1,
        date         : format(new Date(item.scheduleDate),'dd-MM-yyyy HH:mm') || '-',
        divisionCode : item.divisionName === '' && item.groupName === '' ? '-' : item.divisionName !== '' && item.groupName !== '' ? item.divisionName + '/' + item.groupName : item.divisionName !== '' ? item.divisionName : item.groupName !== '' ? item.groupName : '-',
        project      : item.projectName === ''?'-':item.projectName || '-',
        auditee      : item.auditeeEmpName || '-',
        team         : item.teamCode || '-',
        status       : <Box  className={statusColor} onClick = {()=>openTran(item)}><Box class='status'>{item.statusName}<i class="material-icons float-right font-med">open_in_new</i></Box></Box>|| '-',
        revision     : 'R'+item.revision || '-',
        action       : <>{((['FWD','AAL','ARF'].includes(item.scheduleStatus) && item.auditeeEmpId === item.loginEmpId)  || (['FWD','ASA','ARF'].includes(item.scheduleStatus) && item.leadEmpId === item.loginEmpId)) && <button className=" btn btn-outline-success btn-sm me-1" onClick={() => scheduleApprove(item)}  title="Acknowledge"> <i className="material-icons"  >task_alt</i></button>}
                          {((['FWD','AAL','ARF'].includes(item.scheduleStatus) && item.auditeeEmpId === item.loginEmpId)  || (['FWD','ASA','ARF'].includes(item.scheduleStatus) && item.leadEmpId === item.loginEmpId))  && <button className=" btn btn-outline-danger btn-sm me-1" onClick={() => scheduleReturn(item)}  title="Return"><i className="material-icons">assignment_return</i></button>}
                          {['AAA'].includes(item.scheduleStatus) && <button className=" btn btn-outline-primary btn-sm me-1 mg-l-40" onClick={() => addCheckList(item)}  title="CheckList"><i className="material-icons">playlist_add_check</i></button>}</>  
      }      
    });
    setFilScheduleList(mappedData);
   }

   const addCheckList = (item)=>{

   }

   const openTran = (item)=>{
    localStorage.setItem('scheduleData', JSON.stringify(item));
    window.open('/schedule-tran', '_blank');
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
    setShowModal(true);
    setElement(item)
  }

  const afterSubmit = async(item)=>{
    const scdList   = await getScheduleApprovalList();
    setDataTable(scdList.filter(data => data.iqaId === item.iqaId))
    setScheduleList(scdList)
  }

  const onIqaChange = (value)=>{
    const selectedIqa = iqaFullList.find(data => data.iqaId === value);
    if(selectedIqa){
      setIqaNo(selectedIqa.iqaNo)
    }
    setIqaId(value);
    setDataTable(scheduleList.filter(data => data.iqaId === value))

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
      await AlertConfirmation({
        title: 'Are you sure Return Schedule ?' ,
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
              Swal.fire('Error!', 'There was an issue Returning the Schdule.', 'error');
            }
        }
      })
    }
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
            <Datatable columns={columns} data={filScheduleList} />
          </div>
        </div>
      </div>
       <ReturnDialog open={showModal} onClose={handleReturnDialogClose} onConfirm={handleReturnDialogConfirm}/>
    </div>
  );

}
export default ScheduleApprovalComponent;