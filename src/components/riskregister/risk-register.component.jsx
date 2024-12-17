import React, { useCallback, useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import Datatable from "../datatable/Datatable";
import { Field, Formik, Form } from "formik";
import * as Yup from 'yup';
import AlertConfirmation from "../../common/AlertConfirmation.component";
import { Autocomplete, ListItemText, TextField } from "@mui/material";
import withRouter from "common/with-router";
import { CustomMenuItem } from "services/auth.header";
import { getRiskRegisterList, insertRiskRegister } from "services/risk.service";


const RiskRegisterComponent = ({ router }) => {

  const { navigate, location } = router
  const [showModal, setShowModal] = useState(false);
  const { revisionElements } = location.state || {};
  const [average, setAverage] = useState(0);
  const [riskNo, setRiskNo] = useState(0);
  const [tblriskRegisterList, setTblRiskRegisterList] = useState([]);
  const [actionFrom, setActionFrom]=useState([]);

 
  var data1 = revisionElements.divisionMasterDto;
  const [initialValues, setInitialValues] = useState({
    riskDescription: "",
    technicalPerformance: "",
    time: "",
    cost: "",
  });

  const validationSchema = Yup.object().shape({
    riskDescription: Yup.string().required("Risk Description required"),
    technicalPerformance: Yup.string().required("Technical Performance required"),
    time: Yup.string().required("Time required"),
    cost: Yup.string().required("Cost required"),
  });


  const columns = [
    { name: 'SN', selector: (row) => row.sn, sortable: true, grow: 1, align: 'text-center',width: '50px', },
    { name: 'Risk Description', selector: (row) => row.riskDescription, sortable: true, grow: 2, align: 'text-start',width: '350px', },
    { name: 'Probability', selector: (row) => row.probability, sortable: true, grow: 2, align: 'text-center',width: '50px', },
    { name: 'TP', selector: (row) => row.technicalPerformance, sortable: true, grow: 2, align: 'text-center',width: '50px', },
    { name: 'Time', selector: (row) => row.time, sortable: true, grow: 2, align: 'text-center',width: '50px', },
    { name: 'Cost', selector: (row) => row.cost, sortable: true, grow: 2, align: 'text-center',width: '50px', },
    { name: 'Average', selector: (row) => row.average, sortable: true, grow: 2, align: 'text-center',width: '50px', },
    { name: 'Risk No', selector: (row) => row.riskNo, sortable: true, grow: 2, align: 'text-center',width: '50px', },
    { name: 'Action', selector: (row) => row.action, sortable: true, grow: 2, align: 'text-center',width: '150px', },
  ];

  useEffect(() => {
    riskRegister();
  }, []);

  const riskRegister = async () => {
    try {
      const riskregisterlist = await getRiskRegisterList(revisionElements.revisionRecordId);
      setTableData(riskregisterlist);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {

    }
  };

  const setTableData = (list) => {
    const mappedData = list.map((item, index) => ({
      sn: index + 1,
      riskDescription: item.riskDescription || '-',
      probability: item.probability || '-',
      technicalPerformance: item.technicalPerformance || '-',
      time: item.time || '-',
      cost: item.cost || '-',
      average: item.average || '-',
      riskNo: item.riskNo || '-',
      action: (
        <><button className=" btn btn-outline-warning btn-sm me-1" onClick={() => editRiskRegister(item)} title="Edit"> <i className="material-icons"  >edit_note</i></button>
        <button className=" btn btn-outline-warning btn-sm me-1" onClick={() => AddSubRiskRegister(item)} title="Add"> <i className="material-icons"  >add</i></button>
        </>
      ),
    }));
    setTblRiskRegisterList(mappedData);
  }

  const AddSubRiskRegister = useCallback((element) => {
    navigate('/mitigation-risk-register', { state: { riskRegisterData: element } })
  }, [navigate]);


  const editRiskRegister = async (item) => {
    setShowModal(true);
    setInitialValues({
      ...item,
  });
  updateCalculations(item);
  setActionFrom('Edit');
  }
  const handleSubmit = async (values) => {
    const isEditMode = Boolean(values.riskRegisterId);
    const successMessage = isEditMode ? "Risk Updated Successfully!" : " Risk Added Successfully ";
    const unsuccessMessage = isEditMode ? "Risk Update Unsuccessful!" : " Risk Add Unsuccessful ";
    const Title = isEditMode ? "Are you sure to Update ?" : "Are you sure to Add ?";
    const from= isEditMode ? "Edit" : "Add" ;
    setActionFrom(from);
    const newValue = {
      ...values,
      average: parseFloat(average), // Ensure average is a number
      riskNo: parseFloat(riskNo),
      revisionRecordId: revisionElements.revisionRecordId,  // Ensure riskNo is a number
    };
    const confirm = await AlertConfirmation({
      title: Title,
      message: '',
    });

    // if (!confirm.isConfirmed) return;
    if (confirm) {
      try {
        const result = await insertRiskRegister(newValue);
        if (result === 200) {
          riskRegister();
          setShowModal(false);
          setInitialValues({
            riskDescription: "",
            technicalPerformance: "",
            time: "",
            cost: "",
            average: "",
            riskNo: "",
          });
          setAverage(0);
          setRiskNo(0);
          Swal.fire({
            icon: "success",
            title: '',
            text: `${successMessage} for ${revisionElements.docType.toUpperCase() + ' - ' + data1.divisionCode} `,
            showConfirmButton: false,
            timer: 2500
          });
        } else {
          Swal.fire({
            icon: "error",
            title: unsuccessMessage,
            showConfirmButton: false,
            timer: 2500
          });
        }
      } catch (error) {
        console.error('Error Adding Risk :', error);
        Swal.fire('Error!', 'There was an issue inserting Risk Register.', 'error');
      }
    }
  };

  const updateCalculations = (values) => {
    // Convert string values to numbers using `Number` or parseFloat
    const technicalPerformance = Number(values.technicalPerformance) || 0;
    const time = Number(values.time) || 0;
    const cost = Number(values.cost) || 0;
    const probability = Number(values.probability) || 0;

    const sum = technicalPerformance + time + cost;
    const average = (sum / 3).toFixed(2); // Round to 2 decimal places
    const riskNo = (probability * average).toFixed(2);

    // Update the form values with calculated results
    if (technicalPerformance !== 0 && time !== 0 && cost !== 0) {
      setAverage(average);
      setRiskNo(riskNo);
    }
  };

  const togglemodal = () =>{
    setShowModal(true);
    setInitialValues({
      riskDescription: "",
      technicalPerformance: "",
      time: "",
      cost: "",
      average: "",
      riskNo: "",
    });
    setAverage(0);
    setRiskNo(0);
    setActionFrom('Add');
  }

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div>
      <Navbar />
      <div className="card">
        <div className="card-body text-center">
          <h3>{revisionElements.docType.toUpperCase() + '-' + data1.divisionCode} : Risk Register</h3>
          <div id="card-body customized-card">
            <Datatable columns={columns} data={tblriskRegisterList} />
          </div>
          <div>
            <button className="btn add btn-name" onClick={() => togglemodal()}>
              Add
            </button>
            <button className="btn back "  onClick={goBack}>
              Back
            </button>
          </div>
          {showModal && (
            <>
              {/* Backdrop */}
              <div className="modal-backdrop show" style={{ zIndex: 1040 }}></div>
              <div className="modal fade show" style={{ display: "block" }}>
                <div className="modal-dialog modal-lg modal-lg-custom" style={{ maxWidth: "50%", width: "50%" }}>
                  <div className="modal-content modal-content-custom" >
                    <div className="modal-header bg-secondary d-flex justify-content-between text-white modal-header-custom">
                      <h5 className="modal-title">Risk Register</h5>
                      <button type="button" className="btn btn-danger modal-header-danger-custom" onClick={() => setShowModal(false)}>
                        &times;
                      </button>
                    </div>
                    <div className="modal-body">
                      <Formik initialValues={initialValues} enableReinitialize validationSchema={validationSchema} onSubmit={handleSubmit}>
                        {({ values, errors, touched, setFieldValue, setFieldTouched }) => (
                          <Form> 
                          <div className="row">
                          <div className="col-md-12">
                            <Field name="riskDescription">
                              {({ field, form }) => (
                                <TextField
                                  {...field}
                                  label="Risk Description"
                                  multiline
                                  minRows={3}
                                  placeholder="Risk Description"
                                  size="small"
                                  error={Boolean(form.errors.riskDescription && form.touched.riskDescription)}
                                  helperText={form.touched.riskDescription && form.errors.riskDescription}
                                  fullWidth
                                  InputProps={{
                                    inputProps: { maxLength: 990 },
                                    autoComplete: "off"
                                  }}
                                />
                              )}
                            </Field>
                          </div>
                        </div><br />
                            <div className="row">
                              <div className="col-md-2">
                                <Field name="probability">
                                  {({ field }) => (
                                    <Autocomplete
                                      options={[1, 2, 3, 4, 5]}
                                      getOptionLabel={(option) => option.toString()}
                                      renderOption={(props, option) => (
                                        <CustomMenuItem {...props} key={option}>
                                          <ListItemText primary={option} />
                                        </CustomMenuItem>
                                      )}
                                      value={values.probability}
                                      onChange={(event, newValue) => {
                                        setFieldValue("probability", newValue !== undefined ? newValue : 1);
                                        updateCalculations({ ...values, probability: newValue });
                                      }}
                                      onBlur={() => setFieldTouched("probability", true)}
                                      renderInput={(params) => (
                                        <TextField {...params} label="Prob" size="small" fullWidth variant="outlined" margin="normal" />
                                      )}
                                      disableClearable
                                      ListboxProps={{ sx: { maxHeight: 200, overflowY: "auto" } }}
                                    />
                                  )}
                                </Field>
                              </div>
                              <div className="col-md-2">
                                <Field name="technicalPerformance">
                                  {({ field }) => (
                                    <Autocomplete
                                      options={[1, 2, 3, 4, 5]}
                                      getOptionLabel={(option) => option.toString()}
                                      renderOption={(props, option) => (
                                        <CustomMenuItem {...props} key={option}>
                                          <ListItemText primary={option} />
                                        </CustomMenuItem>
                                      )}
                                      value={values.technicalPerformance}
                                      onChange={(event, newValue) => {
                                        setFieldValue("technicalPerformance", newValue !== undefined ? newValue : 1);
                                        updateCalculations({ ...values, technicalPerformance: newValue });
                                      }}
                                      onBlur={() => setFieldTouched("technicalPerformance", true)}
                                      renderInput={(params) => (
                                        <TextField {...params} label="TP" size="small" fullWidth variant="outlined" margin="normal" />
                                      )}
                                      disableClearable
                                      ListboxProps={{ sx: { maxHeight: 200, overflowY: "auto" } }}
                                    />
                                  )}
                                </Field>
                              </div>
                              <div className="col-md-2">
                                <Field name="time">
                                  {({ field }) => (
                                    <Autocomplete
                                      options={[1, 2, 3, 4, 5]}
                                      getOptionLabel={(option) => option.toString()}
                                      renderOption={(props, option) => (
                                        <CustomMenuItem {...props} key={option}>
                                          <ListItemText primary={option} />
                                        </CustomMenuItem>
                                      )}
                                      value={values.time}
                                      onChange={(event, newValue) => {
                                        setFieldValue("time", newValue !== undefined ? newValue : 1);
                                        updateCalculations({ ...values, time: newValue });
                                      }}
                                      onBlur={() => setFieldTouched("time", true)}
                                      renderInput={(params) => (
                                        <TextField {...params} label="Time" size="small" fullWidth variant="outlined" margin="normal" />
                                      )}
                                      disableClearable
                                      ListboxProps={{ sx: { maxHeight: 200, overflowY: "auto" } }}
                                    />
                                  )}
                                </Field>
                              </div>
                              <div className="col-md-2">
                                <Field name="time">
                                  {({ field }) => (
                                    <Autocomplete
                                      options={[1, 2, 3, 4, 5]}
                                      getOptionLabel={(option) => option.toString()}
                                      renderOption={(props, option) => (
                                        <CustomMenuItem {...props} key={option}>
                                          <ListItemText primary={option} />
                                        </CustomMenuItem>
                                      )}
                                      value={values.cost}
                                      onChange={(event, newValue) => {
                                        setFieldValue("cost", newValue !== undefined ? newValue : 1);
                                        updateCalculations({ ...values, cost: newValue });
                                      }}
                                      onBlur={() => setFieldTouched("cost", true)}
                                      renderInput={(params) => (
                                        <TextField {...params} label="Cost" size="small" fullWidth variant="outlined" margin="normal" />
                                      )}
                                      disableClearable
                                      ListboxProps={{ sx: { maxHeight: 200, overflowY: "auto" } }}
                                    />
                                  )}
                                </Field>
                              </div>
                              <div className="col-md-2">
                                <Field name="average">
                                  {({ field }) => (
                                    <TextField
                                      {...field}
                                      label="Average"
                                      size="small"
                                      type="number"
                                      margin="normal"
                                      value={average || 0} // This value is dynamically updated
                                      error={Boolean(touched.average && errors.average)}
                                      helperText={touched.average && errors.average}
                                      InputProps={{
                                        inputProps: { maxLength: 49 },
                                        autoComplete: "off",
                                      }}
                                      style={{ width: "100%" }}
                                    />
                                  )}
                                </Field>
                              </div>
                              <div className="col-md-2">
                                <Field name="riskNo">
                                  {({ field }) => (
                                    <TextField
                                      {...field}
                                      label="Risk No"
                                      size="small"
                                      type="number"
                                      margin="normal"
                                      value={riskNo || 0} // This value is dynamically updated
                                      error={Boolean(touched.riskNo && errors.riskNo)}
                                      helperText={touched.riskNo && errors.riskNo}
                                      InputProps={{
                                        inputProps: { maxLength: 49 },
                                        autoComplete: "off",
                                      }}
                                      style={{ width: "100%" }}
                                    />
                                  )}
                                </Field>
                              </div>
                            </div>
                            <br />
                            <div className="col text-center ">
                            {actionFrom === "Add" ? <button type="submit" className="btn btn-success">Submit</button> : <button type="submit" className="btn edit">Update</button>}
                            </div><br/>
                            <div className="row text-start">
                                  <span style={{ color: 'red' }}>Note  :  Prob - Probability , TP - Technical Performance</span>
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
      </div>
    </div>
  );

}
export default withRouter(RiskRegisterComponent);