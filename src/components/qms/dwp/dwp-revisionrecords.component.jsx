import { useCallback, useEffect, useState } from "react";
import { amendDwpGwp, dwprevokeSubmit, forwardDwpGwp, getDivisionEmployee, getDwpDivisionGroupList, getDwpDivisionList, getDwpVersionRecordDtoList, getLabDetails, getMRList, getQmVersionRecordDtoList, getSelectedEmpData, UpdateDwpGwpDescription } from "services/qms.service";
import Datatable from "../../datatable/Datatable";
import withRouter from '../../../common/with-router';
import Navbar from "../../Navbar/Navbar";
import "./dwp-revisionrecords.component.css"
import { format } from "date-fns";
import DwpDocPrint from "components/prints/qms/dwp-doc-print";
import AddDocumentSummaryDialog from "./dwp-add-document-summary-dialog";
import { Autocomplete, Box, ListItemText, TextField } from "@mui/material";
import { CustomMenuItem } from "services/auth.header";
import { getLoginEmployeeDetails } from "services/header.service";
import DwpDocsAddIssueDialog from "./dwp-add-issue-dialog";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { getUserManagerList } from "services/admin.serive";
import * as Yup from 'yup';
import AlertConfirmation from "common/AlertConfirmation.component";
import { getDivisionList, getEmployee } from "services/audit.service";


