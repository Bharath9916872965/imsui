import React, { useEffect, useState } from "react";
import { getKpiUnitList,getKpiMasterList,getKpiRatingList,getGroupDivisionList } from "services/kpi.service";
import Datatable from "../../datatable/Datatable";
import { Box } from '@mui/material';
import Navbar from "components/Navbar/Navbar";
import './kpi-master.css'
import withRouter from "common/with-router";
import SelectPicker from "components/selectpicker/selectPicker";
import KpiratingDialog from "components/Login/kpiRatingDialog.component";
import kpiMasterPdf from "components/prints/qms/kpi-master-print";

const KpiObjectiveMaster = ({router}) => {

  const {navigate,location} = router;

  const [kpiMasterList,setKpiMasterList] = useState([]);
  const [filKpiMasterList,setFilKpiMasterList] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isAddMode,setIsAddMode] = useState(true);
  const [kpiUnitList,setKpiUnitList] = useState([])
  const [isMr,setIsMr] = useState(true);
  const [grpDivOptions,setGrpDivOptions] = useState([]);
  const [grpDivId,setGrpDivId] = useState('A');
  const [grpDivType,setGrpDivType] = useState('C');
  const [grpDivMainId,setGrpDivMainId] = useState('A');
  const [grpDivName,setGrpDivName] = useState('A');
  const [dwpData,setDwpData] = useState('')
  const [groupDivisionList,setGroupDivisionList] = useState([])
  const [selOpt,setselectedOption] = useState('ALL')
  
    const [initialValues,setInitialValues] = useState({
      kpiId     : 0,
      objective : '',
      metrics   : '',
      norms     : '',
      target    : '',
      kpiUnitId : 1,
      groupDivisionId : '0',
      kpiType : '',
      ratings   : [{ startValue : '', endValue : '',rating : '' }],
    });

