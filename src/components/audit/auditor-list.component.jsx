import React, { useEffect, useState } from "react";
import { deleteAditor, getAuditorDtoList, getEmployee, insertAditor } from "../../services/audit.service";
import Datatable from "../datatable/Datatable";
import { Switch } from "@mui/material";
import { Field, Formik, Form } from "formik";
import Navbar from "../Navbar/Navbar";
import "./auditor-list.component.css";
import Swal from "sweetalert2";
import MultipleSelectPicker from "../selectpicker/multipleSelectPicker";
import AlertConfirmation from "../../common/AlertConfirmation.component";

const AuditorListComponent = () => {
  const [showModal, setShowModal] = useState(false);
  const [filOptions, setFilOptions] = useState([]);
  const [tblauditorData, setTblAuditorData] = useState([]);
  const [initialValues, setInitialValues] = useState({ empId: [] });

  const columns = [
    { name: "SN", selector: (row) => row.sn, sortable: true, align: 'text-center' },
    { name: "Auditor", selector: (row) => row.employeeName, sortable: true, align: 'text-start' },
    { name: "Division", selector: (row) => row.divisionCode, sortable: true, align: 'text-center' },
    { name: "Action", selector: (row) => row.action, sortable: true, align: 'text-center', },
  ];

  useEffect(() => {
    auditorlist();
  }, []);

  const auditorlist = async () => {
    try {
      const [AuditorDtoList, Emp] = await Promise.all([getAuditorDtoList(), getEmployee()]);
      const filteredMemberAssignList = Emp.filter(
        (employee) => !AuditorDtoList.some((auditor) => auditor.empId === employee.empId)
      );
      setFilOptions(
        filteredMemberAssignList.map((item) => ({
          value: item.empId,
          label: `${item.empName}, ${item.empDesigName}`,
        }))
      );
      setTableDate(AuditorDtoList);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {

    }
  };

  const setTableDate = (list) => {
    setTblAuditorData(
      list.map((item, index) => ({
        sn: index + 1,
        employeeName: `${item.empName || "-"}, ${item.designation || "-"}`,
        divisionCode: item.divisionName || "-",
        action: (
          <Switch
            checked={item.isActive === 1}
            onChange={() => handleToggleIsActive(item.auditorId, item.isActive)}
            color="default"
            sx={{
              "& .MuiSwitch-switchBase.Mui-checked": { color: "green" },
              "& .MuiSwitch-switchBase": { color: "red" },
              "& .MuiSwitch-track": { backgroundColor: item.isActive === 1 ? "green" : "red" },
            }}
          />
        ),
      }))
    );
  };

  const handleToggleIsActive = async (auditorId, currentStatus) => {
    try {
      const response = await deleteAditor(auditorId, currentStatus === 1 ? 0 : 1);
      if (response === 200) auditorlist();
    } catch (error) {
      console.error("Error updating auditor status:", error);
      Swal.fire("Error!", "There was an issue updating the auditor status.", "error");
    }
  };

  const handleSubmit = async (values) => {
    if (values.empId.length === 0) {
      return Swal.fire("Warning", "Please Select Atleast One Employee!", "warning");
    }
    const confirm = await AlertConfirmation({
      title: 'Are you sure to Add ?',
      message: '',
    });

    // if (!confirm.isConfirmed) return;
    if (confirm) {
      try {
        const response = await insertAditor(values.empId);

        if (response === 200) {
          const addedEmployees = filOptions
            .filter(option => values.empId.includes(option.value))
            .map(option => option.label)
            .join(", ");
          auditorlist();
          setShowModal(false);
          setInitialValues({ empId: [] });
          Swal.fire({
            icon: "success",
            title: `${addedEmployees} `,
            text: "Added Successfully!",
            showConfirmButton: false,
            timer: 1500
          });
        } else {
          Swal.fire("Error!", "Failed to Add Auditor!", "error");
        }
      } catch (error) {
        console.error("Error adding auditor:", error);
        Swal.fire("Error!", "There was an issue adding the auditor.", "error");
      }
    }
  };

  return (
    <div>
      <Navbar />
      <div className="card">
        <div className="card-body text-center">
          <h3>Auditor List</h3>
          <div id="card-body customized-card">
            {<Datatable columns={columns} data={tblauditorData} />}
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
                <div className="modal-dialog modal-lg modal-lg-custom">
                  <div className="modal-content modal-content-custom">
                    <div className="modal-header bg-secondary d-flex justify-content-between text-white modal-header-custom">
                      <h5 className="modal-title">Auditor Add</h5>
                      <button type="button" className="btn btn-danger modal-header-danger-custom" onClick={() => setShowModal(false)}>
                        &times;
                      </button>
                    </div>
                    <div className="modal-body">
                      <Formik initialValues={initialValues} enableReinitialize onSubmit={handleSubmit}>
                        {({ values, setFieldValue }) => (
                          <Form>
                            <div className="form-group">
                              <Field name="empId">
                                {({ form }) => (
                                  <MultipleSelectPicker
                                    options={filOptions}
                                    label="Employee"
                                    value={filOptions.filter((item) => values.empId.includes(item.value))}
                                    handleChange={(newValue) =>
                                      setFieldValue("empId", newValue.map((item) => item.value))
                                    }
                                  />
                                )}
                              </Field>
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
          )}
        </div>
      </div>
    </div>
  );
};

export default AuditorListComponent;
