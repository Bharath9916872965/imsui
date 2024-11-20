import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Checkbox, TextField, Box, Snackbar, Alert } from '@mui/material';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { addDocSummary, getDocSummarybyId } from '../../../services/qms.service';


const AddDocumentSummaryDialog = ({ open, onClose, versionElements, onConfirm }) => {
    const [error, setError] = useState(null);
    const [isMQAP, setIsMQAP] = useState(false);
    const [formSubmitData, setFormSubmitData] = useState(null);
    const [initialValues , setInitialValues ] = useState({
        additionalInfo: '',
        abstract: '',
        keywords: '',
        distribution: '',
      });

    const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);

    useEffect(() => {
        const fetchData = async () => {

            try {

                setInitialValues({
                    additionalInfo: '',
                    abstract: '',
                    keywords: '',
                    distribution: '',
                  })

                if (versionElements.docType.toString().split('-')[0] == 'MQAP') {
                    setInitialValues({ ...initialValues, abstract: 'MQAP is a comprehensive document pertaining to ' + versionElements.projectMasterDto?.projectName + ' project. This document provides the system level QA plan and to establish the Quality Assurance during design, development, assembly, manufacturing process, Qualification of Radar Sub Systems, Verification and Validation of process across the lifecycle. This document also describes the QA process flow chart indicating various inspection stages to achieve high level of confidence, system level integration and evaluation, production, operation and maintenance aspects. also are described.' })
                }
                  
                  if(['TS'].includes(versionElements.docType.toString().split('-')[0])) {
                    setInitialValues({ ...initialValues, abstract: 'This document describes the Functional Specifications, Functional Tests, ESS, EMI-EMC, Qualification Tests, SW & FW tests for the '+(versionElements.subSystemId > 0 ?  versionElements.PfmsProductTreeDto?.levelName : versionElements.projectMasterDto?.projectName)+' subsystem.'})
                  }
              
                  if(['QTP'].includes(versionElements.docType.toString().split('-')[0])) {
                    setInitialValues({ ...initialValues, abstract: 'This document describes the Functional Specifications, Functional Tests &amp; ESS, EMI-EMC, SW, FW and Qualification Tests Procedures for '+(versionElements.subSystemId > 0 ?  versionElements.PfmsProductTreeDto?.levelName : versionElements.projectMasterDto?.projectName)+' subsystem.'})
                  }
                  
                  if(['ATP'].includes(versionElements.docType.toString().split('-')[0])) {
                    setInitialValues({ ...initialValues, abstract: 'This document describes the Acceptance Test Procedure for '+(versionElements.subSystemId > 0 ?  versionElements.PfmsProductTreeDto?.levelName : versionElements.projectMasterDto?.projectName)+' subsystem.'})
                  }
                  
                  if(['QAP', 'Reliability', 'EMC'].includes(versionElements.docType.toString().split('-')[0])) {
                    setInitialValues({ ...initialValues, abstract: versionElements.docType.toString().split('-')[0]+' of '+(versionElements.subSystemId > 0 ?  versionElements.PfmsProductTreeDto?.levelName : versionElements.projectMasterDto?.projectName)+' is a comprehensive document pertaining to '+versionElements.projectMasterDto?.projectName+' project. This document provides the QA plan to establish the Quality Assurance during design, development, assembly, manufacturing process, Qualification of Radar Sub Systems, Verification and Validation of process across the lifecycle. This document also describes the QA process flow chart indicating various inspection stages to achieve high level of confidence.'})
                  }
                getDocSummary();
            } catch (error) {
                setError('An error occurred');
            }
        }

        fetchData();
    }, [open]);


    const handleDialogClose = () => {
        setOpenConfirmationDialog(false);
    };

    const handleDialogConfirm = async () => {
        setOpenConfirmationDialog(false);

        let res = await addDocSummary(formSubmitData, versionElements.docVersionReleaseId);

        if (onConfirm) onConfirm(res);
        onClose(false)
    };


    const getDocSummary = async () => {
        try {
            let docSummary = await getDocSummarybyId(versionElements.docVersionReleaseId);
            // const sanitizedDocSummary = {
            //     additionalInfo: docSummary.additionalInfo || '',
            //     abstract: docSummary.abstract || '',
            //     keywords: docSummary.keywords || '',
            //     distribution: docSummary.distribution || '',
            //     documentId: docSummary.documentId || 0,
            //     documentSummaryId: docSummary.documentSummaryId || 0,
            //     createdBy: docSummary.createdBy || '',
            //     createdDate: docSummary.createdDate || '',
            //     modifiedBy: docSummary.modifiedBy || '',
            //     modifiedDate: docSummary.modifiedDate || '',
                
            //   };
            // if(docSummary && docSummary !== undefined && docSummary != null){
            //     setInitialValues(docSummary);
            // }
            if(docSummary && docSummary != null && docSummary != undefined && docSummary !=''){
                setInitialValues(docSummary);
            }
            // setInitialValues({...initialValues, sanitizedDocSummary});
        } catch (error) {
            setError('An error occurred');
        }
    };

    const validationSchema = Yup.object().shape({
        additionalInfo: Yup.string().max(1000, 'Maximum 1000 characters allowed'),
        abstract: Yup.string().max(1000, 'Maximum 1000 characters allowed'),
        keywords: Yup.string().max(1000, 'Maximum 1000 characters allowed'),
        distribution: Yup.string().max(1000, 'Maximum 1000 characters allowed'),
    });

    const submitDocSummary = (values) => {
        setOpenConfirmationDialog(true);
        setFormSubmitData(values);
    };

    // const isMQAP = versionElements.docType.split('-')[0] === 'MQAP';

    return (

        <>
            <div>
                {open && (
                    <div className={`modal ${open ? 'show' : ''}`} style={{ display: open ? 'block' : 'none' }} tabIndex="-1" onClick={() => { onClose(false) }} >
                        <div className="modal-dialog modal-dialog-centered modal-xl" onClick={(e) => e.stopPropagation()} >
                            <div className="modal-content">
                                <div className="modal-header bg-secondary text-white d-flex justify-content-between align-items-center">
                                    <div>
                                        <h5 className="modal-title">Select Abbreviation</h5>
                                    </div>
                                    <div>
                                        <button type="button" className="modal-close" onClick={() => onClose(false)}>
                                            <i className="material-icons">close</i>
                                        </button>
                                    </div>
                                </div>
                                <div className="modal-body">
                                    <br />
        {/* <Dialog
          open={open}
          onClose={() => {setInitialValues(null);onClose(false);}}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ backgroundColor: '#3f51b5', color: 'white' }}>Document Summary</DialogTitle>
          <DialogContent>
          <br /> */}
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={submitDocSummary}
                    enableReinitialize  
                >
                    {({ isValid, errors, touched }) => (
                        <Form>
                            {/* <div className="mb-3">
                                <Field
                                    // as={TextField}
                                    name="additionalInfo"
                                    label="Additional Info"
                                    variant="outlined"
                                    multiline
                                    rows={4}
                                    fullWidth
                                    error={touched.additionalInfo && Boolean(errors.additionalInfo)}
                                    helperText={touched.additionalInfo && errors.additionalInfo}
                                />
                            </div> */}


                                    {/* <div className="mb-3">
                                        <Field
                                            // as={TextField}
                                            label="Keywords"
                                            multiline
                                            rows={4}
                                            variant="outlined"
                                            fullWidth
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <Field
                                            // as={TextField}
                                            label="Distribution"
                                            multiline
                                            rows={4}
                                            variant="outlined"
                                            fullWidth
                                        />
                                    </div> */}

                                                <div className="mb-3 text-start">
                                                    <label htmlFor="additionalInfo">Additional Info :</label>
                                                    <div>
                                                        <Field
                                                            as="textarea"
                                                            id="additionalInfo"
                                                            name="additionalInfo"
                                                            rows="4"
                                                            className={`form-control w-100 ${touched.abstract && errors.additionalInfo ? 'is-invalid' : ''
                                                                }`}
                                                        />
                                                        <ErrorMessage
                                                            name="additionalInfo"
                                                            component="div"
                                                            className="invalid-feedback"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="mb-3 text-start">
                                                    <label htmlFor="abstract">Abstract :</label>
                                                    <div>
                                                        <Field
                                                            as="textarea"
                                                            id="abstract"
                                                            name="abstract"
                                                            rows="4"
                                                            className={`form-control w-100 ${touched.abstract && errors.abstract ? 'is-invalid' : ''
                                                                }`}
                                                        />
                                                        <ErrorMessage
                                                            name="abstract"
                                                            component="div"
                                                            className="invalid-feedback"
                                                        />
                                                    </div>
                                                </div>

                            <div className="text-center">
                                <button type="submit" variant="contained" className='btn submit' disabled={!isValid} >
                                    Submit
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
        <br />
        <br />
          {/* </DialogContent>
          <DialogActions>
            <Button onClick={() => onClose(false)} color="error">
              <i className="material-icons">close</i>
            </Button>
          </DialogActions>
          <ConfirmationDialog open={openConfirmationDialog} onClose={handleDialogClose} onConfirm={handleDialogConfirm} message={'Are you sure to submit ?'} />
        </Dialog> */}

</div>
                                {/* <div className="modal-footer">
                        <button type="button" className="btn btn-danger" onClick={() => onClose(false)}>
                            <i className="material-icons">close</i>
                        </button>
                    </div> */}
                            </div>
                        </div>
                    </div>
                )}
                    {open && <div className="modal-backdrop fade show"></div>}
                </div>

        </>
      );

};

export default AddDocumentSummaryDialog;