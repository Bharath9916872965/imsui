import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { addNewDwpIssue } from "services/qms.service";
import AlertConfirmation from "common/AlertConfirmation.component";

const DwpDocsAddIssueDialog = ({ open, onClose, revisionElements, docType, groupDivisionId, onConfirm }) => {
    const [error, setError] = useState(null);
    const [newAmendVersion, setNewAmendVersion] = useState("");
    const [initialValues, setInitialValues] = useState({
        isNewIssue: false,
        currentVersion: "",
        amendParticulars: "",
        docType: docType,
    });


    useEffect(() => {

        const fetchData = async () => {
            try {
                
                if (revisionElements && revisionElements.length > 0) {
                    setInitialValues((prevValues) => ({
                        ...prevValues,
                        currentVersion: "V" + revisionElements[5] + "-R" + revisionElements[6],
                    }));
                    setNewAmendVersion("V" + revisionElements[5] + "-R" + (revisionElements[6] + 1));
                } else {
                    setInitialValues((prevValues) => ({
                        ...prevValues,
                        currentVersion: "V1-R0",
                        amendParticulars: "Original ISSUE and Revision"
                    }));
                    setNewAmendVersion("V1-R0");
                }
            } catch (error) {
                setError("An error occurred");
            }
        };
        fetchData();
    }, [open]);


    const validationSchema = () =>
        Yup.object().shape({
            amendParticulars: Yup.string()
                .required("Particulars is Required")
                .max(255, "Particulars must not exceed 255 characters"),
        });

    const handleSubmit = async (values) => {
        const issueDto = {
            ...values,
            newAmendVersion: newAmendVersion,
            groupDivisionId: groupDivisionId,
        };
        // setFormData(qaQTAddVersionDto);
        // setOpenConfirmationDialog(true);

        const isConfirmed = await AlertConfirmation({
            title: 'Are you sure to submit ?',
            message: '',
        });


        if (isConfirmed) {
            const res = await addNewDwpIssue(issueDto);

            if (res && res.revisionRecordId && res.revisionRecordId > 0) {
                Swal.fire({
                    icon: "success",
                    title: "New Issue Submitted Successfully",
                    showConfirmButton: false,
                    timer: 1500
                });

                onClose(false)
            } else {
                Swal.fire({
                    icon: "error",
                    title: "New Issue Submit Unsuccessful!",
                    showConfirmButton: false,
                    timer: 1500
                });
            }

        }

    };

    // const handleDialogConfirm = async () => {
    //     // setOpenConfirmationDialog(false);
    //     await submitForm();
    // };

    // const submitForm = async () => {
    //     const response = await addNewMqapRelease(formData);
    //     if (onConfirm) onConfirm(response);
    //     onClose(false);
    // };

    // const handleSnackbarClose = () => {
    //     setSnackbarOpen(false);
    // };

    const onchangeIsNewIssue = (event) => {
        if (event.target.checked) {
            setNewAmendVersion("V" + (revisionElements[5] + 1) + "-R0");
        } else {
            setNewAmendVersion("V" + revisionElements[5] + "-R" + (revisionElements[6] + 1));
        }
    };

    if (!open) return null;

    return (
        <>
            <div>
                {open && (
                    <div className={`modal ${open ? 'show' : ''}`} style={{ display: open ? 'block' : 'none' }} tabIndex="-1" onClick={() => { onClose(false) }} >
                        <div className="modal-dialog modal-dialog-centered modal-xl" onClick={(e) => e.stopPropagation()} >
                            <div className="modal-content">
                                <div className="modal-header bg-secondary text-white d-flex justify-content-between align-items-center">
                                    <div>
                                        <h5 className="modal-title">Document Summary</h5>
                                    </div>
                                    <div>
                                        <button type="button" className="modal-close" onClick={() => onClose(false)}>
                                            <i className="material-icons">close</i>
                                        </button>
                                    </div>
                                </div>
                                <div className="modal-body">
                                    <Formik
                                        initialValues={initialValues}
                                        validationSchema={validationSchema()}
                                        enableReinitialize
                                        onSubmit={handleSubmit}
                                    >
                                        {({ setFieldValue, values, errors, touched, isValid }) => (
                                            <Form>

                                                <div className="form-group text-start">
                                                    <div className="row" >
                                                        <div className="col-md-3">
                                                            <label htmlFor="isNewIssue" className="form-label">Is New Issue ?</label>
                                                            <div className="input-group">

                                                                <div className="d-inline-block me-1">Off</div>
                                                                <div class="form-check form-switch">
                                                                    <input class="form-check-input" type="checkbox" id="flexSwitchCheckChecked" 
                                                                    className="form-check-input"
                                                                    checked={values.isNewIssue}
                                                                    disabled={!revisionElements || revisionElements.length === 0}
                                                                    onChange={(event) => {
                                                                        setFieldValue("isNewIssue", event.target.checked);
                                                                        onchangeIsNewIssue(event);
                                                                    }}/>
                                                                </div>
                                                                <div className="d-inline-block me-1">On</div>

                                                            </div>
                                                        </div>

                                                        <div className="col-md-4">
                                                            <label htmlFor="currentVersion" className="form-label">Current Version :</label>
                                                            <div className="input-group">
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    name="currentVersion"
                                                                    value={values.currentVersion}
                                                                    disabled
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mb-3 text-start">
                                                    <label htmlFor="amendParticulars">Particulars :</label>
                                                    <div>
                                                        <Field
                                                            as="textarea"
                                                            id="amendParticulars"
                                                            name="amendParticulars"
                                                            rows="3"
                                                            className={`form-control w-100 ${touched.amendParticulars && errors.amendParticulars ? 'is-invalid' : ''
                                                                }`}
                                                        />
                                                        <ErrorMessage
                                                            name="amendParticulars"
                                                            component="div"
                                                            className="invalid-feedback"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="text-center">
                                                    <button
                                                        type="submit"
                                                        className="btn submit"
                                                        // disabled={!values.amendParticulars}
                                                        disabled={!isValid}
                                                    >
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
                )}
                {open && <div className="modal-backdrop fade show"></div>}
            </div>

        </>
    );
};

export default DwpDocsAddIssueDialog;
