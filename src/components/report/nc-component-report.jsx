import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { Box } from "@mui/material";
import Navbar from "../Navbar/Navbar";
import Datatable from "../datatable/Datatable";
import SelectPicker from "../selectpicker/selectPicker";

import withRouter from "common/with-router";
import { getCheckListByObservation } from "services/dashboard.service";
import { getIqaDtoList } from "services/audit.service";

const NcReport = ({ router }) => {


  // State management

  const [checkListBasedOnObs, setCheckListBasedOnObs] = useState([]);
  const [filScheduleList, setFilScheduleList] = useState([]);
  const [iqaFullList, setIqaFullList] = useState([]);
  const [iqaOptions, setIqaOptions] = useState([]);
  const [iqaNo, setIqaNo] = useState("");
  const [iqaId, setIqaId] = useState("");



  // Columns for the data table
  const columns = [
    { name: "SN", selector: (row) => row.sn, sortable: true, width: "3%" },
    { name: 'Division/ Group/ Project', selector: (row) => row.divisionName, sortable: true, grow: 2, align: 'text-left', width: '11%'  },
    { name: "Auditee", selector: (row) => row.auditee, sortable: true, align: 'text-left',width: "17%" },
    { name: "NC", selector: (row) => row.ncCount, sortable: true, width: "7%" },
    { name: "OBS", selector: (row) => row.obsCount, sortable: true, width: "15%" },
    { name: "OFI", selector: (row) => row.ofiCount, sortable: true, width: "5%" },
    // { name: "Action", selector: (row) => row.action, sortable: false, width: "8%" },
  ];

  // Fetching data
  const fetchData = async () => {
    try {
      const [iqaList, checkListDetailsBasedOnObservation] = await Promise.all([
        getIqaDtoList(),
        getCheckListByObservation(),
      ]);

      if (iqaList.length > 0) {
        const iqaNum = router.location.state?.iqaNo;
        const selectedIqa =
          iqaNum && iqaList.find((item) => item.iqaNo === iqaNum) || iqaList[0];

        setIqaFullList(iqaList);
        setIqaNo(selectedIqa.iqaNo);
        setIqaId(selectedIqa.iqaId);
      

        const filteredList = checkListDetailsBasedOnObservation.filter(
          (data) => data.iqaId === selectedIqa.iqaId
        );

        setCheckListBasedOnObs(checkListDetailsBasedOnObservation);
        setFilScheduleList(mapDataForTable(filteredList));
      }

      const iqaOptionsData = iqaList.map((data) => ({
        value: data.iqaId,
        label: data.iqaNo,
      }));
      setIqaOptions(iqaOptionsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Map data for the data table
  const mapDataForTable = (list) => {
    return list.map((item, index) => ({
      sn: index + 1,
      divisionName: 
      (item.divisionName === '' ? '' : item.divisionName) +
      (item.groupName === '' ? '' : ' ' + item.groupName) +
      (item.projectName === '' ? '' : ' ' + item.projectName),
    

      ncCount: item.countOfNC || "-",
      obsCount: item.countOfOBS || "-",
      ofiCount: item.countOfOFI || "-",
      auditee: item.auditeeEmpName || "-",
      
    }));
  };

  // Handle IQA dropdown change
  const onIqaChange = (value) => {
    const selectedIqa = iqaFullList.find((data) => data.iqaId === value);
    if (selectedIqa) {
      setIqaNo(selectedIqa.iqaNo);
      setIqaId(value);
      const filteredList = checkListBasedOnObs.filter(
        (data) => data.iqaId === value
      );
      setFilScheduleList(mapDataForTable(filteredList));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="card">
        <div className="card-body">
          <Box display="flex" alignItems="center" gap="10px" className="mg-down-10">
            <Box flex="80%" textAlign="center">
              <h3>{iqaNo} : NC List</h3>
            </Box>
            <Box flex="20%">
              <SelectPicker
                options={iqaOptions}
                label="IQA No"
                value={
                  iqaOptions &&
                  iqaOptions.find((option) => option.value === iqaId) || null
                }
                handleChange={(newValue) => onIqaChange(newValue?.value)}
              />
            </Box>
          </Box>
          <div id="card-body customized-card">
            <Datatable columns={columns} data={filScheduleList} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(NcReport);
