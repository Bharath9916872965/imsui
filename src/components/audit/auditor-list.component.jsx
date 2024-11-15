import React, { useEffect, useState } from "react";
import { deleteAditor, getAuditorDtoList, getEmployee, insertAditor } from "../../services/audit.service";
import Datatable from "../datatable/Datatable";
import { Alert, Autocomplete, Snackbar, Switch, TextField, Tooltip } from '@mui/material';
import Navbar from "../Navbar/Navbar";
import './auditor-list.component.css';
import Swal from 'sweetalert2';

const AuditorListComponent = () => {

  const [error, setError] = useState(null);
  const [auditorDtoList, setAuditorDtoList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [empdetails, setEmployeeList] = useState([]);
  const [empIds, setEmpIds] = useState([]);
  const [touched, setTouched] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const handleOnBlur = () => {
    setTouched(true);
  };

  const columns = [
    { name: 'SN', selector: (row) => row.sn, sortable: true, grow: 1, align: 'text-center' },
    { name: 'Auditor', selector: (row) => row.employeeName, sortable: true, grow: 2, align: 'text-start' },
    { name: 'Division', selector: (row) => row.divisionCode, sortable: true, grow: 2, align: 'text-center' },
    { name: 'Action', selector: (row) => row.action, sortable: true, grow: 2, align: 'text-center', },
  ];

  const fetchData = async () => {
    auditorlist();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const auditorlist = async () => {
    try {
      const AuditorDtoList = await getAuditorDtoList();
      const Emp = await getEmployee();
      setEmployeeList(Emp);
      setAuditorDtoList(AuditorDtoList);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const toggleModal = () => {
    setShowModal(!showModal);
    if (!showModal) {
      setTimeout(() => setModalVisible(true), 10);
    } else {
      setModalVisible(false);
    }
  };

  useEffect(() => {
    if (!showModal) {
      setModalVisible(false);
    }
  }, [showModal]);

  const mappedData = auditorDtoList.map((item, index) => ({
    sn: index + 1,
    employeeName: item.empName + ', ' + item.designation || '-',
    divisionCode: item.divisionName || '-',
    action: (
      <Switch
      checked={item.isActive === 1}
      onChange={() => handleToggleIsActive(item.auditorId, item.isActive)} // Toggle function
      color="default"
      sx={{
        '& .MuiSwitch-switchBase.Mui-checked': { color: 'green' },
        '& .MuiSwitch-switchBase': { color: 'red' },
        '& .MuiSwitch-track': { backgroundColor: item.isActive === 1 ? 'green' : 'red' },
      }}
    />
    ),
}));


  const filteredMemberAssignList = empdetails.filter(
    (employee) => !auditorDtoList.some((auditor) => auditor.empId === employee.empId)
  );

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (empIds.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "Please Select Atleast One Employee ..!",
        showConfirmButton: true,
      });
      return;
    }

    Swal.fire({
      title: 'Are you sure Add ?',
      // text: "Do you want to add the selected employees?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'YES',
      cancelButtonText: 'NO',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const result = await insertAditor(empIds);
          if (result === 200) {
            auditorlist();
            setShowModal(false);
            setEmpIds([]);
            Swal.fire({
              icon: "success",
              title: "Auditor Added Successfully!",
              showConfirmButton: false,
              timer: 1500
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Auditor Add Unsuccessful!",
              showConfirmButton: false,
              timer: 1500
            });
          }
        } catch (error) {
          console.error('Error adding employee:', error);
          Swal.fire('Error!', 'There was an issue adding the auditor.', 'error');
        }
      }
    });
  };

  const handleToggleIsActive = async (auditorId, currentStatus) => {
    const isActive = currentStatus === 1 ? 0 : 1;
    try {
      const response = await deleteAditor(auditorId, isActive);
      if (response === 200) {
        auditorlist();  
      } else {

      }
    } catch (error) {
      console.error("Error updating auditor status:", error);
      Swal.fire('Error!', 'There was an issue updating the auditor status.', 'error');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="card">
        <div className="card-body text-center">
          <h3>Auditor List</h3>
          <div id="card-body customized-card">
            {/* {isLoading ? (
                          <h3>Loading...</h3>
                      ) : error ? (
                          <h3 color="error">{error}</h3>
                      ) : ( */}
            <Datatable columns={columns} data={mappedData} />
            {/* )} */}
          </div>
          <div>
            <button className="btn add" onClick={toggleModal}>
              Add
            </button>
          </div>

          {showModal && (
            <div className={`modal fade show ${modalVisible ? 'modal-visible' : ''}`} style={{ display: 'block' }} aria-modal="true" role="dialog">
              <div className="modal-dialog modal-lg modal-lg-custom">
                <div className="modal-content modal-content-custom" >
                  <div className="modal-header d-flex justify-content-between bg-primary text-white">
                    <h5 className="modal-title">Auditor Add</h5>
                    <button type="button" className="btn btn-danger" onClick={toggleModal} aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>

                  <div className="modal-body">
                    <form onSubmit={handleSubmit}>
                      <div className="form-group row align-items-center">
                        <label htmlFor="employeeSelect" className="col-sm-2 col-form-label">Employee</label>
                        <div className="col-sm-10">
                          <Autocomplete
                            multiple
                            options={filteredMemberAssignList}
                            getOptionLabel={(employee) => `${employee.empName}, ${employee.empDesigName}`}
                            value={
                              (empIds || [])
                                .map((empId) => filteredMemberAssignList.find((emp) => Number(emp.empId) === Number(empId)))
                                .filter(Boolean)
                            }
                            onChange={(event, newValue) => {
                              const updatedEmpIds = newValue.map((option) => option.empId);
                              setEmpIds(updatedEmpIds);
                            }}
                            onBlur={handleOnBlur}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Select Employee"
                                fullWidth
                                variant="outlined"
                                size="small"
                                margin="normal"
                                error={touched && empIds.length === 0}
                                helperText={touched && empIds.length === 0 ? "This field is required." : ""}
                              />
                            )}
                            ListboxProps={{
                              sx: {
                                maxHeight: 200,
                                overflowY: "auto",
                              },
                            }}
                            disableCloseOnSelect
                          />
                        </div>
                      </div>
                      <div className="col text-center subclass">
                        <button type="submit" className="btn btn-success">Submit</button>
                      </div>
                    </form>
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
export default AuditorListComponent;