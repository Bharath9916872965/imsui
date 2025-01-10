import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; 
import Navbar from "../Navbar/Navbar";
import "./dashboard.css";
import { Autocomplete, TextField, Box, ListItemText } from '@mui/material';
import { CustomMenuItem } from 'services/auth.header';
import { format } from "date-fns";
import { AgCharts } from 'ag-charts-react'; 
import Datatable from "components/datatable/Datatable";

import QmDocPrintDashboard from "components/prints/qms/qm-doc-print-dashboard";
import QspDocPrint from "components/prints/qms/qsp-doc-print";
import DwpDocPrint from "components/prints/qms/dwp-doc-print";

import {getIqaAuditeeList,getAuditeeTeamDtoList,getScheduleList} from "services/audit.service";

import {getKpiMasterList,getKpiObjRatingList } from "services/kpi.service";

import {getIqaDtoListForDahboard,getQmDashboardDetailedList,getActiveAuditorsCount,getActiveAuditeeCount, getTotalChecklistObsCountByIqa
 ,getCheckListByObservation,getAllVersionRecordDtoList,getAllActiveDwpRecordList
,getProjectListOfPrjEmps,getDivGroupListOfDivEmps,getDivisionListOfDivEmps,getProjectListOfPrjDir,getDivisionListOfDH,getDivisionListOfGH,getAllActiveDivisionList}
   from "services/dashboard.service";

   import {qspDocumentList} from "services/qms.service";


   


const labelColorsChecklist = {
  // NC: '#E2122A', 
  NC: '#d83034',
  OBS: '#008dff', 
  OFI: '#f2c45f', 
};




