import React, { useState, useEffect } from "react";
import * as Yup from "yup";
import PropTypes from "prop-types";
import {
  TextField,
  Button,
  Typography,
  Grid,
  Box,
  ListItemText,
  Card,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { Helmet } from "react-helmet";
import { Formik, Form, Field } from "formik";
import withRouter from "../../common/with-router";
import Navbar from "components/Navbar/Navbar";
import { getRolesList, submitUserManagerEdit, UserManagerDto, userManagerEditData, usernameDuplicateCheckInAdd } from "services/admin.serive";
import { getEmployeesList } from "services/header.service";
import { CustomMenuItem } from "services/auth.header";
import Swal from "sweetalert2";
import AlertConfirmation from "common/AlertConfirmation.component";
import UserManagerComponent from "./userManager.component";





// Validation Schema
const validationSchema = Yup.object().shape({
  username: Yup.string()
    .required("Username is required")
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must not exceed 20 characters")
    .matches(/^[a-zA-Z0-9_ ]*$/,"Username can only contain letters, numbers, and underscores")
    .test(
      "no-trailing-space",
      "Username cannot end with a space",
      (value) => !/\s$/.test(value)
    )
    .test(
      "no-leading-space",
      "Username cannot start with a space",
      (value) => !/^\s/.test(value)
    ),

  selectedRoleType: Yup.string().required("Role type is required"),
  selectedEmployeeName: Yup.string().required("Employee name is required"),
});


  const UserManagerActions = (props) => {
  const { mode, router } = props;
  const { navigate } = router; 

  const [roles, setRoles] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [usernameAvailable, setUsernameAvailable] = useState(false);
  const [usernameCheckError, setUsernameCheckError] = useState("");
  const [dropdownDisabled, setDropdownDisabled] = useState(true);
  const [usernameCheckMessage, setUsernameCheckMessage] = useState("");
  const [initialValues, setInitialValues] = useState({
    username: "",
    selectedRoleType: "",
    selectedEmployeeName: "",
  });
  const [loginId, setLoginId] = useState("");
  const [status, setStatus] = useState('');


  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [rolesData, employeesData] = await Promise.all([
          getRolesList(),
          getEmployeesList(),
        ]);
        setRoles(rolesData);
        setEmployees(employeesData);
        
        if (mode === "edit") {
          const stateLoginId = props?.loginId;
          if (stateLoginId) {
            await fetchUserDataForEdit(stateLoginId);
          } else {
            throw new Error("No loginId found in state");
          }
        }
      } catch (error) {
        console.error("Error in fetchInitialData:", error);
      }
    };
  
    fetchInitialData();
  }, [mode, props]);


  const fetchUserDataForEdit = async (loginId) => {
    try {
      const userData = await userManagerEditData(loginId);
      setInitialValues({
        username: userData.userName || "",
        selectedRoleType: userData.roleId || "",
        selectedEmployeeName: userData.empId || "",
      });
      setUsernameAvailable(true);
      setDropdownDisabled(false);
      setLoginId(loginId);
    } catch (error) {
      console.error(error);
    }
  };


  const handleSubmit = async (values) => {
    const isEditMode = Boolean(values.username);
    const successMessage = isEditMode ? "Data Updated Successfully" : " Added Successfully ";
    const unsuccessMessage = isEditMode ? "Data Update Unsuccessful!" : " Add Unsuccessful ";
    const Title = isEditMode ? "Are you sure to Update ?" : "Are you sure to Add ?";
    const confirm = await AlertConfirmation({
        title: Title,
        message: '',
    });

    const userManagerDto = new UserManagerDto(
      loginId || "",
      values.username,
      "",
      values.selectedRoleType,
      "",
      values.selectedEmployeeName
    );

    if (confirm) {
        try {
          let response;
          if (mode === "edit") {
          response = await submitUserManagerEdit(userManagerDto);
          }
          if(response > 0){
          setStatus('list'); 
          Swal.fire({
              icon: "success",
              title: 'Success',
              text: `${successMessage} for Username : ${values.username}`,
              showConfirmButton: false,
              timer: 2600
          });
         } else {
          Swal.fire({
              icon: "error",
              title: unsuccessMessage,
              showConfirmButton: false,
              timer: 2600
          });
        }
        } catch (error) {
            console.error('Error updating user:', error);
            Swal.fire('Error!', 'There was an issue updating the user.', 'error');
        }
    }
  }
 
