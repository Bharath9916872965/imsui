import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Navbar from "../Navbar/Navbar";
import dayjs from 'dayjs';
import {
  Autocomplete,
  Typography,
  TextField,
  Grid,
  Box,
  ListItemText
} from "@mui/material";
import { MobileDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Formik, Form, Field } from "formik";
import {  getAuditStampingList,getEmployeesList,getLoginEmployeeDetails } from '../../services/header.service';


import Datatable from "../datatable/Datatable";

const AuditStamping = () => {

  const [auditStampingList, setAuditStampingList] = useState([]);
  const [employeesList, setEmployeesList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [initialValues, setInitialValues] = useState({
    selectedEmp: "",
    fromDate: dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
    toDate: dayjs().format('YYYY-MM-DD')
  });


  const formatTime = (timeString) => {
    if (!timeString) return "--";
    const time = dayjs(timeString, 'HH:mm:ss');
    return time.format('hh:mm:ss A');
  };

  const formatDateTime = (datetimeString) => {
    if (!datetimeString) return "--";
    const date = dayjs(datetimeString, 'YYYY-MM-DD HH:mm:ss');
    return date.format('MMM D, YYYY hh:mm:ss A');
  };


  const formatDate = (dateString) => {
    if (!dateString) return "--";
    const date = dayjs(dateString, 'YYYY-MM-DD HH:mm:ss');
    return date.format('MMM D, YYYY ');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const employees = await getEmployeesList();
        const { empId, qmsFormRoleId } = await getLoginEmployeeDetails();

        const defaultEmpId = empId;
        const roleId = qmsFormRoleId;

        const { fromDate, toDate } = initialValues;

        if(roleId === 2 || roleId === 7){
          setEmployeesList(employees);
        }else{
          const filteredEmployees = employees.filter(emp => emp.empId === defaultEmpId);
          setEmployeesList(filteredEmployees);
        }

        const auditList = await getAuditStampingList(defaultEmpId, fromDate, toDate);

        const mappedData = auditList.map((item, index) => ({
          sn: index + 1,
          loginDate:  formatDate(item.loginDateTime) || '--',
          loginTime:  formatTime(item.loginTime) || '--',
          ipAddress:  item.ipAddress  || '--',
          logoutType: item.logoutTypeDisp || '--',
          logoutDateTime: formatDateTime(item.logOutDateTime) || '--'
        }));
        setAuditStampingList(mappedData);
        setIsLoading(false);
        

        setInitialValues({
          ...initialValues,
          selectedEmp: defaultEmpId
        });
        setIsLoading(false);
      } catch (error) {
        setError(error);
        setIsLoading(false);
        setSnackbarOpen(true);
        setSnackbarMessage("Error fetching data");
        setSnackbarSeverity("error");
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures this runs only once after initial render


  const columns = [
    { name: 'SN', selector: (row) => row.sn, sortable: true, grow: 1, align: 'text-center' },
    { name: 'Login Date', selector: (row) => row.loginDate, sortable: true, grow: 2, align: 'text-center' },
    { name: 'Login Time', selector: (row) => row.loginTime, sortable: true, grow: 4,align: 'text-center' },
    { name: 'IP Address', selector: (row) => row.ipAddress, sortable: true, grow: 2 , align: 'text-center'},
    { name: 'Logout Type', selector: (row) => row.logoutType, sortable: true, grow: 2, align: 'text-center' },
    { name: 'Logout Date Time', selector: (row) => row.logoutDateTime, sortable: true, grow: 2 }
  ];




  const handleSubmit = async (values) => {
    const { selectedEmp, fromDate, toDate } = values;
    try {
      const auditList = await getAuditStampingList(selectedEmp, fromDate, toDate);
      const mappedData = auditList.map((item, index) => ({
        sn: index + 1,
        loginDate:  formatDate(item.loginDateTime) || '--',
        loginTime:  formatTime(item.loginTime) || '--',
        ipAddress:  item.ipAddress  || '--',
        logoutType: item.logoutTypeDisp || '--',
        logoutDateTime: formatDateTime(item.logOutDateTime) || '--'
      }));
      setAuditStampingList(mappedData);
      setSnackbarOpen(true);
      setSnackbarMessage("Audit stamping list updated successfully");
      setSnackbarSeverity("success");
    } catch (error) {
      setError(error);
      setSnackbarOpen(true);
      setSnackbarMessage("Error updating audit stamping list");
      setSnackbarSeverity("error");
    }
  };

  const handleFieldChange = async (field, value, values) => {
    const newValues = { ...values, [field]: value };
    await handleSubmit(newValues);
  };




  const empOptions = employeesList.map((emp) => [emp.empId, `${emp.empName}, ${emp.empDesigName}`]);

  // const filterEmpOptions = createFilterOptions({
  //   matchFrom: "start",
  //   stringify: (option) => option[1],
  // });

  const customFilterOptions = (options, { inputValue }) => {
    const lowerCaseInput = inputValue.toLowerCase();
    return options.filter((option) =>
      option[1].toLowerCase().includes(lowerCaseInput) 
    );
  };



  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
       <div className="card">
        <Helmet>
          <title>QMS - Audit Stamping List</title>
        </Helmet>

        <Navbar />

        <div className="card-body text-center">
          <div id="main-wrapper">
          <Box display="flex" alignItems="center" gap="10px" className='mg-down-10'>
             <Box flex="80%" className='text-center card-title'><h3>Audit Stamping List</h3></Box>
          </Box>
        

              <Formik
                enableReinitialize
                initialValues={initialValues}
                onSubmit={handleSubmit}
              >
                {({ setFieldValue, values, errors }) => (
                  <Form>
                    <Grid container spacing={3}>
                    <Grid item xs={12} md={2}></Grid>
                      <Grid item xs={12} md={3}>
                        <Field name="selectedEmp">
                          {({ field, form }) => (
                            <Autocomplete
                              options={empOptions}
                              getOptionLabel={(option) => option[1]}
                              // renderOption={(props, option) => (
                              //   <CustomMenuItem {...props} key={option[0]}>
                              //     <ListItemText primary={`${option[1]}`} />
                              //   </CustomMenuItem>
                              // )}  
                              value={
                                empOptions.find(
                                  (emp) =>
                                    Number(emp[0]) ===
                                    Number(values.selectedEmp)
                                ) || null
                              }
                              onChange={(event, newValue) => {
                                setFieldValue(
                                  "selectedEmp",
                                  newValue ? newValue[0] : ""
                                );
                                handleFieldChange(
                                  "selectedEmp",
                                  newValue ? newValue[0] : "",
                                  values
                                );
                              }}
                              filterOptions={customFilterOptions}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Employee"
                                  error={Boolean(errors.selectedEmp)}
                                  helperText={errors.selectedEmp}
                                  fullWidth
                                  variant="outlined"
                                  margin="normal"
                                  required
                                  size="small"
                                  sx={{ width: '300px' }}
                                />
                              )}
                              ListboxProps={{
                                sx: {
                                  maxHeight: 200,
                                  overflowY: "auto",
                                },
                              }}
                              disableClearable
                            />
                          )}
                        </Field>
                      </Grid>

                      <Grid item xs={12} md={2}>
                        <MobileDatePicker
                          label="From Date"
                          format="DD/MM/YYYY"
                          disableUnderline
                          value={dayjs(values.fromDate)}
                          onChange={(date) => {
                            const formattedDate = date ? date.format("YYYY-MM-DD") : "";
                            setFieldValue("fromDate", formattedDate);
                            handleFieldChange("fromDate", formattedDate, values);
                          }}
                          slots={{
                            textField: (params) => (
                              <TextField
                                {...params}
                                fullWidth
                                variant="outlined"
                                margin="normal"
                                placeholder="From Date"
                                size="small"
                              />
                            ),
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} md={2}>
                        <MobileDatePicker
                          label="To Date"
                          format="DD/MM/YYYY"
                          disableUnderline
                          value={dayjs(values.toDate)}
                          minDate={dayjs(values.fromDate)} // Set minDate to the to Date based on fromDate
                          onChange={(date) => {
                            const formattedDate = date ? date.format("YYYY-MM-DD") : "";
                            setFieldValue("toDate", formattedDate);
                            handleFieldChange("toDate", formattedDate, values);
                          }}
                          slots={{
                            textField: (params) => (
                              <TextField
                                {...params}
                                fullWidth
                                variant="outlined"
                                margin="normal"
                               size="small"
                              />
                            ),
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} md={2}></Grid>

               
                    </Grid>
                  </Form>
                )}
              </Formik>
   

         


              <div id="card-body customized-card">

              {isLoading ? (
                <Typography>Loading...</Typography>
              ) : error ? (
                <Typography color="error">{error.message}</Typography>
              ) : (
                <Datatable columns={columns} data={auditStampingList} />
              )}
            </div>
          </div>
        </div>
      </div>
    </LocalizationProvider>
  );
};

export default AuditStamping;