console.log('selOpt',selOpt);
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
      const grpDivList = await getGroupDivisionList();

      setGroupDivisionList(grpDivList)
      setIsMr(true)
      const dwpData = router.location.state?.dwpGwp;
      const grpDivData = grpDivList.map(data => ({
        value : String(data.groupDivisionMainId),
        label : data.groupDivisionCode,
      }));
      const iniLsit = [{value : 'A', label : 'ALL'},{value : '0', label : 'COMMON LAB KPI'}]

      setGrpDivOptions([...iniLsit,...grpDivData])
      setKpiUnitList(unitList)
      setKpiMasterList(kpiMasterList)
      if(dwpData){
        if(dwpData.docType === 'gwp'){
          setGrpDivType('G');
          const divData = grpDivList.find(data => Number(data.groupDivisionId) === Number(dwpData.groupDivisionId) && data.groupDivisionType === 'G');
          setDataTable(kpiMasterList.filter(data => Number(data.groupDivisionId) === Number(divData.groupDivisionId) && data.kpiType === 'G'))
          setGrpDivMainId(String(divData.groupDivisionMainId))
        }else{
          setGrpDivType('D');
          const divData = grpDivList.find(data => Number(data.groupDivisionId) === Number(dwpData.groupDivisionId) && data.groupDivisionType === 'D');
          setDataTable(kpiMasterList.filter(data => Number(data.groupDivisionId) === Number(divData.groupDivisionId) && data.kpiType === 'D'))
          setGrpDivMainId(String(divData.groupDivisionMainId))
        }
        setDwpData(dwpData)
        setIsMr(false);
        //setDataTable(kpiMasterList.filter(data => Number(data.revisionRecordId) === Number(dwpData.revisionRecordId)))
      }else{
        if(grpDivId === 'A'){
          setDataTable(kpiMasterList)
        }else if(grpDivId === '0'){
          setDataTable(kpiMasterList.filter(data => Number(data.groupDivisionId) === 0))
        }else{
          const divData = groupDivisionList.find(data => Number(data.groupDivisionMainId) === Number(grpDivMainId));
          setDataTable(kpiMasterList.filter(data => Number(data.groupDivisionId) === Number(divData.groupDivisionId) && divData.groupDivisionType === data.kpiType))
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
    if(grpDivId === 'A' || Number(grpDivId) === 0){
      setGrpDivName('COMMON')
    }else{
      const divData = groupDivisionList.find(data => Number(data.groupDivisionMainId) === Number(grpDivId));
      setGrpDivName(divData.groupDivisionCode);
    }
    setIsAddMode(true);
    setInitialValues({
      kpiId     : 0,
      objective : '',
      metrics   : '',
      norms     : '',
      target    : '',
      kpiUnitId : 1,
      groupDivisionId : '0',
      kpiType : '',
      ratings   : Array.from({length : 5},(_,index) => ({startValue : '', endValue : '',rating : index+1  }))
   
    });

    setShowModal(true);
  }

  const editKpi = async (item)=>{

    setGrpDivName(item.groupDivisionCode)
    setIsAddMode(false);
    const ratingList = await getKpiRatingList();
    setInitialValues({
      kpiId     : item.kpiId,
      objective : item.kpiObjectives,
      metrics   : item.kpiMerics,
      norms     : item.kpiNorms,
      target    : item.kpiTarget,
      kpiUnitId : item.kpiUnitId,
      groupDivisionId : item.groupDivisionId,
      kpiType : item.kpiType,
      ratings   : ratingList.filter(data => Number(data.kpiId) === Number(item.kpiId)).map(item => ({ startValue: item.startValue,endValue: item.endValue, rating: item.kpiRating.toString(),}))
   
    });
    setShowModal(true);
  }

  // const onGrpDivChange = (value)=>{
  // console.log('value',value);
  //   setGrpDivMainId(value)
  //   if(value === 'A'){
  //     setDataTable(kpiMasterList);
  //     setGrpDivId(value);
  //     setGrpDivType('C');
  //   }else if(value === '0'){
  //     setDataTable(kpiMasterList.filter(data => Number(data.groupDivisionId) === Number(value)))
  //     setGrpDivId(value);
  //     setGrpDivType('C');
  //   }else{
  //     const divData = groupDivisionList.find(data => Number(data.groupDivisionMainId) === Number(value));
  //     setDataTable(kpiMasterList.filter(data => Number(data.groupDivisionId) === Number(divData.groupDivisionId) && divData.groupDivisionType === data.kpiType))
  //     setGrpDivId(divData.groupDivisionId);
  //     setGrpDivType(divData.groupDivisionType);
  //   }
  // }
const onGrpDivChange = (selectedOption) => {
  if (selectedOption) {
    setselectedOption(selectedOption.label)
    const { value, label } = selectedOption; // Extract both value and label
  setGrpDivMainId(value);
    if (value === 'A') {
      setDataTable(kpiMasterList);
      setGrpDivId(value);
      setGrpDivType('C');
    } else if (value === '0') {
      setDataTable( kpiMasterList.filter((data) => Number(data.groupDivisionId) === Number(value)));
      setGrpDivId(value);
      setGrpDivType('C');
    } else {
      const divData = groupDivisionList.find((data) => Number(data.groupDivisionMainId) === Number(value));
      if (divData) {
        setDataTable(kpiMasterList.filter((data) =>Number(data.groupDivisionId) === Number(divData.groupDivisionId) && divData.groupDivisionType === data.kpiType));
        setGrpDivId(divData.groupDivisionId);
        setGrpDivType(divData.groupDivisionType);
      }
    }
  }
};

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
          {/* <Box flex="30%">
               <span className="text-heading">&nbsp;   </span>
               <button className=" btn-primary"  onClick={() =>kpiMasterPdf(filKpiMasterList)} title="Print" aria-label="Print checklist" > <i className="material-icons">print</i> </button>
            </Box> */}
          <Box flex="20%">
            <SelectPicker options={grpDivOptions} label="Division/Group" readOnly = {!isMr} 
            value={grpDivOptions && grpDivOptions.length >0 && grpDivOptions.find(option => option.value === grpDivMainId) || null}
             handleChange={(newValue) => {onGrpDivChange( newValue) }}
             />
          </Box>
         </Box>
          <div id="card-body customized-card">
            <Datatable columns={columns} data={filKpiMasterList} />
          </div>
          <div>
            {<button className="btn add btn-name" onClick={kpiAdd}> Add </button>}
            &nbsp; 
            { <button className="btn btn-dark" onClick={() => kpiMasterPdf(filKpiMasterList,selOpt)}>
PRINT
</button>}
            {!isMr && <button className="btn backClass" onClick={() => back()}>Back</button>}
          </div>
        </div>
      </div>
      <KpiratingDialog open={showModal} onClose={handleKpiActionDialogClose} onConfirm={handleKpiActionDialogConfirm} isAddMode={isAddMode} kpiUnitList={kpiUnitList} grpDivId={grpDivId} initialValues={initialValues} grpDivName = {grpDivName} flag = 'M' grpDivType = {grpDivType} />
    </div>
  );

}
export default withRouter(KpiObjectiveMaster);