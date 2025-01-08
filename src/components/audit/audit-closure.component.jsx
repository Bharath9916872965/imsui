import React, { useEffect, useState } from "react";
import { getIqaDtoList } from "services/audit.service";
import { Box, Typography, Button, TextField,Autocomplete, ListItemText } from '@mui/material';
import Navbar from "components/Navbar/Navbar";
import './auditor-list.component.css';
import dayjs from 'dayjs';
import SelectPicker from "components/selectpicker/selectPicker";
import withRouter from "common/with-router";
import {format} from 'date-fns'



const AuditClosureComponent = ({router}) => {

  const [isReady, setIsReady] = useState(false);
  const [iqaFullList,setIqaFullList] = useState([]);
  const [iqaOptions,setIqaOptions] = useState([]);
  const [iqaNo,setIqaNo] = useState('');
  const [iqaId,setIqaId] = useState('');
  const [iqaFromDate,setIqaFromDate] = useState(dayjs(new Date()));
  const [iqaToDate,setIqaToDate] = useState(dayjs(new Date()));








  const fetchData = async () => {
    try {
      const iqaList = await getIqaDtoList();

      setIqaFullList(iqaList);

      const iqaData = iqaList.map(data => ({
        value : data.iqaId,
        label : data.iqaNo
      }));

      if(iqaList.length >0){
        const iqa = iqaList[0];
        setIqaNo(iqa.iqaNo)
        setIqaId(iqa.iqaId)
        setIqaFromDate(new Date(iqa.fromDate))
        setIqaToDate(new Date(iqa.toDate))
      }
      setIqaOptions(iqaData)

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
          <Box flex="90%" className='text-center'><h3>{iqaNo} : Audit Closure - {format(new Date(iqaFromDate),'dd-MM-yyyy')+' - '+format(new Date(iqaToDate),'dd-MM-yyyy')}</h3></Box>
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
export default withRouter(AuditClosureComponent);