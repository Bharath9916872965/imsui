import React from 'react';
import { Box, Button, TextField,Autocomplete, ListItemText,Grid,DialogContent } from '@mui/material';
import { insertKpi,updateKpi } from "services/kpi.service";
import './Login.css';
import { Field, Formik, Form  } from "formik";
import * as Yup from "yup";
import AlertConfirmation from "common/AlertConfirmation.component";
import { CustomMenuItem } from "services/auth.header";

const KpiratingDialog = ({ open, onClose, onConfirm,isAddMode,kpiUnitList,grpDivId,initialValues,grpDivName,flag,grpDivType }) => {
  const handleClose = () => {
    if (onClose) onClose();
  };

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
  };

  const validationSchema = Yup.object({
    objective : Yup.string().required("Objective is required").min(3,'Objective must be at least 3 characters').max(990,'Objective must not exceed 990 characters')
    .test("no-trailing-space", "Objective cannot end with a space", (value) => !/\s$/.test(value))
    .test( "no-leading-space","Objective cannot start with a space",(value) => !/^\s/.test(value)),
    metrics   : Yup.string().required("Metrics is required").min(3,'Metrics must be at least 3 characters').max(990,'Metrics must not exceed 990 characters')
    .test("no-trailing-space", "Metrics cannot end with a space", (value) => !/\s$/.test(value))
    .test( "no-leading-space","Metricsr cannot start with a space",(value) => !/^\s/.test(value)),
    norms     : Yup.string().required("Norms is required").min(3,'Norms must be at least 3 characters').max(990,'Norms must not exceed 490 characters')
    .test("no-trailing-space", "Norms cannot end with a space", (value) => !/\s$/.test(value))
    .test( "no-leading-space","Norms cannot start with a space",(value) => !/^\s/.test(value)),
    metrics   : Yup.string().required("Metrics is required").min(3,'Metrics must be at least 3 characters').max(990,'Metrics must not exceed 990 characters'),
    target    : Yup.number().typeError("Target Must be a number").required("Target is required"),
    kpiUnitId : Yup.string().required("Unit is required"),
    ratings   : Yup.array().of(
      Yup.object({
        startValue : Yup.number().typeError("Start Value Must be a number").required("Start Value is required").integer("Start Value must be a whole number").min(0, "Start Value must be a natural number (0 or greater)"),
        endValue   : Yup.number().typeError("End Value Must be a number").required("End Value is required").integer("End Value must be a whole number").min(0, "End Value must be a natural number (0 or greater)"),
        rating     : Yup.number().typeError("Rating Must be a number").required("Ratinge is required"),
      })
    ).test("unique-range", "Ranges in ratings must not overlap", (ratings,context) => {
      if(!ratings) return true;
      const ranges = ratings.map(({startValue,endValue}) => {
        const min = Math.min(startValue,endValue);
        const max = Math.max(startValue,endValue);
        return [min,max]
      });

      for (let i = 0; i < ranges.length; i++) {
        for (let j = i + 1; j < ranges.length; j++) {
          if(!(Number(ranges[i][0]) === 0 && Number(ranges[j][1]) === 0 && Number(ranges[i][1]) === 0 && Number(ranges[j][0]) === 0 && (i === 0 || i === 1) && (j === 1 || j === 2))){
            if ( ranges[i][0] <= ranges[j][1] &&  ranges[i][1] >= ranges[j][0]) {
              return false;
            }
          }
        }
      }
      return true;
    }),
  });

  const handleSubmitClick = async (values) => {

    await AlertConfirmation({
    title: isAddMode?'Are you sure Add KPI ?':'Are you sure Edit KPI ?' ,
    message: '',
    }).then(async (result) => {
    if (result) {
      try {
          if(isAddMode){
            values.groupDivisionId = grpDivId === 'A'?'0':grpDivId;
            values.kpiType         = grpDivType;
            const result =await insertKpi(values);
            handleConfirm();
            if (result.status === 'S') {
              Swal.fire({
                icon: "success",
                title: result.message,
                showConfirmButton: false,
                timer: 1500
              });
            } else {
              Swal.fire({
                icon: "error",
                title: result.message,
                showConfirmButton: false,
                timer: 1500
              });
            }
          }else{
            const result = await updateKpi(values);
            handleConfirm();
            if (result.status === 'S') {
              Swal.fire({
                icon: "success",
                title: result.message,
                showConfirmButton: false,
                timer: 1500
              });
            } else {
              Swal.fire({
                icon: "error",
                title: result.message,
                showConfirmButton: false,
                timer: 1500
              });
            }
          }

      } catch (error) {
        Swal.fire('Error!', 'There was an issue adding the KPI.', 'error');
      }
    }
  });
  };

  return (
   <div>
    {open && (
      <div className={`modal fade show modal-visible`} style={{ display: 'block' }} aria-modal="true" role="dialog">
        <div className="modal-dialog modal-lg modal-xl-custom">
          <div className="modal-content" >
           <div className="modal-header bg-secondary d-flex justify-content-between bg-primary text-white">
            <h5 className="modal-title">{flag === 'L'?'KPI Ratings - '+grpDivName:(isAddMode?'KPI Add - '+grpDivName:'KPI Edit - '+grpDivName)}  </h5>
            <button type="button" className="btn btn-danger" onClick={handleClose} aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
           </div>

           <div className="modal-body model-max-height">
             <Formik initialValues={initialValues} enableReinitialize={true} validationSchema={validationSchema} onSubmit={async (values) => { await handleSubmitClick(values);}}>
              {({ values, errors, touched, setFieldValue, setFieldTouched, isValid, dirty }) => (
                <Form>
                  <DialogContent>
                    <Box display="flex" alignItems="center"  gap="10px">
                      <Box flex="7%"></Box>
                      <Box flex="44%">
                        <Field name="objective" id="standard-basic" as={TextField} label="Objectives" variant="outlined" fullWidth size="small" margin="normal" multiline minRows={2} maxRows={5}
                        InputProps={{readOnly: flag === 'M'?false:true,}} error={Boolean(touched.objective && errors.objective)} helperText={touched.objective && errors.objective} required></Field>
                      </Box>
                      <Box flex="44%">
                        <Field name="metrics" id="standard-basic" as={TextField} label="Metrics" variant="outlined" fullWidth size="small" margin="normal" multiline minRows={2} maxRows={5}
                        InputProps={{readOnly: flag === 'M'?false:true,}} error={Boolean(touched.metrics && errors.metrics)} helperText={touched.metrics && errors.metrics} required></Field>
                      </Box>
                      <Box flex="5%"></Box>
                    </Box>
                    <Box display="flex" alignItems="center"  gap="10px">
                      <Box flex="7%"></Box>
                      <Box flex="22.5%">
                        <Field name="norms" id="standard-basic" as={TextField} label="Norms" variant="outlined" fullWidth size="small" margin="normal" required
                        InputProps={{readOnly: flag === 'M'?false:true,}} error={Boolean(touched.norms && errors.norms)} helperText={touched.norms && errors.norms}></Field>
                      </Box>
                      <Box flex="21.5%"> 
                        <Field name="target" id="standard-basic" as={TextField} label="Target" variant="outlined" fullWidth size="small" margin="normal" required
                        InputProps={{readOnly: flag === 'M'?false:true,}} error={Boolean(touched.target && errors.target)} helperText={touched.target && errors.target}></Field>
                      </Box>
                      <Box flex="22%">
                      <Field name="kpiUnitId">
                        {({ field, form })=>(
                            <Autocomplete options={kpiUnitList} getOptionLabel={option => option.kpiUnitName} 
                            renderOption={(props, option) => {return (
                                <CustomMenuItem {...props} key={option.kpiUnitId}>
                                  <ListItemText primary={`${option.kpiUnitName}`} />
                                </CustomMenuItem>
                              );}}
                            value = {kpiUnitList.find(team =>team.kpiUnitId === form.values.kpiUnitId) || null} 
                              ListboxProps={{sx:{maxHeight :200,overflowY:'auto'}}} readOnly = {flag === 'M'?false:true}
                            onChange={(event, newValue) => { setFieldValue("kpiUnitId", newValue ? newValue.kpiUnitId : '');}}
                            renderInput={(params) => (<TextField {...params} label="Unit"   size="small"  margin="normal" variant="outlined"
                                    error={touched.kpiUnitId && Boolean(errors.kpiUnitId)} required
                                    helperText={touched.kpiUnitId && errors.kpiUnitId} />)} />
                        )}
                      </Field> 
                      </Box>
                      <Box flex="27%"></Box>
                    </Box>
                    <Grid item xs={12} className="mg-top-20">
                      {values.ratings.map((tar, index) => (
                        <Box display="flex" alignItems="center" gap="10px" className='mg-top-10'>
                          <Box flex="17.5%"></Box>
                          <Box flex="11%"><span className="fn-bold">Rating - {index+1}</span></Box>
                          <Box flex="22%">
                            <TextField label="Start Value" value={tar.startValue} fullWidth size="small" required 
                              onChange={(e) => setFieldValue(`ratings[${index}].startValue`, e.target.value)}
                              onBlur={() => setFieldTouched(`ratings[${index}].startValue`, true)}  InputProps={{readOnly: flag === 'M'?false:true,}}
                              error={touched.ratings?.[index]?.startValue && Boolean(errors.ratings?.[index]?.startValue)}
                              helperText={touched.ratings?.[index]?.startValue && errors.ratings?.[index]?.startValue} />
                          </Box>
                          <Box flex="22%">
                            <TextField label="End Value" value={tar.endValue} fullWidth size="small" required
                              //onChange={(e) => {setFieldValue(`ratings[${index}].endValue`, e.target.value);  index < values.ratings.length - 1 && setFieldValue(`ratings[${index+1}].startValue`, Number(e.target.value)+1) }}
                              onChange={(e) => {setFieldValue(`ratings[${index}].endValue`, e.target.value);}}
                              onBlur={() => setFieldTouched(`ratings[${index}].endValue`, true)} InputProps={{readOnly: flag === 'M'?false:true,}}
                              error={touched.ratings?.[index]?.endValue && Boolean(errors.ratings?.[index]?.endValue)}
                              helperText={touched.ratings?.[index]?.endValue && errors.ratings?.[index]?.endValue} />
                          </Box>
                          <Box flex="27.5%"></Box>
                        </Box>
                      ))}
                    </Grid>
                    <Box className = 'text-center mg-top-10'>
                      {flag === 'M' && <Button variant="contained" color="success" type="submit"  disabled={!isValid }> Submit</Button>}
                    </Box>
                    <h6 className="noteColor" >Note : System will not allow the overlap range values</h6>
                  </DialogContent>
                </Form>
              )}
             </Formik>
           </div>
          </div>
        </div>
      </div>

    )}
  </div>
  );
};

export default KpiratingDialog;
