import React, { useState, useEffect, useCallback } from 'react';
import withRouter from "../../common/with-router";
import { getRolesList, getUserManagerList } from 'services/admin.serive';
import Navbar from 'components/Navbar/Navbar';
import { Helmet } from 'react-helmet';
import { Autocomplete, Box, Button, Grid, IconButton, ListItemText, TextField, Tooltip, Typography } from '@mui/material';
import { CustomMenuItem } from 'services/auth.header';
import Datatable from 'components/datatable/Datatable';
import { FaEdit } from 'react-icons/fa';
import UserManagerActionsComponent from './userManagerActions.component';



const UserManager = (props) => {
    const [roleList, setRoleList] = useState([]);
    const [userManagerList, setUserManagerList] = useState([]);
    const [filteredUserManagerList, setFilteredUserManagerList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [imsFormRoleId, setImsFormRoleId] = useState('0');
    const [stateLoginId, setStateLoginId] = useState(null);
    const [status, setStatus] = useState('');

  
    useEffect(() => {

      if (props.status) {
        setStatus(props?.status);
      }

      const fetchUserManagerList = async () => {
        try {
          const userManagerList = await getUserManagerList();
          setUserManagerList(userManagerList);
  
          const roleList = await getRolesList();
          setRoleList(roleList);

          setFilteredUserManagerList(userManagerList);
          setIsLoading(false);
        } catch (error) {
          setError('An error occurred');
          setIsLoading(false);
        }
      };
      fetchUserManagerList();
    }, []);
  

    const handleUserManagerEdit = useCallback((loginId) => {
      setStatus('edit');
      setStateLoginId(loginId);
    }, []);
  
  
    const handleRoleTypeChange = (roleId) => {
      const selectedRoleId = roleId;
      setImsFormRoleId(selectedRoleId);
    
      // Filter the user manager list based on selected role ID
      const filteredList = selectedRoleId === '0' 
        ? userManagerList 
        : userManagerList.filter(data => data.imsFormRoleId === selectedRoleId);
        
      setFilteredUserManagerList(filteredList);
    };
  
    const handleUserManagerAdd = (e) => {
      e.preventDefault();
      setStatus('add');
    };
  
    const columns = [
      { name: 'SN', selector: (row) => row.sn, sortable: true, grow: 1, align: 'text-center' },
      { name: 'Username', selector: (row) => row.username, sortable: true, grow: 2, align: 'text-center' },
      { name: 'Employee', selector: (row) => row.employee, sortable: true, grow: 4 },
      { name: 'Role Name', selector: (row) => row.rolename, sortable: true, grow: 2 , align: 'text-center'},
      { name: 'Division', selector: (row) => row.division, sortable: true, grow: 2 , align: 'text-center'},
      { name: 'Action', selector: (row) => row.action, sortable: false, grow: 2, align: 'text-center' },
    ];
  
    const mappedData = filteredUserManagerList.map((item, index) => ({
      sn: index + 1,
      username: item.username || '-',
      employee: item.empName+', '+item.empDesig || '-',
      rolename: item.formRoleName || '-',
      division: item.empDivCode || '-',
      action: (
        <React.Fragment>
                    <Tooltip title="Edit User">
                        <IconButton className='p-0'
                          color="primary"
                          onClick={() => handleUserManagerEdit(item.loginId)}
                          aria-label="edit"
                        >
                           <FaEdit></FaEdit>
                        </IconButton>
                     </Tooltip>
          </React.Fragment>
      ),
      loginId: item.loginId,
    }));
  
  
    const roleOptions = [
      { value: "0", label: "All" },
      ...roleList.map((item) => ({
        value: item.roleId,
        label: item.roleName
      }))
    ];
  
  switch (status) {
    case 'add':
        return <UserManagerActionsComponent mode="add" />;
    case 'edit':
        return (
            <UserManagerActionsComponent
                mode="edit"
                loginId={stateLoginId}
            />
        );
  default:
    return (
      <Box  id="qms-wrapper">
        <Helmet>
          <title>IMS - User Manager List</title>
        </Helmet>
        <Navbar />
        <Box id="main-container" sx={{ overflowY: 'auto', flexGrow: 1, p: 2 }}>
          <Box id="main-wrapper">
            <Box id="card-title" >
            <Grid container spacing={2}>
                <Grid item xs={8.8}>
                    <Box className='text-center card-title' marginLeft={'20rem'}><h3>User Manager List</h3></Box>
                </Grid>
               <Grid item xs={2.8} >
               <Autocomplete
                options={roleOptions}
                getOptionLabel={(option) =>  option.label || ""}
                renderOption={(props, option) => (
                  <CustomMenuItem {...props} key={option.value}>
                    <ListItemText primary={`${option.label}`} />
                  </CustomMenuItem>
                )}
                value={roleOptions.find((item) => item.value === imsFormRoleId) || null}
                onChange={(event, newValue) => {
                  const selectedValue = newValue ? newValue.value : "0"; // Default to "All"
                  handleRoleTypeChange(selectedValue); // Update based on selection
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Role Type"
                    variant="outlined"
                    size="small"
                    required
                    fullWidth
                    sx={{ width: '320px', marginTop: '10px' }}
                  />
                )}
                disableClearable
              />
  
              </Grid>
              </Grid>
   
            </Box>
  
            <Box id="card-body customized-card" marginTop={'15px'}>
              {isLoading ? (
                <Typography>Loading...</Typography>
              ) : error ? (
                <Typography color="error">{error}</Typography>
              ) : (
                <Datatable columns={columns} data={mappedData} />
              )}
  
              <Box className="add-button-wrapper" align="center" >
                <Button variant="contained" sx={{ marginLeft: '8px!important' }}  color="primary" onClick={handleUserManagerAdd}>
                  Add
                </Button>
              </Box>  
  
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }
}
  export default withRouter(UserManager);