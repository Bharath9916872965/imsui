import React, { useEffect, useState } from "react";
import { getKpiUnitList,getKpiMasterList,getKpiObjRatingList,getDwpRevisonList } from "services/kpi.service";
import { getIqaDtoList } from "services/audit.service";
import { Box } from '@mui/material';
import Navbar from "components/Navbar/Navbar";
import './kpi-master.css'
import withRouter from "common/with-router";
import SelectPicker from "components/selectpicker/selectPicker";


const KpiObjectiveGraph = ({router}) => {

  const {navigate,location} = router;

  const [kpiMasterList,setKpiMasterList] = useState([]);

  const [isReady, setIsReady] = useState(false);
  const [kpiUnitList,setKpiUnitList] = useState([]);
  const [isMr,setIsMr] = useState(true);
  const [revisionOptions,setRevisionOptions] = useState([]);
  const [kpiOptions,setKpiOptions] = useState([]);
  const [revisionId,setRevisionId] = useState('');
  const [kpiId,setKpiId] = useState('');
  const [kpiObjRatingList,setKpiObjRatingList] = useState([]);
  const [filKpiObjRatingList,setFilKpiObjRatingList] = useState([]);
  const [kpiWiseObjRatingList,setKpiWiseObjRatingList] = useState([]);
  const [mainKpiObjRatingList,setMainKpiObjRatingList] = useState([]);
  const [dwpRevisionList,setDwpRevisionList] = useState([]);
  let uniqueKpiIds = new Set();





  const fetchData = async () => {
    try {
      const kpiMasterList = await getKpiMasterList();
      const kpiRatingList = await getKpiObjRatingList();
      const unitList      = await getKpiUnitList();
      const dwpList       = await getDwpRevisonList();
      const iqaList       = await getIqaDtoList();

      setDwpRevisionList(dwpList)
      setIsMr(true)
      const revisionData = dwpList.map(data => ({
        value : String(data.revisionRecordId),
        label : data.docType === 'dwp'?'DWP - '+data.divisionMasterDto.divisionCode:'GWP - '+data.divisionGroupDto.groupCode
      }));

      setKpiObjRatingList(kpiRatingList)

      if(dwpList.length > 0){
        setRevisionId(String(dwpList[0].revisionRecordId))
        const filrating = kpiRatingList.filter(item => item.revisionRecordId === dwpList[0].revisionRecordId);
        const filKpiMaster = kpiMasterList.filter(data => (Number(data.revisionRecordId) === Number(dwpList[0].revisionRecordId) || data.revisionRecordId === '0'));
        setFilKpiObjRatingList(filrating)
        setKpiValues(filKpiMaster);

        if(mainKpiObjRatingList.length > 0){
          setKpiId(String(mainKpiObjRatingList[0].kpiId));
          const kpiWiseList = filrating.filter(data => data.kpiId === mainKpiObjRatingList[0].kpiId);
          setKpiWiseObjRatingList(kpiWiseList)
        }
        
      }

      setRevisionOptions(revisionData)
      setKpiUnitList(unitList)
      setKpiMasterList(kpiMasterList)

      setIsReady(true);

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isReady]);

  const onRevisionChange = (value)=>{
    setRevisionId(value);
    const filrating = kpiObjRatingList.filter(item => Number(item.revisionRecordId) === Number(value));
    setFilKpiObjRatingList(filrating)
    const filKpiMaster = kpiMasterList.filter(data => (Number(data.revisionRecordId) === Number(value) || data.revisionRecordId === '0'));
    setKpiValues(filKpiMaster);
    const kpiWiseList = filrating.filter(data => data.kpiId === kpiId);
    setKpiWiseObjRatingList(kpiWiseList)

  }

  const setKpiValues = (filrating)=>{
    uniqueKpiIds = new Set();
    setMainKpiObjRatingList([])
    filrating.forEach(item =>{
      if(!uniqueKpiIds.has(item.kpiId)){
        uniqueKpiIds.add(item.kpiId)
        setMainKpiObjRatingList(prev => [...prev,item])
      }
    });
    const kpidata = mainKpiObjRatingList.map(data => ({
      value : String(data.kpiId),
      label : data.kpiObjectives
    }));
    setKpiOptions(kpidata)
  }

  const onKpiChange = (value)=>{
    setKpiId(value);
  }


  
  return (
    <div>
      <Navbar />
      <div className="card">
        <div className="card-body text-center">
         <Box display="flex" alignItems="center" gap="10px" className='mg-down-10'>
          <Box flex="45%" className='text-center'><h3>Key Process Indicator Graph</h3></Box>
          <Box flex="20%">
            <SelectPicker options={revisionOptions} label="Division/Group" readOnly = {!isMr} 
            value={revisionOptions && revisionOptions.length >0 && revisionOptions.find(option => option.value === revisionId) || null}
             handleChange={(newValue) => {onRevisionChange( newValue?.value) }}/>
          </Box>
          <Box flex="35%">
            <SelectPicker options={kpiOptions} label="KPI" readOnly = {!isMr} 
            value={kpiOptions && kpiOptions.length >0 && kpiOptions.find(option => option.value === kpiId) || null}
             handleChange={(newValue) => {onKpiChange( newValue?.value) }}/>
          </Box>
         </Box>
          <div id="card-body customized-card">
          </div>
          <div>
          </div>
        </div>
      </div>
    </div>
  );

}
export default withRouter(KpiObjectiveGraph);