import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; 
import Navbar from "../Navbar/Navbar";
import "./dashboard.css";
import SelectPicker from 'components/selectpicker/selectPicker';
import { Autocomplete, TextField, Box, ListItemText } from '@mui/material';
import { CustomMenuItem } from 'services/auth.header';
import {getIqaDtoList,getIqaAuditeeList,getAuditeeTeamDtoList,getScheduleList} from "services/audit.service";

import {getQmDashboardDetailedList,getActiveAuditorsCount,getActiveAuditeeCount,getActiveTeams,
  getActiveSchedules,getTotalChecklistObsCountByIqa,getCheckListByObservation,getAllVersionRecordDtoList} from "services/dashboard.service";
import QmDocPrint from 'components/prints/qms/qm-doc-print';
import DwpDocPrint from "components/prints/qms/dwp-doc-print";
import { AgCharts } from 'ag-charts-react'; 
import Datatable from "components/datatable/Datatable";



import { format } from "date-fns";
import { Field, Formik, Form  } from "formik";


const labelColorsChecklist = {
  // NC: '#E2122A', 
  NC: '#d83034',
  OBS: '#008dff', 
  OFI: '#FFC300', 
};


const Dashboard = () => {

    const [iqaOptions,setIqaOptions] = useState([]);
    const [iqaNo,setIqaNo] = useState('');
    const [iqaId,setIqaId] = useState('');


  const [iqaFullList,setIqaFullList] = useState([]);
  const [iqaAuditeeFullList, setIqaAuditeeFullList] = useState([]);
  const [auditTeamFullList, setAuditTeamFullList] = useState([]);
  const [scheduleFullList,setScheduleFullList] = useState([]);


    const [qmNo, setQMNo] = useState(""); 

    const [qmRecordList, setQMRecordList] = useState([]);
    const [dwpRecordList, setDWPRecordList] = useState([]);
    const [gwpRecordList,setGWPRecordList] = useState([]);

    const [showQMModal, setQMShowModal] = useState(false);
    const [showQSPModal, setQSPShowModal] = useState(false);
    const [showDWPModal, setDWPShowModal] = useState(false);
    const [showGWPModal, setGWPShowModal] = useState(false);



    const [activeAuditorsCount,setActiveAuditorsCount] = useState(0);
    const [activeAuditeesCount,setActiveAuditeesCount] = useState(0);
    const [activeTeamsCount,setActiveTeamsCount] = useState(0);
    const [activeSchedulesCount,setActiveSchedulesCount] = useState(0);
    
    const [auditeeCountBasedOnIqaSel,setAuditeeCountBasedOnIqaSel] = useState(0);
    const [teamsCountBasedOnIqaSel,setTeamsCountBasedOnIqaSel] = useState(0);
    const [schedulesCountBasedOnIqaSel,setSchedulesCountBasedOnIqaSel] = useState(0);

  // Initialize the state with an object containing the counts

  const [totalObsCountBasedOnIqaSel, setTotalObsBasedOnIqaSel] = useState({
    totalCountNC: 0,
    totalCountOBS: 0,
    totalCountOFI: 0
  });

  const [selectedType, setSelectedType] = useState('div'); // Default to 'Division'

  const [agChartCheckListOptions, setAgChartChecklistOptions] = useState({});

  const handleTabClick = async (value) => {
    setSelectedType(value);
    await onIqaChange(iqaId,value);
  };
  
    // function getData() {
        //   return [
        //     {
        //       quarter: "Div1",
        //       NC: 140,
        //       OBS: 16,
        //       OFI: 14,
        //     },
        //     {
        //       quarter: "Div2",
        //       NC: 124,
        //       OBS: 20,
        //       OFI: 30,
        //     },
        //     {
        //       quarter: "Div3",
        //       NC: 112,
        //       OBS: 20,
        //       OFI: 18,
        //     },
        //     {
        //       quarter: "Div4",
        //       NC: 118,
        //       OBS: 0,
        //       OFI: 28,
        //     },
        //     {
        //       quarter: "Div5",
        //       NC: 18,
        //       OBS: 0,
        //       OFI: 8,
        //     },
        //     {
        //       quarter: "Div6",
        //       NC: 58,
        //       OBS: 10,
        //       OFI: 6,
        //     },
        //     {
        //       quarter: "Div7",
        //       NC: 16,
        //       OBS: 20,
        //       OFI: 36,
        //     },
        //     {
        //       quarter: "Div8",
        //       NC: 36,
        //       OBS: 5,
        //       OFI: 6,
        //     },
        //     {
        //       quarter: "Div9",
        //       NC: 140,
        //       OBS: 16,
        //       OFI: 14,
        //     },
        //     {
        //       quarter: "Div10",
        //       NC: 124,
        //       OBS: 20,
        //       OFI: 30,
        //     },
        //     {
        //       quarter: "Div11",
        //       NC: 112,
        //       OBS: 20,
        //       OFI: 18,
        //     },
        //     {
        //       quarter: "Div12",
        //       NC: 118,
        //       OBS: 0,
        //       OFI: 28,
        //     },
        //     {
        //       quarter: "Div13",
        //       NC: 18,
        //       OBS: 0,
        //       OFI: 8,
        //     },
        //     {
        //       quarter: "Div14",
        //       NC: 58,
        //       OBS: 10,
        //       OFI: 6,
        //     },
        //     {
        //       quarter: "Div15",
        //       NC: 16,
        //       OBS: 20,
        //       OFI: 36,
        //     },
        //     {
        //       quarter: "Div16",
        //       NC: 36,
        //       OBS: 5,
        //       OFI: 6,
        //     },
        //     {
        //       quarter: "Div17",
        //       NC: 118,
        //       OBS: 0,
        //       OFI: 28,
        //     },
        //     {
        //       quarter: "Div18",
        //       NC: 18,
        //       OBS: 0,
        //       OFI: 8,
        //     },
        //     {
        //       quarter: "Div19",
        //       NC: 58,
        //       OBS: 10,
        //       OFI: 6,
        //     },
        //     {
        //       quarter: "Div20",
        //       NC: 16,
        //       OBS: 20,
        //       OFI: 36,
        //     },
        //     {
        //       quarter: "Div21",
        //       NC: 36,
        //       OBS: 5,
        //       OFI: 6,
        //     },
        //     {
        //       quarter: "Div22",
        //       NC: 36,
        //       OBS: 5,
        //       OFI: 6,
        //     },
        //     {
        //       quarter: "Div23",
        //       NC: 18,
        //       OBS: 0,
        //       OFI: 8,
        //     },
        //     {
        //       quarter: "Div24",
        //       NC: 58,
        //       OBS: 10,
        //       OFI: 6,
        //     },
        //     {
        //       quarter: "Div25",
        //       NC: 16,
        //       OBS: 20,
        //       OFI: 36,
        //     },
        //     {
        //       quarter: "Div26",
        //       NC: 36,
        //       OBS: 5,
        //       OFI: 6,
        //     },
        //     {
        //       quarter: "Div27",
        //       NC: 118,
        //       OBS: 0,
        //       OFI: 28,
        //     },
        //     {
        //       quarter: "Div28",
        //       NC: 18,
        //       OBS: 0,
        //       OFI: 8,
        //     },
        //     {
        //       quarter: "Div29",
        //       NC: 58,
        //       OBS: 10,
        //       OFI: 6,
        //     },
        //     {
        //       quarter: "Div30",
        //       NC: 16,
        //       OBS: 20,
        //       OFI: 36,
        //     },
        //     {
        //       quarter: "Div31",
        //       NC: 36,
        //       OBS: 5,
        //       OFI: 6,
        //     },
        //     {
        //       quarter: "Div32",
        //       NC: 36,
        //       OBS: 5,
        //       OFI: 6,
        //     },
        //     {
        //       quarter: "Div33",
        //       NC: 140,
        //       OBS: 16,
        //       OFI: 14,
        //     },
        //     {
        //       quarter: "Div34",
        //       NC: 124,
        //       OBS: 20,
        //       OFI: 30,
        //     },
        //     {
        //       quarter: "Div35",
        //       NC: 112,
        //       OBS: 20,
        //       OFI: 18,
        //     },
        //     {
        //       quarter: "Div36",
        //       NC: 118,
        //       OBS: 0,
        //       OFI: 28,
        //     },
        //     {
        //       quarter: "Div37",
        //       NC: 18,
        //       OBS: 0,
        //       OFI: 8,
        //     },
        //     {
        //       quarter: "Div38",
        //       NC: 58,
        //       OBS: 10,
        //       OFI: 6,
        //     },
        //     {
        //       quarter: "Div39",
        //       NC: 16,
        //       OBS: 20,
        //       OFI: 36,
        //     },
        //     {
        //       quarter: "Div40",
        //       NC: 36,
        //       OBS: 5,
        //       OFI: 6,
        //     },
        //     {
        //       quarter: "Div41",
        //       NC: 140,
        //       OBS: 16,
        //       OFI: 14,
        //     },
        //     {
        //       quarter: "Div42",
        //       NC: 124,
        //       OBS: 20,
        //       OFI: 30,
        //     },
        //     {
        //       quarter: "Div43",
        //       NC: 112,
        //       OBS: 20,
        //       OFI: 18,
        //     },
        //     {
        //       quarter: "Div44",
        //       NC: 118,
        //       OBS: 0,
        //       OFI: 28,
        //     },
        //     {
        //       quarter: "Div45",
        //       NC: 18,
        //       OBS: 0,
        //       OFI: 8,
        //     },
        //     {
        //       quarter: "Div46",
        //       NC: 58,
        //       OBS: 10,
        //       OFI: 6,
        //     },
        //     {
        //       quarter: "Div47",
        //       NC: 16,
        //       OBS: 20,
        //       OFI: 36,
        //     },
        //     {
        //       quarter: "Div48",
        //       NC: 36,
        //       OBS: 5,
        //       OFI: 6,
        //     },
        //     {
        //       quarter: "Div49",
        //       NC: 118,
        //       OBS: 0,
        //       OFI: 28,
        //     },
        //     {
        //       quarter: "Div50",
        //       NC: 18,
        //       OBS: 0,
        //       OFI: 8,
        //     },
        //     {
        //       quarter: "Div51",
        //       NC: 58,
        //       OBS: 10,
        //       OFI: 6,
        //     },
        //     {
        //       quarter: "Div52",
        //       NC: 16,
        //       OBS: 20,
        //       OFI: 36,
        //     },
        //     {
        //       quarter: "Div53",
        //       NC: 36,
        //       OBS: 5,
        //       OFI: 6,
        //     },
        //     {
        //       quarter: "Div54",
        //       NC: 36,
        //       OBS: 5,
        //       OFI: 6,
        //     },
        //     {
        //       quarter: "Div55",
        //       NC: 18,
        //       OBS: 0,
        //       OFI: 8,
        //     },
        //     {
        //       quarter: "Div56",
        //       NC: 58,
        //       OBS: 10,
        //       OFI: 6,
        //     },
        //     {
        //       quarter: "Div57",
        //       NC: 16,
        //       OBS: 20,
        //       OFI: 36,
        //     },
        //     {
        //       quarter: "Div58",
        //       NC: 36,
        //       OBS: 5,
        //       OFI: 6,
        //     },
        //     {
        //       quarter: "Div59",
        //       NC: 118,
        //       OBS: 0,
        //       OFI: 28,
        //     },
        //     {
        //       quarter: "Div60",
        //       NC: 18,
        //       OBS: 0,
        //       OFI: 8,
        //     },
        //     {
        //       quarter: "Div61",
        //       NC: 58,
        //       OBS: 10,
        //       OFI: 6,
        //     },
        //     {
        //       quarter: "Div62",
        //       NC: 16,
        //       OBS: 20,
        //       OFI: 36,
        //     },
        //     {
        //       quarter: "Div63",
        //       NC: 36,
        //       OBS: 5,
        //       OFI: 6,
        //     },
        //     {
        //       quarter: "Div64",
        //       NC: 36,
        //       OBS: 5,
        //       OFI: 6,
        //     },
        //   ];
        // }
  

    const graphsForAdminDirMR = async (iqaId, iqaNo,selectedTypeData) => {
      try {
 
     
      // console.log('iqaId %%%%%%%%:'+iqaId);
      // console.log('iqaNo %%%%%%%%%%:'+iqaNo);
      // console.log('selectedTypeData %%%%%%%%:'+selectedTypeData);

        let modifiedIqaNo = '';  
          modifiedIqaNo = iqaNo.substring(4);

        const checkListDetailsBasedOnObservation = await getCheckListByObservation();
        console.log('checkListByObsBasedOnIqaIdSelData:', JSON.stringify(checkListDetailsBasedOnObservation, null, 2));
    
        // Use filter to get all matching items
        let checkListByObsBasedOnIqaIdSelData = checkListDetailsBasedOnObservation.filter(item => item.iqaId === iqaId);
    
        if (!checkListByObsBasedOnIqaIdSelData.length) {
          console.log('No data founddddd');
          return;
        }

   // Apply additional filters based on selectedTypeData
   if (selectedTypeData === 'div') {
    checkListByObsBasedOnIqaIdSelData = checkListByObsBasedOnIqaIdSelData.filter(
      item => item.divisionId > 0
    );
  } else if (selectedTypeData === 'grp') {
    checkListByObsBasedOnIqaIdSelData = checkListByObsBasedOnIqaIdSelData.filter(
      item => item.groupId > 0
    );
  } else if (selectedTypeData === 'prj') {
    checkListByObsBasedOnIqaIdSelData = checkListByObsBasedOnIqaIdSelData.filter(
      item => item.projectId > 0
    );
  }

  //console.log('Filtered Data:', JSON.stringify(checkListByObsBasedOnIqaIdSelData, null, 2));

    
    
        function getData() {
         if(selectedTypeData==='div'){
          return checkListByObsBasedOnIqaIdSelData.map(entry => ({
            quarter: entry.divisionName,
            NC: entry.countOfNC,
            OBS: entry.countOfOBS,
            OFI: entry.countOfOFI,
          }));
        }else if(selectedTypeData==='grp'){
          return checkListByObsBasedOnIqaIdSelData.map(entry => ({
            quarter: entry.groupName,
            NC: entry.countOfNC,
            OBS: entry.countOfOBS,
            OFI: entry.countOfOFI,
          }));
        }else if(selectedTypeData==='prj'){
          return checkListByObsBasedOnIqaIdSelData.map(entry => ({
            quarter: entry.projectName,
            NC: entry.countOfNC,
            OBS: entry.countOfOBS,
            OFI: entry.countOfOFI,
          }));
        }
        }
    
        //console.log('Processed Data:', JSON.stringify(getData(), null, 2));


        
        setAgChartChecklistOptions({
          title: {
            text: `Internal Quality Audit ${modifiedIqaNo}`,
          },
          subtitle: {
            text: "",
          },
          data: getData(),
          series: [
            {
              type: "bar",
              xKey: "quarter",
              yKey: "NC",
              yName: "NC",
              stacked: true,
              fill: labelColorsChecklist.NC, 
            },
            {
              type: "bar",
              xKey: "quarter",
              yKey: "OBS",
              yName: "OBS",
              stacked: true,
              fill: labelColorsChecklist.OBS, 
            },
            {
              type: "bar",
              xKey: "quarter",
              yKey: "OFI",
              yName: "OFI",
              stacked: true,
              fill: labelColorsChecklist.OFI, 
            },
          ],
        });
      

      } catch (error) {
        console.error('Error fetching graphsForAdminDirMR:', error);

      }
    }


const fetchAndSetTotalObsCountBasedOnIqa = async (iqaId) => {
  try {

      const checkListTotalObsCountList = await getTotalChecklistObsCountByIqa();


    if (checkListTotalObsCountList && checkListTotalObsCountList.length > 0) {
      const filteredTotalObsCount = checkListTotalObsCountList.filter(data => data.iqaId === iqaId);
      
      if (filteredTotalObsCount.length > 0) {
        setTotalObsBasedOnIqaSel({
          totalCountNC: filteredTotalObsCount[0].totalCountNC,
          totalCountOBS: filteredTotalObsCount[0].totalCountOBS,
          totalCountOFI: filteredTotalObsCount[0].totalCountOFI
        });
      }
    } else {
      setTotalObsBasedOnIqaSel({
        totalCountNC: 0,
        totalCountOBS: 0,
        totalCountOFI: 0
      });
    }
  } catch (error) {
    console.error('Error fetching total observation count:', error);
    setTotalObsBasedOnIqaSel({
      totalCountNC: 0,
      totalCountOBS: 0,
      totalCountOFI: 0
    });
  }
};



const onIqaChange = async (selectedIqaId,selectedTypeData) => {

  
  const selectedIqa = iqaFullList.find(iqa => iqa.iqaId === selectedIqaId);

  if (selectedIqa) {
    setIqaNo(selectedIqa.iqaNo);
    setIqaId(selectedIqa.iqaId);

    // Filter the iqa Auditee data based on the new IQA ID
    const IqaAuditeeDtoList = await getIqaAuditeeList(selectedIqa.iqaId);
    if (IqaAuditeeDtoList && IqaAuditeeDtoList.length > 0) {
      setIqaAuditeeFullList(IqaAuditeeDtoList);
      setAuditeeCountBasedOnIqaSel(IqaAuditeeDtoList.length);
    } 

    // Filter the audit team data based on the new IQA ID
    const filteredTeams = auditTeamFullList.filter(data => data.iqaId === selectedIqa.iqaId);
    setTeamsCountBasedOnIqaSel(filteredTeams.length);

   // Filter the schedules data based on the new IQA ID
   const filteredSchedules = scheduleFullList.filter(data => data.iqaId === selectedIqa.iqaId);
   setSchedulesCountBasedOnIqaSel(filteredSchedules.length);

   await fetchAndSetTotalObsCountBasedOnIqa(selectedIqaId);
   await graphsForAdminDirMR(selectedIqaId,selectedIqa.iqaNo,selectedTypeData);

  } else {
    // Handle null or invalid IQA selection
    setIqaNo("");
    setIqaId("");
    setIqaAuditeeFullList([]);
    setAuditeeCountBasedOnIqaSel(0);
    setTeamsCountBasedOnIqaSel(0);
    setSchedulesCountBasedOnIqaSel(0);
  }
};


    const fetchData = async () => {
      try {
        const qmDetails = await getQmDashboardDetailedList();
        setQMRecordList(qmDetails);
  
        // qmDetails 
        //const [qmDetailedData, setqmDetailedData] = useState({});
        // if (qmDetails && qmDetails.length > 0) {
        //   setqmDetailedData(qmDetails[0]); // Store just the first item
        //   setQMNo('I' + qmDetails[0].issueNo + '-R' + qmDetails[0].revisionNo); // Update QMNo
        // }

         // activeAuditorsCount 
         const activeAuditorsCount = await getActiveAuditorsCount();
         setActiveAuditorsCount(activeAuditorsCount);
         // activeAuditeesCount 
         const activeAuditeesCount = await getActiveAuditeeCount();
         setActiveAuditeesCount(activeAuditeesCount);
         //activeTeams
         const activeTeamsCount = await getActiveTeams();
         setActiveTeamsCount(activeTeamsCount);
         //activeSchedules
         const activeSchedules = await getActiveSchedules();
         setActiveSchedulesCount(activeSchedules);

        // Iqa dropdown and default iqa selection 
        const [IqaList, AuditTeamDtoList, ScheduleDtoList] = await Promise.all([ getIqaDtoList(), getAuditeeTeamDtoList(), getScheduleList()]);

          setIqaFullList(IqaList);
          const iqaData = IqaList.map(data => ({
                          value : data.iqaId,
                          label : data.iqaNo
                      }));
               
          let iqaNoSelected = '';  
          let iqaIdSelected = '';          
          if(IqaList.length >0){
            const iqa = IqaList[0];
            iqaNoSelected = iqa.iqaNo;
            iqaIdSelected = iqa.iqaId;
            setIqaNo(iqa.iqaNo)
            setIqaId(iqa.iqaId)
       
            const IqaAuditeeDtoList = await getIqaAuditeeList(iqa.iqaId);

            if (IqaAuditeeDtoList && IqaAuditeeDtoList.length > 0) {
              setIqaAuditeeFullList(IqaAuditeeDtoList);
              setAuditeeCountBasedOnIqaSel(IqaAuditeeDtoList.length);
            } else {
              setAuditeeCountBasedOnIqaSel(0);
            }


           
            if (AuditTeamDtoList && AuditTeamDtoList.length > 0) {
              setAuditTeamFullList(AuditTeamDtoList);
              const filteredTeams = AuditTeamDtoList.filter(data => data.iqaId === iqa.iqaId);
              setTeamsCountBasedOnIqaSel(filteredTeams.length);
            } else {
              setTeamsCountBasedOnIqaSel(0);
            }

            if (ScheduleDtoList && ScheduleDtoList.length > 0) {
              setScheduleFullList(ScheduleDtoList);
              const filteredSchedules = ScheduleDtoList.filter(data => data.iqaId === iqa.iqaId);
              setSchedulesCountBasedOnIqaSel(filteredSchedules.length);
            } else {
              setSchedulesCountBasedOnIqaSel(0);
            }


            let currentLoggerRoleId = localStorage.getItem('roleId');
            let currentLoggerDivId = localStorage.getItem('divId');

            
            const dwpVersionRecordList = await getAllVersionRecordDtoList({
              docType: 'dwp',
              groupDivisionId: (currentLoggerRoleId === '1' || currentLoggerRoleId === '2' || currentLoggerRoleId === '3') 
                ? '0' 
                : currentLoggerDivId,
            });
            console.log('dwpVersionRecordList Data:', JSON.stringify(dwpVersionRecordList, null, 2));


const gwpVersionRecordList = await getAllVersionRecordDtoList({
  docType: 'gwp',
  groupDivisionId: (currentLoggerRoleId === '1' || currentLoggerRoleId === '2' || currentLoggerRoleId === '3') 
  ? '0' 
  : currentLoggerDivId,
});
console.log('gwpVersionRecordList Data:', JSON.stringify(gwpVersionRecordList, null, 2));
            setDWPRecordList(dwpVersionRecordList);
            setGWPRecordList(gwpVersionRecordList);
        
            await fetchAndSetTotalObsCountBasedOnIqa(iqaIdSelected);
            
            await graphsForAdminDirMR(iqaIdSelected,iqaNoSelected,'div');

          }
          setIqaOptions(iqaData)

    


    
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
    
      useEffect(() => {
        fetchData();
      }, []);
  // Now, print the qmDetailedData object properly in the console


  
  

  const openQMPopUpModal = ()=>{
    setQMShowModal(true);
  }
    
      const openQSPPopUpModal = ()=>{
        setQSPShowModal(true);
      }

      const openDWPPopUpModal = ()=>{
        setDWPShowModal(true);
      }


      const openGWPPopUpModal = ()=>{
        setGWPShowModal(true);
      }


const handleQMClose = () => {
     setQMShowModal(false);
}   
  const handleQSPClose = () => {
    setQSPShowModal(false);
}

const handleDWPClose = ()=>{
  setDWPShowModal(false);
}


const handleGWPClose = ()=>{
  setGWPShowModal(false);
}

const columnsQM = [
  { name: 'SN', selector: (row) => row.sn, sortable: true, grow: 1, align: 'text-center' },
  { name: 'Description', selector: (row) => row.description, sortable: true, grow: 2, align: 'text-start' },
  { name: 'Issue From', selector: (row) => row.from, sortable: true, grow: 2, align: 'text-center' },
  { name: 'Issue To', selector: (row) => row.to, sortable: true, grow: 2, align: 'text-center' },
  { name: 'DOR', selector: (row) => row.issueDate, sortable: true, grow: 2, align: 'text-center' },
  { name: 'Status', selector: (row) => row.status, sortable: false, grow: 2, align: 'text-center' },
  { name: 'Action', selector: (row) => row.action, sortable: false, grow: 2, align: 'text-center' },
];

const getQMDocPDF = (action, revisionElements) => {
  return <QmDocPrint action={action} revisionElements={revisionElements} />
}

const mappedDataQM = qmRecordList.map((item, index) => ({
  sn: index + 1,
  description: item.description || '-' || '-',
  // from: 'V' + item[5] + '-R' + item[6] || '-',
  from: index + 1 < qmRecordList.length ? 'I' + qmRecordList[index + 1].issueNo + '-R' + qmRecordList[index + 1].revisionNo : '--',
  to: 'I' + item.issueNo + '-R' + item.revisionNo || '-',
  issueDate: format(new Date(item.dateOfRevision), 'dd-MM-yyyy') || '-',
  status: item.statusCode || '--',
  action: (
    <div>
      {!["APR", "APR-GDDQA", "APR-DGAQA"].includes(item.statusCode) && (
        <>
          {getQMDocPDF('', item)}
        </>
      )}
    </div>
  ),
}));

const getDocPDF = (action, revisionElements) => {
  return <DwpDocPrint action={action} revisionElements={revisionElements} />
}

const columnsDWP = [
  { name: 'SN', selector: (row) => row.sn, sortable: true, grow: 1, align: 'text-center' },
  { name: 'Description', selector: (row) => row.description, sortable: true, grow: 2, align: 'text-start' },
  { name: 'Issue From', selector: (row) => row.from, sortable: true, grow: 2, align: 'text-center' },
  { name: 'Issue To', selector: (row) => row.to, sortable: true, grow: 2, align: 'text-center' },
  { name: 'DOR', selector: (row) => row.issueDate, sortable: true, grow: 2, align: 'text-center' },
  { name: 'Status', selector: (row) => row.status, sortable: false, grow: 2, align: 'text-center' },
  { name: 'Action', selector: (row) => row.action, sortable: false, grow: 2, align: 'text-center' },
];

const mappedDataDWP = dwpRecordList.map((item, index) => ({
  sn: index + 1,
  description: item.description || '-' || '-',
  from: index + 1 < dwpRecordList.length ? 'I' + dwpRecordList[index + 1].issueNo + '-R' + dwpRecordList[index + 1].revisionNo : '--',
  to: 'I' + item.issueNo + '-R' + item.revisionNo || '-',
  issueDate: format(new Date(item.dateOfRevision), 'dd-MM-yyyy') || '-',
  status: item.statusCode || '--',
  action: (
    <div>
      {!["APR", "APR-GDDQA", "APR-DGAQA"].includes(item.statusCode) && (
        <>
          {getDocPDF('', item)}
        </>
      )}
    </div>
  ),
}));

const columnsGWP = [
  { name: 'SN', selector: (row) => row.sn, sortable: true, grow: 1, align: 'text-center' },
  { name: 'Description', selector: (row) => row.description, sortable: true, grow: 2, align: 'text-start' },
  { name: 'Issue From', selector: (row) => row.from, sortable: true, grow: 2, align: 'text-center' },
  { name: 'Issue To', selector: (row) => row.to, sortable: true, grow: 2, align: 'text-center' },
  { name: 'DOR', selector: (row) => row.issueDate, sortable: true, grow: 2, align: 'text-center' },
  { name: 'Status', selector: (row) => row.status, sortable: false, grow: 2, align: 'text-center' },
  { name: 'Action', selector: (row) => row.action, sortable: false, grow: 2, align: 'text-center' },
];
const mappedDataGWP = gwpRecordList.map((item, index) => ({
  sn: index + 1,
  description: item.description || '-' || '-',
  from: index + 1 < gwpRecordList.length ? 'I' + gwpRecordList[index + 1].issueNo + '-R' + gwpRecordList[index + 1].revisionNo : '--',
  to: 'I' + item.issueNo + '-R' + item.revisionNo || '-',
  issueDate: format(new Date(item.dateOfRevision), 'dd-MM-yyyy') || '-',
  status: item.statusCode || '--',
  action: (
    <div>
      {!["APR", "APR-GDDQA", "APR-DGAQA"].includes(item.statusCode) && (
        <>
          {getDocPDF('', item)}
        </>
      )}
    </div>
  ),
}));



  return (
    <div>
   <Navbar/>
      {/* <HeaderComponent /> */}

      {/* Main Content Below Header */}
      
  <div className="container-fluid page-body-wrapper dashboard-container"    sx={{
    height: "calc(100vh - 100px)", 
    overflowY: "auto",             
    overflowX: "hidden", 
    padding: '1.5rem 1.5rem',
    paddingTop: '0.5em',          
    background: "#f8f9fa",         
  }}>
        <div className="main-panel">
        {/* style={{ display: 'none' }} */}
          <div className="content-wrapper dashboard-wrapper pb-0" >

{/************************************ HEADER START ***************************************/}
<div className="page-header row mb-2">
  {/* Column for the heading like welcome something*/}
  <div className="col-md-9 d-flex align-items-center">
    <h5 className="mb-0">
      <span className="ps-0 h6 ps-sm-2 text-muted d-inline-block"></span>
    </h5>
  </div>

    {/* Column for the label */}
    <div className="col-md-1 d-flex justify-content-end" style={{ paddingRight: '0px'}}>
    <label htmlFor="iqa-select" style={{ color: 'black', fontWeight: 400,marginTop: '2px'}}>
      IQA No:
    </label>
  </div>

  {/* Column for the SelectPicker */}
  <div className="col-md-2 d-flex justify-content-start">
    <div style={{ flexGrow: 1, maxWidth: '70%' }}>
    <Autocomplete
        options={iqaOptions}
        getOptionLabel={(option) => option.label}
        value={
          iqaOptions &&
          iqaOptions.length > 0 &&
          iqaOptions.find((option) => option.value === iqaId) || null
        }
        onChange={(event, newValue) => onIqaChange(newValue?.value,selectedType)}  
        isOptionEqualToValue={(option, value) => option.value === value.value}
        renderOption={(props, option) => {
          const { key, ...restProps } = props;
          return (
            <CustomMenuItem {...restProps} key={key}>
              <ListItemText primary={option.label} />
            </CustomMenuItem>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            // label="IQA No"
            variant="standard"
            size="small"
            sx={{
              input: {
                color: '#2b2f32', // Set text color inside input field (selected value)
                padding: '5px 12px', // Adjust input padding if needed
                fontWeight: '600',
              },
              root: {
                '& .MuiOutlinedInput-root': {
                  border: 'none',
                  boxShadow: 'none',
                  color: 'black', // Ensure input text is black
                },
                '& .MuiInputLabel-root': {
                  color: 'darkblue', // Label color
                },
              },
            }}
            
          />
        )}
        disableClearable // Disable the clear button
      />
    </div>
  </div>
</div>


{/************************************ HEADER END ***************************************/}   

{/************************************ ROW START ***************************************/}
<div className="row">

{/*******************************GRID LEFT********************************************* */}


    <div className="col-xl-2 col-lg-12 stretch-card grid-margin divider-div-left" >
      <div className="row" >
                
          
             <div className="col-xl-12 col-md-4 stretch-card grid-margin grid-margin-sm-0 pb-sm-1">
       
               <div className="col-service-card"   onClick={() => openQMPopUpModal()} >
                 <div className="service-card">
                   <h3>QM</h3>
                   <p>
                   </p>
                    <figcaption></figcaption>
                </div>
              </div>

              {showQMModal && (
            <div className={`modal fade show modal-visible`} style={{ display: 'block' }} aria-modal="true" role="dialog">
              <div className="modal-dialog modal-lg modal-xl-custom">
                <div className="modal-content" >
                  <div className="modal-header bg-secondary d-flex justify-content-between bg-primary text-white">
                    <h5 className="modal-title">QM </h5>
                    <button type="button" className="btn btn-danger" onClick={handleQMClose} aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>

                  <div className="modal-body model-max-height">

                  <div id="card-body customized-card">
                    <Datatable columns={columnsQM} data={mappedDataQM} />
                  </div>
                  
                  </div>
                </div>
              </div>
            </div>

          )}
         </div>
                
                
     <div className="col-xl-12 col-md-4 stretch-card grid-margin grid-margin-sm-0 pb-sm-1">

      <div className="col-service-card"  onClick={() => openQSPPopUpModal()} >
        <div className="service-card">
          <h3>QSP</h3>
          <p>
          </p>
          <figcaption></figcaption>
        </div>
      </div>

      {showQSPModal && (
            <div className={`modal fade show modal-visible`} style={{ display: 'block' }} aria-modal="true" role="dialog">
              <div className="modal-dialog modal-lg modal-xl-custom">
                <div className="modal-content" >
                  <div className="modal-header bg-secondary d-flex justify-content-between bg-primary text-white">
                    <h5 className="modal-title">QSP </h5>
                    <button type="button" className="btn btn-danger" onClick={handleQSPClose} aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>

                  <div className="modal-body model-max-height">
                 
                  <table className="table table-bordered table-hover">
                      <thead>
                       <tr>
                          <th className='width25'>QSP</th>
                          <th className='width10'>Issue From</th>
                          <th className='width10'>Issue To</th>
                          <th className='width10'>DOR</th>
                          <th className='width10'>Print</th>
                       </tr>
                       </thead> 
                       <tbody>
                          <tr>
                              <td className='width25'></td>
                              <td className='width10 text-start'></td>
                              <td className='width10 text-start'></td>
                              <td className='width10'></td>
                              <td className='width10'></td>
                          </tr>
                        </tbody>
                    </table>


                  </div>
                </div>
              </div>
            </div>

          )}



     </div>
                 
     <div className="col-xl-12 col-md-4 stretch-card grid-margin grid-margin-sm-0 pb-sm-1">

     <div className="col-service-card"  onClick={() => openDWPPopUpModal()}>
        <div className="service-card">
   
          <h3>DWP</h3>
          <p>
           
          </p>
          <figcaption></figcaption>
        </div>
      </div>

      {showDWPModal && (
            <div className={`modal fade show modal-visible`} style={{ display: 'block' }} aria-modal="true" role="dialog">
              <div className="modal-dialog modal-lg modal-xl-custom">
                <div className="modal-content" >
                  <div className="modal-header bg-secondary d-flex justify-content-between bg-primary text-white">
                    <h5 className="modal-title">DWP </h5>
                    <button type="button" className="btn btn-danger" onClick={handleDWPClose} aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>

                  <div className="modal-body model-max-height">
                 
                
                  <div id="card-body customized-card">
                    <Datatable columns={columnsDWP} data={mappedDataDWP} />
                  </div>


                  </div>
                </div>
              </div>
            </div>

          )}


        </div>


       <div className="col-xl-12 col-md-4 stretch-card grid-margin grid-margin-sm-0 pb-sm-1">
       <div className="col-service-card"  onClick={() => openGWPPopUpModal()}>
        <div className="service-card">
   
          <h3>GWP</h3>
          <p>
           
          </p>
          <figcaption></figcaption>
        </div>
      </div>
      {showGWPModal && (
            <div className={`modal fade show modal-visible`} style={{ display: 'block' }} aria-modal="true" role="dialog">
              <div className="modal-dialog modal-lg modal-xl-custom">
                <div className="modal-content" >
                  <div className="modal-header bg-secondary d-flex justify-content-between bg-primary text-white">
                    <h5 className="modal-title">GWP</h5>
                    <button type="button" className="btn btn-danger" onClick={handleGWPClose} aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>

                  <div className="modal-body model-max-height">

                  <div id="card-body customized-card">
                    <Datatable columns={columnsGWP} data={mappedDataGWP} />
                  </div>

                  </div>

                </div>
              </div>
            </div>

          )}



      </div>
                </div>
  </div>


  {/**************************************************GRID RIGHT***************************************************************** */}
  
  <div className="col-xl-12 col-lg-12 stretch-card grid-margin divider-div-right ">
              
              <div className="card audit-graphs-card">
                 <div className="row">
                 <div className="col-md-2 col-sm-6 imsCounter">
   <a className="dashboard-links" href="/auditor-list">
          <div className="counter auditor">
              {/* <div className="counter-icon">
                  <span><RiShieldUserFill  color="White" className="counter-icons"  /></span>
              </div> */}
              <h3>Active Auditors</h3>
              <span className="counter-value">{activeAuditorsCount}</span>
          </div>
          </a>
      </div>



      <div className="col-md-2 col-sm-6 imsCounter">
      <a 
  className="dashboard-links" 
  href={`/iqa-auditee-list?iqaIdFromDashboard=${encodeURIComponent(iqaId)}&iqaNoFromDashboard=${encodeURIComponent(iqaNo)}`}
>
          <div className="counter auditee">
              {/* <div className="counter-icon">
                  <span> <FaUserCog  color="White" className="counter-icons"  /></span>
              </div> */}
              <h3>{iqaNo} Auditees</h3>
              <span className="counter-value">{auditeeCountBasedOnIqaSel}</span>
          </div>
          </a>
      </div>


      
     {/* <div className="col-md-2 col-sm-6 imsCounter">
      <a className="dashboard-links" 
      href={`/audit-team-list?iqaIdFromDashboard=${encodeURIComponent(iqaId)}&iqaNoFromDashboard=${encodeURIComponent(iqaNo)}`}
      >
          <div className="counter team">
              <h3>{iqaNo} Teams</h3>
              <span className="counter-value">{teamsCountBasedOnIqaSel}</span>
          </div>
          </a>
      </div>

      <div className="col-md-2 col-sm-6 imsCounter">
      <a className="dashboard-links" href="/schedule-list">
          <div className="counter schedule">
              <h3>{iqaNo} Schedules</h3>
              <span className="counter-value">{schedulesCountBasedOnIqaSel}</span>
          </div>
          </a>
      </div> */}

         
     <div className="col-md-2 col-sm-6 imsCounter">
      <a className="dashboard-links">
          <div className="counter team">
              {/* <div className="counter-icon">
                  <span> <BiLogoMicrosoftTeams  color="White" className="counter-icons"  /></span>
              </div> */}
              <h3>{iqaNo} Total NC</h3>
              <span className="counter-value">{totalObsCountBasedOnIqaSel.totalCountNC}</span>
          </div>
          </a>
      </div>

      <div className="col-md-2 col-sm-6 imsCounter">
      <a className="dashboard-links" href="">
          <div className="counter schedule">
              {/* <div className="counter-icon">
                  <span> <MdScheduleSend  color="White" className="counter-icons"  /></span>
              </div> */}
              <h3>{iqaNo} Total OBS</h3>
              <span className="counter-value">{totalObsCountBasedOnIqaSel.totalCountOBS}</span>
          </div>
          </a>
      </div>

      <div className="col-md-2 col-sm-6 imsCounter">
      <a className="dashboard-links" href="">
          <div className="counter ofi">
              {/* <div className="counter-icon">
                  <span> <MdScheduleSend  color="White" className="counter-icons"  /></span>
              </div> */}
              <h3>{iqaNo} Total OFI</h3>
              <span className="counter-value">{totalObsCountBasedOnIqaSel.totalCountOFI}</span>
          </div>
          </a>
      </div>
     

      <div className="col-md-2 col-sm-6 ">
      <ul class="toggleIms-tabs" >
      <li
        role="presentation"
        onClick={() => handleTabClick('div')}
    >
        <a className={selectedType === 'div' ? 'currentSel' : ''}>Div</a>
    </li>
    <li
        role="presentation"
        onClick={() => handleTabClick('grp')}
    >
        <a  className={selectedType === 'grp' ? 'currentSel' : ''}>Grp</a>
    </li>
    <li
        role="presentation"
        onClick={() => handleTabClick('prj')}
    >
        <a className={selectedType === 'prj' ? 'currentSel' : ''}>Prj</a>
    </li>              
    </ul>
      {/* <ul className="tabs">
        <li
          className={selectedType === 'div' ? 'current' : ''}
          onClick={() => handleTabClick('div')}
        >
          <a style={{borderLeft: '2px solid blue'}}>Division</a>
        </li>
        <li
          className={selectedType === 'grp' ? 'current' : ''}
          onClick={() => handleTabClick('grp')}
        >
          <a>Group</a>
        </li>
        <li
          className={selectedType === 'prj' ? 'current' : ''}
          onClick={() => handleTabClick('prj')}
        >
          <a style={{borderRight: '2px solid blue'}}>Project</a>
        </li>
      </ul> */}
      <div className="tab_content">
      </div>
    </div>


   </div>
 </div>




              <div className="card iqa-graphs-card">
                  <div className="row master-bar-graph">
                   
                      <AgCharts options={agChartCheckListOptions} />

                    
           </div>
                
<br></br>
<br></br>
<br></br>
<br></br>


             
              </div>


            </div>



</div>
{/************************************ ROW END ***************************************/}




          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
