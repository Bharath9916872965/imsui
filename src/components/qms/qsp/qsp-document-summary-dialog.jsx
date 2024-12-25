import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { addQspDocSummary, getQspDocSummarybyId } from '../../../services/qms.service';
import AlertConfirmation from '../../../common/AlertConfirmation.component';


const QspDocumentSummaryDialog = ({ open, onClose, revisionElements, onConfirm }) => {
    const [error, setError] = useState(null);
    const [initialValues, setInitialValues] = useState({
        additionalInfo: '',
        abstract: '',
        keywords: '',
        distribution: '',
    });


    useEffect(() => {
        const fetchData = async () => {
            try {
                const newInitialValues = {
                    additionalInfo: '',
                    abstract: '',
                    keywords: '',
                    distribution: '',
                };
    
                if (revisionElements?.revisionRecordId) {
                    newInitialValues.revisionRecordId = revisionElements.revisionRecordId;
                }

                setInitialValues(newInitialValues);
                getDocSummary();
            } catch (error) {
                setError('An error occurred');
            }
        }

        fetchData();
    }, [open]);


    const getDocSummary = async () => {
        try {


            if(revisionElements != null) {
                let docSummary = await getQspDocSummarybyId(revisionElements.revisionRecordId);

                if (docSummary && docSummary != null && docSummary != undefined && docSummary != '') {
                    setInitialValues(docSummary);
                }
            }
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

    const submitDocSummary = async (values) => {

        const isConfirmed = await AlertConfirmation({
            title: 'Are you sure to submit ?',
            message: '',
        });

        if (isConfirmed) {
            let res = await addQspDocSummary(values, revisionElements.docVersionReleaseId);

            if (res && res > 0) {
                Swal.fire({
                    icon: "success",
                    title: "Document Summary Submitted Successfully",
                    showConfirmButton: false,
                    timer: 1500
                });

                onClose(false)
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Document Summary Submit Unsuccessful!",
                    showConfirmButton: false,
                    timer: 1500
                });
            }

        }

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
                                        <h5 className="modal-title">Document Summary</h5>
                                    </div>
                                    <div>
                                        <button type="button" className="modal-close" onClick={() => onClose(false)}>
                                            <i className="material-icons">close</i>
                                        </button>
                                    </div>
                                </div>
                                <div className="modal-body">
                                    <br />

                                    <Formik
                                        initialValues={initialValues}
                                        validationSchema={validationSchema}
                                        onSubmit={submitDocSummary}
                                        enableReinitialize
                                    >
                                        {({ isValid, errors, touched }) => (
                                            <Form>




                                                <div className="mb-3 text-start">
                                                    <label htmlFor="additionalInfo">Additional Info :</label>
                                                    <div>
                                                        <Field
                                                            as="textarea"
                                                            id="additionalInfo"
                                                            name="additionalInfo"
                                                            rows="3"
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
                                                            rows="3"
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
                                                <div className="mb-3 text-start">
                                                    <label htmlFor="keywords">Keywords :</label>
                                                    <div>
                                                        <Field
                                                            as="textarea"
                                                            id="keywords"
                                                            name="keywords"
                                                            rows="3"
                                                            className={`form-control w-100 ${touched.keywords && errors.keywords ? 'is-invalid' : ''
                                                                }`}
                                                        />
                                                        <ErrorMessage
                                                            name="keywords"
                                                            component="div"
                                                            className="invalid-feedback"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="mb-3 text-start">
                                                    <label htmlFor="distribution">Distribution :</label>
                                                    <div>
                                                        <Field
                                                            as="textarea"
                                                            id="distribution"
                                                            name="distribution"
                                                            rows="3"
                                                            className={`form-control w-100 ${touched.distribution && errors.distribution ? 'is-invalid' : ''
                                                                }`}
                                                        />
                                                        <ErrorMessage
                                                            name="distribution"
                                                            component="div"
                                                            className="invalid-feedback"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="text-center">
                                                    <button type="submit" variant="contained" className='btn submit'  >
                                                        Submit
                                                    </button>
                                                </div>
                                            </Form>
                                        )}
                                    </Formik>
                                    <br />
                                    <br />


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

export default QspDocumentSummaryDialog;