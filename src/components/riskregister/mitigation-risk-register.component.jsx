import React, { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import Datatable from "../datatable/Datatable";
import withRouter from "common/with-router";
import { Field, Form, Formik } from "formik";
import * as Yup from 'yup';
import { Autocomplete, ListItemText, TextField } from "@mui/material";
import { CustomMenuItem } from "services/auth.header";
import AlertConfirmation from "common/AlertConfirmation.component";
import { insertMitigationRiskRegister, mitigationRiskRegisterList } from "services/risk.service";

const MitigationRiskRegisterComponent = ({router }) =>{

    const { navigate, location } = router
    const { riskRegisterData } = location.state || {};
    const [average, setAverage] = useState(0);
    const [riskNo, setRiskNo] = useState(0);
    const [mitigationRiskRegisteredList,setMitigationRiskRegisteredList] = useState([]);
    const [tblMitigationRiskData, setTblMitigationRiskData] = useState([]);
    const [actionValue, setActionValue] = useState("S");

    const [initialValues, setInitialValues] = useState({
      probability: "",
      mitigationApproach: "",
      technicalPerformance: "",
      time: "",
      cost: "",
    });

    useEffect(() => {
      fetchData();
    }, [riskRegisterData.riskRegisterId]);

    const columns = [
        { name: 'SN', selector: (row) => row.sn, sortable: true, grow: 1, align: 'text-center',width: '5%' },
        { name: 'Mitigation Approach', selector: (row) => row.mitigationApproach, sortable: true, grow: 2, align: 'text-start',width: '25%' },
        { name: 'Revision No', selector: (row) => row.revisionNo, sortable: true, grow: 2, align: 'text-center',width: '5%'},
        { name: 'Doc Type', selector: (row) => row.docType, sortable: true, grow: 2, align: 'text-center',width: '5%' },
        { name: 'Probability', selector: (row) => row.probability, sortable: true, grow: 2, align: 'text-center',width: '5%' },
        { name: 'TP', selector: (row) => row.technicalPerformance, sortable: true, grow: 2, align: 'text-center',width: '5%',bgColor : 'lightgrey' },
        { name: 'Time', selector: (row) => row.time, sortable: true, grow: 2, align: 'text-center',width: '5%',bgColor : 'lightgrey' },
        { name: 'Cost', selector: (row) => row.cost, sortable: true, grow: 2, align: 'text-center', width: '5%',bgColor : 'lightgrey'},
        { name: 'Average', selector: (row) => row.average, sortable: true, grow: 2, align: 'text-center',width: '5%',bgColor : 'lightgrey' },
        { name: 'Risk No', selector: (row) => row.riskNo, sortable: true, grow: 2, align: 'text-center',width: '5%' ,bgColor: (row) => getBackgroundColorForRiskNo(row.riskNo)},
       
    ];

    const getBackgroundColorForRiskNo = (riskNo) => {
      if (riskNo >= 1 && riskNo <= 4) {
          return 'green'; // Green for riskNo 1-4
      } else if (riskNo > 4 && riskNo <= 10) {
          return 'yellow'; // Yellow for riskNo 5-10
      } else if (riskNo > 10 && riskNo <= 20) {
          return 'red'; // Red for riskNo 11-20
      }
      return 'inherit'; // Default background color if not in the ranges
  };
    const validationSchema = Yup.object().shape({
      mitigationApproach: Yup.string().required("Mitigation Approach required"),
      technicalPerformance: Yup.number().required("Technical Performance required").min(1, "Must be at least 1"),
      time: Yup.number().required("Time required").min(1, "Must be at least 1"),
      cost: Yup.number().required("Cost required").min(1, "Must be at least 1"),
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

      const fetchData = async () => {
        try {
          const mitigationRiskList = await mitigationRiskRegisterList(riskRegisterData.riskRegisterId);
          setMitigationRiskRegisteredList(mitigationRiskList || []);
          mappedData(mitigationRiskList || []);
          
          if (mitigationRiskList && mitigationRiskList.length > 0) {
            const firstRow = mitigationRiskList[0];
            const newInitialValues = {
              mitigationApproach: firstRow.mitigationApproach || "",
              technicalPerformance: firstRow.technicalPerformance || "",
              time: firstRow.time || "",
              cost: firstRow.cost || "",
              probability: firstRow.probability || "",
            };
            setInitialValues(newInitialValues);
      
            // Trigger updateCalculations with the latest row values
            updateCalculations(newInitialValues);
          }
        } catch (error) {
          console.error("Error fetching mitigation risk data:", error);
          setMitigationRiskRegisteredList([]);
          setTblMitigationRiskData([]);
        }
      };
      
      
      
      const mappedData = (list) => {
        setTblMitigationRiskData(
          list.map((item, index) => ({
            sn: index + 1,
            mitigationApproach:item.mitigationApproach || "-",
            revisionNo: item.revisionNo || "0",
            docType: riskRegisterData.docType.toUpperCase() || "-",
            probability: item.probability || "-",
            technicalPerformance: item.technicalPerformance || "-",
            time: item.time || "-",
            cost: item.cost || "-",
            average: item.average || "-",
            riskNo: item.riskNo || "-"
          }))
        );
      };
      const handleSubmit = async (values, actionValue) => {
        let Title = "";
        let successMessage = "";
        let unsuccessMessage = "";
        switch (actionValue) {
          case "S":
            Title = "Are you sure to Add?";
            successMessage = "Mitigated Risk Added Successfully!";
            unsuccessMessage = "Failed to Add Mitigated Risk!";
            break;
          case "U":
            Title = "Are you sure to Update?";
            successMessage = "Mitigated Risk Updated Successfully!";
            unsuccessMessage = "Failed to Update Mitigated Risk!";
            break;
          case "R":
            Title = "Are you sure to Revise?";
            successMessage = "Mitigated Risk Revised Successfully!";
            unsuccessMessage = "Failed to Revise Mitigated Risk!";
            break;
          default:
            Title = "Are you sure?";
            successMessage = "Operation Successful!";
            unsuccessMessage = "Operation Unsuccessful!";
            break;
        }
        const firstRow = mitigationRiskRegisteredList[0];
        const newValue = {
          ...values,
          action: actionValue, 
          average: parseFloat(average), // Ensure average is a number
          riskNo: parseFloat(riskNo),
          riskRegisterId: riskRegisterData.riskRegisterId, 
          ...(firstRow && { mitigationRiskRegisterId: firstRow.mitigationRiskRegisterId }),
        };
        const confirm = await AlertConfirmation({
          title: Title,
          message: '',
        });
    
        // if (!confirm.isConfirmed) return;
        if (confirm) {
          try {
            const result = await insertMitigationRiskRegister(newValue);
            if (result === 200) {
              await fetchData(); // Ensure data is refreshed before setting initialValues
              Swal.fire({
                icon: "success",
                title: '',
                text: `${successMessage} for ${riskRegisterData.docType.toUpperCase()+ ' - ' + riskRegisterData.divisionCode} `,
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

      const isListEmpty = mitigationRiskRegisteredList.length === 0;
    return (
        <div>
        <Navbar />
          <div className="card">
            <div className="card-body text-center">
                  <h3>{riskRegisterData.docType.toUpperCase()} - {riskRegisterData.divisionCode} : Mitigation Risk Register</h3><br/>
                  <div className="row">
                    <div className="col-md-12" style={{ textAlign: 'start',color:'blue' }}>
                    <span style={{color:'black',fontWeight: 'bold'}}>Risk Description :</span> {riskRegisterData.riskDescription}
                    </div>
                  </div><br/>
                  <Formik initialValues={initialValues} enableReinitialize validationSchema={validationSchema}  onSubmit={(values) => {handleSubmit(values, actionValue);}}>
                                          {({ values, errors, touched, setFieldValue, setFieldTouched, submitForm  }) => (
                                            <Form> <div className="row">
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
                                                          <TextField {...params} label="Probability" size="small" fullWidth variant="outlined" margin="normal" />
                                                        )}
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
                                                          <TextField {...params} label="Technical Performance" size="small" fullWidth variant="outlined" margin="normal" />
                                                        )}
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
                                                        ListboxProps={{ sx: { maxHeight: 200, overflowY: "auto" } }}
                                                      />
                                                    )}
                                                  </Field>
                                                </div>
                                                <div className="col-md-2">
                                                  <Field name="cost">
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
                                          {isListEmpty ? (
                                            <>
                                              <button type="submit" className="btn submit"  onClick={() => { setActionValue("S"); submitForm(); }}>Submit</button>
                                              <button type="button" className="btn back" onClick={goBack}>Back</button>
                                            </>
                                          ) : (
                                            <>
                                              <button type="submit" className="btn edit" onClick={() => { setActionValue("U"); submitForm(); }}>Update</button>
                                              <button type="submit" className="btn revise" onClick={() =>{ setActionValue("R"); submitForm();}}>Revise</button>
                                              <button type="button" className="btn back" onClick={goBack}>Back</button>
                                            </>
                                          )}
                                        </div>
                                            </Form>
                                          )}
                                        </Formik>
                  <div id="card-body customized-card">
                            <Datatable columns={columns} data={tblMitigationRiskData}/>
                  </div>
              <div>
          </div>
          </div>
          </div>
          </div>
     );
}

export default withRouter(MitigationRiskRegisterComponent);