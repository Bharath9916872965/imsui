import React, { useEffect, useState } from "react";
import { Box  } from "@mui/material";
import Navbar from "../Navbar/Navbar";
import Datatable from "../datatable/Datatable";
import SelectPicker from "../selectpicker/selectPicker";
import withRouter from "common/with-router";
import { getCheckListByObservation } from "services/dashboard.service";
import { getIqaDtoList,getMostFqNCDesc } from "services/audit.service";

const NcReport = ({ router }) => {


  // State management
  const [modalVisible, setModalVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [checkListBasedOnObs, setCheckListBasedOnObs] = useState([]);
  const [filScheduleList, setFilScheduleList] = useState([]);
  const [iqaFullList, setIqaFullList] = useState([]);
  const [iqaOptions, setIqaOptions] = useState([]);
  const [iqaNo, setIqaNo] = useState("");
  const [iqaId, setIqaId] = useState("");
  const [ModalData, setModalData] = useState("");
  const [divName,setDivName]=useState("");
  const [Auditnam,setAuditName]=useState("");

 

  // Columns for the data table
  const columns = [
    { name: "SN", selector: (row) => row.sn, sortable: true, width: "3%" },
    { name: 'Division/ Group/ Project', selector: (row) => row.divisionName, sortable: true, grow: 2, align: 'text-left', width: '30%'  },
    { name: "Auditee", selector: (row) => row.auditee, sortable: true, align: 'text-left',width: "30%" },
    { name: "NC", selector: (row) => row.ncCount, sortable: true, width: "10%" },
    { name: "OBS", selector: (row) => row.obsCount, sortable: true, width: "10%" },
    { name: "OFI", selector: (row) => row.ofiCount, sortable: true, width: "10%" },
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
   
    return list.map((item, index) => {
      // Construct divisionName dynamically with fallback values
      const divisionName = [
        item.divisionName,
        item.groupName,
        item.projectName,
      ]
        .filter((name) => name && name !== "")
        .join(" ");
  
      // Helper function for creating styled buttons
      const createButton = (label, colorGradient, onClick) => (
        <button
          style={{
            background: `linear-gradient(45deg, ${colorGradient})`,
            border: "none",
            color: "white",
            padding: "8px 12px",
            borderRadius: "4px",
            cursor: "pointer",
          }}
          onClick={onClick}
        >
          {label}
        </button>
      );
  
      return {
        sn: index + 1,
        divisionName: divisionName || "-",
        ncCount:
          item.countOfNC && item.countOfNC !== "0" ? (
            createButton(
              item.countOfNC,
              "#e95081, #974686",
              () => toggleModal(item.scheduleId, item.iqaId, 2, divisionName,item.auditeeEmpName)
            )
          ) : (
            "-"
          ),
        obsCount:
          item.countOfOBS > 0 ? (
            createButton(
              item.countOfOBS,
              "rgb(184, 142, 252), rgb(104, 119, 244)",
              () => toggleModal(item.scheduleId, item.iqaId, 3,divisionName,item.auditeeEmpName)
            )
          ) : (
            "-"
          ),
        ofiCount:
          item.countOfOFI > 0 ? (
            createButton(
              item.countOfOFI,
              "rgb(255, 148, 85), rgb(248, 94, 4)",
              () => toggleModal(item.scheduleId, item.iqaId, 4,divisionName,item.auditeeEmpName)
            )
          ) : (
            "-"
          ),
        auditee: item.auditeeEmpName || "-",
      };
    });
  };
  
   useEffect(() => {
        if (!showModal) {
            setModalVisible(false);
        }
    }, [showModal]);

  const toggleModal = async (scheduleId, iqa, id,divisionName,auditName) => {
    try {

      setDivName(divisionName);
      setAuditName(auditName);
        const geNctdes = await getMostFqNCDesc(id, scheduleId, iqa);
             if (geNctdes && geNctdes.length > 0) {
            // Map through all the items and prepare the data
            const modalData = geNctdes.map((item, index) => ({
                clauseNo: item.clauseNo || "-",
               carRefNo:item.carRefNo || "-",
                description: item.description || "-",
                           }));
            setModalData(modalData);
     
            setShowModal(!showModal);
            if (!showModal) {
                setModalVisible(true)
            } else {
                setModalVisible(false);
            }
        } else {
            console.error('No data found in response:', geNctdes);
        }
    } catch (error) {
        console.error('Error fetching NC description:', error);
    }
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
        {showModal && (
         <>
    <div
      className={`modal-backdrop fade ${modalVisible ? 'show' : ''}`}
      onClick={() => toggleModal()} // Close modal when clicking backdrop
      style={{ zIndex: 1040 }} // Ensure backdrop is behind modal
    ></div>

    {/* Modal Content */}
    <div
      className={`modal fade show modal-show-custom ${modalVisible ? 'modal-visible' : ''}`}
      style={{ display: 'block' }} // Ensure modal is visible
      aria-modal="true"
      role="dialog"
    >
      <div className="modal-dialog modal-lg modal-xl-custom">
        <div className="modal-content modal-content-custom"> 
          {/* Modal Header */}
          <div className="modal-header d-flex justify-content-between bg-secondary text-white modal-header-custom">
          <h5 className="modal-title text-center">
  {iqaNo} <span style={{ margin: "0 10px" }}> - </span> 
  {divName} <span style={{ margin: "0 10px" }}> - </span> 
  {Auditnam}
</h5>

            <button
              type="button"
              className="btn btn-danger modal-header-danger-custom"
              onClick={() => setShowModal(false)} // Close modal when clicking close button
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
{/* Modal Body */}
     {/* Modal Body */}
     <div className="modal-body">
      
  {ModalData.length > 0 ? (
    <table style={{width: "100%", borderCollapse: "collapse", marginTop: "10px",}}>
      <thead>
        <tr>
       
          <th
            style={{
              border: "1px solid #ddd",
              padding: "8px",
              backgroundColor: "#f2f2f2",
              fontWeight: "bold",
              textAlign: "left",
            }}
          >
            Clause No
          </th>
          <th
            style={{
              border: "1px solid #ddd",
              padding: "8px",
              backgroundColor: "#f2f2f2",
              fontWeight: "bold",
              textAlign: "left",
            }}
          >
           NC No
          </th>
          <th
            style={{
              border: "1px solid #ddd",
              padding: "8px",
              backgroundColor: "#f2f2f2",
              fontWeight: "bold",
              textAlign: "left",
            }}
          >
            Description
          </th>
        </tr>
      </thead>
      <tbody>
        
        {ModalData.map((item, index) => (
          <tr
            key={index}
            style={{backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff",border: "1px solid #ddd",
            }}
          >
            <td  style={{border: "1px solid #ddd",padding: "8px",textAlign: "left",}}>
              {item.clauseNo}
            </td>
              <td   style={{ border: "1px solid #ddd",  padding: "8px",  textAlign: "left",}}
            >
              {item.carRefNo}
            </td>
            <td
              style={{     border: "1px solid #ddd", padding: "8px", textAlign: "left",
              }}
            >
              {item.description}
            </td>
          
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <p>No data available.</p>
  )}
</div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary"  onClick={() => setShowModal(false)}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </>
)}

      </div>
    </div>
  );
};

export default withRouter(NcReport);