const DwpRevisionRecordsComponent = ({ router, docName }) => {

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [versionRecordList, setVersionRecordList] = useState([]);
  const [versionRecordPrintList, setVersionRecordPrintList] = useState([]);
  const [divisionList, setDivisionList] = useState([]);
  const [divisionGroupList, setDivisionGroupList] = useState([]);
  const [openDialog2, setOpenDialog2] = useState(false);
  const [singleDoc, setSingleDoc] = useState(null);
  const [qmsDocTypeDto, setQmsDocTypeDto] = useState(null);
  const [groupDivisionId, setGroupDivisionId] = useState(null);
  const [revisionListRefresh, setRevisionListRefresh] = useState(null);
  const [userManagerList, setUserManagerList] = useState([]);

  const [empId, setLoginEmpId] = useState([]);
  const [revisionRecordId, setRevisionRecordId] = useState([]);
  const [selRoleName, setSelRoleName] = useState([]);
  const [statusCode, setStatusCode] = useState([]);
  const [ammendshowModal, setAmmendShowModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDescriptionModal, setshowDescriptionModal] = useState(false);
  const [filteredMrList, setFilteredMrList] = useState([]);
  const [filteredDivisionalMrList, setFilteredDivisionalMrList] = useState([]);
  const [dwpGwpList, setDwpGwpList] = useState([]);

  const [openAddIssueDialog, setOpenAddIssueDialog] = useState(false);
  const [newAmendVersion, setNewAmendVersion] = useState("");
  const [initialValues, setInitialValues] = useState({
    initiatedBy: "",
    approvedBy: "",
    remarks: "",
  });;

  const [ammendInitialValues, setAmmendInitialValues] = useState({
    isNewIssue: false,
    currentVersion: "",
    description: "",
  });

  const validationSchema = Yup.object().shape({
    initiatedBy: Yup.string()
      .required("Initiated By required"),
    approvedBy: Yup.string()
      .required("Approved By required"),
  });

  const [descriptioninitialValues, setDescriptioninitialValues] = useState({
    description: "",
  });;

  const validationSchemaUpdate = Yup.object().shape({
    description: Yup.string()
      .required("Description is Required")
      .max(255, "Description must not exceed 255 characters"),
  })
  const ammendValidationSchema = () =>
    Yup.object().shape({
      description: Yup.string()
        .required("Description is Required")
        .max(255, "Description must not exceed 255 characters"),
    });


  const { navigate, location } = router;

  useEffect(() => {
    const fetchGroupData = async () => {
      const { empName, designation, empId, imsFormRoleId, formRoleName } = await getLoginEmployeeDetails();
      setDwpDivisionList(imsFormRoleId, empId);
      setDwpDivisionGroupList(imsFormRoleId, empId);
    }
    fetchGroupData();
  }, [])

  useEffect(() => {
    fetchData();
  }, [groupDivisionId, revisionListRefresh]);

  const fetchData = async () => {
    try {
      const role = localStorage.getItem('roleId')
      const roleName = localStorage.getItem('roleName')
      const selempId = localStorage.getItem('empId')
      const empIdAsNumber = Number(selempId);
      setLoginEmpId(empIdAsNumber);

      var divId = 0;

      if (groupDivisionId) {
        divId = groupDivisionId;
      }

      const qmsDocTypeDto = {
        docType: docName,
        groupDivisionId: divId
      }

      setQmsDocTypeDto(qmsDocTypeDto);

      // setQmsDocTypeDto(prevState => ({...prevState, groupDivisionId: dwpDivisionList[0]?.divisionId || 0 }));
      const versionRecorList = await getDwpVersionRecordDtoList(qmsDocTypeDto);

      if (versionRecorList && versionRecorList.length > 0) {
        // Assuming the list is sorted by latest first
        const latestRecord = versionRecorList[0];

        // Setting the values dynamically
        setAmmendInitialValues((prevValues) => ({
          ...prevValues,
          currentVersion: `I${latestRecord.issueNo}-R${latestRecord.revisionNo}`,
        }));

        setNewAmendVersion(
          `I${latestRecord.issueNo}-R${parseInt(latestRecord.revisionNo) + 1}`
        );
      } else {
        // Default values if the list is empty
        setAmmendInitialValues((prevValues) => ({
          ...prevValues,
          currentVersion: "I1-R0",
          description: "Original ISSUE and Revision",
        }));

        setNewAmendVersion("I1-R0");
      }
      const userManagerList = await getUserManagerList();
      setUserManagerList(userManagerList);
      const mappedData = versionRecorList.map((item, index) => {
        let statusColor = `${item.statusCode === 'INI' ? 'initiated' : (item.statusCode === 'FWD' ? 'forwarde' : item.statusCode === 'RWD' ? 'reviewed' : item.statusCode === 'APG' ? 'approved' : item.statusCode === 'RVD' ? 'revoked' : ['RTG', 'RTM'].includes(item.statusCode) ? 'returned' : 'reforwarded')}`;
        return {
          sn: index + 1,
          description: item.description || '-' || '-',
          // from: 'V' + item[5] + '-R' + item[6] || '-',
          from: index + 1 < versionRecorList.length ? 'I' + versionRecorList[index + 1].issueNo + '-R' + versionRecorList[index + 1].revisionNo : '--',
          to: 'I' + item.issueNo + '-R' + item.revisionNo || '-',
          issueDate: format(new Date(item.dateOfRevision), 'dd-MM-yyyy') || '-',
          // status: item.status || '--',
          status: <Box className={statusColor} onClick={() => openTran(item)}><Box class='status'>{item.status}<i class="material-icons float-right font-med">open_in_new</i></Box></Box> || '-',
          action: (
            <div>

              <>
                {(item.statusCode === 'INI' || item.statusCode === 'RTM' || item.statusCode === 'RTG' || item.statusCode === 'RVD') && (
                  <>
                    <button className="icon-button edit-icon-button me-1" onClick={() => redirecttoQmDocument(item)} title="Edit"> <i className="material-icons"  >edit_note</i></button>
                    <button className="icon-button me-1" style={{ color: '#439cfb' }} onClick={() => { setSingleDoc(item); setOpenDialog2(true); }} title="Document Summary"> <i className="material-icons"  >summarize</i></button>
                    {docName && docName === 'dwp' ? (<button className="icon-button me-1" style={{ color: '#439cfb' }} onClick={() => redirecttoRiskRegisterComponent(item)} title="Risk"> <i className="material-icons"  >app_registration</i></button>) : " "}
                    <button className="icon-button kpi-icon-button me-1" onClick={() => addKpi(item)} title="Add KPI"> <i className="material-icons"  >fact_check</i></button>
                    <button className="icon-button me-1" style={{ color: 'rgb(255, 181, 44)' }} onClick={() => editDescription(item)} title="Edit Description" >
                      <i className="material-icons">edit</i>
                    </button>
                  </>
                )}
                {getDocPDF('', item)}
                {roleName && roleName.trim() === 'Divisional MR' && (item.statusCode === 'INI' || item.statusCode === 'RTM' || item.statusCode === 'RTD' || item.statusCode === 'RVD') ? (
                  <button className="icon-button me-1" style={{ color: 'green' }} title="Forward" onClick={() => openModal(item, roleName)}>
                    <i className="material-icons">fast_forward</i>
                  </button>
                ) : " "}
                {roleName && roleName.trim() === 'MR' && (item.statusCode === 'FWD' || item.statusCode === "RFD") ? (
                  <button className="icon-button me-1" style={{ color: 'green' }} title="Review" onClick={() => openModal(item, roleName)}>
                    <i className="material-icons">check_circle</i>
                  </button>
                ) : " "}
                {empIdAsNumber === versionRecorList[0].approvedBy && item.statusCode === 'RWD' ? (
                  <button className="icon-button me-1" style={{ color: 'green' }} title="Approve" onClick={() => openModal(item, roleName)}>
                    <i className="material-icons">check_circle</i>
                  </button>
                ) : " "}
                {(item.statusCode === 'APG' && index == 0) && (<button className="icon-button me-1" style={{ color: 'darkorange' }} title="Amend" onClick={() => openAmmendModal()}>
                  <i className="material-icons">note_alt</i>
                </button>)}
                {(item.statusCode === 'FWD' || item.statusCode === 'RFD') && roleName && (roleName.trim() === 'Divisional MR' || roleName.trim() === 'MR') && (<button className="icon-button me-1" style={{ color: 'red' }} title="Revoke" onClick={() => RevokeSubmit(item, empIdAsNumber)}>
                  <i className="material-icons">settings_backup_restore</i>
                </button>)}

                {/* <button className="icon-button me-1" style={{color: '#ea5753'}} title="Mapping Of Clauses" onClick={()=>addMappingOfClasses(item)} > <i className="material-icons"  >table_chart</i></button> */}

              </>
            </div>
          ),
        }
      });

      const employee = await getEmployee();
      const MRList = await getMRList();
      const filteredMrList = employee.filter(emp =>
        MRList.some(mr => mr.empId === emp.empId)
      );
      const filteredDivsionalMrList = userManagerList.filter(data => data.imsFormRoleId === 5);
      const DivisionEmployee = await getDivisionEmployee();

      if (docName === 'dwp') {
        const filteredEmployeeList = employee.filter(emp => emp.divisionId === groupDivisionId);
        const filteredDivisionEmployeeList = DivisionEmployee.filter(divemp => divemp.divisionId === groupDivisionId);
        const mergerList = new Set([...filteredEmployeeList.map(data => data.empId), ...filteredDivisionEmployeeList.map(data => data.empId)])
        fileteredApproveList(mergerList, employee);
        const finalDivisionalMrList = filteredDivsionalMrList.filter(list => list.divisionId === groupDivisionId);
        setFilteredDivisionalMrList(finalDivisionalMrList);
        filterDivMrList(finalDivisionalMrList, empIdAsNumber);
      } else {
        const seldivisionList = await getDivisionList();
        const fileterdDivisionList = seldivisionList.filter(div => div.groupId === groupDivisionId).map(item => item.divisionId);
        const filEmpIds = employee.filter(data => fileterdDivisionList.includes(data.divisionId)).map(item => item.empId);
        const filDivEmpIds = DivisionEmployee.filter(data => fileterdDivisionList.includes(data.divisionId)).map(item => item.empId);
        const mergerList = new Set([...filEmpIds, ...filDivEmpIds])
        fileteredApproveList(mergerList, employee);
        const divisionalMrList = filteredDivsionalMrList.filter(data => fileterdDivisionList.includes(data.divisionId));
        setFilteredDivisionalMrList(divisionalMrList);
        filterDivMrList(divisionalMrList, empIdAsNumber);
      }
      setFilteredMrList(filteredMrList);
      setStatusCode(versionRecorList.length > 0 ? versionRecorList[0].statusCode : "");
      setVersionRecordPrintList(mappedData);
      setVersionRecordList(versionRecorList);
      setIsLoading(false);

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fileteredApproveList = (list, employee) => {
    const filtEmpByDiv = employee.filter(data => list.has(data.empId))
    setDwpGwpList(filtEmpByDiv);
    if (filtEmpByDiv && filtEmpByDiv.length > 0) {
      setInitialValues(prev => ({
        ...prev,
        approvedBy: filtEmpByDiv[0].empId
      }))
    }
  }

  const filterDivMrList = (list, selempId) => {
    if (list && list.length > 0) {
      const matchedEmployee = list.find(item => item.empId === selempId); // Check for a match
      setInitialValues(prev => ({
        ...prev,
        initiatedBy: matchedEmployee ? matchedEmployee.empId : list[0].empId // Use matched empId or fallback
      }));
    }
  };

  const getDocPDF = (action, revisionElements) => {
    return <DwpDocPrint action={action} revisionElements={revisionElements} />
  }

  const addKpi = (item) => {
    navigate('/kpi-objective', { state: { dwpGwp: item } })
  }

  const redirecttoQmDocument = useCallback((element) => {
    navigate('/dwp-add-content', { state: { revisionElements: element } })
  }, [navigate]);

  const redirecttoRiskRegisterComponent = useCallback((element) => {
    navigate('/risk-register', { state: { revisionElements: element } })
  }, [navigate]);

  const openTran = (item) => {
    localStorage.setItem('revisionData', JSON.stringify(item));
    window.open('/dwp-revision-tran', '_blank');
  }

  const setDwpDivisionList = async (imsFormRoleId, empId) => {

    const dwpDivisionList = await getDwpDivisionList(imsFormRoleId, empId);

    if (dwpDivisionList && dwpDivisionList.length > 0) {
      if (docName === 'dwp') {
        setGroupDivisionId(dwpDivisionList[0].divisionId);
        setQmsDocTypeDto(prevState => ({ ...prevState, groupDivisionId: dwpDivisionList[0]?.divisionId || 0 }));
      }
    }

    setDivisionList(dwpDivisionList);

  };

  const setDwpDivisionGroupList = async (imsFormRoleId, empId) => {

    const dwpDivisionGroupList = await getDwpDivisionGroupList(imsFormRoleId, empId);
    if (dwpDivisionGroupList && dwpDivisionGroupList.length > 0) {
      if (docName === 'gwp') {
        setGroupDivisionId(dwpDivisionGroupList[0].groupId);
        setQmsDocTypeDto(prevState => ({ ...prevState, groupDivisionId: dwpDivisionGroupList[0]?.groupId || 0 }));
      }
    }
    setDivisionGroupList(dwpDivisionGroupList);

  };

  const editDescription = (item) => {

    setshowDescriptionModal(true);
    setDescriptioninitialValues({
      description: item.description,
    })
  }

  const handleCloseDocSummaryDialog = () => {
    setOpenDialog2(false)
    setSingleDoc(null);
  };

  const handleCloseDialog = () => {
    setOpenAddIssueDialog(false)
    setSingleDoc([]);
    setRevisionListRefresh(!revisionListRefresh)
  };

  const openModal = (item, role) => {
    setShowModal(true);
    setRevisionRecordId(item.revisionRecordId);
    setStatusCode(item.statusCode);
    setSelRoleName(role);
  }

  const columns = [
    { name: 'SN', selector: (row) => row.sn, sortable: true, grow: 1, align: 'text-center', width: '5%' },
    { name: 'Description', selector: (row) => row.description, sortable: true, grow: 2, align: 'text-start', width: '30%' },
    { name: 'Issue From', selector: (row) => row.from, sortable: true, grow: 2, align: 'text-center', width: '5%' },
    { name: 'Issue To', selector: (row) => row.to, sortable: true, grow: 2, align: 'text-center', width: '5%' },
    { name: 'Date Of Revision', selector: (row) => row.issueDate, sortable: true, grow: 2, align: 'text-center', width: '10%' },
    { name: 'Status', selector: (row) => row.status, sortable: false, grow: 2, align: 'text-center', width: '15%' },
    { name: 'Action', selector: (row) => row.action, sortable: false, grow: 2, align: 'text-center', width: '20%' },
  ];

  const openAmmendModal = () => {
    setAmmendShowModal(true);
  }


  const RevokeSubmit = async (item, empId) => {
    var finalValue = { ...item, empId };
    const confirm = await AlertConfirmation({
      title: "Are you sure to Revoke ? ",
      message: '',
    });

    if (confirm) {
      try {
        const response = await dwprevokeSubmit(finalValue);
        if (response === 200) {
          fetchData();
          setInitialValues({
            initiatedBy: ""
          })
          Swal.fire({
            icon: "success",
            title: docName.toUpperCase(),
            text: "Revoked SuccessFully",
            showConfirmButton: false,
            timer: 1500
          });
        } else {
          Swal.fire("Error!", "Failed to Revoke Quality Manual !", "error");
        }
      } catch (error) {
        console.error("Error Revoke Quality Manual:", error);
        Swal.fire("Error!", "There was an issue Revoke Quality Manual.", "error");
      }
    }
  }

  const handleSubmit = async (values) => {
    const reviewedBy = filteredMrList.length > 0 ? filteredMrList[0].empId : ""
    var action = values.action;
    if ((action === "R" && (!values.remarks || values.remarks.trim() === "")) || (statusCode === 'RTM' || statusCode === 'RTG' || statusCode === 'RVD') && (!values.remarks || values.remarks.trim() === "")) {
      return Swal.fire("Warning", "Please Enter the Remarks!", "warning");
    }
    const newValue = { ...values, reviewedBy, revisionRecordId, empId };
    var submit = statusCode === 'RWD' ? "Are you sure to  Approve ? " : "Are you sure to Forward ? ";
    var textsubmit = statusCode === 'RWD' ? "Approved Successfully " : "Forwarded Successfully  ";
    var title = action === 'R' ? "Are you sure to Return ? " : submit;
    var text = action === 'R' ? "Returned Successfully" : textsubmit;
    const confirm = await AlertConfirmation({
      title: title,
      message: '',
    });
    if (confirm) {
      try {
        const response = await forwardDwpGwp(newValue);
        if (response === 200) {
          fetchData();
          setShowModal(false);
          setInitialValues({
            reviewedBy: ""
          })
          Swal.fire({
            icon: "success",
            title: docName.toUpperCase(),
            text: text,
            showConfirmButton: false,
            timer: 1500
          });
        } else {
          Swal.fire("Error!", "Failed to Forward" + docName.toUpperCase() + " ", "error");
        }
      } catch (error) {
        console.error("Error Forward " + docName.toUpperCase() + ":", error);
        Swal.fire("Error!", "There was an issue Forward " + docName.toUpperCase() + ".", "error");
      }
    }
  }

  const onchangeIsNewIssue = (event) => {
    if (versionRecordList && versionRecordList.length > 0) {
      const latestRecord = versionRecordList[0]; // Latest record

      if (event.target.checked) {
        // New issue starts from issue incremented, revision reset
        setNewAmendVersion(`I${parseInt(latestRecord.issueNo) + 1}-R0`);
      } else {
        // Revision increment within the same issue
        setNewAmendVersion(
          `I${latestRecord.issueNo}-R${parseInt(latestRecord.revisionNo) + 1}`
        );
      }
    } else {
      // Default behavior if no records exist
      if (event.target.checked) {
        setNewAmendVersion("I2-R0");
      } else {
        setNewAmendVersion("I1-R1");
      }
    }
  };

  const handleSubmitAmmend = async (values) => {

    const latestRecord = versionRecordList[0];
    const abbreviationIdNotReq = latestRecord.abbreviationIdNotReq;
    const docType = docName;
    if (newAmendVersion) {
      const [issueNo, revisionNo] = newAmendVersion
        .replace("I", "")
        .split("-R")
        .map(Number); // Convert to numbers

      // Example: you can include these in the values or make API calls
      const amendedValues = {
        ...values,
        issueNo,
        revisionNo,
        abbreviationIdNotReq,
        empId,
        groupDivisionId,
        docType,
      };
      const confirm = await AlertConfirmation({
        title: "Are you sure to Amend ?",
        message: '',
      });
      if (confirm) {
        try {
          const response = await amendDwpGwp(amendedValues);
          if (response > 0) {
            fetchData();
            setAmmendShowModal(false);
            setAmmendInitialValues({
              isNewIssue: false,
              currentVersion: "",
              description: "",
            })
            Swal.fire({
              icon: "success",
              title: docName.toUpperCase(),
              text: "Amend SuccessFully ",
              showConfirmButton: false,
              timer: 1500
            });
          } else {
            Swal.fire("Error!", "Failed to Amend" + docName.toUpperCase() + " !", "error");
          }
        } catch (error) {
          console.error("Error Amend" + docName.toUpperCase() + "", error);
          Swal.fire("Error!", "There was an issue Amend " + docName.toUpperCase() + ".", "error");
        }
      }

    }
  }

  const handleSubmitUpdate = async (values) => {
    const latestRecord = versionRecordList[0];
    const revisionRecordId = latestRecord.revisionRecordId;
    const finalValues = {
      ...values,
      revisionRecordId,
    };
    const confirm = await AlertConfirmation({
      title: "Are you sure to Update Description ?",
      message: '',
    });
    if (confirm) {
      try {
        const response = await UpdateDwpGwpDescription(finalValues);
        if (response > 0) {
          fetchData();
          setshowDescriptionModal(false);
          setDescriptioninitialValues({
            description: "",
          })
          Swal.fire({
            icon: "success",
            title: docName.toUpperCase(),
            text: "Description Updated SuccessFully ",
            showConfirmButton: false,
            timer: 1500
          });
        } else {
          Swal.fire("Error!", "Failed to Update " + docName.toUpperCase() + " Description !", "error");
        }
      } catch (error) {
        console.error("Error Update " + docName.toUpperCase() + " Description :", error);
        Swal.fire("Error!", "There was an issue Update " + docName.toUpperCase() + " Description.", "error");
      }
    }
  }
  return (

    <div className="card">
      <Navbar />
      <div className="card-body">
        {/* <h3>DWP - Revision Record </h3> */}

        <div className="row">
          <div className="col-md-10">
            <h3>{docName.toString().toUpperCase()} - Revision Record</h3>
          </div>
          <div className="col-md-2">
            {/* <SelectPicker options={divisionList} label="Division Name"
                value={divisionList && divisionList.length > 0 && divisionList.find(option => option.value === divisionId) || null}
                handleChange={(newValue) => { setDivisionId(newValue?.value) }} /> */}
            {docName === "dwp" && (
              <Autocomplete
                options={divisionList}
                disablePortal
                getOptionLabel={(division) => `${division.divisionCode} - ${division.divisionName}`}
                renderOption={(props, option) => {
                  return (
                    <CustomMenuItem {...props} key={option.divisionId}>
                      <ListItemText primary={`${option.divisionCode} - ${option.divisionName}`} />
                    </CustomMenuItem>
                  );
                }}
                value={divisionList.find((division) => division.divisionId === groupDivisionId) || null}
                onChange={(event, value) => setGroupDivisionId(value ? value.divisionId : null)}
                renderInput={(params) => <TextField {...params} label="Division Name" margin="normal" InputProps={{
                  ...params.InputProps,
                  sx: { height: 40 },
                }} />}
              />
            )}

            {docName === "gwp" && (
              <Autocomplete
                options={divisionGroupList}
                disablePortal
                getOptionLabel={(divisionGroup) => `${divisionGroup.groupCode} - ${divisionGroup.groupName}`}
                renderOption={(props, option) => {
                  return (
                    <CustomMenuItem {...props} key={option.groupId}>
                      <ListItemText primary={`${option.groupCode} - ${option.groupName}`} />
                    </CustomMenuItem>
                  );
                }}
                value={divisionGroupList.find((divisionGroup) => divisionGroup.groupId === groupDivisionId) || null}
                onChange={(event, value) => setGroupDivisionId(value ? value.groupId : null)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Group"
                    size="small"
                    fullWidth
                    variant="outlined"
                    margin="normal"
                  />
                )}
              />
            )}

          </div>
        </div>
        <br />
        <div id="card-body customized-card">
          {isLoading ? (
            <h3>Loading...</h3>
          ) : error ? (
            <h3 color="error">{error}</h3>
          ) : (
            <Datatable columns={columns} data={versionRecordPrintList} />
          )}
        </div>
        {showModal && (
          <>
            {/* Backdrop */}
            <div className="modal-backdrop show" style={{ zIndex: 1040 }}></div>
            <div className="modal fade show" style={{ display: "block" }}>
              <div className="modal-dialog modal-lg modal-lg-custom" style={{ maxWidth: "62%", width: "62%" }}>
                <div className="modal-content modal-content-custom">
                  <div className="modal-header bg-secondary text-white modal-header-custom d-flex justify-content-between">
                    <h5 className="modal-title">{docName.toUpperCase()} Manual Forward</h5>
                    <button type="button" className="btn btn-danger modal-header-danger-custom" onClick={() => setShowModal(false)} aria-label="Close">
                      &times;
                    </button>
                  </div>
                  <div className="modal-body">
                    <Formik initialValues={initialValues} enableReinitialize validationSchema={validationSchema} onSubmit={(values, { setSubmitting }) => {
                      // Logic to handle submission based on actionType
                      const action = values.action; // Add this to the form values
                      const formData = {
                        ...values,
                        action, // Include action type in submission data
                      };
                      handleSubmit(formData); // Pass it to your handleSubmit function
                      setSubmitting(false); // Optionally stop submitting indicator
                    }}
                    >
                      {({ values, errors, touched, setFieldValue, setFieldTouched }) => (
                        <Form>
                          <div className="row">
                            <div className="col-md-12">
                              {statusCode === 'INI' ? (
                                <Field name="initiatedBy">
                                  {({ field, form }) => (
                                    <Autocomplete options={filteredDivisionalMrList} getOptionLabel={option => option.empName + ", " + option.empDesig}
                                      renderOption={(props, option) => {
                                        return (
                                          <CustomMenuItem {...props} key={option.empId}>
                                            <ListItemText primary={option.empName + ", " + option.empDesig} />
                                          </CustomMenuItem>
                                        );
                                      }}
                                      value={filteredDivisionalMrList.find(emp => emp.empId === form.values.initiatedBy) || null}
                                      ListboxProps={{ sx: { maxHeight: 200, overflowY: 'auto' } }}
                                      onChange={(event, newValue) => { setFieldValue("initiatedBy", newValue ? newValue.empId : ''); }}
                                      renderInput={(params) => (<TextField {...params} label="Initiated By" size="small" margin="normal" variant="outlined"
                                        error={touched.initiatedBy && Boolean(errors.initiatedBy)}
                                        helperText={touched.initiatedBy && errors.initiatedBy} />)} />
                                  )}
                                </Field>
                              ) : (
                                <div className="row">
                                  <div className="col-md-2" style={{ textAlign: "start", display: "flex", alignItems: "center" }}>
                                    <span style={{ color: "black", fontSize: "1.2rem", padding: "0px", marginRight: "5px" }}>
                                      {(statusCode === "INI" || statusCode === "RTM" || statusCode === "RTG" || statusCode === "RVD")
                                        ? "Prepare By" : "Prepared By"} :
                                    </span>
                                  </div>
                                  <div className="col-md-8" style={{ textAlign: "start", display: "flex", alignItems: "center" }}>
                                    <span style={{ color: "blue", fontSize: "1.2rem", padding: "0px" }}>
                                      {versionRecordList.length > 0 ? versionRecordList[0].initiatedByEmployee : ""}
                                    </span>
                                  </div>
                                  <div className="col-md-2"></div>
                                </div>
                              )}

                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-12">
                              {statusCode === 'INI' ? (
                                <Field
                                  name="reviewedBy"
                                  as={TextField}
                                  label="Reviewed By"
                                  size="small"
                                  margin="normal"
                                  value={
                                    filteredMrList.length > 0
                                      ? `${filteredMrList[0].empName}, ${filteredMrList[0].empDesigName}`
                                      : ""
                                  }
                                  InputProps={{
                                    inputProps: { maxLength: 100 },
                                    autoComplete: "off",
                                    readOnly: true,
                                  }}
                                  style={{ marginTop: "1rem", width: "100%" }}
                                />
                              ) :
                                <div className="row">
                                  <div className="col-md-2" style={{ textAlign: "start" }}>
                                    <span style={{ color: "black", fontSize: "1.2rem", padding: "0px" }}> {(statusCode === "INI" || statusCode === "FWD" || statusCode === "RFD" || statusCode === "RTG" || statusCode === 'RVD')
                                      ? "Review By "
                                      : statusCode === "RTM"
                                        ? "Returned By "
                                        : "Reviewed By "} : </span>
                                  </div>
                                  <div className="col-md-8" style={{ textAlign: "start" }}>
                                    <span style={{ color: "blue", fontSize: "1.2rem", padding: "0px" }}>{versionRecordList.length > 0 ? versionRecordList[0].reviewedByEmployee : ""}</span> </div>
                                </div>
                              }
                              <div className="col-md-2"></div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-12">
                              {statusCode === 'INI' ? (
                                <Field name="approvedBy">
                                  {({ field, form }) => (
                                    <Autocomplete options={dwpGwpList} getOptionLabel={option => option.empName + ", " + option.empDesigName}
                                      renderOption={(props, option) => {
                                        return (
                                          <CustomMenuItem {...props} key={option.empId}>
                                            <ListItemText primary={option.empName + ", " + option.empDesigName} />
                                          </CustomMenuItem>
                                        );
                                      }}
                                      value={dwpGwpList.find(emp => emp.empId === form.values.approvedBy) || null}
                                      ListboxProps={{ sx: { maxHeight: 200, overflowY: 'auto' } }}
                                      onChange={(event, newValue) => { setFieldValue("approvedBy", newValue ? newValue.empId : ''); }}
                                      renderInput={(params) => (<TextField {...params} label="Approved By" size="small" margin="normal" variant="outlined"
                                        error={touched.approvedBy && Boolean(errors.approvedBy)}
                                        helperText={touched.approvedBy && errors.approvedBy} />)} />
                                  )}
                                </Field>) :
                                <div className="row">
                                  <div className="col-md-2" style={{ textAlign: "start" }}>
                                    <span style={{ color: "black", fontSize: "1.2rem", padding: "0px" }}>{(statusCode === "INI" || statusCode === "FWD" || statusCode === "RWD" || statusCode === "RFD" || statusCode === "RTG" || statusCode === 'RVD' || statusCode === 'RTM')
                                      ? "Approve By "
                                      : statusCode === "RTG"
                                        ? "Returned By "
                                        : "Approved By "} : </span>
                                  </div>
                                  <div className="col-md-8" style={{ textAlign: "start" }}>
                                    <span style={{ color: "blue", fontSize: "1.2rem", padding: "0px" }}>{versionRecordList.length > 0 ? versionRecordList[0].approvedByEmployee : ""}</span> </div>
                                </div>
                              }
                              <div className="col-md-2"></div>
                            </div>
                          </div>
                          <br />
                          <div className="row">
                            <div className="col-md-12">
                              <Field name="remarks">
                                {({ field, form }) => (
                                  <TextField
                                    {...field}
                                    label="Remarks"
                                    multiline
                                    minRows={3}
                                    placeholder="Remarks"
                                    size="small"
                                    error={Boolean(form.errors.remarks && form.touched.remarks)}
                                    helperText={form.touched.remarks && form.errors.remarks}
                                    fullWidth
                                    InputProps={{
                                      inputProps: { maxLength: 990 },
                                      autoComplete: "off",
                                    }}
                                  />
                                )}
                              </Field>
                            </div>
                          </div>
                          <div className="col text-center subclass mt-3">
                            <button type="submit" className="btn btn-success me-2" onClick={() => setFieldValue("action", "A")}>
                              {statusCode === 'RWD' ? "Approve" : "Forward"}
                            </button>
                            {selRoleName && selRoleName.trim() !== 'Divisional MR' && statusCode.trim() !== 'INI' ? (<button type="submit" className="btn btn-danger" onClick={() => setFieldValue("action", "R")}>
                              Return
                            </button>) : ""}
                          </div>
                        </Form>
                      )}
                    </Formik>
                  </div>
                </div>
              </div>
            </div>

          </>
        )}
        <br />
        {showDescriptionModal && (
          <>
            {/* Backdrop */}
            <div className="modal-backdrop show" style={{ zIndex: 1040 }}></div>
            <div className="modal fade show" style={{ display: "block" }}>
              <div className="modal-dialog modal-lg modal-lg-custom" style={{ maxWidth: "30%", width: "30%" }}>
                <div className="modal-content modal-content-custom" style={{ minHeight: "300px" }}>
                  <div className="modal-header bg-secondary text-white modal-header-custom d-flex justify-content-between">
                    <h5 className="modal-title">{docName.toUpperCase()} Description Update</h5>
                    <button type="button" className="btn btn-danger modal-header-danger-custom" onClick={() => setshowDescriptionModal(false)} aria-label="Close">
                      &times;
                    </button>
                  </div>
                  <div className="modal-body">
                    <Formik initialValues={descriptioninitialValues} enableReinitialize validationSchema={validationSchemaUpdate} onSubmit={handleSubmitUpdate} >
                      {({ values }) => (
                        <Form>

                          <div className="row">
                            <div className="col-md-12">
                              <Field name="description">
                                {({ field, form }) => (
                                  <TextField
                                    {...field}
                                    label="Description"
                                    multiline
                                    minRows={3}
                                    placeholder="Description"
                                    size="small"
                                    error={Boolean(form.errors.description && form.touched.description)}
                                    helperText={form.touched.description && form.errors.description}
                                    fullWidth
                                    InputProps={{
                                      inputProps: { maxLength: 990 },
                                      autoComplete: "off",
                                    }}
                                  />
                                )}
                              </Field>
                            </div>
                          </div><br /><br />
                          <div className="col text-center subclass mt-3">
                            <button type="submit" className="btn btn-success me-2">
                              Submit
                            </button>
                          </div>
                        </Form>
                      )}
                    </Formik>
                  </div>
                </div>
              </div>
            </div>

          </>
        )}
        <br />
        {ammendshowModal && (
          <>
            {/* Backdrop */}
            <div className="modal-backdrop show" style={{ zIndex: 1040 }}></div>
            <div className="modal fade show" style={{ display: "block" }}>
              <div className="modal-dialog modal-lg modal-lg-custom" style={{ maxWidth: "60%", width: "60%" }}>
                <div className="modal-content modal-content-custom">
                  <div className="modal-header bg-secondary text-white modal-header-custom d-flex justify-content-between">
                    <h5 className="modal-title">{docName.toUpperCase()} Add Version/Release</h5>
                    <button type="button" className="btn btn-danger modal-header-danger-custom" onClick={() => setAmmendShowModal(false)} aria-label="Close">  &times; </button>
                  </div>
                  <div className="modal-body">
                    <Formik initialValues={ammendInitialValues} validationSchema={ammendValidationSchema()} enableReinitialize onSubmit={handleSubmitAmmend} >
                      {({ setFieldValue, values, errors, touched, isValid }) => (
                        <Form>
                          <div className="form-group text-start">
                            <div className="row" >
                              <div className="col-md-3">
                                <label htmlFor="isNewIssue" className="form-label">Is New Issue ?</label>
                                <div className="input-group">
                                  <div className="d-inline-block me-1">Off</div>
                                  <div className="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" id="flexSwitchCheckChecked"
                                      className="form-check-input"
                                      checked={values.isNewIssue}
                                      disabled={!versionRecordList || versionRecordList.length === 0}
                                      onChange={(event) => {
                                        setFieldValue("isNewIssue", event.target.checked);
                                        onchangeIsNewIssue(event);
                                      }} />
                                  </div>
                                  <div className="d-inline-block me-1">On</div>
                                </div>
                              </div>

                              <div className="col-md-4">
                                <label htmlFor="currentVersion" className="form-label">Current Version :</label>
                                <div className="input-group">
                                  <input type="text" className="form-control" name="currentVersion" value={values.currentVersion} disabled />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="mb-3 text-start">
                            <label htmlFor="description">Description :</label>
                            <div>
                              <Field as="textarea" id="description" name="description" rows="3" className={`form-control w-100 ${touched.description && errors.description ? 'is-invalid' : ''}`} />
                              <ErrorMessage name="description" component="div" className="invalid-feedback"
                              />
                            </div>
                          </div>

                          <div className="text-center">
                            <button type="submit" className="btn submit" disabled={!isValid} >
                              Document ({newAmendVersion})
                            </button>
                          </div>
                        </Form>
                      )}
                    </Formik>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        <div className="text-center">
          {(versionRecordPrintList.length === 0 && ((docName === 'dwp' && divisionList.length > 0) || (docName === 'gwp' && divisionGroupList.length > 0))) && (
            <button
              type="button"
              className="btn add"
              onClick={() => { setOpenAddIssueDialog(true) }}
            >
              Add Issue (V1-R0)
            </button>
          )}
        </div>

      </div>

      <DwpDocsAddIssueDialog
        open={openAddIssueDialog}
        onClose={handleCloseDialog}
        revisionElements={singleDoc}
        docType={docName}
        groupDivisionId={groupDivisionId}
      //  onConfirm={handleIssueConfirm}
      />

      <AddDocumentSummaryDialog
        open={openDialog2}
        onClose={handleCloseDocSummaryDialog}
        revisionElements={singleDoc}
      />
      <div className="col-md-12" style={{ textAlign: "center" }}>
        <b>Approval Flow For {docName.toUpperCase()}</b>
      </div><br />
      {statusCode === 'INI' ?
        (<div className="d-flex align-items-center justify-content-center" style={{ gap: "15px" }}>
          <div style={{ background: "linear-gradient(to top, #3c96f7 10%, transparent 115%)", padding: "10px 20px", textAlign: "center", borderRadius: "5px", }}>
            Prepare By - {filteredDivisionalMrList.length > 0 ? `${filteredDivisionalMrList[0].empName}, ${filteredDivisionalMrList[0].empDesig}` : ""}
          </div>
          <span style={{ fontSize: "1.5rem" }}>→</span>
          <div style={{ background: "linear-gradient(to top, #eb76c3 10%, transparent 115%)", padding: "10px 20px", textAlign: "center", borderRadius: "5px", }}>
            Review By -
          </div>
          <span style={{ fontSize: "1.5rem" }}>→</span>
          <div style={{ background: "linear-gradient(to top, #9b999a 10%, transparent 115%)", padding: "10px 20px", textAlign: "center", borderRadius: "5px", }}>
            Approve By -
          </div>
        </div>)
        :
        (<div className="d-flex align-items-center justify-content-center" style={{ gap: "15px" }}>
          <div style={{ background: "linear-gradient(to top,#3c96f7 10%, transparent 115%)", padding: "10px 20px", textAlign: "center", borderRadius: "5px", }}>
            {(statusCode === "INI" || statusCode === "RTM" || statusCode === "RTG" || statusCode === "RVD")
              ? "Prepare By Divisional MR" : "Prepared By Divisional MR"} - {versionRecordList.length > 0 ? versionRecordList[0].initiatedByEmployee : ""}
            {(statusCode === "FWD" || statusCode === "RWD" || statusCode === "APG" || statusCode === "RFD") && (
              <span style={{ marginLeft: "10px", color: "green !important", fontSize: "1.2rem" }}>✔</span>
            )}
          </div>
          <span style={{ fontSize: "1.5rem" }}>→</span>
          <div style={{ background: "linear-gradient(to top, #eb76c3 10%, transparent 115%)", padding: "10px 20px", textAlign: "center", borderRadius: "5px", }}>

            {(statusCode === "INI" || statusCode === "FWD" || statusCode === "RFD" || statusCode === "RTG" || statusCode === 'RVD')
              ? "Review By MR"
              : statusCode === "RTM"
                ? "Returned By MR"
                : "Reviewed By MR"} - {versionRecordList.length > 0 ? versionRecordList[0].reviewedByEmployee : ""}
            {(statusCode === "RWD" || statusCode === "APG") && (
              <span style={{ marginLeft: "10px", color: "green !important", fontSize: "1.2rem" }}>✔</span>
            )}
          </div>
          <span style={{ fontSize: "1.5rem" }}>→</span>
          <div style={{ background: "linear-gradient(to top, #9b999a 10%, transparent 115%)", padding: "10px 20px", textAlign: "center", borderRadius: "5px", }}>
            {(statusCode === "INI" || statusCode === "FWD" || statusCode === "RWD" || statusCode === "RFD" || statusCode === "RTG" || statusCode === 'RVD' || statusCode === 'RTM')
              ? "Approve By GD"
              : statusCode === "RTG"
                ? "Returned By GD"
                : "Approved By GD"} - {versionRecordList.length > 0 ? versionRecordList[0].approvedByEmployee : ""}
            {statusCode === "APG" && (
              <span style={{ marginLeft: "10px", color: "green !important", fontSize: "1.2rem" }}>✔</span>
            )}
          </div>
        </div>)
      }
      <br />
    </div>

  )

}

export default withRouter(DwpRevisionRecordsComponent);