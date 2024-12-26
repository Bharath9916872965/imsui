import React, { useEffect, useState } from "react";
import { getKpiUnitList,getKpiMasterList,getKpiRatingList,getDwpRevisonList } from "services/kpi.service";
import Datatable from "../../datatable/Datatable";
import { Box } from '@mui/material';
import Navbar from "components/Navbar/Navbar";
import './kpi-master.css'
import withRouter from "common/with-router";
import SelectPicker from "components/selectpicker/selectPicker";
import KpiratingDialog from "components/Login/kpiRatingDialog.component";


const KpiObjectiveMaster = ({router}) => {

  const {navigate,location} = router;

  const [kpiMasterList,setKpiMasterList] = useState([]);
  const [filKpiMasterList,setFilKpiMasterList] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isAddMode,setIsAddMode] = useState(true);
  const [kpiUnitList,setKpiUnitList] = useState([])
  const [isMr,setIsMr] = useState(true);
  const [revisionOptions,setRevisionOptions] = useState([]);
  const [revisionId,setRevisionId] = useState('A');
  const [revisionName,setRevisionName] = useState('A');
  const [dwpData,setDwpData] = useState('')
  const [dwpRevisionList,setDwpRevisionList] = useState([])

    const [initialValues,setInitialValues] = useState({
      kpiId     : 0,
      objective : '',
      metrics   : '',
      norms     : '',
      target    : '',
      kpiUnitId : 1,
      revisionRecordId : '0',
      ratings   : [{ startValue : '', endValue : '',rating : '' }],
    });


  const columns = [
    { name: 'SN', selector: (row) => row.sn, sortable: true, grow: 1, align: 'text-center', width: '3%'  },
    { name: 'Division/Group/LAB', selector: (row) => row.division, sortable: true, grow: 2, align: 'text-center', width: '15%'  },
    { name: 'Objectives', selector: (row) => row.objectives, sortable: true, grow: 2, align: 'text-left', width: '23%'  },
    { name: 'Metrics', selector: (row) => row.metrics, sortable: true, grow: 2, align: 'text-left', width: '22%'  },
    { name: 'Norms', selector: (row) => row.norms, sortable: true, grow: 2, align: 'text-left', width: '15%'  },
    { name: 'Target', selector: (row) => row.target, sortable: true, grow: 2, align: 'text-center', width: '12%'  },
    { name: 'Action', selector: (row) => row.action, sortable: true, grow: 2, align: 'text-center',  width: '10%' },
  ];



  const fetchData = async () => {
    try {
      const kpiMasterList  = await getKpiMasterList();
      const unitList = await getKpiUnitList();
      const dwpList = await getDwpRevisonList();

      setDwpRevisionList(dwpList)
      setIsMr(true)
      const dwpData = router.location.state?.dwpGwp;
      const revisionData = dwpList.map(data => ({
        value : String(data.revisionRecordId),
        label : data.docType === 'dwp'?'DWP - '+data.divisionMasterDto.divisionCode:'GWP - '+data.divisionGroupDto.groupCode
      }));
      const iniLsit = [{value : 'A', label : 'ALL'},{value : '0', label : 'COMMON LAB KPI'}]

      setRevisionOptions([...iniLsit,...revisionData])
      setKpiUnitList(unitList)
      setKpiMasterList(kpiMasterList)
      if(dwpData){
        setRevisionId(String(dwpData.revisionRecordId))
        setDwpData(dwpData)
        setIsMr(false);
        setDataTable(kpiMasterList.filter(data => Number(data.revisionRecordId) === Number(dwpData.revisionRecordId)))
      }else{
        if(revisionId === 'A'){
          setDataTable(kpiMasterList)
        }else{
          setDataTable(kpiMasterList.filter(data => Number(data.revisionRecordId) === Number(revisionId)))
        }
      }
      setIsReady(true);

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isReady]);

  const getUnitSingle = {
    'DAYS'   : ' DAY',
    'NOS'    : ' NO',
    'WEEKS'  : ' WEEK',
    'MONTHS' : ' MONTH',
    'QUATER' : 'QUATER',
    'YEAR'   : 'YEAR',
  };


  const getunit = (unitName,target)=>{
    if(Number(target) === 1 && unitName !== 'PERCENTAGE'){
      return target+getUnitSingle[unitName];
    }else{
      return unitName === 'PERCENTAGE'?(target+'%'):target+' '+ unitName;
    }
    
  }

  const setDataTable = (list)=>{

       const mappedData = list.map((item,index)=>{
          const kpiUnit = getunit(item.kpiUnitName,item.kpiTarget);
          return{
            sn          : index+1,
            division    : item.groupDivisionCode || '-',
            objectives  : item.kpiObjectives || '-',
            metrics     : item.kpiMerics || '-',
            norms       : item.kpiNorms || '-',
            target      : kpiUnit || '-',
            action      : <><button className=" btn btn-outline-warning btn-sm me-1" onClick={() => editKpi(item)}  title="Edit"> <i className="material-icons"  >edit_note</i></button></>
          }      
        });

      setFilKpiMasterList(mappedData);
   }

  const kpiAdd = ()=>{
    if(revisionId === 'A' || Number(revisionId) === 0){
      setRevisionName('COMMON')
    }else{
     const revData = dwpRevisionList.filter(item => item.revisionRecordId === Number(revisionId));
     setRevisionName(revData[0].docType === 'dwp'?'- '+revData[0].divisionMasterDto.divisionCode:'- '+revData[0].divisionGroupDto.groupCode)
    }
    setIsAddMode(true);
    setInitialValues({
      kpiId     : 0,
      objective : '',
      metrics   : '',
      norms     : '',
      target    : '',
      kpiUnitId : 1,
      revisionRecordId : '0',
      ratings   : Array.from({length : 5},(_,index) => ({startValue : '', endValue : '',rating : index+1  }))
   
    });

    setShowModal(true);
  }

  const editKpi = async (item)=>{

    setRevisionName(item.groupDivisionCode)
    setIsAddMode(false);
    const ratingList = await getKpiRatingList();
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
    setShowModal(true);
  }

  const onRevisionChange = (value)=>{
    setRevisionId(value);
    if(value === 'A'){
      setDataTable(kpiMasterList)
    }else{

      setDataTable(kpiMasterList.filter(data => data.revisionRecordId === value))
    }
  }

  const back = ()=>{
    if(dwpData.docType === 'dwp'){
      navigate('/dwp', { state: { divisionId: dwpData.groupDivisionId } })
    }else{
      navigate('/gwp', { state: { divisionId: dwpData.groupDivisionId } })
    }
  }

  const handleKpiActionDialogClose = ()=>{
    setShowModal(false);
  }

  const handleKpiActionDialogConfirm = async ()=>{
    fetchData();
    setShowModal(false);
  }
  
  return (
    <div>
      <Navbar />
      <div className="card">
        <div className="card-body text-center">
         <Box display="flex" alignItems="center" gap="10px" className='mg-down-10'>
          <Box flex="80%" className='text-center'><h3>Key Process Indicator</h3></Box>
          <Box flex="20%">
            <SelectPicker options={revisionOptions} label="Division/Group" readOnly = {!isMr} 
            value={revisionOptions && revisionOptions.length >0 && revisionOptions.find(option => option.value === revisionId) || null}
             handleChange={(newValue) => {onRevisionChange( newValue?.value) }}/>
          </Box>
         </Box>
          <div id="card-body customized-card">
            <Datatable columns={columns} data={filKpiMasterList} />
          </div>
          <div>
            {<button className="btn add btn-name" onClick={kpiAdd}> Add </button>}
            {!isMr && <button className="btn backClass" onClick={() => back()}>Back</button>}
          </div>
        </div>
      </div>
      <KpiratingDialog open={showModal} onClose={handleKpiActionDialogClose} onConfirm={handleKpiActionDialogConfirm} isAddMode={isAddMode} kpiUnitList={kpiUnitList} revisionId={revisionId} initialValues={initialValues} revisionName = {revisionName} flag = 'M' />
    </div>
  );

}
export default withRouter(KpiObjectiveMaster);