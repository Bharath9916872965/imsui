import React, { useEffect, useState } from "react";
import { getKpiUnitList,insertKpi,getKpiMasterList,getKpiRatingList,updateKpi,getDwpRevisonList } from "services/kpi.service";
import Datatable from "../../datatable/Datatable";
import { Box, Button, TextField,Autocomplete, ListItemText,Grid,DialogContent } from '@mui/material';
import Navbar from "components/Navbar/Navbar";
import { Field, Formik, Form  } from "formik";
import './kpi-master.css'
import * as Yup from "yup";
import AlertConfirmation from "common/AlertConfirmation.component";
import { CustomMenuItem } from "services/auth.header";
import withRouter from "common/with-router";
import SelectPicker from "components/selectpicker/selectPicker";

const validationSchema = Yup.object({
  objective : Yup.string().required("Objective is required").min(3,'Objective must be at least 3 characters').max(990,'Objective must not exceed 990 characters')
  .test("no-trailing-space", "Objective cannot end with a space", (value) => !/\s$/.test(value))
  .test( "no-leading-space","Objective cannot start with a space",(value) => !/^\s/.test(value)),
  metrics   : Yup.string().required("Metrics is required").min(3,'Metrics must be at least 3 characters').max(990,'Metrics must not exceed 990 characters')
  .test("no-trailing-space", "Metrics cannot end with a space", (value) => !/\s$/.test(value))
  .test( "no-leading-space","Metricsr cannot start with a space",(value) => !/^\s/.test(value)),
  target    : Yup.number().typeError("Target Must be a number").required("Target is required"),
  kpiUnitId : Yup.string().required("Unit is required"),
  ratings   : Yup.array().of(
    Yup.object({
      startValue : Yup.number().typeError("Start Value Must be a number").required("Start Value is required"),
      endValue   : Yup.number().typeError("End Value Must be a number").required("End Value is required"),
      rating     : Yup.number().typeError("Rating Must be a number").required("Ratinge is required"),
    })
  ),
});