const handleUsernameChange = async (event, setFieldValue) => {
  const username = event.target.value;

  if (!username) {
    setUsernameCheckError("Username cannot be empty");
    setUsernameAvailable(false);
    setDropdownDisabled(true);
    setUsernameCheckMessage("");
    setFieldValue("username", username.trim());
    return;
  }

  try {
    const result = await usernameDuplicateCheckInAdd(username);
    const available = result === 0;

    setUsernameAvailable(available);
    setUsernameCheckError(available ? "" : "Username not available");
    setDropdownDisabled(!available);
    setUsernameCheckMessage(available ? "Username is available!" : "");

    if (!available) {
      setFieldValue("selectedRoleType", "");
      setFieldValue("selectedEmployeeName", "");
    }

    setTimeout(() => {
      setFieldValue("username", username);
    }, 0);
  } catch (error) {
    console.error(error);
  }
};

  const rolesOptions = roles.map((role) => [role.roleId, `${role.roleName}`]);
  const employeesOptions = employees.map((emp) => [emp.empId, `${emp.empName}, ${emp.empDesigName}`]);


  const customFilterOptions = (options, { inputValue }) => {
    const lowerCaseInput = inputValue.toLowerCase();
    return options.filter((option) =>
      option[1].toLowerCase().includes(lowerCaseInput) 
    );
  };

  const handleBack = () => {
    setStatus('list');
  };

  switch (status) {
    case 'list':
        return <UserManagerComponent status={status}/>;
  }

  return (
    <Box  id="qms-wrapper">
      <Helmet>
        <title>QMS - User Manager {mode === "add" ? "Add" : "Edit"}</title>
      </Helmet>

      <Navbar/>

      <Card variant="outlined"  sx={{ padding: '30px', mt: '20px', mx: '20px' }}>
         <h3>User Manager Edit</h3>
      <Box id="card-body">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            enableReinitialize
            onSubmit={handleSubmit}
         >
              {({
                values,
                setFieldValue,
                handleChange,
                handleBlur,
                errors,
                touched,
                validateField,
                isSubmitting,
                resetForm,
              }) => (


             <Form>
                  
                  <Grid container spacing={3}>
                    <Grid  item xs={12}  md={2} ></Grid>
                    <Grid item xs={12} md={4}>
                      <Field
                        id="standard-basic"
                        as={TextField}
                        label="Username"
                        variant="outlined"
                        fullWidth
                        size="small"
                        margin="normal"
                        required
                        name="username"
                        value={values.username || ""} // Ensure value is always a string
                        onChange={(e) =>
                          handleUsernameChange(e, setFieldValue, validateField)
                        }
                        onBlur={handleBlur}
                        error={Boolean(touched.username && errors.username)}
                        helperText={touched.username && errors.username}
                        InputProps={{
                          inputProps: { maxLength: 20 }, // Enforce max length in input
                          autoComplete: "off",
                          disabled: mode === "edit",
                        }}
                      />

                      {!touched.username || !errors.username ? (
                        <Typography
                          variant="body2"
                          color={usernameAvailable ? "green" : "red"}
                        >
                          {usernameAvailable
                            ? usernameCheckMessage
                            : usernameCheckError}
                        </Typography>
                      ) : null}
                    </Grid>

                    <Grid item  xs={12}  md={2}></Grid>

                    <Grid item  xs={12}  md={4}></Grid>


                    {/* Second Row of xs-12 Role-type and Employee */}
                    <Grid item xs={12}  md={2} ></Grid>

                    <Grid item xs={12} md={4}>
                      <Field name="selectedRoleType">
                        {({ field, form }) => (
                          <Autocomplete
                            options={rolesOptions}
                            getOptionLabel={(option) => option[1]}
                            renderOption={(props, option) => (
                              <CustomMenuItem {...props} key={option[0]}>
                                <ListItemText primary={`${option[1]}`} />
                              </CustomMenuItem>
                            )}
                            value={
                              rolesOptions.find(
                                (role) => Number(role[0]) === Number(form.values.selectedRoleType)
                              ) || null
                            }
                            //{/* Type Conversion: The comparison between role[0] and form.values.selectedRoleType was failing because role[0] was a number, while form.values.selectedRoleType was a string. By converting both to numbers using Number(), the comparison was accurate. */}
                            onChange={(event, newValue) => {
                              setFieldValue("selectedRoleType", newValue ? Number(newValue[0]) : "")
                            }}
                            onBlur={() => form.setFieldTouched("selectedRoleType", true)}
                            filterOptions={customFilterOptions}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Role Type"
                                required
                                  size="small"
                                  error={Boolean(
                                    form.touched.selectedRoleType && form.errors.selectedRoleType
                                  )}
                                  helperText={
                                    form.touched.selectedRoleType && form.errors.selectedRoleType
                                  }
                                fullWidth
                                variant="outlined"
                                margin="normal"
                              />
                            )}
                            disabled={dropdownDisabled}
                            ListboxProps={{
                              sx: {
                                maxHeight: 200,
                                overflowY: "auto",
                              },
                 

                            }}
                          />
                        )}
                      </Field>
                    </Grid>

                   
                    <Grid item xs={12} md={4}>
                      <Field name="selectedEmployeeName">
                        {({ field, form }) => (
                          <Autocomplete
                            options={employeesOptions}
                            getOptionLabel={(option) => option[1]}
                            renderOption={(props, option) => (
                              <CustomMenuItem {...props} key={option[0]}>
                                <ListItemText primary={`${option[1]}`} />
                              </CustomMenuItem>
                            )}        
                            value={
                              employeesOptions.find(
                                (emp) => Number(emp[0]) === Number(form.values.selectedEmployeeName)
                              ) || null
                            }
                            onChange={(event, newValue) => {
                              setFieldValue(
                                "selectedEmployeeName",
                                newValue ? newValue[0] : ""
                              );
                            }}
                            onBlur={() => form.setFieldTouched("selectedEmployeeName", true)}
                            filterOptions={customFilterOptions}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Select Employee"
                                required
                                error={Boolean(
                                  form.touched.selectedEmployeeName && form.errors.selectedEmployeeName
                                )}
                                helperText={
                                  form.touched.selectedEmployeeName && form.errors.selectedEmployeeName
                                }
                                fullWidth
                                variant="outlined"
                                margin="normal"
                                size="small"
                              />
                            )}
                            disabled={dropdownDisabled}
                            ListboxProps={{
                              sx: {
                                maxHeight: 200,
                                overflowY: "auto",
                              },
                      
                            }}
                          />
                        )}
                      </Field>
                    </Grid>
                    <Grid item xs={12} md={2}></Grid>
                  </Grid>

                  {/* grid  for buttons*/}
                  <Grid id="buttons-grid" item xs={12} style={{marginTop:'20px'}}>
                    {/* Buttons  for edit and add*/}
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={dropdownDisabled || isSubmitting} // Disable button if the dialog is open
                      className={mode === "add" ? "submit" : "edit"}
                   
                    >
                      {mode === "add" ? "Submit" : "Update"}
                    </Button>
                    <Button  className="back ms-1" onClick={handleBack}>Back</Button>

                    {/* Buttons  for add*/}
                    {mode === "add" && (
                      <>
                        <Button
                          type="button"
                          variant="outlined"
                          color="secondary"
                          onClick={() => {
                            resetForm(); // Reset the form fields
                            setUsernameAvailable(false); // Clear the availability status
                            setUsernameCheckError(""); // Clear the error message
                            setUsernameCheckMessage(""); // Clear the success message
                          }}
                          disabled={isSubmitting}
                          sx={{ marginLeft: "20px" }}
                        >
                          Reset
                        </Button>
                      </>
                    )}
                  </Grid>
                </Form>
              )}
            </Formik>
          </Box>
      </Card>
    </Box>
  );
};

UserManagerActions.propTypes = {
  mode: PropTypes.string.isRequired
};

export default withRouter(UserManagerActions);