const Dashboard = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  let currentLoggerRoleName = localStorage.getItem('roleName');
  let currentLoggerRoleId =   localStorage.getItem('roleId');
  let currentLoggerEmpId =    localStorage.getItem('empId');

 
  const [isReady, setIsReady] = useState(false);
  const [iqaFullList,setIqaFullList] = useState([]);
  const [iqaAuditeeFullList, setIqaAuditeeFullList] = useState([]);
  const [iqaOptions,setIqaOptions] = useState([]);

  const [divisionMasterList, setDivisionMasterList] = useState([]);
  const [projectListOfPrjDir, setProjectListOfPrjDir] = useState([]);
  const [divisionListOfDH, setDivisionListOfDH] = useState([]);
  const [divisionListOfGH, setDivisionListOfGH] = useState([]);
  const [divisionListByRoleId, setDivisionListByRoleId] = useState([]);
  const [groupListByRoleId, setGroupListByRoleId] = useState([]);
  const [projectListByRoleId, setProjectListByRoleId] = useState([]);

  const [iqaNoSelected,setIqaNo] = useState('');
  const [iqaIdSelected,setIqaId] = useState('');
  const [auditeeValSel, setAuditeeValSel] = useState(0);

  const [scheduleFullList,setScheduleFullList] = useState([]);
  const [filteredScheduleList,setFilteredScheduleList] = useState([]);


  const [qmRecordList, setQMRecordList] = useState([]);
  const [qspRecordList, setQSPRecordList] = useState([]);
  const [dwpRecordList, setDWPRecordList] = useState([]);
  const [gwpRecordList,setGWPRecordList] = useState([]);

  const [showQMModal, setQMShowModal] = useState(false);
  const [showQSPModal, setQSPShowModal] = useState(false);
  const [showDWPModal, setDWPShowModal] = useState(false);
  const [showGWPModal, setGWPShowModal] = useState(false);

  const [activeAuditorsCount,setActiveAuditorsCount] = useState(0);
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


  

    //const [activeAuditeesCount,setActiveAuditeesCount] = useState(0);
    //const [activeTeamsCount,setActiveTeamsCount] = useState(0);
    //const [activeSchedulesCount,setActiveSchedulesCount] = useState(0);
    //const [auditTeamFullList, setAuditTeamFullList] = useState([]);
    // const [teamsCountBasedOnIqaSel,setTeamsCountBasedOnIqaSel] = useState(0);
    // const [schedulesCountBasedOnIqaSel,setSchedulesCountBasedOnIqaSel] = useState(0);
    //const isHidden =currentLoggerRoleName && (currentLoggerRoleName.trim() === 'Admin' || currentLoggerRoleName.trim() === 'Director'  || currentLoggerRoleName.trim() === 'MR' );





  const handleTabClick = async (value) => {
    setSelectedType(value);
    await onIqaChange(iqaIdSelected,value);
  };
  
  const scheduleListBasedOnLoggerRole= async (iqaId, iqaNo) => {
  try {
const ScheduleDtoList = await getScheduleList();
if (ScheduleDtoList && ScheduleDtoList.length > 0) {
      setScheduleFullList(ScheduleDtoList);
      const filteredSchedules = ScheduleDtoList.filter(data => data.iqaId === iqaId);



        let scheduleListRoleWise = [];
   
        if (currentLoggerRoleName &&
           ['Divisional MR', 'Auditee', 'Auditor'].includes(currentLoggerRoleName.trim())
        ){

          ////////////////////////DIVISION IDS FILTER/////////////////////////////////////
         let divisionIdOfDH = divisionListOfDH
         ? divisionListOfDH.map(division => division.divisionId)
            .sort((a, b) => a - b) 
            .join(',')
          : '';
          //console.log('divisionIdOfDH: ' + divisionIdOfDH);
    
          let divisionIdOfGH = divisionListOfGH
          ? divisionListOfGH.map(division => division.divisionId)
            .sort((a, b) => a - b) 
            .join(',')
          : '';
           //console.log('divisionIdOfGH: ' + divisionIdOfGH);
    
          let divisionIdsForLoggerRoleId = divisionListByRoleId
           ? divisionListByRoleId.map(division => division.divisionId)
            .sort((a, b) => a - b) 
            .join(',')
          : ''; 
          //console.log('divisionIdOfDivisionEmployees: ' + divisionIdsForLoggerRoleId);

           let currentLoggerDivId = localStorage.getItem('divId');
          //console.log('divisionIdOfCurrentEmployee: '+currentLoggerDivId);

           // Combine all four division ID strings into one array, remove duplicates, and then join them back into a string
           let uniqueDivisionIds;

           if (['Divisional MR'].includes(currentLoggerRoleName.trim())) {
            uniqueDivisionIds = currentLoggerDivId; // Filter out empty strings
           } else {
            uniqueDivisionIds = [
                ...new Set(
                    (divisionIdOfDH.split(',').filter(Boolean)) // Filter out empty strings
                    .concat(divisionIdOfGH.split(',').filter(Boolean))
                    .concat(divisionIdsForLoggerRoleId.split(',').filter(Boolean))
                    .concat(currentLoggerDivId)
                )
            ]
            .sort((a, b) => a - b)
            .join(',');
           }
        
          // console.log('Unique Division IDs: ' + uniqueDivisionIds);
          
            
           // If uniqueDivisionIds is not empty, filter schedules by divisionId
           if (uniqueDivisionIds) {
            const divisionIdsArray = uniqueDivisionIds.split(',').map(Number);
            const divisionMatchedSchedules = filteredSchedules.filter(schedule =>
            divisionIdsArray.includes(Number(schedule.divisionId))
           );
           scheduleListRoleWise = [...scheduleListRoleWise, ...divisionMatchedSchedules];
         }

          //prev way
          //   let groupIdsForLoggerRoleId = groupListByRoleId
          //  .map(group => group.groupId)
          //  .join(','); 
          
          ////////////////////////GROUP IDS FILTER/////////////////////////////////////
            let groupIdsForLoggerRoleId = '';
            if (uniqueDivisionIds) {
             const uniqueDivisionIdsArray = uniqueDivisionIds.split(',').map(Number);
             // Filter divisionMasterList to include only entries with matching divisionId
              const matchedDivisionsToGetGroupIds = divisionMasterList.filter(division =>
              uniqueDivisionIdsArray.includes(Number(division.divisionId))
              );
              // Extract groupIds from the matched divisions, or leave groupIdsForLoggerRoleId as an empty string if no matches
               groupIdsForLoggerRoleId = matchedDivisionsToGetGroupIds.length > 0
               ? [...new Set(matchedDivisionsToGetGroupIds.map(division => division.groupId))].join(',')
              : '';
              }
              //console.log('groupIdsForLoggerRoleId: '+groupIdsForLoggerRoleId);


              // If groupIdsForLoggerRoleId is not empty, filter schedules by groupId
              if (groupIdsForLoggerRoleId) {
                const groupIdsArray = groupIdsForLoggerRoleId.split(',').map(Number);
                const groupMatchedSchedules = filteredSchedules.filter(schedule =>
                 groupIdsArray.includes(Number(schedule.groupId))
                );
                scheduleListRoleWise = [...scheduleListRoleWise, ...groupMatchedSchedules];
               }

           ////////////////////////PROJECT IDS FILTER/////////////////////////////////////
           let projectIdsOfPrjDirector = projectListOfPrjDir
           ? projectListOfPrjDir.map(project => project.projectId)
               .sort((a, b) => a - b) 
               .join(',')
           : ''; 
           //console.log('projectIdsOfPrjDirector: '+projectIdsOfPrjDirector);

           let projectIdsOfProjectEmployees = projectListByRoleId
           ? projectListByRoleId.map(project => project.projectId)
               .sort((a, b) => a - b) 
               .join(',')
           : ''; 
           //console.log('projectIdsOfProjectEmployees: '+projectIdsOfProjectEmployees);

          let uniqueProjectIds;
          uniqueProjectIds = [
           ...new Set(
            (projectIdsOfPrjDirector.split(',').filter(Boolean)) // Filter out empty strings
            .concat(projectIdsOfProjectEmployees.split(',').filter(Boolean))
          )
         ]
         .sort((a, b) => a - b)
         .join(',');
          //console.log('uniqueProjectIds: '+uniqueProjectIds);

          // If uniqueProjectIds is not empty, filter schedules by projectId
          if (uniqueProjectIds) {
            const projectIdsArray = uniqueProjectIds.split(',').map(Number);
            const projectMatchedSchedules = filteredSchedules.filter(schedule =>
              projectIdsArray.includes(Number(schedule.projectId))
            );
            scheduleListRoleWise = [...scheduleListRoleWise, ...projectMatchedSchedules];
           }

         setFilteredScheduleList(scheduleListRoleWise);
          }else{
         setFilteredScheduleList(filteredSchedules);
         }


    /////////////////////////////////////////////////////////////


      if (filteredSchedules && filteredSchedules.length > 0 
        && !filteredSchedules.some(schedule => schedule.auditeeId === auditeeValSel)) {
      setAuditeeValSel(0); // Reset to "All"
      //setSchedulesCountBasedOnIqaSel(filteredSchedules.length);

    }

    } else {
     // setSchedulesCountBasedOnIqaSel(0);
    }

  } catch (error) {
    console.error('Error fetching scheduleListBasedOnLoggerRole:', error);
  }
  };

        const updateGraphsData = async (iqaId, iqaNo, selectedTypeData, currentAuditeeIdSel) => {
          try {
            //from dwpDivisionList you can compare and filter by divisionId column

          let dataForKPI = [
          { kpiName: "KPI not Found",kpiFullName:"Not Found", kpiRating: 0 },
          ];
          
        let selAuditeeName;
        let docType;
        let groupDivisionId;
        let kpiType;

          
            let modifiedIqaNo = iqaNo.substring(4);  
            const checkListDetailsBasedOnObservation = await getCheckListByObservation();
            //filter checklist rolewise



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
          kpiType = "D";      
        } else if (entry.groupId > 0) {
          selAuditeeName =   entry.groupName  
          docType = "gwp"; 
          kpiType = "G";   
          groupDivisionId = entry.groupId;                      
        } else if (entry.projectId > 0) {
          selAuditeeName =   entry.projectName  
          kpiType = "";                    
        }

        //////////////////KPI logic started if currentAuditeeIdSel > 0 then KPI /////
        //let revisionId = 0;
        //const dwpRevisionList = await getAllActiveDwpRecordList();
        // if (dwpRevisionList) {

        //     const filteredRows = dwpRevisionList.filter(item => 
        //         item.groupDivisionId === groupDivisionId && item.docType === docType
        //     );
        //     if (filteredRows.length > 0) {
 
       
        //   const highestRevisionRow = filteredRows.reduce((max, current) => {
        //     return current.revisionNo > max.revisionNo ? current : max;
        //  });
  

        //   revisionId = highestRevisionRow.revisionRecordId;

        //     }
        // }

        const kpiMasterList = await getKpiMasterList();
        const kpiObjRatingList = await getKpiObjRatingList();
       
        if(kpiType){
          if (Array.isArray(kpiObjRatingList) && kpiObjRatingList.length > 0) {
            const filratingData = kpiObjRatingList.filter(
              (item) =>
                Number(item.groupDivisionId) === Number(groupDivisionId) &&
                iqaId === item.iqaId &&
                kpiType === item.kpiType 
            );
           if (filratingData.length > 0) {
        
                dataForKPI = filratingData.map((item, index) => ({
                   kpiName: `KPI-${index + 1}` || "KPI", 
                   kpiFullName : item.kpiObjectives  || "", 
                   kpiRating: item.kpiRating || 0, 
                  }));
            
          } else {
                const filKpiMasterData = kpiMasterList.filter(
                (item) =>
                  ((Number(item.groupDivisionId) === Number(groupDivisionId) 
                  && kpiType === item.kpiType)|| item.groupDivisionId === 0 )
             
                 );
                if (filKpiMasterData.length > 0) {
                    dataForKPI = filKpiMasterData.map((item, index) => ({
                      kpiName: `KPI-${index + 1}` || "KPI", 
                      kpiFullName : item.kpiObjectives  || "", 
                      kpiRating: 0, 
                   }));
                }
              
            }

          }else{

          }
        }

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


            ////KPI Options/////
            const doughnutOptionsKPIAuditeeSel = {
              title: {
                text: `KPI Statistics for ${iqaNo} and the Auditee ${selAuditeeName}`,
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
              // const checkListTotalObsCountList = await getTotalChecklistObsCountByIqa();
              // if (checkListTotalObsCountList && checkListTotalObsCountList.length > 0) {
              //   const filteredTotalObsCount = checkListTotalObsCountList.filter(data => data.iqaId === iqaId);
                
              //   if (filteredTotalObsCount.length > 0) {
              //     setTotalObsBasedOnIqaSel({
              //       totalCountNC: filteredTotalObsCount[0].totalCountNC,
              //       totalCountOBS: filteredTotalObsCount[0].totalCountOBS,
              //       totalCountOFI: filteredTotalObsCount[0].totalCountOFI
              //     });
              //   }
              // } else {
              //   setTotalObsBasedOnIqaSel({
              //     totalCountNC: 0,
              //     totalCountOBS: 0,
              //     totalCountOFI: 0
              //   });
              // }
               ///////////////////////COUNTER END////////////////////////////////////

               if (!checkListDetailsBasedOnObservation.length) {

                setTotalObsBasedOnIqaSel({
                  totalCountNC: 0,
                  totalCountOBS: 0,
                  totalCountOFI: 0
                });

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
             
             
               // Filter data based on the iqaId only 
              let checkListByObsBasedOnIqaIdSelData = checkListDetailsBasedOnObservation.filter(item => item.iqaId === iqaId);
        

              if (!checkListByObsBasedOnIqaIdSelData.length) {

                setTotalObsBasedOnIqaSel({
                  totalCountNC: 0,
                  totalCountOBS: 0,
                  totalCountOFI: 0
                });

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
        
     

              let checkListByObsRoleWise = [];

              
                //Admin,Director,MR and MR-Rep should get all only for below roles restriction
                if (currentLoggerRoleName &&
                  ['Divisional MR', 'Auditee', 'Auditor'].includes(currentLoggerRoleName.trim())
                ){

                       ////////////////////////DIVISION IDS FILTER/////////////////////////////////////
                  let divisionIdOfDH = divisionListOfDH
                  ? divisionListOfDH.map(division => division.divisionId)
                      .sort((a, b) => a - b) 
                      .join(',')
                  : '';
              
                  let divisionIdOfGH = divisionListOfGH
                  ? divisionListOfGH.map(division => division.divisionId)
                      .sort((a, b) => a - b) 
                      .join(',')
                  : '';
              
                  let divisionIdsForLoggerRoleId = divisionListByRoleId
                  ? divisionListByRoleId.map(division => division.divisionId)
                      .sort((a, b) => a - b) 
                      .join(',')
                  : ''; 
          
                  let currentLoggerDivId = localStorage.getItem('divId');
          
                  // Combine all four division ID strings into one array, remove duplicates, and then join them back into a string
                  let uniqueDivisionIds;

                  if (['Divisional MR'].includes(currentLoggerRoleName.trim())) {
                      uniqueDivisionIds = currentLoggerDivId; // Filter out empty strings
                  } else {
                      uniqueDivisionIds = [
                          ...new Set(
                              (divisionIdOfDH.split(',').filter(Boolean)) // Filter out empty strings
                              .concat(divisionIdOfGH.split(',').filter(Boolean))
                              .concat(divisionIdsForLoggerRoleId.split(',').filter(Boolean))
                              .concat(currentLoggerDivId)
                          )
                      ]
                      .sort((a, b) => a - b)
                      .join(',');
                  }
                  
 
                     if (uniqueDivisionIds) {
                      const divisionIdsArray = uniqueDivisionIds.split(',').map(Number);
                      const divisionMatchedSchedules = checkListByObsBasedOnIqaIdSelData.filter(checkList =>
                      divisionIdsArray.includes(Number(checkList.divisionId))
                     );
                     checkListByObsRoleWise = [...checkListByObsRoleWise, ...divisionMatchedSchedules];
                   }




                 //prev way
          //   let groupIdsForLoggerRoleId = groupListByRoleId
          //  .map(group => group.groupId)
          //  .join(','); 

           ////////////////////////GROUP IDS FILTER/////////////////////////////////////
                 let groupIdsForLoggerRoleId = '';
               if (uniqueDivisionIds) {
                const uniqueDivisionIdsArray = uniqueDivisionIds.split(',').map(Number);
                   const matchedDivisionsToGetGroupIds = divisionMasterList.filter(division =>
                   uniqueDivisionIdsArray.includes(Number(division.divisionId))
               );
            
               groupIdsForLoggerRoleId = matchedDivisionsToGetGroupIds.length > 0
                 ? [...new Set(matchedDivisionsToGetGroupIds.map(division => division.groupId))].join(',')
                   : '';
               }
  
            
                if (groupIdsForLoggerRoleId) {
                const groupIdsArray = groupIdsForLoggerRoleId.split(',').map(Number);
                const groupMatchedSchedules = checkListByObsBasedOnIqaIdSelData.filter(checkList =>
                 groupIdsArray.includes(Number(checkList.groupId))
                );
                checkListByObsRoleWise = [...checkListByObsRoleWise, ...groupMatchedSchedules];
               }

    
              ////////////////////////PROJECT IDS FILTER/////////////////////////////////////
               let projectIdsOfPrjDirector = projectListOfPrjDir
               ? projectListOfPrjDir.map(project => project.projectId)
                   .sort((a, b) => a - b) 
                   .join(',')
               : ''; 
    
               let projectIdsOfProjectEmployees = projectListByRoleId
               ? projectListByRoleId.map(project => project.projectId)
                   .sort((a, b) => a - b) 
                   .join(',')
               : ''; 
    
              let uniqueProjectIds;
              uniqueProjectIds = [
               ...new Set(
                (projectIdsOfPrjDirector.split(',').filter(Boolean)) // Filter out empty strings
                .concat(projectIdsOfProjectEmployees.split(',').filter(Boolean))
              )
           ]
           .sort((a, b) => a - b)
           .join(',');
          

               // If uniqueProjectIds is not empty, filter schedules by projectId
               if (uniqueProjectIds) {
               const projectIdsArray = uniqueProjectIds.split(',').map(Number);
               const projectMatchedSchedules = checkListByObsBasedOnIqaIdSelData.filter(checkList =>
                  projectIdsArray.includes(Number(checkList.projectId))
                 );
                 checkListByObsRoleWise = [...checkListByObsRoleWise, ...projectMatchedSchedules];
               }
            }else{
              checkListByObsRoleWise = checkListByObsBasedOnIqaIdSelData;
            }



            if (!checkListByObsRoleWise.length) {

              setTotalObsBasedOnIqaSel({
                totalCountNC: 0,
                totalCountOBS: 0,
                totalCountOFI: 0
              });

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
      
            const totals = checkListByObsRoleWise.reduce(
              (acc, entry) => {
                acc.totalCountNC += entry.countOfNC || 0;
                acc.totalCountOBS += entry.countOfOBS || 0;
                acc.totalCountOFI += entry.countOfOFI || 0;
                return acc;
              },
              { totalCountNC: 0, totalCountOBS: 0, totalCountOFI: 0 }
            );
        
            setTotalObsBasedOnIqaSel(totals);

                 // Filter data based on the selected type
                 if (selectedTypeData === 'div') {
                  checkListByObsRoleWise = checkListByObsRoleWise.filter(
                    item => item.divisionId > 0
                  );
                } else if (selectedTypeData === 'grp') {
                  checkListByObsRoleWise = checkListByObsRoleWise.filter(
                    item => item.groupId > 0
                  );
                } else if (selectedTypeData === 'prj') {
                  checkListByObsRoleWise = checkListByObsRoleWise.filter(
                    item => item.projectId > 0
                  );
                }
              // Function to get the relevant data based on the selected type
              const getData = () => {
                if (selectedTypeData === 'div') {
                  return checkListByObsRoleWise.map(entry => ({
                    quarter: entry.divisionName,
                    NC: entry.countOfNC,
                    OBS: entry.countOfOBS,
                    OFI: entry.countOfOFI,
                  }));
                } else if (selectedTypeData === 'grp') {
                  return checkListByObsRoleWise.map(entry => ({
                    quarter: entry.groupName,
                    NC: entry.countOfNC,
                    OBS: entry.countOfOBS,
                    OFI: entry.countOfOFI,
                  }));
                } else if (selectedTypeData === 'prj') {
                  return checkListByObsRoleWise.map(entry => ({
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
                height: 310, // Adjust the height
                pixelRatio: window.devicePixelRatio || 1,
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

   await scheduleListBasedOnLoggerRole(selectedIqaId,selectedIqa.iqaNo);
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

       // previous fetch data involved below methods
          //const AuditTeamDtoList = await getAuditeeTeamDtoList();
            // if (AuditTeamDtoList && AuditTeamDtoList.length > 0) {
            //   setAuditTeamFullList(AuditTeamDtoList);
            //   const filteredTeams = AuditTeamDtoList.filter(data => data.iqaId === iqa.iqaId);
            //   setTeamsCountBasedOnIqaSel(filteredTeams.length);
            // } else {
            //   setTeamsCountBasedOnIqaSel(0);
            // }
            // activeAuditeesCount 
             //const activeAuditeesCount = await getActiveAuditeeCount();
            //setActiveAuditeesCount(activeAuditeesCount);
            //activeTeams
            //const activeTeamsCount = await getActiveTeams();
            // setActiveTeamsCount(activeTeamsCount);
            //activeSchedules
            //const activeSchedules = await getActiveSchedules();
            // setActiveSchedulesCount(activeSchedules);

           

    const fetchData = async () => {
      try {
        const qmDetails = await getQmDashboardDetailedList();
           setQMRecordList(qmDetails);
        const qspRevisionRecordDetails = await qspDocumentList();
           setQSPRecordList(qspRevisionRecordDetails);
        const activeAuditorsCount = await getActiveAuditorsCount();
           setActiveAuditorsCount(activeAuditorsCount);
       
      //division active master list
      const divisionsActiveMasterList = await getAllActiveDivisionList();
      setDivisionMasterList(divisionsActiveMasterList);

      const prjListOfProjectDirector = await getProjectListOfPrjDir(currentLoggerRoleId, currentLoggerEmpId);
      //project director get all his projects
      setProjectListOfPrjDir(prjListOfProjectDirector);
      
      //division head  get all his divisions
      const divisionsListOfDivisionHead = await getDivisionListOfDH(currentLoggerRoleId, currentLoggerEmpId);
      setDivisionListOfDH(divisionsListOfDivisionHead);

      //group head get all his divisions
      const divisionsListOfGroupHead = await getDivisionListOfGH(currentLoggerRoleId, currentLoggerEmpId);
      setDivisionListOfGH(divisionsListOfGroupHead);
       
       
      //division Employees
        const divisionListByRoleId = await getDivisionListOfDivEmps(currentLoggerRoleId, currentLoggerEmpId);
           setDivisionListByRoleId(divisionListByRoleId);
           
       //group Employees   
        const groupListByRoleId = await getDivGroupListOfDivEmps(currentLoggerRoleId, currentLoggerEmpId);
           setGroupListByRoleId(groupListByRoleId);
       
       //project Employees      
       const projectListByRoleId = await getProjectListOfPrjEmps(currentLoggerRoleId, currentLoggerEmpId);
           setProjectListByRoleId(projectListByRoleId);
   
        // Iqa dropdown and default iqa selection 
          let IqaList = await getIqaDtoListForDahboard();

          const currentDate = new Date().toISOString().split('T')[0]; // Get the current date in 'YYYY-MM-DD' format
        
          if (IqaList) {
            IqaList = IqaList.filter(iqa => {
              const fromDate = new Date(iqa.fromDate).toISOString().split('T')[0];
              const toDate = new Date(iqa.toDate).toISOString().split('T')[0]; 
          
      
              return fromDate <= currentDate && toDate <= currentDate;
            });
          }
          // console.log('Filtered IqaList:', IqaList);



          setIqaFullList(IqaList);
          const iqaData = IqaList.map(data => ({
                          value : data.iqaId,
                          label : data.iqaNo
                      }));
          if(IqaList.length >0){
            const iqa = IqaList[0];
            setIqaNo(iqa.iqaNo)
            setIqaId(iqa.iqaId)
       
          const IqaAuditeeDtoList = await getIqaAuditeeList(iqa.iqaId);

          if (IqaAuditeeDtoList && IqaAuditeeDtoList.length > 0) {
              setIqaAuditeeFullList(IqaAuditeeDtoList);
              setAuditeeCountBasedOnIqaSel(IqaAuditeeDtoList.length);
           } else {
              setAuditeeCountBasedOnIqaSel(0);
           }

            //groupDivisionId comparison is removed everyone can see every doc of dwp amd gwp
            const dwpVersionRecordList = await getAllVersionRecordDtoList({
              docType: 'dwp',
              groupDivisionId: '0',
              // groupDivisionId: (currentLoggerRoleName && (currentLoggerRoleName.trim() === 'Admin' || currentLoggerRoleName.trim() === 'Director'  || currentLoggerRoleName.trim() === 'MR' )) 
              //   ? '0' 
              //   : currentLoggerDivId,
            });

            let filteredDwpVersionRecordList = []; 

            if (dwpVersionRecordList) {
             filteredDwpVersionRecordList = Object.values(
               dwpVersionRecordList.reduce((acc, record) => {
                        const { groupDivisionId, revisionNo } = record;
                        if (
                            !acc[groupDivisionId] || 
                            acc[groupDivisionId].revisionNo < revisionNo
                        ) {
                            acc[groupDivisionId] = record;
                        }
                        return acc;
                    }, {})
                );
            }
            
             setDWPRecordList(filteredDwpVersionRecordList);
            
            const gwpVersionRecordList = await getAllVersionRecordDtoList({
            docType: 'gwp',
            groupDivisionId: '0',
            // groupDivisionId: (currentLoggerRoleName && (currentLoggerRoleName.trim() === 'Admin' || currentLoggerRoleName.trim() === 'Director'  || currentLoggerRoleName.trim() === 'MR' )) 
            // ? '0' 
            // : currentLoggerGroupId,
           });

           let filteredGwpVersionRecordList = []; 

           if (gwpVersionRecordList) {
               filteredGwpVersionRecordList = Object.values(
                   gwpVersionRecordList.reduce((acc, record) => {
                       const { groupDivisionId, revisionNo } = record;
                       if (
                           !acc[groupDivisionId] || 
                           acc[groupDivisionId].revisionNo < revisionNo
                       ) {
                           acc[groupDivisionId] = record;
                       }
                       return acc;
                   }, {})
               );
           }
           
      
           setGWPRecordList(filteredGwpVersionRecordList);


         
     
            
           // Once all required data is fetched and set then call scheduleListBasedOnLoggerRole and updateGraphsData in below user Graph
            setIsReady(true);

          }
          setIqaOptions(iqaData)
           
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
    
      useEffect(() => {
        fetchData();
      }, []);


      useEffect(() => {
        if (isReady) {
          // Only call these functions once all required data is ready
          (async () => {
            try {
              await scheduleListBasedOnLoggerRole(iqaIdSelected, iqaNoSelected);
              await updateGraphsData(iqaIdSelected, iqaNoSelected, 'div', 0);
            } catch (error) {
              console.error("Error in post-ready operations:", error);
            }
          })();
        }
      }, [isReady]);

  // Now, print the qmDetailedData object properly in the console


  

  
  const handleQMClick = (item) => {
    setSelectedItem(item); // Set the item to trigger rendering of QmDocPrintDashboard
  };



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

// const columnsQM = [
//   { name: 'SN', selector: (row) => row.sn, sortable: true, grow: 1, align: 'text-center' },
//   { name: 'Description', selector: (row) => row.description, sortable: true, grow: 2, align: 'text-start' },
//   { name: 'Issue From', selector: (row) => row.from, sortable: true, grow: 2, align: 'text-center' },
//   { name: 'Issue To', selector: (row) => row.to, sortable: true, grow: 2, align: 'text-center' },
//   { name: 'DOR', selector: (row) => row.issueDate, sortable: true, grow: 2, align: 'text-center' },
//   { name: 'Status', selector: (row) => row.status, sortable: false, grow: 2, align: 'text-center' },
//   { name: 'Action', selector: (row) => row.action, sortable: false, grow: 2, align: 'text-center' },
// ];



// const mappedDataQM = qmRecordList.map((item, index) => ({
//   sn: index + 1,
//   description: item.description || '-' || '-',
//   from: index + 1 < qmRecordList.length ? 'I' + qmRecordList[index + 1].issueNo + '-R' + qmRecordList[index + 1].revisionNo : '--',
//   to: 'I' + item.issueNo + '-R' + item.revisionNo || '-',
//   issueDate: format(new Date(item.dateOfRevision), 'dd-MM-yyyy') || '-',
//   status: item.statusCode || '--',
//   action: (
//     <div>
//       {!["APR", "APR-GDDQA", "APR-DGAQA"].includes(item.statusCode) && (
//         <>
//           {getQMDocPDF(item)}
//         </>
//       )}
//     </div>
//   ),
// }));

const columnsQSP = [
   { name: 'SN', selector: (row) => row.sn, sortable: true, grow: 1, align: 'text-center', width: '5%'  },
   { name: 'QSP', selector: (row) => row.qsp, sortable: true, grow: 1, align: 'text-center', width: '10%'  },
   { name: 'QSP Name', selector: (row) => row.qspName, sortable: true, grow: 1, align: 'text-left', width: '30%'  },
  //  { name: 'Description', selector: (row) => row.description, sortable: true, grow: 2, align: 'text-start', width: '25%'  },
  //  { name: 'Issue From', selector: (row) => row.from, sortable: true, grow: 2, align: 'text-center', width: '10%'  },
  //  { name: 'Issue To', selector: (row) => row.to, sortable: true, grow: 2, align: 'text-center', width: '5%'  },
  //  { name: 'Date Of Revision', selector: (row) => row.issueDate, sortable: true, grow: 2, align: 'text-center', width: '10%'  },
  //  { name: 'Status', selector: (row) => row.status, sortable: false, grow: 2, align: 'text-center', width: '15%'  },
   { name: 'Action', selector: (row) => row.action, sortable: false, grow: 2, align: 'text-center', width: '20%'  },
];


const getDocPDFQSP = (action, revisionElements) => {
  return <QspDocPrint action={action} revisionElements={revisionElements} />;
}


const documentNameMapping = {
  qsp1: 'QSP1 - Control of Documents and Records',
  qsp2: 'QSP2 - Internal Quality Audit',
  qsp3: 'QSP3 - Management Review',
  qsp4: 'QSP4 - Non conformity & Corrective Action',
  qsp5: 'QSP5 - Quality Objectives and Continual Improvement',
  qsp6: 'QSP6 - Analysis of Data & Preventive Action',
  qsp7: 'QSP7 - Customer Feedback Analysis',
  qsp8: 'QSP8 - Risk Management',
};


const groupedByDocName = {};

qspRecordList.forEach((item) => {
  if (!groupedByDocName[item.docName] || groupedByDocName[item.docName].revisionNo < item.revisionNo) {
    groupedByDocName[item.docName] = item;
  }
});

const maxRevisionRecords = Object.values(groupedByDocName);


// Sort by `revisionRecordId` from old to new 
// const sortedMaxRevisionRecords = [...maxRevisionRecords].sort((a, b) => a.revisionRecordId - b.revisionRecordId);

// Sort based on numeric value extracted from the 4th character of docName
const sortedMaxRevisionRecords = [...maxRevisionRecords].sort((a, b) => {
  const numA = parseInt(a.docName.slice(3)); // Remove the first 3 characters and convert to number
  const numB = parseInt(b.docName.slice(3)); // Remove the first 3 characters and convert to number
  return numA - numB; // Ascending order
});


const mapQspData = sortedMaxRevisionRecords.map((item, index) => {
  const [qspCode, qspFullName] = documentNameMapping[item.docName]?.split(' - ') || ['-', '-'];
  return {
    sn: index + 1,
    qsp: qspCode || '-', 
    qspName: qspFullName || '-', 
    // description: item.description || '-',
    // from: index + 1 < sortedMaxRevisionRecords.length
    //   ? 'I' + sortedMaxRevisionRecords[index + 1].issueNo + '-R' + sortedMaxRevisionRecords[index + 1].revisionNo
    //   : '--',
    // to: 'I' + item.issueNo + '-R' + item.revisionNo || '-',
    // issueDate: format(new Date(item.dateOfRevision), 'dd-MM-yyyy') || '-',
    // status: item.statusCode || '--',
    action: (
      <div>
        {getDocPDFQSP('', item)}
      </div>
    ),
  };
});



const getDocPDF = (action, revisionElements) => {
  return <DwpDocPrint action={action} revisionElements={revisionElements} />
}

const columnsDWP = [
  { name: 'SN', selector: (row) => row.sn, sortable: true, grow: 1, align: 'text-center' },
  { name: 'Division Code', selector: (row) => row.divCode, sortable: true, grow: 1, align: 'text-center' },
  { name: 'Division Name', selector: (row) => row.divName, sortable: true, grow: 1, align: 'text-left' },
  // { name: 'Description', selector: (row) => row.description, sortable: true, grow: 2, align: 'text-start' },
  // { name: 'Issue From', selector: (row) => row.from, sortable: true, grow: 2, align: 'text-center' },
  // { name: 'Issue To', selector: (row) => row.to, sortable: true, grow: 2, align: 'text-center' },
  // { name: 'DOR', selector: (row) => row.issueDate, sortable: true, grow: 2, align: 'text-center' },
  // { name: 'Status', selector: (row) => row.status, sortable: false, grow: 2, align: 'text-center' },
  { name: 'Action', selector: (row) => row.action, sortable: false, grow: 2, align: 'text-center' },
];



const mappedDataDWP = dwpRecordList.map((item, index) => ({
  sn: index + 1,
  divCode: item.divisionMasterDto ? item.divisionMasterDto.divisionCode : '-',
  divName: item.divisionMasterDto ? item.divisionMasterDto.divisionName : '-',
  // description: item.description || '-' || '-',
  // from: index + 1 < dwpRecordList.length ? 'I' + dwpRecordList[index + 1].issueNo + '-R' + dwpRecordList[index + 1].revisionNo : '--',
  // to: 'I' + item.issueNo + '-R' + item.revisionNo || '-',
  // issueDate: format(new Date(item.dateOfRevision), 'dd-MM-yyyy') || '-',
  // status: item.statusCode || '--',
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
  { name: 'Group Code', selector: (row) => row.grpCode, sortable: true, grow: 1, align: 'text-center' },
  { name: 'Group Name', selector: (row) => row.grpName, sortable: true, grow: 1, align: 'text-center' },
  
  // { name: 'Description', selector: (row) => row.description, sortable: true, grow: 2, align: 'text-start' },
  // { name: 'Issue From', selector: (row) => row.from, sortable: true, grow: 2, align: 'text-center' },
  // { name: 'Issue To', selector: (row) => row.to, sortable: true, grow: 2, align: 'text-center' },
  // { name: 'DOR', selector: (row) => row.issueDate, sortable: true, grow: 2, align: 'text-center' },
  // { name: 'Status', selector: (row) => row.status, sortable: false, grow: 2, align: 'text-center' },
  { name: 'Action', selector: (row) => row.action, sortable: false, grow: 2, align: 'text-center' },
];


const mappedDataGWP = gwpRecordList.map((item, index) => ({
  sn: index + 1,
  grpCode:item.divisionGroupDto ? item.divisionGroupDto.groupCode : '-',
  grpName:item.divisionGroupDto ? item.divisionGroupDto.groupName : '-',
  // description: item.description || '-' || '-',
  // from: index + 1 < gwpRecordList.length ? 'I' + gwpRecordList[index + 1].issueNo + '-R' + gwpRecordList[index + 1].revisionNo : '--',
  // to: 'I' + item.issueNo + '-R' + item.revisionNo || '-',
  // issueDate: format(new Date(item.dateOfRevision), 'dd-MM-yyyy') || '-',
  // status: item.statusCode || '--',
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
          // style={{ display: isHidden ? 'block' : 'none' }}
          >

{/************************************ HEADER START ***************************************/}
<div className="page-header row mb-4">
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


  <div className="col-xl-12 col-lg-12 stretch-card grid-margin  ">
              
              <div className="card audit-graphs-card">
                 <div className="row">

          <div className="col-md-2  docs-panel">
          
          <div className="row docs-row" >


          <div className="docs-div qm">
  {qmRecordList.map((item, index) => (
    <div 
      key={index} 
      className="docs-content" 
      onClick={() => handleQMClick(item)}

    >
        {selectedItem && (
        <QmDocPrintDashboard
          revisionElements={selectedItem}
          openInNewTab={true} // You can pass this prop to control new tab opening
        />
      )}
      <span className="docs-label">QM</span>
    </div>
  ))}
</div>
 

   



            {/* <div className="docs-div qm " onClick={() => openQMPopUpModal()}> 
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

                  <div className="modal-body model-max-height dasdboard-doc-model">

                  <div id="card-body customized-card">
                    <Datatable columns={columnsQM} data={mappedDataQM} />
                  </div>
                  
                  </div>
                </div>
              </div>
            </div>

          )}   */}
      
        
            <div className="docs-div qsp " onClick={() => openQSPPopUpModal()}>
                <div className="docs-content">
                    <span className="docs-label">QSP</span> 
                </div>
            </div>
            {showQSPModal && (
            <div className={`modal fade show modal-visible`} style={{ display: 'block' }} aria-modal="true" role="dialog">
              <div className="modal-dialog modal-lg modal-xl-custom docDashboardModal" >
                <div className="modal-content" >
                  <div className="modal-header bg-secondary d-flex justify-content-between bg-primary text-white">
                    <h5 className="modal-title">QSP</h5>
                    <button type="button" className="btn btn-danger" onClick={handleQSPClose} aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>

                  <div className="modal-body model-max-height dasdboard-doc-model">
                 
                  <div id="card-body customized-card">
                    <Datatable columns={columnsQSP} data={mapQspData} />
                  </div>

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
            <div className={`modal fade show modal-visible`} style={{ display: 'block'}} aria-modal="true" role="dialog">
              <div className="modal-dialog modal-lg modal-xl-custom docDashboardModal"  >
                <div className="modal-content" >
                  <div className="modal-header bg-secondary d-flex justify-content-between bg-primary text-white">
                    <h5 className="modal-title">DWP </h5>
                    <button type="button" className="btn btn-danger" onClick={handleDWPClose} aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>

                  <div className="modal-body model-max-height dasdboard-doc-model">
                 
                
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
              <div className="modal-dialog modal-lg modal-xl-custom docDashboardModal">
                <div className="modal-content" >
                  <div className="modal-header bg-secondary d-flex justify-content-between bg-primary text-white">
                    <h5 className="modal-title">GWP</h5>
                    <button type="button" className="btn btn-danger" onClick={handleGWPClose} aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>

                  <div className="modal-body model-max-height dasdboard-doc-model">

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

  <div className="col-md-2 imsCounter">
    {currentLoggerRoleName &&
    ['Divisional MR', 'Auditee', 'Auditor'].includes(currentLoggerRoleName.trim()) ? (
      <div className="counter auditor no-link">
        <h3>Active Auditors</h3>
        <span className="counter-value">{activeAuditorsCount}</span>
      </div>
    ) : (
      <a className="dashboard-links" href="/auditor-list">
        <div className="counter auditor">
          <h3>Active Auditors</h3>
          <span className="counter-value">{activeAuditorsCount}</span>
        </div>
      </a>
    )}
  </div>



  <div className="col-md-2 imsCounter">
  {currentLoggerRoleName &&
  ['Divisional MR', 'Auditee', 'Auditor'].includes(currentLoggerRoleName.trim()) ? (
    <div className="counter auditee no-link">
      <h3>{iqaNoSelected} Auditees</h3>
      <span className="counter-value">{auditeeCountBasedOnIqaSel}</span>
    </div>
  ) : (
    <a
      className="dashboard-links"
      href={`/iqa-auditee-list?iqaIdSel=${iqaIdSelected}`}
    >
      <div className="counter auditee">
        <h3>{iqaNoSelected} Auditees</h3>
        <span className="counter-value">{auditeeCountBasedOnIqaSel}</span>
      </div>
    </a>
  )}
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
      <a className="dashboard-links"  href={`/audit-summary-report?iqaIdSel=${iqaIdSelected}&obsTypeSel=N`}> 
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
      <a className="dashboard-links"  href={`/audit-summary-report?iqaIdSel=${iqaIdSelected}&obsTypeSel=B`}>
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
      <a className="dashboard-links"  href={`/audit-summary-report?iqaIdSel=${iqaIdSelected}&obsTypeSel=O`}>
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
