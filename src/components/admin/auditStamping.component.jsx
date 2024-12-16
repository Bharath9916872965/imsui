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
import {DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Formik, Form, Field } from "formik";
import {  getAuditStampingList,getEmployeesList,getLoginEmployeeDetails } from '../../services/header.service';
import SelectPicker from 'components/selectpicker/selectPicker'
import { CustomMenuItem } from "services/auth.header";


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
        const { empId, imsFormRoleId } = await getLoginEmployeeDetails();
        const defaultEmpId = empId;
        const roleId = imsFormRoleId;
        const { fromDate, toDate } = initialValues;
  
        const filteredEmployees =
          roleId === 1 || roleId === 2
            ? employees
            : employees.filter(emp => emp.empId === defaultEmpId);
  
        setEmployeesList(filteredEmployees);
  
        const auditList = await getAuditStampingList(defaultEmpId, fromDate, toDate);
        const mappedData = auditList.map((item, index) => ({
          sn: index + 1,
          loginDate: formatDate(item.loginDateTime) || '--',
          loginTime: formatTime(item.loginTime) || '--',
          ipAddress: item.ipAddress || '--',
          logoutType: item.logoutTypeDisp || '--',
          logoutDateTime: formatDateTime(item.logOutDateTime) || '--'
        }));
  
        setAuditStampingList(mappedData);
  
        // Update initialValues
        setInitialValues(prev => ({
          ...prev,
          selectedEmp: defaultEmpId
        }));
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
  }, []);
  


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
    const updatedValues = { ...values, [field]: value };
    await handleSubmit(updatedValues);
  };

  const empOptions = employeesList.map((emp) => [emp.empId, `${emp.empName}, ${emp.empDesigName}`]);


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
                      //      <SelectPicker
                      //        options={empOptions.map(emp => ({
                      //        value: emp[0],
                      //        label: emp[1]
                      //   }))}
                      //   label="Employee"
                      //   value={form.values.selectedEmp || null}
                      //   onChange={newValue => {
                      //     form.setFieldValue("selectedEmp", newValue || "");
                      //     handleFieldChange("selectedEmp", newValue || "", form.values);
                      //  }}
                      //  placeholder="Select Employee"
                      //  style={{ width: 300 }}
                      //  searchable
                      //  block
                      // />
                          
                          <Autocomplete
                              options={empOptions}
                              getOptionLabel={(option) => option[1]}
                              renderOption={(props, option) => (
                                <CustomMenuItem {...props} key={option[0]}>
                                  <ListItemText primary={`${option[1]}`} />
                                </CustomMenuItem>
                              )}  
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
                                  sx={{ 
                                    width: '300px', 
                                    marginTop: '0px' 
                                  }}
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
                <Field name="fromDate">
                   {({ field, form }) => (
                         <DatePicker
                              label="From Date"
                              maxDate={form.values.toDate ? dayjs(form.values.toDate) : null}
                              value={form.values.fromDate ? dayjs(form.values.fromDate) : null}
                              views={['year', 'month', 'day']}
                              onChange={(date) => {
                                const formattedDate = date ? date.format('YYYY-MM-DD') : '';
                                form.setFieldValue('fromDate', formattedDate);
                                handleFieldChange('fromDate', formattedDate, form.values);
                               }}
                               format="DD-MM-YYYY"
                               slotProps={{
                                     textField: {
                                        size: 'small',
                                        error: Boolean(form.errors.fromDate && form.touched.fromDate),
                                        helperText: form.touched.fromDate && form.errors.fromDate,
                               },
                             }}
                           />
                    )}
              </Field>

            </Grid>

           <Grid item xs={12} md={2}>
            
                      <Field name="toDate">
                      {({ field, form }) => (
                       <DatePicker
                             label="To Date"
                             minDate={form.values.fromDate ? dayjs(form.values.fromDate) : null}
                             value={form.values.toDate ? dayjs(form.values.toDate) : null}
                             views={['year', 'month', 'day']}
                              onChange={(date) => {
                                 const formattedDate = date ? date.format('YYYY-MM-DD') : '';
                                 form.setFieldValue('toDate', formattedDate);
                                handleFieldChange('toDate', formattedDate, form.values);
                             }}
                             format="DD-MM-YYYY"
                             slotProps={{
                             textField: {
                                size: 'small',
                                error: Boolean(form.errors.toDate && form.touched.toDate),
                               helperText: form.touched.toDate && form.errors.toDate,
                              },
                        }}
                      />
                     )}
                  </Field>

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
