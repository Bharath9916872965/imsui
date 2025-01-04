import React, { useEffect, useState } from "react";
import { getAuditeeTeamDtoList, getAuditorIsActiveList, getAuditTeamMemberList, getIqaDtoList, getTeamMemberIsActiveList, getAuditCheckListbyObs } from "../../services/audit.service";
import Navbar from "../Navbar/Navbar";
import SelectPicker from '../selectpicker/selectPicker';
import Datatable from "../datatable/Datatable";
import { getScheduleList,getTeamList } from "../../services/audit.service";
import internalAuditorTeamsPrint from "components/prints/qms/internalAduitor-teams-print";
import AuditSchedulePrint from "components/prints/qms/auditSchedule-print";
import NcPrint from "components/prints/qms/nc-print";
import OBSPrint from "components/prints/qms/obs-print";
import OFIPrint from "components/prints/qms/ofi-print";
import mergePdf from"components/prints/qms/auditorsSchedulemergePdf";
import dayjs from 'dayjs';
import { format } from "date-fns";
import { useLocation } from "react-router-dom";
const AuditSummaryReport = () => {
      const [auditTeamDtoList, setAuditTeamDtoList] = useState([]);
      const [filAuditTeamDtoList, setFilAuditTeamDtoList] = useState([]);
      const [auditTeamMemberDtoList, setAuditTeamMemberDtoList] = useState([]);
      const [iqaId, setIqaId] = useState('');
      const [iqaOptions, setIqaOptions] = useState([]);
      const [iqaNo, setIqaNo] = useState('');
      const [iqaFullList, setIqaFullList] = useState([])
      const [scheduleList,setScheduleList] = useState([]);
      const [filScheduleList,setFilScheduleList] = useState([]);
      const [isReady, setIsReady] = useState(false);
      const [iqaFromDate,setIqaFromDate] = useState(dayjs(new Date()));
      const [iqaToDate,setIqaToDate] = useState(dayjs(new Date()));
      const [fullchListByObsIds,setfullchListByObsIds]=useState([]);
      const [filNc,setfilNc]=useState([]);
      const [filObs,setfilObs]=useState([]);
      const [filOfi,setfilOfi]=useState([]);
      const [selectedOption, setSelectedOption] = useState("A");

      const location = useLocation();
 
  

      const fetchData = async () => {
         try {
           const scdList        = await getScheduleList();
           const iqaList        = await getIqaDtoList();
          const chListByObsIds= await getAuditCheckListbyObs();
      

           setfullchListByObsIds(chListByObsIds);
           setIqaFullList(iqaList);
           setScheduleList(scdList);
           const iqaData = iqaList.map(data => ({
                           value : data.iqaId,
                           label : data.iqaNo
                       }));
           if(iqaList.length >0){
             const iqa = iqaList[0];
             setIqaNo(iqa.iqaNo)
             setIqaId(iqa.iqaId)
              setIqaFromDate(dayjs(new Date(iqa.fromDate)))
             setIqaToDate(dayjs(new Date(iqa.toDate)))
            const scList = scdList.filter(data => data.iqaId === iqa.iqaId)
            setDataTable(scList);
            const ncList = chListByObsIds.filter(data => data.iqaId === iqa.iqaId && data.auditObsId ===2)
            const obsList = chListByObsIds.filter(data => data.iqaId === iqa.iqaId && data.auditObsId ===3)
            const ofiList = chListByObsIds.filter(data => data.iqaId === iqa.iqaId && data.auditObsId ===4)
            setNc(ncList);
            setObs(obsList);
            setOfi(ofiList);
           
           }
           setIqaOptions(iqaData)
     
          ////////////code to access audit summary from dashboard start////////////
          const queryParams = new URLSearchParams(location.search);
          const iqaIdSelFromDahboard = queryParams.get('iqaIdSel') || '';
          const obsTypeSelFromDahboard = queryParams.get('obsTypeSel') || '';
          setIsReady(true);
          if (isReady && ["N", "B", "O"].includes(obsTypeSelFromDahboard)) {
            onIqaChange(iqaIdSelFromDahboard);
            // Programmatically trigger the radio button change
            handleRadioChange({ target: { value: obsTypeSelFromDahboard } });
          }


          ////////////code to access audit summary from dashboard end////////////
     
         } catch (error) {
           console.error("Error fetching data:", error);
         }
       };
       const teamMembersGrouped = auditTeamMemberDtoList.reduce((acc, member) => {
        if (!acc[member.teamId]) {
          acc[member.teamId] = [];
        }
        // Push an object containing both teamMembers and isLead
        acc[member.teamId].push({
          name: member.teamMembers, // Assuming `teamMembers` is the member name
          isLead: member.isLead,   // Include `isLead` property
        });
        return acc;
      }, {});

      const auditTeamList = async () => {
        try {
          const [AuditTeamDtoList, IqaList] = await Promise.all([getAuditeeTeamDtoList(), getIqaDtoList()]);
          setIqaFullList(IqaList)
          const iqaData = IqaList.map(data => ({
            value: data.iqaId,
            label: data.iqaNo
          }));
         
          if (IqaList.length > 0) {
            setIqaNo(IqaList[0].iqaNo)
            setIqaId(IqaList[0].iqaId)
            setFilAuditTeamDtoList(AuditTeamDtoList.filter(data => data.iqaId === IqaList[0].iqaId));
          }
          setIqaOptions(iqaData)
          latestData();
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
    
        }
      };
    
      const latestData = async () => {
        const [AuditTeamDtoList, AuditorList, TeamMemberList, AuditTeamMemberList, IqaList] = await Promise.all([getAuditeeTeamDtoList(), getAuditorIsActiveList(), getTeamMemberIsActiveList(), getAuditTeamMemberList(), getIqaDtoList()]);
            setAuditTeamMemberDtoList(AuditTeamMemberList);
            setAuditTeamDtoList(AuditTeamDtoList);
          if (IqaList.length > 0) {
          setFilAuditTeamDtoList(AuditTeamDtoList.filter(data => data.iqaId === (iqaId === '' ? IqaList[0].iqaId : iqaId)));
        }
      }
       const auditorcolumns = [
        { name: 'SN', selector: (row) => row.sn, sortable: true, grow: 1, align: 'text-center', width: '3%'  },
        { name: 'Date & Time (Hrs)', selector: (row) => row.date, sortable: true, grow: 2, align: 'text-center', width: '11%'  },
        { name: 'Division/Group', selector: (row) => row.divisionCode, sortable: true, grow: 2, align: 'text-left', width: '15%'  },
        { name: 'Project', selector: (row) => row.project, sortable: true, grow: 2, align: 'text-left', width: '19%'  },
        { name: 'Auditee', selector: (row) => row.auditee, sortable: true, grow: 2, align: 'text-left', width: '17%'  },
        { name: 'Team', selector: (row) => row.team, sortable: true, grow: 2, align: 'text-left', width: '7%'  },
             ];
           
            // Determine the maximum number of auditors
            const maxAuditors = Math.max(
              ...filAuditTeamDtoList.map(
                  (team) => (teamMembersGrouped[team.teamId] || []).length
              )
          );
          
          const InAuditorTeamscolumns = [
              { name: 'SN', selector: (row) => row[0], sortable: true, grow: 1, align: 'text-center', width: '3%' },
              { name: 'Teams', selector: (row) => row[1], sortable: true, grow: 2, align: 'text-left', width: '11%' },
          ];
          
          // Dynamically add columns for auditors
          for (let i = 1; i <= maxAuditors; i++) {
              InAuditorTeamscolumns.push({
                  name: `Auditor ${i}`,
                  selector: (row) => row[i + 1], // Row index starts at 2 because the first two columns are SN and Teams
                  sortable: true,
                  align: 'text-left',
                  width: '10%',
              });
          }
          
          let auditorsList = [];
          // Create table rows based on team data
          filAuditTeamDtoList.forEach((team, index) => {
              const teamMembers = teamMembersGrouped[team.teamId] || [];
              const auditors = teamMembers.map((member) => member.name);
            // Add SN and Teams columns
              const row = [
                  index + 1, // SN
                  team.teamCode || '-', // Teams
              ];
            // Add auditor names to the row
              for (let i = 0; i < maxAuditors; i++) {
                  row.push(auditors[i] || '-');
              }
            auditorsList.push(row); // Push the constructed row into the auditorsList array
          });
          
       
          const ncColumns = [
            { name: 'SN', selector: (row) => row.sn, sortable: true, grow: 1, align: 'text-center', width: '3%'  },
            { name: 'SectionNo', selector: (row) => row.sectionNo, sortable: true, grow: 1, align: 'text-center', width: '3%'  },
            { name: 'ClauseNo', selector: (row) => row.clauseNo, sortable: true, grow: 2, align: 'text-center', width: '11%'  },
            { name: 'Description', selector: (row) => row.description, sortable: true, grow: 2, align: 'text-left', width: '50%'  },
            { name: 'Auditor Remarks', selector: (row) => row.auditorRemarks, sortable: true, grow: 2, align: 'text-left', width: '25%'  },
          ];
    useEffect(() => {
         fetchData();
       }, [isReady]);
      useEffect(() => {
    auditTeamList();
  }, []);


    const onIqaChange = (value)=>{
      const iqaId = Number(value); 
   const iqa = iqaFullList.filter(data => data.iqaId === iqaId);

    setFilAuditTeamDtoList(auditTeamDtoList.filter(data => data.iqaId === iqaId));
    setIqaId(iqaId);
    setIqaNo(iqa && iqa.length > 0 && iqa[0].iqaNo)

     //for schedule on change
      const selectedIqa = iqaFullList.find(data => data.iqaId === iqaId);
      if(selectedIqa){
        setIqaNo(selectedIqa.iqaNo)
        setIqaFromDate(dayjs(new Date(selectedIqa.fromDate)))
        setIqaToDate(dayjs(new Date(selectedIqa.toDate)))
     }
     
    const scList = scheduleList.filter(data => data.iqaId === iqaId)
      setDataTable(scList)
     
      //for NC On change
      const fillnc =fullchListByObsIds.filter(data=> data.iqaId === iqaId && data.auditObsId ===2);
      const fillobs =fullchListByObsIds.filter(data=> data.iqaId === iqaId && data.auditObsId ===3);
      const fillofi =fullchListByObsIds.filter(data=> data.iqaId === iqaId && data.auditObsId ===4);

      setNc(fillnc);
      setObs(fillobs);
      setOfi(fillofi);
    }


    const handleRadioChange = (event) => {
      console.log("Event object:", event);
      console.log("Event target:", event.target);
      console.log("Event target value:", event.target.value);
      setSelectedOption(event.target.value);
    
    };
  const setDataTable = (list)=>{
    if (!list || list.length === 0) {
      setFilScheduleList([{ message: "No data available." }]);
      return;
    }

  
    const mappedData = list.map((item,index)=>{
     return{
        sn           : index+1,
        date         :  format(new Date(item.scheduleDate),'dd-MM-yyyy HH:mm') || '-',
        divisionCode : item.divisionName === '' && item.groupName === '' ? '-' : item.divisionName !== '' && item.groupName !== '' ? item.divisionName + '/' + item.groupName : item.divisionName !== '' ? item.divisionName : item.groupName !== '' ? item.groupName : '-',
        project      : item.projectName === ''?'-':item.projectName || '-',
        auditee      : item.auditeeEmpName || '-',
        team         : item.teamCode || '-',
}      
    });
setFilScheduleList(mappedData);
  }

  const setNc = (list)=>{
    if (!list || list.length === 0) {
      setfilNc([{ message: "No data available." }]);
      return;
    }
    const mappedData = list.map((item,index)=>({
      sn: index + 1,
      sectionNo: item.sectionNo || '-',
      clauseNo: item.clauseNo || '-',
      description: item.description || '-',
      auditorRemarks: item.auditorRemarks || '-'
    }));
        setfilNc(mappedData);
    
}
const setObs = (list)=>{
    const mappedData = list.map((item,index)=>({
    sn: index + 1,
    sectionNo: item.sectionNo || '-',
    clauseNo: item.clauseNo || '-',
    description: item.description || '-',
    auditorRemarks: item.auditorRemarks || '-'
  }));

  setfilObs(mappedData);
  
}
const setOfi = (list)=>{
    const mappedData = list.map((item,index)=>({
    sn: index + 1,
    sectionNo: item.sectionNo || '-',
    clauseNo: item.clauseNo || '-',
    description: item.description || '-',
    auditorRemarks: item.auditorRemarks || '-'
  }));
    setfilOfi(mappedData);
  
}
// Example usage for different auditObsId values
  
  return (
    <div>
      <Navbar />
      <div className="card">
        <div className="card-body text-center">
          <div className="row">
            <div className="col-md-2">
            </div>
            <div className="col-md-4">
              <h5>{iqaNo} : Audit Summary Report</h5>
            </div>
            <div className="col-md-2">
            </div>
              <div className="col-md-2">
              <SelectPicker options={iqaOptions} label="IQA No"
                value={iqaOptions && iqaOptions.length > 0 && iqaOptions.find(option => option.value === iqaId) || null}
                handleChange={(newValue) => { onIqaChange(newValue?.value) }} />
            </div>
              <div className="col-md-2" style={{display: "flex",alignItems: "center",justifyContent: "space-between", gap: "10px", }}>
  {/* All Print */}
  <div style={{ textAlign: "center" }}>
  <button
    onClick={() =>
      mergePdf(filScheduleList, iqaNo, iqaFromDate, iqaToDate, filAuditTeamDtoList, teamMembersGrouped)
    }
    title="All Print"
    aria-label="Print All AuditSchedule"
    style={{ margin: "0 5px" }}
  >
    <i className="material-icons">print</i> &nbsp;Print All
  </button>
</div>

  {/* Auditor Teams */}
  
</div>
          
          </div><br />
          <div className="row">    
  <div style={{ padding: '10px' }}>
  <input type="radio" id="auditorTeams" name="auditOption" value="A"  checked={selectedOption === "A"} onChange={handleRadioChange} /> <label htmlFor="auditorTeams" style={{ fontWeight: 'bold' }}>Auditors </label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  <input type="radio" id="scheduleList" name="auditOption" value="S"  checked={selectedOption === "S"} onChange={handleRadioChange} /> <label htmlFor="scheduleList" style={{ fontWeight: 'bold' }}>Schedule List</label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  <input type="radio" id="nc" name="auditOption" value="N"  checked={selectedOption === "N"} onChange={handleRadioChange} /> <label htmlFor="nc" style={{ fontWeight: 'bold' }}>NC</label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  <input type="radio" id="obc" name="auditOption" value="B"  checked={selectedOption === "B"} onChange={handleRadioChange} /> <label htmlFor="obc" style={{ fontWeight: 'bold' }}>OBS</label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  <input type="radio" id="ofi" name="auditOption" value="O"  checked={selectedOption === "O"} onChange={handleRadioChange} /> <label htmlFor="ofi" style={{ fontWeight: 'bold' }}>OFI</label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
 
 &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp;
  {selectedOption === 'A' && (
    <button onClick={() => internalAuditorTeamsPrint(filAuditTeamDtoList, teamMembersGrouped, iqaNo)}title="Print" aria-label="Print checklist">
 <i className="material-icons">print</i> Auditors Print
    </button>
  )}
{selectedOption === 'S' && (
    <button onClick={() => AuditSchedulePrint(filScheduleList, iqaNo, iqaFromDate, iqaToDate)} title="Print" aria-label="Print AuditSchedule" >
      <i className="material-icons">print</i>Audit Schedule
    </button>
  )}
  {selectedOption === 'N' && (
    <button onClick={() => NcPrint(filNc, iqaNo, iqaFromDate, iqaToDate)} title="Print" aria-label="Print AuditSchedule" >
      <i className="material-icons">print</i>NC
    </button>
  )}
  {selectedOption === 'B' && (
    <button onClick={() => OBSPrint(filObs, iqaNo, iqaFromDate, iqaToDate)} title="Print" aria-label="Print AuditSchedule" >
      <i className="material-icons">print</i>OBS
    </button>
  )}
  {selectedOption === 'O' && (
    <button onClick={() => OFIPrint(filOfi, iqaNo, iqaFromDate, iqaToDate)} title="Print" aria-label="Print AuditSchedule" >
      <i className="material-icons">print</i>OFI
    </button>
  )}

</div>
</div>
<div className="team-list">
  {/* Auditor Teams Section */}
  
  {/* {<Datatable columns={columns} data={filScheduleList} /> } */}
{selectedOption === 'A' ? (
  <Datatable columns={InAuditorTeamscolumns} data={auditorsList} />
) : selectedOption === 'S' ? (
  <Datatable columns={auditorcolumns} data={filScheduleList} />
) : selectedOption === 'N' ? (
  <Datatable columns={ncColumns} data={filNc} />
) : selectedOption === 'B' ? (
  <Datatable columns={ncColumns} data={filObs} />
) : selectedOption === 'O' ? (
  <Datatable columns={ncColumns} data={filOfi} />

) : null}


</div>


        </div>
      </div>
    </div>
  );

};
export default AuditSummaryReport; 