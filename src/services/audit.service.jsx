import axios from 'axios';
import { authHeader } from './auth.header';
import  config  from "../environment/config";

const API_URL=config.API_URL;



  
 export class AuditorDto{
    
    constructor(auditorId,isActive){
        this.auditorId=auditorId;
        this.isActive=isActive;
    }
};

export class AuditeeDto{
    
    constructor(empId,groupId,divisionId,projectId,headType,auditeeId){
        this.empId=empId;
        this.groupId=groupId;
        this.divisionId=divisionId;
        this.projectId=projectId;
        this.headType=headType;
        this.auditeeId=auditeeId;
    }

};

export const getAuditorDtoList = async () => {
    
    try {
        return (await axios.post(`${API_URL}audit-list`,{} , {
            headers: authHeader()
        })).data;
    } catch (error) {
        console.error('Error occurred in getAuditorDtoList', error);
        throw error; 
    }
    
};

export const getEmployee = async () => {
    
    try {
        return (await axios.post(`${API_URL}get-employee-list`,{} , {
            headers: authHeader()
        })).data;
    } catch (error) {
        console.error('Error occurred in getEmployee', error);
        throw error; 
    }
    
};

export const insertAditor = async (empIds) => {
    
    try {
        return (await axios.post(`${API_URL}insert-auditor-employees`,  empIds , {
            headers: authHeader()
        })).data;
    } catch (error) {
        console.error('Error occurred in insertAditor', error);
        throw error; 
    }
};

export const deleteAditor = async (AuditorId,isActive) => {
    try {
      const response = await axios.post(
          `${API_URL}auditor-inactive`,
          new AuditorDto(AuditorId,isActive),
         {headers: authHeader() }
      );
      return response.data;
  
    } catch (error) {
      console.error('Error occurred in deleteAditor:', error);
      throw error;
    }
  };

  export const getIqaDtoList = async () => {
    
    try {
        return (await axios.post(`${API_URL}iqa-list`,{} , {
            headers: authHeader()
        })).data;
    } catch (error) {
        console.error('Error occurred in getIqaDtoList', error);
        throw error; 
    }
    
};


export const insertIqa = async (values) => {
    
    try {
        return (await axios.post(`${API_URL}insert-iqa`, values, { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in insertIqa', error);
        throw error; 
    }
};

  export const getAuditeeDtoList = async () => {
    
    try {
        return (await axios.post(`${API_URL}auditee-list`,{} , {
            headers: authHeader()
        })).data;
    } catch (error) {
        console.error('Error occurred in getAuditeeDtoList', error);
        throw error; 
    }
};



export const getDivisionList = async () => {
    
    try {
        return (await axios.post(`${API_URL}get-division-list`,{} , {
            headers: authHeader()
        })).data;
    } catch (error) {
        console.error('Error occurred in getDivisionList', error);
        throw error; 
    }
    
};

export const getDivisionGroupList = async () => {
    
    try {
        return (await axios.post(`${API_URL}get-division-group-list`,{} , {
            headers: authHeader()
        })).data;
    } catch (error) {
        console.error('Error occurred in getDivisionGroupList', error);
        throw error; 
    }
    
};

export const getProjectList = async () => {
    
    try {
        return (await axios.post(`${API_URL}get-project-list`,{} , {
            headers: authHeader()
        })).data;
    } catch (error) {
        console.error('Error occurred in getProjectList', error);
        throw error; 
    }
    
};

export const insertAuditee = async (values) => {
    try {
      const response = await axios.post(
          `${API_URL}auditee-insert`,
            values,
         {headers: authHeader() }
      );
      return response.data;
  
    } catch (error) {
      console.error('Error occurred in insertAuditee:', error);
      throw error;
    }
  };

  export const deleteAuditee = async (auditeeId) => {
    try {
      const response = await axios.post(
        `${API_URL}auditee-inactive`,
        auditeeId,
       {headers: { 'Content-Type': 'text/plain', ...authHeader() } }
    );
    return response.data;
  
    } catch (error) {
      console.error('Error occurred in deleteAditor:', error);
      throw error;
    }
  };