import axios from 'axios';
import { authHeader } from './auth.header';
import config from "../environment/config";
const API_URL = config.API_URL;
const resetPsdLink = config.RESET_PASSWORD_LINK;

export class UserManagerDto {
  constructor(loginId, userName, divisionId, roleId, logintypeId, empId) {
    this.loginId = loginId;
    this.userName = userName;
    this.divisionId = divisionId;
    this.roleId = roleId;
    this.logintypeId = logintypeId;
    this.empId = empId;
  }
}

export class ApprovalAuthorityDto{
    
  constructor(mrsId,isActive){
      this.mrsId=mrsId;
      this.isActive=isActive;
  }
};

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
  
  export const userManagerEditData = async (loginId) => {
    try {
      if (!loginId) throw new Error('No loginId found');
      const response = await axios.post(
        `${API_URL}user-manager-edit-data`,
        loginId,
        { headers: { 'Content-Type': 'application/json', ...authHeader() } }
      );
      return response.data;
    } catch (error) {
      console.error('Error occurred in userManagerEditData:', error);
      throw error;
    }
  };

  export const submitUserManagerEdit = async (userManagerDto) => {
    try {
      const response = await axios.post(
        `${API_URL}user-manager-edit-submit`,
        userManagerDto,
        { headers: authHeader() }
      );
      return response.data;
    } catch (error) {
      console.error('Error occurred in submitUserManagerEdit:', error);
      throw error;
    }
  };

  export const usernameDuplicateCheckInAdd = async (username) => {
    try {
      if (!username) throw new Error('No user found');
      const response = await axios.post(
        `${API_URL}username-present-count`,
        username, 
        { headers: { 'Content-Type': 'application/json', ...authHeader() } }
      );
      return response.data;
    } catch (error) {
      console.error('Error occurred in usernameDuplicateCheckInAdd:', error);
      throw error;
    }
  };
  
  export const insertApprovalAuthority = async(values)=>{
    try {
      return (await axios.post(`${API_URL}insert-approval-authority`,values, {headers: {'Content-Type' : 'application/json', ...authHeader() }})).data;
  } catch (error) {
      console.error('Error occured in insertApprovalAuthority', error);
      throw error;
  }
  }
  
  export const getapprovalAuthorityList = async () => {
    try {
      const response = await axios.post( `${API_URL}approval-authority-list`,  {},{ headers: authHeader() } );
      return response.data;
    } catch (error) {
      console.error('Error occurred in approvalAuthorityList:', error);
      throw error;
    }
};
  


export const deleteMrs = async (mrsId,isActive) => {
  try {
    const response = await axios.post( `${API_URL}approval_authority-inactive`,new ApprovalAuthorityDto(mrsId,isActive), {headers: authHeader() });
    return response.data;

  } catch (error) {
    console.error('Error occurred in deleteMrs:', error);
    throw error;
  }
};


export const UpdateApprovalAuthority = async(values) =>{
  try {
      return (await axios.post(`${API_URL}update-approval-authority`,values, {headers: {'Content-Type' : 'application/json', ...authHeader() }})).data;
  } catch (error) {
      console.error('Error occured in UpdateApprovalAuthority', error);
      throw error;
  }
}


export const getNotifiCount= async () => {
  try {
      return (await axios.post(`${API_URL}get-notification-count`,{},{headers : {'Content-Type': 'application/json', ...authHeader()}})).data;
  } catch (error) {
      console.error('Error occurred in getNotifiCount:', error);
      throw error;
  }
};


export const getNotifiList= async () => {
  try {
      return (await axios.post(`${API_URL}get-notification-list`,{},{headers : {'Content-Type': 'application/json', ...authHeader()}})).data;
  } catch (error) {
      console.error('Error occurred in getNotifiList:', error);
      throw error;
  }
};





export const  updateNotification= async (notificationId) => {
  console.log("notificationId", notificationId);
  try {
      return (await axios.post(`${API_URL}update-notification`,notificationId,{headers : {'Content-Type': 'application/json', ...authHeader()}})).data;
  } catch (error) {
      console.error('Error occurred in updateNotification:', error);
      throw error;
  }
};


export const getDivisionMasterList = async () => {
  try {
    const response = await axios.get(
      `${API_URL}division-master-list`,
      { headers: authHeader() }
    );
    return response.data;
  } catch (error) {
    console.error('Error occurred in getDivisionMasterList:', error);
    throw error;
  }
};

export const getDivisionGroupMasterList = async () => {
  try {
    const response = await axios.get(
      `${API_URL}division-group-master-list`,
      { headers: authHeader() }
    );
    return response.data;
  } catch (error) {
    console.error('Error occurred in getDivisionGroupMasterList:', error);
    throw error;
  }
};

export const getProjectMasterList= async () => {
  try {
    const response = await axios.get(
      `${API_URL}project-master-active-list`,
      { headers: authHeader() }
    );
    return response.data;
  } catch (error) {
    console.error('Error occurred in getProjectMasterList:', error);
    throw error;
  }
};


export const getAuditPatchList= async () => {
  try {
    const response = await axios.get(
      `${API_URL}get-audit-patch-list`,
      { headers: authHeader() }
    );
    return response.data;
  } catch (error) {
    console.error('Error occurred in getAuditPatchList:', error);
    throw error;
  }
};



export const  updateAuditPatch= async (values) => {
  try {
      return (await axios.post(`${API_URL}update-audit-patch`,values,{headers : {'Content-Type': 'application/json', ...authHeader()}})).data;
  } catch (error) {
      console.error('Error occurred in updateAuditPatch:', error);
      throw error;
  }
};