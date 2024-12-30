import withRouter from "common/with-router";
import Datatable from "components/datatable/Datatable";
import Navbar from "components/Navbar/Navbar";
import React, { useState, useEffect, useCallback } from 'react';
import { amendQsp, forwardQsp, getLabDetails, getMRList, getMRRepList, getSelectedEmpData, qspDocumentList, qspRevokeSubmit, UpdateQspDescription } from "services/qms.service";
import { format } from "date-fns";
import QspDocPrint from "components/prints/qms/qsp-doc-print";
import QspAddDocContentComponent from "./qsp-add-doc-content/qsp-add-doc-content.component";
import QspDocumentSummaryDialog from "./qsp-document-summary-dialog";
import AlertConfirmation from "common/AlertConfirmation.component";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { Autocomplete, Box, ListItemText, TextField } from "@mui/material";
import { CustomMenuItem } from "services/auth.header";
import * as Yup from 'yup';
import { getUserManagerList } from "services/admin.serive";
import { getEmployee } from "services/audit.service";



const QSPDocumentList = ({ router, docName }) => {
const docType = docName;
const { navigate, location } = router;
const [qspRecordPrintList, setQspRecordPrintList] = useState([]);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState(null);
const [documentName, setDocumentName] = useState('');
const [singleDoc, setSingleDoc] = useState(null);
const [openDialog2, setOpenDialog2] = useState(false);
const [empId, setLoginEmpId] = useState([]);
const [revisionRecordId, setRevisionRecordId] = useState([]);
const [selRoleName, setSelRoleName] = useState([]);
const [statusCode, setStatusCode] = useState([]);
const [showModal, setShowModal] = useState(false);
const [selroleName, setSelroleName] = useState(false);
const [ammendshowModal, setAmmendShowModal] = useState(false);
const [showDescriptionModal, setshowDescriptionModal] = useState(false);
const [selEmpData, setSelectedEmpData] = useState([]);
const [userManagerList, setUserManagerList] = useState([]);
const [filteredMrList, setFilteredMrList] = useState([]);
const [filteredMrRepList, setFilteredMrRepList] = useState([]);
const [newAmendVersion, setNewAmendVersion] = useState("");
const [ammendInitialValues, setAmmendInitialValues] = useState({
  isNewIssue: false,
  currentVersion: "",
  description: "",
});

const [descriptioninitialValues, setDescriptioninitialValues] = useState({
  initiatedBy: "",
  remarks: "",
});;

const [initialValues, setInitialValues] = useState({
  initiatedBy: "",
  remarks: "",
});;

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

useEffect(() => {

      
    if(docType === 'qsp1'){
      setDocumentName('QSP1 - Control of Documents and Records');
    }else if(docType === 'qsp2'){
      setDocumentName('QSP2 - Internal Quality Audit');
    }else if(docType === 'qsp3'){
      setDocumentName('QSP3 - Management Review');
    }else if(docType === 'qsp4'){
      setDocumentName('QSP4 - Non conformity & Corrective Action');
    }else if(docType === 'qsp5'){
      setDocumentName('QSP5 - Quality Objectives and Continual Improvement');
    }else if(docType === 'qsp6'){
      setDocumentName('QSP6 - Analysis of Data & Preventive Action');
    }else if(docType === 'qsp7'){
      setDocumentName('QSP7 - Customer Feedback Analysis');
    }else if(docType === 'qsp8'){
      setDocumentName('QSP8 - Risk management');
    }
      fetchQspRevisionRecordList();

}, [docType]);

const fetchQspRevisionRecordList = async () => {
  try {
    const qspRevisionRecordDetails = await qspDocumentList();
    const filteredDetails = qspRevisionRecordDetails.filter(a => a.docName === docType);
    setQspRecordPrintList(filteredDetails);
    const role = localStorage.getItem('roleId')
    const roleName = localStorage.getItem('roleName')
    const empId = localStorage.getItem('empId')
    const empIdAsNumber = Number(empId);
    setLoginEmpId(empIdAsNumber);
    setSelroleName(roleName);
  const userManagerList = await getUserManagerList();
  setUserManagerList(userManagerList);

  if (filteredDetails && filteredDetails.length > 0) {
    // Assuming the list is sorted by latest first
    const latestRecord = filteredDetails[0];

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
    setInitialValues({
      initiatedBy: filteredMrRepList[0].empId
    })
  }
  
  setSelectedEmpData(selectedEmpData);
  setFilteredMrList(filteredMrList);
  setFilteredMrRepList(filteredMrRepList);
  setStatusCode(filteredDetails.length > 0 ? filteredDetails[0].statusCode : "");
} catch (error) {
  setError('An error occurred');
}

};

  const redirecttoQspDocument = useCallback((element) => {
    navigate('/qsp-add-content', { state: { revisionElements: element } })
  }, [navigate]);

  const getDocPDF = (action, revisionElements) => {
    return <QspDocPrint action={action} revisionElements={revisionElements} />;
  }

  const handleCloseDocSummaryDialog = () => {
    setOpenDialog2(false)
    setSingleDoc(null);
  };

const columns = [
    { name: 'SN', selector: (row) => row.sn, sortable: true, grow: 1, align: 'text-center', width: '5%'  },
    { name: 'Description', selector: (row) => row.description, sortable: true, grow: 2, align: 'text-start', width: '30%'  },
    { name: 'Issue From', selector: (row) => row.from, sortable: true, grow: 2, align: 'text-center', width: '5%'  },
    { name: 'Issue To', selector: (row) => row.to, sortable: true, grow: 2, align: 'text-center', width: '5%'  },
    { name: 'Date Of Revision', selector: (row) => row.issueDate, sortable: true, grow: 2, align: 'text-center', width: '10%'  },
    { name: 'Status', selector: (row) => row.status, sortable: false, grow: 2, align: 'text-center', width: '15%'  },
    { name: 'Action', selector: (row) => row.action, sortable: false, grow: 2, align: 'text-center', width: '20%'  },
  ]

  const getMappedData = () => {
    
    return qspRecordPrintList.map((item, index) => {
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
    
      const canEdit =
        ['INI', 'RTM', 'RTD', 'RVM'].includes(item.statusCode);
    
      const isMRRep = selroleName?.trim() === 'MR Rep';
      const isMR = selroleName?.trim() === 'MR';
      const isDirector = selroleName?.trim() === 'Director';
    
      const actionButtons = (
        <>
          {canEdit && (
            <>
              <button
                className="icon-button edit-icon-button me-1"
                onClick={() => redirecttoQspDocument(item)}
                title="Edit"
              >
                <i className="material-icons">edit_note</i>
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
          {isMRRep && canEdit && (
            <button
              className="icon-button me-1"
              style={{ color: 'green' }}
              title="Forward"
              onClick={() => openModal(item, selroleName)}
            >
              <i className="material-icons">fast_forward</i>
            </button>
          )}
          {isMR && ['FWD', 'RFD'].includes(item.statusCode) && (
            <button
              className="icon-button me-1"
              style={{ color: 'green' }}
              title="Review"
              onClick={() => openModal(item, selroleName)}
            >
              <i className="material-icons">check_circle</i>
            </button>
          )}
          {isDirector && item.statusCode === 'RWD' && (
            <button
              className="icon-button me-1"
              style={{ color: 'green' }}
              title="Approve"
              onClick={() => openModal(item, selroleName)}
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
            (isMRRep || isMR) && (
              <button
                className="icon-button me-1"
                style={{ color: 'red' }}
                title="Revoke"
                onClick={() => RevokeSubmit(item, empId)}
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
          index + 1 < qspRecordPrintList.length
            ? `I${qspRecordPrintList[index + 1].issueNo}-R${qspRecordPrintList[index + 1].revisionNo}`
            : '--',
        to: `I${item.issueNo}-R${item.revisionNo}` || '-',
        issueDate: format(new Date(item.dateOfRevision), 'dd-MM-yyyy') || '-',
        status: (
          <Box className={statusColor} onClick={() => openTran(item)}>
            <Box className="status">
              {item.status}
              <i className="material-icons float-right font-med">
                open_in_new
              </i>
            </Box>
          </Box>
        ),
        action: <div>{actionButtons}</div>,
      };
    });
    
  };


  const openTran = (item) => {
    localStorage.setItem('revisionData', JSON.stringify(item));
    window.open('/qsp-revision-tran', '_blank');
  }
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
        const response = await qspRevokeSubmit(finalValue);
        if (response === 200) {
          fetchQspRevisionRecordList();
          setInitialValues({
            reviewedBy: ""
          })
          Swal.fire({
            icon: "success",
            title: `QSP`,
            text: "Revoked SuccessFully",
            showConfirmButton: false,
            timer: 1500
          });
        } else {
          Swal.fire("Error!", "Failed to Revoke QSP !", "error");
        }
      } catch (error) {
        console.error("Error Revoke QSP :", error);
        Swal.fire("Error!", "There was an issue Revoke QSP.", "error");
      }
    }
  }

  const handleSubmit = async (values) => {
    const approvedBy = selEmpData.length > 0 ? selEmpData[0].empId : "";
    const reviewedBy = filteredMrList.length > 0 ? filteredMrList[0].empId : ""
    var action = values.action;
    if ((action === "R" && (!values.remarks || values.remarks.trim() === "")) || (statusCode === 'RTM' || statusCode === 'RTD' || statusCode === 'RVM') && (!values.remarks || values.remarks.trim() === "")) {
      return Swal.fire("Warning", "Please Enter the Remarks!", "warning");
    }
    const newValue = { ...values, reviewedBy, approvedBy, revisionRecordId, empId };
    var submit = statusCode === 'RWD' ? "Are you sure to Approve ? " : "Are you sure to Forward ? ";
    var textsubmit = statusCode === 'RWD' ? "Approved Successfully " : "Forwarded Successfully  ";
    var title = action === 'R' ? "Are you sure to Return ? " : submit;
    var text = action === 'R' ? "Returned Successfully" : textsubmit;
    const confirm = await AlertConfirmation({
      title: title,
      message: '',
    });
    if (confirm) {
      try {
        const response = await forwardQsp(newValue);
        if (response === 200) {
          fetchQspRevisionRecordList();
          setShowModal(false);
          setInitialValues({
            initiatedBy: ""
          })
          Swal.fire({
            icon: "success",
            title: `QSP`,
            text: text,
            showConfirmButton: false,
            timer: 1500
          });
        } else {
          Swal.fire("Error!", "Failed to Forward QSP !", "error");
        }
      } catch (error) {
        console.error("Error Forward QSP:", error);
        Swal.fire("Error!", "There was an issue Forward QSP.", "error");
      }
    }
  }

  const onchangeIsNewIssue = (event) => {
    if (qspRecordPrintList && qspRecordPrintList.length > 0) {
      const latestRecord = qspRecordPrintList[0]; // Latest record

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

    const latestRecord = qspRecordPrintList[0];
    
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
        docName,
      };

      const confirm = await AlertConfirmation({
        title: "Are you sure to Amend ?",
        message: '',
      });
      if (confirm) {
        try {
          const response = await amendQsp(amendedValues);
          if (response > 0) {
            fetchQspRevisionRecordList();
            setAmmendShowModal(false);
            setAmmendInitialValues({
              isNewIssue: false,
              currentVersion: "",
              description: "",
            })
            Swal.fire({
              icon: "success",
              title: `QSP`,
              text: "Amend SuccessFully ",
              showConfirmButton: false,
              timer: 1500
            });
          } else {
            Swal.fire("Error!", "Failed to Amend QSP !", "error");
          }
        } catch (error) {
          console.error("Error Amend QSP:", error);
          Swal.fire("Error!", "There was an issue Amend QSP.", "error");
        }
      }

    }
  }

  const handleSubmitUpdate = async (values) => {

    const latestRecord = qspRecordPrintList[0];
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
        const response = await UpdateQspDescription(finalValues);
        if (response > 0) {
          fetchQspRevisionRecordList();
          setshowDescriptionModal(false);
          setDescriptioninitialValues({
            description: "",
          })
          Swal.fire({
            icon: "success",
            title: `QSP`,
            text: "Description Updated SuccessFully ",
            showConfirmButton: false,
            timer: 1500
          });
        } else {
          Swal.fire("Error!", "Failed to Update QSP Description !", "error");
        }
      } catch (error) {
        console.error("Error Update QSP Description :", error);
        Swal.fire("Error!", "There was an issue Update QSP Description.", "error");
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
  

    return(
        <div className="card">
            <Navbar></Navbar>
            <div className="card-body">
                <div className="row">
                    <div className="col-md-12 text-center">
                       <h3>{documentName} - Revision Record</h3>
                    </div>
                </div>
                <br />
                <div id="card-body customized-card">
                {isLoading ? (
                    <h3>Loading...</h3>
                ) : error ? (
                    <h3 color="error">{error}</h3>
                ) : (
                    <Datatable columns={columns}  data={getMappedData()}/>
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
                    <h5 className="modal-title">QSP Manual Forward</h5>
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
                                    <span style={{ color: "black", fontSize: "1.2rem", padding: "15px" }}>{["INI", "RTM", "RTD", "RVM"].includes(statusCode) ? "Prepare By" : "Prepared By"}: </span>
                                  </div>
                                  <div className="col-md-8" style={{ textAlign: "start" }}>
                                    <span style={{ color: "blue", fontSize: "1.2rem", padding: "15px" }}>{qspRecordPrintList.length > 0 ? qspRecordPrintList[0].initiatedByEmployee : ""}</span>
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
                                    <span style={{ color: "black", fontSize: "1.2rem", padding: "15px" }}> {getReviewLabelText(statusCode)}:</span>
                                  </div>
                                  <div className="col-md-8" style={{ textAlign: "start" }}>
                                    <span style={{ color: "blue", fontSize: "1.2rem", padding: "15px" }}>{qspRecordPrintList.length > 0 ? qspRecordPrintList[0].reviewedByEmployee : ""}</span> </div>
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
                                    <span style={{ color: "black", fontSize: "1.2rem", padding: "15px" }}>{getApprovalLabelText(statusCode)}: </span>
                                  </div>
                                  <div className="col-md-8" style={{ textAlign: "start" }}>
                                    <span style={{ color: "blue", fontSize: "1.2rem", padding: "15px" }}>{qspRecordPrintList.length > 0 ? qspRecordPrintList[0].approvedByEmployee : ""}</span> </div>
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
        )}<br/>
        {ammendshowModal && (
                  <>
                    {/* Backdrop */}
                    <div className="modal-backdrop show" style={{ zIndex: 1040 }}></div>
                    <div className="modal fade show" style={{ display: "block" }}>
                      <div className="modal-dialog modal-lg modal-lg-custom" style={{ maxWidth: "60%", width: "60%" }}>
                        <div className="modal-content modal-content-custom">
                          <div className="modal-header bg-secondary text-white modal-header-custom d-flex justify-content-between">
                            <h5 className="modal-title">QSP Add Version/Release</h5>
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
                                              disabled={!qspRecordPrintList || qspRecordPrintList.length === 0}
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
            <QspDocumentSummaryDialog
              open={openDialog2}
              onClose={handleCloseDocSummaryDialog}
              revisionElements={singleDoc}
            />

<div className="col-md-12" style={{ textAlign: "center" }}>
        <b>Approval Flow For QSP</b>
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
          {getPrepareLabel(statusCode)} - {qspRecordPrintList.length > 0 ? qspRecordPrintList[0].initiatedByEmployee : "N/A"}
            {(statusCode === "FWD" || statusCode === "RWD" || statusCode === "APD" || statusCode === "RFD") && (
              <span style={{ marginLeft: "10px", color: "green !important", fontSize: "1.2rem" }}>✔</span>
            )}
          </div>
          <span style={{ fontSize: "1.5rem" }}>→</span>
          <div style={{ background: "linear-gradient(to top, #eb76c3 10%, transparent 115%)", padding: "10px 20px", textAlign: "center", borderRadius: "5px", }}>
          {getReviewLabelText(statusCode)} - {qspRecordPrintList.length > 0 ? qspRecordPrintList[0].reviewedByEmployee : "N/A"}
            {(statusCode === "RWD" || statusCode === "APD") && (
              <span style={{ marginLeft: "10px", color: "green !important", fontSize: "1.2rem" }}>✔</span>
            )}
          </div>
          <span style={{ fontSize: "1.5rem" }}>→</span>
          <div style={{ background: "linear-gradient(to top, #9b999a 10%, transparent 115%)", padding: "10px 20px", textAlign: "center", borderRadius: "5px", }}>
          {getApprovalLabelText(statusCode)} - {qspRecordPrintList.length > 0 ? qspRecordPrintList[0].approvedByEmployee : "N/A"}
            {statusCode === "APD" && (
              <span style={{ marginLeft: "10px", color: "green !important", fontSize: "1.2rem" }}>✔</span>
            )}
          </div>
        </div>)
      }
      <br/>
        </div>
        
    )
}
export default withRouter(QSPDocumentList);