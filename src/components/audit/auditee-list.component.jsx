import React, { useEffect, useState } from "react";
import Datatable from "../datatable/Datatable";
import withRouter from "../../common/with-router";
import Navbar from "../Navbar/Navbar";
import Swal from 'sweetalert2';
import { Field, Formik, Form } from "formik";
import './auditor-list.component.css';
import * as Yup from 'yup';
import { Autocomplete, ListItemText, IconButton, TextField } from "@mui/material";
import { AuditeeDto, deleteAuditee, getAuditeeDtoList, getDivisionGroupList, getDivisionList, getEmployee, getProjectList, insertAuditee } from "../../services/audit.service";
import { CustomMenuItem } from '../../services/auth.header';
import { FaTrash } from "react-icons/fa";
import AlertConfirmation from "../../common/AlertConfirmation.component";


const AuditeeListComponent = () => {
    const [showModal, setShowModal] = useState(false);
    const [auditeeList, setAuditeeList] = useState([]);
    const [empdetails, setEmployeeList] = useState([]);
    const [divisionList, setDivisionList] = useState([]);
    const [divisionGroupList, setDivisionGroupList] = useState([]);
    const [projectList, setProjectList] = useState([]);
    const [tblauditeeList, setTblAuditeeList] = useState([]);
    //const [isReady, setIsReady] = useState(false);

    const [filtereddivisionList, setFilteredDivisionList] = useState([]);
    const [filtereddivisionGroupList, setFilteredDivisionGroupList] = useState([]);
    const [filteredprojectList, setFilteredProjectList] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [actionFrom, setActionFrom] = useState("Add");
    const [initialValues, setInitialValues] = useState({
        empId: "",
        headType: "",
        divisionId: "",
        groupId: "",
        projectId: "",
    });

    const validationSchema = Yup.object().shape({
        empId: Yup.string().required("Employee required"),
        headType: Yup.string().required("HeadType required"),
    });

    const columns = [
        { name: 'SN', selector: (row) => row.sn, sortable: true, grow: 1, align: 'text-center' },
        { name: 'Auditee ', selector: (row) => row.auditee, sortable: true, grow: 2, align: 'text-start' },
        { name: 'Group', selector: (row) => row.group, sortable: true, grow: 2, align: 'text-start' },
        { name: 'Division', selector: (row) => row.division, sortable: true, grow: 2, align: 'text-start', },
        { name: 'Project', selector: (row) => row.project, sortable: true, grow: 2, align: 'text-start', },
        { name: 'Action', selector: (row) => row.action, sortable: true, grow: 2, align: 'text-center', },
    ];

    useEffect(() => {
        auditeelist();
    }, []);

    const auditeelist = async () => {
        try {
            const AuditeeList = await getAuditeeDtoList();
            const Emp = await getEmployee();
            const division = await getDivisionList();
            const divisionGroup = await getDivisionGroupList();
            const project = await getProjectList();

            const filtereddivisionList = division.filter(
                (div) => !AuditeeList.some((auditee) => auditee.divisionId === div.divisionId)
            );

            const filtereddivisionGroupList = divisionGroup.filter(
                (divgroup) => !AuditeeList.some((auditee) => auditee.groupId === divgroup.groupId)
            );

            const filteredprojectList = project.filter(
                (proj) => !AuditeeList.some((auditee) => auditee.projectId === proj.projectId)
            );

            setFilteredDivisionList(filtereddivisionList);
            setFilteredDivisionGroupList(filtereddivisionGroupList);
            setFilteredProjectList(filteredprojectList);
            setDivisionList(division);
            setDivisionGroupList(divisionGroup);
            setProjectList(project);
            setEmployeeList(Emp);
            setAuditeeList(AuditeeList);
            // setTableData(AuditeeList);
            // setIsReady(true);

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        setTableData(auditeeList);
    }, [auditeeList]);



    const toggleModal = (action) => {
        setActionFrom(action);
        if (action === 'Add') {
            setInitialValues({
                empId: "",
                headType: "",
                divisionId: "",
                groupId: "",
                projectId: "",
            });
        }
        setShowModal(!showModal);
        if (!showModal) {
            setModalVisible(true)
        } else {
            setModalVisible(false);
        }
    };


    const setTableData = (list) => {
        const mappedData = list.map((item, index) => ({
            sn: index + 1,
            auditee: item.auditee || '-',
            group: item.groupName === "" ? '-' : item.groupName,
            division: item.divisionName === "" ? '-' : item.divisionName,
            project: item.projectName === "" ? '-' : item.projectName,
            action: (
                <><button className=" btn btn-outline-warning btn-sm me-1" onClick={() => editAuditee(item)} title="Edit"> <i className="material-icons"  >edit_note</i></button>
                    <IconButton id="iconButtons" onClick={() => handleToggleIsActive(item.auditeeId)} title="Delete"><FaTrash className='trash-btn' /></IconButton>
                </>
            ),
        }));
        setTblAuditeeList(mappedData);
    }


    const editAuditee = async (item) => {
        const { divisionId, groupId, projectId } = item;

        const divisionIds = auditeeList.filter(data => data.auditeeId !== item.auditeeId).map(req => req.divisionId);
        const filDivivsionList = divisionList.filter(div => !divisionIds.includes(div.divisionId));
        setFilteredDivisionList(filDivivsionList);

        const divisionGroupIds = auditeeList.filter(data => data.auditeeId !== item.auditeeId).map(req => req.groupId);
        const filDivivsionGroupList = divisionGroupList.filter(divgroup => !divisionGroupIds.includes(divgroup.groupId));
        setFilteredDivisionGroupList(filDivivsionGroupList);

        const projectIds = auditeeList.filter(data => data.auditeeId !== item.auditeeId).map(req => req.projectId);
        const filProjectList = projectList.filter(project => !projectIds.includes(project.projectId));
        setFilteredProjectList(filProjectList);

        // Determine headType based on the values
        let headType = "";
        if (divisionId > 0) {
            headType = "D"; // Division
        } else if (groupId > 0) {
            headType = "G"; // Group
        } else if (projectId > 0) {
            headType = "P"; // Project
        } else {
            headType = "Unknown"; // Fallback
        }
        setInitialValues({
            ...item,
            headType, // Update headType dynamically
        });
        setActionFrom('Edit');
        toggleModal('Edit');
    };

    const handleSubmit = async (values) => {
        const isEditMode = Boolean(values.auditeeId);
        const successMessage = isEditMode ? "Updated Successfully!" : " Added Successfully ";
        const unsuccessMessage = isEditMode ? "Update Unsuccessful!" : " Add Unsuccessful ";
        const Title = isEditMode ? "Are you sure to Update ?" : "Are you sure to Add ?";
        const confirm = await AlertConfirmation({
            title: Title,
            message: '',
        });

        // if (!confirm.isConfirmed) return;
        if (confirm) {
            try {
                const result = await insertAuditee(new AuditeeDto(values.empId, values.groupId, values.divisionId, values.projectId, values.headType, values.auditeeId));
                if (result === 200) {
                    const addedAuditee = empdetails.find((employee) => employee.empId === values.empId)?.empName || "Auditee";

                    // Determine the type (Division, Group, Project) and name
                    let targetType = "";
                    let targetName = "";
                    if (values.headType === "D") {
                        targetType = "Division";
                        targetName = divisionList.find((div) => div.divisionId === values.divisionId)?.divisionCode || "Unknown Division";
                    } else if (values.headType === "G") {
                        targetType = "Group";
                        targetName = divisionGroupList.find((group) => group.groupId === values.groupId)?.groupCode || "Unknown Group";
                    } else if (values.headType === "P") {
                        targetType = "Project";
                        targetName = projectList.find((proj) => proj.projectId === values.projectId)?.projectCode || "Unknown Project";
                    }


                    auditeelist();
                    setShowModal(false);
                    setInitialValues({
                        empId: "",
                        headType: "",
                        divisionId: "",
                        groupId: "",
                        projectId: "",
                    });
                    Swal.fire({
                        icon: "success",
                        title: `${addedAuditee} for ${targetType} - ${targetName} `,
                        text: `${successMessage}`,
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
                console.error('Error adding employee:', error);
                Swal.fire('Error!', 'There was an issue adding the auditor.', 'error');
            }
        }
    };

    const handleToggleIsActive = async (auditeeId) => {
        const confirm = await AlertConfirmation({
            title: 'Are you sure to InActive ?',
            message: '',
        });

        // if (!confirm.isConfirmed) return;
        if (confirm) {
            try {
                const response = await deleteAuditee(auditeeId);
                if (response === 200) {
                    await auditeelist();
                    Swal.fire({
                        icon: "success",
                        title: "Auditee InActivated Successfully!",
                        showConfirmButton: false,
                        timer: 1500
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Auditee InActive Unsuccessful!",
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            } catch (error) {
                console.error("Error updating auditee status:", error);
                Swal.fire('Error!', 'There was an issue updating the auditee status.', 'error');
            }
        }
    };


    return (
        <div>
            <Navbar />
            <div className="card">
                <div className="card-body text-center">
                    <h3>Auditee List</h3>
                    <div id="card-body customized-card">
                        <Datatable columns={columns} data={tblauditeeList} />
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
                            <div className={`modal fade show modal-show-custom  ${modalVisible ? 'modal-visible' : ''}`} style={{ display: 'block' }} aria-modal="true" role="dialog">
                                <div className="modal-dialog modal-lg modal-lg-custom">
                                    <div className="modal-content modal-content-custom">
                                        <div className="modal-header bg-secondary d-flex justify-content-between bg-primary text-white modal-header-custom">
                                            <h5 className="modal-title">Auditee {actionFrom}</h5>
                                            <button type="button" className="btn btn-danger modal-header-danger-custom" onClick={() => toggleModal("")} aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>

                                        <div className="modal-body">
                                            <Formik initialValues={initialValues} enableReinitialize validationSchema={validationSchema} onSubmit={handleSubmit}>
                                                {({ setFieldValue, values, touched, errors }) => (
                                                    <Form>
                                                        <div className="row">
                                                            <div className="col-md-6">
                                                                <Field name="empId">
                                                                    {({ field, form }) => (
                                                                        <Autocomplete
                                                                            options={empdetails}
                                                                            getOptionLabel={(employee) => `${employee.empName}, ${employee.empDesigName}`} // Access employee name and designation
                                                                            renderOption={(props, option) => {
                                                                                return (
                                                                                    <CustomMenuItem {...props} key={option.empId}>
                                                                                        <ListItemText primary={`${option.empName}, ${option.empDesigName}`} />
                                                                                    </CustomMenuItem>
                                                                                );
                                                                            }}
                                                                            value={empdetails.find((employee) => employee.empId === form.values.empId) || null}
                                                                            onChange={(event, newValue) => {
                                                                                form.setFieldValue("empId", newValue ? newValue.empId : "");
                                                                                form.setFieldValue("headType", ""); // Reset headType when employee is unselected
                                                                            }}
                                                                            onBlur={() => form.setFieldTouched("empId", true)}
                                                                            renderInput={(params) => (
                                                                                <TextField
                                                                                    {...params}
                                                                                    label="Employee"
                                                                                    size="small"
                                                                                    error={Boolean(form.touched.empId && form.errors.empId)}
                                                                                    helperText={form.touched.empId && form.errors.empId}
                                                                                    fullWidth
                                                                                    variant="outlined"
                                                                                    margin="normal"
                                                                                />
                                                                            )}
                                                                            ListboxProps={{
                                                                                sx: {
                                                                                    maxHeight: 200,
                                                                                    overflowY: "auto",
                                                                                },
                                                                            }}
                                                                        />
                                                                    )}
                                                                </Field>
                                                            </div>
                                                            <div className="col-md-6">
                                                                {/* Radio Buttons */}
                                                                <Field name="empId">
                                                                    {({ form }) => (
                                                                        form.values.empId && (
                                                                            <Field name="headType">
                                                                                {({ field, form }) => (
                                                                                    <div>
                                                                                        <label style={{ marginRight: '15px', padding: '5px', marginTop: '15px' }}>
                                                                                            <input
                                                                                                type="radio"
                                                                                                {...field} value="D" checked={form.values.headType === "D"} onChange={() => form.setFieldValue("headType", "D")}
                                                                                            />
                                                                                            Division
                                                                                        </label>
                                                                                        <label style={{ marginRight: '15px', padding: '5px' }}>
                                                                                            <input
                                                                                                type="radio"
                                                                                                {...field} value="G" checked={form.values.headType === "G"} onChange={() => form.setFieldValue("headType", "G")}
                                                                                            />
                                                                                            Group
                                                                                        </label>
                                                                                        <label style={{ padding: '5px' }}>
                                                                                            <input
                                                                                                type="radio"
                                                                                                {...field} value="P" checked={form.values.headType === "P"} onChange={() => form.setFieldValue("headType", "P")}
                                                                                            />
                                                                                            Project
                                                                                        </label>
                                                                                    </div>
                                                                                )}
                                                                            </Field>
                                                                        )
                                                                    )}
                                                                </Field>
                                                            </div>
                                                        </div>

                                                        {/* Conditionally Render Dropdown Fields */}
                                                        <div className="row">
                                                            <Field name="headType">
                                                                {({ form }) => (
                                                                    <>
                                                                        {/* Division Dropdown */}
                                                                        {form.values.empId && form.values.headType === "D" && (
                                                                            <Field name="divisionId">
                                                                                {({ field }) => (
                                                                                    <Autocomplete
                                                                                        options={filtereddivisionList}
                                                                                        getOptionLabel={(division) => `${division.divisionCode} - ${division.divisionName}`}
                                                                                        renderOption={(props, option) => {
                                                                                            return (
                                                                                                <CustomMenuItem {...props} key={option.divisionId}>
                                                                                                    <ListItemText primary={`${option.divisionCode} - ${option.divisionName}`} />
                                                                                                </CustomMenuItem>
                                                                                            );
                                                                                        }}
                                                                                        value={filtereddivisionList.find((division) => division.divisionId === form.values.divisionId) || null}
                                                                                        onChange={(event, newValue) => {
                                                                                            form.setFieldValue("divisionId", newValue ? newValue.divisionId : "");
                                                                                        }}
                                                                                        onBlur={() => form.setFieldTouched("divisionId", true)}
                                                                                        renderInput={(params) => (
                                                                                            <TextField
                                                                                                {...params}
                                                                                                label="Division Name"
                                                                                                required
                                                                                                size="small"
                                                                                                error={Boolean(form.touched.divisionId && form.errors.divisionId)}
                                                                                                helperText={form.touched.divisionId && form.errors.divisionId}
                                                                                                fullWidth
                                                                                                variant="outlined"
                                                                                                margin="normal"
                                                                                                disabled={!form.values.empId || !form.values.headType} // Disable if no employee or selection type
                                                                                            />
                                                                                        )}
                                                                                        ListboxProps={{
                                                                                            sx: {
                                                                                                maxHeight: 200,
                                                                                                overflowY: "auto",
                                                                                            },
                                                                                        }}
                                                                                    />
                                                                                )}
                                                                            </Field>
                                                                        )}

                                                                        {/* Group Dropdown */}
                                                                        {form.values.empId && form.values.headType === "G" && (
                                                                            <Field name="groupId">
                                                                                {({ field }) => (
                                                                                    <Autocomplete
                                                                                        options={filtereddivisionGroupList}
                                                                                        getOptionLabel={(divisionGroup) => `${divisionGroup.groupCode} - ${divisionGroup.groupName}`}
                                                                                        renderOption={(props, option) => {
                                                                                            return (
                                                                                                <CustomMenuItem {...props} key={option.groupId}>
                                                                                                    <ListItemText primary={`${option.groupCode} - ${option.groupName}`} />
                                                                                                </CustomMenuItem>
                                                                                            );
                                                                                        }}
                                                                                        value={filtereddivisionGroupList.find((divisionGroup) => divisionGroup.groupId === form.values.groupId) || null}
                                                                                        onChange={(event, newValue) => {
                                                                                            form.setFieldValue("groupId", newValue ? newValue.groupId : "");
                                                                                        }}
                                                                                        onBlur={() => form.setFieldTouched("groupId", true)}
                                                                                        renderInput={(params) => (
                                                                                            <TextField
                                                                                                {...params}
                                                                                                label="Group"
                                                                                                required
                                                                                                size="small"
                                                                                                error={Boolean(form.touched.groupId && form.errors.groupId)}
                                                                                                helperText={form.touched.groupId && form.errors.groupId}
                                                                                                fullWidth
                                                                                                variant="outlined"
                                                                                                margin="normal"
                                                                                                disabled={!form.values.empId || !form.values.headType} // Disable if no employee or selection type
                                                                                            />
                                                                                        )}
                                                                                        ListboxProps={{
                                                                                            sx: {
                                                                                                maxHeight: 200,
                                                                                                overflowY: "auto",
                                                                                            },
                                                                                        }}
                                                                                    />
                                                                                )}
                                                                            </Field>
                                                                        )}

                                                                        {/* Project Dropdown */}
                                                                        {form.values.empId && form.values.headType === "P" && (
                                                                            <Field name="projectId">
                                                                                {({ field }) => (
                                                                                    <Autocomplete
                                                                                        options={filteredprojectList}
                                                                                        getOptionLabel={(project) => `${project.projectCode} - ${project.projectName}`}
                                                                                        renderOption={(props, option) => {
                                                                                            return (
                                                                                                <CustomMenuItem {...props} key={option.projectId}>
                                                                                                    <ListItemText primary={`${option.projectCode} - ${option.projectName}`} />
                                                                                                </CustomMenuItem>
                                                                                            );
                                                                                        }}
                                                                                        value={filteredprojectList.find((project) => project.projectId === form.values.projectId) || null}
                                                                                        onChange={(event, newValue) => {
                                                                                            form.setFieldValue("projectId", newValue ? newValue.projectId : "");
                                                                                        }}
                                                                                        onBlur={() => form.setFieldTouched("projectId", true)}
                                                                                        renderInput={(params) => (
                                                                                            <TextField
                                                                                                {...params}
                                                                                                label="Project"
                                                                                                required
                                                                                                size="small"
                                                                                                error={Boolean(form.touched.projectId && form.errors.projectId)}
                                                                                                helperText={form.touched.projectId && form.errors.projectId}
                                                                                                fullWidth
                                                                                                variant="outlined"
                                                                                                margin="normal"
                                                                                                disabled={!form.values.empId || !form.values.headType} // Disable if no employee or selection type
                                                                                            />
                                                                                        )}
                                                                                        ListboxProps={{
                                                                                            sx: {
                                                                                                maxHeight: 200,
                                                                                                overflowY: "auto",
                                                                                            },
                                                                                        }}
                                                                                    />
                                                                                )}
                                                                            </Field>
                                                                        )}
                                                                    </>
                                                                )}
                                                            </Field>
                                                        </div>
                                                        <div className="col text-center subclass">
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
    );
}
export default withRouter(AuditeeListComponent);