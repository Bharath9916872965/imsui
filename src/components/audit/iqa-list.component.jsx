import React, { useEffect, useState } from "react";
import Datatable from "../datatable/Datatable";
import withRouter from "../../common/with-router";
import Navbar from "../Navbar/Navbar";
import Swal from 'sweetalert2';
import { getIqaDtoList, insertIqa } from "../../services/audit.service";
import { ErrorMessage, Field, Formik, Form } from "formik";
import './auditor-list.component.css';
import * as Yup from 'yup';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { TextField } from "@mui/material";
import { format } from 'date-fns';
import AlertConfirmation from "../../common/AlertConfirmation.component";


const IqaListComponent = () => {
    const [showModal, setShowModal] = useState(false);
    const [iqaList, setIqaList] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [nextIqaNo, setNextIqaNo] = useState(null);
    const [actionFrom, setActionFrom] = useState("Add");
    const [isAddMode,setIsAddMode] = useState(false);

    const [initialValues, setInitialValues] = useState({
        iqaNo: (iqaList.length + 1) + "",
        fromDate: "",
        toDate: "",
        scope: "",
        description: "",
    });

    const validationSchema = Yup.object().shape({
        iqaNo: Yup.string().required("IQA No is required"),
        fromDate: Yup.date().nullable().required("From Date is required"),
        toDate: Yup.date().nullable().required("To Date is required"),
        scope: Yup.string().required("Scope is required"),
        description: Yup.string().required("Description is required"),
    });

    const columns = [
        { name: 'SN', selector: (row) => row.sn, sortable: true, grow: 1, align: 'text-center' },
        { name: 'IQA No', selector: (row) => row.iqaNo, sortable: true, grow: 2, align: 'text-start' },
        { name: 'From Date', selector: (row) => row.fromDate, sortable: true, grow: 2, align: 'text-center' },
        { name: 'To Date', selector: (row) => row.toDate, sortable: true, grow: 2, align: 'text-center', },
        { name: 'Scope', selector: (row) => row.scope, sortable: true, grow: 2, align: 'text-start', },
        { name: 'Description', selector: (row) => row.description, sortable: true, grow: 2, align: 'text-start', },
        { name: 'Action', selector: (row) => row.action, sortable: true, grow: 2, align: 'text-center', },
    ];

    const fetchData = async () => {
        iqalist();
    };

    useEffect(() => {
        fetchData();
    }, []);


    const iqalist = async () => {
        try {
            const IqaLidst = await getIqaDtoList();
            setIqaList(IqaLidst);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const toggleModal = (action) => {
        setActionFrom(action);
        if(action === 'Add'){
            setIsAddMode(true);
            setInitialValues(prevValues =>({
                prevValues,
                fromDate: "",
                toDate: "",
                scope: "",
                description: "",
        }));
        }else{
            setIsAddMode(false)
        }
        setShowModal(!showModal);
        if (!showModal) {
             setModalVisible(true)
        } else {
            setModalVisible(false);
        }
        if (iqaList.length > 0 && action === 'Add') {
            const lastIqaNo = iqaList[0].iqaNo;
            const [prefix, numberPart] = lastIqaNo.split("-"); // Split into prefix and number
            const nextNumber = parseInt(numberPart, 10) + 1; // Ensure numeric conversion and increment
            const nextIqaNo = `${prefix}-${nextNumber}`; // Combine with prefix
            setNextIqaNo(nextIqaNo);
        } else {

        }
    };

    useEffect(() => {
        if (!showModal) {
            setModalVisible(false);
        }
    }, [showModal]);

    const mappedData = iqaList.map((item, index) => ({
        sn: index + 1,
        iqaNo: item.iqaNo || '-',
        fromDate: format(new Date(item.fromDate), 'dd-MM-yyyy') || '-',
        toDate: format(new Date(item.toDate), 'dd-MM-yyyy') || '-',
        scope: item.scope || '-',
        description: item.description || '-',
        action: (
            <button className=" btn btn-outline-warning btn-sm me-1" onClick={() => editIqa(item)} title="Edit"> <i className="material-icons"  >edit_note</i></button>
        ),
    }));

    const editIqa = async (item) => {
        setNextIqaNo(item.iqaNo)
        setInitialValues(item);
        setActionFrom('Edit');
        toggleModal('Edit');

    };

    const handleSubmit = async (values) => {
        let iqaCheck = false;
        const successMessage = isAddMode ?  " Added Successfully!" :" Updated Successfully!";
        const unsuccessMessage = isAddMode ? " Add Unsuccessful!" : " Update Unsuccessful!";
        const Title = isAddMode ?  "Are you sure to Add ?": "Are you sure to Update ?";

        console.log('values.iqaNo',values.iqaNo);

        if(isAddMode){
            if(Number(values.iqaNo) <= 0){
                Swal.fire({
                    icon: "error",
                    title: 'Enter a Positive IQA Number',
                    showConfirmButton: false,
                    timer: 2500
                });
            }else{
                iqaCheck = true;
            }
        }else{
            iqaCheck = true;
        }

        if(iqaCheck){
            const confirm = await AlertConfirmation({
                title: Title,
                message: '',
            });
    
            // if (!confirm.isConfirmed) return;
            if (confirm) {
                try {
                    const result = await insertIqa(values);
                    if (result === 200) {
                        await iqalist();
                        const latestIqaNo = values.iqaNo || "";
    
                        setShowModal(false);
                        setInitialValues('');
                        Swal.fire({
                            icon: "success",
                            title: `${latestIqaNo}`,
                            text: successMessage,
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
                    console.error('Error Adding Iqa:', error);
                    Swal.fire('Error!', 'There was an issue inserting IQA the auditor.', 'error');
                }
            }
        }
    };


    useEffect(() => {
        if (iqaList.length > 0) {
            const latestIqaNo = iqaList[0].iqaNo;
            const [prefix, numberPart] = latestIqaNo.split("-"); // Split into prefix and number
            const nextNumber = parseInt(numberPart, 10) + 1; // Ensure numeric conversion and increment
            const nextIqaNo = `${prefix}-${nextNumber}`; // Combine with prefix
            setInitialValues((prevValues) => ({
                ...prevValues,
                iqaNo: nextIqaNo,
            }));
        }
    }, [iqaList]);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div>
                <Navbar />
                <div className="card">
                    <div className="card-body text-center">
                        <h3>IQA List</h3>
                        <div id="card-body customized-card">
                            <Datatable columns={columns} data={mappedData} />
                        </div>
                        <div>
                            <button className="btn add btn-name" onClick={() => toggleModal('Add')}>
                                Add
                            </button>
                        </div>
                        {showModal && (
                            <>
                                {/* Backdrop */}
                                <div
                                    className={`modal-backdrop fade ${modalVisible ? 'show' : ''}`}
                                    onClick={() => toggleModal("")} // Close modal when clicking backdrop
                                    style={{ zIndex: 1040 }} // Ensure backdrop is behind modal
                                ></div>
                                <div className={`modal fade show modal-show-custom ${modalVisible ? 'modal-visible' : ''}`} style={{ display: 'block' }} aria-modal="true" role="dialog">
                                    <div className="modal-dialog modal-lg modal-lg-custom">
                                        <div className="modal-content modal-content-custom">
                                            <div className="modal-header d-flex justify-content-between bg-secondary text-white modal-header-custom">
                                                <h5 className="modal-title">IQA {actionFrom === "" ? "Add" : actionFrom}</h5>
                                                <button type="button" className="btn btn-danger modal-header-danger-custom" onClick={() => toggleModal("")} aria-label="Close">
                                                    <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>

                                            <div className="modal-body">
                                                <Formik initialValues= {isAddMode ? { iqaNo: iqaList.length === 0 ? "" : nextIqaNo } : initialValues } validationSchema={validationSchema} onSubmit={handleSubmit}>
                                                    {({ errors, touched, handleChange, handleBlur, values }) => (
                                                        <Form>
                                                            <div className="row">
                                                                <div className="col-md-4">
                                                                    {iqaList.length === 0 ? (
                                                                        // Show this field if iqaList is empty
                                                                        <Field
                                                                            id="iqaNo"
                                                                            as={TextField}
                                                                            label="IQA No"
                                                                            size="small"
                                                                            type="number"
                                                                            margin="normal"
                                                                            name="iqaNo"  // Keep this the same for both fields
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            error={Boolean(touched.iqaNo && errors.iqaNo)}
                                                                            helperText={touched.iqaNo && errors.iqaNo}
                                                                            InputProps={{
                                                                                inputProps: { maxLength: 49 },
                                                                                autoComplete: "off",
                                                                            }}
                                                                            style={{ marginTop: "0rem" }}
                                                                        />
                                                                    ) : (
                                                                        // Show this field if iqaList is not empty
                                                                        <Field
                                                                            id="iqaShowNo"
                                                                            as={TextField}
                                                                            label="IQA No"
                                                                            size="small"
                                                                            margin="normal"
                                                                            name="iqaNo"
                                                                            value={nextIqaNo}  // Set incremented IQA No as value
                                                                            InputProps={{
                                                                                readOnly: true,  // Make field readonly
                                                                                inputProps: { maxLength: 100 },
                                                                                autoComplete: "off",
                                                                            }}
                                                                            error={Boolean(touched.iqaNo && errors.iqaNo)}
                                                                            helperText={touched.iqaNo && errors.iqaNo}
                                                                            style={{ marginTop: "0rem" }}
                                                                        />
                                                                    )}
                                                                    <ErrorMessage name="iqaNo" component="div" className="invalid-feedback" />
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <Field name="fromDate">
                                                                        {({ field, form }) => (
                                                                            <DatePicker
                                                                                label="From Date" maxDate={form.values.toDate ? dayjs(form.values.toDate) : null}
                                                                                value={form.values.fromDate ? dayjs(form.values.fromDate) : null} views={['year', 'month', 'day']}
                                                                                onChange={(date) => form.setFieldValue('fromDate', date ? date.format('YYYY-MM-DD') : '')}
                                                                                format="DD-MM-YYYY"
                                                                                slotProps={{
                                                                                    textField: {
                                                                                        size: 'small',
                                                                                        error: Boolean(form.errors.fromDate && form.touched.fromDate),
                                                                                        helperText: form.touched.fromDate && form.errors.fromDate,
                                                                                    }
                                                                                }}
                                                                            />
                                                                        )}
                                                                    </Field>
                                                                    <ErrorMessage name="fromDate" component="div" className="invalid-feedback" />
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <Field name="toDate">
                                                                        {({ field, form }) => (
                                                                            <DatePicker
                                                                                label="To Date" minDate={form.values.fromDate ? dayjs(form.values.fromDate) : null}
                                                                                value={form.values.toDate ? dayjs(form.values.toDate) : null} views={['year', 'month', 'day']}
                                                                                onChange={(date) => form.setFieldValue('toDate', date ? date.format('YYYY-MM-DD') : '')}
                                                                                format="DD-MM-YYYY"
                                                                                slotProps={{
                                                                                    textField: {
                                                                                        size: 'small',
                                                                                        error: Boolean(form.errors.toDate && form.touched.toDate),
                                                                                        helperText: form.touched.toDate && form.errors.toDate,
                                                                                    }
                                                                                }}
                                                                            />
                                                                        )}
                                                                    </Field>
                                                                    <ErrorMessage name="toDate" component="div" className="invalid-feedback" />
                                                                </div>
                                                            </div>
                                                            <div className="row">
                                                                <div className="col-sm-12 text-center">
                                                                    <Field
                                                                        name="scope"
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                        render={({ field, form }) => (
                                                                            <TextField
                                                                                {...field}
                                                                                label="Scope" multiline
                                                                                minRows={3} placeholder="Scope"
                                                                                size="small"
                                                                                error={Boolean(form.errors.scope && form.touched.scope)}
                                                                                helperText={form.touched.scope && form.errors.scope}
                                                                                fullWidth
                                                                                InputProps={{
                                                                                    inputProps: { maxLength: 990 },
                                                                                    autoComplete: "off"
                                                                                }}
                                                                            />
                                                                        )}
                                                                    />
                                                                    <ErrorMessage name="scope" component="div" className="invalid-feedback" />
                                                                </div>
                                                            </div><br />

                                                            <div className="row">
                                                                <div className="col-sm-12 text-center">
                                                                    <Field name="description"
                                                                        render={({ field, form }) => (
                                                                            <TextField
                                                                                {...field}
                                                                                label="Description" multiline
                                                                                minRows={3} placeholder="Description"
                                                                                size="small"
                                                                                error={Boolean(form.errors.description && form.touched.description)}
                                                                                helperText={form.touched.description && form.errors.description}
                                                                                fullWidth
                                                                                InputProps={{
                                                                                    inputProps: { maxLength: 990 },
                                                                                    autoComplete: "off"
                                                                                }}
                                                                            />
                                                                        )}
                                                                    />
                                                                    <ErrorMessage name="description" component="div" className="invalid-feedback" />
                                                                </div>
                                                            </div>
                                                            <div className="d-flex justify-content-center mt-3">
                                                            {actionFrom === "Add" ? <button type="submit" className="btn btn-success">Submit</button> : <button type="submit" className="btn edit">Update</button>}
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
        </LocalizationProvider>
    );

}

export default withRouter(IqaListComponent);