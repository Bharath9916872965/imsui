import { useCallback, useEffect, useState } from "react";
import { amendQm, forwardQm, getLabDetails, getMRList, getMRRepList, getQmVersionRecordDtoList, getSelectedEmpData, revokeSubmit, UpdateDescription, UpdateQMDescription } from "../../../services/qms.service";
import Datatable from "../../datatable/Datatable";
import withRouter from '../../../common/with-router';
import { Autocomplete, Box, IconButton, ListItemText, TextField } from '@mui/material';
import Navbar from "../../Navbar/Navbar";
import "./qm-revisionrecords.component.css"
import QmDocPrint from "../../prints/qms/qm-doc-print";
import { format } from "date-fns";
import AddDocumentSummaryDialog from "./qm-add-document-summary-dialog";
import QmAddMappingOfClassesDialog from "./qm-add-mapping-of-classes-dialog";
import { getUserManagerList } from "services/admin.serive";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from 'yup';
import { CustomMenuItem } from "services/auth.header";
import AlertConfirmation from "common/AlertConfirmation.component";
import { green } from "@mui/material/colors";
import { getEmployee } from "services/audit.service";


const QmRevisionRecordsComponent = ({ router }) => {

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [versionRecordList, setVersionRecordList] = useState([]);
  const [versionRecordPrintList, setVersionRecordPrintList] = useState([]);
  const [openDialog2, setOpenDialog2] = useState(false);
  const [openMocDialog, setOpenMocDialog] = useState(false);
  const [singleDoc, setSingleDoc] = useState(null);
  const [filteredMrList, setFilteredMrList] = useState([]);
  const [filteredMrRepList, setFilteredMrRepList] = useState([]);
  const [userManagerList, setUserManagerList] = useState([]);
  const [selEmpData, setSelectedEmpData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [empId, setLoginEmpId] = useState([]);
  const [revisionRecordId, setRevisionRecordId] = useState([]);
  const [selRoleName, setSelRoleName] = useState([]);
  const [statusCode, setStatusCode] = useState([]);
  const [ammendshowModal, setAmmendShowModal] = useState(false);
  const [showDescriptionModal, setshowDescriptionModal] = useState(false);

  const [newAmendVersion, setNewAmendVersion] = useState("");
  const [ammendInitialValues, setAmmendInitialValues] = useState({
    isNewIssue: false,
    currentVersion: "",
    description: "",
  });

  const [initialValues, setInitialValues] = useState({
    initiatedBy: "",
    remarks: "",
  });

  const [descriptioninitialValues, setDescriptioninitialValues] = useState({
    description: "",
  });

  const validationSchema = Yup.object().shape({
    initiatedBy: Yup.string()
      .required("initiated By required"),
  });

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
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const role = localStorage.getItem('roleId')
      const roleName = localStorage.getItem('roleName')
      const empId = localStorage.getItem('empId')
      const empIdAsNumber = Number(empId);
      setLoginEmpId(empIdAsNumber);
      const VersionRecorList = await getQmVersionRecordDtoList();
      const userManagerList = await getUserManagerList();
      setUserManagerList(userManagerList);

      if (VersionRecorList && VersionRecorList.length > 0) {
        // Assuming the list is sorted by latest first
        const latestRecord = VersionRecorList[0];

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


      const mappedData = VersionRecorList.map((item, index) => {
        // Map status codes to their corresponding class names
        const statusClasses = {
          INI: 'initiated',
          FWD: 'forwarde',
          RWD: 'reviewed',
          APD: 'approved',
          RVM: 'revoked',
          RTD: 'returned',
          RTM: 'returned',
          RFD: 'reforwarded',
        };
        
        const statusColor = statusClasses[item.statusCode] || 'default';
      
        // Generate actions based on the item's status and role
        const actionButtons = (
          <>
            {['INI', 'RTM', 'RTD', 'RVM'].includes(item.statusCode) && (
              <>
                <button
                  className="icon-button edit-icon-button me-1"
                  onClick={() => redirecttoQmDocument(item)}
                  title="Edit"
                >
                  <i className="material-icons">edit_note</i>
                </button>
                <button
                  className="icon-button me-1"
                  style={{ color: '#ea5753' }}
                  onClick={() => addMappingOfClasses(item)}
                  title="Mapping Of Clauses"
                >
                  <i className="material-icons">table_chart</i>
                </button>
                <button
                  className="icon-button me-1"
                  style={{ color: '#439cfb' }}
                  onClick={() => {
                    setSingleDoc(item);
                    setOpenDialog2(true);
                  }}
                  title="Document Summary"
                >
                  <i className="material-icons">summarize</i>
                </button>
                <button
                  className="icon-button me-1"
                  style={{ color: 'rgb(255, 181, 44)' }}
                  onClick={() => editDescription(item)}
                  title="Edit Description"
                >
                  <i className="material-icons">edit</i>
                </button>
              </>
            )}
            {getDocPDF('', item)}
            {roleName?.trim() === 'MR Rep' && ['INI', 'RTM', 'RTD', 'RVM'].includes(item.statusCode) && (
              <button
                className="icon-button me-1"
                style={{ color: 'green' }}
                title="Forward"
                onClick={() => openModal(item, roleName)}
              >
                <i className="material-icons">fast_forward</i>
              </button>
            )}
            {roleName?.trim() === 'MR' && ['FWD', 'RFD'].includes(item.statusCode) && (
              <button
                className="icon-button me-1"
                style={{ color: 'green' }}
                title="Review"
                onClick={() => openModal(item, roleName)}
              >
                <i className="material-icons">check_circle</i>
              </button>
            )}
            {roleName?.trim() === 'Director' && item.statusCode === 'RWD' && (
              <button
                className="icon-button me-1"
                style={{ color: 'green' }}
                title="Approve"
                onClick={() => openModal(item, roleName)}
              >
                <i className="material-icons">check_circle</i>
              </button>
            )}
            {item.statusCode === 'APD' && index === 0 && (
              <button
                className="icon-button me-1"
                style={{ color: 'darkorange' }}
                title="Amend"
                onClick={openAmmendModal}
              >
                <i className="material-icons">note_alt</i>
              </button>
            )}
            {['FWD', 'RFD'].includes(item.statusCode) &&
              ['MR Rep', 'MR'].includes(roleName?.trim()) && (
                <button
                  className="icon-button me-1"
                  style={{ color: 'red' }}
                  title="Revoke"
                  onClick={() => RevokeSubmit(item, empIdAsNumber)}
                >
                  <i className="material-icons">settings_backup_restore</i>
                </button>
              )}
          </>
        );
      
        return {
          sn: index + 1,
          description: item.description || '-',
          from:
            index + 1 < VersionRecorList.length
              ? `I${VersionRecorList[index + 1].issueNo}-R${VersionRecorList[index + 1].revisionNo}`
              : '--',
          to: `I${item.issueNo}-R${item.revisionNo}` || '-',
          issueDate: format(new Date(item.dateOfRevision), 'dd-MM-yyyy') || '-',
          status: (
            <Box className={statusColor} onClick={() => openTran(item)}>
              <Box className="status">
                {item.status}
                <i className="material-icons float-right font-med">open_in_new</i>
              </Box>
            </Box>
          ),
          action: <div>{actionButtons}</div>,
        };
      });
      

      const labdata = await getLabDetails();
      const employee = await getEmployee();
      const selectedEmpData = await getSelectedEmpData(labdata.labAuthorityId);
      const MrRepList = await getMRRepList();
      const MRList = await getMRList();
      const filteredMrList = employee.filter(emp =>
        MRList.some(mr => mr.empId === emp.empId)
      );
      const filteredMrRepList = employee.filter(emp =>
        MrRepList.some(mr => mr.empId === emp.empId)
      );

      if (filteredMrRepList && filteredMrRepList.length > 0) {
        const latestInitiatedBy = VersionRecorList && VersionRecorList.length > 0 && VersionRecorList[0].initiatedBy
        ? VersionRecorList[0].initiatedBy
        : filteredMrRepList[0].empId;
        setInitialValues({
          initiatedBy: latestInitiatedBy
        })
      }

      setSelectedEmpData(selectedEmpData);
      setFilteredMrList(filteredMrList);
      setFilteredMrRepList(filteredMrRepList);
      setVersionRecordPrintList(mappedData);
      setVersionRecordList(VersionRecorList);
      setIsLoading(false);
      setStatusCode(VersionRecorList.length > 0 ? VersionRecorList[0].statusCode : "");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getDocPDF = (action, revisionElements) => {
    return <QmDocPrint action={action} revisionElements={revisionElements} />
  }

  const openTran = (item) => {
    localStorage.setItem('revisionData', JSON.stringify(item));
    window.open('/qm-revision-tran', '_blank');
  }
  const redirecttoQmDocument = useCallback((element) => {
    navigate('/qm-add-content', { state: { revisionElements: element } })
  }, [navigate]);

  const handleCloseDocSummaryDialog = () => {
    setOpenDialog2(false)
    setSingleDoc(null);
  };

  const handleCloseMocDialog = () => {
    setOpenMocDialog(false)
    setSingleDoc(null);
  };

  const addMappingOfClasses = (item) => {
    setOpenMocDialog(true)
    setSingleDoc(item)
    // return <QmAddMappingOfClassesDialog open={openMovDialog} onClose={handleCloseMocDialog} revisionRecordId={revisionRecordId}/>;
  };


  const columns = [
    { name: 'SN', selector: (row) => row.sn, sortable: true, grow: 1, align: 'text-center', width: '5%' },
    { name: 'Description', selector: (row) => row.description, sortable: true, grow: 2, align: 'text-start', width: '30%' },
    { name: 'Issue From', selector: (row) => row.from, sortable: true, grow: 2, align: 'text-center', width: '5%' },
    { name: 'Issue To', selector: (row) => row.to, sortable: true, grow: 2, align: 'text-center', width: '5%' },
    { name: 'Date Of Revision', selector: (row) => row.issueDate, sortable: true, grow: 2, align: 'text-center', width: '10%' },
    { name: 'Status', selector: (row) => row.status, sortable: false, grow: 2, align: 'text-center', width: '15%' },
    { name: 'Action', selector: (row) => row.action, sortable: false, grow: 2, align: 'text-center', width: '20%' },
  ];

  const openModal = (item, role) => {
    setShowModal(true);
    setRevisionRecordId(item.revisionRecordId);
    setStatusCode(item.statusCode);
    setSelRoleName(role);
  }
  const openAmmendModal = () => {
    setAmmendShowModal(true);
  }

  const editDescription = (item) => {

    setshowDescriptionModal(true);
    setDescriptioninitialValues({
      description: item.description,
    })
  }
  const RevokeSubmit = async (item, empId) => {
    var finalValue = { ...item, empId };
    const confirm = await AlertConfirmation({
      title: "Are you sure to Revoke ? ",
      message: '',
    });

    if (confirm) {
      try {
        const response = await revokeSubmit(finalValue);
        if (response === 200) {
          fetchData();
          setInitialValues({
            reviewedBy: ""
          })
          Swal.fire({
            icon: "success",
            title: `Quality Manual`,
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
    const approvedBy = selEmpData?.[0]?.empId || "";
    const reviewedBy = filteredMrList?.[0]?.empId || "";
    const remarksRequiredStatuses = ['RTM', 'RTD', 'RVM'];
    
    var action = values.action;
    if (
      (!values.remarks?.trim() && action === "R") ||
      (remarksRequiredStatuses.includes(statusCode) && !values.remarks?.trim())
    ) {
      return Swal.fire("Warning", "Please Enter the Remarks!", "warning");
    }
    const newValue = { ...values, reviewedBy, approvedBy, revisionRecordId, empId };
    const isApproval = statusCode === 'RWD';
    const isReturn = action === 'R';
    const confirmationMessage = isReturn ? "Are you sure to Return?" : isApproval ? "Are you sure to Approve?" : "Are you sure to Forward?";
    const successMessage = isReturn  ? "Returned Successfully" : isApproval ? "Approved Successfully" : "Forwarded Successfully";

    const confirm = await AlertConfirmation({
      title: confirmationMessage,
      message: '',
    });
    if (confirm) {
      try {
        const response = await forwardQm(newValue);
        if (response === 200) {
          fetchData();
          setShowModal(false);
          setInitialValues({
            initiatedBy: ""
          })
          Swal.fire({
            icon: "success",
            title: `Quality Manual`,
            text: successMessage,
            showConfirmButton: false,
            timer: 1500
          });
        } else {
          Swal.fire("Error!", "Failed to Forward Quality Manual !", "error");
        }
      } catch (error) {
        console.error("Error Forward Quality Manual:", error);
        Swal.fire("Error!", "There was an issue Forward Quality Manual.", "error");
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
      };
      const confirm = await AlertConfirmation({
        title: "Are you sure to Amend ?",
        message: '',
      });
      if (confirm) {
        try {
          const response = await amendQm(amendedValues);
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
              title: `Quality Manual`,
              text: "Amend SuccessFully ",
              showConfirmButton: false,
              timer: 1500
            });
          } else {
            Swal.fire("Error!", "Failed to Amend Quality Manual !", "error");
          }
        } catch (error) {
          console.error("Error Amend Quality Manual:", error);
          Swal.fire("Error!", "There was an issue Amend Quality Manual.", "error");
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
        const response = await UpdateQMDescription(finalValues);
        if (response > 0) {
          fetchData();
          setshowDescriptionModal(false);
          setDescriptioninitialValues({
            description: "",
          })
          Swal.fire({
            icon: "success",
            title: `Quality Manual`,
            text: "Description Updated SuccessFully ",
            showConfirmButton: false,
            timer: 1500
          });
        } else {
          Swal.fire("Error!", "Failed to Update Quality Manual Description !", "error");
        }
      } catch (error) {
        console.error("Error Update Quality Manual Description :", error);
        Swal.fire("Error!", "There was an issue Update Quality Manual Description.", "error");
      }
    }
  }

  const getReviewLabelText = (statusCode) => {
    if (["INI", "FWD", "RFD", "RTD", "RVM"].includes(statusCode)) {
      return "Review By";
    }
    if (statusCode === "RTM") {
      return "Returned By";
    }
    return "Reviewed By";
  };

  const getApprovalLabelText = (statusCode) => {
    if (["INI", "FWD", "RWD", "RFD", "RTD", "RVM", "RTM"].includes(statusCode)) {
      return "Approve By";
    }
    if (statusCode === "RTD") {
      return "Returned By";
    }
    return "Approved By";
  };
  
  const getPrepareLabel = (statusCode) => {
    if (["INI", "RTM", "RTD", "RVM"].includes(statusCode)) {
      return "Prepare By MR Rep";
    }
    return "Prepared By MR Rep";
  };
  
  return (

    <div className="card">
      <Navbar />
      <div className="card-body">
        <h3>QM - Revision Record </h3>
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
                    <h5 className="modal-title">Quality Manual Forward</h5>
                    <button
                      type="button"
                      className="btn btn-danger modal-header-danger-custom"
                      onClick={() => setShowModal(false)}
                      aria-label="Close"
                    >
                      &times;
                    </button>
                  </div>
                  <div className="modal-body">
                    <Formik
                      initialValues={initialValues}
                      enableReinitialize
                      validationSchema={validationSchema}
                      onSubmit={(values, { setSubmitting }) => {
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
                                    <Autocomplete options={filteredMrRepList} getOptionLabel={option => option.empName + ", " + option.empDesigName}
                                      renderOption={(props, option) => {
                                        return (
                                          <CustomMenuItem {...props} key={option.empId}>
                                            <ListItemText primary={option.empName + ", " + option.empDesigName} />
                                          </CustomMenuItem>
                                        );
                                      }}
                                      value={filteredMrRepList.find(emp => emp.empId === form.values.initiatedBy) || null}
                                      ListboxProps={{ sx: { maxHeight: 200, overflowY: 'auto' } }}
                                      onChange={(event, newValue) => { setFieldValue("initiatedBy", newValue ? newValue.empId : ''); }}
                                      renderInput={(params) => (<TextField {...params} label="Initiated By" size="small" margin="normal" variant="outlined"
                                        error={touched.initiatedBy && Boolean(errors.initiatedBy)}
                                        helperText={touched.initiatedBy && errors.initiatedBy} />)} />
                                  )}
                                </Field>
                              ) : (
                                <div className="row">
                                  <div className="col-md-2" style={{ textAlign: "start" }}>
                                    <span style={{ color: "black", fontSize: "1.2rem", padding: "15px" }}> {["INI", "RTM", "RTD", "RVM"].includes(statusCode) ? "Prepare By" : "Prepared By"}: </span>
                                  </div>
                                  <div className="col-md-8" style={{ textAlign: "start" }}>
                                    <span style={{ color: "blue", fontSize: "1.2rem", padding: "15px" }}>{versionRecordList.length > 0 ? versionRecordList[0].initiatedByEmployee : ""}</span>
                                  </div>
                                  <div className="col-md-2"></div>
                                </div>)}
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
                                    <span style={{ color: "black", fontSize: "1.2rem", padding: "15px" }}>{getReviewLabelText(statusCode)}: </span>
                                  </div>
                                  <div className="col-md-8" style={{ textAlign: "start" }}>
                                    <span style={{ color: "blue", fontSize: "1.2rem", padding: "15px" }}>{versionRecordList.length > 0 ? versionRecordList[0].reviewedByEmployee : ""}</span> </div>
                                </div>
                              }
                              <div className="col-md-2"></div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-12">
                              {statusCode === 'INI' ? (
                                <Field
                                  name="approvedBy"
                                  as={TextField}
                                  label="Approved By"
                                  size="small"
                                  margin="normal"
                                  value={
                                    selEmpData.length > 0
                                      ? `${selEmpData[0].empName}, ${selEmpData[0].empDesigName}`
                                      : ""
                                  }
                                  InputProps={{
                                    inputProps: { maxLength: 100 },
                                    autoComplete: "off",
                                    readOnly: true,
                                  }}
                                  style={{ marginTop: "1rem", width: "100%" }}
                                />) :
                                <div className="row">
                                  <div className="col-md-2" style={{ textAlign: "start" }}>
                                    <span style={{ color: "black", fontSize: "1.2rem", padding: "15px" }}> {getApprovalLabelText(statusCode)}: </span>
                                  </div>
                                  <div className="col-md-8" style={{ textAlign: "start" }}>
                                    <span style={{ color: "blue", fontSize: "1.2rem", padding: "15px" }}>{versionRecordList.length > 0 ? versionRecordList[0].approvedByEmployee : ""}</span> </div>
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
                            {selRoleName && selRoleName.trim() !== 'MR Rep' && statusCode.trim() !== 'INI' ? (<button type="submit" className="btn btn-danger" onClick={() => setFieldValue("action", "R")}>
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
                    <h5 className="modal-title">QM Description Update</h5>
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
                    <h5 className="modal-title">QM Add Version/Release</h5>
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
      </div>
      <AddDocumentSummaryDialog
        open={openDialog2}
        onClose={handleCloseDocSummaryDialog}
        revisionElements={singleDoc}
      // onConfirm={handleDocSummaryConfirm}
      />

      {openMocDialog && (
        <QmAddMappingOfClassesDialog
          open={openMocDialog}
          onClose={handleCloseMocDialog}
          revisionRecordId={singleDoc.revisionRecordId}
        />
      )}
      <div className="col-md-12" style={{ textAlign: "center" }}>
        <b>Approval Flow For Quality Manual</b>
      </div><br />
      {statusCode === 'INI' ?
        (<div className="d-flex align-items-center justify-content-center" style={{ gap: "15px" }}>
          <div style={{ background: "linear-gradient(to top, #3c96f7 10%, transparent 115%)", padding: "10px 20px", textAlign: "center", borderRadius: "5px", }}>
            Prepare By - {filteredMrRepList.length > 0 ? `${filteredMrRepList[0].empName}, ${filteredMrRepList[0].empDesigName}` : ""}
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
          {getPrepareLabel(statusCode)} - {versionRecordList.length > 0 ? versionRecordList[0].initiatedByEmployee : "N/A"}
            {(statusCode === "FWD" || statusCode === "RWD" || statusCode === "APD" || statusCode === "RFD") && (
              <span style={{ marginLeft: "10px", color: "green !important", fontSize: "1.2rem" }}>✔</span>
            )}
          </div>
          <span style={{ fontSize: "1.5rem" }}>→</span>
          <div style={{ background: "linear-gradient(to top, #eb76c3 10%, transparent 115%)", padding: "10px 20px", textAlign: "center", borderRadius: "5px", }}>
          {getReviewLabelText(statusCode)} - {versionRecordList.length > 0 ? versionRecordList[0].reviewedByEmployee : "N/A"}
            {(statusCode === "RWD" || statusCode === "APD") && (
              <span style={{ marginLeft: "10px", color: "green !important", fontSize: "1.2rem" }}>✔</span>
            )}
          </div>
          <span style={{ fontSize: "1.5rem" }}>→</span>
          <div style={{ background: "linear-gradient(to top, #9b999a 10%, transparent 115%)", padding: "10px 20px", textAlign: "center", borderRadius: "5px", }}>
          {getApprovalLabelText(statusCode)} - {versionRecordList.length > 0 ? versionRecordList[0].approvedByEmployee : "N/A"}
            {statusCode === "APD" && (
              <span style={{ marginLeft: "10px", color: "green !important", fontSize: "1.2rem" }}>✔</span>
            )}
          </div>
        </div>)
      }
      <br />
    </div>
  )

}

export default withRouter(QmRevisionRecordsComponent);