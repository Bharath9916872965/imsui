import React, { useEffect, useState } from "react";
// import Datatable from "../../datatable/Datatable";
import { getAuditorDtoList, getEmployee, insertAditor} from "../../services/audit.service";
import Datatable from "../datatable/Datatable";
import {Alert, Autocomplete, Snackbar, TextField} from '@mui/material';

const AuditorListComponent = () => {

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [auditorDtoList, setAuditorDtoList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [empdetails, setEmployeeList] = useState([]);
    const [empIds,setEmpIds] = useState([]);
    const [touched, setTouched] = useState(false); 
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleOnBlur = () => {
    setTouched(true); 
  };
    const columns = [
      { name: 'SN', selector: (row) => row.sn , sortable: true, grow: 1, align: 'text-center', width: '12%' },
      { name: 'EmpName', selector: (row) => row.employeeName, sortable: true, grow: 2, align: 'text-center', width: '22%' },
      { name: 'Designation', selector: (row) => row.deisg, sortable: true, grow: 3, align: 'text-left', width: '22%' },
      { name: 'DivisionCode', selector: (row) => row.divisionCode, sortable: true, grow: 2, align: 'text-left', width: '22%' },
      { name: 'Action', selector: (row) => row.action, sortable: true, grow: 2, align: 'text-left', width: '22%' },
    ];

    useEffect(() => {
        const fetchData = async () => {
          auditorlist();
        };
       
        fetchData();
      }, []);

      const handleSnackbarClose = () => {
        setOpenSnackbar(false);
      };

      const auditorlist = async() => {
        try {
          const AuditorDtoList = await getAuditorDtoList();
          const Emp = await getEmployee();
          const mappedData = AuditorDtoList.map((item, index) => ({
            sn: index + 1,
            employeeName: item.empName || '-',
            deisg: item.designation || '-',
            divisionCode: item.divisionName || '-',
            action: (
                      <div>
                        <button>Remove</button>
                      </div>
                  ),
        }));
        const filEmp = Emp.map(item=>({
          key: item.empId,
          value : item.empId,
          label : item.empName
      }));
          setAuditorDtoList(mappedData);
          setEmployeeList(filEmp);
          setIsLoading(false);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      const toggleModal = () => setShowModal(!showModal);
      const handleSubmit = (e) => {
        e.preventDefault();
        if (empIds.length === 0) {
          alert("Please select at least one employee.");
          return;
        }
        insertSelectedEmployees(empIds);
      };
      
    const insertSelectedEmployees = async (selectedEmpIds) => {
      try {
          const result= await insertAditor(selectedEmpIds);
          const message = result; // Assuming result is the message string
          const snackbarSeverity = message.includes("unsuccessful") ? "error" : "success";
          
          setSnackbarMessage(message);
          setSnackbarSeverity(snackbarSeverity);
          setOpenSnackbar(true);
          setShowModal(false);
          setEmpIds([]); 
          auditorlist();
      } catch (error) {
          console.error("Error inserting employees:", error);
      }
  };
    return (
      <div className="card">
          <div className="card-body text-center">
            <h1>Auditor List</h1>
           <div id="card-body customized-card">
                      {isLoading ? (
                          <h3>Loading...</h3>
                      ) : error ? (
                          <h3 color="error">{error}</h3>
                      ) : (
                          <Datatable columns={columns} data={auditorDtoList} />
                      )}
            </div> 
            <div>
              <button color="primary"  onClick={toggleModal}>
                Add
              </button>
            </div> 

            {showModal && (
          <div className="modal fade show" style={{ display: 'block' }} aria-modal="true" role="dialog">
            <div className="modal-dialog modal-lg" style={{ maxWidth: '40%' }}>
              <div className="modal-content" style={{ minHeight: '400px' }}>
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
                            options={empdetails}
                            getOptionLabel={(option) => option.label}
                            renderOption={(props, option) => (
                              <li {...props} key={option.key}>
                                {option.label}
                              </li>
                            )}
                            value={
                              (empIds || []).map(
                                (empId) => empdetails.find((emp) => Number(emp.value) === Number(empId))
                              ).filter(Boolean)
                            }
                            onChange={(event, newValue) => { 
                            const updatedEmpIds = newValue.map((option) => option.value); 
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
                    <div><br /><br /><br />
                      <button type="submit" className="btn btn-success">Submit</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
  </div>
  <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Positioning at the top center
        sx={{ marginTop: '50px' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
</div>
); 

}
export default AuditorListComponent;