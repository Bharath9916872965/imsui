import axios from 'axios';
import { authHeader } from './auth.header';
import  config  from "../environment/config";

const API_URL=config.API_URL;


 export class AuditorDto{
    
    constructor(auditorId,isActive){
        this.auditorId=auditorId;
        this.isActive=isActive;
    }
}

export const getAuditorDtoList = async () => {
    
    try {
        return (await axios.post(`${API_URL}audit-list`,{} , {
            headers: authHeader()
        })).data;
    } catch (error) {
        console.error('Error occurred in getAuditorDtoList', error);
        throw error; 
    }
    
}

export const getEmployee = async () => {
    
    try {
        return (await axios.post(`${API_URL}get-employee-list`,{} , {
            headers: authHeader()
        })).data;
    } catch (error) {
        console.error('Error occurred in getEmployee', error);
        throw error; 
    }
    
}

export const insertAditor = async (empIds) => {
    
    try {
        return (await axios.post(`${API_URL}insert-auditor-employees`,  empIds , {
            headers: authHeader()
        })).data;
    } catch (error) {
        console.error('Error occurred in insertAditor', error);
        throw error; 
    }
}

export const deleteAditor = async (AuditorId,isActive) => {
    try {
      const response = await axios.post(
          `${API_URL}auditor-delete`,
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
    
}


export const insertIqa = async (values) => {
    
    try {
        return (await axios.post(`${API_URL}insert-iqa`, values, { headers: { 'Content-Type': 'application/json', ...authHeader() } })).data;
    } catch (error) {
        console.error('Error occurred in insertIqa', error);
        throw error; 
    }
}


export const getIqaById = async (iqaId) => {
    try {
  
      const response = await axios.post(
          `${API_URL}iqa-edit-data`,
          { iqaDataId: iqaId },
         {headers: authHeader() }
      );
      return response.data;
  
    } catch (error) {
      console.error('Error occurred in getIqaById:', error);
      throw error;
    }
  };

  export const getScheduleList = async ()=>{
    try {
        return (await axios.post(`${API_URL}schedule-list`,{},{headers : {'Content-Type': 'application/json', ...authHeader()}})).data;
    } catch (error) {
        console.error('Error occurred in getScheduleList:', error);
        throw error;
    }
}

export const getTeamList = async ()=>{
    try {
        return (await axios.post(`${API_URL}get-team-list`,{},{headers : {'Content-Type': 'application/json', ...authHeader()}})).data;
    } catch (error) {
        console.error('Error occurred in getTeamList:', error);
        throw error;
    }
}

export const addSchedule = async (values)=>{
    try {
        return (await axios.post(`${API_URL}insert-audit-schedule`,values,{headers : {'Content-Type': 'application/json', ...authHeader()}})).data;
    } catch (error) {
        console.error('Error occurred in addSchedule:', error);
        throw error;
    }
}

export const editScheduleSubmit = async (values)=>{
    try {
        return (await axios.post(`${API_URL}edit-audit-schedule`,values,{headers : {'Content-Type': 'application/json', ...authHeader()}})).data;
    } catch (error) {
        console.error('Error occurred in editScheduleSubmit:', error);
        throw error;
    }
}

export const reScheduleSubmit = async (values)=>{
    try {
        return (await axios.post(`${API_URL}insert-audit-reschedule`,values,{headers : {'Content-Type': 'application/json', ...authHeader()}})).data;
    } catch (error) {
        console.error('Error occurred in reScheduleSubmit:', error);
        throw error;
    }
}



