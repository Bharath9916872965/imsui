import React, { useEffect, useState } from "react";
import { insertKpiObjective,getKpiMasterList,getKpiRatingList,updateKpiObjective,getDwpRevisonList,getKpiObjRatingList,KpiObjDto,getKpiUnitList } from "services/kpi.service";
import { getIqaDtoList } from "services/audit.service";
import { Box, TextField,Grid,Card,CardContent,Tooltip} from '@mui/material';
import Navbar from "components/Navbar/Navbar";
import './kpi-master.css'
import AlertConfirmation from "common/AlertConfirmation.component";
import withRouter from "common/with-router";
import SelectPicker from "components/selectpicker/selectPicker";
import KpiratingDialog from "components/Login/kpiRatingDialog.component";


const KpiObjectiveAction = ({router}) => {

  const {navigate,location} = router;

  const [kpiMasterList,setKpiMasterList] = useState([]);
  const [filKpiMasterList,setFilKpiMasterList] = useState([]);
  const [kpiRatingList,setKpiRatingList] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const [isAddMode,setIsAddMode] = useState(true);
  const [revisionOptions,setRevisionOptions] = useState([]);
  const [revisionId,setRevisionId] = useState('');
  const [kpiObjRatingList,setKpiObjRatingList] = useState([])
  const [iqaOptions,setIqaOptions] = useState([])
  const [iqaId,setIqaId] = useState('');
  const [iqaNo,setIqaNo] = useState('');
  const [iqaList,setIqaList] = useState([]);
  const [kpiValue, setKpiValue] = useState(new Map());
  const [kpiRating, setKpiRating] = useState(new Map());
  const [kpiObjectiveId, setKpiObjectiveId] = useState(new Map());
  const [kpiValueValidation,setKpiValueValidation] = useState([]); 
  const [isValidationActive, setIsValidationActive] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [kpiUnitList,setKpiUnitList] = useState([])
  const [revisionName,setRevisionName] = useState('A');
  const [divisionName,setDivisionName] = useState('A');
  const [avgKpiRating,setAvgKpiRating] = useState(0)
  const [initialValues,setInitialValues] = useState({
      kpiId     : 0,
      objective : '',
      metrics   : '',
      target    : '',
      kpiUnitId : 1,
      revisionRecordId : '0',
      ratings   : [{ startValue : '', endValue : '',rating : '' }],
  });

  const ratingColors = {
    '1' : 'text-center box-border trash-btn',
    '2' : 'text-center box-border initiated',
    '3' : 'text-center box-border reschedule',
    '4' : 'text-center box-border rating-4',
    '5' : 'text-center box-border acknowledge',
  }

  useEffect(() => {
    fetchData();
  }, [isReady]);

  const fetchData = async () => {
    try {
      const kpiMasterList = await getKpiMasterList();
      const kpiRatingList = await getKpiObjRatingList();
      const ratingList    = await getKpiRatingList();
      const dwpList       = await getDwpRevisonList();
      const iqaList       = await getIqaDtoList();
      const unitList      = await getKpiUnitList();

      const iqaData = iqaList.map(data => ({
        value : data.iqaId,
        label : data.iqaNo
      }));
      setIqaList(iqaList)
      setIqaOptions(iqaData)
      if(iqaList.length >0){
        const iqa = iqaList[0];
        setIqaId(iqa.iqaId)
        setIqaNo(iqa.iqaNo)
      }
      setKpiUnitList(unitList)
      setKpiObjRatingList(kpiRatingList)
      const revisionData = dwpList.map(data => ({
        value : String(data.revisionRecordId),
        label : data.docType === 'dwp'?'DWP - '+data.divisionMasterDto.divisionCode:'GWP - '+data.divisionGroupDto.groupCode
      }));

      if(dwpList && dwpList.length >0 && iqaList.length >0){
        setRevisionId(String(dwpList[0].revisionRecordId))
        setDivisionName(dwpList[0].description)
        if(kpiRatingList.filter(item => item.revisionRecordId === dwpList[0].revisionRecordId && iqaList[0].iqaId === item.iqaId).length > 0){
          setIsAddMode(false)
          const filrating = kpiRatingList.filter(item => item.revisionRecordId === dwpList[0].revisionRecordId && iqaList[0].iqaId === item.iqaId);
          setInitiValues(filrating,'L')
          setFilKpiMasterList(filrating);
          getAvgRating(filrating)
        }else{
          const filKpiMaster = kpiMasterList.filter(data => (Number(data.revisionRecordId) === Number(dwpList[0].revisionRecordId) || data.revisionRecordId === '0'));
          setInitiValues(filKpiMaster,'M')
          setFilKpiMasterList(filKpiMaster)
          setAvgKpiRating(0)
        }
      }

     // const filObjratingList = kpiRatingList.filter(item => item.kpiQuarter === 1 && item.kpiYear === Number(new Date().getFullYear())) 

      setRevisionOptions(revisionData)
      setKpiRatingList(ratingList)
      setKpiMasterList(kpiMasterList)

      setIsReady(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getAvgRating = (list)=>{
    let sum = 0;
    list.forEach(element => {
      sum += element.kpiRating
    });
    setAvgKpiRating(sum/list.length);
  }

  const afterSubmit = async()=>{
    const kpiRatingList = await getKpiObjRatingList();

    setKpiObjRatingList(kpiRatingList)

    const filrating = kpiRatingList.filter(item => Number(item.revisionRecordId) === Number(revisionId) && Number(iqaId) === Number(item.iqaId));
    setInitiValues(filrating,'L')
    getAvgRating(filrating)
    setFilKpiMasterList(filrating);
    if(isAddMode){
      setIsAddMode(false)
    }
  

  }

  const setInitiValues = (list,flag) =>{
    setIsValidationActive(false)
    setKpiValue(new Map())
    setKpiRating(new Map())
    setKpiValueValidation([])
    if(flag === 'M'){
      list.forEach(element => {
        setKpiValueValidation(prev => [...new Set([...prev,String(element.kpiId)])])
      });
    }else if(flag === 'L'){
      list.forEach(element => {
        setKpiValue((prev) => new Map(prev).set(element.kpiId, element.kpiValue));
        setKpiRating(prev => new Map(prev).set(element.kpiId,element.kpiRating));
        setKpiObjectiveId(prev => new Map(prev).set(element.kpiId,element.kpiObjectiveId));
        
      });
    }
  }

  const onRevisionChange = (value)=>{
    setRevisionId(value);
    const revRow = revisionOptions.filter(data => Number(data.value) === Number(value));
    if(revRow && revRow.length > 0){
      setDivisionName(revRow[0].label)
    }
    if(iqaOptions.length > 0){
      if(kpiObjRatingList.filter(item => Number(item.revisionRecordId) === Number(value) && iqaId === item.iqaId).length > 0){
        setIsAddMode(false)
        const filrating = kpiObjRatingList.filter(item => Number(item.revisionRecordId) === Number(value) && iqaId === item.iqaId);
        setInitiValues(filrating,'L')
        getAvgRating(filrating)
        setFilKpiMasterList(filrating);
      }else{
        setIsAddMode(true)
        const filKpiMaster = kpiMasterList.filter(data => (Number(data.revisionRecordId) === Number(value) || data.revisionRecordId === '0'));
        setInitiValues(filKpiMaster,'M')
        setFilKpiMasterList(filKpiMaster)
        setAvgKpiRating(0)
      }
    }

  }

  const onIqaChange = (value)=>{
    setIqaId(value);
    const iqaData = iqaList.filter(item =>item.iqaId === value);
    if(iqaData && iqaData.length > 0){
      setIqaNo(iqaData[0].iqaNo)
    }

    if(kpiObjRatingList.filter(item => Number(item.revisionRecordId) === Number(revisionId) && value === item.iqaId).length > 0){
      setIsAddMode(false)
      const filrating = kpiObjRatingList.filter(item => Number(item.revisionRecordId) === Number(revisionId) && value === item.iqaId);
      setInitiValues(filrating,'L')
      getAvgRating(filrating)
      setFilKpiMasterList(filrating);
    }else{
      setIsAddMode(true)
      const filKpiMaster = kpiMasterList.filter(data => (Number(data.revisionRecordId) === Number(revisionId) || data.revisionRecordId === '0'));
      setInitiValues(filKpiMaster,'M')
      setFilKpiMasterList(filKpiMaster)
      setAvgKpiRating(0)
    }
  }

  const getRating = (value,kpiId) =>{
    const filRating = kpiRatingList.filter(data => data.kpiId === kpiId);
    const rating = filRating.find(item => value >= item.startValue && value <= item.endValue);

    if(value !== '' && rating){
      setKpiRating(prev => new Map(prev).set(kpiId,rating.kpiRating))
    }else {
      setKpiRating(prev => {
        const updatedMap = new Map(prev);
        updatedMap.delete(kpiId);
        return updatedMap;
      });
      setKpiValueValidation(prev => [...new Set([...prev, String(kpiId)])])
    }
  }

  const onKpiValueChange = (value, kpiId) => {
    setKpiValue((prev) => new Map(prev).set(kpiId, value));
    if(value.trim() === ''){
      setKpiValueValidation(prev => [...new Set([...prev, String(kpiId)])])
    }else{
      setKpiValueValidation(prev => prev.filter(id => Number(id) !== Number(kpiId)));
    }
    getRating(value, kpiId)
  };

  const handleConfirm = async () => {
    const mergedMap = new Map();
    if(isAddMode){
      kpiValue.forEach((value,key) => {
        mergedMap.set(key,{
          kpiObjectiveId : 0,
          kpiValue       : value,
          kpiRating      : kpiRating.get(key) || 0
        })
      });
    }else{
      kpiValue.forEach((value,key) => {
        mergedMap.set(key,{
          kpiObjectiveId : kpiObjectiveId.get(key) || 0,
          kpiValue       : value,
          kpiRating      : kpiRating.get(key) || 0
        })
      });
    }

    setIsValidationActive(true)
    if(kpiValueValidation.length !== 0){
      Swal.fire({
        icon: "error",
        title: 'Please Add All KPI Values',
        showConfirmButton: false,
        timer: 2500
      });
    }else{
      await AlertConfirmation({
        title: isAddMode?'Are you sure Add KPI Rating ?':'Are you sure Edit KPI Rating?' ,
        message: '',
        }).then(async (result) => {
        if (result) {
          try {
              if(isAddMode){
                const result = await insertKpiObjective(new KpiObjDto(mergedMap,iqaId,revisionId));
                if (result.status === 'S') {
                  afterSubmit();
                  Swal.fire({
                    icon: "success",
                    title: result.message,
                    showConfirmButton: false,
                    timer: 1500
                  });
                } else {
                  Swal.fire({
                    icon: "error",
                    title: result.message,
                    showConfirmButton: false,
                    timer: 1500
                  });
                }
              }else{
                const result = await updateKpiObjective(new KpiObjDto(mergedMap,iqaId,revisionId));
                if (result.status === 'S') {
                  afterSubmit();
                  Swal.fire({
                    icon: "success",
                    title: result.message,
                    showConfirmButton: false,
                    timer: 1500
                  });
                } else {
                  Swal.fire({
                    icon: "error",
                    title: result.message,
                    showConfirmButton: false,
                    timer: 1500
                  });
                }
              }
    
          } catch (error) {
            Swal.fire('Error!', 'There was an issue adding the KPI.', 'error');
          }
        }
      });
    }
  };

  const getUnitSingle = {
    'DAYS'   : ' DAY',
    'NOS'    : ' NO',
    'WEEKS'  : ' WEEK',
    'MONTHS' : ' MONTH',
    'QUATER' : 'QUATER',
    'YEAR'   : 'YEAR',
  };

  const handleKpiActionDialogClose = ()=>{
    setShowModal(false);
  }

  const openRating =async(item)=>{
   const kpiRow =  kpiMasterList.filter(data => Number(data.kpiId) === Number(item.kpiId))
   setRevisionName(kpiRow[0].groupDivisionCode+' - '+iqaNo)
    const ratingList = await getKpiRatingList();
    setKpiRatingList(ratingList);
    setInitialValues({
      kpiId     : item.kpiId,
      objective : item.kpiObjectives,
      metrics   : item.kpiMerics,
      norms     : item.kpiNorms,
      target    : item.kpiTarget,
      kpiUnitId : item.kpiUnitId,
      revisionRecordId : item.revisionRecordId,
      ratings   : ratingList.filter(data => Number(data.kpiId) === Number(item.kpiId)).map(item => ({ startValue: item.startValue,endValue: item.endValue, rating: item.kpiRating.toString(),}))
    
    });
    setShowModal(true)
  }
  
  return (
    <div>
      <Navbar />
      <div className="card">
        <div className="card-body text-center">
         <Box display="flex" alignItems="center" gap="10px" className='mg-down-10'>
          <Box flex="73%" className='text-center'><h3>Key Process Indicator List</h3></Box>
          <Box flex="12%">
            <SelectPicker options={iqaOptions} label="IQA No"
            value={iqaOptions && iqaOptions.length >0 && iqaOptions.find(option => option.value === iqaId) || null}
             handleChange={(newValue) => {onIqaChange( newValue?.value) }}/>
          </Box>
          <Box flex="15%">
            <SelectPicker options={revisionOptions} label="Division/Group" 
            value={revisionOptions && revisionOptions.length >0 && revisionOptions.find(option => option.value === revisionId) || null}
             handleChange={(newValue) => {onRevisionChange( newValue?.value) }}/>
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
                    <th scope="col" className="text-left width47">&nbsp;&nbsp;Objective</th>
                    <th scope="col" className="text-left width25">&nbsp;&nbsp;Metrics</th>
                    <th scope="col" className="text-center width7">Target</th>
                    <th scope="col" className="text-center width7">Unit</th>
                    <th scope="col" className="text-center width7">Value</th>
                    <th scope="col" className="text-center width7">Rating</th>
                  </tr>
                </thead>
               <tbody >
                {filKpiMasterList.map((obj, i) => {
                  return(                 
                    <tr  className="table-active box-border">
                      <td  className="text-left  box-border"><span className="fn-bold">{obj.kpiObjectives}</span></td>
                      <td  className="text-left  box-border"><span className="fn-bold">{obj.kpiMerics}</span></td>
                      <td  className="text-center box-border"><span className="fn-bold">{obj.kpiTarget}</span></td>
                      <td  className="text-left box-border"><span className="fn-bold">{obj.kpiUnitName === 'PERCENTAGE'?'%':(Number(kpiValue.get(obj.kpiId)) === 1?getUnitSingle[obj.kpiUnitName]:obj.kpiUnitName)}</span></td>
                      <td  className="text-left box-border">
                        <TextField className="form-control w-100" label="KPI Value" variant="outlined" size="small" value={kpiValue.get(obj.kpiId) || ''}
                         onChange={(e) => onKpiValueChange(e.target.value, obj.kpiId)} 
                         InputLabelProps={{ style: {color: isValidationActive && kpiValueValidation.includes(String(obj.kpiId)) ? 'red' : 'inherit',},}} 
                         sx={{
                             "& .MuiOutlinedInput-root": {
                             "&:hover .MuiOutlinedInput-notchedOutline": {borderColor: isValidationActive && kpiValueValidation.includes(String(obj.kpiId)) ? 'red' : 'inherit',},
                             "&.Mui-focused .MuiOutlinedInput-notchedOutline": {borderColor: isValidationActive && kpiValueValidation.includes(String(obj.kpiId))? 'red' : 'inherit',},
                           },
                           "& .MuiOutlinedInput-notchedOutline": {border: isValidationActive && kpiValueValidation.includes(String(obj.kpiId)) ? '1px solid red' : '1px solid inherit' },
                           "& .MuiInputLabel-root.Mui-focused": {color: isValidationActive && kpiValueValidation.includes(String(obj.kpiId)) ? 'red' : 'inherit',}}}/>
                      </td>
                      <td  className={ratingColors[kpiRating.get(obj.kpiId)]} ><div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span className="fn-bold">{kpiRating.get(obj.kpiId) || ''}</span><Tooltip title={<span className="tooltip-title">Rating Range</span>}><Box onClick = {()=>openRating(obj)}><i class="fa fa-info-circle info-sty animated faa-pulse mg-l-10"></i></Box></Tooltip></div></td>
                    </tr>)
                 })}
                </tbody>
               </table>
               <h5 className="noteColor" >{iqaNo+' Average KPI Rating of '+divisionName+': '+ avgKpiRating}</h5>
               { (isAddMode ?<div className="text-center"><button onClick={() => handleConfirm()} className="btn btn-success bt-sty">Submit</button></div>:
                 <div className="text-center"><button onClick={() => handleConfirm()} className="btn btn-warning bt-sty update-bg">Update</button></div>)}
              </CardContent>
             </Card>
            </Grid>
          </Grid>
          </div>
          <div>
         </div>
        </div>
      </div>
      <KpiratingDialog open={showModal} onClose={handleKpiActionDialogClose} onConfirm={handleKpiActionDialogClose} isAddMode={isAddMode} kpiUnitList={kpiUnitList} revisionId={revisionId} initialValues={initialValues} revisionName = {revisionName} flag = 'L' />
    </div>
  );

}
export default withRouter(KpiObjectiveAction);