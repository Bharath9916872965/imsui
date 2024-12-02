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

export class AuditRescheduleDto{
    constructor(auditScheduleDto,auditScheduleListDto){
        this.auditScheduleDto=auditScheduleDto;
        this.auditScheduleListDto=auditScheduleListDto;
    }
}

export const getAuditorDtoList = async () => {
    
    try {
        return (await axios.post(`${API_URL}auditor-list`,{} , {
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

  export const forwardSchedule = async (values)=>{
    try {
        return (await axios.post(`${API_URL}forward-schedule`,values,{headers : {'Content-Type': 'application/json', ...authHeader()}})).data;
    } catch (error) {
        console.error('Error occurred in forwardSchedule:', error);
        throw error;
    }
}

export const scheduleMailSend = async (values)=>{
    try {
        return (await axios.post(`${API_URL}schedule-mail-send`,values,{headers : {'Content-Type': 'application/json', ...authHeader()}})).data;
    } catch (error) {
        console.error('Error occurred in scheduleMailSend:', error);
        throw error;
    }
}

export const getTotalTeamMembersList = async ()=>{
    try {
        return (await axios.post(`${API_URL}get-total-team-members-list`,{},{headers : {'Content-Type': 'application/json', ...authHeader()}})).data;
    } catch (error) {
        console.error('Error occurred in getTotalTeamMembersList:', error);
        throw error;
    }
}

export const rescheduleMailSend = async (values)=>{
    try {
        return (await axios.post(`${API_URL}reschedule-mail-send`,values,{headers : {'Content-Type': 'application/json', ...authHeader()}})).data;
    } catch (error) {
        console.error('Error occurred in rescheduleMailSend:', error);
        throw error;
    }
}
  export const getAuditeeTeamDtoList = async () => {
    
    try {
        return (await axios.post(`${API_URL}audit-team-list`,{} , {
            headers: authHeader()
        })).data;
    } catch (error) {
        console.error('Error occurred in getAuditeeTeamDtoList', error);
        throw error; 
    }
    
};

export const insertAuditTeam = async (values) => {
    try {
      const response = await axios.post(
          `${API_URL}audit-team-insert`,
            values,
         {headers: authHeader() }
      );
      return response.data;
  
    } catch (error) {
      console.error('Error occurred in insertAuditTeam:', error);
      throw error;
    }
  };

  export const getAuditorIsActiveList = async () => {
    
    try {
        return (await axios.post(`${API_URL}auditor-isactive-list`,{} , {
            headers: authHeader()
        })).data;
    } catch (error) {
        console.error('Error occurred in getAuditorIsActiveList', error);
        throw error; 
    }
    
};

export const getTeamMemberIsActiveList = async () => {
    
    try {
        return (await axios.post(`${API_URL}team-member-isactive-list`,{} , {
            headers: authHeader()
        })).data;
    } catch (error) {
        console.error('Error occurred in getTeamMemberIsActiveList', error);
        throw error; 
    }
    
};

export const getAuditTeamMemberList = async () => {
    
    try {
        return (await axios.post(`${API_URL}audit-team-member-list`,{} , {
            headers: authHeader()
        })).data;
    } catch (error) {
        console.error('Error occurred in getAuditTeamMemberList', error);
        throw error; 
    }
    
};

export const getScheduleApprovalList = async ()=>{
    try {
        return (await axios.post(`${API_URL}schedule-approval-list`,{},{headers : {'Content-Type': 'application/json', ...authHeader()}})).data;
    } catch (error) {
        console.error('Error occurred in getScheduleApprovalList:', error);
        throw error;
    }
}


export const approveSchedule = async (values)=>{
    try {
        return (await axios.post(`${API_URL}approve-schedule`,values,{headers : {'Content-Type': 'application/json', ...authHeader()}})).data;
    } catch (error) {
        console.error('Error occurred in approveSchedule:', error);
        throw error;
    }
}

export const returnSchedule = async (values)=>{
    try {
        return (await axios.post(`${API_URL}return-schedule`,values,{headers : {'Content-Type': 'application/json', ...authHeader()}})).data;
    } catch (error) {
        console.error('Error occurred in returnSchedule:', error);
        throw error;
    }
}

export const getScheduleRemarks = async ()=>{
    try {
        return (await axios.post(`${API_URL}schedule-remarks`,{},{headers : {'Content-Type': 'application/json', ...authHeader()}})).data;
    } catch (error) {
        console.error('Error occurred in getScheduleRemarks:', error);
        throw error;
    }
}

export const scheduleTran = async (scheduleId)=>{
    try {
        return (await axios.post(`${API_URL}schedule-tran`,scheduleId,{headers : {'Content-Type': 'text/plain', ...authHeader()}})).data;
    } catch (error) {
        console.error('Error occurred in scheduleTran:', error);
        throw error;
    }
}

