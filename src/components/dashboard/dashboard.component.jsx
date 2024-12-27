import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; 
import Navbar from "../Navbar/Navbar";
import "./dashboard.css";
import SelectPicker from 'components/selectpicker/selectPicker';
import { Autocomplete, TextField, Box, ListItemText } from '@mui/material';
import { CustomMenuItem } from 'services/auth.header';
import {getIqaAuditeeList,getAuditeeTeamDtoList,getScheduleList} from "services/audit.service";
import {getKpiMasterList,getKpiObjRatingList } from "services/kpi.service";
import {getIqaDtoListForDahboard,getQmDashboardDetailedList,getActiveAuditorsCount,getActiveAuditeeCount,
  getTotalChecklistObsCountByIqa,getCheckListByObservation,getAllVersionRecordDtoList,getAllActiveDwpRecordList} from "services/dashboard.service";
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
  OFI: '#f2c45f', 
};




const Dashboard = () => {

    //const [activeTeamsCount,setActiveTeamsCount] = useState(0);
    //const [activeSchedulesCount,setActiveSchedulesCount] = useState(0);
    //const [auditTeamFullList, setAuditTeamFullList] = useState([]);
    // const [teamsCountBasedOnIqaSel,setTeamsCountBasedOnIqaSel] = useState(0);
    // const [schedulesCountBasedOnIqaSel,setSchedulesCountBasedOnIqaSel] = useState(0);

  let currentLoggerRoleName = localStorage.getItem('roleName');
  let currentLoggerRoleId = localStorage.getItem('roleId');
  let currentLoggerDivId = localStorage.getItem('divId');

   const isHidden =currentLoggerRoleName && (currentLoggerRoleName.trim() === 'Admin' || currentLoggerRoleName.trim() === 'Director'  || currentLoggerRoleName.trim() === 'MR' );


  const [iqaFullList,setIqaFullList] = useState([]);
  const [iqaAuditeeFullList, setIqaAuditeeFullList] = useState([]);
  const [iqaOptions,setIqaOptions] = useState([]);


  const [iqaNoSelected,setIqaNo] = useState('');
  const [iqaIdSelected,setIqaId] = useState('');

  const [scheduleFullList,setScheduleFullList] = useState([]);
  const [filteredScheduleList,setFilteredScheduleList] = useState([]);


  const [qmRecordList, setQMRecordList] = useState([]);
  const [dwpRecordList, setDWPRecordList] = useState([]);
  const [gwpRecordList,setGWPRecordList] = useState([]);

  const [showQMModal, setQMShowModal] = useState(false);
  const [showQSPModal, setQSPShowModal] = useState(false);
  const [showDWPModal, setDWPShowModal] = useState(false);
  const [showGWPModal, setGWPShowModal] = useState(false);

  const [activeAuditorsCount,setActiveAuditorsCount] = useState(0);
  const [activeAuditeesCount,setActiveAuditeesCount] = useState(0);

  const [auditeeValSel, setAuditeeValSel] = useState(0);
  const [auditeeCountBasedOnIqaSel,setAuditeeCountBasedOnIqaSel] = useState(0);

  const [totalObsCountBasedOnIqaSel, setTotalObsBasedOnIqaSel] = useState({
    totalCountNC: 0,
    totalCountOBS: 0,
    totalCountOFI: 0
  });

  const [AgChartObsForAuditeeSelOption, setAgChartObsForAuditeeSelOption] = useState({});
  const [AgChartKPIForAuditeeSelOption, setAgChartKPIForAuditeeSelOption] = useState({});
  const [selectedType, setSelectedType] = useState('div'); // Default to 'Division'
  const [agChartCheckListOptions, setAgChartChecklistOptions] = useState({});

  const [revisionRecordIdByIqaAndAuditee,setRevisionRecordIdByIqaAndAuditee] = useState(0);
  
  const [kpiMasterList,setKpiMasterList] = useState([]);
  const [kpiObjRatingList,setKpiObjRatingList] = useState([])
  const [filKpiMasterList,setFilKpiMasterList] = useState([]);



  const handleTabClick = async (value) => {
    setSelectedType(value);
    await onIqaChange(iqaIdSelected,value);
  };
  


        const updateGraphsData = async (iqaId, iqaNo, selectedTypeData, currentAuditeeIdSel) => {
          try {
            
            // let dataForKPI = [
            //   { kpiName: "KPI1", kpiFullName:"Data  of KPI1", kpiRating: 1 },
            //   { kpiName: "KPI2", kpiFullName:"Data  of KPI2",kpiRating: 5 },
            //   { kpiName: "KPI3", kpiFullName:"Data  of KPI3",kpiRating: 3 },
            //   { kpiName: "KPI4", kpiFullName:"Data  of KPI4",kpiRating: 5 },
            //   { kpiName: "KPI5", kpiFullName:"Data  of KPI5",kpiRating: 2 },
            //   { kpiName: "KPI6", kpiFullName:"Data  of KPI6",kpiRating: 4 },
            //   { kpiName: "KPI7", kpiFullName:"Data  of KPI7",kpiRating: 5 },
            // ];

          let dataForKPI = [
          { kpiName: "KPI not Found",kpiFullName:"Not Found", kpiRating: 0 },
          ];
          
        let selAuditeeName;
        let docType;
        let groupDivisionId;

          
            let modifiedIqaNo = iqaNo.substring(4);  
            const checkListDetailsBasedOnObservation = await getCheckListByObservation();
            let dataForObs = [0, 0, 0]; 
///////////////////////////////AUDITEEID GREATER THAN 0/////////////////////////////////////////////////////////////
            if (currentAuditeeIdSel > 0) {
              // Filter data based on the iqaId and auditeeId
      let checkListByObsBasedOnIqaIdSelData = checkListDetailsBasedOnObservation.filter(item => item.iqaId === iqaId && item.auditeeId === currentAuditeeIdSel);
        
             if (checkListByObsBasedOnIqaIdSelData && checkListByObsBasedOnIqaIdSelData.length > 0) {
 
     

                  // Extract the first (and only) row that matches the condition
      
        const entry = checkListByObsBasedOnIqaIdSelData[0];
             ///////////////////////COUNTER START////////////////////////////////////
               setTotalObsBasedOnIqaSel({
                   totalCountNC: entry.countOfNC,
                   totalCountOBS: entry.countOfOBS,
                   totalCountOFI: entry.countOfOFI
       });
       ///////////////////////COUNTER END////////////////////////////////////


        
        dataForObs = [entry.countOfNC, entry.countOfOBS, entry.countOfOFI]; 
        if (entry.divisionId > 0) {
          selAuditeeName =   entry.divisionName  
          docType = "dwp";        
          groupDivisionId = entry.divisionId;       
        } else if (entry.groupId > 0) {
          selAuditeeName =   entry.groupName  
          docType = "gwp";  
          groupDivisionId = entry.groupId;                      // Dynamic data for group
        } else if (entry.projectId > 0) {
          selAuditeeName =   entry.projectName                        // Dynamic data for project
        }


        //////////////////KPI logic startedif currentAuditeeIdSel > 0 then KPI /////
        let revisionId = 0;
        console.log("groupDivisionId "+groupDivisionId);
        console.log("docType "+docType);
        const dwpRevisionList = await getAllActiveDwpRecordList();
        if (dwpRevisionList) {
             //Finding Primary key RevisionRecordId
             //console.log("dwpRevisionList"+JSON.stringify(dwpRevisionList, null, 2)); 
            const filteredRows = dwpRevisionList.filter(item => 
                item.groupDivisionId === groupDivisionId && item.docType === docType
            );
            //console.log("filteredRows of dwp"+JSON.stringify(filteredRows, null, 2)); 
            if (filteredRows.length > 0) {
 
                // Find the row with the highest revisionNo
    const highestRevisionRow = filteredRows.reduce((max, current) => {
      //console.log("Comparing revisionNos", current.revisionNo, "with", max.revisionNo);
      return current.revisionNo > max.revisionNo ? current : max;
  });
  
   // Extract the RevisionRecordId from the highest revision row
   revisionId = highestRevisionRow.revisionRecordId;

            }
        }
        setRevisionRecordIdByIqaAndAuditee(revisionId);
        
        console.log("revisionRecordId for KPI :"+revisionId);
        console.log("iqaId for KPI :"+iqaId);



   
        const kpiMasterList = await getKpiMasterList();
        setKpiMasterList(kpiMasterList);
        const kpiObjRatingList = await getKpiObjRatingList();
        setKpiObjRatingList(getKpiObjRatingList);
   


    

          if (Array.isArray(kpiObjRatingList) && kpiObjRatingList.length > 0) {
              console.log("kpiObjRatingList"+JSON.stringify(kpiObjRatingList, null, 2)); 
            const filratingData = kpiObjRatingList.filter(
              (item) =>
                Number(item.revisionRecordId) === Number(revisionId) &&
                iqaId === item.iqaId
            );
           if (filratingData.length > 0) {


                console.log("KPI data after adddddddddddd"+JSON.stringify(filratingData, null, 2)); 
                setFilKpiMasterList(filratingData);
         
                dataForKPI = filratingData.map((item, index) => ({
                   kpiName: `KPI-${index + 1}` || "KPI", 
                   kpiFullName : item.kpiObjectives  || "", 
                   kpiRating: item.kpiRating || 0, 
                  }));
                  // getAvgRating(filrating)
          } else {
             
                const filKpiMasterData = kpiMasterList.filter(
                (item) =>
                  Number(item.revisionRecordId) === Number(revisionId) ||
                 item.revisionRecordId === '0'
                 );
                if (filKpiMasterData.length > 0) {
                  console.log("KPI data before adddddddddddd"+JSON.stringify(filKpiMasterData, null, 2)); 
                  setFilKpiMasterList(filKpiMasterData)
                    dataForKPI = filKpiMasterData.map((item, index) => ({
                      kpiName: `KPI-${index + 1}` || "KPI", 
                      kpiFullName : item.kpiObjectives  || "", 
                      kpiRating: 0, 
                   }));
                }
              
            }

          }else{

          }
          



            //dynamic data

             }else {
               dataForObs = [0, 0, 0]; // Static data for when no auditee is selected
               setTotalObsBasedOnIqaSel({
                totalCountNC: 0,
                totalCountOBS: 0,
                totalCountOFI: 0
              });
            }

              // If auditeeValSel is not 0, display the doughnut chart with preset data
              const doughnutDataObsAuditeeSel = {
                labels: ['NC', 'OBS', 'OFI'],
                datasets: [
                  {
                    data: dataForObs, // Use dynamic data here
                    backgroundColor: ['#d83034', '#008dff', '#f2c45f'],
                  },
                ],
              };

              const doughnutOptionsObsAuditeeSel = {
                chart: {
                  type: 'donut',
                },
                background: {
                  fill: '#fff',
                },
                padding: {
                  top: 0,    
                  bottom: 0,  
                  left: 0,    
                  right: 0,   
                },
                series: [
                  {
                    type: 'donut',
                    angleKey: 'value', 
                    calloutLabelKey: 'value',
                    showInLegend: 'true',
                    legendItemKey:'label',
                    fills: doughnutDataObsAuditeeSel.datasets[0].backgroundColor,
                    data: doughnutDataObsAuditeeSel.labels.map((label, index) => ({
                      label,
                      value: doughnutDataObsAuditeeSel.datasets[0].data[index], 
                      fill: doughnutDataObsAuditeeSel.datasets[0].backgroundColor[index], 
                    })),
                    outerRadiusRatio: 0.7,
                    innerRadiusRatio: 0.5,
                  },
                ],
             
                  legend: {
                    enabled: true,
                    position: 'bottom', 
                    item: {
                      maxWidth: 130,
                      paddingX: 5,
                      paddingY: 2,
                      marker: {
                          padding: 2,
                      }
                  },
                    reverseOrder: false, 
                    useHTML: false, 
                    orientation: 'horizontal', 
                  
                  },
              };
              
            
              setAgChartObsForAuditeeSelOption(doughnutOptionsObsAuditeeSel);


            ////KPI violet/////

 
            const doughnutOptionsKPIAuditeeSel = {
              title: {
                text: `KPI Statistics For ${iqaNo} And Auditee ${selAuditeeName}`,
                position: "bottom", 
              },
              data: dataForKPI, // Pass the data here
              series: [
                
                {
                  type: "area",
                  xKey: "kpiName",
                  yKey: "kpiRating",
                  yName: "",
                  stroke: "#00246B",
                  strokeWidth: 4,
                  fill: "transparent",
                  label: {
                    fontWeight: "bold",
                    formatter: ({ value }) => value.toFixed(0),
                  },
                  marker: {
                    fill: "#CADCFC",
                    size: 10,
                    stroke: "#00246B",
                    strokeWidth: 3,
                    shape: "diamond",
                  },
                  tooltip: {
                    enabled: true,
                    renderer: ({ datum, color }) => {
                      return `
                        <div style="padding: 10px; border-radius: 5px; background: #f9f9f9; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                          <span style="display: inline-block; width: 12px; height: 12px; background-color: ${color}; margin-right: 8px; border-radius: 2px;"></span>
                          <b>${datum.kpiFullName}</b> (${datum.kpiName}): ${datum.kpiRating}
                        </div>
                      `;
                    },
                  },
                  
                },
              ],
              axes: [
                {
                  type: "category",
                  position: "bottom",
                  title: {
                    text: "",
                  },
                },
                {
                  type: "number",
                  position: "left",
                  title: {
                    text: "Ratings",
                  },
                  interval: { step: 1 },
                },
              ],
            };

            
            setAgChartKPIForAuditeeSelOption(doughnutOptionsKPIAuditeeSel);
        
       
             
 ///////////////////////////////// AUDITEEID is equal to 0 ///////////////////////////////////////////////////////////            
            } else {

              ///////////////////////COUNTER START////////////////////////////////////
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
               ///////////////////////COUNTER END////////////////////////////////////

        
              // Filter data based on the iqaId only 
              let checkListByObsBasedOnIqaIdSelData = checkListDetailsBasedOnObservation.filter(item => item.iqaId === iqaId);
        
              // If no data is found, reset the chart options and return
              if (!checkListByObsBasedOnIqaIdSelData.length) {
                console.log('No data found');
                setAgChartChecklistOptions({
                  title: {
                    text: `Internal Quality Audit ${modifiedIqaNo}`,
                  },
                  subtitle: {
                    text: "",
                  },
                  data: [], // Clear data
                  series: [], // Clear series
                });
                return;
              }
        
              // Filter data based on the selected type
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
        
              // Function to get the relevant data based on the selected type
              const getData = () => {
                if (selectedTypeData === 'div') {
                  return checkListByObsBasedOnIqaIdSelData.map(entry => ({
                    quarter: entry.divisionName,
                    NC: entry.countOfNC,
                    OBS: entry.countOfOBS,
                    OFI: entry.countOfOFI,
                  }));
                } else if (selectedTypeData === 'grp') {
                  return checkListByObsBasedOnIqaIdSelData.map(entry => ({
                    quarter: entry.groupName,
                    NC: entry.countOfNC,
                    OBS: entry.countOfOBS,
                    OFI: entry.countOfOFI,
                  }));
                } else if (selectedTypeData === 'prj') {
                  return checkListByObsBasedOnIqaIdSelData.map(entry => ({
                    quarter: entry.projectName,
                    NC: entry.countOfNC,
                    OBS: entry.countOfOBS,
                    OFI: entry.countOfOFI,
                  }));
                }
              };
        
              // Set the chart options
              setAgChartChecklistOptions({
                title: {
                  text: `Internal Quality Audit ${modifiedIqaNo}`,
                },
                subtitle: {
                  text: "",
                },
                data: getData(), // Processed data based on selected type
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

            }
          } catch (error) {
            console.error('Error fetching updateGraphsData:', error);
          }
        };
        


const onAuditeeChange = async (selAuditeeId,selDivisionId,selGroupId,selProjectId,selTypeData) => {

        setAuditeeValSel(selAuditeeId); 
        await updateGraphsData(iqaIdSelected,iqaNoSelected,selectedType,selAuditeeId);
       
    
 
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
    //const filteredTeams = auditTeamFullList.filter(data => data.iqaId === selectedIqa.iqaId);
    //setTeamsCountBasedOnIqaSel(filteredTeams.length);

   // Filter the schedules data based on the new IQA ID
   if (scheduleFullList && scheduleFullList.length > 0) {
    const filteredSchedules = scheduleFullList.filter(data => data.iqaId === selectedIqa.iqaId);

      // Reset selected auditee if it doesn't exist in the new filteredScheduleList
      if (filteredSchedules && filteredSchedules.length > 0 ) {
        setFilteredScheduleList(filteredSchedules);
        setAuditeeValSel(0); // Reset to "All"
        //setSchedulesCountBasedOnIqaSel(filteredSchedules.length);
      } else {
        //setSchedulesCountBasedOnIqaSel(0);
      }
    
    } else {
    //setSchedulesCountBasedOnIqaSel(0);
  }


   await updateGraphsData(selectedIqaId,selectedIqa.iqaNo,selectedTypeData,0);

  } else {
    // Handle null or invalid IQA selection
    setIqaNo("");
    setIqaId("");
    setIqaAuditeeFullList([]);
    setAuditeeCountBasedOnIqaSel(0);
    //setTeamsCountBasedOnIqaSel(0);
   // setSchedulesCountBasedOnIqaSel(0);
  }
};


    const fetchData = async () => {
      try {
        const qmDetails = await getQmDashboardDetailedList();
        const activeAuditorsCount = await getActiveAuditorsCount();
        const activeAuditeesCount = await getActiveAuditeeCount();
        const IqaList = await getIqaDtoListForDahboard();
        const ScheduleDtoList = await getScheduleList();
        //const AuditTeamDtoList = await getAuditeeTeamDtoList();
  

        setQMRecordList(qmDetails);
  
        // qmDetails 
        //const [qmDetailedData, setqmDetailedData] = useState({});
        // if (qmDetails && qmDetails.length > 0) {
        //   setqmDetailedData(qmDetails[0]); // Store just the first item
        //   setQMNo('I' + qmDetails[0].issueNo + '-R' + qmDetails[0].revisionNo); // Update QMNo
        // }

         // activeAuditorsCount 
       
         setActiveAuditorsCount(activeAuditorsCount);
         // activeAuditeesCount 
    
         setActiveAuditeesCount(activeAuditeesCount);
         //activeTeams
         //const activeTeamsCount = await getActiveTeams();
        // setActiveTeamsCount(activeTeamsCount);
         //activeSchedules
         //const activeSchedules = await getActiveSchedules();
        // setActiveSchedulesCount(activeSchedules);

        // Iqa dropdown and default iqa selection 
     
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


            if (ScheduleDtoList && ScheduleDtoList.length > 0) {
              setScheduleFullList(ScheduleDtoList);
              const filteredSchedules = ScheduleDtoList.filter(data => data.iqaId === iqa.iqaId);
              setFilteredScheduleList(filteredSchedules);
              if (filteredSchedules && filteredSchedules.length > 0 && !filteredSchedules.some(schedule => schedule.auditeeId === auditeeValSel)) {
              setAuditeeValSel(0); // Reset to "All"
              //setSchedulesCountBasedOnIqaSel(filteredSchedules.length);
            } else {
              //setSchedulesCountBasedOnIqaSel(0);
            }
            } else {
             // setSchedulesCountBasedOnIqaSel(0);
            }

       
            const IqaAuditeeDtoList = await getIqaAuditeeList(iqa.iqaId);

            if (IqaAuditeeDtoList && IqaAuditeeDtoList.length > 0) {
              setIqaAuditeeFullList(IqaAuditeeDtoList);
              setAuditeeCountBasedOnIqaSel(IqaAuditeeDtoList.length);
            } else {
              setAuditeeCountBasedOnIqaSel(0);
            }


           
            // if (AuditTeamDtoList && AuditTeamDtoList.length > 0) {
            //   setAuditTeamFullList(AuditTeamDtoList);
            //   const filteredTeams = AuditTeamDtoList.filter(data => data.iqaId === iqa.iqaId);
            //   setTeamsCountBasedOnIqaSel(filteredTeams.length);
            // } else {
            //   setTeamsCountBasedOnIqaSel(0);
            // }

            
            const dwpVersionRecordList = await getAllVersionRecordDtoList({
              docType: 'dwp',
              groupDivisionId: (currentLoggerRoleName && (currentLoggerRoleName.trim() === 'Admin' || currentLoggerRoleName.trim() === 'Director'  || currentLoggerRoleName.trim() === 'MR' )) 
                ? '0' 
                : currentLoggerDivId,
            });
            //console.log('dwpVersionRecordList Data:', JSON.stringify(dwpVersionRecordList, null, 2));


            
            const gwpVersionRecordList = await getAllVersionRecordDtoList({
            docType: 'gwp',
            groupDivisionId: (currentLoggerRoleName && (currentLoggerRoleName.trim() === 'Admin' || currentLoggerRoleName.trim() === 'Director'  || currentLoggerRoleName.trim() === 'MR' )) 
            ? '0' 
            : currentLoggerDivId,
           });
           //console.log('gwpVersionRecordList Data:', JSON.stringify(gwpVersionRecordList, null, 2));
            setDWPRecordList(dwpVersionRecordList);
            setGWPRecordList(gwpVersionRecordList);

     

            await updateGraphsData(iqaIdSelected,iqaNoSelected,'div',0);

          }
          setIqaOptions(iqaData)
     
    
         // setAuditeeOptions(auditeeData)

    
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

//console.log('filteredScheduleList Data:', JSON.stringify(filteredScheduleList, null, 2));

  return (
    <div className="dashboard-body">
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
        <div className="content-wrapper dashboard-wrapper pb-0"
          style={{ display: isHidden ? 'block' : 'none' }}
          >

{/************************************ HEADER START ***************************************/}
<div className="page-header row mb-3">
  {/* Column for the heading like welcome something*/}
  <div className="col-md-6 d-flex align-items-center">
    <h5 className="mb-0">
      <span className="ps-0 h6 ps-sm-2 text-muted d-inline-block"></span>
    </h5>
  </div>

    {/* Column for the label */}
    <div className="col-md-2 d-flex justify-content-end header-label-div" >
    <label className="header-label">
      IQA No:
    </label>
  </div>

  {/* Column for the SelectPicker */}
  <div className="col-md-1 d-flex justify-content-start header-selectpicker-div" >
    <div className="header-selectpicker">
    <Autocomplete
        options={iqaOptions}
        getOptionLabel={(option) => option.label}
        value={
          iqaOptions &&
          iqaOptions.length > 0 &&
          iqaOptions.find((option) => option.value === iqaIdSelected) || null
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

  {/* Column for the label */}
  <div className="col-md-1 d-flex justify-content-end header-label-div" >
    <label className="header-label">
      Auditee:
    </label>
  </div>

 {/* Column for the SelectPicker */}
 <div className="col-md-2 d-flex justify-content-start  header-selectpicker-div">
    <div className="header-selectpicker" >
    <Autocomplete
  options={
    filteredScheduleList &&
    filteredScheduleList.length > 0 &&
    filteredScheduleList.some(option => option.divisionId || option.groupId || option.projectId)
      ? [{ auditeeId: 0, label: "All" }, ...filteredScheduleList]
      : []
  }
  getOptionLabel={(option) => {
    // Restriction: Only proceed if filteredScheduleList meets the condition
    if (
      filteredScheduleList &&
      filteredScheduleList.length > 0 &&
      filteredScheduleList.some(option => option.divisionId || option.groupId || option.projectId)
    ) {
      if (option.auditeeId === 0) return "All";
      if (option.divisionId > 0) return option.divisionName || "Unnamed Division";
      if (option.groupId > 0) return option.groupName || "Unnamed Group";
      if (option.projectId > 0) return option.projectShortName || "Unnamed Project";
    }
    // Fallback for cases that don't meet the restriction
    return "No schedules";
  }}
  
  value={
    filteredScheduleList.find(option => option.auditeeId === auditeeValSel) || 
    { auditeeId: 0, label: "All" } // Default to "All" if selected value is not in the list
  }
  onChange={(event, newValue) => {
    if (newValue) {
      const { auditeeId, divisionId, groupId, projectId } = newValue;
      setAuditeeValSel(auditeeId); // Store the selected auditeeId in state
      // Pass all the required details (auditeeId, divisionId, groupId, projectId) to onAuditeeChange
      onAuditeeChange(auditeeId, divisionId, groupId, projectId, selectedType);
    } else {
      setAuditeeValSel(0); // Reset to "All" if no value is selected
      onAuditeeChange(0, 0, 0, 0, selectedType); // Pass null for the other fields when reset
    }
  }}
  isOptionEqualToValue={(option, value) => option.auditeeId === value}
  noOptionsText="No options"
  renderOption={(props, option) => (
    <CustomMenuItem {...props} key={option.auditeeId}>
      <ListItemText
        primary={
          option.auditeeId === 0
            ? "All"
            : option.divisionId > 0
            ? option.divisionName
            : option.groupId > 0
            ? option.groupName
            : option.projectId > 0
            ? option.projectShortName
            : "No label"
        }
      />
    </CustomMenuItem>
  )}
  renderInput={(params) => (
    <TextField
      {...params}
      variant="standard"
      size="small"
      sx={{
        input: {
          color: "#2b2f32",
          padding: "5px 12px",
          fontWeight: "600",
        },
        root: {
          "& .MuiOutlinedInput-root": {
            border: "none",
            boxShadow: "none",
            color: "black",
          },
          "& .MuiInputLabel-root": {
            color: "darkblue",
          },
        },
      }}
    />
  )}
  disableClearable
/>



    </div>
  </div>

</div>


{/************************************ HEADER END ***************************************/}   

{/************************************ ROW START ***************************************/}
<div className="row">

{/*******************************GRID LEFT********************************************* */}


    {/* <div className="col-xl-2 col-lg-12 stretch-card grid-margin divider-div-left" >
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
  </div> */}


  {/**************************************************GRID RIGHT***************************************************************** */}
  {/* <div className="col-xl-10 col-lg-12 stretch-card grid-margin divider-div-right "> */}
  <div className="col-xl-12 col-lg-12 stretch-card grid-margin  ">
              
              <div className="card audit-graphs-card">
                 <div className="row">

          <div className="col-md-2  docs-panel">
          <div className="row docs-row" >
 
            <div className="docs-div qm " onClick={() => openQMPopUpModal()}>
                <div className="docs-content">
                    <span className="docs-label">QM</span> 
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
      
        
            <div className="docs-div qsp " onClick={() => openQSPPopUpModal()}>
                <div className="docs-content">
                    <span className="docs-label">QSP</span> 
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
        <div className="row docs-row">

            <div className="docs-div dwp" onClick={() => openDWPPopUpModal()}>

                <div className="docs-content">
                    <span className="docs-label">DWP</span>
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





            <div className="docs-div gwp" onClick={() => openGWPPopUpModal()}>
                <div className="docs-content">
                    <span className="docs-label">GWP</span>
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


               

 <div className="col-md-8 counter-row">
 <div className="col-md-2  imsCounter">
              <a className="dashboard-links" href="/auditor-list">
                <div className="counter auditor">
                 <h3>Active Auditors</h3>
                 <span className="counter-value">{activeAuditorsCount}</span>
               </div>
             </a>
          </div>



      <div className="col-md-2 imsCounter">
      <a 
  className="dashboard-links" 
  href={`/iqa-auditee-list?iqaIdFromDashboard=${encodeURIComponent(iqaIdSelected)}&iqaNoFromDashboard=${encodeURIComponent(iqaNoSelected)}`}
>
          <div className="counter auditee">
              {/* <div className="counter-icon">
                  <span> <FaUserCog  color="White" className="counter-icons"  /></span>
              </div> */}
              <h3>{iqaNoSelected} Auditees</h3>
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

<div className="col-md-2 imsCounter">
      <a className="dashboard-links">
          <div className="counter team">
              {/* <div className="counter-icon">
                  <span> <BiLogoMicrosoftTeams  color="White" className="counter-icons"  /></span>
              </div> */}
              <h3>{iqaNoSelected} Total NC</h3>
              <span className="counter-value">{totalObsCountBasedOnIqaSel.totalCountNC}</span>
          </div>
          </a>
      </div>

      <div className="col-md-2  imsCounter">
      <a className="dashboard-links" href="">
          <div className="counter schedule">
              {/* <div className="counter-icon">
                  <span> <MdScheduleSend  color="White" className="counter-icons"  /></span>
              </div> */}
              <h3>{iqaNoSelected} Total OBS</h3>
              <span className="counter-value">{totalObsCountBasedOnIqaSel.totalCountOBS}</span>
          </div>
          </a>
      </div>

      <div className="col-md-2 imsCounter">
      <a className="dashboard-links" href="">
          <div className="counter ofi">
              {/* <div className="counter-icon">
                  <span> <MdScheduleSend  color="White" className="counter-icons"  /></span>
              </div> */}
              <h3>{iqaNoSelected} Total OFI</h3>
              <span className="counter-value">{totalObsCountBasedOnIqaSel.totalCountOFI}</span>
          </div>
          </a>
      </div>
 </div>
         
    
     

      <div className="col-md-2 col-sm-6 ">
      {auditeeValSel === 0 ? (
      <ul className="toggleIms-tabs" >
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
        <a className={selectedType === 'prj' ? 'currentSel' : ''}>Proj</a>
    </li>              
    </ul>
     
       ) : null
             
      }
    </div>


   </div>
 </div>




          


            </div>


 <div className="col-xl-12 col-lg-12 stretch-card grid-margin graphs-div">
  <div className="row">
    <div className="card common-graphs-card">

      {auditeeValSel === 0 ? (
       
       <div className="row master-graphs">
          <AgCharts options={agChartCheckListOptions} />
        </div>

      ) : (
        
        <div className="row user-graphs">
          
          <div className="col-md-3">
          <AgCharts options={AgChartObsForAuditeeSelOption} />
          </div>

          <div className="col-md-9">
          <AgCharts options={AgChartKPIForAuditeeSelOption} />
          </div>

         
        
        </div>

      )}
    </div>
  </div>
</div>


</div>
{/************************************ ROW END ***************************************/}




          </div>
        </div>
      </div>
    </div>
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
  
  );
};

export default Dashboard;
