import React, { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import Datatable from "../datatable/Datatable";
import withRouter from "common/with-router";
import { Field, Form, Formik } from "formik";
import * as Yup from 'yup';
import { Autocomplete, ListItemText, TextField } from "@mui/material";
import { CustomMenuItem } from "services/auth.header";
import AlertConfirmation from "common/AlertConfirmation.component";

const MitigationRiskRegisterComponent = ({router }) =>{

    const { navigate, location } = router
    const { riskRegisterData } = location.state || {};
     const [average, setAverage] = useState(0);
      const [riskNo, setRiskNo] = useState(0);

    const [initialValues, setInitialValues] = useState({
        mitigationApproach: "",
        technicalPerformance: "",
        time: "",
        cost: "",
      });


    useEffect (() =>{

    },[]);

    const columns = [
        { name: 'SN', selector: (row) => row.sn, sortable: true, grow: 1, align: 'text-center' },
        { name: 'Doc Type', selector: (row) => row.docType, sortable: true, grow: 2, align: 'text-center', },
        { name: 'Probability', selector: (row) => row.probability, sortable: true, grow: 2, align: 'text-center' },
        { name: 'TP', selector: (row) => row.technicalPerformance, sortable: true, grow: 2, align: 'text-center', },
        { name: 'Time', selector: (row) => row.time, sortable: true, grow: 2, align: 'text-center', },
        { name: 'Cost', selector: (row) => row.cost, sortable: true, grow: 2, align: 'text-center', },
        { name: 'Average', selector: (row) => row.average, sortable: true, grow: 2, align: 'text-center', },
        { name: 'Risk No', selector: (row) => row.riskNo, sortable: true, grow: 2, align: 'text-center', },
        { name: 'Mitigation Approach', selector: (row) => row.mitigationApproach, sortable: true, grow: 2, align: 'text-start' },
        { name: 'Action', selector: (row) => row.action, sortable: true, grow: 2, align: 'text-center', },
    ];

     const validationSchema = Yup.object().shape({
        mitigationApproach: Yup.string().required("Mitigation Approach required"),
        technicalPerformance: Yup.string().required("Technical Performance required"),
        time: Yup.string().required("Time required"),
        cost: Yup.string().required("Cost required"),
      });

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

      const handleSubmit = async (values) => {
        const successMessage = "Mitigated Risk Added Successfully ";
        const unsuccessMessage = "Mitigated Risk Add Unsuccessful ";
        const Title = "Are you sure to Add ?";
        const newValue = {
          ...values,
          average: parseFloat(average), // Ensure average is a number
          riskNo: parseFloat(riskNo),
          riskRegisterId: riskRegisterData.riskRegisterId, 
        };
        const confirm = await AlertConfirmation({
          title: Title,
          message: '',
        });
    
        // if (!confirm.isConfirmed) return;
        if (confirm) {
          try {
            const result = "";
            if (result === 200) {
              //riskRegister();
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
                text: `${successMessage} for ${riskRegisterData.docType.toUpperCase()} `,
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

      const goBack = () => {
        navigate(-1);
      };

    return (
        <div>
        <Navbar />
          <div className="card">
            <div className="card-body text-center">
                  <h3>{riskRegisterData.docType.toUpperCase()} : Mitigation Risk Register</h3><br/>
                  <div className="row">
                    <div className="col-md-2"> 
                       <strong>Risk Description : </strong> 
                    </div>

                    <div className="col-md-10" style={{ textAlign: 'start', fontWeight: 'bold' }}>
                        {riskRegisterData.riskDescription}
                    </div>
                  </div>
                  <Formik initialValues={initialValues} enableReinitialize validationSchema={validationSchema} onSubmit={handleSubmit}>
                                          {({ values, errors, touched, setFieldValue, setFieldTouched }) => (
                                            <Form>
                                              <div className="row">
                                                <div className="col-md-3">
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
                                                          <TextField {...params} label="Probability" size="small" fullWidth variant="outlined" margin="normal" />
                                                        )}
                                                        ListboxProps={{ sx: { maxHeight: 200, overflowY: "auto" } }}
                                                      />
                                                    )}
                                                  </Field>
                  
                                                </div>
                                                <div className="col-md-3">
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
                                                          <TextField {...params} label="technicalPerformance" size="small" fullWidth variant="outlined" margin="normal" />
                                                        )}
                                                        ListboxProps={{ sx: { maxHeight: 200, overflowY: "auto" } }}
                                                      />
                                                    )}
                                                  </Field>
                                                </div>
                                                <div className="col-md-3">
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
                                                          <TextField {...params} label="time" size="small" fullWidth variant="outlined" margin="normal" />
                                                        )}
                                                        ListboxProps={{ sx: { maxHeight: 200, overflowY: "auto" } }}
                                                      />
                                                    )}
                                                  </Field>
                                                </div>
                                                <div className="col-md-3">
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
                                                          <TextField {...params} label="cost" size="small" fullWidth variant="outlined" margin="normal" />
                                                        )}
                                                        ListboxProps={{ sx: { maxHeight: 200, overflowY: "auto" } }}
                                                      />
                                                    )}
                                                  </Field>
                                                </div>
                                              </div><br />
                                              <div className="row">
                                                <div className="col-md-6">
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
                                                        style={{ marginTop: "0rem", width: "100%" }}
                                                      />
                                                    )}
                                                  </Field>
                                                </div>
                                                <div className="col-md-6">
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
                                                        style={{ marginTop: "0rem", width: "100%" }}
                                                      />
                                                    )}
                                                  </Field>
                                                </div>
                                              </div>
                                              <br />
                                              <div className="row">
                                                <div className="col-md-12">
                                                  <Field name="mitigationApproach">
                                                    {({ field, form }) => (
                                                      <TextField
                                                        {...field}
                                                        label="Mitigation Approach"
                                                        multiline
                                                        minRows={3}
                                                        placeholder="Mitigation Approach"
                                                        size="small"
                                                        error={Boolean(form.errors.mitigationApproach && form.touched.mitigationApproach)}
                                                        helperText={form.touched.mitigationApproach && form.errors.mitigationApproach}
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
                                              <div className="col text-center ">
                                                <button type="submit" className="btn btn-success">
                                                  Submit
                                                </button>
                                                <button className="btn back "  onClick={goBack}>
                                                    Back
                                                </button>
                                              </div>
                                            </Form>
                                          )}
                                        </Formik>
                  <div id="card-body customized-card">
                            <Datatable columns={columns} data={''}/>
                  </div>
              <div>
          </div>
          </div>
          </div>
          </div>
     );
}

export default withRouter(MitigationRiskRegisterComponent);