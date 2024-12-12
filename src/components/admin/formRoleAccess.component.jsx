import { Autocomplete, Box, createFilterOptions, Grid, ListItemText, Switch, TextField, Typography } from "@mui/material";
import Datatable from "components/datatable/Datatable";
import Navbar from "components/Navbar/Navbar";
import { Field, Form, Formik } from "formik";
import { useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { getFormModulesList, getFormRoleAccessList, getRolesList, updateFormRoleAccess } from "services/admin.serive";
import { CustomMenuItem } from "services/auth.header";

const FormRoleAccess = () => {
    const [formRoleAccessList, setFormRoleAccessList] = useState([]);
    const [rolesList, setRolesList] = useState([]);
    const [formModulesList, setFormModulesList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [initialValues, setInitialValues] = useState({
      selectedRole: "",
      selectedFormModule: ""
    });

    
  
    const fetchData = useCallback(async () => {
      try {
        const rolesList = await getRolesList();
        setRolesList(rolesList);
        const defaultRoleId = rolesList.length > 0 ? rolesList[0].roleId : "";
        const formModulesList = await getFormModulesList();
        setFormModulesList(formModulesList);
        const defaultFormModuleId = 0;
  
        const formRoleAccessList = await getFormRoleAccessList(defaultRoleId, defaultFormModuleId);
        setFormRoleAccessList(formRoleAccessList);
  
        setInitialValues({
          selectedRole: defaultRoleId,
          selectedFormModule: defaultFormModuleId
        });
        setIsLoading(false);
  
      } catch (error) {
        setError(error);
        setIsLoading(false);
      }
    }, []);
  
  
  
    useEffect(() => {
      fetchData();
    }, [fetchData]);
  
    const handleSubmit = async (values) => {
      const { selectedRole, selectedFormModule } = values;
      try {
        setFormRoleAccessList([]);
        const formRoleAccessList = await getFormRoleAccessList(selectedRole, selectedFormModule);
        setFormRoleAccessList(formRoleAccessList);
      } catch (error) {
        setError(error);
      }
    };
  
    const handleFieldChange = async (field, value, values) => {
      const newValues = { ...values, [field]: value };
      await handleSubmit(newValues);
    };
  
   const handleIsActiveSwitchChange = async (
      index,
      formDetailId,
      formRoleAccessId,
      selectedRole
    ) => {
      const item = formRoleAccessList[index];
      const newIsActive = !item.active;
  
      try {
        await updateFormRoleAccess (
          formRoleAccessId,
          newIsActive,
          formDetailId,
          selectedRole
        );
  
        const updatedFormRoleAccessList = [...formRoleAccessList];
        updatedFormRoleAccessList[index] = { ...item, active: newIsActive };
        setFormRoleAccessList(updatedFormRoleAccessList);
      } catch (error) {
        console.error("Error updating form role access:", error);
      }
    };
  
    const roleListForOptions = rolesList.map((role) => [role.roleId, `${role.roleName}`]);
    const formModuleForOptions = [[0, "All"], ...formModulesList.map((module) => [module.formModuleId, module.formModuleName])];
  
    const filterRoleOptions = createFilterOptions({
      matchFrom: "start",
      stringify: (option) => option[1],
    });
  
    const filterFormModuleOptions = createFilterOptions({
      matchFrom: "start",
      stringify: (option) => option[1],
    });
  
  
    const columns = [
      { name: 'SN', selector: (row) => row.sn, sortable: true, grow: 1, align: 'text-center' },
      { name: 'Form Name', selector: (row) => row.formDispName, sortable: true, grow: 2, align: 'text-center' },
      { name: 'Access', selector: (row) => row.action, sortable: true, grow: 4  ,className: 'access-cell',}
    ];
  
    return (
      <Box  id="qms-wrapper">
        <Helmet>
          <title>IMS - Form Role Access</title>
        </Helmet>
  
        <Navbar/>
  
        <Box id="main-container" sx={{ overflowY: 'auto', flexGrow: 1, p: 2 }}>
          <Box id="main-wrapper">
  
            <Formik
              enableReinitialize={true}
              initialValues={initialValues}
              onSubmit={handleSubmit}
            >
  
              {({ setFieldValue, values, errors }) => {
              
  
                const mappedData = formRoleAccessList.map((item, index) => ({
                  sn: index + 1,
                  formDispName: item.formDispName || '-',
                  action: (
                    values.selectedRole === 1 ? (
                                          <Switch
                                            checked={item.active}
                                            color="default"
                                            disabled
                                            sx={{
                                              '& .MuiSwitch-switchBase.Mui-checked': {
                                                color: 'grey',
                                              },
                                              '& .MuiSwitch-switchBase': {
                                                color: 'grey',
                                              },
                                              '& .MuiSwitch-track': {
                                                backgroundColor: 'grey',
                                              },
                                            }}
                                          />
                                        ) : (
                                          <Switch
                                            checked={item.active}
                                            onChange={() =>
                                              handleIsActiveSwitchChange(
                                                index,
                                                item.formDetailId, // formDetailId
                                                item.formRoleAccessId, // formRoleAccessId
                                                values.selectedRole
                                              )
                                            }
                                            color="default"
                                            sx={{
                                              '& .MuiSwitch-switchBase.Mui-checked': {
                                                color: 'green',
                                              },
                                              '& .MuiSwitch-switchBase': {
                                                color: 'red',
                                              },
                                              '& .MuiSwitch-track': {
                                                backgroundColor: item.active ? 'green' : 'red',
                                              },
                                            }}
                                          />
                                        )
        
                  )
         }));
  
  
     return (

                <Form>
  
                <Box id="header-row">
                    <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
                        {/* Form Role Access Header */}
                        <Grid item xs={8}>
                            <h3 style={{marginLeft: '25rem'}}>Form Role Access</h3>
                        </Grid>

                        {/* Dropdowns on the right */}
                        <Grid item xs={4} sx={{ display: "flex", gap: 4 }}>
                            {/* Role Dropdown */}
                            <Field name="selectedRole">
                                {({ field, form }) => (
                                    <Autocomplete
                                        options={roleListForOptions}
                                        getOptionLabel={(option) => option[1]}
                                        renderOption={(props, option) => (
                                            <CustomMenuItem {...props} key={option[0]}>
                                                <ListItemText primary={`${option[1]}`} />
                                            </CustomMenuItem>
                                        )}
                                        value={
                                            roleListForOptions.find(
                                                (option) => Number(option[0]) === Number(values.selectedRole)
                                            ) || null
                                        }
                                        onChange={(event, newValue) => {
                                            setFieldValue("selectedRole", newValue ? newValue[0] : "");
                                            handleFieldChange("selectedRole", newValue ? newValue[0] : "", values);
                                        }}
                                        filterOptions={filterRoleOptions}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Select Role"
                                                error={Boolean(errors.selectedRole)}
                                                helperText={errors.selectedRole}
                                                fullWidth
                                                variant="outlined"
                                                margin="normal"
                                                required
                                                size="small"
                                            />
                                        )}
                                        ListboxProps={{
                                            sx: {
                                                maxHeight: 200,
                                                overflowY: "auto",
                                            },
                                        }}
                                        disableClearable
                                        sx={{ width: 300 }}
                                    />
                                )}
                            </Field>

                            {/* Form Module Dropdown */}
                            <Field name="selectedFormModule">
                                {({ field, form }) => (
                                    <Autocomplete
                                        options={formModuleForOptions}
                                        getOptionLabel={(option) => option[1]}
                                        renderOption={(props, option) => (
                                            <CustomMenuItem {...props} key={option[0]}>
                                                <ListItemText primary={`${option[1]}`} />
                                            </CustomMenuItem>
                                        )}
                                        value={
                                            formModuleForOptions.find(
                                                (emp) => Number(emp[0]) === Number(values.selectedFormModule)
                                            ) || null
                                        }
                                        onChange={(event, newValue) => {
                                            setFieldValue("selectedFormModule", newValue ? newValue[0] : "");
                                            handleFieldChange("selectedFormModule", newValue ? newValue[0] : "", values);
                                        }}
                                        filterOptions={filterFormModuleOptions}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Select Form Module"
                                                error={Boolean(errors.selectedFormModule)}
                                                helperText={errors.selectedFormModule}
                                                fullWidth
                                                variant="outlined"
                                                margin="normal"
                                                required
                                                size="small"
                                            />
                                        )}
                                        ListboxProps={{
                                            sx: {
                                                maxHeight: 200,
                                                overflowY: "auto",
                                            },
                                        }}
                                        disableClearable
                                        sx={{ width: 300 }}
                                    />
                                )}
                            </Field>
                        </Grid>
                    </Grid>
                </Box>

  
              
                  <Box id="card-body" className="customized-card">
                    {isLoading ? (
                      <Typography>Loading...</Typography>
                    ) : error ? (
                      <Typography color="error">{error.message}</Typography>
                    ) : (
                    <Datatable columns={columns} data={mappedData} />
                )}
                </Box>
              </Form>
              );
         
  }}
            </Formik>
          </Box>
        </Box>
      </Box>
    );
  };
  
  FormRoleAccess.propTypes = {};
  
  export default FormRoleAccess;