const KpiObjectiveMaster = ({router}) => {

  const {navigate,location} = router;

  const [kpiMasterList,setKpiMasterList] = useState([]);
  const [filKpiMasterList,setFilKpiMasterList] = useState([]);
  const [kpiRatingList,setKpiRatingList] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isAddMode,setIsAddMode] = useState(true);
  const [kpiUnitList,setKpiUnitList] = useState([])
  const [dwpRevisionList,setDwpRevisionList] = useState([])
  const [isMr,setIsMr] = useState(true);
  const [revisionOptions,setRevisionOptions] = useState([]);
  const [revisionId,setRevisionId] = useState('A');
  const [dwpData,setDwpData] = useState('')

    const [initialValues,setInitialValues] = useState({
      kpiId     : 0,
      objective : '',
      metrics   : '',
      target    : '',
      kpiUnitId : 1,
      revisionRecordId : '0',
      ratings   : [{ startValue : '', endValue : '',rating : '' }],
    });


  const columns = [
    { name: 'SN', selector: (row) => row.sn, sortable: true, grow: 1, align: 'text-center', width: '3%'  },
    { name: 'Division/Group/LAB', selector: (row) => row.division, sortable: true, grow: 2, align: 'text-center', width: '15%'  },
    { name: 'Objectives', selector: (row) => row.objectives, sortable: true, grow: 2, align: 'text-left', width: '30%'  },
    { name: 'Metrics', selector: (row) => row.metrics, sortable: true, grow: 2, align: 'text-left', width: '30%'  },
    { name: 'Target/Norms', selector: (row) => row.target, sortable: true, grow: 2, align: 'text-center', width: '12%'  },
    { name: 'Action', selector: (row) => row.action, sortable: true, grow: 2, align: 'text-center',  width: '10%' },
  ];



  const fetchData = async () => {
    try {
      const kpiMasterList  = await getKpiMasterList();
      const unitList = await getKpiUnitList();
      const ratingList = await getKpiRatingList();
      const dwpList = await getDwpRevisonList();

      setIsMr(true)
      const dwpData = router.location.state?.dwpGwp;
      const revisionData = dwpList.map(data => ({
        value : String(data.revisionRecordId),
        label : data.docType === 'dwp'?'DWP - '+data.divisionMasterDto.divisionCode:'GWP - '+data.divisionGroupDto.groupCode
      }));
      const iniLsit = [{value : 'A', label : 'ALL'},{value : '0', label : 'COMMON LAB KPI'}]

      setRevisionOptions([...iniLsit,...revisionData])
      setDwpRevisionList(dwpList);
      setKpiRatingList(ratingList)
      setKpiUnitList(unitList)
      setKpiMasterList(kpiMasterList)
      if(dwpData){
        setRevisionId(String(dwpData.revisionRecordId))
        setDwpData(dwpData)
        setIsMr(false);
        setDataTable(kpiMasterList.filter(data => Number(data.revisionRecordId) === Number(dwpData.revisionRecordId)))
      }else{
        if(revisionId === 'A'){
          setDataTable(kpiMasterList)
        }else{
          setDataTable(kpiMasterList.filter(data => Number(data.revisionRecordId) === Number(revisionId)))
        }
      }
      setIsReady(true);

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isReady]);

  // const afterSubmit = async ()=>{
  //   const kpiMasterList  = await getKpiMasterList();
  //   const ratingList = await getKpiRatingList();
  //   setKpiMasterList(kpiMasterList)
  //   setDataTable(kpiMasterList)
  //   setKpiRatingList(ratingList)
  //   console.log('ratingList------- ',ratingList)
  //   setIsReady(true);
  // }

  const setDataTable = (list)=>{

       const mappedData = list.map((item,index)=>{
            const kpiUnit = item.kpiUnitName === 'PERCENTAGES'?'%':' '+item.kpiUnitName;
          return{
            sn          : index+1,
            division    : item.groupDivisionCode || '-',
            objectives  : item.kpiObjectives || '-',
            metrics     : item.kpiMerics || '-',
            target      : item.kpiTarget+kpiUnit || '-',
            action      : <><button className=" btn btn-outline-warning btn-sm me-1" onClick={() => editKpi(item)}  title="Edit"> <i className="material-icons"  >edit_note</i></button></>
          }      
        });

      setFilKpiMasterList(mappedData);
   }

  const kpiAdd = ()=>{
    setShowModal(true);
    setModalVisible(true);
    setInitialValues({
      kpiId     : 0,
      objective : '',
      metrics   : '',
      target    : '',
      kpiUnitId : 1,
      revisionRecordId : '0',
      ratings   : Array.from({length : 5},(_,index) => ({startValue : '', endValue : '',rating : index+1  }))
   
    });
  }

  const editKpi = (item)=>{
    setShowModal(true);
    setModalVisible(true);
    setIsAddMode(false);

    setInitialValues({
      kpiId     : item.kpiId,
      objective : item.kpiObjectives,
      metrics   : item.kpiMerics,
      target    : item.kpiTarget,
      kpiUnitId : item.kpiUnitId,
      revisionRecordId : item.revisionRecordId,
      ratings   : kpiRatingList.filter(data => Number(data.kpiId) === Number(item.kpiId)).map(item => ({ startValue: item.startValue,endValue: item.endValue, rating: item.kpiRating.toString(),}))
   
    });

  }

  const hadleClose = ()=>{
    setShowModal(false);
    setModalVisible(false);
  }

  const handleSubmitClick = async (values) => {

    await AlertConfirmation({
    title: isAddMode?'Are you sure Add KPI ?':'Are you sure Edit KPI ?' ,
    message: '',
    }).then(async (result) => {
    if (result) {
      try {
        setIsReady(false);
          if(isAddMode){
            values.revisionRecordId = revisionId === 'A'?'0':revisionId;
            const result =await insertKpi(values);
            if (result.status === 'S') {
              fetchData();
              setShowModal(false);
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
            if (result.status === 'S') {
              fetchData();
              setShowModal(false);
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

  const onRevisionChange = (value)=>{
    setRevisionId(value);
    if(value === 'A'){
      setDataTable(kpiMasterList)
    }else{
      setDataTable(kpiMasterList.filter(data => data.revisionRecordId === value))
    }
  }

  const back = ()=>{
    if(dwpData.docType === 'dwp'){
      navigate('/dwp')
    }else{
      navigate('/gwp')
    }
  }
  
  return (
    <div>
      <Navbar />
      <div className="card">
        <div className="card-body text-center">
         <Box display="flex" alignItems="center" gap="10px" className='mg-down-10'>
          <Box flex="75%" className='text-center'><h3>Key Process Indicator</h3></Box>
          <Box flex="20%">
            <SelectPicker options={revisionOptions} label="Division/Group" readOnly = {!isMr} 
            value={revisionOptions && revisionOptions.length >0 && revisionOptions.find(option => option.value === revisionId) || null}
             handleChange={(newValue) => {onRevisionChange( newValue?.value) }}/>
          </Box>
          {!isMr && <Box flex="5%" ><button className="btn backClass" onClick={() => back()}>Back</button></Box>}
         </Box>
          <div id="card-body customized-card">
            <Datatable columns={columns} data={filKpiMasterList} />
          </div>
          <div>
            {<button className="btn add btn-name" onClick={kpiAdd}> Add </button>}
          </div>
          {showModal && (
            <div className={`modal fade show ${modalVisible ? 'modal-visible' : ''}`} style={{ display: 'block' }} aria-modal="true" role="dialog">
              <div className="modal-dialog modal-lg modal-xl-custom">
                <div className="modal-content" >
                  <div className="modal-header bg-secondary d-flex justify-content-between bg-primary text-white">
                    <h5 className="modal-title">{isAddMode?'Add KPI':'Edit KPI'}  </h5>
                    <button type="button" className="btn btn-danger" onClick={hadleClose} aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>

                  <div className="modal-body model-max-height">
                  <Formik initialValues={initialValues} enableReinitialize={true} validationSchema={validationSchema} onSubmit={async (values) => { await handleSubmitClick(values);}}>
                   {({ values, errors, touched, setFieldValue, setFieldTouched, isValid, dirty }) => (
                    <Form>
                     <DialogContent>
                      <Box display="flex" alignItems="flex-center" flexWrap="wrap" gap="10px">
                       <Box flex="7%"></Box>
                       <Box flex="44%">
                       <Field name="objective" id="standard-basic" as={TextField} label="Objectives" variant="outlined" fullWidth size="small" margin="normal" multiline minRows={2} maxRows={5}
                        error={Boolean(touched.objective && errors.objective)} helperText={touched.objective && errors.objective} required></Field>
                       </Box>
                       <Box flex="44%">
                       <Field name="metrics" id="standard-basic" as={TextField} label="Metrics" variant="outlined" fullWidth size="small" margin="normal" multiline minRows={2} maxRows={5}
                        error={Boolean(touched.metrics && errors.metrics)} helperText={touched.metrics && errors.metrics} required></Field>
                       </Box>
                       {/* <Box flex="10%"> 
                       <Field name="target" id="standard-basic" as={TextField} label="Target/Norms" variant="outlined" fullWidth size="small" margin="normal" required
                        error={Boolean(touched.target && errors.target)} helperText={touched.target && errors.target}></Field>
                       </Box>
                       <Box flex="16%">
                        <Field name="kpiUnitId">
                          {({ field, form })=>(
                              <Autocomplete options={kpiUnitList} getOptionLabel={option => option.kpiUnitName} 
                              renderOption={(props, option) => {return (
                                  <CustomMenuItem {...props} key={option.kpiUnitId}>
                                    <ListItemText primary={`${option.kpiUnitName}`} />
                                  </CustomMenuItem>
                                );}}
                              value = {kpiUnitList.find(team =>team.kpiUnitId === form.values.kpiUnitId) || null} 
                                ListboxProps={{sx:{maxHeight :200,overflowY:'auto'}}}
                              onChange={(event, newValue) => { setFieldValue("kpiUnitId", newValue ? newValue.kpiUnitId : '');}}
                              renderInput={(params) => (<TextField {...params} label="Unit"   size="small"  margin="normal" variant="outlined"
                                      error={touched.kpiUnitId && Boolean(errors.kpiUnitId)} required
                                      helperText={touched.kpiUnitId && errors.kpiUnitId} />)} />
                          )}
                        </Field> 
                       </Box> */}
                       <Box flex="5%"></Box>
                      </Box>
                      <Box display="flex" alignItems="flex-center" flexWrap="wrap" gap="10px">
                       <Box flex="7%"></Box>
                       <Box flex="44%"> 
                       <Field name="target" id="standard-basic" as={TextField} label="Target/Norms" variant="outlined" fullWidth size="small" margin="normal" required
                        error={Boolean(touched.target && errors.target)} helperText={touched.target && errors.target}></Field>
                       </Box>
                       <Box flex="44%">
                        <Field name="kpiUnitId">
                          {({ field, form })=>(
                              <Autocomplete options={kpiUnitList} getOptionLabel={option => option.kpiUnitName} 
                              renderOption={(props, option) => {return (
                                  <CustomMenuItem {...props} key={option.kpiUnitId}>
                                    <ListItemText primary={`${option.kpiUnitName}`} />
                                  </CustomMenuItem>
                                );}}
                              value = {kpiUnitList.find(team =>team.kpiUnitId === form.values.kpiUnitId) || null} 
                                ListboxProps={{sx:{maxHeight :200,overflowY:'auto'}}}
                              onChange={(event, newValue) => { setFieldValue("kpiUnitId", newValue ? newValue.kpiUnitId : '');}}
                              renderInput={(params) => (<TextField {...params} label="Unit"   size="small"  margin="normal" variant="outlined"
                                      error={touched.kpiUnitId && Boolean(errors.kpiUnitId)} required
                                      helperText={touched.kpiUnitId && errors.kpiUnitId} />)} />
                          )}
                        </Field> 
                       </Box>
                       <Box flex="5%"></Box>
                      </Box>
                      <Grid item xs={12} className="mg-top-20">
                        {values.ratings.map((tar, index) => (
                          <Box display="flex" alignItems="center" gap="10px" className='mg-top-10'>
                            <Box flex="8%"><span className="fn-bold">Rating - {index+1}</span></Box>
                           {/*  <Box flex="9.5%"><span className="fn-bold"></span>
                              <TextField label="Rating" value={tar.rating} fullWidth size="small" required
                                onChange={(e) => setFieldValue(`ratings[${index}].rating`, e.target.value)}
                                onBlur={() => setFieldTouched(`ratings[${index}].rating`, true)}
                                error={touched.ratings?.[index]?.rating && Boolean(errors.ratings?.[index]?.rating)}
                                helperText={touched.ratings?.[index]?.rating && errors.ratings?.[index]?.rating} /> 
                            </Box>*/}
                            <Box flex="45%">
                              <TextField label="Start Value" value={tar.startValue} fullWidth size="small" required
                                onChange={(e) => setFieldValue(`ratings[${index}].startValue`, e.target.value)}
                                onBlur={() => setFieldTouched(`ratings[${index}].startValue`, true)}
                                error={touched.ratings?.[index]?.startValue && Boolean(errors.ratings?.[index]?.startValue)}
                                helperText={touched.ratings?.[index]?.startValue && errors.ratings?.[index]?.startValue} />
                            </Box>
                            <Box flex="47%">
                              <TextField label="End Value" value={tar.endValue} fullWidth size="small" required
                                onChange={(e) => setFieldValue(`ratings[${index}].endValue`, e.target.value)}
                                onBlur={() => setFieldTouched(`ratings[${index}].endValue`, true)}
                                error={touched.ratings?.[index]?.endValue && Boolean(errors.ratings?.[index]?.endValue)}
                                helperText={touched.ratings?.[index]?.endValue && errors.ratings?.[index]?.endValue} />
                            </Box>
                            {/* <Box flex="8%">
                            {index === 0 ? (<IconButton onClick={() => setFieldValue('ratings', [...values.ratings, { startValue: '', endValue: '', rating: ''}])} color="primary" > <i className="material-icons large-icon"  >add</i></IconButton>) :
                            (<IconButton onClick={() => {const updatedRatings = values.ratings.filter((_, idx) => index !== idx); setFieldValue('ratings', updatedRatings);}} color="danger" ><i className="material-icons large-icon returned"  >remove</i></IconButton>)}
                            </Box> */}
                            {/* <Box flex="2%"></Box> */}
                          </Box>
                        ))}
                      </Grid>
                      <Box className = 'text-center mg-top-10'>
                        <Button variant="contained" color="success" type="submit"  disabled={!isValid }> Submit</Button>
                      </Box>
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
      </div>
    </div>
  );

}
export default withRouter(KpiObjectiveMaster);