import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { addNewDwpIssue } from "services/qms.service";
import AlertConfirmation from "common/AlertConfirmation.component";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const DwpDocsAddIssueDialog = ({ open, onClose, revisionElements, docType, groupDivisionId, onConfirm }) => {
    const [error, setError] = useState(null);
    const [newAmendVersion, setNewAmendVersion] = useState("");
    const [selOriginalVal, setSelOriginalVal] = useState('N');
    const [initialValues, setInitialValues] = useState({
        isNewIssue: false,
        currentVersion: "",
        amendParticulars: "",
        docType: docType,
    });
    const [dynamicFields, setDynamicFields] = useState([
        { currentVersion: 'I1-R0', amendParticulars: '', isNewIssue: false,revisionDate: dayjs().format('YYYY-MM-DD'), },
    ]);

    const handleDynamicFieldChange = (index, field, value) => {
        const updatedFields = [...dynamicFields];
        updatedFields[index][field] = value;
        setDynamicFields(updatedFields);
    };

    const handleCloneField = (index) => {
        // Clone the current field
        const currentField =  { ...dynamicFields[index], isNewIssue: false };
        console.log('currentField',currentField);
        const newField = {
          ...currentField,
          currentVersion: getNextVersion(currentField),
          amendParticulars: '',
          revisionDate: currentField.revisionDate, 
        };
        
        setDynamicFields([...dynamicFields, newField]);
      };

      const getNextVersion = (field) => {
        const lastVersion = field.currentVersion;
        const [major, minor] = lastVersion.split('-');
        const majorVersion = parseInt(major.slice(1)); // Get the numeric part of "I1", "I2", etc.
        const minorVersion = parseInt(minor.slice(1)); // Get the numeric part of "R0", "R1", etc.
    
        // If it's a new issue, we increment the major version (e.g., I2-R0), else increment the minor version
        return `I${majorVersion}-R${minorVersion + 1}`;
      };

      const handleIsNewIssueChange = (index, isChecked) => {
        const updatedFields = [...dynamicFields];
        const currentField = updatedFields[index];
    
        currentField.isNewIssue = isChecked;
    
        // When "Is New Issue?" is checked, we set the version to the next major version (e.g., I2-R0)
        if (isChecked) {
            currentField.currentVersion = `I${parseInt(currentField.currentVersion.split('-')[0].slice(1)) + 1}-R0`;
        } else {
          // When "Is New Issue?" is unchecked, revert back to the previous version (e.g., I1-R1)
          const previousVersion = dynamicFields[index - 1]?.currentVersion || 'I1-R0';
          const [major, minor] = previousVersion.split('-');
          const majorVersion = parseInt(major.slice(1));
          const minorVersion = parseInt(minor.slice(1));
         currentField.currentVersion = `I${majorVersion}-R${minorVersion + 1}`;
        }
    
        setDynamicFields(updatedFields);
      };

    const handleRemoveField = (index) => {
        if (dynamicFields.length > 1) {
            const updatedFields = dynamicFields.filter((_, i) => i !== index);
            setDynamicFields(updatedFields);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (open) {
                    // Reset or initialize state when modal opens
                    setSelOriginalVal('N'); // Default original document selection
                    setDynamicFields([{ currentVersion: 'I1-R0', amendParticulars: '', isNewIssue: false,revisionDate: dayjs().format('YYYY-MM-DD'), }]);
    
                    if (revisionElements && revisionElements.length > 0) {
                        setInitialValues((prevValues) => ({
                            ...prevValues,
                            currentVersion: "I" + revisionElements[5] + "-R" + revisionElements[6],
                        }));
                        setNewAmendVersion("I" + revisionElements[5] + "-R" + (parseInt(revisionElements[6], 10) + 1));
                    } else {
                        setInitialValues((prevValues) => ({
                            ...prevValues,
                            currentVersion: "I1-R0",
                            amendParticulars: "Original ISSUE and Revision",
                        }));
                        setNewAmendVersion("I1-R0");
                    }
                }
            } catch (error) {
                setError("An error occurred");
            }
        };
        fetchData();
    }, [open, revisionElements]);
    

    const validationSchema = () =>
        Yup.object().shape({
            amendParticulars: Yup.string()
                .required("Particulars is Required")
                .max(255, "Particulars must not exceed 255 characters"),
        });

    const handleSubmit = async (values) => {
        console.log('values',values);
        let issueDto;

        if (selOriginalVal === 'N') {
            // Original document case
            issueDto = {
                ...values,
                newAmendVersion: newAmendVersion,
                groupDivisionId: groupDivisionId,
                isExisting: selOriginalVal,
            };
        } else {
            // Dynamic fields case
            const dynamicFieldsPayload = dynamicFields.map((field, index) => ({
                currentVersion: field.currentVersion,
                amendParticulars: field.amendParticulars,
                selExistingVal: index === dynamicFields.length - 1 ? 'N' : 'Y',
                revisionDate: field.revisionDate,
            }));
            issueDto = {
                docType: values.docType,
                groupDivisionId: groupDivisionId,
                dynamicFields: dynamicFieldsPayload,
                isExisting: selOriginalVal,
            };
        }   
        console.log('issueDto',issueDto);
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
            setNewAmendVersion("I" + (revisionElements[5] + 1) + "-R0");
        } else {
            setNewAmendVersion("I" + revisionElements[5] + "-R" + (revisionElements[6] + 1));
        }
    };

    if (!open) return null;

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
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
                                        <div className="input-group align-items-center">
                                            <div className="form-check form-check-inline">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    id="isOriginalDocYes"
                                                    name="isOriginalDoc"
                                                    value="N"
                                                    defaultChecked
                                                    onChange={(e) => {
                                                        setSelOriginalVal(e.target.value);
                                                        console.log('Is Original Doc:', e.target.value); // Handle value update here
                                                    }}
                                                />
                                                <label className="form-check-label" htmlFor="isOriginalDocYes">
                                                    Original Doc
                                                </label>
                                            </div>
                                            &nbsp;
                                            <div className="form-check form-check-inline">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    id="isOriginalDocNo"
                                                    name="isOriginalDoc"
                                                    value="Y"
                                                    onChange={(e) => {
                                                        setSelOriginalVal(e.target.value);
                                                        console.log('Is Original Doc:', e.target.value); // Handle value update here
                                                    }}
                                                />
                                                <label className="form-check-label" htmlFor="isOriginalDocNo">
                                                    Existing Doc
                                                </label>
                                            </div>
                                        </div>

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
                                                {selOriginalVal === 'N' ? (
                                                    <div className="form-group text-start">
                                                        <div className="row">
                                                            <div className="col-md-3">
                                                                <label htmlFor="isNewIssue" className="form-label">Is New Issue?</label>
                                                                <div className="input-group align-items-center">
                                                                    <div className="d-inline-block me-1">Off</div>
                                                                    <div className="form-check form-switch">
                                                                        <input
                                                                            type="checkbox"
                                                                            className="form-check-input"
                                                                            id="flexSwitchCheckChecked"
                                                                            checked={values.isNewIssue}
                                                                            disabled={!revisionElements || revisionElements.length === 0}
                                                                            onChange={(event) => {
                                                                                setFieldValue("isNewIssue", event.target.checked);
                                                                                onchangeIsNewIssue(event);
                                                                            }}
                                                                        />
                                                                    </div>
                                                                    <div className="d-inline-block">On</div>
                                                                </div>
                                                            </div>

                                                            <div className="col-md-4">
                                                                <label htmlFor="currentVersion" className="form-label">Current Version:</label>
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
                                                        

                                                        <div className="col-md-5">
                                                            <label htmlFor="amendParticulars" className="form-label">Particulars:</label>
                                                            <div className="input-group">
                                                                <Field
                                                                    as="input" // Change this from "textarea" to "input"
                                                                    id="amendParticulars"
                                                                    name="amendParticulars"
                                                                    type="text" // Use type="text" for a single-line input
                                                                    className={`form-control w-100 ${touched.amendParticulars && errors.amendParticulars ? 'is-invalid' : ''}`}
                                                                />
                                                                <ErrorMessage
                                                                    name="amendParticulars"
                                                                    component="div"
                                                                    className="invalid-feedback"
                                                                />
                                                            </div>

                                                        </div>  
                                                        </div><hr/>
                                                        <div className="text-center">
                                                            <button
                                                                type="submit"
                                                                className="btn submit"
                                                                disabled={!isValid}
                                                            >
                                                                Document ({newAmendVersion})
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="text-start">
                                                        {dynamicFields.map((field, index) => (
                                                            <>
                                                         <div key={index} className="mb-4">
                                                         <div className="row "   style={{display:'flex', alignItems:'center'}}>
                                                         <div className="col-md-2" style={{verticalAlign:'top', position:'relative'}}>
                                                                <label htmlFor={`isNewIssue_${index}`} className="form-label">Is New Issue?</label>
                                                                    <div className="form-check form-switch">
                                                                        <input
                                                                            type="checkbox"
                                                                            className="form-check-input"
                                                                            id={`isNewIssue_${index}`}
                                                                            checked={field.isNewIssue}
                                                                            onChange={(e) => handleIsNewIssueChange(index, e.target.checked)}
                                                                            disabled={dynamicFields.length === 1 ? true : index !== dynamicFields.length - 1}
                                                                        />
                                                                </div>
                                                            </div>

                                                             {/* Current Version Field */}
                                                             <div className="col-md-2" style={{verticalAlign:'top', position:'relative'}}>
                                                                 <label htmlFor={`currentVersion_${index}`} className="form-label">Version:</label>
                                                                 <div className="input-group">
                                                                     <input
                                                                         type="text"
                                                                         className="form-control"
                                                                         id={`currentVersion_${index}`}
                                                                         value={field.currentVersion}
                                                                         readOnly
                                                                     />
                                                                 </div>
                                                             </div>
                                                     
                                                             {/* Particulars Field */}
                                                            <div className="col-md-4">
                                                                <label htmlFor={`amendParticulars_${index}`} className="form-label">Nature / Details of Revision:</label>
                                                                <input
                                                                    id={`amendParticulars_${index}`}
                                                                    name={`dynamicFields[${index}].amendParticulars`}
                                                                    type="text" // Use type="text" for a single-line input
                                                                    className="form-control w-100"
                                                                    value={field.amendParticulars}
                                                                    onChange={(e) => handleDynamicFieldChange(index, 'amendParticulars', e.target.value)}
                                                                />
                                                            </div>
                                                            
                                                            <div className="col-md-2">
                                                                <label htmlFor={`revisionDate_${index}`} className="form-label">Revision Date:</label>
                                                                <DatePicker
                                                                    label="Revision Date"
                                                                    value={dayjs(field.revisionDate)} // Current date value for this field
                                                                    views={['year', 'month', 'day']}
                                                                    onChange={(date) => {
                                                                        const formattedDate = date ? date.format('YYYY-MM-DD') : '';
                                                                        handleDynamicFieldChange(index, 'revisionDate', formattedDate);
                                                                    }}
                                                                    format="DD-MM-YYYY"
                                                                    minDate={
                                                                        index > 0
                                                                            ? dayjs(dynamicFields[index - 1].revisionDate) // Minimum date is the previous row's date
                                                                            : null
                                                                    }
                                                                    maxDate={dayjs()}
                                                                    slotProps={{
                                                                        textField: {
                                                                            size: 'small',
                                                                            error: false,
                                                                            helperText: '',
                                                                        },
                                                                    }}
                                                                    disabled={index !== dynamicFields.length - 1}
                                                                />
                                                            </div>

                                                     
                                                             {/* Remove Button */}
                                                             <div className="col-md-1">
                                                                <button type="button" className="icon-button me-1" onClick={() => handleCloneField(index)} 
                                                                    disabled={index !== dynamicFields.length - 1}
                                                                    >
                                                                   <i className="material-icons" style={{color:'green'}}>add</i>
                                                                </button>
                                                            </div>
                                                             <div className="col-md-1">
                                                                 <button type="button" className="icon-button me-1" onClick={() => handleRemoveField(index)} 
                                                                    disabled={index !== dynamicFields.length - 1}
                                                                    >
                                                                    <i className="material-icons" style={{color:'red'}}>remove</i>
                                                                 </button>
                                                             </div>
                                                         </div>
                                                         <hr />
                                                     </div>  
                                                     </>                      
                                                        ))}   
                                                        <div className="text-center">
                                                        <button type="submit" className="btn submit" disabled={!isValid} > Submit </button>
                                                        </div>                                                   
                                                    </div>

                                                )}

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
        </LocalizationProvider>
    );
};

export default DwpDocsAddIssueDialog;
