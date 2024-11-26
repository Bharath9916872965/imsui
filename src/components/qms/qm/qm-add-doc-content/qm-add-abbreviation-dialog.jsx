// import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Checkbox, TextField, div, Snackbar, Alert } from '@mui/material';
import { Field, Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { addNewAbbreviation, getAbbreviationsByIdNotReq, getNotReqAbbreviationIds, getQmRevistionRecordById, updateNotReqAbbreviationIds } from '../../../../services/qms.service';
import './qm-add-doc-content.component.css';
import AlertConfirmation from '../../../../common/AlertConfirmation.component';


const QmAddAbbreviationDialog = ({ open, onClose, revisionElements, onConfirm }) => {
    const [error, setError] = useState(null);
    const [selectedAbbre, setSelectedAbbre] = useState([]);
    const [abbreviationsList, setbbreviationsList] = useState([]);
    const [unSelectedAbbre, setUnSelectedAbbre] = useState([]);
    const [formData, setFormData] = useState(null);
    const [revistionRecord, setRevistionRecord] = useState(null);

    const [openDialog, setOpenDialog] = useState(false);


    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    useEffect(() => {
        const fetchData = async () => {
            try {
                getAbbreviationsList();
                getQmRevistionRecord();

            } catch (error) {
                setError('An error occurred');
            }
        }

        fetchData();
    }, [open]);


    const handleDialogConfirm = async () => {
        setOpenDialog(false);

        let res = await addNewAbbreviation(formData);

        if (res && res > 0) {
            setSnackbarSeverity('success');
            getAbbreviationsList();
            setSnackbarOpen(true);
            setSnackbarMessage('Abbreviation Added Successfully');
        } else {
            setSnackbarOpen(true);
            setSnackbarSeverity('error');
            setSnackbarMessage('Abbreviation Add Unsuccessful!');
        }
    };

    const submitReqAbbreviation = async () => {

        const isConfirmed = await AlertConfirmation({
            title: 'Are you sure to submit ?',
            message: '',
        });

        if (isConfirmed) {

            let res = await updateNotReqAbbreviationIds(unSelectedAbbre + '', revisionElements.revisionRecordId + '');

            if (res && res > 0) {
                Swal.fire({
                    icon: "success",
                    title: "Abbreviation Submitted Successfully!",
                    showConfirmButton: false,
                    timer: 1500
                });

                // if (onConfirm) onConfirm(res);
                onClose(false)
            } else {
                Swal.fire({
                    icon: "success",
                    title: "Abbreviation Submit Unsuccessful!",
                    showConfirmButton: false,
                    timer: 1500
                });
            }


            // if (onConfirm) onConfirm(res);
            // onClose(false)
        }

    };

    const addRemoveAbbreviation = (checked, id) => {
        if (checked) {
            setSelectedAbbre([...selectedAbbre, id])
            setUnSelectedAbbre(unSelectedAbbre.filter((val) => val !== id));
        } else {
            setUnSelectedAbbre([...unSelectedAbbre, id])
            setSelectedAbbre(selectedAbbre.filter((val) => val !== id));

        }
    };

    const getAbbreviationsList = async () => {
        try {
            let list = await getAbbreviationsByIdNotReq("0");
            setbbreviationsList(list);
        } catch (error) {
            setError('An error occurred');
        }
    };

    const getQmRevistionRecord = async () => {
        try {
            let revistionRecord = await getQmRevistionRecordById(revisionElements.revisionRecordId);
            var abbreviationIdNotReq =""
            setRevistionRecord(revistionRecord)
            if(revistionRecord != undefined && revistionRecord !=null && revistionRecord.abbreviationIdNotReq != null) {
                abbreviationIdNotReq =revistionRecord.abbreviationIdNotReq
            }
            setUnSelectedAbbre(abbreviationIdNotReq.split(',').map(Number));
        } catch (error) {
            setError('An error occurred');
        }
    };


    const validationSchema = Yup.object({
        abbreviation: Yup.string().max(255, 'Must be 255 characters or less').required('Abbreviation is required'),
        meaning: Yup.string().max(255, 'Must be 255 characters or less').required('Meaning is required'),
    });

    const handleSubmit = async (values) => {
        setFormData(values)
        //   const response = await addNewAbbreviation(values);
    };


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
                                    <div className="container">
                                        <div className="row row-cols-2">
                                            {abbreviationsList.map((item, index) => (
                                                <div key={index} className="col" style={{ border: '0.5px solid #d7ebeb' }}>
                                                    <div className="d-flex py-2 text-start">
                                                        <input className="form-check-input form-check-input-lg" type="checkbox" id="flexCheckDefault"
                                                            // className="example-margin ms-2"
                                                            onChange={(e) => addRemoveAbbreviation(e.target.checked, item.abbreviationId)}
                                                            value={item.abbreviationId}
                                                            checked={!unSelectedAbbre.includes(item.abbreviationId)}
                                                            color="primary"
                                                        />
                                                        <div className="form-check-label ms-2">
                                                            {item.abbreviation} - {item.meaning}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <br />
                                        <div>
                                            {/* <button
                                                type="button"
                                                variant="contained"
                                                className="add"
                                                onClick={() => setOpenDialog(true)}
                                            >
                                                Add New
                                            </button> */}
                                        </div>
                                    </div>
                                    <br />
                                    <div align='center'>
                                        <button onClick={() => submitReqAbbreviation()} variant="contained" className='submit' disabled={abbreviationsList.length == 0} >
                                            Submit
                                        </button>
                                    </div>
                                    <br />
                                </div>
                            </div>



                            {/* <Dialog
                                open={openDialog}
                                onClose={handleClose}
                                maxWidth="md"
                                fullWidth
                                PaperProps={{
                                    style: {
                                        width: '30%',
                                        maxWidth: '100%',
                                    },
                                }}
                            >
                                <DialogTitle sx={{ backgroundColor: '#3f51b5', color: 'white' }}>Add New Abbreviation</DialogTitle>
                                <DialogContent>
                                    <br />
                                    <Formik
                                        initialValues={{ abbreviation: '', meaning: '' }}
                                        validationSchema={validationSchema}
                                        onSubmit={handleSubmit}
                                    >
                                        {({ isValid, errors, touched }) => (
                                            <Form>
                                                <div className="row">
                                                    <div className="col-md-3">
                                                        <div className="mb-3">
                                                            <Field
                                                                fullWidth
                                                                size="small"
                                                                as={TextField}
                                                                name="abbreviation"
                                                                label="Add Abbreviation"
                                                                error={touched.abbreviation && Boolean(errors.abbreviation)}
                                                                helperText={touched.abbreviation && errors.abbreviation}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-md-9">
                                                        <div className="mb-3">
                                                            <Field
                                                                fullWidth
                                                                size="small"
                                                                as={TextField}
                                                                name="meaning"
                                                                label="Add Meaning"
                                                                error={touched.meaning && Boolean(errors.meaning)}
                                                                helperText={touched.meaning && errors.meaning}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="text-center">
                                                    <Button type="submit" className="add" variant="contained" disabled={!isValid} >Add</Button>
                                                </div>
                                            </Form>
                                        )}
                                    </Formik>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleClose} color="error">
                                        <i className="material-icons">close</i>
                                    </Button>
                                </DialogActions>
                            </Dialog> */}

                        </div>
                    </div>
                )}
                {open && <div className="modal-backdrop fade show"></div>}
            </div>
        </>
    )

};

export default QmAddAbbreviationDialog;