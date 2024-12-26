import axios from 'axios';
import { authHeader } from './auth.header';
import config from "../environment/config";
const API_URL = config.API_URL;


export const getLoginEmployeeDetails = async () => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('user'));
      const username = currentUser?.username; 
  
      if (!username) {
        throw new Error('No user is currently logged in');
      }
  
      const response = await axios.post(
        `${API_URL}login/${username}`, 
        {},
        { headers: authHeader() } 
      );
  
  
      
      const employeeDetails = response.data;
  
      // Assuming employeeDetails is an array with a single object
      if (employeeDetails.length === 0) {
        throw new Error('No employee details found');
      }
  
      const details = employeeDetails[0];
      const empName = details.empName;
      const designation = details.empDesigName;
      const empId = details.empId;
      const imsFormRoleId = details.imsFormRoleId;
      const formRoleName = details.formRoleName;
      const title = details.title;
  
      return { empName, designation, empId, imsFormRoleId, formRoleName, title };
  
    } catch (error) {
      console.error('Error occurred in getLoginEmployeeDetails:', error);
      throw error;
    }
  };
  


export const getAuditStampingList = async (empId, fromDate, toDate) => {
    try {
      const auditStampingDto = { empId, fromDate, toDate }; 
      const response = await axios.post(
        `${API_URL}audit-stamping-list`,
        auditStampingDto, 
        { headers: authHeader() }
      );
      return response.data;
    } catch (error) {
      console.error('Error occurred in getAuditStampingList:', error);
      throw error;
    }
  };

  export const getEmployeesList = async () => {
    try {
      const response = await axios.post(
        `${API_URL}employee-list`, 
        {},
        { headers: authHeader() }
      );
      return response.data;
    } catch (error) {
      console.error('Error occurred in getEmployeesList:', error);
      throw error;
    }
  };



