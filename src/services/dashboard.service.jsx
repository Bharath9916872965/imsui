
import axios from 'axios';
import { authHeader } from './auth.header';
import  config  from "../environment/config";

const API_URL=config.API_URL;

export const getQmDashboardDetailedList = async () => {
    
    try {
        return (await axios.post(`${API_URL}get-qm-dashboard-list`,{} , {
            headers: authHeader()
        })).data;
    } catch (error) {
        console.error('Error occurred in getQmDashboardDetailsDtoList', error);
        throw error;
    }
    
}



export const getActiveAuditorsCount = async () => {
    
    try {
        return (await axios.post(`${API_URL}get-no-of-active-auditors`,{} , {
            headers: authHeader()
        })).data;
    } catch (error) {
        console.error('Error occurred in getActiveAuditorsCount', error);
        throw error;
    }
    
}



export const getActiveAuditeeCount = async () => {
    
    try {
        return (await axios.post(`${API_URL}get-no-of-active-auditee`,{} , {
            headers: authHeader()
        })).data;
    } catch (error) {
        console.error('Error occurred in getActiveAuditeeCount', error);
        throw error;
    }
    
}


export const getActiveTeams = async () => {
    
    try {
        return (await axios.post(`${API_URL}get-no-of-active-teams`,{} , {
            headers: authHeader()
        })).data;
    } catch (error) {
        console.error('Error occurred in getActiveTeams', error);
        throw error;
    }
    
}

export const getActiveSchedules = async () => {
    
    try {
        return (await axios.post(`${API_URL}get-no-of-active-schedules`,{} , {
            headers: authHeader()
        })).data;
    } catch (error) {
        console.error('Error occurred in getActiveSchedules', error);
        throw error;
    }
    
}


export const getTotalChecklistObsCountByIqa = async () => {
    try {
        return (await axios.post(`${API_URL}get-total-obs-count-by-iqa`,{} , {
            headers: authHeader()
        })).data;
    } catch (error) {
        console.error('Error occurred in getTotalChecklistObsCountByIqa', error);
        throw error;
    }
}


export const getCheckListByObservation = async () => {
    try {
        return (await axios.post(`${API_URL}get-checklist-by-observation`,{} , {
            headers: authHeader()
        })).data;
    } catch (error) {
        console.error('Error occurred in getCheckListByObservation', error);
        throw error;
    }
}



export const getAllVersionRecordDtoList = async (qmsDocTypeDto) => {
    try {
        return (await axios.post(`${API_URL}get-all-version-record-list`, qmsDocTypeDto, { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in getAllVersionRecordDtoList() ', error);
        throw error;
    }
}


export const getIqaDtoListForDahboard = async () => {
    
    try {
        return (await axios.post(`${API_URL}iqa-list-for-dashboard`,{} , {
            headers: authHeader()
        })).data;
    } catch (error) {
        console.error('Error occurred in getIqaDtoListForDahboard', error);
        throw error; 
    }
    
};


export const getAllActiveDwpRecordList = async () => {
    try {
        return (await axios.post(`${API_URL}dwp-revision-list-for-dashboard`,{} , {
            headers: authHeader()
        })).data;
    } catch (error) {
        console.error('Error occurred in getAllActiveDwpRecordList', error);
        throw error;
    }
}



export const getProjectListOfPrjEmps = async (imsFormRoleId, empId) => {
    
    try {
        return (await axios.post(`${API_URL}get-project-list-of-prj-emps/${imsFormRoleId}/${empId}`, [], { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in getProjectListOfPrjEmps', error);
        throw error; 
    }
    
};

export const getDivGroupListOfDivEmps = async (imsFormRoleId, empId) => {
    
    try {
        return (await axios.post(`${API_URL}get-div-group-list-of-div-emps/${imsFormRoleId}/${empId}`, [], { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in getDivGroupListOfDivEmps', error);
        throw error; 
    }
    
};

export const getDivisionListOfDivEmps = async (imsFormRoleId, empId) => {
    
    try {
        return (await axios.post(`${API_URL}get-division-list-of-div-emps/${imsFormRoleId}/${empId}`, [], { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in getDivisionsListOfDivEmps', error);
        throw error; 
    }
    
};



export const getDivisionListOfDH = async (imsFormRoleId, empId) => {
    
    try {
        return (await axios.post(`${API_URL}get-division-list-of-div-head/${imsFormRoleId}/${empId}`, [], { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in getDivisionsListOfDH', error);
        throw error; 
    }
    
};


export const getDivisionListOfGH = async (imsFormRoleId, empId) => {
    
    try {
        return (await axios.post(`${API_URL}get-division-list-of-group-head/${imsFormRoleId}/${empId}`, [], { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in getDivisionListOfGH', error);
        throw error; 
    }
    
};

export const getProjectListOfPrjDir = async (imsFormRoleId, empId) => {
    
    try {
        return (await axios.post(`${API_URL}get-project-list-of-prj-director/${imsFormRoleId}/${empId}`, [], { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in getProjectListOfPrjDir', error);
        throw error; 
    }
    
};




export const getAllActiveDivisionList = async () => {
    try {
      const response = await axios.get(
        `${API_URL}get-all-active-division-list`,
        { headers: authHeader() }
      );
      return response.data;
    } catch (error) {
      console.error('Error occurred in getAllActiveDivisionList:', error);
      throw error;
    }
  };




  export const getTrendNCAndObsList = async () => {
    try {
        return (await axios.post(`${API_URL}get-trend-nc-obs-list`,{} , {
            headers: authHeader()
        })).data;
    } catch (error) {
        console.error('Error occurred in getTrendNCAndObsList', error);
        throw error;
    }
}

