import React, { useEffect, useState } from "react";
import Datatable from "../datatable/Datatable";
import Navbar from "../Navbar/Navbar";
import { ErrorMessage, Field, Form, Formik } from "formik";
import MultipleSelectPicker from "components/selectpicker/multipleSelectPicker";
import AlertConfirmation from "common/AlertConfirmation.component";
import { Autocomplete, IconButton, ListItemText, Switch, TextField, Tooltip } from "@mui/material";
import { CustomMenuItem } from "services/auth.header";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from 'dayjs';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { getEmployee } from "services/audit.service";
import { deleteMrs, getapprovalAuthorityList, getUserManagerList, insertApprovalAuthority, UpdateApprovalAuthority } from "services/admin.serive";
import Swal from "sweetalert2";
import { format } from 'date-fns';

const ApprovalAuthorityListComponent = () => {

    const [showModal, setShowModal] = useState(false);
    const [showDateChangeModal, setshowDateChangeModal] = useState(false);
    const [employee, setEmployee] = useState([]);
    const [mrRepList, setMrRepList] = useState([]);
    const [filmrRepList, setFilMrRepList] = useState([]);
    const [mrList, setMrList] = useState([]);
    const [minMrDate, setMinMrDate] = useState('');
    const [maxMrDate, setMaxMrDate] = useState('');
    const [minMrRepDate, setMinMrRepDate] = useState('');
    const [maxMrRepDate, setMaxMrRepDate] = useState('');
    const [approvalauthorityData, setTblapproveAuthorityData] = useState([]);
    const [selApprovalAuthorityMrList, setselApprovalAuthorityMrList] = useState([]);
    const [selApprovalAuthorityMrRepList, setselApprovalAuthorityMrRepList] = useState([]);
    const [mrsId, setmrsId]=useState('');
    const [empName, setEmpName] = useState('');
    const [initialValues, setInitialValues] = useState({
        mrRepEmpId: [],
        mrempId: "",
        mrType: "",
        mrFrom  : "",
        mrTo: "",
    });

    const [editdatavalues, setEditdatavalues] = useState({
        mrFrom  : "",
        mrTo: "",   
    });
    useEffect(() => {
        approvalAuthorityList();
    }, []);

    const columns = [
        { name: "SN", selector: (row) => row.sn, sortable: true, align: 'text-center' },
        { name: "Role", selector: (row) => row.role, sortable: true, align: 'text-center' },
        { name: "Employee", selector: (row) => row.employeeName, sortable: true, align: 'text-start' },
        { name: "From Date", selector: (row) => row.fromDate, sortable: true, align: 'text-center' },
        { name: "To Date", selector: (row) => row.toDate, sortable: true, align: 'text-center' },
        { name: "Action", selector: (row) => row.action, sortable: true, align: 'text-center', },
    ];


    const approvalAuthorityList = async () => {
        const empdetails = await getEmployee();
        setEmployee(empdetails);
        const approvalAuthList = await getapprovalAuthorityList();
        const userManagerList = await getUserManagerList();
        const mrList = approvalAuthList.filter(data => data.mrType === 'MR')
        const mrRepList = approvalAuthList.filter(data => (data.mrType === 'MR Rep' || data.mrType === 'MR'))
        setselApprovalAuthorityMrList(mrList);
        setselApprovalAuthorityMrRepList(mrRepList);
        const { minDate: minMrFrom, maxDate: maxMrTo } = getMinMaxDates(mrList);
        const { minDate: minMrRepFrom, maxDate: maxMrRepTo } = getMinMaxDates(mrRepList);
        setMinMrDate(minMrFrom)
        setMaxMrDate(maxMrTo)
        setMinMrRepDate(minMrRepFrom)
        setMaxMrRepDate(maxMrRepTo)

        const filterMRRepList = userManagerList.filter(data => data.formRoleName === 'MR Rep');
        const filterMRList = userManagerList.filter(data => data.formRoleName === 'MR');

       const repList = empdetails.map((item) => ({
            value: item.empId,
            label: `${item.empName}, ${item.empDesigName}`,
        }))
        setMrRepList(repList);
        setFilMrRepList(repList)

        setMrList(filterMRList);
        mappedData(approvalAuthList);
    }

    const mappedData = (list) => {
        setTblapproveAuthorityData(
            list.map((item, index) => ({
                sn: index + 1,
                role: `${item.mrType || "-"}`,
                employeeName: `${item.empName || "-"}`,
                fromDate: format(new Date(item.mrFrom), 'dd-MM-yyyy') || '-',
                toDate: format(new Date(item.mrTo), 'dd-MM-yyyy') || '-',
                action: (
                    <>
                    {item.isActive===1 &&  <button className=" btn btn-outline-warning btn-sm me-1" onClick={() => editApprovalAuthority(item)} title="Edit"> <i className="material-icons"  >edit_note</i></button>}
                        <Switch
                            checked={item.isActive === 1}
                            onChange={() => handleToggleIsActive(item.mrsId, item.isActive)}
                            color="default"
                            sx={{
                                "& .MuiSwitch-switchBase.Mui-checked": { color: "green" },
                                "& .MuiSwitch-switchBase": { color: "red" },
                                "& .MuiSwitch-track": { backgroundColor: item.isActive === 1 ? "green" : "red" },
                            }}
                        />
                    </>
                ),
            }))
        );
    };

    const editApprovalAuthority = async(item) =>{
        setshowDateChangeModal(true);
        setEditdatavalues({
            mrFrom: item.mrFrom,
            mrTo: item.mrTo,
        })
        setmrsId(item.mrsId);
        setEmpName(item.mrType+" - "+item.empName);
    }
    const handleToggleIsActive = async (mrsId, currentStatus) => {
        try {
            const response = await deleteMrs(mrsId, currentStatus === 1 ? 0 : 1);
            if (response === 200) approvalAuthorityList();
        } catch (error) {
            console.error("Error updating approvalAuthority status:", error);
            Swal.fire("Error!", "There was an issue updating the approvalAuthority status.", "error");
        }
    };

        // Helper function for min/max date calculation
        const getMinMaxDates = (list) => {
            if (!list || list.length === 0) return { minDate: null, maxDate: null };
    
            return list.reduce(
                (acc, item) => {
                    const fromDate = new Date(item.mrFrom);
                    const toDate = new Date(item.mrTo);
                    acc.minDate = !acc.minDate || fromDate < acc.minDate ? fromDate : acc.minDate;
                    acc.maxDate = !acc.maxDate || toDate > acc.maxDate ? toDate : acc.maxDate;
                    return acc;
                },
                { minDate: null, maxDate: null }
            );
        };

    const handleSubmit = async (values) => {
        if (values.mrType === "") {
            return Swal.fire("Warning", "Please Select Approval Authority", "warning");
        }
        if (values.mrFrom === "") {
            return Swal.fire("Warning", "Please Select From Date", "warning");
        }
        if (values.mrTo === "") {
            return Swal.fire("Warning", "Please Select To Date", "warning");
        }
        if (values.mrType === "MR Rep" && values.mrRepEmpId.length === 0) {
            return Swal.fire("Warning", "Please Select MR Rep", "warning");
        }
        if (values.mrType === "MR" && values.mrempId === "") {
            return Swal.fire("Warning", "Please Select MR", "warning");
        }
    
        //const { minDate: minMrFrom, maxDate: maxMrTo } = getMinMaxDates(selApprovalAuthorityMrList);
    
        if (values.mrType === "MR") {
            const dates = [new Date(values.mrFrom), new Date(values.mrTo)];
    
            if (minMrDate && maxMrDate && dates[0] <= maxMrDate && dates[1] >= minMrDate) {
                return Swal.fire({
                    icon: "warning",
                    title: "Warning",
                    html: "Approval Authority Exist for Selected Dates.<br>Please Select Different Dates.",
                    confirmButtonText: "OK"
                });
            }
            
        }
    
        // Confirmation dialog
        const confirm = await AlertConfirmation({
            title: "Are you sure to Add?",
            message: "",
        });
    
        if (confirm) {
            try {
                const response = await insertApprovalAuthority(values);
                if (response === 200) {
                    approvalAuthorityList();
                    setShowModal(false);
                    setInitialValues({
                        mrRepEmpId: [],
                        mrempId: "",
                        mrType: "",
                        mrFrom: "",
                        mrTo: "",
                    });
                    Swal.fire({
                        icon: "success",
                        title: "",
                        text: "Approval Authority Added Successfully!",
                        showConfirmButton: false,
                        timer: 1500,
                    });
                } else {
                    Swal.fire("Error!", "Failed to Add Approval Authority!", "error");
                }
            } catch (error) {
                console.error("Error adding auditor:", error);
                Swal.fire("Error!", "There was an issue adding the Approval Authority.", "error");
            }
        }
    };

    const filMrRep = (type,from,to)=>{
        if(type === 'MR Rep' && from !== '' && to !== ''){
            const empIds = [];
            selApprovalAuthorityMrRepList.forEach(item =>{
                if(new Date(from) <= new Date(item.mrTo) && new Date(to) >= new Date(item.mrFrom)){
                    empIds.push(item.empId)
                }
            })
            const list =mrRepList.filter(data => !empIds.includes(data.value));
            setFilMrRepList(list);
        }
    }
    
    const handleSubmitUpdate = async (values) => {
        const finalValues = {
            ...values,
            mrsId,
        }
        const confirm = await AlertConfirmation({
          title: "Are you sure to Update Approval Authority ?",
          message: '',
        });
        if (confirm) {
          try {
            const response = await UpdateApprovalAuthority(finalValues);
            if (response > 0) {
                approvalAuthorityList();
                setshowDateChangeModal(false);
                setEditdatavalues({
                mrFrom  : "",
                mrTo: "",  
              })
              Swal.fire({
                icon: "success",
                title: `Approval Authority `,
                text: "Updated SuccessFully ",
                showConfirmButton: false,
                timer: 1500
              });
            } else {
              Swal.fire("Error!", "Failed to Update Approval Authority !", "error");
            }
          } catch (error) {
            console.error("Error Update Approval Authority :", error);
            Swal.fire("Error!", "There was an issue Update Approval Authority.", "error");
          }
        }
      }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div>
                <Navbar />
                <div className="card">
                    <div className="card-body text-center">
                        <h3>Approval Authority List</h3>
                        <div id="card-body customized-card">
                            {<Datatable columns={columns} data={approvalauthorityData} />}
                        </div>
                        <div>
                            <button className="btn add btn-name" onClick={() => setShowModal(true)}>
                                Add
                            </button>
                        </div>
                        {showModal && (
                            <>
                                {/* Backdrop */}
                                <div className="modal-backdrop show" style={{ zIndex: 1040 }}></div>
                                <div className="modal fade show" style={{ display: "block" }}>
                                    <div className="modal-dialog modal-lg modal-lg-custom" style={{ width: '33%', maxWidth: '33%' }}>
                                        <div className="modal-content modal-content-custom">
                                            <div className="modal-header bg-secondary d-flex justify-content-between text-white modal-header-custom">
                                                <h5 className="modal-title">Approval Authority Add </h5>
                                                <button type="button" className="btn btn-danger modal-header-danger-custom" onClick={() => setShowModal(false)}>
                                                    &times;
                                                </button>
                                            </div>
                                            <div className="modal-body">
                                                <Formik initialValues={initialValues} enableReinitialize onSubmit={handleSubmit}>
                                                    {({ values, touched, errors, setFieldValue, setFieldTouched }) => (
                                                        <Form>
                                                            <div className="row">
                                                                <div className="col-md-4">
                                                                    <Field name="mrType">
                                                                        {({ field,form }) => (
                                                                            <Autocomplete
                                                                                options={['MR', 'MR Rep']}
                                                                                getOptionLabel={(option) => option.toString()}
                                                                                renderOption={(props, option) => (
                                                                                    <CustomMenuItem {...props} key={option}>
                                                                                        <ListItemText primary={option} />
                                                                                    </CustomMenuItem>
                                                                                )}
                                                                                value={values.mrType || ''}
                                                                                onChange={(event, newValue) => {
                                                                                    setFieldValue('mrType', newValue || '');
                                                                                    setFieldValue('mrRepEmpId', []); // Reset related fields
                                                                                    setFieldValue('mrempId', '');
                                                                                    filMrRep(newValue,form.values.mrFrom,form.values.mrTo)
                                                                                }}
                                                                                onBlur={() => setFieldTouched("mrType", true)}
                                                                                renderInput={(params) => (
                                                                                    <TextField {...params} label="Approval Authority" size="small" fullWidth variant="outlined" margin="normal" />
                                                                                )}
                                                                                disableClearable
                                                                                ListboxProps={{ sx: { maxHeight: 200, overflowY: "auto" } }}
                                                                            />
                                                                        )}
                                                                    </Field>
                                                                </div>
                                                                <div className="col-md-4" style={{ marginTop: '1rem' }}>
                                                                    <Field name="mrFrom">
                                                                        {({ field, form }) => (
                                                                            <DatePicker
                                                                                label="From Date"
                                                                                maxDate={dayjs()}
                                                                               // maxDate={form.values.mrTo ? dayjs(form.values.mrTo) : null}
                                                                                value={form.values.mrFrom ? dayjs(form.values.mrFrom) : null} views={['year', 'month', 'day']}
                                                                                onChange={(date) => {form.setFieldValue('mrFrom', date ? date.format('YYYY-MM-DD') : '');filMrRep(form.values.mrType,date ? date.format('YYYY-MM-DD') : '',form.values.mrTo);}}
                                                                                format="DD-MM-YYYY"
                                                                                slotProps={{
                                                                                    textField: {
                                                                                        size: 'small',
                                                                                        error: Boolean(form.errors.mrFrom && form.touched.mrFrom),
                                                                                        helperText: form.touched.mrFrom && form.errors.mrFrom,
                                                                                    }
                                                                                }}
                                                                            />

                                                                        )}
                                                                    </Field>
                                                                    <ErrorMessage name="mrFrom" component="div" className="invalid-feedback" />
                                                                </div>
                                                                <div className="col-md-4" style={{ marginTop: '1rem' }}>
                                                                    <Field name="mrTo">
                                                                        {({ field, form }) => (
                                                                            <DatePicker
                                                                                label="To Date" minDate={form.values.mrFrom ? dayjs(form.values.mrFrom) : null}
                                                                                value={form.values.mrTo ? dayjs(form.values.mrTo) : null} views={['year', 'month', 'day']}
                                                                                onChange={(date) => {form.setFieldValue('mrTo', date ? date.format('YYYY-MM-DD') : ''); filMrRep(form.values.mrType,form.values.mrFrom,date ? date.format('YYYY-MM-DD') : '');}}
                                                                                format="DD-MM-YYYY"
                                                                                slotProps={{
                                                                                    textField: {
                                                                                        size: 'small',
                                                                                        error: Boolean(form.errors.mrTo && form.touched.mrTo),
                                                                                        helperText: form.touched.mrTo && form.errors.mrTo,
                                                                                    }
                                                                                }}
                                                                            />
                                                                        )}
                                                                    </Field>
                                                                    <ErrorMessage name="mrTo" component="div" className="invalid-feedback" />
                                                                </div>
                                                            </div>
                                                            <div className="row">
                                                                {values.mrType === 'MR Rep' && (
                                                                    <Field name="mrRepEmpId">
                                                                        {({ form }) => (
                                                                            <MultipleSelectPicker
                                                                                options={filmrRepList}
                                                                                label="MR Rep"
                                                                                value={filmrRepList.length > 0 && filmrRepList.filter((item) => values.mrRepEmpId.includes(item.value))}
                                                                                handleChange={(newValue) =>
                                                                                    setFieldValue("mrRepEmpId", newValue.map((item) => item.value))
                                                                                }
                                                                            />
                                                                        )}
                                                                    </Field>
                                                                )}
                                                                {values.mrType === 'MR' && (
                                                                    <Field name="mrempId">
                                                                        {({ field, form }) => (
                                                                            <Autocomplete options={employee} getOptionLabel={option => option.empName + ", " + option.empDesigName}
                                                                                renderOption={(props, option) => {
                                                                                    return (
                                                                                        <CustomMenuItem {...props} key={option.empId}>
                                                                                            <ListItemText primary={option.empName + ", " + option.empDesigName} />
                                                                                        </CustomMenuItem>
                                                                                    );
                                                                                }}
                                                                                value={employee.find(emp => emp.empId === form.values.mrempId) || null}
                                                                                ListboxProps={{ sx: { maxHeight: 200, overflowY: 'auto' } }}
                                                                                onChange={(event, newValue) => { setFieldValue("mrempId", newValue ? newValue.empId : ''); }}
                                                                                renderInput={(params) => (<TextField {...params} label="MR" size="small" margin="normal" variant="outlined"
                                                                                    error={touched.mrempId && Boolean(errors.mrempId)}
                                                                                    helperText={touched.mrempId && errors.mrempId} />)}
                                                                                disableClearable
                                                                            />

                                                                        )}
                                                                    </Field>
                                                                )}
                                                            </div>
                                                            <div className="col text-center subclass">
                                                                <button type="submit" className="btn btn-success">
                                                                    Submit
                                                                </button>
                                                            </div>
                                                        </Form>
                                                    )}
                                                </Formik>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}<br />
                        {showDateChangeModal && (
                            <>
                                {/* Backdrop */}
                                <div className="modal-backdrop show" style={{ zIndex: 1040 }}></div>
                                <div className="modal fade show" style={{ display: "block" }}>
                                    <div className="modal-dialog modal-lg modal-lg-custom" style={{ maxWidth: "35%", width: "35%" }}>
                                        <div className="modal-content modal-content-custom" style={{ minHeight: "300px" }}>
                                            <div className="modal-header bg-secondary text-white modal-header-custom d-flex justify-content-between">
                                                <h5 className="modal-title">Approval Authority Update</h5>
                                                <button type="button" className="btn btn-danger modal-header-danger-custom" onClick={() => setshowDateChangeModal(false)} aria-label="Close">
                                                    &times;
                                                </button>
                                            </div>
                                            <div className="modal-body">
                                                <Formik initialValues={editdatavalues} enableReinitialize  onSubmit={handleSubmitUpdate} >
                                                    {({ values }) => (
                                                        <Form>

                                                            <div className="row" style={{marginLeft: '24px', color: 'blue'}}>
                                                            {empName}
                                                            </div>
                                                            <div className="row">
                                                            
                                                                <div className="col-md-6" style={{ marginTop: '1rem' }}>
                                                                    <Field name="mrFrom">
                                                                        {({ field, form }) => (
                                                                            <DatePicker
                                                                                label="From Date" maxDate={form.values.mrTo ? dayjs(form.values.mrTo) : null}
                                                                                value={form.values.mrFrom ? dayjs(form.values.mrFrom) : null} views={['year', 'month', 'day']}
                                                                                onChange={(date) => {form.setFieldValue('mrFrom', date ? date.format('YYYY-MM-DD') : '');filMrRep(form.values.mrType,date ? date.format('YYYY-MM-DD') : '',form.values.mrTo);}}
                                                                                format="DD-MM-YYYY"
                                                                                readOnly
                                                                                slotProps={{
                                                                                    textField: {
                                                                                        size: 'small',
                                                                                        error: Boolean(form.errors.mrFrom && form.touched.mrFrom),
                                                                                        helperText: form.touched.mrFrom && form.errors.mrFrom,
                                                                                    }
                                                                                }}
                                                                            />

                                                                        )}
                                                                    </Field>
                                                                    <ErrorMessage name="mrFrom" component="div" className="invalid-feedback" />
                                                                </div>
                                                                <div className="col-md-6" style={{ marginTop: '1rem' }}>
                                                                    <Field name="mrTo">
                                                                        {({ field, form }) => (
                                                                            <DatePicker
                                                                                label="To Date" minDate={form.values.mrFrom ? dayjs(form.values.mrFrom) : null}
                                                                                value={form.values.mrTo ? dayjs(form.values.mrTo) : null} views={['year', 'month', 'day']}
                                                                                onChange={(date) => {form.setFieldValue('mrTo', date ? date.format('YYYY-MM-DD') : ''); filMrRep(form.values.mrType,form.values.mrFrom,date ? date.format('YYYY-MM-DD') : '');}}
                                                                                format="DD-MM-YYYY"
                                                                                slotProps={{
                                                                                    textField: {
                                                                                        size: 'small',
                                                                                        error: Boolean(form.errors.mrTo && form.touched.mrTo),
                                                                                        helperText: form.touched.mrTo && form.errors.mrTo,
                                                                                    }
                                                                                }}
                                                                            />
                                                                        )}
                                                                    </Field>
                                                                    <ErrorMessage name="mrTo" component="div" className="invalid-feedback" />
                                                                </div>
                                                            </div><br /><br />
                                                            <div className="col text-center subclass mt-3">
                                                                <button type="submit" className="btn btn-success me-2">
                                                                    Submit
                                                                </button>
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
export default ApprovalAuthorityListComponent;