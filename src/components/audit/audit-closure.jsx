import React, { useEffect, useState } from "react";
import { Box, Typography, Button, TextField,Autocomplete, ListItemText } from '@mui/material';
import Navbar from "../../Navbar/Navbar";
import 'auditor-list.component.css';
import dayjs from 'dayjs';
import SelectPicker from "components/selectpicker/selectPicker";
import withRouter from "../../../common/with-router";



const ScheduleListComponent = ({router}) => {

  const [isReady, setIsReady] = useState(false);
  const [iqaFullList,setIqaFullList] = useState([]);
  const [iqaOptions,setIqaOptions] = useState([]);
  const [iqaNo,setIqaNo] = useState('');
  const [iqaId,setIqaId] = useState('');
  const [iqaFromDate,setIqaFromDate] = useState(dayjs(new Date()));
  const [iqaToDate,setIqaToDate] = useState(dayjs(new Date()));








  const fetchData = async () => {
    try {

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isReady]);
  

  const scheduleAdd = ()=>{

  }
  









  const onIqaChange = (value)=>{
    const selectedIqa = iqaFullList.find(data => data.iqaId === value);
    if(selectedIqa){
      setIqaNo(selectedIqa.iqaNo)
      setIqaFromDate(dayjs(new Date(selectedIqa.fromDate)))
      setIqaToDate(dayjs(new Date(selectedIqa.toDate)))
    }
    setIqaId(value);
  }








  return (
    <div>
      <Navbar />
      <div className="card">
        <div className="card-body text-center">
         <Box display="flex" alignItems="center" gap="10px" className='mg-down-10'>
          <Box flex="45%" className='text-center'><h3>{iqaNo} : Audit Schedule</h3></Box>
          <Box flex="45%">
            </Box>
          <Box flex="10%">
            <SelectPicker options={iqaOptions} label="IQA No"
            value={iqaOptions && iqaOptions.length >0 && iqaOptions.find(option => option.value === iqaId) || null}
             handleChange={(newValue) => {onIqaChange( newValue?.value) }}/>
          </Box>
         </Box>
          <div id="card-body customized-card">
          </div>
          <div>
            { <button className="btn add btn-name" onClick={scheduleAdd}> Add </button>}
          </div>
        </div>
      </div>
    </div>
  );

}
export default withRouter(ScheduleListComponent);