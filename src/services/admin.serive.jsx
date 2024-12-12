import axios from 'axios';
import { authHeader } from './auth.header';
import config from "../environment/config";
const API_URL = config.API_URL;
const resetPsdLink = config.RESET_PASSWORD_LINK;

export const getHeaderModuleList = async (role) => {
    try {
        return (await axios.post(`${API_URL}header-module`, role, { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in getHeaderModuleList:', error);
        throw error;
    }
};

export const getHeaderModuleDetailList = async (role) => {
    try {
        return (await axios.post(`${API_URL}header-detail`, role, { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in getHeaderModuleDetailList:', error);
        throw error;
    }
};

export const changePassword = async () => {
    window.open(resetPsdLink, '_blank'); 
  }

export const getUserManagerList = async () => {
    try {
      const response = await axios.post(
        `${API_URL}user-manager-list`, 
        {},
        { headers: authHeader() }
      );
      return response.data;
    } catch (error) {
      console.error('Error occurred in getUserManagerList:', error);
      throw error;
    }
};

export const getRolesList = async () => {
    try {
      const response = await axios.post(
        `${API_URL}roles-list`, 
        {},
        { headers: authHeader() }
      );
      return response.data;
    } catch (error) {
      console.error('Error occurred in getRolesList:', error);
      throw error;
    }
  };

  export const getFormModulesList = async () => {
    try {
      const response = await axios.post(
        `${API_URL}form-modules-list`, 
        {},
        { headers: authHeader() }
      );
      return response.data;
    } catch (error) {
      console.error('Error occurred in getFormModulesList:', error);
      throw error;
    }
  };

  export const getFormRoleAccessList = async (roleId, formModuleId) => {
    try {
      const payload = { roleId, formModuleId }; 
      const response = await axios.post(
        `${API_URL}form-role-access-list`,
        payload, // Send as JSON object
        { headers: authHeader() }
      );
      return response.data;
    } catch (error) {
      console.error('Error occurred in getFormRoleAccessList:', error);
      throw error;
    }
  };


  export const updateFormRoleAccess = async (formRoleAccessId, isActive, formDetailsId, roleId) => {
    try {
      const values = {  
        formRoleAccessId: formRoleAccessId,
        isActive: isActive,
        formDetailId: formDetailsId,
        roleId: roleId
      };
      const response = await axios.post(
        `${API_URL}update-form-role-access`,
        values,
        { headers: { 'Content-Type': 'application/json', ...authHeader() } }
      );
      return response.data;
    } catch (error) {
      console.error('Error occurred in updateFormRoleAccess:', error);
      throw error;
    }
  };
  
  
